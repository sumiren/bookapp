import { Id } from "./id";
import { BookStatus } from "./book-status";

export class Book {
  private readonly _id: Id;

  private readonly _userId: Id;

  private _name: string;

  private _memo: string | null;

  private _goodByed: boolean;

  private _status: BookStatus;

  private _createdAt: Date | null;

  private _updatedAt: Date | null;

  private constructor(
    id: Id,
    userId: Id,
    name: string,
    memo: string | null,
    goodByed: boolean,
    status: BookStatus,
    createdAt: Date | null = null,
    updatedAt: Date | null = null
  ) {
    this._id = id;
    this._userId = userId;
    this._name = name;
    this._memo = memo;
    this._goodByed = goodByed;
    this._status = status;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  static stack(userId: Id, bookName: string) {
    return new Book(
      Id.delayed(),
      userId,
      bookName,
      null,
      false,
      BookStatus.initial(),
      null,
      null
    );
  }

  static existing(
    id: Id,
    userId: Id,
    name: string,
    memo: string | null,
    goodByed: boolean,
    status: BookStatus,
    createdAt: Date,
    updatedAt: Date
  ) {
    return new Book(
      id,
      userId,
      name,
      memo,
      goodByed,
      status,
      createdAt,
      updatedAt
    );
  }

  static calculateStatusWhenTaskUpdated(taskStatuses: string[]) {
    // If no doing or done tasks
    // -> status is tsundoku
    // If any doing tasks
    // -> status is active
    // If no doing and any done tasks
    // -> bookshelf
    // GoodByedされている本は、データソース上のステータスフィールドを無視する
    // そのため、ここでは意識しない
    if (taskStatuses.some((s) => s === "Doing")) {
      return "ACTIVE_Doing";
    }
    if (taskStatuses.some((s) => s === "NotYet") || taskStatuses.length === 0) {
      return "ACTIVE_Tsundoku";
    }
    if (taskStatuses.every((s) => s === "Done")) {
      return "INACTIVE_Done";
    }
    throw new Error("unexpected status pattern");
  }

  notifyAddedToStore(bookId: string, createdAndUpdatedAt: Date) {
    if (this._createdAt != null || this._updatedAt != null) {
      throw new Error("book is already persisted");
    }
    this.id.assign(bookId);
    this._createdAt = createdAndUpdatedAt;
    this._updatedAt = createdAndUpdatedAt;
  }

  notifyUpdatedInStore(updatedAt: Date) {
    if (this._createdAt == null || this._updatedAt == null) {
      throw new Error("book is not yet persisted");
    }
    this._updatedAt = updatedAt;
  }

  get id(): Id {
    return this._id;
  }

  get userId(): Id {
    return this._userId;
  }

  get name(): string {
    return this._name;
  }

  get memo(): string | null {
    return this._memo;
  }

  get goodByed(): boolean {
    return this._goodByed;
  }

  get isActive() {
    return this._status.isTsundoku || this._status.isDoing;
  }

  get statusVal() {
    return this._status.val;
  }

  get createdAt(): Date | null {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }
}
