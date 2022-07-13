import { DynamoDB } from "aws-sdk";
import { DocumentClient } from "aws-sdk/lib/dynamodb/document_client";
import { Auth } from "../infra/auth";

import AWS from "aws-sdk";

export abstract class Environment {
  static local() {
    if (process.env.AWS_PROFILE === undefined) {
      throw new Error("環境変数エラー：AWS_PROFILE");
    }
    return new _Local();
  }

  static prod() {
    return new _Prod();
  }

  static fromEnvironmentVariable() {
    console.log(`processenv.environment: ${process.env.ENVIRONMENT!}`);
    return process.env.ENVIRONMENT !== "local" ? this.prod() : this.local();
  }

  abstract createDynamoDb(): DynamoDB;

  abstract createDynamoDbDocumentClient(): DocumentClient;

  abstract getAuth(): Auth;

  abstract bookTableName(): string;

  abstract sessionTableName(): string;

  abstract sessionSecret(): string;

  abstract cookieSecure(): boolean;

  abstract firebaseServiceAccountKey(): string;

  abstract isProd(): boolean;
}

class _Local extends Environment {
  private readonly _localDynamodbPort: string;

  constructor() {
    super();
    this._localDynamodbPort = process.env.local_dynamodb_port || "8000";
  }

  createDynamoDb() {
    return new AWS.DynamoDB(this._dynamoDBOption());
  }

  createDynamoDbDocumentClient() {
    return new AWS.DynamoDB.DocumentClient(this._dynamoDBOption());
  }

  bookTableName() {
    return "book";
  }

  sessionTableName() {
    return "session";
  }

  sessionSecret(): string {
    return "secret";
  }

  cookieSecure = () => false;

  firebaseServiceAccountKey(): string {
    throw new Error("local environment has no firebase service account key");
  }

  isProd(): boolean {
    return false;
  }

  private _dynamoDBOption() {
    return {
      region: "localhost",
      endpoint: `http://localhost:${this._localDynamodbPort}`,
    };
  }

  getAuth(): Auth {
    return Auth.dev();
  }
}

class _Prod extends Environment {
  private readonly _bookTableName: string;
  private readonly _sessionTableName: string;
  private readonly _sessionSecret: string;
  private readonly _dbRegion: string;
  private readonly _firebaseServiceAccountKey: string;

  constructor() {
    super();
    if (
      process.env.BOOK_TABLE_NAME === undefined ||
      process.env.SESSION_TABLE_NAME === undefined
    ) {
      throw new Error("環境変数エラー: テーブル名");
    }
    if (process.env.AWS_REGION === undefined) {
      throw new Error("環境変数エラー: リージョン");
    }
    if (process.env.SESSION_SECRET === undefined) {
      throw new Error("環境変数エラー: セッションシークレット");
    }
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY === undefined) {
      throw new Error("環境変数エラー： Firebase サービスアカウントキー");
    }
    this._bookTableName = process.env.BOOK_TABLE_NAME;
    this._sessionTableName = process.env.SESSION_TABLE_NAME;
    // 厳密にはDBとLambdaが動いているリージョンは違うかもしれない。現状一緒なのでとりあえずAWS_REGIONからとる
    this._dbRegion = process.env.AWS_REGION;
    this._sessionSecret = process.env.SESSION_SECRET;
    this._firebaseServiceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  }

  createDynamoDb() {
    return new AWS.DynamoDB(this._dynamoDbOption());
  }

  createDynamoDbDocumentClient() {
    return new AWS.DynamoDB.DocumentClient(this._dynamoDbOption());
  }

  bookTableName() {
    return this._bookTableName;
  }

  sessionTableName() {
    return this._sessionTableName;
  }

  sessionSecret(): string {
    return this._sessionSecret;
  }

  cookieSecure = () => true;

  firebaseServiceAccountKey(): string {
    return this._firebaseServiceAccountKey;
  }

  isProd(): boolean {
    return true;
  }

  getAuth(): Auth {
    return Auth.prod(this);
  }

  _dynamoDbOption() {
    return { region: this._dbRegion };
  }
}
