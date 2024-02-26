import { STATIC_CONTENT } from '@/lib/constants/static-content';
import Link from '@/components/ui/link';
import { Image } from '@/components/ui/image';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { ROUTES } from '@/lib/routes';
import { Product } from '@/framework/types';
import { productPlaceholder } from '@/lib/placeholders';
import usePrice from '@/lib/use-price';
import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Pagination } from "swiper";
// SwiperCore.use([Pagination, Autoplay]);


type RadonProps = {
  product: Product;
  className?: string;
  displayProductPrice: boolean;
};

const Radon: React.FC<RadonProps> = ({
  product,
  className,
  displayProductPrice,
}) => {
  
  const { name, slug, image, images, author, min_price, max_price, product_type } =
    product ?? {};

  const { price, basePrice, discount } = usePrice({
    amount: product.sale_price ? product.sale_price : product.price!,
    baseAmount: product.price,
  });
  const { price: minPrice } = usePrice({
    amount: min_price!,
  });
  const { price: maxPrice } = usePrice({
    amount: max_price!,
  });

  return (
    <article
      className={cn(
        'product-card cart-type-radon flex h-full flex-col overflow-hidden duration-200',
        className
      )}
    >
      {/* <div className="relative flex items-center justify-center w-auto h-64 sm:h-80"> */}
      <Link href={`${ROUTES.PRODUCT}/${slug}`} className="cursor-pointer h-full">

        {/* <div className='relative'
          onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
        > */}

        <div className='relative h-full border'>

          {images && images.length > 0 ?
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
              {images?.map((item: any) => (
                <SwiperSlide
                  key={`product-gallery-${item.id}`}
                  className="selection:bg-transparent flex justify-center items-center swiper-slide-image"
                >
                  <Image
                    src={item?.original ?? productPlaceholder}
                    alt={`Product gallery ${item.id}`}
                    width={600}
                    height={688}
                    objectFit={'contain'}
                    className="ltr:ml-auto rtl:mr-auto product-gallery-img"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            : 
              <Image
              src={productPlaceholder}
              alt={`Product gallery`}
              width={600}
              height={688}
              objectFit={'contain'}
              className="ltr:ml-auto rtl:mr-auto product-gallery-img"
              />
          }

        </div>

      </Link>
      {/* End of product image */}

      <header className="flex shrink-0 flex-col space-y-2 pt-4">
        {name && (
          <Link
            href={`${ROUTES.PRODUCT}/${slug}`}
            className="text-sm font-semibold truncate text-heading transition-colors md:text-base"
            title={name}
          >
            {name}
          </Link>
        )}

        {author && (
          <span className="text-xs text-gray-400 md:text-sm">
            {STATIC_CONTENT['text-by']}
            <Link
              href={`${ROUTES.AUTHORS}/${author?.slug!}`}
              className="text-body transition-colors hover:text-accent ltr:ml-1 rtl:mr-1"
            >
              {author?.name}
            </Link>
          </span>
        )}
        {/* {displayProductPrice && (
          <div className="flex shrink-0 items-center">
            {product_type.toLowerCase() === 'variable' ? (
              <p className="text-sm font-semibold text-orange-500 md:text-base">
                {minPrice}

                <span className="text-heading"> - </span>

                {maxPrice}
              </p>
            ) : (
              <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                <span className="text-base font-semibold text-accent">
                  {price}
                </span>
                {basePrice && (
                  <del className="text-xs font-semibold text-gray-400 ltr:mr-2 rtl:ml-2">
                    {basePrice}
                  </del>
                )}
                {discount && (
                  <div className="text-xs text-accent">
                    ({STATIC_CONTENT['text-save']} {discount})
                  </div>
                )}
              </div>
            )}
          </div>
        )} */}
        {displayProductPrice && (
          <div className="flex shrink-0 items-center">
            <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
              <span className="text-base font-semibold text-accent">
                {price}
              </span>
              {basePrice && (
                <del className="text-xs font-semibold text-gray-400 ltr:mr-2 rtl:ml-2">
                  {basePrice}
                </del>
              )}
              {discount && (
                <div className="text-xs text-accent">
                  ({STATIC_CONTENT['text-save']} {discount})
                </div>
              )}
            </div>
          </div>
        )}
      </header>
      {/* End of product info */}
    </article>
  );
};

export default Radon;