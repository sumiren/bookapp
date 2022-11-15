import { Book } from '../../../backend/src/domain/readmodel/book'

// 書籍をソートする
export const sortBooks = (books: Book[]): Book[] => {
  // 日付の降順でソート
  const copiedBooks = [...books]
  copiedBooks.sort((a: Book, b: Book) => {
    const aDate = new Date(a.createdAt!)
    const bDate = new Date(b.createdAt!)
    if (aDate > bDate) return -1
    if (aDate < bDate) return 1
    return 0
  })
  // 未読、途中、読了の順番でソート
  copiedBooks.sort((a: Book, b: Book) => {
    if (a.status === b.status) return 0
    if (a.status === 'tsundoku') return -1
    if (a.status === 'doing' && b.status === 'done') return -1
    return 1
  })
  return copiedBooks
}
