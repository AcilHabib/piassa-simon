import { LucideProps } from 'lucide-react'
import Image from 'next/image'
import { FC, ForwardRefExoticComponent, RefAttributes } from 'react'

interface InfoCardProps {
  content: number
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  > | null
  label: string
}

const InfoCard: FC<InfoCardProps> = ({ Icon, content, label }) => {
  return (
    <div className="flex w-16 flex-col items-center justify-between gap-2 rounded-md bg-offWhite/10 p-4 shadow-md backdrop-blur-2xl">
      {Icon ? (
        <Icon width={24} height={24} aria-label={label} />
      ) : (
        <div className="flex items-center justify-center rounded-md bg-primary p-2">
          <Image
            // className="p-2"
            src="/logos/piassa-logo-minimal.svg"
            alt={label}
            width={16}
            height={16}
          />
        </div>
      )}
      <span className="text-xl font-bold">{content}</span>
    </div>
  )
}

export default InfoCard
