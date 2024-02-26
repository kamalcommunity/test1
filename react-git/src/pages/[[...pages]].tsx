import type { NextPageWithLayout } from '@/types';

import type { InferGetStaticPropsType } from 'next';

import { useEffect } from 'react';

import dynamic from 'next/dynamic';

import { useRouter } from 'next/router';

import { scroller } from 'react-scroll';

import HomeLayout from '@/components/layouts/_home';

import Seo from '@/components/seo/seo';

import { useWindowSize } from '@/lib/use-window-size';

import { useType } from '@/framework/type';

import client from '@/framework/client';

import Link from 'next/link';

import { DEFAULT_STORE_CODE } from '@/framework/utils/constants';

import JoinButton from '@/components/layouts/menu/join-button';

import GeneralLayout from '@/components/layouts/_general';

import { drawerAtom } from '@/store/drawer-atom';

import parse from 'html-react-parser';

import usePrice from '@/lib/use-price';

import { getStaticProps, getStaticPaths } from 'next';

import AuthorizedMenu from '@/components/layouts/menu/authorized-menu';

import { authorizationAtom } from '@/store/authorization-atom';

import { useAtom } from 'jotai';
import { useIsRTL } from '@/lib/locals';

import { useState } from 'react';

import { Swiper, SwiperSlide, Navigation } from '@/components/ui/slider';

import { FreeMode, Mousewheel } from 'swiper';

import { ArrowNextIcon } from '@/components/icons/arrow-next';

import { ArrowPrevIcon } from '@/components/icons/arrow-prev';

import { STATIC_CONTENT } from '@/lib/constants/static-content';
import { formatAllProducts} from '@/lib/format-api-data';


//[[UI_IMPORT]]

export const getServerSideProps: any = async () => {
  try {
    const wasternsareesProductReqData: any = {
                                store: DEFAULT_STORE_CODE,
                                count:10,

                                };
                                const wasternsareesProductResponse: any = await client.products.all(wasternsareesProductReqData);
                                const wasternsareesProducts = formatAllProducts(wasternsareesProductResponse?.products);
//[[API_DATA]]

    return {
      props: {    
        wasternsareesProducts: wasternsareesProducts ?? [],
//[[API_DATA_PROP]]

      },
    };
  } catch (error) {
    console.log(error);
    return {}
  }
}
const Home:any = ({ 
  wasternsareesProducts,
//[[UI_VARIABLE]]


 }:any) => {
   const [wasternsareesProductsNextEl, setWasternsareesProductNextEl] = useState<HTMLElement | null>(null);
const [wasternsareesProductsPrevEl, setWasternsareesProductPrevEl] = useState<HTMLElement | null>(null);
const [, ] = useState<HTMLElement | null>(null);
const [isAuthorize] = useAtom(authorizationAtom);const { isRTL } = useIsRTL();
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
      slidesPerView: 2,
      spaceBetween: 20,
    },

    430: {
      slidesPerView: 2.5,
      spaceBetween: 20,
    },

    570: {
      slidesPerView: 3,
      spaceBetween: 20,
    },

    768: {
      slidesPerView: 3,
      spaceBetween: 20,
    },

    900: {
      slidesPerView: 5,
      spaceBetween: 20,
    },

    1100: {
      slidesPerView: 6,
      spaceBetween: 20,
    },

    1280: {
      slidesPerView: 6,
      spaceBetween: 24,
    },
    1400: {
      slidesPerView: 4,
      spaceBetween: 24,
    },
    1536: {
      slidesPerView: 7,
      spaceBetween: 24,
    },
    1800: {
      slidesPerView: 7,
      spaceBetween: 30,
    },
    2600: {
      slidesPerView: 7,
      spaceBetween: 40,
    },
  };
