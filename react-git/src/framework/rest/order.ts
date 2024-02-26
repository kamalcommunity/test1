import {
  CalculateOrderTotalResponse,
  DownloadableFilePaginator,
  Order,
  OrderPaginator,
  OrderQueryOptions,
  OrderStatus,
  OrderStatusPaginator,
  QueryOptions,
  Total,
} from '@/types';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { API_ENDPOINTS } from './client/api-endpoints';
import client from './client';
import { useAtom } from 'jotai';
import { verifiedResponseAtom } from '@/store/checkout';
import { useRouter } from 'next/router';
import { ROUTES } from '@/lib/routes';
import { mapPaginatorData, orderTotalFillter } from '@/framework/utils/data-mappers';
import { ORDERS_PER_PAGE } from './client/variables';
import { ORDER_STATUS_DATA, TEXT_VALUES } from './utils/constants';
import { authorizationAtom } from '@/store/authorization-atom';
import { getLocalData, getStore } from './client/helper';
import { useState } from 'react';
// import { authorizationAtom } from '@/store/authorization-atom';

export function useOrders(options?: Partial<OrderQueryOptions>) {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery<OrderPaginator, Error>(
    [API_ENDPOINTS.AUTH + API_ENDPOINTS.ORDERS, options],
    ({ queryKey, pageParam }) =>
      // client.orders.all(Object.assign({}, queryKey[1], pageParam)),
      getOrders(Object.assign({}, queryKey[1], pageParam)),
    {
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 },
    }
  );
  function handleLoadMore() {
    fetchNextPage();
  }
  return {
    orders: data?.pages.flatMap((page) => page.data) ?? [],
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


export function useOrder({ tracking_number }: { tracking_number: string }) {
  const [isAuthorize] = useAtom(authorizationAtom);

  const { data, isLoading, error } = useQuery<Order, Error>(
    [API_ENDPOINTS.ORDERS, tracking_number],
    () => getOrder(tracking_number, isAuthorize)
  );

  return {
    order: data,
    isLoading,
    error,
  };
}

export function useOrderStatuses(options: Pick<QueryOptions, 'limit'>) {
  const {
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
  } = useInfiniteQuery<OrderStatusPaginator, Error>(
    [API_ENDPOINTS.ORDERS_STATUS, options],
    ({ queryKey, pageParam }) =>
      client.orders.statuses(Object.assign({}, queryKey[1], pageParam)),
    {
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 },
    }
  );

  function handleLoadMore() {
    fetchNextPage();
  }

  return {
    orderStatuses: data?.pages.flatMap((page) => page.data) ?? [],
    paginatorInfo: Array.isArray(data?.pages)
      ? mapPaginatorData(data?.pages[data.pages.length - 1])
      : null,
    isLoading: isFetching,
    isLoadingMore: isFetchingNextPage,
    error,
    loadMore: handleLoadMore,
    hasMore: Boolean(hasNextPage),
  };
}

export function useRefunds(options: Pick<QueryOptions, 'limit'>) {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
  } = useInfiniteQuery(
    [API_ENDPOINTS.ORDERS_REFUNDS, options],
    ({ queryKey, pageParam }) =>
      client.orders.refunds(Object.assign({}, queryKey[1], pageParam)),
    {
      getNextPageParam: ({ current_page }) => ({ page: current_page + 1 }),
    }
  );

  function handleLoadMore() {
    fetchNextPage();
  }

  return {
    refunds: data?.pages.flatMap((page) => page.data) ?? [],
    paginatorInfo: Array.isArray(data?.pages)
      ? mapPaginatorData(data?.pages[data.pages.length - 1])
      : null,
    isLoading,
    isLoadingMore: isFetchingNextPage,
    error,
    loadMore: handleLoadMore,
    hasMore: Boolean(hasNextPage),
  };
}

export const useDownloadableProducts = (
  options: Pick<QueryOptions, 'limit'>
) => {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
  } = useInfiniteQuery<DownloadableFilePaginator, Error>(
    [API_ENDPOINTS.ORDERS_DOWNLOADS, options],
    ({ queryKey, pageParam }) =>
      client.orders.downloadable(Object.assign({}, queryKey[1], pageParam)),
    {
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 },
    }
  );

  function handleLoadMore() {
    fetchNextPage();
  }

  return {
    downloads: data?.pages.flatMap((page) => page.data) ?? [],
    paginatorInfo: Array.isArray(data?.pages)
      ? mapPaginatorData(data?.pages[data.pages.length - 1])
      : null,
    isLoading,
    isLoadingMore: isFetchingNextPage,
    error,
    loadMore: handleLoadMore,
    hasMore: Boolean(hasNextPage),
  };
};

export function useCreateRefund() {
  const { t } = useTranslation();
  const { closeModal } = useModalAction();
  const queryClient = useQueryClient();
  const { mutate: createRefundRequest, isLoading } = useMutation(
    client.orders.createRefund,
    {
      onSuccess: () => {
        toast.success(STATIC_CONTENT['text-refund-request-submitted']);
      },
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.ORDERS);
        closeModal();
      },
    }
  );
  return {
    createRefundRequest,
    isLoading,
  };
}

