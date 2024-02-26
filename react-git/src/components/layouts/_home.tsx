import { STATIC_CONTENT } from '@/lib/constants/static-content';
import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import { useAtom } from 'jotai';
import Header from './header';
import HeaderMinimal from './header-minimal';
import MobileNavigation from './mobile-navigation';
import Footer from './footer';
import { SearchIcon } from '@/components/icons/search-icon';
import { displayMobileHeaderSearchAtom } from '@/store/display-mobile-header-search-atom';
import useLayout from '@/lib/hooks/use-layout';

export default function HomeLayout({
  children,
  // layout
}: React.PropsWithChildren<{ layout: string }>) {
  const { layout } = useLayout();

  
  const [, setDisplayMobileHeaderSearch] = useAtom(
    displayMobileHeaderSearchAtom
  );

  return (
      <div className="flex flex-col min-h-screen transition-colors duration-150 bg-gray-100">
        {['minimal', 'compact', 'jewe', 'square'].includes(layout) ? (
          <HeaderMinimal layout={layout} />
        ) : (
          <Header layout={layout} />
        )}
        <div className="min-h-screen">{children}</div>
        {['compact', 'jewe', 'square'].includes(layout) && <Footer />}
        <MobileNavigation>
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => setDisplayMobileHeaderSearch((prev) => !prev)}
            className="flex items-center justify-center h-full p-2 focus:outline-none focus:text-accent"
          >
            <span className="sr-only">{STATIC_CONTENT['text-search']}</span>
            <SearchIcon width="17.05" height="18" />
          </motion.button>
        </MobileNavigation>
      </div>
  );
}
