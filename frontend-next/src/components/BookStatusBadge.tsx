import { CSSProperties } from 'react'
import { Badge, MantineColor } from '@mantine/core'
import { BookStatus } from '../../../backend/src/domain/readmodel/book'

interface BookStatusBadgeProps {
  style?: CSSProperties,
  className?: string,
  status: BookStatus,
}

interface BadgeData {
  status: BookStatus,
  color: MantineColor
}

const BADGE_DATA: BadgeData[] = [
  { status: 'tsundoku', color: 'orange.5' },
  { status: 'doing', color: 'blue.5' },
  { status: 'done', color: 'green.6' }
]

export default function BookStatusBadge({ style, className, status }: BookStatusBadgeProps) {
  const targetBadgeData = BADGE_DATA.find(o => o.status === status)
  if (!targetBadgeData) return <></>

  return (
    <Badge
      color={targetBadgeData.color}
      style={{ ...style, ...{ minWidth: 92 } }}
      className={className}
    >
      {status}
    </Badge>
  )
}
