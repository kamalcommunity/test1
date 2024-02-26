import { PaymentModule } from "@/types";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import client from "./client";
import { API_ENDPOINTS } from "./client/api-endpoints";


export const usePaymentModules = () => {
    const { data, isLoading, error } = useQuery<PaymentModule[], Error>(
        [API_ENDPOINTS.MODULES, API_ENDPOINTS.PAYMENT],
        () => client.paymentmodules.get()
    );
    return {
        data: data ?? [],
        isLoading,
        error,
    };
}

export const useOrderInitialization = (isAuth: boolean) => {
    let url = isAuth ? client.onlinePayment.authOrderInit : client.onlinePayment.guestOrderInit;

    const { mutateAsync, isLoading, data } = useMutation(url, {
        onError: (error) => {
            const {
                response: { data },
            }: any = error ?? {};
            toast.error(data?.message);
        },
    });
    return { mutateAsync, isLoading, data };

}

export const usePaymentInitialization = (isAuth: boolean) => {
    let url = isAuth ? client.onlinePayment.authPaymentInitialization : client.onlinePayment.guestPaymentInitialization;
    
    const { mutateAsync, isLoading, data } = useMutation(url, {
        onError: (error) => {
            const {
                response: { data },
            }: any = error ?? {};
            toast.error(data?.message);
        },
    });
    return { mutateAsync, isLoading, data };
}