export function useCreateOrder() {
  const router = useRouter();

  const { mutate: createOrder, isLoading } = useMutation(client.orders.create, {
    onSuccess: (data) => {
      if (data?.tracking_number) {
        router.push(`${ROUTES.ORDERS}/${data?.tracking_number}`);
      }
    },
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};
      toast.error(data?.message);
    },
  });

  return {
    createOrder,
    isLoading,
  };
}

export function useGenerateDownloadableUrl() {
  const { mutate: getDownloadableUrl } = useMutation(
    client.orders.generateDownloadLink,
    {
      onSuccess: (data) => {
        function download(fileUrl: string, fileName: string) {
          var a = document.createElement('a');
          a.href = fileUrl;
          a.setAttribute('download', fileName);
          a.click();
        }

        download(data, 'record.name');
      },
    }
  );

  function generateDownloadableUrl(digital_file_id: string) {
    getDownloadableUrl({
      digital_file_id,
    });
  }

  return {
    generateDownloadableUrl,
  };
}

export function useVerifyOrder() {
  const [_, setVerifiedResponse] = useAtom(verifiedResponseAtom);
  // clientFn = client.cart.getGuestCart(cartId)
  return useMutation(client.cart.getGuestCart, {
    onSuccess: (data) => {

      if (data) {
        // debugger
        const {amount , orderTotal , shipping_charge , tax} = orderTotalFillter(data.totals);
        //@ts-ignore
        let verifiedData = {
          discount: 0,
          total_tax: tax,
          shipping_charge: shipping_charge,
          unavailable_products: [],
          wallet_currency: 0,
          wallet_amount: 0,
          subtotal: amount,
          total: orderTotal,
        }
        setVerifiedResponse(verifiedData);
      }
    },
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};

      toast.error(data?.message);
    },
  });

}


export function useCalculateOrderTotal() {
  const [isAuthorize] = useAtom(authorizationAtom);

  const {
    data,
    isLoading,
    error,
  } = useInfiniteQuery<any, Error>(
    [API_ENDPOINTS.TOTAL],
    () =>
      calculateOrderTotal(isAuthorize)
  );

  return {
    calculateData: data ?? {},
    isLoading,
    error,
  };
}


export function useInquiry() {
  const { closeModal } = useModalAction();
  // const { productCtx, setProductDetailsCtx } = useProductDetailsContext();
  const router = useRouter();
  let [serverError, setServerError] = useState<string | null>(null);

  // Call this function whenever you want to
  // refresh props!
  // const refreshData = () => {
  //   router.replace(router.asPath);
  // }

  const { mutate, isLoading } = useMutation(client.inquiry.createInquiry, {
    onSuccess: (data) => {
      if (data) {
        toast.success('review-success-create-msg')
        closeModal();
      }
    },
    onError: (error: Error) => {
      console.log(error.message);
    },
  });

  return { mutate, isLoading, serverError, setServerError };
}

// export function useContactus() {
//   const router = useRouter();
//   let [serverError, setServerError] = useState<string | null>(null);


//   const { mutate, isLoading } = useMutation(client.contactUs.createContact, {
//     onSuccess: (data) => {
//       if (data) {
//         toast.success('review-success-create-msg')
//       }
//     },
//     onError: (error: Error) => {
//       console.log(error.message);
//     },
//   });

//   return { mutate, isLoading, serverError, setServerError };
// }


