'use client'
import { usePathname } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import { FC } from 'react'

interface MainContainerProps {
  children: React.ReactNode
}

const MainContainer: FC<MainContainerProps> = ({ children }) => {
  const isInPOS = usePathname().startsWith('/pos')
  return (
    <main
      className={cn(
        'mx-auto max-w-standard bg-stock bg-cover bg-center bg-no-repeat text-primary-foreground transition-all duration-500 ease-in-out',
        isInPOS && 'bg-pos',
      )}
    >
      {children}
    </main>
  )
}

export default MainContainer
