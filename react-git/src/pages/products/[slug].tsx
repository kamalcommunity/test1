import type { Product } from '@/types';

// import type { InferGetStaticPropsType } from 'next';

import { getLayout } from '@/components/layouts/layout';

import { AttributesProvider } from '@/components/products/details/attributes.context';

import Seo from '@/components/seo/seo';

import { useWindowSize } from '@/lib/use-window-size';

import ProductQuestions from '@/components/questions/product-questions';

import AverageRatings from '@/components/reviews/average-ratings';

import ProductReviews from '@/components/reviews/product-reviews';

import isEmpty from 'lodash/isEmpty';

import dynamic from 'next/dynamic';

import parse from 'html-react-parser';

import { ThumbsCarousel } from '@/components/ui/thumb-carousel';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import Link from 'next/link';

import GeneralLayout from '@/components/layouts/_general';

import { toast } from 'react-toastify';

import usePrice from '@/lib/use-price';

import AuthorizedMenu from '@/components/layouts/menu/authorized-menu';

import { authorizationAtom } from '@/store/authorization-atom';

import { useAtom } from 'jotai';

//[[UI_IMPORT]]
// import { getStaticPaths, getStaticProps } from '@/framework/product.ssr';

//FIXME: typescript and layout
// const Details = dynamic(() => import('@/components/products/details/details'));

// const BookDetails = dynamic(
//   () => import('@/components/products/details/book-details')
// );

// const RelatedProducts = dynamic(
//   () => import('@/components/products/details/related-products')
// );

// const CartCounterButton = dynamic(
//   () => import('@/components/cart/cart-counter-button'),
//   { ssr: false }
// );



import client from '@/framework/client';

import { AddToCart } from '@/components/products/add-to-cart/add-to-cart';

import { DEFAULT_STORE_CODE } from '@/framework/utils/constants';

import { formatAllProducts, formatProductData } from '@/lib/format-api-data';

// export { getStaticPaths, getStaticProps };

export const getServerSideProps: any = async (context: any) => {

  try {
    const { params } = context;
    const { slug } = params;

    const productResponse: any = await client.products.get(slug);
    const product = productResponse && formatProductData(productResponse);

    if (!product) {
      throw Error();
    }
    return {
      props: {
        product
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: '/404',
        permanent: false
      }
    }
  }
}


const ProductPage: any = ({ product }: any) => {
  const { width } = useWindowSize();
  const router = useRouter();
  const { slug } = router.query;
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
   const [isAuthorize] = useAtom(authorizationAtom);
//[[UI_HOOK]]
  useEffect(() => {

   
    fetchData();
  }, [slug]); 
  const fetchData = async () => {
    try {
      if (slug) {
        let product = await client.products.get(slug , DEFAULT_STORE_CODE); 

        let relatedProducts: Product[] = await client.products.relatedProducts(product.id, DEFAULT_STORE_CODE)
        const formatedRelatedProducts = formatAllProducts(relatedProducts) ?? [];
        setRelatedProducts(formatedRelatedProducts)
      }
    } catch (error) {
      toast.error(error?.message)
    }
  };

  console.log(relatedProducts);
  return (
    product && <>
     
 <div className="px-4 py-2" id="iuyaox">
  <div className="container px-4 py-2" id="iziwzg">
   <div className="row p-2 row-cols-1 row-cols-sm-2 row-cols-md-2">
    <div className="col">
     <div id="iltajt">
      <ThumbsCarousel
    gallery={product?.images ?? []}
    hideThumbs={product?.images.length <= 1}
  />
     </div>
    </div>
    <div className="col" id="ipo6ob">
     <div id="isc7da">
      <p className="text-truncate px-3">
       {product.name}
      </p>
     </div>
     <div className="d-flex justify-content-cente" id="ivqku8">
      <p className="text-truncate px-3 mb-3">
       {usePrice({amount:product.price}).price}
      </p>
     </div>
     <div className="mb-3 w-full lg:mb-0 lg:max-w-[400px]">
                   {
                      product &&  
                      <AddToCart
                      data={product}
                      variant="big"
                      // variation={selectedVariation}
                      disabled={
                        product?.quantity <= 0 || !product?.available
                      }
                      />
                   } 
                  </div>
    </div>
   </div>
  </div>
 </div>
 <hr id="iz5l04"/>
 <div className="container px-4 py-2" id="ixugxi">
  <div className="row p-2">
   <div className="col" id="i8peqw">
    <div id="ivlcyv">
     <p className="text-truncate px-3" data-gjs-type="product-description">
      {parse(product?.description)}
     </p>
    </div>
   </div>
  </div>
 </div>
 <hr id="iiaxvt"/>



    </>
  );
};
// ProductPage.getLayout = getLayout;
ProductPage.getLayout = function getLayout(page: React.ReactElement){
  return (
    <GeneralLayout layout='' >
      {page}
    </GeneralLayout>
  );
};
export default ProductPage;
