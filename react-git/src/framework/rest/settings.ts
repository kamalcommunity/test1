import type { helloBar, PageContent, PageNavigationItem, Settings } from '@/types';
import { useMutation, useQuery } from 'react-query';
import client from './client';
import { API_ENDPOINTS } from './client/api-endpoints';
import { useState } from 'react';
import { FileWithPath } from 'react-dropzone';
import { getPreviewImage } from '@/lib/get-preview-image';
import { useAtom } from 'jotai';
import { couponAtom, discountAtom, VerifiedResponse, verifiedResponseAtom } from '@/store/checkout';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { getStore, setLocalData } from "./client/helper";
import { boolean } from 'yup';
import { DEFAULT_CURRENCY } from './utils/constants';
import { orderTotalFillter } from './utils/data-mappers';
import { shippingQouteAtom } from '@/store/shipping-qoute-atom';
import { onCalculateOrderTotalByShippingQoute } from './utils/helper';
import { authorizationAtom } from '@/store/authorization-atom';

export function useSettings() {
  // const { data, isLoading, error } = useQuery<Settings, Error>(
  //   [API_ENDPOINTS.SETTINGS],
  //   client.settings.all
  // );
  // setLocalData("config", JSON.stringify(data));
  // let settings: any = data;
  // console.log(settings.displaySearchBox);
  // if (settings) {
  //   settings = {
  //     ...settings,
  //     options: {
  //       ...settings.options,
  //       logo: settings.storeLogo,
  //       siteTitle: settings.storeName,
  //       currency: settings.currency ? settings.currency : DEFAULT_CURRENCY,
  //       allowGuestUser: settings.allowGuestUser,
  //       displaySearchBox: settings.displaySearchBox,
  //       storeName: settings.storeName,
  //       allowOnlinePurchase: settings.allowOnlinePurchase,
  //       displayAddToCartOnFeaturedItems: settings.displayAddToCartOnFeaturedItems,
  //       displayCategorySection: settings.displayCategorySection,
  //       displayDiscountCoupon: settings.displayDiscountCoupon,
  //       storeAddress: settings.storeAddress,
  //       storeContactNumber: settings.storeContactNumber,
  //       storeMailAddress: settings.storeMailAddress,
  //       facebook: settings.facebook,
  //       instagram: settings.instagram,
  //       pinterest: settings.pinterest,
  //       linkedIn:settings.linkedIn,
  //       youtube:settings.youtube,
  //       twitter:settings.twitter,
  //       displayManufacturerSection: settings.displayManufacturerSection,
  //       displayFeaturedProductSection: settings.displayFeaturedProductSection,
  //       displaySlider: settings.displaySlider,
  //       displayProductPrice: settings.displayProductPrice,
  //       favicon: settings?.favicon ? settings.favicon : "",
  //       displayProductSection: settings?.displayProductSection,
  //       displayProductSectionAtHome: settings?.displayProductSectionAtHome,
  //       themeLayoutId: settings.themeLayoutId,
  //       themeLayoutName: settings.themeLayoutName,
  //       themeLayoutType: settings.themeLayoutType,
  //       themeProductCard: settings.themeProductCard,
  //       themeCode: settings.themeCode,
  //       themeLayoutColor:settings.themeLayoutColor,
  //       themeLayoutHoverColor:settings.themeLayoutHoverColor,
  //       themeLayoutTextColor:settings.themeLayoutTextColor,
  //       topHeaderBackgroundColor: settings.topHeaderBackgroundColor,
  //       topHeaderTextColor: settings.topHeaderTextColor,
  //       footerBackgroundColor:settings.footerBackgroundColor,
  //       footerTextColor:settings.footerTextColor,
  //       bottomHeaderBackgroundColor:settings.bottomHeaderBackgroundColor,
  //       bottomHeaderTextColor:settings.bottomHeaderTextColor,
  //       storeCode: settings.storeCode,
  //       displayStoreName: settings.displayStoreName,
  //       displayShippingOptions: settings?.displayShippingOptions,
  //       displayBlog: settings?.displayBlog
  //       // ...
  //     }
  //   }

  // }

  return {
    settings:  {},
    isLoading: false,
    error: {},
  };
}

export const useUploads = ({ onChange, defaultFiles }: any) => {
  const [files, setFiles] = useState<FileWithPath[]>(
    getPreviewImage(defaultFiles)
  );

  const { mutate: upload, isLoading } = useMutation(client.settings.upload, {
    onSuccess: (data) => {
      if (onChange) {
        const dataAfterRemoveTypename = data?.map(
          ({ __typename, ...rest }: any) => rest
        );

        onChange(dataAfterRemoveTypename);

        setFiles(getPreviewImage(dataAfterRemoveTypename));
      }
    },
  });

  function handleSubmit(data: File[]) {
    upload(data);
  }

  return { mutate: handleSubmit, isLoading, files };
};

export function useSubscription() {
  let [isSubscribed, setIsSubscribed] = useState(false);

  const subscription = useMutation(client.users.subscribe, {
    onSuccess: () => {
      setIsSubscribed(true);
    },
    onError: () => {
      setIsSubscribed(false);
    },
  });

  return {
    ...subscription,
    isSubscribed,
  };
}

