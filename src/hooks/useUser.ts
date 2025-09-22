import { Role } from '@prisma/client'
import axios from 'axios'
import { getSession } from 'next-auth/react'
import { create } from 'zustand'

interface User {
  username: string
  role: Role
  store: {
    name: string
    logo: string
  }
}

interface UserState {
  user: User | null
  setUser: (user: User) => void
  clearUser: () => void
}

const useUserStore = create<UserState>((set) => {
  // Asynchronously fetch the session data when the store is created
  getSession().then(async (session) => {
    if (session?.user) {
      const res = await axios.get('/api/logged-user')
      const loggedUser = res.data.user as unknown as User
      set({ user: loggedUser })
    }
  })

  return {
    user: null,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
  }
})

export default useUserStore
