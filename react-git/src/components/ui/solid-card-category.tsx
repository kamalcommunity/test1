import { STATIC_CONTENT } from '@/lib/constants/static-content';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/lib/locals';
import { ArrowPrevIcon } from '@/components/icons/arrow-prev';
import { ArrowNextIcon } from '@/components/icons/arrow-next';
import { Swiper, SwiperSlide, Navigation } from '@/components/ui/slider'; 
import CategoryItem from './category-item';
import { FreeMode, Mousewheel } from 'swiper';


function SolidCardCategory({ items }: any) {
  
  const { isRTL } = useIsRTL();

  const [prevEl, setPrevEl] = useState<HTMLElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLElement | null>(null);

  const breakpoints = {
    120: {
      slidesPerView: 1,
      spaceBetween: 20,
    },

    280: {
      slidesPerView: 1.5,
      spaceBetween: 20,
    },

    300: {
      slidesPerView: 2,
      spaceBetween: 20,
    },

    380: {
      slidesPerView: 2.5,
      spaceBetween: 20,
    },

    430: {
      slidesPerView: 3,
      spaceBetween: 20,
    },

    570: {
      slidesPerView: 4,
      spaceBetween: 20,
    },

    768: {
      slidesPerView: 5,
      spaceBetween: 20,
    },

    900: {
      slidesPerView: 6,
      spaceBetween: 20,
    },

    1100: {
      slidesPerView: 7,
      spaceBetween: 20,
    },

    1280: {
      slidesPerView: 7,
      spaceBetween: 24,
    },
    1400: {
      slidesPerView: 7,
      spaceBetween: 24,
    },
    1536:{
      slidesPerView: 8,
      spaceBetween: 24,
    },
    1800: {
      slidesPerView: 10,
      spaceBetween: 30,
    },
    2600: {
      slidesPerView: 10,
      spaceBetween: 40,
    },
  };

  return (
    // category fix
    <div className="relative "> 
      <Swiper
        id="category-card-menu"
        modules={[Navigation, FreeMode, Mousewheel]}
        navigation={{
          prevEl,
          nextEl,
          disabledClass: 'swiper-button-disabled',
          hiddenClass: 'swiper-button-hidden',
        }} 
        breakpoints={breakpoints}
        slidesPerView={7}
        mousewheel={true} 
        freeMode={true}
      >
        {items.slice(0,10)?.map((category: any, idx: number) => (
          <SwiperSlide key={idx}>
            <CategoryItem item={category} />
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        ref={(node) => setPrevEl(node)}
        className="absolute z-10 flex items-center justify-center w-8 h-8 -mt-4 rounded-full outline-none cursor-pointer banner-slider-prev text-heading bg-light shadow-300 top-[40%] ltr:-left-4 rtl:-right-4 focus:outline-none transition-colors hover:text-orange-500"
      >
        <span className="sr-only">{STATIC_CONTENT['text-previous']}</span>
        {isRTL ? <ArrowNextIcon /> : <ArrowPrevIcon />}
      </div>
      <div
        ref={(node) => setNextEl(node)}
        className="absolute z-10 flex items-center justify-center w-8 h-8 -mt-4 rounded-full outline-none cursor-pointer banner-slider-next text-heading bg-light shadow-300 top-[40%] ltr:-right-4 rtl:-left-4 focus:outline-none transition-colors hover:text-orange-500"
      >
        <span className="sr-only">{STATIC_CONTENT['text-next']}</span>
        {isRTL ? <ArrowPrevIcon /> : <ArrowNextIcon />}
      </div>
    </div>
  );
}

export default SolidCardCategory;
