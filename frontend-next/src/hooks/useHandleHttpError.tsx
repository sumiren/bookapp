import Axios from 'axios'
import { notifyError } from 'utilities/notify'
import { useAuth } from 'hooks/useAuth'

export const useHandleHttpError = () => {
  const { logout } = useAuth()

  const handleHttpError = async (err: unknown) => {
    if (!Axios.isAxiosError(err)) return

    // 401 ならログアウト
    if (err.response?.status === 401) {
      await logout()
    } else {
      notifyError()
    }
  }

  return {
    handleHttpError
  }
}
