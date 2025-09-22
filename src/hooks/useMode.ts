import { create } from 'zustand'

interface UserState {
  mode: 'pos' | 'stock'
  changeMode: (mode: 'pos' | 'stock') => void
}

const useModeStore = create<UserState>((set) => {
  const pathname = window.location.pathname
  const mode = pathname.includes('/pos') ? 'pos' : 'stock'
  return {
    mode,
    changeMode: (mode: 'pos' | 'stock') => set({ mode }),
  }
})

export default useModeStore
