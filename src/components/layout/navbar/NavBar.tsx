import {useTranslations} from 'next-intl';
import {FC} from 'react';
import LoginInformation from './LoginInformation';
import SearchBar from './SearchBar';
import {useStuffContext} from '@/contexts/Stuff';
import {getCurrentStuff} from '@/app/lib/current';

const Navbar: FC = async ({}) => {
  const t = useTranslations('HomePage');
  // const {currentStuffData} = useStuffContext();
  const currentStuff = await getCurrentStuff();
  //   const session = await getAuthSession()
  //   const user_ = session?.user
  //   const user = await db.user.findFirst({
  //     // @ts-expect-error this is fine
  //     where: { id: user_?.sub },
  //     select: {
  //       username: true,
  //       store: {
  //         select: {
  //           name: true,
  //           logo: true,
  //         },
  //       },
  //     },
  //   })
  return (
    <nav className="mb-8 mt-4 flex h-fit w-[95%] items-center justify-between">
      <SearchBar placeholer={t('searchPlaceholder')} />
      <LoginInformation currentStuff={currentStuff} />
    </nav>
  );
};

export default Navbar;
