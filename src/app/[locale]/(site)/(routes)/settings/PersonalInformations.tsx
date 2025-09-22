'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePathname, useRouter } from '@/i18n/routing'
import { UploadCloud } from 'lucide-react'
import { useLocale } from 'next-intl'
import { FC } from 'react'

interface PersonalInformationsProps {
  generalSettings: {
    title: string
    logo: {
      title: string
      description: {
        startLine: string
        highlight1: string
        or: string
        highlight2: string
        subline: string
      }
    }
    password: {
      title: string
      oldPassword: string
      newPassword: string
      confirmPassword: string
    }
    language: {
      title: string
      en: string
      fr: string
      ar: string
    }
  }
  callToAction: {
    save: string
    cancel: string
  }
}

const PersonalInformations: FC<PersonalInformationsProps> = ({
  generalSettings,
  callToAction,
}) => {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const handleSelectLanguage = (value: string) => {
    router.replace(`${pathname}`, { locale: value as 'en' | 'fr' | 'ar' })
  }
  const localeTolanguage = {
    en: generalSettings.language.en,
    fr: generalSettings.language.fr,
    ar: generalSettings.language.ar,
  }
  return (
    <div
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className="flex h-[80%] w-full flex-col rounded-sm bg-gray-50 p-8 text-secondary-foreground"
    >
      <h1 className="text-lg font-semibold">{generalSettings.title}</h1>
      <div className="mt-5 flex flex-1 flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-lg text-subtle">
            {generalSettings.logo.title}
          </span>
          <div className="flex h-52 w-full items-center justify-center rounded-lg border border-gray-200 bg-white">
            <div className="flex h-[80%] w-[50%] cursor-pointer flex-col items-center justify-center rounded-md border border-gray-200">
              <div className="rounded-md border border-gray-200 p-2">
                <UploadCloud className="h-6 w-6" />
              </div>
              <span className="flex gap-2">
                {generalSettings.logo.description.startLine}
                <span className="text-primary">
                  {generalSettings.logo.description.highlight1}
                </span>
                {generalSettings.logo.description.or}
                <span className="text-primary">
                  {generalSettings.logo.description.highlight2}
                </span>
              </span>
              <span className="text-sm text-muted-foreground">
                {generalSettings.logo.description.subline}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-lg text-subtle">
            {generalSettings.password.title}
          </span>
          <div className="grid grid-flow-row grid-cols-3 gap-2">
            <Input
              className="w-full shadow-md"
              placeholder={generalSettings.password.oldPassword}
            />
            <Input
              className="w-full shadow-md"
              placeholder={generalSettings.password.newPassword}
            />
            <Input
              className="w-full shadow-md"
              placeholder={generalSettings.password.confirmPassword}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-lg text-subtle">
            {generalSettings.language.title}
          </span>
          <Select onValueChange={handleSelectLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue
                placeholder={
                  localeTolanguage[locale as keyof typeof localeTolanguage]
                }
              />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(localeTolanguage).map((value) => (
                <SelectItem value={value} key={value}>
                  {localeTolanguage[value as keyof typeof localeTolanguage]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-1 items-end justify-end gap-2 self-end">
          <Button variant={'secondary'} className="px-8 shadow-md">
            {callToAction.cancel}
          </Button>
          <Button className="px-8 shadow-md shadow-gray-500/30">
            {callToAction.save}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PersonalInformations
