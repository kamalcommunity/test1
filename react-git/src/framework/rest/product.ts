import type {
  GroupProductPaginator,
  PopularProductQueryOptions,
  Product,
  ProductGroupItem,
  ProductGroupsQueryOptions,
  ProductPaginator,
  ProductQueryOptions,
  ProductReview,
  QueryOptions,
  Type,
} from '@/types';
import { useInfiniteQuery, useMutation, useQuery } from 'react-query';
import client from './client';
import { API_ENDPOINTS } from './client/api-endpoints';
import { mapPaginatorData } from '@/framework/utils/data-mappers';
import { formatProductsArgs } from '@/framework/utils/format-products-args';
import { PRODUCTS_PER_PAGE } from "./client/variables"
import { TYPE_DATA, TYPE_DEFUALT_INDEX } from './utils/constants';
import { findType } from './utils/helper';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

export function useProducts(options?: Partial<ProductQueryOptions>) {
  
  const formattedOptions = formatProductsArgs(options);
  // debugger
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery<ProductPaginator, Error>(
    [API_ENDPOINTS.PRODUCTS, formattedOptions],
    ({ queryKey, pageParam }) =>
      getProducts(Object.assign({}, queryKey[1], pageParam)),
    {
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 },
    }
  );

  
  function handleLoadMore() {
    fetchNextPage();
  }
  
  return {
    products: data?.pages.flatMap((page) => page.data) ?? [],
    paginatorInfo: Array.isArray(data?.pages)
      ? mapPaginatorData(data?.pages[data.pages.length - 1])
      : null,
    isLoading,
    error,
    isFetching,
    isLoadingMore: isFetchingNextPage,
    loadMore: handleLoadMore,
    hasMore: Boolean(hasNextPage),
  };
}

export const usePopularProducts = (
  options?: Partial<PopularProductQueryOptions>
) => {
  const formattedOptions = formatProductsArgs(options);
  const { data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage, } = useInfiniteQuery<ProductPaginator, Error>(
      [API_ENDPOINTS.FEATURED_ITEM, formattedOptions],
      ({ queryKey, pageParam }) =>
        getPopularProducts(Object.assign({}, queryKey[1], pageParam)),
      {
        getNextPageParam: ({ current_page, last_page }) =>
          last_page > current_page && { page: current_page + 1 },
      }

    );
  function handleLoadMore() {
    fetchNextPage();
  }

  return {
    products: data?.pages.flatMap((page) => page.data) ?? [],
    paginatorInfo: Array.isArray(data?.pages)
      ? mapPaginatorData(data?.pages[data.pages.length - 1])
      : null,
    isLoading,
    error,
    isFetching,
    isLoadingMore: isFetchingNextPage,
    loadMore: handleLoadMore,
    hasMore: Boolean(hasNextPage),
  };
};

export function useProduct({ slug, store }: { slug: string, store?: string }) {
  // let typeData = findType(slug);
  const { data, isLoading, error } = useQuery<Product, Error>(
    [API_ENDPOINTS.PRODUCTS, slug],
    () => client.products.get(slug, store)
  );

  let product = data;

  if (product) {

    const originalPrice = product.productPrice.originalPriceDecimal;
    const finalPrice = product.productPrice.finalPriceDecimal;
    const categories = formateCategories(product.categories);
    const gallery = formateProductImages(product.images);


    product = {
      ...product,
      slug: product.productDescription.friendlyUrl ?? "",
      name: product.productDescription.name,
      description: product.productDescription.description ?? "",
      price: originalPrice,
      sale_price: finalPrice,
      image: {
        ...product.image,
        original: product.image?.imageUrl,
        thumbnail: product.image?.imageUrl
      },
      originalPrice: originalPrice,
      finalPrice: finalPrice,
      categories: categories,
      gallery: gallery
    }
  }

  return {
    product: product,// data,
    isLoading,
    error,
  };
}

export function useProductGroups(options?: any) {
  const { data, isLoading, error } = useQuery<ProductGroupItem[] | any[], Error>(
    [API_ENDPOINTS.GROUPS, options],
    ({ queryKey }) => getProductGroups(queryKey[1] as QueryOptions)
  );
  return {
    productGroups: data ?? [],
    isLoading,
    error,
  };
}


export function useGroupProducts(options?: Partial<ProductGroupsQueryOptions>) {
  const formattedOptions = formatProductsArgs(options);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery<GroupProductPaginator, Error>(
    [API_ENDPOINTS.GROUP, formattedOptions],
    ({ queryKey, pageParam }) =>
      getGroupProducts(Object.assign({}, queryKey[1], pageParam)),
    {
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 },
    }
  );

  function handleLoadMore() {
    fetchNextPage();
  }

  return {
    products: data?.pages.flatMap((page) => page.data) ?? [],
    paginatorInfo: Array.isArray(data?.pages)
      ? mapPaginatorData(data?.pages[data.pages.length - 1])
      : null,
    isLoading,
    error,
    isFetching,
    isLoadingMore: isFetchingNextPage,
    loadMore: handleLoadMore,
    hasMore: Boolean(hasNextPage),
  };
}

export function useProductReview() {
  const { closeModal } = useModalAction();
  // const { productCtx, setProductDetailsCtx } = useProductDetailsContext();
  const router = useRouter();
  let [serverError, setServerError] = useState<string | null>(null);

  // Call this function whenever you want to
  // refresh props!
  const refreshData = () => {
    router.replace(router.asPath);
  }

  const { mutate, isLoading } = useMutation(client.productReviews.createReview, {
    onSuccess: (data) => {

      if (data) {
        refreshData();
        toast.success('review-success-create-msg')
        closeModal();
      }
    },
    onError: (error: Error) => {
      setServerError(error?.response?.data?.message);
      console.log(error.message);
    },
  });

  return { mutate, isLoading, serverError, setServerError };
}

