import express, { Router } from "express";
import { BookStore } from "../dependency/book-store";
import { Session } from "../session/session";
import { Environment } from "../../util/environment";

import { Book as WriteModelBook  } from "../../domain/writemodel/book";
import { Book as ReadModelBook } from "../../domain/readmodel/book";
import { Id } from "../../domain/writemodel/id";

export class BookRouter {
  public static create(store: BookStore, environment: Environment): Router {
    const router = express.Router();

    // 自分の本を全件取得
    router.get("/", async (req, res) => {
      const { userId } = Session.of(req, res, environment).user;
      const books = await store.getBooksOfUser(userId);
      res.json({
        books: books.map((b) => ({
          id: b.id,
          name: b.name,
          memo: b.memo,
          status: b.status,
          goodByed: b.goodByed,
          createdAt: b.createdAt,
        })),
      });
    });

    // 書籍を1件追加
    router.post("/", async (req, res): Promise<void> => {
      const bookName = req.body.name;
      if (!bookName) {
        res.sendStatus(400);
        return;
      }

      const { userId } = Session.of(req, res, environment).user;
      const book = WriteModelBook.stack(Id.of(userId), bookName);
      await store.addBookOfUser(book);
      console.log("book was created...book =>", JSON.stringify(book));
      res.status(201).send(ReadModelBook.fromWriteModel(book))
    });

    // 書籍を1件削除
    router.delete('/:bookId', async (req, res): Promise<void> => {
      const { userId } = Session.of(req, res, environment).user
      const bookId = req.params.bookId

      if (!bookId) {
        res.sendStatus(400)
        return
      }

      await store.deleteBookOfUser(userId, bookId)
      res.sendStatus(204)
    })

    // 書籍を1件更新
    // TODO: 書籍更新 API がステータス以外も更新できるようにする
    router.patch('/:bookId', async (req, res): Promise<void> => {
      const { userId } = Session.of(req, res, environment).user
      const bookId = req.params.bookId
      const bookStatus = req.body.status

      if (!bookId || !bookStatus) {
        res.sendStatus(400)
        return
      }

      await store.updateBookStatus(userId, bookId, bookStatus)
      res.sendStatus(200)
    })

    return router;
  }
}
