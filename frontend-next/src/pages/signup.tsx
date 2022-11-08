import { AppShell, Button, Container, Paper, PasswordInput, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconBook, IconLock, IconMail } from '@tabler/icons'
import { useAuth } from 'hooks/useAuth'

export default function Signup() {
  const { signup } = useAuth()
  // TODO: 厳密なバリデーション
  const form = useForm({
    initialValues: {
      email: '',
      password: ''
    },
    validate: {
      email: (value) => (value.length >= 1 ? null : 'Invalid email'),
      password: (value) => value.length >= 1 ? null : 'Invalid password'
    }
  })

  return (
    <AppShell
      styles={(theme) => ({
        main: {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]
        }
      })}
    >
      <Container className="py-20">
        <Title
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 800
          })}
        >
          Welcome to BookApp
          <IconBook size={36} className="ml-2 -mb-1.5" />
        </Title>

        <Paper
          withBorder
          shadow="md"
          radius="md"
          className="p-8 mt-8 max-w-md mx-auto"
        >
          <Title
            order={4}
            className="mb-4"
          >
            Create your account &#x1f680;
          </Title>

          <form
            onSubmit={
              form.onSubmit(() => signup(
                form.getInputProps('email'),
                form.getInputProps('password'))
              )
            }
          >
            <TextInput
              label="Email"
              placeholder="your@email.com"
              icon={<IconMail size={18} />}
              required
              {...form.getInputProps('email')}
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              icon={<IconLock size={18} />}
              required
              autoComplete="off"
              {...form.getInputProps('password')}
              className="mt-4"
            />

            <Button
              fullWidth
              type="submit"
              size="md"
              className="mt-8"
            >
              Signup
            </Button>
          </form>
        </Paper>
      </Container>
    </AppShell>
  )
}
