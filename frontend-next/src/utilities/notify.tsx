import { toast } from 'react-toastify'

export const notifyError = () => toast.error(
  <div className="text-xs pl-1">
    <p className="mt-0 mb-1 text-dark-4 font-bold">An error has occurred</p>
    <p className="m-0">Please wait some time and try again.</p>
  </div>
)

export const notifyAdded = (label: string) => toast.success(
  <div className="text-xs pl-1">
    <p className="m-0 text-dark-4">Added: <span className="font-bold">{label}</span></p>
  </div>
)

export const notifyDeleted = (label: string) => toast.success(
  <div className="text-xs pl-1">
    <p className="m-0 text-dark-4">Deleted: <span className="font-bold">{label}</span></p>
  </div>
)
