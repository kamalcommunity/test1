import React from 'react';
import { useModalState } from '@/components/ui/modal/modal.context';
import {
  Swiper,
  SwiperSlide,
  Navigation,
  Thumbs,
} from '@/components/ui/slider';
import { useRef, useState } from 'react';
import { useIsRTL } from '@/lib/locals';
import ChevronRight from '@/components/icons/chevron-right';
import ChevronLeft from '@/components/icons/chevron-left';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Image } from '@/components/ui/image';
import classNames from 'classnames';
import ReactPlayer from 'react-player';
import { productPlaceholder } from '@/lib/placeholders';
import ImageZoom from "react-image-zooom";

export default function MagnifierModal() {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const { isRTL } = useIsRTL();
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null); 
  const { data } = useModalState();
  
  return (
    <div className="flex h-full min-h-screen w-screen justify-center md:flex-row flex-col bg-white md:h-auto md:min-h-0 md:max-w-[600px] max-w-screen md:rounded-xl relative md:pl-6 md:pr-20 md:py-0 py-4">
      <div
        className={classNames(
          'md:order-none order-2 md:w-[15%] md:max-h-[400px] max-h-[93px] scrollbar-on-hover overflow-y-auto md:mr-4 md:mt-6 mt-0  md:relative absolute z-20 bottom-0 md:bg-inherit bg-[rgba(26,24,30,.7)] w-full'
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
          className="relative"
        >
          {data.gallery?.map((item: any) => (
            <SwiperSlide
              key={`product-thumb-gallery-${item.id}`}
              className={`flex items-center justify-center cursor-pointer rounded overflow-hidden border border-border-200 border-opacity-75 hover:opacity-75 !mt-0 md:!mr-0 !mr-2 !w-14 md:!min-h-[3.6rem] md:!max-h-auto !min-h-[3.7rem] !max-h-[3.8rem]  
                 
              `}
            >
              {
                item?.imageType === 0 ?
                  <img src={item?.thumbnail ?? productPlaceholder} className=" object-contain md:max-h-full max-h-14 w-full " alt={`Product thumb gallery ${item.id}`} />
                  :
                  <ReactPlayer url={item?.videoUrl ?? productPlaceholder} volume={1}
                    height='100%'
                    width='100%'
                    controls={false}
                    playing={false}
                    light={true}
                    className="object-contain"
                  />
              }
            </SwiperSlide>
          ))}
        </Swiper>
      </div>


      <div className="md:w-[85%] w-screen md:px-0 px-4 h-full min-h-[80vh] flex items-center">
        <Swiper
          id="productGallery"
          modules={[Navigation, Thumbs]}
          thumbs={{ swiper: thumbsSwiper }}
          initialSlide={data['activeIndex']}
          navigation={{
            prevEl: prevRef.current!, // Assert non-null
            nextEl: nextRef.current!, // Assert non-null
          }}
        >
          {data.gallery?.map((item: any) => (
            <SwiperSlide
              key={`product-gallery-${item.id}`}
              className="swiper-slide-image flex items-center justify-center selection:bg-transparent md:w-full w-screen h-full"
            >
              {item?.imageType === 0 ? (
                <div>
                  <ImageZoom src={item?.original} alt="A image to apply the ImageZoom plugin" zoom="200"/>
                </div> 
              ) : (
                <iframe
                  src={item?.videoUrl.replace('watch?v=', 'embed/')}
                  className="w-full object-contain !h-screen"
                  title="Pop-Up Video"
                  allowFullScreen
                ></iframe>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        <div
          ref={prevRef}
          className="product-gallery-prev absolute top-2/4  z-10 -mt-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border-200 border-opacity-70 bg-light text-heading shadow-xl transition-all duration-200 hover:bg-gray-100 ltr:-left-0 rtl:-right-4 md:-mt-5 md:h-9 md:w-9 ltr:md:-left-5 rtl:md:-right-5 md:ml-0 ml-1"
        >
          {isRTL ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </div>
        <div
          ref={nextRef}
          className="product-gallery-next absolute top-2/4 z-10 -mt-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border-200 border-opacity-70 bg-light text-heading shadow-xl transition-all duration-200 hover:bg-gray-100 ltr:right-0 rtl:-left-4 md:-mt-5 md:h-9 md:w-9 ltr:md:-right-5 rtl:md:-left-5 md:mr-0 mr-1"
        >
          {isRTL ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </div>
      </div>

    </div>
  )
}
