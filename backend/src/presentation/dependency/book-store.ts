import { Book as BookRead } from "../../domain/readmodel/book";
import { Book as BookWrite } from "../../domain/writemodel/book";

export interface BookStore {
  getBooksOfUser(userId: string): Promise<BookRead[]>;

  addBookOfUser(book: BookWrite): Promise<any>;

  getBookRaw(userId: string, bookId: string): Promise<any>;

  getUserProfileRaw(userId: string): Promise<any>;

  getActiveTasksOfUserRaw(userId: string): Promise<any>;

  getTaskOfUserRaw(userId: string, taskId: string): Promise<any>;

  getTasksOfBookRaw(bookId: string): Promise<any>;

  updateBookStatus(
    userId: string,
    bookId: string,
    status: string
  ): Promise<void>;
}
