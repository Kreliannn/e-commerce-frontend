import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useUserStore = create(
  persist(
    (set) => ({
      _id: '',
      fullname: '',
      address: '',
      username: '',
      password: '',
      setUser: (user) => set(() => ({ ...user })),
    }),
    {
      name: 'user-storage', // localStorage key
      getStorage: () => localStorage,
    }
  )
)

export default useUserStore
