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
import ProductReviewCard from '../testmonials/product-review-card';
import { useContentBoxes } from '@/framework/content-box';
import Testmonial from '../testmonials/testmonial';
// import ReactHtmlParser  from 'react-html-parser';
import parse from 'html-react-parser'
import ContactForm from '../settings/contact-form';
import ContentBoxes from '../content-boxes/context-boxes';

export default function SquareLayout({ variables }: HomePageProps) {

  
  const {
    settings: {
      displayCategorySection,
      displaySlider,
      displayProductSectionAtHome,
      storeCode,
    },
  } = useSettings();

  const { data, pageContent } = usePageData(DEFAULT_PAGE, storeCode);

  const { data: contentBoxesData } = useContentBoxes();

  const parseContentData = () => {
    return contentBoxesData &&
      contentBoxesData.map((data) => {
        let desData = data?.description?.description ?? "";
        return parse(desData);
      });
  };
  // console.log(contentBoxesData);

  return (
    <div className="flex flex-1 flex-col bg-white">
      <main className="mt-0 block w-full xl:overflow-hidden">
        {displaySlider && (
          // <SectionBlock>
          <div className=" pb-[20px] xl:pb-[54px] 3xl:pb-[60px]">
            <Banner layout="square" variables={variables.types} />
          </div>
          // </SectionBlock>
        )}

        {displayCategorySection && (
          <Categories layout="square" variables={variables.categories} />
        )}

        {true && (
          <Collection layout="square" variables={variables.collections} />
        )}

        {true && (
          <GroupProductsContainer
            layout="jewe"
            variables={variables.groupProdcuts}
          />
        )}

        {true && <ScrollableProductsGrid variables={variables.products} />}



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

        {<ContentBoxes />}

        {<Testmonial layout="jewe" variables={variables.collections} />}

        <ContactForm />
      </main>
    </div>
  );
}