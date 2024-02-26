import NotFound from '@/components/ui/not-found';
import Carousel from '@/components/ui/carousel';
import SectionBlock from '@/components/ui/section-block';
import { ROUTES } from '@/lib/routes';
import ErrorMessage from '@/components/ui/error-message';
import rangeMap from '@/lib/range-map';
import SectionBlockWithHeader from '../ui/section-block-with-header';
import ProductCard from './cards/card';
import ProductLoader from '../ui/loaders/product-loader';
import { usePopularProducts } from '@/framework/product';
import { useSettings } from '@/framework/settings';
import { toast } from 'react-toastify';

const breakpoints = {
  320: {
    slidesPerView: 3,
  },

  600: {
    slidesPerView: 4,
  },

  960: {
    slidesPerView: 5,
  },

  1280: {
    slidesPerView: 5,
  },

  1600: {
    slidesPerView: 6,
  },
  2600: {
    slidesPerView: 7,
  },
};

interface ScrollableProductsGridProps {
  layout: string;
  variables: any;
  className?: string;
}
const ScrollableProductsGrid: React.FC = ({ variables }: any) => {
  // const { manufacturers, isLoading, error } = useTopManufacturers({
  //   limit: 10,
  // });

  const {
    settings: {
      displayProductPrice
    },
  } = useSettings();

  const { products, isLoading, error } = usePopularProducts(variables);

  

  // if (error) return <ErrorMessage message={error.message} />;
  // if (error) return toast.error(error.message);

  if (isLoading && products.length) {
    return (
      <SectionBlock title="text-top-manufacturer" href={ROUTES.MANUFACTURERS}>
        <div className="">
          <div className="grid w-full grid-flow-col gap-6">
            {rangeMap(4, (i) => (
              <ProductLoader key={i} uniqueKey={`product-${i}`} />
            ))}
          </div>
        </div>
      </SectionBlock>
    )
  }

  return (products && products.length > 0 ?
    // <SectionBlock title={"text-top-manufacturer"} href={ROUTES.MANUFACTURERS}>
    <>
      <SectionBlockWithHeader title={'Top Sellers'} subTitle={'Check out the products that our customers love the most'}>
        {!isLoading && !products.length ? (
          (<div className="min-h-full px-9 pt-6 pb-8 lg:p-8">
            <NotFound text="text-no-category" className="h-96" />
          </div>)
        ) : (
          <Carousel
            items={products}
            breakpoints={breakpoints}
            spaceBetween={30}
          >
            {(item: any) =>
              <ProductCard product={item} key={item.id} displayProductPrice={displayProductPrice} />
            }
          </Carousel>
        )}
      </SectionBlockWithHeader>
    </> : <></>

  )
};

export default ScrollableProductsGrid;