//[[UI_HOOK]]
  useEffect(() => {
    // console.log("test use r")
    const commonScript = document.createElement("script");
    commonScript.src = "/assets/script.js";
    document.head.appendChild(commonScript);
    return () => {
      document.head.removeChild(commonScript);
    };
  }, []);

  return (
    <>
      
 <div id="ixmj7">
  <div>
   <div className="swiper w-100 mySwiper">
    <div className="swiper-wrapper">
     <div className="swiper-slide">
      <img alt="swiper-image" className="swiper-image w-100 h-full" src="https://images.unsplash.com/photo-1630926906914-f98970d8894c?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D  "/>
     </div>
     <div className="swiper-slide">
      <img alt="swiper-image" className="swiper-image w-100 h-full" src="https://images.unsplash.com/photo-1678366633411-fafa89580dea?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"/>
     </div>
     <div className="swiper-slide">
      <img alt="swiper-image" className="swiper-image w-100 h-full" src="https://images.unsplash.com/photo-1621619856624-42fd193a0661?q=80&w=2058&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"/>
     </div>
    </div>
    <div className="swiper-button-next">
    </div>
    <div className="swiper-button-prev">
    </div>
    <div className="swiper-pagination">
    </div>
    <div className="swiper-scrollbar">
    </div>
   </div>
  </div>
 </div>
 <div id="inzck">
  Trending Products
 </div>
 <div className="container" collection-name="wastern-sarees" collection-type="product" count="10" data-gjs-type="product-collection" id="i4twn">
  <div className="row relative" data-gjs-type="product-gird">
   <Swiper
                    id="category-card-menu"
                    modules={[Navigation, FreeMode, Mousewheel]}
                    navigation={{
                        prevEl:wasternsareesProductsPrevEl,
                        nextEl:wasternsareesProductsNextEl,
                        disabledClass: 'swiper-button-disabled',
                        hiddenClass: 'swiper-button-hidden',
                        }}
                        breakpoints={breakpoints}
                        slidesPerView={4}
                        mousewheel={true}
                        freeMode={true}
                        >{wasternsareesProducts?.map((product: any, key: any) => {
                            return (
                                <>
                                <SwiperSlide key={key}>
                                <div className="col-lg-3 col-md-4 col-sm-6 col-12 py-3 w-full" data-gjs-type="product-card"><Link href={product.href}><div className="shadow pb-2 shopiana-bg-white"><div><img className="w-100 object-fit-cover shopiana-product-image-height" id="ijkgk" src={product.image?.imageUrl}/></div><div><p className="text-truncate px-3">{product.name}</p></div><div><p className="text-truncate px-3" data-gjs-type="product-description">{parse(product?.description)}</p></div><div className="d-flex justify-content-cente"><p className="text-truncate px-3 mb-3">{usePrice({amount:product.price}).price}</p></div></div></Link></div>
                                </SwiperSlide>
                                </>
                                );
                                })}</Swiper>
                                <div
                                    ref={(node) => setWasternsareesProductPrevEl(node)}
                                    className="absolute z-10 flex items-center justify-center w-8 h-8 -mt-4 rounded-full outline-none cursor-pointer banner-slider-prev text-heading bg-light shadow-300 top-[40%] ltr:-left-4 rtl:-right-4 focus:outline-none transition-colors hover:text-orange-500"
                                >
                                    <span className="sr-only">{STATIC_CONTENT['text-previous']}</span>
                                    {isRTL ? <ArrowNextIcon /> : <ArrowPrevIcon />}
                                </div>
                                <div
                                    ref={(node) => setWasternsareesProductNextEl(node)}
                                    className="absolute z-10 flex items-center justify-center w-8 h-8 -mt-4 rounded-full outline-none cursor-pointer banner-slider-next text-heading bg-light shadow-300 top-[40%] ltr:-right-4 rtl:-left-4 focus:outline-none transition-colors hover:text-orange-500"
                                >
                                    <span className="sr-only">{STATIC_CONTENT['text-next']}</span>
                                    {isRTL ? <ArrowPrevIcon /> : <ArrowNextIcon />}
                                </div>
  </div>
 </div>
 <div id="iodka">
  Trending Categories
 </div>


      
    </>
  );
};
Home.getLayout = function getLayout(page: React.ReactElement){
  return (
    <GeneralLayout layout='' >
      {page}
    </GeneralLayout>
  );
};
export default Home;
