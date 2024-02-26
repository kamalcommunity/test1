import { Product } from '@/types';
import dynamic from 'next/dynamic';
const Helium = dynamic(() => import('@/components/products/cards/helium'));
const Neon = dynamic(() => import('@/components/products/cards/neon')); // grocery-two
const Argon = dynamic(() => import('@/components/products/cards/argon')); // bakery
const Krypton = dynamic(
  () => import('@/components/products/cards/krypton') // furniture extra price
);
const Xenon = dynamic(() => import('@/components/products/cards/xenon')); // furniture-two
const Radon = dynamic(() => import('@/components/products/cards/radon')); // Book
const RadonBigger = dynamic(() => import('@/components/products/cards/radonbigger')); // radon bigger

const MAP_PRODUCT_TO_CARD: Record<string, any> = {
  neon: Neon,
  helium: Helium,
  argon: Argon,
  krypton: Krypton,
  xenon: Xenon,
  radon: Radon,
  radonBigger: RadonBigger
};
interface ProductCardProps {
  product: Product;
  className?: string;
  displayProductPrice?: boolean
}
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className,
  displayProductPrice,
  ...props
}) => {
  const Component =product && product?.type?.settings?.productCard
    ? MAP_PRODUCT_TO_CARD[product?.type?.settings?.productCard]
    : Helium;
  return <Component product={product} {...props} displayProductPrice={displayProductPrice} className={className} />;
};
export default ProductCard;
