import Carousel from '../ui/carousel';
import SectionBlockWithHeader from '../ui/section-block-with-header';
import ProductCard from '../products/cards/card';
import NotFound from '../ui/not-found';
import { useSettings } from '@/framework/settings';
import { ProductGroupItem } from '@/types';

const breakpoints = {
  320: {
    slidesPerView: 1,
  },

  600: {
    slidesPerView: 2,
  },

  960: {
    slidesPerView: 3,
  },

  1280: {
    slidesPerView: 4,
  },

  1600: {
    slidesPerView: 4,
  },
  2600: {
    slidesPerView: 4,
  },
};

interface GroupProductGridProps {
  notFound: boolean;
  isLoading: boolean;
  items: any[];
  className?: string;
  variables: any;
}

const GroupProductGrid: React.FC<GroupProductGridProps> = ({
  notFound,
  items,
  isLoading,
  variables,
}) => {
  const {
    settings: {
      displayProductPrice
    },
  } = useSettings();

  if (!isLoading && !items?.length) {
    return (
      <div className="min-h-full w-full px-4 pt-6 pb-8 lg:p-8">
        {/* <NotFound text="text-not-found" className="mx-auto w-7/12" /> */}
      </div>
    );
  }
  
  return (
    items && items.map(({ products, title, subTitle, id }: ProductGroupItem) => {
      return <>
        {!notFound && products && products.length ? (
          <SectionBlockWithHeader key={id} title={title} subTitle={subTitle}>

            <Carousel
              items={products}
              breakpoints={breakpoints}
              spaceBetween={30}
            >
              {(item:any) =>
                 <ProductCard product={item} key={item.id} displayProductPrice={displayProductPrice} />
              }
            </Carousel>
          </SectionBlockWithHeader>

        ) : (
          <div className="min-h-full">
            {/* <NotFound text="text-no-category" className="h-96" /> */}
          </div>
        )}
      </>
    })
  );

  // function groupProducts(group: ProductGroupItem, variables: any) {
  //   const { products, isLoading, error } = useGroupProducts({ code: group.code, ...variables });

  //   return <>
  //     {!notFound && products ? (
  //       <SectionBlockWithHeader key={products.id} title={group?.title} subTitle={group?.subTitle}>

  //         <Carousel
  //           items={products}
  //           breakpoints={breakpoints}
  //           spaceBetween={30}
  //         >
  //           {(item) =>
  //             // <Link href={`${item?.type?.slug}/search/?category=${item?.description?.friendlyUrl}`}>
  //             // <Radon
  //             //   className={''}
  //             //   displayProductPrice={true}
  //             //   product={item} />
  //             <RadonBigger
  //               className={''}
  //               displayProductPrice={true}
  //               product={item} />
  //             // </Link>
  //           }
  //         </Carousel>
  //       </SectionBlockWithHeader>

  //     ) : (
  //       <div className="min-h-full">
  //         {/* <NotFound text="text-no-category" className="h-96" /> */}
  //       </div>
  //     )}
  //   </>;
  // }
};

export default GroupProductGrid;
