import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { ActionIcon, Badge, Button, Group, Loader, Menu, Title } from '@mantine/core'
import { NextLink } from '@mantine/next'
import { IconArrowBackUp, IconDotsVertical, IconTrash } from '@tabler/icons'
import { format } from 'date-fns'
import { Book } from '../../../../backend/src/domain/readmodel/book'
import type { NextPageWithLayout } from 'pages/_app'
import { useBooks } from 'hooks/useBooks'
import { DefaultLayout } from 'layouts/default'
import BookStatusBadge from 'components/BookStatusBadge'
import BookActionButton from 'components/BookActionButton'

// Date を画面表示用の文字列に変換する
const formatDate = (date: Date): string => {
  return format(date, 'yyyy年M月d日')
}

const Bid: NextPageWithLayout = () => {
  const router = useRouter()
  const [targetBook, setTargetBook] = useState<Book>()

  // 全ての書籍
  const {
    data,
    isError,
    isLoading,
    updateBookStatus,
    deleteBook
  } = useBooks()

  useEffect(() => {
    if (!data || isError || isLoading) return
    const { bid } = router.query
    setTargetBook(data.find(book => book.id === bid))
  }, [router.isReady, data, isLoading])

  if (isLoading) {
    return (
      <div className="py-10 flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  if (!targetBook) {
    return (
      <>
        <p className="text-center text-red-6 font-bold text-5xl lg:text-6xl tracking-wide">Error</p>
        <p className="text-center text-gray-6 mt-3">
          Could not retrieve the target book.
        </p>
        <Group position="center" className="mt-8">
          <Button component={NextLink} variant="subtle" size="md" href="/">
            Take me back to home page
          </Button>
        </Group>
      </>
    )
  }

  return (
    <>
      <div className="flex justify-between gap-3">
        <div>
          <BookStatusBadge status={targetBook.status} className="-ml-1" />
          <Title order={2} size="h3" color="dark.4" className="mt-1">
            {targetBook.name}
          </Title>
        </div>

        <Menu position="bottom-end" offset={6}>
          <Menu.Target>
            <ActionIcon variant="default">
              <IconDotsVertical size={16} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            {
              targetBook.status !== 'tsundoku' &&
              <Menu.Item
                color="gray.8"
                icon={<IconArrowBackUp size={14} />}
                onClick={async () => {
                  await updateBookStatus(targetBook, 'tsundoku')
                }}
              >
                Return to Tsundoku
              </Menu.Item>
            }

            <Menu.Item
              color="red"
              icon={<IconTrash size={14} />}
              onClick={async () => {
                await deleteBook(targetBook)
              }}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>

      {
        targetBook.createdAt &&
        <div className="flex items-center gap-2 mt-4">
          <Badge color="gray.7" variant="dot" className="text-gray-7">
            作成日: {formatDate(new Date(targetBook.createdAt))}
          </Badge>
        </div>
      }

      <BookActionButton
        book={targetBook}
        className="mt-10"
      />
    </>
  )
}

Bid.getLayout = (page: ReactElement) => {
  return (
    <DefaultLayout>
      {page}
    </DefaultLayout>
  )
}

export default Bid
