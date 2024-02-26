import type { GetStaticPaths, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import client from './client';
import { API_ENDPOINTS } from './client/api-endpoints';
import invariant from 'tiny-invariant';

export const getStaticPaths: GetStaticPaths<any> = async ({
  locales,
}) => {
  invariant(locales, 'locales is not defined');
  // const apolloClient = initializeApollo();
  // const {
  //   data: { authors },
  // } = await apolloClient.query<AuthorsQuery>({
  //   query: AuthorsDocument,
  //   variables: {
  //     first: 100,
  //   },
  // });
  // invariant(authors, 'authors is not defined');
  // const paths = authors.data.flatMap((shop) =>
  //   locales.map((locale) => ({ params: { author: shop.slug }, locale }))
  // );
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    [API_ENDPOINTS.SETTINGS],
    client.settings.all
  );
  // await queryClient.prefetchQuery([API_ENDPOINTS.TYPES], ({ queryKey }) =>
  //   client.types.all(queryKey[1] as any)
  // );
  // await queryClient.prefetchInfiniteQuery(
  //   [API_ENDPOINTS.MANUFACTURERS, { limit: 30 }],
  //   ({ queryKey }) => client.manufacturers.all(queryKey[1] as any)
  // );
  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};

























function initializeApollo() {
  throw new Error('Function not implemented.');
}
// import type { CheckoutBadges, IBadge, Product, ProductReview } from '@/types';
// import type { GetServerSideProps } from 'next';
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// import client from './client';
// import { productPlaceholder } from '@/lib/placeholders';
// import { TYPE_DATA, TYPE_DEFUALT_INDEX } from './utils/constants';
// import { findType } from './utils/helper';
// import { toast } from 'react-toastify';

// // This function gets called at build time
// type ParsedQueryParams = {
//   slug: string;
// };
// // export const getStaticPaths: GetStaticPaths<ParsedQueryParams> = async ({
// //   locales,
// // }) => {
// //   invariant(locales, 'locales is not defined');
// //   const { data } = await client.products.all({ limit: 100 });
// //   const paths = data?.flatMap((product) =>
// //     locales.map((locale) => ({ params: { slug: product.slug }, locale }))
// //   );
// //   return {
// //     paths,
// //     fallback: 'blocking',
// //   };
// // };
// type PageProps = {
//   product: Product;
//   checkoutBadges:CheckoutBadges,
// };
// export const getServerSideProps: GetServerSideProps<
//   PageProps,
//   ParsedQueryParams
// > = async ({ params, locale, req }) => {
//   const { slug } = params!; //* we know it's required because of getStaticPaths
//   if (req.headers.host) {



//     // const queryClient = new QueryClient();

//     // await queryClient.prefetchQuery(
//     //   [API_ENDPOINTS.SETTINGS],
//     //   client.settings.all
//     // );

//     const settings = await client.settings.all({
//       host: req.headers.host
//     });

//     let typeData = settings ? findType(settings?.themeLayoutType) : TYPE_DATA[TYPE_DEFUALT_INDEX];

//     try {
//       let product = await client.products.get(encodeURIComponent(slug), settings?.storeCode);
      

//       let relatedProducts = await getRelatedProducts(product.id, settings?.storeCode, typeData);

//       let productReivew: ProductReview[] | null | undefined = await getProductReviews(product.id, settings?.storeCode, typeData);
//       let checkoutBadges = await client.checkoutBadges.get(settings?.storeCode);
     
//       // let checkoutBadges = await client.checkoutBadges.get(settings?.storeCode);
//       // let checkoutBadges = {};

//       if (product) {  
//         const { originalPrice, finalPrice, categories, gallery, variation_options, variations } = manageProduct(product);
//         product = {
//           ...product,
//           slug: product?.productDescription?.friendlyUrl ?? "",
//           name: product?.productDescription?.name ?? "",
//           description: product?.productDescription?.description ?? "",
//           price: originalPrice ?? 0,
//           sale_price: finalPrice ?? 0,
//           min_price: finalPrice ?? 0,
//           max_price: finalPrice ?? 0,
//           image: {
//             ...product?.image,
//             original: product?.image?.imageUrl! ?? productPlaceholder,
//             thumbnail: product?.image?.imageUrl! ?? productPlaceholder
//           },
//           originalPrice: originalPrice,
//           finalPrice: finalPrice,
//           categories: categories,
//           gallery: gallery,
//           variation_options: (variations.length == 0) ? [] : variation_options,
//           variations: (variations.length == 0) ? [] : variations,
//           related_products: relatedProducts ?? [],
//           product_reviews: productReivew! ?? [],
//           product_reviews_count: productReivew ? productReivew.length : 0,
//           type: typeData,
//           rating: product.rating,
//           ratingCount: product.ratingCount,
//           unit: product.productPrice.productUnitCode,
//           productUnitQuantity : product.productPrice.productUnitQuantity
//         }
//       }

