import { useRouter } from 'next/router'
import { Auth } from 'lib/auth'
import { notifyError } from 'utilities/notify'

const auth = Auth.getAuth()

export const useAuth = () => {
  const router = useRouter()

  const login = async (email: string, password: string) => {
    try {
      const result = await auth.signInWithEmailAndPassword(email, password)
      await auth.loginToServer(result)
      await router.push('/book')
    } catch (error) {
      notifyError()
    }
  }

  // TODO: セッションクリア
  // 暫定処理としてリダイレクトのみ
  const logout = async () => {
    await router.push('/login')
  }

  const signup = async (email: string, password: string) => {
    try {
      const result = await auth.createUserWithEmailAndPassword(email, password)
      await auth.loginToServer(result)
      await router.push('/book')
    } catch (error) {
      notifyError()
    }
  }

  return {
    login, logout, signup
  }
}