// API call function 
const getProducts = async ({ ...params }) => {
  let typeData = findType(params);
  const response = await client.products.all(params);
  
  const products:Product[] = response?.products?.map(product => {
    const originalPrice = product?.productPrice?.originalPriceDecimal;
    const finalPrice = product?.productPrice?.finalPriceDecimal;
    const gallery = formateProductImages(product.images)
    return formateProductsData(product, originalPrice, finalPrice, gallery, typeData)
  });
  return formateProductsWithQueryData(products, response, params);
}

// API call function 
const getPopularProducts = async ({ ...params }) => {
  let typeData = findType(params);
  const response = await client.products.popular(params);
  const products = response?.products?.map(product => {
    const originalPrice = product?.productPrice?.originalPriceDecimal;
    const finalPrice = product?.productPrice?.finalPriceDecimal;
    const gallery = formateProductImages(product.images)
    return formateProductsData(product, originalPrice, finalPrice, gallery, typeData)
  });
  return formateProductsWithQueryData(products, response, params);
}

// API call function 
const getProductGroups = async ({ ...params }) => {
  let typeData = findType(params);
  const productGroups = await client.products.productGroups();
  const productGroupsResponse =
    productGroups && productGroups?.groupList?.map((productGroup: ProductGroupItem) => {
      const products = productGroup.products?.map(product => {
        const originalPrice = product?.productPrice?.originalPriceDecimal;
        const finalPrice = product?.productPrice?.finalPriceDecimal;
        const gallery = formateProductImages(product.images)
        return formateProductsData(product, originalPrice, finalPrice, gallery, typeData)
      });
      return {
        products,
        id: productGroup?.id,
        name: productGroup?.code.toUpperCase(),
        code: productGroup?.code,
        is_approved: productGroup?.active,
        image: {
          id: productGroup?.id,
          original: productGroup?.readableImage?.path,
          thumbnail: productGroup?.readableImage?.path
        },
        slug: productGroup?.code,
        title: productGroup?.title,
        subTitle: productGroup?.description,
        socials: [],
      }
    })
  return productGroupsResponse;
};

// NOTE: GET PRODUCT FOR A GROUP BY GROUP CODE(READY FOR USE....)

// API call function 
// const getGroupProducts = async ({ ...params }) => {
//   let typeData = findType(params);
//   const response = await client.products.getGroupProductsByCode(params.code);
//   const products = response?.products?.map(product => {
//     const originalPrice = product?.productPrice?.originalPriceDecimal;
//     const finalPrice = product?.productPrice?.finalPriceDecimal;
//     const gallery = formateProductImages(product.images)
//     return formateProductsData(product, originalPrice, finalPrice, gallery, typeData)
//   });
//   return formateProductsWithQueryData(products, response, params);
// };



// common function for formate product data
function formateProductsWithQueryData(products: Product[], response: never[] | ProductPaginator, params: { [x: string]: any; }) {
  return {
    data: products,
    products: products,
    total: response.recordsTotal,
    recordsTotal: response.recordsTotal,
    recordsFiltered: response.recordsFiltered,
    totalPages: response.totalPages,
    number: response.number,
    current_page: (params.page) ? params.page : 0,
    count: PRODUCTS_PER_PAGE,
    last_page: response.totalPages - 1,
    firstItem: 0,
    lastItem: response.recordsTotal - 1,
    per_page: PRODUCTS_PER_PAGE,
    links: [],
    path: "",
    to: 0,
    from: response.recordsTotal - 1,
    first_page_url: "",
    last_page_url: "",
    next_page_url: "",
    prev_page_url: ""
  };
}

// common function for formate product data
function formateProductsData(
  product: Product,
  originalPrice: any,
  finalPrice: any,
  gallery: any[],
  typeData: Type | any
) {
  return {
    ...product,
    slug: product?.productDescription?.friendlyUrl,
    name: product?.productDescription?.name,
    product_type: (product.options.length > 0) ? "variable" : "simple",
    price: originalPrice,
    sale_price: finalPrice,
    max_price: originalPrice,
    min_price: originalPrice,
    image: {
      ...product.image,
      original: product.image?.imageUrl,
      thumbnail: product.image?.imageUrl
    },
    images: gallery,
    unit: product?.productPrice?.productUnitCode,
    type: typeData,
    description: product.productDescription.description ?? "",
    available: product?.available
  };
}

// common function for formate product data
function formateProductImages(images: any[]): any[] {
  return images.map((image) => {
    return {
      id: Number(image.id),
      original: image?.imageUrl,
      thumbnail: image?.imageUrl,
      imageName: image?.imageName,
      imageUrl: image?.imageUrl,
      videoUrl: image?.videoUrl,
      imageType:image?.imageType
    }
  })
}

// common function for formate product data
function formateCategories(categories: any[]) {
  return categories.map((category) => {
    return {
      ...category,
      id: category.id,
      name: category.categoryDescription?.name,
      slug: category.categoryDescription?.friendlyUrl ?? "",
      description: category.categoryDescription?.description ?? "",
      image: {
        id: Number(category.id),
        original: "",
        thumbnail: "",
        imageName: "",
        imageUrl: "",
        videoUrl: "",
      },
      children: [],
      code: category.code
    }
  })
}