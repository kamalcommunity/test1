import { STATIC_CONTENT } from '@/lib/constants/static-content';
import { FilterIcon } from '@/components/icons/filter-icon';
import MobileNavigation from '@/components/layouts/mobile-navigation';
import GeneralLayout from '@/components/layouts/_general';
import Details from '@/components/manufacturer/details';
import { Grid } from '@/components/products/grid';
import SidebarFilter from '@/components/search-view/sidebar-filter';
import { useGroupProducts, useProducts } from '@/framework/product';
import { useSettings } from '@/framework/settings';
import { useWindowSize } from '@/lib/use-window-size';
import { drawerAtom } from '@/store/drawer-atom';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import StickyBox from 'react-sticky-box';
// export { getStaticPaths, getStaticProps } from '@/framework/manufacturer.ssr';

const CartCounterButton = dynamic(
  () => import('@/components/cart/cart-counter-button'),
  { ssr: false }
);

export default function Catalogs({ groupProducts, variables }: any) {
  
  const { query } = useRouter();
  const {
    settings: { allowOnlinePurchase },
  } = useSettings();

  const { products, loadMore, isLoadingMore, isLoading, hasMore, error } =
  useGroupProducts({ ...variables, ...query });
  const { width } = useWindowSize();
  return (
    <>
      <div className="flex w-full flex-col">
        {/* <Details manufacturer={manufacturer} /> */}
        {/* <h2 className="mb-8 text-3xl font-semibold tracking-tight text-heading">
          {STATIC_CONTENT['text-books']}
        </h2> */}
        <Grid
          products={products}
          loadMore={loadMore}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
          error={error}
          column="five"
        />
      </div>

      {width > 1023 && allowOnlinePurchase && <CartCounterButton />}
    </>
  );
}

const GetLayout = (page: React.ReactElement) => {
  
  const [_, setDrawerView] = useAtom(drawerAtom);
  const type = page.props.manufacturer?.type?.slug;
  return (
    <GeneralLayout>
      <>
        <div className="w-full bg-light">
          <div className="mx-auto flex min-h-screen w-full max-w-1920 px-5 py-10 rtl:space-x-reverse lg:space-x-10 xl:py-14 xl:px-16">
            <div className="hidden w-80 shrink-0 lg:block">
              <StickyBox offsetTop={140} offsetBottom={30}>
                <SidebarFilter type={type} showManufacturers={false} />
              </StickyBox>
            </div>
            {page}
          </div>
        </div>
        <MobileNavigation>
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() =>
              setDrawerView({
                display: true,
                view: 'SEARCH_FILTER',
                data: { type, showManufacturers: false },
              })
            }
            className="flex h-full items-center justify-center p-2 focus:text-accent focus:outline-none"
          >
            <span className="sr-only">{STATIC_CONTENT['text-filter']}</span>
            <FilterIcon width="17.05" height="18" />
          </motion.button>
        </MobileNavigation>
      </>
    </GeneralLayout>
  );
};

export const getServerSideProps = async (context: {
  params: { navigation: any };
  req: any;
  locale: any;
}) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ['common'])),
    },
  };
};

Catalogs.getLayout = GetLayout;
