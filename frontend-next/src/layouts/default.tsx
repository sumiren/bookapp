import type { ReactElement } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ActionIcon, AppShell, Burger, Container, Drawer, Header, Menu, Navbar, NavLink, Title, useMantineTheme } from '@mantine/core'
import { IconBook, IconBrandGithub, IconChecklist, IconLogout, IconUserCircle } from '@tabler/icons'
import { useAuth } from 'hooks/useAuth'

const ALL_PAGES = [
  { icon: IconBook, title: 'Book', path: '/book' },
  { icon: IconChecklist, title: 'Todo', path: '/todo' }
]

interface DefaultLayoutProps {
  children: ReactElement
}

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  const theme = useMantineTheme()
  const { logout } = useAuth()
  const [opened, setOpened] = useState(false)

  const router = useRouter()
  const routePathname = '/' + router.pathname.split('/')[1]
  const currentPage = ALL_PAGES.find(nav => nav.path === routePathname)

  return (
    <AppShell
      navbarOffsetBreakpoint="md"
      className="pt-3"
      styles={(theme) => ({
        main: {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]
        }
      })}
      navbar={
        <>
          {/* ナビゲーション (md 以上で表示) */}
          <Navbar width={{ base: 240 }} className="p-6 hidden md:block">
            {ALL_PAGES.map((nav, index) => (
              <Link href={nav.path} key={nav.title}>
                <NavLink
                  label={nav.title}
                  icon={<nav.icon size={16} stroke={1.5} />}
                  active={nav.path === currentPage?.path}
                  className="p-3"
                />
              </Link>
            ))}
          </Navbar>
          {/* /ナビゲーション (md 以上で表示) */}

          {/* ナビゲーション (sm 以下で表示) */}
          <Drawer
            opened={opened}
            size={280}
            withCloseButton={true}
            overlayColor={theme.colors.gray[2]}
            overlayOpacity={0.55}
            overlayBlur={3}
            className="p-6 md:hidden"
            onClose={() => setOpened(false)}
          >
            {ALL_PAGES.map((nav, index) => (
              <Link href={nav.path} key={nav.path}>
                <NavLink
                  label={nav.title}
                  icon={<nav.icon size={16} stroke={1.5} />}
                  active={nav.path === currentPage?.path}
                  className="p-3"
                  onClick={() => setOpened(false)}
                />
              </Link>
            ))}
          </Drawer>
          {/* /ナビゲーション (sm 以下で表示) */}
        </>
      }
      header={
        <Header height={56} className="px-6">
          <div className="h-full flex items-center justify-between">
            {/* ハンバーガーアイコン (sm 以下で表示) */}
            <Burger
              opened={opened}
              size="sm"
              color={theme.colors.gray[6]}
              className="mr-4 md:hidden"
              onClick={() => setOpened((o) => !o)}
            />
            {/* /ハンバーガーアイコン (sm 以下で表示) */}

            <Title
              order={1}
              size="h3"
              color="dark.4"
              className="-ml-2.5 md:ml-0"
            >
              BookApp <IconBook size={21} className="-mb-1" />
            </Title>

            <Menu position="bottom-end" offset={3}>
              <Menu.Target>
                <ActionIcon size="xl">
                  <IconUserCircle size={30} color={theme.colors.gray[6]} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  icon={<IconBrandGithub size={14} />}
                  component="a"
                  href="https://github.com/sumiren/bookapp"
                  target="_blank"
                >
                  Github
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  icon={<IconLogout size={14} />}
                  onClick={logout}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        </Header>
      }
    >
      <Container className="px-0 sm:px-4 py-2">
        {children}
      </Container>
    </AppShell>
  )
}