//       return {
//         props: {
//           product,
//           checkoutBadges:checkoutBadges,
//           ...(await serverSideTranslations(locale!, ['common'])),
//           // dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
//         },
//         // revalidate: 60,
//       };
//     } catch (error) {
//       return {
//         notFound: true,
//       };
//     }
//   }

// };

// // product object changes 
// function manageProduct(product: Product) {
//   const originalPrice = product.productPrice.originalPriceDecimal;
//   const finalPrice = product.productPrice.finalPriceDecimal;

//   const categories = product.categories.map((category) => {
//     return {
//       ...category,
//       id: category.id,
//       name: category.categoryDescription?.name,
//       slug: category.categoryDescription?.friendlyUrl,
//       description: category.categoryDescription?.description,
//       image: {
//         id: Number(category.id),
//         original: "",
//         thumbnail: "",
//         imageName: "",
//         imageUrl: "",
//         videoUrl: "",
//       },
//       children: [],
//       code: category.code
//     };
//   });

//   const gallery = product.images.map((image) => {
//     return {
//       id: Number(image?.id),
//       original: image?.imageUrl,
//       thumbnail: image?.imageUrl,
//       imageName: image?.imageName,
//       imageUrl: image?.imageUrl,
//       videoUrl: image?.videoUrl,
//       imageType:image?.imageType
//     };
//   });

//   const variation_options = (product.productAttributes.length > 0) ? variationsObject(product) : [];

//   const variations = (product.productAttributes.length > 0) ? product.productAttributes.map(variation => {
//     return {
//       ...product.variations,
//       id: variation.id,
//       slug: variation.option.code,
//       attribute_id: variation.option.id,
//       value: variation.optionValue.description.name,
//       meta: null,
//       pivot: {
//         product_id: product.id,
//         attribute_value_id: variation.id
//       },
//       attribute: {
//         id: variation.id,
//         slug: variation.option.code,
//         name: variation.option.description.name,
//         shop_id: 7,
//         values: [
//           {
//             id: variation.optionValue.id,
//             attribute_id: variation.option.id,
//             value: variation.optionValue.description.name,
//             meta: null,
//           }
//         ]
//       }
//     };
//   }) : [];
//   return { originalPrice, finalPrice, categories, gallery, variation_options, variations };
// }

// const combinations = (arr: any[], includeEmpty = false) => {
//   const groups = {};

//   arr.forEach(({ name, value, id, varient }) => {
//     if (!groups[name]) {
//       groups[name] = includeEmpty ? [null] : [];
//     }
//     groups[name].push({ id, varient, name, value });
//   });

//   let output = [[]];
//   Object.values(groups).forEach(group => { 
//     const temp: never[][] = [];
//     group.forEach((item: ConcatArray<never>) => {
//       output.forEach(list => temp.push(item ? list.concat(item) : list));
//     });
//     // deep copy
//     output = JSON.parse(JSON.stringify(temp));
//   });
//   return output;
// };

// const variationsObject = (product: { productAttributes: any; variation_options: any; productDescription: { name: any; }; quantity: any; sku: any; id: any; }) => {
//   let productAttributes = product.productAttributes;
//   productAttributes = productAttributes.reduce(function (r: { [x: string]: { id: any; varient: any; name: any; value: any; }[]; }, a: { optionValue: { optionCode: string | number; description: { name: any; }; }; id: any; option: { description: { name: any; }; }; }) {
//     r[a.optionValue.optionCode] = r[a.optionValue.optionCode] || [];
//     r[a.optionValue.optionCode].push({
//       id: a.id,
//       varient: a,
//       name: a.option.description.name,
//       value: a.optionValue.description.name
//     });
//     return r;
//   }, Object.create(null));
  
//   const productAttributeKeys = Object.keys(productAttributes);
  
//   const options = productAttributeKeys.flatMap(key => {
//     return productAttributes[key];
//   })

