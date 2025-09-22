import {useTranslations} from 'next-intl';
import {FC} from 'react';
import SignInForm from './SignInForm';

const SignIn: FC = ({}) => {
  const t = useTranslations('LoginPage');
  // depoly
  return (
    <div className="min-w-[24rem] scale-125 animate-appear rounded-lg bg-white p-8 shadow-2xl">
      <h1 className="text-xl font-semibold">{t('title')} </h1>
      {/* <span className="text-sm text-muted-foreground">{t('mutedTitle')}</span> */}
      <SignInForm
        t={{
          username: {
            label: t('form.username.label'),
            placeholder: t('form.username.placeholder'),
            error: t('form.username.error'),
          },
          password: {
            label: t('form.password.label'),
            error: t('form.password.error'),
          },
          loginButton: t('form.loginButton'),
        }}
      />
    </div>
  );
};

export default SignIn;
