import type { ReactElement } from 'react'
import { KeyboardEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { Badge, Button, CloseButton, Kbd, Loader, Modal, Table, Tabs, TextInput, useMantineTheme } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconPlus, IconSearch } from '@tabler/icons'
import type { NextPageWithLayout } from 'pages/_app'
import { DefaultLayout } from 'layouts/default'
import { Book } from '../../../backend/src/domain/readmodel/book'
import { useBooks } from 'hooks/useBooks'
import BookStatusBadge from 'components/BookStatusBadge'
import BookActionButton from 'components/BookActionButton'

const BookPage: NextPageWithLayout = () => {
  const theme = useMantineTheme()
  const form = useForm({
    initialValues: {
      bookName: '',
      searchText: ''
    }
  })

  const {
    data,
    isError,
    isLoading,
    addBook
  } = useBooks()

  // 検索に使用する文字列
  const searchText = form.getInputProps('searchText')
  const clearSearchText = () => {
    form.setFieldValue('searchText', '')
  }

  // フィルタされた全ての書籍
  const [filteredAllBooks, setFilteredAllBooks] = useState<Book[]>([])
  useEffect(() => {
    if (isLoading || isError || !data) return
    if (searchText.value.length <= 0) {
      setFilteredAllBooks(data)
      return
    }
    setFilteredAllBooks(data.filter((book: Book) => book.name.includes(searchText.value)))
  }, [data, searchText.value])

  // つんどくの書籍一覧
  const [tsundokuBooks, setTsundokuBooks] = useState<Book[]>([])
  useEffect(() => {
    setTsundokuBooks(filteredAllBooks.filter(book => book.status === 'tsundoku'))
  }, [filteredAllBooks])

  // 読みかけの書籍一覧
  const [doingBooks, setDoingBooks] = useState<Book[]>([])
  useEffect(() => {
    setDoingBooks(filteredAllBooks.filter(book => book.status === 'doing'))
  }, [filteredAllBooks])

  // 読了の書籍一覧
  const [doneBooks, setDoneBooks] = useState<Book[]>([])
  useEffect(() => {
    setDoneBooks(filteredAllBooks.filter(book => book.status === 'done'))
  }, [filteredAllBooks])

  // 書籍追加モーダルの表示・非表示を制御
  const [modalOpened, setModalOpened] = useState(false)
  const openModal = () => {
    setModalOpened(true)
  }

  const closeModal = () => {
    setModalOpened(false)
    // モーダルが閉じられてから (ユーザの目に見えないときに) 入力された書籍名を空にする
    setTimeout(() => {
      form.setFieldValue('bookName', '')
    }, 300)
  }

  // 書籍を追加する
  const handleAddBook = async () => {
    const bookName = form.getInputProps('bookName').value
    await addBook(bookName)
    closeModal()
  }

  // キーボードイベントで書籍を追加する
  const handleAddBookWithKeyboard = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && event.metaKey) {
      await handleAddBook()
    }
  }

  interface Tab {
    key: string,
    label: string,
    books: Book[]
  }

  const tabs: Tab[] = [
    { key: '1', label: 'All', books: filteredAllBooks },
    { key: '2', label: 'Tsundoku', books: tsundokuBooks },
    { key: '3', label: 'Doing', books: doingBooks },
    { key: '4', label: 'Done', books: doneBooks }
  ]

  if (isLoading) {
    return (
      <div className="py-10 flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center flex-wrap gap-x-6 gap-y-4 mb-6">
        {/* 書籍追加ボタン */}
        <Button
          size="md"
          leftIcon={<IconPlus size={18} />}
          onClick={openModal}
        >
          Add Book
        </Button>
        {/* /書籍追加ボタン */}

        {/* 書籍検索フィールド */}
        <TextInput
          placeholder="Search"
          size="md"
          icon={<IconSearch size={16} />}
          rightSection={
            <CloseButton onClick={clearSearchText} />
          }
          {...form.getInputProps('searchText')}
          className="w-96"
        />
        {/* /書籍検索フィールド */}
      </div>

      <Tabs defaultValue={tabs[0].key} variant="default">
        {/* タブ切り替えボタン */}
        <Tabs.List>
          {tabs.map(tab =>
            <Tabs.Tab
              value={tab.key}
              key={tab.key}
              className="pt-5 pb-3 sm:py-3"
              rightSection={
                <Badge
                  variant="filled"
                  size="xs"
                  sx={{ width: 18, height: 18, pointerEvents: 'none' }}
                  className="p-0"
                >
                  {tab.books.length}
                </Badge>
              }
            >
              {tab.label}
            </Tabs.Tab>
          )}
        </Tabs.List>
        {/* /タブ切り替えボタン */}

        {/* タブコンテンツ */}
        {tabs.map(tab =>
          <Tabs.Panel value={tab.key} key={tab.key}>
            <Table
              horizontalSpacing="sm"
              verticalSpacing="sm"
              className="table-auto"
              highlightOnHover
              striped
            >
              <tbody>
              {tab.books.map((book) =>
                <tr key={book.id}>
                  <td className="!p-0">
                    <Link
                      href={`/book/${book.id}`}
                      legacyBehavior={false}
                      style={{ minHeight: 60, cursor: 'pointer' }}
                      className="flex items-center p-3"
                    >
                      <div className="flex justify-between items-center gap-6 w-full">
                        <div className="flex items-center flex-wrap sm:flex-nowrap gap-2">
                          <BookStatusBadge status={book.status} style={{ cursor: 'pointer' }} className="mr-2" />
                          <span>{book.name}</span>
                        </div>

                        <BookActionButton book={book} className="hidden sm:block" />
                      </div>
                    </Link>
                  </td>
                </tr>
              )}
              </tbody>
            </Table>
          </Tabs.Panel>
        )}
        {/* /タブコンテンツ */}
      </Tabs>

      {/* 書籍追加モーダル */}
      <Modal
        opened={modalOpened}
        overlayColor={theme.colors.gray[2]}
        overlayOpacity={0.55}
        overlayBlur={3}
        withCloseButton={false}
        onClose={closeModal}
      >
        <TextInput
          placeholder="Book Name"
          data-autofocus
          size="md"
          rightSectionWidth={90}
          rightSection={<Kbd>⌘ + enter</Kbd>}
          {...form.getInputProps('bookName')}
          className="mb-5"
          onKeyDown={handleAddBookWithKeyboard}
        />

        <Button
          disabled={form.getInputProps('bookName').value.length <= 0}
          className="px-7 mr-4"
          onClick={handleAddBook}
        >
          Add
        </Button>

        <Button
          variant="default"
          onClick={closeModal}
        >
          Cancel
        </Button>
      </Modal>
      {/* /書籍追加モーダル */}
    </>
  )
}

BookPage.getLayout = (page: ReactElement) => {
  return (
    <DefaultLayout>
      {page}
    </DefaultLayout>
  )
}

export default BookPage
