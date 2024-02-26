import { STATIC_CONTENT } from '@/lib/constants/static-content';
import { Swiper, SwiperSlide, Pagination, Navigation,Autoplay,SwiperOptions,} from '@/components/ui/slider';
import { Image } from '@/components/ui/image';
// import { Banner } from '@/framework/types';
import { productPlaceholder } from '@/lib/placeholders';
import Link from '@/components/ui/link';
import { ROUTES } from '@/lib/routes';
import { Banner } from '@/types';
import { ArrowNext, ArrowPrev } from '../icons';
import { useIsRTL } from '@/lib/locals';
import { useTranslation } from 'next-i18next';

interface BannerProps {
  banners: Banner[] | undefined;
  layout?: string;
  slug?: string;
}

const BannerWithFullWidth: React.FC<BannerProps> = ({ banners, slug }) => {
  
  const { isRTL } = useIsRTL();

  return (
    <div className="compact relative">
      <div className="-z-1 overflow-hidden">
        <div className="relative">
          <Swiper
            className="mySwiper"
            id="banner"
            loop={true}
            modules={[Navigation,Autoplay]}
            resizeObserver={true}
            allowTouchMove={false}
            slidesPerView={1}
            navigation={{
              nextEl: '.next',
              prevEl: '.prev',
            }}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            
            // pagination={true}
            // pagination={{
            //   bulletClass:
            //     'swiper-pagination-bullet !w-2.5 !h-2.5 !p-1 !rounded-full bg-gray-400 !border-0 !opacity-70',
            //   bulletActiveClass: '!w-3 !h-3 !bg-accent',
            //   clickableClass: 'cursor-pointer',
            //   clickable: true,
            // }}
          >
            {banners?.map((banner, idx) => (
              <SwiperSlide key={idx}>
                {/* <Link href={`/jewellery/search?category=new-arrival`}> */}
                <div className="relative h-full w-full">
                  <Image
                    className="h-full w-full"
                    src={banner.image?.original ?? productPlaceholder}
                    alt={banner.title ?? ''}
                    layout="responsive" 
                    width={1800}
                    height={650}
                  />
                </div>
                {/* </Link> */}
              </SwiperSlide>
            ))}
          </Swiper>
          <div
            className="prev cursor-pointer absolute top-2/4 ltr:left-4 rtl:right-4 ltr:md:left-5 rtl:md:right-5 z-10 -mt-4 md:-mt-5 w-8 h-8 rounded-full bg-light shadow-200 border border-border-200 border-opacity-70 flex items-center justify-center text-heading transition-all duration-200"
            role="button"
          >
            <span className="sr-only">{STATIC_CONTENT['text-previous']}</span>

            {isRTL ? (
              <ArrowNext width={18} height={18} />
            ) : (
              <ArrowPrev width={18} height={18} />
            )}
          </div>
          <div
            className="next cursor-pointer absolute top-2/4 ltr:right-4 rtl:left-4 ltr:md:right-5 rtl:md:left-5 z-10 -mt-4 md:-mt-5 w-8 h-8 rounded-full bg-light shadow-200 border border-border-200 border-opacity-70 flex items-center justify-center text-heading transition-all duration-200"
            role="button"
          >
            <span className="sr-only">{STATIC_CONTENT['text-next']}</span>
            {isRTL ? (
              <ArrowPrev width={18} height={18} />
            ) : (
              <ArrowNext width={18} height={18} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerWithFullWidth;
