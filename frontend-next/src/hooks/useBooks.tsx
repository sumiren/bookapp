import { useRouter } from 'next/router'
import useSWR, { useSWRConfig } from 'swr'
import axios from 'axios'
import { Book, BookStatus } from '../../../backend/src/domain/readmodel/book'
import { bffUrl } from 'lib/bffClient'
import { sortBooks } from 'utilities/books'
import { notifyAdded, notifyDeleted } from 'utilities/notify'
import { useHandleHttpError } from 'hooks/useHandleHttpError'

export const useBooks = () => {
  const router = useRouter()
  const { mutate } = useSWRConfig()
  const { handleHttpError } = useHandleHttpError()

  // 全ての書籍を取得する
  const fetchAllBooks = async (): Promise<Book[] | void> => {
    try {
      const response = await axios.get(bffUrl('/books'), {
        withCredentials: true
      })
      return sortBooks(response.data.books)
    } catch (error) {
      await handleHttpError(error)
    }
  }
  const { data, error } = useSWR('/books', fetchAllBooks)

  // 書籍を追加する
  const addBook = async (bookName: string) => {
    try {
      await mutate('/books', async (allBooks: Book[]): Promise<Book[]> => {
        const response = await axios.post(
          bffUrl('/books'),
          { name: bookName },
          { withCredentials: true }
        )
        const newBook: Book = response.data
        return [newBook, ...allBooks]
      }, { revalidate: false })
      notifyAdded(bookName)
    } catch (error) {
      await handleHttpError(error)
    }
  }

  // 書籍のステータスを変更する
  const updateBookStatus = async (book: Book, newStatus: BookStatus) => {
    try {
      await mutate('/books', async (allBooks: Book[]): Promise<Book[]> => {
        await axios.patch(
          bffUrl(`/books/${book.id}`),
          { status: newStatus },
          { withCredentials: true }
        )
        const copiedAllBooks = [...allBooks]
        const targetBookIndex = copiedAllBooks.findIndex(_book => _book.id === book.id)
        const newBook = { ...book, status: newStatus }
        copiedAllBooks.splice(targetBookIndex, 1, newBook)
        return sortBooks(copiedAllBooks)
      }, { revalidate: false })
    } catch (error) {
      await handleHttpError(error)
    }
  }

  // 書籍を削除する
  const deleteBook = async (book: Book) => {
    try {
      await mutate('/books', async (allBooks: Book[]): Promise<Book[]> => {
        await axios.delete(
          bffUrl(`/books/${book.id}`),
          { withCredentials: true }
        )
        const copiedAllBooks = [...allBooks]
        return copiedAllBooks.filter(_book => _book.id !== book.id)
      }, { revalidate: false })
      await router.push('/book')
      notifyDeleted(book.name)
    } catch (error) {
      await handleHttpError(error)
    }
  }

  return {
    data,
    isError: error,
    isLoading: !error && !data,
    addBook,
    updateBookStatus,
    deleteBook
  }
}
