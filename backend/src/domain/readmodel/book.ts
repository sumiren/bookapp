import { Book as WriteModelBook } from '../writemodel/book'

export class Book {
  id: string;

  name: string;

  memo: string | null;

  goodByed: boolean;

  status: BookStatus;

  createdAt: Date | null;

  static fromWriteModel(writeModelBook: WriteModelBook): Book {
    return new Book(
      writeModelBook.id.val,
      writeModelBook.name,
      writeModelBook.memo,
      writeModelBook.goodByed,
      writeModelBook.statusVal,
      writeModelBook.createdAt
    )
  }

  constructor(
    id: string,
    name: string,
    memo: string | null,
    goodByed: boolean,
    status: BookStatus,
    createdAt: Date | null
  ) {
    this.id = id;
    this.name = name;
    this.memo = memo;
    this.goodByed = goodByed;
    this.status = status;
    this.createdAt = createdAt;
  }
}

export type BookStatus = "tsundoku" | "doing" | "done";