const getOrders = async ({ ...params }) => {
  let customerId: number; // customer object
  let salesTax: number = 0.0; // tax object values tax.value
  let coupon: string; //totals array[discount].text
  let deliveryFee: number; // shipping.value
  let billingAddress;
  let orderStatus: OrderStatus;
  let shippingAddress;

  const response = await client.orders.all(params);
  const orders: any = response?.orders?.map((order: Order) => {
    const { orderTotal, couponDiscount, amount } = orderTotalFillter(order.totals);
    customerId = order?.customer?.id;
    salesTax = order?.tax?.value;
    deliveryFee = order?.shipping?.value;
    shippingAddress = {
      country: order?.customer?.delivery?.country,
      city: order?.customer?.delivery?.city,
      state: order?.customer?.delivery?.stateProvince,
      zip: order?.customer?.delivery?.postalCode,
      street_address: order?.customer?.delivery?.address

    }
    billingAddress = {
      country: order?.customer?.billing?.country,
      city: order?.customer?.billing?.city,
      state: order?.customer?.billing?.stateProvince,
      zip: order.customer?.billing?.postalCode,
      street_address: order?.customer?.delivery?.address
    }

    // order stauts obj 
    orderStatus = ORDER_STATUS_DATA[order?.orderStatus];
    // map products array 
    let products = order.products.map(product => {
      let priceMultiplyByQunatity = (product?.product?.price * product?.orderedQuantity);
      return {
        ...product,
        unit: `${product?.product?.productPrice?.productUnitQuantity}\u00A0${product?.product?.productPrice?.productUnitCode}`,
        name: product?.productName,
        image: {
          id: product?.product?.image?.id,
          original: product?.product?.image?.imageUrl,
          thumbnail: product?.product?.image?.imageUrl
        },
        pivot: {
          order_id: order?.id,
          product_id: product?.id,
          order_quantity: product?.orderedQuantity,
          unit_price: product?.product?.price,
          subtotal: priceMultiplyByQunatity,
          variation_option_id: null,
          created_at: "" + order?.created_at,
          updated_at: "" + order?.updated_at,
        }
      }
    })
    return {
      ...orders,
      id: order?.id,
      tracking_number: order?.id,
      customer_id: order?.customer?.id,
      amount: amount,
      children: order?.children || [],
      sales_tax: salesTax,
      total: orderTotal,
      status: orderStatus,
      paid_total: orderTotal,
      payment_id: 0,
      payment_gateway: order?.paymentType,
      coupon: coupon,
      discount: couponDiscount,
      delivery_fee: deliveryFee,
      delivery_time: "",
      products: products || [],
      created_at: order?.datePurchased,
      updated_at: order?.updated_at,
      billing_address: billingAddress,
      shipping_address: shippingAddress,
      variation_options: [],
    }
  });

  return {
    data: orders,
    orders: orders,
    total: response.recordsTotal,
    recordsTotal: response.recordsTotal,
    recordsFiltered: response.recordsFiltered,
    totalPages: response.totalPages,
    number: response.number,
    current_page: (params.page) ? params.page : 0,
    count: ORDERS_PER_PAGE,
    last_page: response.totalPages - 1,
    firstItem: 0,
    lastItem: response.recordsTotal - 1,
    per_page: ORDERS_PER_PAGE,
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


const getOrder = async (id: string, isAuth: boolean) => {

  let coupon: string = ""; //totals array[discount].text
  let billingAddress;
  let orderStatus: OrderStatus;
  let shippingAddress;
  let order: Order;
  if (isAuth) {
    order = await client.orders.get(id);
  } else {
    order = await client.orders.getGuest(id);
  }
  const { orderTotal, couponDiscount, amount } = orderTotalFillter(order.totals);
  shippingAddress = {
    country: order?.billing?.country,
    city: order?.billing?.city,
    state: order?.billing?.stateProvince,
    zip: order.billing?.postalCode,
    street_address: order?.billing?.address
  }
  billingAddress = {
    country: order?.billing?.country,
    city: order?.billing?.city,
    state: order?.billing?.stateProvince,
    zip: order.billing?.postalCode,
    street_address: order?.billing?.address
  }

  //   // order stauts obj 
  orderStatus = ORDER_STATUS_DATA[order?.orderStatus];
  //   // map products array 
  let products = order.products.map(product => {
    let priceMultiplyByQunatity = (product?.product?.price * product?.orderedQuantity);

    return {
      ...product,
      unit: `${product?.product?.productPrice?.productUnitQuantity}\u00A0${product?.product?.productPrice?.productUnitCode}`,
      name: product?.productName,
      image: {
        id: product?.product?.image?.id,
        original: product?.product?.image?.imageUrl,
        thumbnail: product?.product?.image?.imageUrl
      },
      pivot: {
        order_id: order?.id,
        product_id: product?.id,
        order_quantity: product?.orderedQuantity,
        unit_price: product?.product?.price,
        subtotal: priceMultiplyByQunatity,
        variation_option_id: null,
        created_at: "" + order?.created_at,
        updated_at: "" + order?.updated_at,
      }
    }
  })
  return {
    ...order,
    id: order?.id,
    tracking_number: order?.id,
    customer_id: order?.customer?.id,
    amount: amount,
    children: order?.children || [],
    sales_tax: order?.tax?.value,
    total: orderTotal,
    status: orderStatus,
    paid_total: orderTotal,
    payment_id: 0,
    payment_gateway: order?.paymentType,
    coupon: coupon,
    discount: couponDiscount,
    delivery_fee: order?.shipping?.value,
    delivery_time: "",
    products: products || [],
    created_at: order?.datePurchased,
    updated_at: order?.updated_at,
    billing_address: billingAddress,
    shipping_address: shippingAddress,
    variation_options: [],

  }
}

export const calculateOrderTotal = async (isAuth: boolean, quote: string) => {
  const cartId = getLocalData(TEXT_VALUES.CART_ID) || '';
  const baseUrl = isAuth ? API_ENDPOINTS.AUTH : '';
  const url = `${baseUrl}${API_ENDPOINTS.CART}/${cartId}${API_ENDPOINTS.TOTAL}?store=${getStore()}&${TEXT_VALUES.QUOTE}=${quote}`;

  try {
    const  data: CalculateOrderTotalResponse = await client.orders.calculateOrderTotal(url);
    return data ?? {};
  } catch (error) {
    throw new Error(error?.message ||'Failed to calculate order total.');
  }
}

