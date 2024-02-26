import { STATIC_CONTENT } from '@/lib/constants/static-content';
import ProductLoader from '@/components/ui/loaders/product-loader';
import NotFound from '@/components/ui/not-found';
import rangeMap from '@/lib/range-map';
import ProductCard from '@/components/products/cards/card';
import ErrorMessage from '@/components/ui/error-message';
import { usePopularProducts } from '@/framework/product';
import SectionBlock from '@/components/ui/section-block';
import { useTranslation } from 'next-i18next';
import classNames from 'classnames';
import Button from '../ui/button';
import { toast } from 'react-toastify';

interface Props {
  className?: string;
  limit?: number;
  variables: any;
}

export default function PopularProductsGrid({
  className,
  limit = 10,
  variables,
}: Props) {
  
  const { products, loadMore, isLoadingMore, isLoading, hasMore, error } = usePopularProducts(variables);
  // const { products, isLoading, error } = usePopularProducts(variables);
  // if (error) return <ErrorMessage message={error.message} />;
  // if (error) return toast.error(error.message);
  if (!isLoading && !products.length) {
    return (
      <SectionBlock title={STATIC_CONTENT['text-popular-products']}>
        {/* <NotFound text="text-not-found" className="mx-auto w-7/12" /> */}
      </SectionBlock>
    );
  }

  return (
    products && products.length > 0 ?
      <SectionBlock title={STATIC_CONTENT['text-popular-products']}>
        <div className={classNames(className, 'w-full')}>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6 gap-y-10 lg:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] xl:gap-8 xl:gap-y-12 2xl:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] 3xl:grid-cols-[repeat(auto-fill,minmax(360px,1fr))]">
            {isLoading && !products.length
              ? rangeMap(limit, (i) => (
                <ProductLoader key={i} uniqueKey={`product-${i}`} />
              ))
              : products.map((product) => (
                <ProductCard product={product} key={product?.id} />
              ))}
          </div>
          {hasMore && (
            <div className="mt-8 flex justify-center lg:mt-12">
              <Button
                loading={isLoadingMore}
                onClick={loadMore}
                className="h-11 text-sm font-semibold md:text-base"
              >
                {STATIC_CONTENT['text-load-more']}
              </Button>
            </div>
          )}
        </div>
      </SectionBlock> : <></>
  );
}
