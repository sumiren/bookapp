export const TITLE = '書籍 & TODO管理'

export type NAVIGATION_ITEM = {
  path: string;
  title: string;
  icon: string;
}

export const NAVIGATION_ITEMS: NAVIGATION_ITEM[] = [
  {
    path: '/book',
    title: 'Book',
    icon: 'mdi-book-open-blank-variant'
  },
  {
    path: '/todo',
    title: 'Todo',
    icon: 'mdi-format-list-checks'
  }
]
