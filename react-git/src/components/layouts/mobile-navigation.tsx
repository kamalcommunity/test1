import { STATIC_CONTENT } from '@/lib/constants/static-content';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { NavbarIcon } from '@/components/icons/navbar-icon';
import { HomeIcon } from '@/components/icons/home-icon';
import { ShoppingBagIcon } from '@/components/icons/shopping-bag-icon';
import { UserIcon } from '@/components/icons/user-icon';
import { useTranslation } from 'next-i18next';
import { useCart } from '@/store/quick-cart/cart.context';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { useAtom } from 'jotai';
import { drawerAtom } from '@/store/drawer-atom';
import { authorizationAtom } from '@/store/authorization-atom';
import { useIsRTL } from '@/lib/locals';
import { useSettings } from '@/framework/settings';

export default function MobileNavigation({
  children,
}: React.PropsWithChildren<{}>) {
  const router = useRouter();
  
  const { openModal } = useModalAction();
  const [isAuthorize] = useAtom(authorizationAtom);
  const [_, setDrawerView] = useAtom(drawerAtom);
  const { isRTL } = useIsRTL();

  const {
    settings: { allowOnlinePurchase },
  } = useSettings();

  // const hasFilter = `[manufacturer], ${ROUTES?.SEARCH}`.includes(
  //   router.pathname.split('/').pop()!
  // );

  const { totalUniqueItems } = useCart();

  function handleSidebar(view: string) {
    setDrawerView({ display: true, view });
  }

  function handleJoin() {
    // return openModal('LOGIN_VIEW');
  }

  return (
    <div className="visible h-12 md:h-14 lg:hidden">
      <nav className="fixed bottom-0 z-10 flex h-12 w-full justify-between bg-light py-1.5 px-2 shadow-400 ltr:left-0 rtl:right-0 md:h-14">
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => handleSidebar('MAIN_MENU_VIEW')}
          className="flex h-full items-center justify-center p-2 focus:text-accent focus:outline-none"
        >
          <span className="sr-only">{STATIC_CONTENT['text-burger-menu']}</span>
          <NavbarIcon className={`${isRTL && 'rotate-180 transform'}`} />
        </motion.button>

        {children}

        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => router.push('/')}
          className="flex h-full items-center justify-center p-2 focus:text-accent focus:outline-none"
        >
          <span className="sr-only">{STATIC_CONTENT['text-home']}</span>
          <HomeIcon />
        </motion.button>

        {allowOnlinePurchase && (
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => handleSidebar('cart')}
            className="product-cart relative flex h-full items-center justify-center p-2 focus:text-accent focus:outline-none"
          >
            <span className="sr-only">{STATIC_CONTENT['text-cart']}</span>
            <ShoppingBagIcon />
            {totalUniqueItems > 0 && (
              <span className="absolute top-0 mt-0.5 rounded-full bg-accent py-1 px-1.5 text-10px font-semibold leading-none text-light ltr:right-0 ltr:-mr-0.5 rtl:left-0 rtl:-ml-0.5">
                {totalUniqueItems}
              </span>
            )}
          </motion.button>
        )}

        {isAuthorize ? (
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => handleSidebar('AUTH_MENU_VIEW')}
            className="flex h-full items-center justify-center p-2 focus:text-accent focus:outline-none"
          >
            <span className="sr-only">{STATIC_CONTENT['text-user']}</span>
            <UserIcon />
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={handleJoin}
            className="flex h-full items-center justify-center p-2 focus:text-accent focus:outline-none"
          >
            <span className="sr-only">{STATIC_CONTENT['text-user']}</span>
            <UserIcon />
          </motion.button>
        )}
      </nav>
    </div>
  );
}
