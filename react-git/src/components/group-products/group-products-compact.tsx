import rangeMap from "@/lib/range-map";
import Carousel from '@/components/ui/carousel';
import ErrorMessage from "../ui/error-message";
import ManufacturerLoader from "../ui/loaders/manufacturer-loader";
import NotFound from "../ui/not-found";
import SectionBlock from "../ui/section-block";
import GroupProductCard from "./group-products-card";
import { ROUTES } from "@/lib/routes";
import { useProductGroups } from "@/framework/product";
import { toast } from "react-toastify";

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
      slidesPerView: 5,
    },
    2600: {
      slidesPerView: 7,
    },
  };

  const GroupProductsCompact: React.FC = () => {
    const { productGroups, isLoading, error } = useProductGroups({
      limit: 10,
    });
  
    // if (error) return <ErrorMessage message={error.message} />;
    // if (error) return toast.error(error.message);
  
    if (isLoading && productGroups && productGroups.length) {
      return  (
        <SectionBlock title="text-product-groups" href={ROUTES.GROUP_PRODUCTS}>
          <div className="">
            <div className="grid w-full grid-flow-col gap-6">
              {rangeMap(4, (i) => (
                <ManufacturerLoader key={i} uniqueKey={`manufacturer-${i}`} />
              ))}
            </div>
          </div>
        </SectionBlock>
      )
    }
    return (
      productGroups && productGroups.length > 0 ?
      <SectionBlock title="text-product-groups" href={ROUTES.GROUP_PRODUCTS}>
        {!isLoading && !productGroups.length ? (
          <div className="min-h-full px-9 pt-6 pb-8 lg:p-8">
            {/* <NotFound text="text-no-product-groups" className="h-96" /> */}
          </div>
        ) : (
          <div>
            <Carousel
              items={productGroups}
              breakpoints={breakpoints}
              spaceBetween={30}
            >
              {(item) => <GroupProductCard item={item} />}
            </Carousel>
          </div>
        )}
      </SectionBlock>: null
    )
  };

export default GroupProductsCompact;
