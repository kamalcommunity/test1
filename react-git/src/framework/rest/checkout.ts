import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";
import client from "./client";
import { toast } from 'react-toastify';
import { useTranslation } from "next-i18next";


export const useCheckout = (isAuth: boolean) => {
  // console.log('useCheckout start.....');

  
  const router = useRouter();
  let url = isAuth ? client.checkout.authcheckout : client.checkout.guestcheckout;
  const { mutate: checkout, isLoading } = useMutation(url, {
    onSuccess: (data) => {
      // console.log('on succesfull.....', data);

      if (data?.id) {
        let tracking_number = data?.id;
        router.push(`${ROUTES.ORDERS}/${tracking_number}`);
        toast.success('Order Successful');
      }
    },
    onError: (error: any) => {
      // console.log('on error .....', error);

      const { response: { data } }: any = error ?? {};
      const errorMessage = data?.mesage || STATIC_CONTENT['PICKBAZAR_ERROR.SOMETHING_WENT_WRONG'];
      toast.error(errorMessage);
    },
  });

  return {
    checkout,
    isLoading,
  };

}