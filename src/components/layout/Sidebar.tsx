'use client';
import {Link, usePathname} from '@/i18n/routing';
import {cn} from '@/lib/utils';
import {signOut} from 'next-auth/react';
import Image from 'next/image';
import {FC, useEffect, useState} from 'react';
import {newNavItems} from '../../../constants/navitems';
import {Separator} from '../ui/separator';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '../ui/tooltip';
import {useRouter} from 'next/navigation';

interface SidebarProps {
  t: {
    stock: string;
    pos: string;
    lowStock: string;
    lowRotation: string;
    orders: string;
    sales: string;
    wallet: string;
    settings: string;
    logout: string;
  };
}

const Sidebar: FC<SidebarProps> = ({t}) => {
  const pathname = usePathname();
  const [mode, setMode] = useState<'stock' | 'pos'>('stock');
  // const {pathname} = useRouter()
  const navItems = newNavItems[mode];
  const settings_logout = [
    {
      label: 'settings',
      // href: '/settings',
      href: '#',
      iconSrc: '/navbar-icons/setting.svg',
      mod: 'both',
      isAdmin: true,
    },
    {
      label: 'logout',
      href: '/signin',
      iconSrc: '/navbar-icons/logout.svg',
      mod: 'both',
      isAdmin: false,
    },
    // {
    //   label: 'logout',
    //   href: '/signin',
    //   iconSrc: '/navbar-icons/logout.svg',
    //   mod: 'both',
    //   isAdmin: false,
    // },
  ];

  useEffect(() => {
    if (pathname.includes('pos')) return setMode('pos');
    setMode('stock');
  }, [pathname]);

  return (
    <aside className="z-50 hidden h-lvh w-[90%] flex-col items-center rounded-sm bg-gray-500/15 px-2 shadow-2xl backdrop-blur-3xl md:flex">
      <Image
        className="mt-2 h-24 w-24 xl:h-28 xl:w-28"
        src={'/logos/simon.svg'}
        alt="Simon logo"
        width={1000}
        height={1000}
      />

      {/* picto */}

      <div className="p-3 xl:p-4">
        <Link
          href={'/online-orders'}
          prefetch={true}
          className={cn(
            'flex items-center justify-center rounded-lg border-0 p-2 outline-primary backdrop-blur-sm xl:p-3',
            pathname === '/online-orders' ? 'bg-primary hover:bg-primary/80' : 'bg-gray-500/10 hover:bg-gray-500/20'
          )}>
          <Image
            className="h-6 w-6 xl:h-7 xl:w-7"
            src={'/logos/piassa-logo-minimal.svg'}
            alt={'Online Orders'}
            width={100}
            height={100}
          />
        </Link>
      </div>
      {/* )} */}
      {/* switch modes */}
      <div className="rounded-full p-1 backdrop-blur-2xl">
        <Link
          href={'/'}
          prefetch={true}
          className={cn(
            'flex items-center justify-center rounded-t-full p-2 xl:p-3',
            mode === 'stock' ? 'bg-primary hover:bg-primary/80' : 'bg-gray-500/10 hover:bg-gray-500/20'
          )}>
          <Image
            className="h-6 w-6 xl:h-7 xl:w-7"
            src={'/navbar-icons/box.svg'}
            alt={'Online Orders'}
            width={100}
            height={100}
          />
        </Link>
        <Link
          href={'/pos'}
          prefetch={true}
          className={cn(
            'flex items-center justify-center rounded-b-full p-2 outline-primary xl:p-3',
            mode === 'pos' ? 'bg-primary hover:bg-primary/80' : 'bg-gray-500/10 hover:bg-gray-500/20'
          )}>
          <Image
            className="h-6 w-6 xl:h-7 xl:w-7"
            src={'/navbar-icons/store.svg'}
            alt={'Online Orders'}
            width={100}
            height={100}
          />
        </Link>
      </div>
      <Separator className="mt-3 w-10 bg-primary" />
      <div className="">
        {navItems.map((item) => (
          <TooltipProvider key={item.label} delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-3 xl:p-4">
                  <Link
                    prefetch={true}
                    onClick={() => {
                      if (item.href === '/signin') {
                        signOut();
                      }
                    }}
                    href={item.href}
                    className={cn(
                      'flex items-center justify-center rounded-lg border-0 p-1 outline-primary backdrop-blur-sm xl:p-2',
                      pathname === item.href ? 'bg-primary hover:bg-primary/80' : 'bg-gray-500/10 hover:bg-gray-500/20'
                    )}>
                    <Image
                      className="h-8 w-8 xl:h-10 xl:w-10"
                      src={item.iconSrc}
                      alt={item.label}
                      width={100}
                      height={100}
                    />
                  </Link>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="border-0 bg-[#494551]/75 text-primary-foreground">
                {t[item.label as keyof typeof t]}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
      <Separator className="mt-3 w-10 bg-primary" />
      {/* settings & logout */}
      {/* <div className="flex space-x-2 rounded-md bg-primary p-2 text-white">
        <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-red-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2m0 10a10 10 0 100-20 10 10 0 000 20z"
            />
          </svg>
        </button>

        <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-red-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5.121 13.87a4.002 4.002 0 003.757 6.13h6.243a4.002 4.002 0 003.757-6.13m1.243-1.243A8 8 0 10.757 12.757a8 8 0 0011.486 0z"
            />
          </svg>
        </button>

        <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-red-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 17l-4-4m0 0l-4-4m4 4h8M12 3v18"
            />
          </svg>
        </button>

        <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-red-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7h8M8 11h8M8 15h8"
            />
          </svg>
        </button>

        <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-red-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7h8M8 11h8M8 15h8"
            />
          </svg>
        </button>
      </div> */}
      <div className="">
        {settings_logout.map((item) => (
          <TooltipProvider key={item.label} delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-3 xl:p-4">
                  <Link
                    prefetch={true}
                    onClick={() => {
                      if (item.href === '/signin') {
                        signOut();
                      }
                    }}
                    href={item.href}
                    className={cn(
                      'flex items-center justify-center rounded-lg  border-0 p-1 outline-primary backdrop-blur-sm xl:p-2',
                      pathname === item.href
                        ? 'bg-primary hover:bg-primary/80 opacity-40'
                        : 'bg-gray-500/10 hover:bg-gray-500/20 opacity-40'
                    )}>
                    <Image
                      className="68 h-6 w-8 xl:h-10 xl:w-10"
                      src={item.iconSrc}
                      alt={item.label}
                      width={100}
                      height={100}
                    />
                  </Link>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="border-0 bg-[#494551]/75 text-primary-foreground">
                {t[item.label as keyof typeof t]}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
      {/* techDoc logo */}

      <div className="mb-10 flex absolute bottom-4 w-full items-center justify-center">
        <Image className="h-8 xl:h-10" src="/logos/tecdoc-logo.png" alt="Tech Doc" width={1000} height={1000} />
      </div>
    </aside>
  );
};

export default Sidebar;
