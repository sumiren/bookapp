export class BookStatus {
  private readonly _val: BookStatusValue;

  private constructor(val: BookStatusValue) {
    this._val = val;
  }

  static initial() {
    return new BookStatus("tsundoku");
  }

  static existing(val: string) {
    if (isBookStatusValue(val)) {
      return new BookStatus(val);
    }
    throw new Error(`invalid status value: ${val}`);
  }

  get val() {
    return this._val;
  }

  get isTsundoku() {
    return this._val == "tsundoku";
  }

  get isDoing() {
    return this._val == "doing";
  }

  get isDone() {
    return this._val === "done";
  }
}

type BookStatusValue = "tsundoku" | "doing" | "done";
const isBookStatusValue = (test: string): test is BookStatusValue =>
  test == "tsundoku" || test == "doing" || test == "done";
