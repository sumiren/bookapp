import React from 'react'
import { Button, MantineColor } from '@mantine/core'
import { Book, BookStatus } from '../../../backend/src/domain/readmodel/book'
import { useBooks } from 'hooks/useBooks'

interface BookActionButtonProps {
  className?: string,
  book: Book
}

interface ButtonData {
  status: BookStatus,
  nextStatus: BookStatus
  label: string,
  color: MantineColor
}

const BUTTON_DATA: ButtonData[] = [
  { status: 'tsundoku', nextStatus: 'doing', label: 'Read', color: 'blue.5' },
  { status: 'doing', nextStatus: 'done', label: 'Done', color: 'green.6' }
]

export default function BookActionButton({ className, book }: BookActionButtonProps) {
  const { updateBookStatus } = useBooks()
  const targetButtonData = BUTTON_DATA.find(data => data.status === book.status)
  if (!targetButtonData) return <></>

  return (
    <Button
      color={targetButtonData.color}
      className={className}
      onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        await updateBookStatus(book, targetButtonData.nextStatus)
      }}
    >
      {targetButtonData.label}
    </Button>
  )
}
