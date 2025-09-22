import { FC } from 'react'

interface layoutProps {
  children: React.ReactNode
  params: {
    locale: string
  }
}

const layout: FC<layoutProps> = ({ children, params: { locale } }) => {
  return (
    <main
      className="h-screen overflow-hidden bg-pos bg-cover bg-center bg-no-repeat"
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="flex h-screen items-center justify-center bg-black/20 backdrop-blur-sm">
        {children}
      </div>
    </main>
  )
}

export default layout
