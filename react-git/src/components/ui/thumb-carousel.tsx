import ChevronLeft from '@/components/icons/chevron-left';
import ChevronRight from '@/components/icons/chevron-right';
import {
  Swiper,
  SwiperSlide,
  SwiperOptions,
  Navigation,
  Thumbs,
} from '@/components/ui/slider';
import { Image } from '@/components/ui/image';
import { useRef, useState } from 'react';
import { productPlaceholder } from '@/lib/placeholders';
import { useIsRTL } from '@/lib/locals';
import classNames from 'classnames';
import { useModalAction } from './modal/modal.context';
// import Magnifier from "react-magnifier";
// import InnerImageZoom from 'react-inner-image-zoom';
// import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import React from 'react'
import ReactPlayer from 'react-player'


interface Props {
  gallery: any[];
  hideThumbs?: boolean;
  aspectRatio?: 'auto' | 'square';
}

// product gallery breakpoints
const galleryCarouselBreakpoints = {
  320: {
    slidesPerView: 2,
  },
  480: {
    slidesPerView: 3,
  },
  640: {
    slidesPerView: 3,
  },
  800: {
    slidesPerView: 4,
  },
};
const swiperParams: SwiperOptions = {
  slidesPerView: 1,
  spaceBetween: 0,
};
export const ThumbsCarousel: React.FC<Props> = ({
  gallery,
  hideThumbs = false,
  aspectRatio = 'square',
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const { isRTL } = useIsRTL();
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const { openModal } = useModalAction();   
  function handleJoin(activeIndex: number) {   
    return openModal('MAGNIFIER_MODAL', {gallery, activeIndex});
  } 
  
  return (
    <div className='flex md:flex-row-reverse flex-col gap-3 md:h-[73vh]'>
      <div className="relative flex md:w-[80%] w-full cursor-pointer"
      >
        <Swiper
          id="productGallery"
          modules={[Navigation, Thumbs]}
          thumbs={{ swiper: thumbsSwiper }}
          navigation={{
            prevEl: prevRef.current!, // Assert non-null
            nextEl: nextRef.current!, // Assert non-null
          }}
          {...swiperParams}
        >
          {gallery?.map((item: any, index: number) => (
            <SwiperSlide
              key={`product-gallery-${item.id}`}
              className="selection:bg-transparent flex justify-center items-center swiper-slide-image"
            > 
            {
                item?.imageType === 0 ?
                <Image
                  src={item?.original ?? productPlaceholder}
                  alt={`Product gallery ${item.id}`}
                  width={aspectRatio === 'square' ? 600 : 570}
                  height={aspectRatio === 'square' ? 700 : 810}
                  objectFit='contain'
                  className="ltr:ml-auto rtl:mr-auto"
                  onClick={() => {
                    handleJoin(index);
                  }}
                /> : <ReactPlayer url={item?.videoUrl ?? productPlaceholder } volume={1} 
                    width={600}
                    height={550} 
                    controls={true} light={true} playing={false}  
                    onClick={() => {
                      handleJoin(index);
                    }}
                  />
              }  
            </SwiperSlide>
          ))}
        </Swiper>
        <div
          ref={prevRef}
          className="product-gallery-prev cursor-pointer absolute top-2/4 ltr:-left-0 rtl:-right-4 ltr:md:-left-5 rtl:md:-right-5 z-10 -mt-4 md:-mt-5 w-8 h-8 md:w-9 md:h-9 rounded-full bg-light shadow-xl border border-border-200 border-opacity-70 flex items-center justify-center text-heading transition-all duration-200 hover:bg-gray-100"
        >
          {isRTL ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </div>
        <div
          ref={nextRef}
          className="product-gallery-next cursor-pointer absolute top-2/4 ltr:right-0 rtl:-left-4 ltr:md:-right-5 rtl:md:-left-5 z-10 -mt-4 md:-mt-5 w-8 h-8 md:w-9 md:h-9 rounded-full bg-light shadow-xl border border-border-200 border-opacity-70 flex items-center justify-center text-heading transition-all duration-200 hover:bg-gray-100"
        >
          {isRTL ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </div>
      </div>
      {/* End of product main slider */}

      <div
        className={classNames(
          'md:w-[20%] w-full relative lg:max-h-[705px] max-h-auto  overflow-y-auto scrollbar-on-hover',
          {
            hidden: hideThumbs,
          }
        )}
      >
        <Swiper
          id="productGalleryThumbs"
          onSwiper={setThumbsSwiper}
          spaceBetween={20}
          watchSlidesProgress={true}
          freeMode={true}
          observer={true}
          observeParents={true}
          breakpoints={galleryCarouselBreakpoints}
        >
          {gallery?.map((item: any) => ( 
            <SwiperSlide
              key={`product-thumb-gallery-${item.id}`}
              className="flex items-center justify-center cursor-pointer rounded overflow-hidden border border-border-200 border-opacity-75 hover:opacity-75"
            >
              {
                item?.imageType === 0 ?
                <Image
                  src={item?.thumbnail ?? productPlaceholder}
                  alt={`Product thumb gallery ${item.id}`}
                  width={100}
                  height={100} 
                  objectFit='contain'
              /> 
               : <ReactPlayer url={item?.videoUrl ?? productPlaceholder } volume={1} 
                    height='100%'
                    width='100%'
                    controls={false} 
                    playing={false}
                    light={true}
                    />
              }
             
            </SwiperSlide> 
          ))}
        </Swiper>
      </div>
    </div>
    
  );
};