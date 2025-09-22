type NavItem = {
  label: string;
  iconSrc: string;
  href: string;
  mod: 'pos' | 'stock' | 'both';
  isAdmin: boolean;
};

export const navItems: NavItem[] = [
  {
    label: 'stock',
    href: '/',
    iconSrc: '/navbar-icons/box.svg',
    mod: 'both',
    isAdmin: false,
  },
  {
    label: 'pos',
    href: '/pos',
    iconSrc: '/navbar-icons/store.svg',
    mod: 'pos',
    isAdmin: true,
  },
  {
    label: 'lowStock',
    href: '/low-stock',
    iconSrc: '/navbar-icons/low-stock.svg',
    mod: 'stock',
    isAdmin: true,
  },
  {
    label: 'lowRotation',
    href: '/low-rotation',
    iconSrc: '/navbar-icons/low-rotation.svg',
    mod: 'stock',
    isAdmin: true,
  },
  {
    label: 'orders',
    href: '/orders',
    iconSrc: '/navbar-icons/order-status.svg',
    mod: 'stock',
    isAdmin: false,
  },
  {
    label: 'sales',
    href: '/sales',
    iconSrc: '/navbar-icons/sales.svg',
    mod: 'stock',
    isAdmin: true,
  },
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
  //   label: 'wallet',
  //   href: '/wallet',
  //   iconSrc: '/navbar-icons/wallet.svg',
  //   mod: 'both',
  //   isAdmin: false,
  // },
];
type NavItemType = {
  label: string;
  href: string;
  iconSrc: string;
  isAdmin: boolean;
};

type NewNavItemsType = {
  pos: NavItemType[];
  stock: NavItemType[];
};

export const newNavItems: NewNavItemsType = {
  pos: [
    {
      label: 'pos',
      href: '/pos',
      iconSrc: '/navbar-icons/store.svg',
      isAdmin: true,
    },
    {
      label: 'orders',
      href: '/pos/orders',
      iconSrc: '/navbar-icons/order-status.svg',
      isAdmin: false,
    },
    // {
    //   label: 'wallet',
    //   href: '/pos/offline',
    //   iconSrc: '/navbar-icons/wallet.svg',
    //   isAdmin: false,
    // },
    {
      label: 'sales',
      href: '/pos/sales',
      iconSrc: '/navbar-icons/sales.svg',
      isAdmin: true,
    },
  ],
  stock: [
    {
      label: 'stock',
      href: '/',
      iconSrc: '/navbar-icons/box.svg',
      isAdmin: false,
    },
    {
      label: 'lowStock',
      href: '/low-stock',
      iconSrc: '/navbar-icons/low-stock.svg',
      isAdmin: true,
    },
    {
      label: 'lowRotation',
      href: '/low-rotation',
      iconSrc: '/navbar-icons/low-rotation.svg',
      isAdmin: true,
    },
    {
      label: 'sales',
      href: '/sales',
      iconSrc: '/navbar-icons/sales.svg',
      isAdmin: true,
    },
  ],
};
