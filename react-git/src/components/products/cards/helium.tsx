import { STATIC_CONTENT } from '@/lib/constants/static-content';
import { Image } from '@/components/ui/image';
import cn from 'classnames';
import usePrice from '@/lib/use-price';
import { AddToCart } from '@/components/products/add-to-cart/add-to-cart';
import { useTranslation } from 'next-i18next';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { productPlaceholder } from '@/lib/placeholders';
import CartIcon from '@/components/icons/cart';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { Swiper, SwiperSlide } from "swiper/react";
import { useRouter } from 'next/router';
// import SwiperCore, { Autoplay, Pagination } from "swiper";

type HeliumProps = {
  product: any;
  className?: string;
  displayProductPrice: boolean;
};

const Helium: React.FC<HeliumProps> = ({ product, className, displayProductPrice }) => {
  // debugger
  
  // const { name, image, unit, quantity } = product ?? {};
  // const { price, basePrice, discount } = usePrice({
  //   amount: product.sale_price ? product.sale_price : product.price!,
  //   baseAmount: product.price,
  // });

  let { id, name, image, images, unit, quantity, min_price, max_price, product_type, slug, available } =
    product ?? {};

  const { price, basePrice, discount } = usePrice({
    amount: product?.sale_price ? product?.sale_price : product?.price!,
    baseAmount: product?.price,
  });
  const { price: minPrice } = usePrice({
    amount: min_price,
  });
  const { price: maxPrice } = usePrice({
    amount: max_price,
  });

  const { openModal } = useModalAction();

  function handleProductQuickView() {
    // return openModal('PRODUCT_DETAILS', product?.slug);
  }

  // const [autoPlayHover, setAutoPlayHover] = useState(false);

  // const swiperRef = React.useRef<SwiperCore>();
  // const onInit = (Swiper: SwiperCore): void => {
  //   swiperRef.current = Swiper;
  // };

  // const handleMouseEnter = () => {
  //   if (swiperRef.current) swiperRef.current?.autoplay?.start();
  // };

  // const handleMouseLeave = () => {
  //   if (swiperRef.current) swiperRef.current?.autoplay?.stop();
  // };

  // const router = useRouter();

  // function handleProductClick() { 
  //   router.push({
  //     pathname: `${ROUTES.PRODUCT}/${slug}`,
  //     query: { product: JSON.stringify(product) },
  //   });
  // } 

  // if (name == "Akshay") {
  //   console.log(`neon quantity${quantity}, available ${available} `);
  //   available = false;
  //   quantity = 10;
  // }

  return (
    <Link href={`${ROUTES.PRODUCT}/${slug}`}>
      <article
        className={cn(
          'product-card cart-type-helium rounded border border-border-200 h-full bg-light overflow-hidden transition-shadow duration-200 hover:shadow-sm',
          className
        )}
      >
        <div
          onClick={handleProductQuickView}
          className="relative flex items-center justify-center w-auto h-48 sm:h-64"
          role="button"
        >
          <span className="sr-only">{STATIC_CONTENT['text-product-image']}</span>

          {/* <div className='relative'>
            <Swiper
              // onInit={onInit}
              id="productGallery"
              className="product-image rounded-lg mySwiper"
              centeredSlides={true}
              // autoplay={false}
              pagination={{
                clickable: true,
              }}
            >
              {images && images.length > 0 ?
                images?.map((item: any) => (
                  <SwiperSlide
                    key={`product-gallery-${item.id}`}
                    className="selection:bg-transparent flex justify-center items-center swiper-slide-image"
                  >
                    <Image
                      src={item?.original ?? productPlaceholder}
                      alt={`Product gallery ${item.id} ${name}`}
                      height={260}
                      width={200}
                      className="product-image"
                    />
                  </SwiperSlide>
                )) :
                <Image
                  src={image?.original ?? productPlaceholder}
                  alt={name}
                  layout="fill"
                  objectFit="contain"
                  className="product-image"
                />
              }
            </Swiper>
          </div> */}

          <Image
            src={image?.original ?? productPlaceholder}
            alt={name}
            layout="fill"
            objectFit="contain"
            className="product-image"
          />

          {discount && (
            <div className="absolute top-3 ltr:right-3 rtl:left-3 md:top-4 ltr:md:right-4 rtl:md:left-4 rounded-full text-xs leading-6 font-semibold px-1.5 sm:px-2 md:px-2.5 bg-accent text-light z-[2]">
              {discount}
            </div>
          )}
        </div>
        {/* End of product image */}

        <header className="p-3 md:py-6 md:p-5 relative">
          <h3
            onClick={handleProductQuickView}
            role="button"
            className="text-heading text-sm font-semibold truncate mb-2"
          >
            {name}
          </h3>
          <p className="text-muted text-xs">{quantity} {unit}</p>
          {/* End of product info */}

          <div className="flex items-center justify-between min-h-6 mt-7 md:mt-8 relative">
            {displayProductPrice && (
              <>
                <div className="relative">
                  {basePrice && (
                    <del className="text-xs text-muted text-opacity-75 absolute -top-4 md:-top-5 italic">
                      {basePrice}
                    </del>
                  )}
                  <span className="text-accent text-sm md:text-base font-semibold">
                    {price}
                  </span>
                </div>

                {(Number(quantity) > 0 && available) ? (
                  <AddToCart data={product} variant="single" />
                ) : <div className="bg-red-500 rounded text-xs text-light px-2 py-1">
                  {STATIC_CONTENT['text-out-stock']}
                </div>}
              </>
            )}


            {/* {Number(quantity) <= 0 && !available && (
              <div className="bg-red-500 rounded text-xs text-light px-2 py-1">
                {STATIC_CONTENT['text-out-stock']}
              </div>
            )} */}
            {/* End of product price */}
          </div>
        </header>
      </article>
    </Link>
  );
};

export default Helium;