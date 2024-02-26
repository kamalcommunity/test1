import { STATIC_CONTENT } from '@/lib/constants/static-content';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import ProductCard from '../cards/card';
interface Props {
  products: any;
  currentProductId: any;
  gridClassName?: string;
}

const RelatedProducts = ({
  products,
  currentProductId,
  gridClassName,
}: Props) => {
  

  return (
    <>
      <h2 className="text-lg text-heading tracking-tight font-semibold mb-6">
        {STATIC_CONTENT['text-related-products']}
      </h2>
      <div
        className={cn(
          'grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4',
          gridClassName
        )}
      >
        {products?.map((item: any, idx: number) => {
          if (currentProductId === item.id) {
            return null;
          }
          return (
            <ProductCard product={item} key={idx} cardType={item?.type?.slug} />
          );
        })}
      </div>
    </>
  );
};
// <motion.div key={idx}>
{
  /* {renderProductCard(
    item,
    "!shadow-none border border-border-200 hover:!border-border-200 border-opacity-70"
  )} */
}
// </motion.div>

export default RelatedProducts;
