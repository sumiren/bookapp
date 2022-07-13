export class Book {
  id: string;

  name: string;

  memo: string | undefined;

  goodByed: boolean;

  status: BookStatus;

  constructor(
    id: string,
    name: string,
    memo: string,
    goodByed: boolean,
    status: BookStatus
  ) {
    this.id = id;
    this.name = name;
    this.memo = memo;
    this.goodByed = goodByed;
    this.status = status;
  }
}

export type BookStatus = "tsundoku" | "doing" | "done";
