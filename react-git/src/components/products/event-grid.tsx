import { STATIC_CONTENT } from '@/lib/constants/static-content';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import Button from '@/components/ui/button';
import ProductLoader from '@/components/ui/loaders/product-loader';
import NotFound from '@/components/ui/not-found';
import rangeMap from '@/lib/range-map';
import ProductCard from '@/components/products/cards/card';
import ErrorMessage from '@/components/ui/error-message';
import { useProducts } from '@/framework/product';
import { PRODUCTS_PER_PAGE } from '@/framework/client/variables';
import type { Product } from '@/types';
import { useSettings } from '@/framework/settings';
import { toast } from 'react-toastify';

interface Props {
  limit?: number;
  sortedBy?: string;
  orderBy?: string;
  column?: 'five' | 'auto' | 'one';
  shopId?: string;
  gridClassName?: string;
  products: Product[] | undefined;
  isLoading?: boolean;
  error?: any;
  loadMore?: any;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  className?: string;
}

export function EventGrid({
  className,
  gridClassName,
  products,
  isLoading,
  error,
  loadMore,
  isLoadingMore,
  hasMore,
  limit = PRODUCTS_PER_PAGE,
  column = 'one',
}: Props) {
  const {
    settings: {
      displayProductPrice
    },
  } = useSettings();
  

  // if (error) return <ErrorMessage message={error.message} />;
  // if (error) return toast.error(error.message);

  if (!isLoading && !products?.length) {
    return (
      <div className="min-h-full w-full px-4 pt-6 pb-8 lg:p-8">
        {/* <NotFound text="text-not-found" className="mx-auto w-7/12" /> */}
      </div>
    );
  }


  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          {
            'overflow-hidden': column === 'one',
            'grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3':
            column === 'auto',
          },
          gridClassName
        )}
      >
        {isLoading && !products?.length
          ? rangeMap(limit, (i) => (
              <ProductLoader key={i} uniqueKey={`product-${i}`} />
            ))
          : products?.map((product) => (
              <ProductCard product={product} key={product.id} displayProductPrice={displayProductPrice} />
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
  );
}
interface EventProductsGridProps {
  className?: string;
  gridClassName?: string;
  variables?: any;
  column?: 'one' | 'auto';
}
export default function EventProductsGrid({
  className,
  gridClassName,
  variables,
  column = 'one',
}: EventProductsGridProps) {
  const { products, loadMore, isLoadingMore, isLoading, hasMore, error } =
    useProducts(variables);

  return (
    <EventGrid
      products={products}
      loadMore={loadMore}
      isLoading={isLoading}
      isLoadingMore={isLoadingMore}
      hasMore={hasMore}
      error={error}
      className={className}
      gridClassName={gridClassName}
      column={column}
    />
  );
}
