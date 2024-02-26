import Categories from '@/components/categories/categories';
import Banner from '@/components/banners/banner';
import { useTranslation } from 'next-i18next';
import type { HomePageProps } from '@/types';
import { useSettings } from '@/framework/settings';
import BottomHeader from '../bottom-header/bottom-header';
import Collection from '../collection/collection';
import ScrollableProductsGrid from '../products/scrollable-products-grid';
import GroupProductsContainer from '../group-products/group-products-container';
import ProductGridHome from '../products/grids/home';
import { usePageData } from '@/framework/navigation';
import { DEFAULT_PAGE } from '@/framework/utils/constants';
// import ProductReviewCard from '../testmonials/testmonial-card';
import Testmonial from '../testmonials/testmonial';
import { useContentBoxes } from '@/framework/content-box';
import parse from 'html-react-parser'
import ContentBoxes from '../content-boxes/context-boxes';
export default function JewelleryLayout({ variables }: HomePageProps) {

  
  const {
    settings: {
      displayCategorySection,
      displaySlider,
      displayProductSectionAtHome,
      storeCode,
    },
  } = useSettings();

  // const parseContentData = () => {
  //   return contentBoxesData &&
  //     contentBoxesData.map((data) => {
  //       let desData = data?.description?.description ?? "";
  //       return parse(desData);
  //     });
  // };
  //  console.log(contentBoxesData);

  // const { data, pageContent } = usePageData(DEFAULT_PAGE, storeCode);

  return (
    <div className="flex flex-1 flex-col bg-white">
      {/* <div className="">
        <BottomHeader layout="jewe"></BottomHeader>
      </div> */}
      {/* {displayCategorySection && (
        <FilterBar className="lg:hidden" variables={variables.categories} />
        )} */}
      <main className="mt-0 block w-full xl:overflow-hidden">
        {displaySlider && (
          <div className=" pb-[20px] xl:pb-[54px] 3xl:pb-[60px]">
            <Banner layout="jewe" variables={variables.types} />
          </div>
        )}

        {displayCategorySection && (
          <Categories layout="jewe" variables={variables.categories} />
        )}

        {true && (
          <Collection layout="jewe" variables={variables.collections} />
        )}

        <GroupProductsContainer layout="jewe" variables={variables.products} />

        {true && (
          <ScrollableProductsGrid variables={variables.products} />
        )}

        {/* {
          contentBoxesData && parseContentData()
        } */}

        {displayProductSectionAtHome && (
          <ProductGridHome
            column="five"
            variables={{
              ...variables.products,
              // sortedBy: '',
              orderBy: 'created_at',
            }}
          />
        )}

        {
          <ContentBoxes />
        }

        {
          <Testmonial layout="jewe" variables={variables.collections} />
        }

      </main>
    </div>
  );
}