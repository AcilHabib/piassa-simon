import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { LucideProps } from 'lucide-react'
import { FC, ForwardRefExoticComponent, RefAttributes } from 'react'

interface MoreOptionProps {
  title: string
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >
  onClick: () => void
}

const MoreOption: FC<MoreOptionProps> = ({ Icon, title, onClick }) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger
          asChild
          className="cursor-pointer bg-grayedout/50 backdrop-blur-2xl transition-all duration-300 hover:bg-grayedout/70"
        >
          <button
            className="h-full w-full rounded p-4 outline-primary"
            onClick={onClick}
          >
            <Icon
              width={32}
              height={32}
              aria-label={title}
              className="h-5 w-5 animate-appear xl:h-8 xl:w-8"
            />
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="border-0 bg-[#494551]/90 text-primary-foreground"
        >
          {title}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default MoreOption
