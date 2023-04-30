import {useState} from 'react';
import {
  Collapse,
  Icon,
  Popover,
  PopoverTrigger,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import NextLink from 'next/link'
export default function Navbar() {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <div className=''>
      <div className='bg-white dark:bg-gray-800 text-gray-600 dark:text-white border border-gray-200 dark:border-gray-900 py-2 px-2 justify-center flex items-center w-full'>
        <div className="lg:hidden mr-4 md:flex-none ml-[-1px]">
          <button onClick={onToggle} aria-label={'Toggle Navigation'} className='text-gray-600'>
            {isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
          </button>
        </div>
        <div className="flex flex-1 justify-center md:justify-start">
          <h1 className={`text-2xl font-bold ${useBreakpointValue({ base: 'text-center', md: 'text-left' })} ${useColorModeValue('text-gray-800', 'text-white')}`}>
            Chakula-bora
          </h1>

          <div className="hidden md:flex md:ml-10">
            <DesktopNav />
          </div>
        </div>

        <div className="flex flex-1 justify-end md:flex-none md:justify-end">
          <NextLink href="/auth/signin" className="font-medium text-sm mt-1 text-gray-500 hover:text-gray-900">
            Sign In
          </NextLink>
          <NextLink href="/auth/signup" className="inline-flex text-sm items-center justify-center lg:px-4 py-1 lg:py-2 lg:ml-4 ml-1 font-bold text-white bg-blue-400 rounded hover:bg-blue-300">
            Sign Up
          </NextLink>
        </div>
      </div>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </div>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue('text-gray-600', 'text-gray-200');
  const linkHoverColor = useColorModeValue('text-gray-800', 'white');
  // const [sublink, setSublink] = useState(true);
  return (
    <div className='flex flex-row p-1'>
      {NAV_ITEMS.map((navItem) => (
        <div key={navItem.label}>
          <Popover>
            <PopoverTrigger>
              <NextLink
                className={`p-2 text-sm text-semibold ${linkColor} hover:${linkHoverColor}`}
                href={navItem.href ?? '#'}
              >
                {navItem.label}
              </NextLink>
            </PopoverTrigger>

            {navItem.children && (
              <div className="shadow-xl bg-white rounded-xl p-4 min-w-sm hidden">
                <div className='flex flex-col'>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </div>
              </div>
            )}
          </Popover>
        </div>
      ))}
    </div>
  );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <NextLink
      href={href ? href : '#'}
      className="block p-2 rounded-md group hover:bg-pink-50 text-black">
      <div className='flex items-center'>
        <div className='space-y-2'>
          <span className="transition duration-300 ease-in-out group-hover:text-pink-400">
            {label}
          </span>
          <p className="text-sm">{subLabel}</p>
        </div>
        <div className="flex transition-all duration-300 transform translate-x-[-10px] opacity-0 group-hover:opacity-100 group-hover:translate-x-0 justify-end items-center flex-1">

          <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
        </div>
      </div>
    </NextLink>
  );
};

const MobileNav = () => {
  return (
    <div className={`bg-${useColorModeValue('white', 'gray.800')} p-4  md:block`}>
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </div>
  );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <div className="stack space-y-4" onClick={children && onToggle}>
      <div className="flex py-2 justify-between items-center hover:no-underline">
        <NextLink href={href ?? '#'}>
          <div className="font-semibold text-gray-600">
            {label}
          </div>
          {children && (
            <Icon
              as={ChevronDownIcon}
              transition={'all .25s ease-in-out'}
              transform={isOpen ? 'rotate(180deg)' : ''}
              w={6}
              h={6}
            />
          )}
        </NextLink>
      </div>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <div className="mt-2 pl-4 border-l border-solid border-gray-200 dark:border-gray-700 items-start">
          {children &&
            children.map((child) => (
              <NextLink key={child.label} className='py-2' href={child.href ?? '#'}>
                {child.label}
              </NextLink>
            ))}
        </div>
      </Collapse>
    </div>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'About',
    href: '/about'
  },
  {
    label: 'Questions',
    href: '/dashboard'
  },
  {
    label: 'Articles',
    href: '#'
  },
  // {
  //   label: 'Learn Design',
  //   children: [
  //     {
  //       label: 'Explore Design Work',
  //       subLabel: 'Trending Design to inspire you',
  //       href: '#',
  //     },
  //     {
  //       label: 'New & Noteworthy',
  //       subLabel: 'Up-and-coming Designers',
  //       href: '#',
  //     },
  //   ]
  // },
  // {
  //   label: 'Hire Designers',
  //   children: [
  //     {
  //       label: 'Job Board',
  //       subLabel: 'Find your dream design job',
  //       href: '#',
  //     },
  //     {
  //       label: 'Freelance Projects',
  //       subLabel: 'An exclusive list for contract work',
  //       href: '#',
  //     },
  //   ],
  // },
];
