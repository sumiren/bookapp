import type { ReactElement } from 'react'
import type { NextPageWithLayout } from 'pages/_app'
import { DefaultLayout } from 'layouts/default'

const Todo: NextPageWithLayout = () => {
  return (
    <>
      <p className="font-bold">Hello</p>
    </>
  )
}

Todo.getLayout = (page: ReactElement) => {
  return (
    <DefaultLayout>
      {page}
    </DefaultLayout>
  )
}

export default Todo