//   const optionsCombinations = combinations(options);

//   let variation_options: never[] = [];

//   optionsCombinations.flatMap(option => {
//     const varient = {
//       ...product.variation_options,
//       id: "",
//       slug: "",
//       title: product.productDescription.name,
//       image: null,
//       price: "",
//       sale_price: null,
//       quantity: product.quantity,
//       is_disable: 0,
//       sku: product.sku,
//       options: [],
//       product_id: product.id,
//     };
//     let varientTotals = 0; // need to verify

//     option.map(productAttribute => {
//       varient.id = (varient.id.length == 0) ? varient.id.concat(productAttribute.id) : varient.id.concat("-" + productAttribute.id);
//       varient.slug = productAttribute.varient.option.code;
//       varientTotals +=   productAttribute.varient.productAttributePriceWithoutCurrency; // need to verify
//       varient.sku = varient.sku + "-" + productAttribute.varient.optionValue.code;
//       varient.title = varient.title + " - " + productAttribute.varient.optionValue.code;

//       if (varient.options.length == 0) {
//         varient.options = [{
//           name: productAttribute.name,
//           value: productAttribute.value
//         }];
//       } else {
//         varient.options.push({
//           name: productAttribute.name,
//           value: productAttribute.value
//         });
//       }
//     })
//     varient.price =  product.price + varientTotals;  // need to verify
//     variation_options.push(varient);
//   })

//   return variation_options;

//   // const variation_options = product.productAttributes.map(productAttribute => {
//   //   return {
//   //     ...product.variation_options,
//   //     id: productAttribute.id,
//   //     slug: productAttribute.option.code,
//   //     title: product.productDescription.name + " - " + productAttribute.optionValue.code,
//   //     image: null,
//   //     price: productAttribute.productAttributePriceWithoutCurrency,
//   //     sale_price: null,
//   //     quantity: product.quantity,
//   //     is_disable: 0,
//   //     sku: product.sku + "-" + productAttribute.optionValue.code,
//   //     options: [
//   //       {
//   //         name: productAttribute.option.description.name,
//   //         value: productAttribute.optionValue.description.name
//   //       }
//   //     ],
//   //     product_id: product.id,
//   //   }
//   // })
// }

// const getRelatedProducts = async (id: string, storeCode: string, typeData: any) => {
//   try {
//     let response = await client.products.relatedProducts(id, storeCode);
//     let relatedProducts = response.map(product => {
//       const originalPrice = product.productPrice.originalPriceDecimal;
//       const finalPrice = product.productPrice.finalPriceDecimal;

//       const gallery = product.images.map((image) => {
//         return {
//           id: (image.id) ? Number(image.id) : null,
//           original: (image?.imageUrl) ? image?.imageUrl : null,
//           thumbnail: (image.imageUrl) ? image.imageUrl : null,
//           imageName: (image?.imageUrl) ? image?.imageUrl : null,
//           imageUrl: (image?.imageUrl) ? image?.imageUrl : null,
//           videoUrl: (image.videoUrl) ? image.videoUrl : null,
//         }
//       })

//       return {
//         ...product,
//         slug: product.productDescription.friendlyUrl,
//         name: product.productDescription.name,
//         product_type: (product.options.length > 0) ? "variable" : "simple",
//         price: originalPrice,
//         sale_price: finalPrice,
//         max_price: originalPrice,
//         min_price: originalPrice,
//         image: {
//           ...product.image,
//           original: (product.image?.imageUrl) ? product.image?.imageUrl : null,
//           thumbnail: (product.image?.imageUrl) ? product.image?.imageUrl : null,
//         },
//         images: gallery,
//         unit: product.productPrice.productUnitCode,
//         productUnitQuantity : product.productPrice.productUnitQuantity,
//         type: typeData,
//       }
//     })
//     return relatedProducts;

//   } catch (error) {

//   }

// }

// const getProductReviews = async (id: string, storeCode: string) => {
//   try {
//     let response: ProductReview[] = await client.productReviews.get(+id, storeCode);

//     return response.map(item => {
//       return {
//         ...item,
//         customer_name: item?.customer?.billing?.firstName + " " + item?.customer?.billing?.lastName ?? "",
//         review_msg: item?.description,
//         review_date: item?.date,
//         id: item?.id,
//       }
//     })
//   } catch (error) {

//   }

// }