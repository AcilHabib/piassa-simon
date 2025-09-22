import { useRouter } from 'next/router'
import { useEffect } from 'react'
import useModeStore from './useMode'

function GetMode() {
  const router = useRouter()
  const { mode, changeMode } = useModeStore()

  useEffect(() => {
    const getModeFromPath = () => {
      const pathname = router.pathname
      return pathname.includes('/pos') ? 'pos' : 'stock'
    }

    const updateMode = () => {
      const currentMode = getModeFromPath()
      if (currentMode !== mode) {
        changeMode(currentMode)
      }
    }

    // Set the mode whenever the pathname changes
    updateMode()
  }, [router.pathname, mode, changeMode])

  return mode
}

export default GetMode
