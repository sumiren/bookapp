import { v4 as uuid } from "uuid";
import { DocumentClient } from "aws-sdk/lib/dynamodb/document_client";
import { DynamoDB } from "aws-sdk";
import { BookStore } from "../presentation/dependency/book-store";
import { Book as BookRead, BookStatus } from "../domain/readmodel/book";
import { Book as BookWrite } from "../domain/writemodel/book";
import { DynamoUtil } from "./dynamo-util";

export class DynamoBookStore implements BookStore {
  private _configuration: BookStoreConfiguration;

  private _dynamoDb: DynamoDB;

  private _dynamoDbDocumentClient: DocumentClient;

  private constructor(configuration: BookStoreConfiguration) {
    this._configuration = configuration;
    this._dynamoDb = configuration.createDynamoDb();
    this._dynamoDbDocumentClient = configuration.createDynamoDbDocumentClient();
  }

  public static create(configuration: BookStoreConfiguration) {
    return new DynamoBookStore(configuration);
  }

  async getBooksOfUser(userId: string): Promise<BookRead[]> {
    const params = {
      TableName: this._configuration.bookTableName(),
      KeyConditionExpression: "PK = :userId and begins_with(SK,:books)",
      ExpressionAttributeValues: {
        ":userId": `USER#${userId}`,
        ":books": "BOOK#",
      },
    };

    const result = await this._dynamoDbDocumentClient.query(params).promise();

    return result.Items!.map(
      (item: any) =>
        new BookRead(
          DynamoUtil.rmPrefix(item.SK),
          item.BookName,
          item.BookMemo,
          item.GoodByed,
          DynamoBookStore.rmBookStatusPrefix(item.BookStatus) as BookStatus,
          item.CreatedAt
        )
    );
  }

  async addBookOfUser(book: BookWrite): Promise<any> {
    const bookId = uuid();
    const now = new Date();
    const params = {
      TableName: this._configuration.bookTableName(),
      Item: {
        PK: {
          S: `USER#${book.userId.val}`,
        },
        SK: {
          S: `BOOK#${bookId}`,
        },
        BookName: {
          S: book.name,
        },
        BookStatus: {
          S: DynamoBookStore.addBookStatusPrefix(book, book.statusVal),
        },
        GoodByed: {
          BOOL: book.goodByed,
        },
        CreatedAt: {
          S: now.toLocaleString(),
        },
        UpdatedAt: {
          S: now.toLocaleString(),
        },
      },
      ReturnConsumedCapacity: "TOTAL",
    };
    if (book.memo != null) {
      params.Item["BookMemo"]["S"] = book.memo;
    }

    const result = await this._dynamoDb.putItem(params).promise();
    console.log(`create result: ${JSON.stringify(result)}`);

    book.notifyAddedToStore(bookId, now);
  }

  async deleteBookOfUser(userId: string, bookId: string): Promise<any> {
    const params = {
      TableName: this._configuration.bookTableName(),
      Key: {
        PK: `USER#${userId}`,
        SK: `BOOK#${bookId}`
      }
    }
    await this._dynamoDbDocumentClient.delete(params).promise()
  }

  async getBookRaw(userId: string, bookId: string) {
    const params = {
      TableName: this._configuration.bookTableName(),
      KeyConditionExpression: "PK = :userId and SK = :bookId",
      ExpressionAttributeValues: {
        ":userId": `USER#${userId}`,
        ":bookId": `BOOK#${bookId}`,
      },
    };

    return await this._configuration
      .createDynamoDbDocumentClient()
      .query(params)
      .promise();
  }

  async getUserProfileRaw(userId: string) {
    const params = {
      TableName: this._configuration.bookTableName(),
      KeyConditionExpression: "PK = :userId and SK = :profile",
      ExpressionAttributeValues: {
        ":userId": `USER#${userId}`,
        ":profile": `#PROFILE#${userId}`,
      },
    };

    return await this._configuration
      .createDynamoDbDocumentClient()
      .query(params)
      .promise();
    // return res.Items.map((i: any) => BookModel.Book.existing(i));
  }

  async getActiveTasksOfUserRaw(userId: string) {
    const params = {
      TableName: this._configuration.bookTableName(),
      IndexName: "taskStatus_index",
      KeyConditionExpression:
        "PK = :userId AND begins_with(TaskStatus, :active)",
      ExpressionAttributeValues: {
        ":userId": `USER#${userId}`,
        ":active": "ACTIVE_",
      },
    };

    return await this._configuration
      .createDynamoDbDocumentClient()
      .query(params)
      .promise();
    // return res.Items.map((i: any) => BookModel.Book.existing(i));
  }

  async getTaskOfUserRaw(userId: string, taskId: string) {
    const params = {
      TableName: this._configuration.bookTableName(),
      KeyConditionExpression: "PK = :userId AND SK = :taskId",
      ExpressionAttributeValues: {
        ":userId": `USER#${userId}`,
        ":taskId": `TASK#${taskId}`,
      },
    };

    return await this._configuration
      .createDynamoDbDocumentClient()
      .query(params)
      .promise();
  }

  // TODO: bookごとひいて構造化して返したい
  async getTasksOfBookRaw(bookId: string): Promise<any> {
    const params = {
      TableName: this._configuration.bookTableName(),
      IndexName: "bookId_index",
      KeyConditionExpression: "BookId = :bookId AND begins_with(SK,:tasks)",
      ExpressionAttributeValues: {
        ":bookId": bookId,
        ":tasks": "TASK#",
      },
    };

    return await this._configuration
      .createDynamoDbDocumentClient()
      .query(params)
      .promise();
  }

  async updateBookStatus(userId: string, bookId: string, status: BookStatus) {
    const params = {
      TableName: this._configuration.bookTableName(),
      Key: {
        PK: `USER#${userId}`,
        SK: `BOOK#${bookId}`
      },
      ExpressionAttributeValues: {
        ':newStatus': status
      },
      UpdateExpression: 'SET BookStatus = :newStatus'
    }
    await this._dynamoDbDocumentClient.update(params).promise()
  }

  private static rmBookStatusPrefix(prefixedStatus: string): string {
    return prefixedStatus.replace("INACTIVE_", "").replace("ACTIVE_", "");
  }

  private static addBookStatusPrefix(
    targetBook: BookWrite,
    rawStatus: string
  ): string {
    if (targetBook.isActive) {
      return `ACTIVE_${rawStatus}`;
    }
    return `INACTIVE_${rawStatus}`;
  }
}

export interface BookStoreConfiguration {
  createDynamoDb(): DynamoDB;
  createDynamoDbDocumentClient(): DocumentClient;
  bookTableName(): string;
}