export function useVerifyCoupon() {

  const { t } = useTranslation();
  const [_, applyCoupon] = useAtom(couponAtom);
  const [verifiedResponse, setVerifiedResponse] = useAtom(verifiedResponseAtom);
  const [shippingQuoteData] = useAtom(shippingQouteAtom);
  const [isAuthorize] = useAtom(authorizationAtom);

  let [formError, setFormError] = useState<any>(null);
  const { mutate, isLoading } = useMutation(client.coupons.verify, {
    onSuccess: async (data) => {
      if (!data) {
        setFormError({
          code: STATIC_CONTENT['error-invalid-coupon'],
        });
      } else {
        const calculateTotalsData = await onCalculateOrderTotalByShippingQoute(isAuthorize, shippingQuoteData);
          
        if (calculateTotalsData) {
          const { shipping_charge, couponDiscount, tax, orderTotal, amount } = calculateTotalsData;
          let verfiyData: VerifiedResponse = { ...verifiedResponse, discount: couponDiscount, subtotal: amount, total: orderTotal  ,  shipping_charge ,total_tax:tax};
          console.log(verfiyData);
          
          setVerifiedResponse(verfiyData);
          applyCoupon(data);
        }

      }
    },
    onError: (error) => {
      const { response: { data } }: any = error ?? {};
      const errorMessage = data?.message || STATIC_CONTENT['PICKBAZAR_ERROR.SOMETHING_WENT_WRONG'];
      toast.error(errorMessage);
    },
  });

  return { mutate, isLoading, formError, setFormError };
}

export function useRemoveCoupon() {

  const { t } = useTranslation();
  const [c, applyCoupon] = useAtom(couponAtom);
  const [verifiedResponse, setVerifiedResponse] = useAtom(verifiedResponseAtom);
  const [shippingQuoteData] = useAtom(shippingQouteAtom);
  const [isAuthorize] = useAtom(authorizationAtom);

  const { mutate, isLoading } = useMutation(client.coupons.remove, {
    onSuccess: async (data) => {
      if (data) {
        const calculateTotalsData = await onCalculateOrderTotalByShippingQoute(isAuthorize, shippingQuoteData);
          
        if (calculateTotalsData) {
          const { shipping_charge, couponDiscount, tax, orderTotal, amount } = calculateTotalsData;
          let verfiyData: VerifiedResponse = { ...verifiedResponse, discount: couponDiscount, subtotal: amount, total: orderTotal  ,  shipping_charge ,total_tax:tax};
          setVerifiedResponse(verfiyData);
          applyCoupon(null);
        }
      }
    },
    onError: (error) => {
      const { response: { data } }: any = error ?? {};
      const errorMessage = data?.message || STATIC_CONTENT['PICKBAZAR_ERROR.SOMETHING_WENT_WRONG'];
      toast.error(errorMessage);
    },
  });

  return { mutate, isLoading };
}

export const usePageNavMenus = () => {
  const { data, isLoading, error } = useQuery<PageNavigationItem[], Error>(
    [API_ENDPOINTS.NAVIGATION],
    () =>
      getPageNavMenus()
  );

  return {
    pageNavigationMenus: data ?? [],
    isLoading,
    error,
  };
};

export const useGetPage = (code: string = "") => {
  const { data, isLoading, error } = useQuery<PageContent, Error>(
    [API_ENDPOINTS.PAGES],
    () =>
      client.settings.getPage(code)
  );
  return {
    pageContent: data?.description?.description ?? "",
    isLoading,
    error,
  };
};

const getPageNavMenus = async () => {
  const response = await client.settings.pageNavMenus();
  let data: PageNavigationItem[] = [];

  if (response) {
    data = response.map(
      ({ id, code, name, contentType, visible, title, sortOrder, displayedInMenu }: PageNavigationItem) => {
        return {
          id: id,
          code: code,
          name: name,
          contentType: contentType,
          visible: visible,
          title: title,
          sortOrder: sortOrder,
          displayedInMenu: displayedInMenu,
          href: `/cms/${code}`,
          icon: "",
          label: code.toUpperCase()
        }
      })
  }
  return data;
}

export function useHelloBar() {
  const { data, isLoading, error } = useQuery<helloBar, Error>(
    [API_ENDPOINTS.PLUGIN],
    () => getHelloBar()
  );
  return {
    data,
    isLoading,
    error,
  };
}


const getHelloBar = async () => {
  const response = await client.helloBar.get();
  let parseValue: any = response && response?.value ? JSON.parse(response.value) : [];
  return {
    ...response,
    value: parseValue
  };
}

// const getPageByCode = async (code: string) => {
//   const response = await 
//   // if (response) {
//   //   data = response.map(
//   //     ({ id, code, name, contentType, visible, title, sortOrder, displayedInMenu }: PageNavigationItem) => {
//   //       return {
//   //         id: id,
//   //         code: code,
//   //         name: name,
//   //         contentType: contentType,
//   //         visible: visible,
//   //         title: title,
//   //         sortOrder: sortOrder,
//   //         displayedInMenu: displayedInMenu,
//   //         href: `/cms/${code}`,
//   //         icon: "",
//   //         label: code.toUpperCase()
//   //       }
//   //     })
//   // }
//   return response;
// }

