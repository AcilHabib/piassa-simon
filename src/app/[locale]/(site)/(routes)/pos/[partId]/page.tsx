import { FC } from 'react'

interface pageProps {
  readonly params: {
    readonly partId: string
  }
}

const page: FC<pageProps> = ({}) => {
  return <div>page</div>
}

export default page
