import SectionBlock from '@/components/ui/section-block';
import FilterBar from './filter-bar';
import Categories from '@/components/categories/categories';
// import GroupProducts from '@/components/products/group-products';
import PopularProductsGrid from '@/components/products/popular-products';
import Banner from '@/components/banners/banner';
import TopManufacturersGrid from '@/components/manufacturer/top-manufacturers-grid';
import { useTranslation } from 'next-i18next';
import type { HomePageProps } from '@/types';
import ProductGridHome from '../products/grids/home';
import { useSettings } from '@/framework/settings';
import GroupProductsCompact from '../group-products/group-products-compact';
// import HomeContent from '../content/home-content';

export default function CompactLayout({ variables }: HomePageProps) {

  
  const {
    settings: {
      displayCategorySection,
      displayProductGroupSection,
      displayManufacturerSection,
      displayFeaturedProductSection,
      displaySlider,
      displayProductSectionAtHome
    },
  } = useSettings();

  return (
    <div className="flex flex-1 flex-col bg-white">
      {/* {displayCategorySection && (
        <FilterBar className="lg:hidden" variables={variables.categories} />
      )} */}
      <main className="mt-6 block w-full xl:overflow-hidden">
        {displaySlider && (
          <SectionBlock>
            <Banner layout="compact" variables={variables.types} />
          </SectionBlock>
        )}

        {/* {<GroupProductsCompact />} */}

        {/* {displayFeaturedProductSection && (
          <PopularProductsGrid variables={variables.popularProducts} />
        )} */}
        {displayCategorySection && (
          <Categories layout="compact" variables={variables.categories} />
        )}

        {displayProductGroupSection && <GroupProductsCompact />}

        {displayProductSectionAtHome && ( 
            <ProductGridHome
              column="five"
              variables={{
                ...variables.products,
                // sortedBy: 'DESC',
                orderBy: 'created_at',
              }}
            /> 
        )}

        {/* <TopAuthorsGrid /> */}
        {/* <SellingProductsGrid limit={6} /> */}
        {displayManufacturerSection && <TopManufacturersGrid />}
        {/* <HomeContent /> */}
        {/* <CallToAction /> */}
      </main>
    </div>
  );
}
