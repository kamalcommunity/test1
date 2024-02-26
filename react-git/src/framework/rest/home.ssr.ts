import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import invariant from 'tiny-invariant';
import { QueryClient } from 'react-query';
import { API_ENDPOINTS } from '@/framework/client/api-endpoints';
import { dehydrate } from 'react-query/hydration';
import client from '@/framework/client';
import { Category, CategoryQueryOptions, PopularProductQueryOptions, TypeQueryOptions } from '@/types';
import { CATEGORIES_PER_PAGE, PRODUCTS_PER_PAGE, TYPES_PER_PAGE } from '@/framework/client/variables';
import { findType, formateCataloges, formateCateogries, formateProductGroups, formateProductImages, formateProductsData, formateProductsWithQueryData } from './utils/helper';
import { TYPE_DATA, TYPE_DEFUALT_INDEX } from './utils/constants';

export const getServerSideProps: GetServerSideProps = async ({
    locale,
    params,
    req
}) => {
    invariant(params, 'params is required');
    const { searchType } = params;
    const queryClient = new QueryClient();


    try {
        if (req.headers.host) {
            let settings: any = await client.settings.all({
                host: req.headers.host
            });
    
            // Find type on layout type basis 
            const pageType =
                settings && settings?.themeLayoutType
                    ? TYPE_DATA.find(res => res.settings.layoutType === settings?.themeLayoutType)
                    : TYPE_DATA[TYPE_DEFUALT_INDEX];
    
            // DEFAULT SETTINGS
            const productVariables = {
                type: pageType,
                limit: PRODUCTS_PER_PAGE,
                store: settings?.storeCode
            };
    
            // DEFAULT SETTINGS
            const popularProductVariables = {
                type_slug: pageType,
                limit: 10,
                with: 'type;author',
            };
    
            // DEFAULT SETTINGS
            const catalogsVariables = {
                store: settings?.storeCode,
            };
    
            // DEFAULT SETTINGS
            const categoryVariables = {
                store: settings?.storeCode,
                type: pageType,
                // type: pageType,
                limit: CATEGORIES_PER_PAGE,
                parent:
                    pageType?.settings.layoutType === 'minimal'
                        ? 'all'
                        : 'null',
            };
    
            // DEFAULT SETTINGS
            const productsGroupsVariables = {
                store: settings?.storeCode,
                type: pageType,
                // type: pageType,
                // limit: CATEGORIES_PER_PAGE,
                // parent:
                //     pageType?.settings.layoutType === 'minimal'
                //         ? 'all'
                //         : 'null',
            };
    
            // await queryClient.prefetchInfiniteQuery(
            //     [API_ENDPOINTS.CATEGORIES, categoryVariables],
            //     ({ queryKey }) => client.categories.all(queryKey[1] as CategoryQueryOptions)
            // );
    
            // await queryClient.prefetchQuery(
            //     [[API_ENDPOINTS.PRODUCTS, API_ENDPOINTS.GROUPS], productsGroupsVariables],
            //     ({ queryKey }) => {
            //         let store = queryKey[1]?.store;
            //         return client.products.productGroups(store)
    
            //     }
            // );
    
            // await queryClient.prefetchQuery(
            //     [API_ENDPOINTS.CATALOGS, catalogsVariables],
            //     ({ queryKey }) => client.catalog.all(queryKey[1] as any)
            // );
    
            // await queryClient.prefetchInfiniteQuery(
            //     [API_ENDPOINTS.PRODUCTS, productVariables],
            //     ({ queryKey }) => {
            //         let params = queryKey[1] as any;
            //         return getProducts(params , pageType);
    
            //     }
            // );
    
            return {
                props: {
                    variables: {
                        popularProducts: popularProductVariables ?? "null",
                        products: productVariables ?? "null",
                        categories: categoryVariables ?? "null",
                        types: {
                            type: pageType ?? "null",
                        },
                    },
                    metaProperties: {
                        // title: "hii title"
                        title: settings?.storeName,
                        logo: settings?.storeLogo,
                    },
                    type: settings?.themeLayoutType ?? "null",
                    ...(await serverSideTranslations(locale!, ['common'])),
                    dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
                },
            };
        }
    } catch (error) {
        return {
            redirect: {
                destination: '/500',
                permanent: false
            }
        }
    }

};


// API call function 
const getProducts = async ({ ...params } , typeData) => {
    const response = await client.products.all(params);
    const products = response?.products?.map(product => {
        const originalPrice = product?.productPrice?.originalPriceDecimal;
        const finalPrice = product?.productPrice?.finalPriceDecimal;
        const gallery = formateProductImages(product.images)
        return formateProductsData(product, originalPrice, finalPrice, gallery, typeData)
    });
    return formateProductsWithQueryData(products, response, params);
}