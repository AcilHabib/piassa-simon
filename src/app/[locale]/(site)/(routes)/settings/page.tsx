import { useTranslations } from 'next-intl'
import { FC } from 'react'
import PersonalInformations from './PersonalInformations'

const SettingsPage: FC = ({}) => {
  const t = useTranslations('settingsPage')
  return (
    <PersonalInformations
      generalSettings={{
        title: t('generalSettings.title'),
        logo: {
          title: t('generalSettings.logo.title'),
          description: {
            startLine: t('generalSettings.logo.description.startLine'),
            highlight1: t('generalSettings.logo.description.highlight1'),
            or: t('generalSettings.logo.description.or'),
            highlight2: t('generalSettings.logo.description.highlight2'),
            subline: t('generalSettings.logo.description.subline'),
          },
        },
        password: {
          title: t('generalSettings.password.title'),
          oldPassword: t('generalSettings.password.oldPassword'),
          newPassword: t('generalSettings.password.newPassword'),
          confirmPassword: t('generalSettings.password.confirmPassword'),
        },
        language: {
          title: t('generalSettings.language.title'),
          en: t('generalSettings.language.en'),
          fr: t('generalSettings.language.fr'),
          ar: t('generalSettings.language.ar'),
        },
      }}
      callToAction={{
        save: t('callToAction.save'),
        cancel: t('callToAction.cancel'),
      }}
    />
  )
}

export default SettingsPage
