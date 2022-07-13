import { DynamoDB } from "aws-sdk";
import { DocumentClient } from "aws-sdk/lib/dynamodb/document_client";
import AWS from "aws-sdk";

export abstract class TriggerEnvironment {
  static local() {
    return new _Local();
  }

  static prod() {
    return new _Prod();
  }

  static fromEnvironmentVariable() {
    console.log(`processenv.environment: ${process.env.ENVIRONMENT ?? ""}`);
    return process.env.ENVIRONMENT !== "local"
      ? TriggerEnvironment.prod()
      : TriggerEnvironment.local();
  }

  abstract createDynamoDb(): DynamoDB;

  abstract createDynamoDbDocumentClient(): DocumentClient;

  abstract bookTableName(): string;

  abstract isProd(): boolean;
}

class _Local extends TriggerEnvironment {
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

  isProd(): boolean {
    return false;
  }

  private _dynamoDBOption() {
    return {
      region: "localhost",
      endpoint: `http://localhost:${this._localDynamodbPort}`,
    };
  }
}

class _Prod extends TriggerEnvironment {
  private readonly _bookTableName: string;
  private readonly _dbRegion: string;

  constructor() {
    super();
    if (process.env.BOOK_TABLE_NAME === undefined) {
      throw new Error("環境変数エラー: テーブル名");
    }
    if (process.env.AWS_REGION === undefined) {
      throw new Error("環境変数エラー: リージョン");
    }
    this._bookTableName = process.env.BOOK_TABLE_NAME;
    // 厳密にはDBとLambdaが動いているリージョンは違うかもしれない。現状一緒なのでとりあえずAWS_REGIONからとる
    this._dbRegion = process.env.AWS_REGION;
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

  isProd(): boolean {
    return true;
  }

  _dynamoDbOption() {
    return { region: this._dbRegion };
  }
}
