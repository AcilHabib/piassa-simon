import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialog as AlertDialogPrimitive,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import { LucideProps } from 'lucide-react'
import { FC } from 'react'
import { Button } from '../ui/button'

interface AlertDialogProps {
  children?: React.ReactNode // if there is more info to be displayed under the title and description
  callToAction: string
  title: string
  description?: string
  type?: 'distructive' | 'informational' | 'success'
  Icon?: {
    // Lucid react Icons
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
    >
    // they need to be tailwind colors (ex: red-500/50)
    // PS: no need for the prefix (ex: text-..., bg-...)
    // todo: add typesafety to follow the tailwind colors
    iconBorderColor: string
    iconColor: string
  } | null
  onConfirm: () => void
  Trigger?: React.ReactNode // incase you want to replace the default trigger
}

const AlertDialog: FC<AlertDialogProps> = ({
  callToAction,
  description,
  title,
  onConfirm,
  type = 'distructive',
  Icon,
  children,
  Trigger,
}) => {
  return (
    <AlertDialogPrimitive>
      <AlertDialogTrigger asChild>
        {Trigger ?? (
          <Button
            className="px-10"
            variant={type === 'informational' ? 'secondary' : 'default'}
          >
            {callToAction}
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="border-none bg-grayedout/50 text-foreground backdrop-blur-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle>
            <div className="flex flex-col gap-3">
              {Icon && (
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full border-8 border-red-500/50 bg-offWhite',
                    `border-${Icon.iconBorderColor}`,
                  )}
                >
                  <Icon.icon
                    className={cn('h-6 w-6', `text-${Icon.iconColor}`)}
                  />
                </div>
              )}
              {title}
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-accent-foreground">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {children}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={cn(
              '',
              type === 'distructive' && 'bg-[#D00100] hover:bg-[#D00100]/80',
            )}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogPrimitive>
  )
}

export default AlertDialog
