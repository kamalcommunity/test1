import { STATIC_CONTENT } from '@/lib/constants/static-content';
import { useRouter } from 'next/router';
import { ROUTES } from '@/lib/routes';
import { useTranslation } from 'next-i18next';
import DrawerWrapper from '@/components/ui/drawer/drawer-wrapper';
import { useAtom } from 'jotai';
import { drawerAtom } from '@/store/drawer-atom';
import { useNavigation } from '@/framework/navigation';
import { useCategories } from '@/framework/category';
import { NAVIGATION_ITEM_LIMIT } from '@/framework/utils/constants';
import { calculateTotal } from '@/store/quick-cart/cart.utils';
import { Category, Navigation } from '@/types';
import { ControlledMenu, useMenuState } from '@szhsin/react-menu';
import CategoryMenuItem from '@/components/ui/category-menu-item';
import TreeMenu from '@/components/ui/tree-menu';
import Link from '@/components/ui/link';
import { useSettings } from '@/framework/settings';

const headerLinks = [
  { href: ROUTES.SHOPS, label: 'nav-menu-shops' },
  { href: ROUTES.MANUFACTURERS, label: 'text-manufacturers' },
  { href: ROUTES.AUTHORS, label: 'text-authors' },
  { href: ROUTES.OFFERS, label: 'nav-menu-offer' },
  { href: ROUTES.HELP, label: 'nav-menu-faq' },
  { href: ROUTES.CONTACT, label: 'nav-menu-contact' },
];

export default function MobileMainMenu() {
  
  const router = useRouter();
  const [_, closeSidebar] = useAtom(drawerAtom);
  const { categories, isLoading, error } = useCategories();
  const [moreMenuProps, toggleMoreMenu] = useMenuState({ transition: true });
  const { navigation: pages } = useNavigation();

  const {settings: {displayBlog}} = useSettings();

  function handleClick(path: string) {
    router.push(path);
    closeSidebar({ display: false, view: '' });
  }
  return (
    <DrawerWrapper>
      <ul className="flex-grow py-4 pr-6">
        <TreeMenu items={categories} className="xl:py-8" />

        {/* Blog button  */}
        {displayBlog && <li>
          <button
            className={
              'my-2 flex w-full px-9 text-sm font-semibold text-body-dark outline-none  transition-all ease-in-expo focus:text-accent focus:outline-none focus:ring-0 ltr:text-left rtl:text-right'
            }
            onClick={() => {
              router.push('/blogs');
            }}
          >
            Blogs
          </button>
        </li>}

        {/* Pages List */}
        {pages && pages.length > 0 && pages.map(({ title, href, id, displayedInFooter }) => {
          if (!displayedInFooter) return;

          return (
            <li key={`${href}-${id}`}>
              <Link
                href={href}
                className={
                  'my-6 flex w-full px-9 text-sm font-semibold text-body-dark outline-none  transition-all ease-in-expo focus:text-accent focus:outline-none focus:ring-0 ltr:text-left rtl:text-right'
                }
              >
                {title}
              </Link>
            </li>
          );
        })}

      </ul>
    </DrawerWrapper>
  );
}
