import Link from '@/components/ui/link';
import { useNavigation } from '../../../framework/rest/navigation';
import { ROUTES } from '@/lib/routes';
import { useTranslation } from 'next-i18next';
import {
  Menu,
  MenuItem,
  MenuButton,
  ControlledMenu,
  useMenuState,
} from '@szhsin/react-menu';
import { ref } from 'yup';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { Navigation } from '@/types';
import { setLocalData } from '@/framework/client/helper';
import { PAGES_KEY } from '@/framework/utils/constants';

const headerLinks = [
  { href: ROUTES.SHOPS, icon: null, label: 'nav-menu-shops' },
  { href: ROUTES.OFFERS, icon: null, label: 'nav-menu-offer' },
  { href: ROUTES.HELP, label: 'nav-menu-faq' },
  { href: ROUTES.CONTACT, label: 'nav-menu-contact' },
];

const StaticMenu = () => {
  
  const { navigation, isLoading, error } = useNavigation();

  useEffect(() => {
    setLocalData(PAGES_KEY, JSON.stringify(navigation));
  }, [navigation]);

  return (
    <>
      {navigation?.map(
        ({ href, label, icon, children, id }: Navigation, index) => (
          <CustomMenuItem href={href} label={label} key={id} child={children} />
        )
      )}
    </>
  );
};

export function CustomMenuItem({ label, href, child }: any) {
  const router = useRouter();
  const ref = useRef<any>();
  const [menuProps, toggleMenu] = useMenuState({ transition: true });
  return (
    <>
      <button
        className="text-sm text-heading transition-colors hover:text-green-600 font-medium"
        onClick={() => {
          router.push(href);
        }}
        ref={ref}
        onMouseEnter={() =>
          child && child.length > 0 ? toggleMenu(true) : toggleMenu(false)
        }
      >
        {label} 
      </button>

      <ControlledMenu
        {...menuProps}
        anchorRef={ref}
        onMouseLeave={() => toggleMenu(false)}
        onClose={() => toggleMenu(false)}
      >
        {child?.map((item: Navigation) => (
          // <MenuItem key={item.id}>
          <Link
            className="flex p-2 font-  hover:bg-gray-100 text-sm text-heading transition-colors hover:text-green-600"
            
            key={item.id}
            href={item.href}
          >
            {item.label}
          </Link>
          // </MenuItem>
        ))}
      </ControlledMenu>
    </>
  );
}

export default StaticMenu;
