import { authorizationAtom } from "@/store/authorization-atom";
import { billingAddressAtom } from "@/store/checkout";
import { ShippingQuoteResponse, ShippingQuotesReq } from "@/types";
import { useAtom } from "jotai";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import client from "./client";
import { API_ENDPOINTS } from "./client/api-endpoints";
import { getLocalData, getStore } from "./client/helper";

// export function useShippingQuotes() {
//   const [isAuthorize] = useAtom(authorizationAtom);
//   const [address] = useAtom(billingAddressAtom);
//   console.log(address);

//   const {
//     data,
//     isLoading,
//     error,
//   } = useQuery<any[], Error>(
//     [API_ENDPOINTS.SHIPPING],
//     () =>
//       getShippingQuotes(isAuthorize, { countryCode: '', postalCode: '' })
//   );

//   return {
//     shippingQuoteData: data ?? [],
//     isLoading,
//     error,
//   };
// }

export async function getShippingQuotes(isAuth: boolean, reqData: ShippingQuotesReq) {
  const cartId = getLocalData('cartId') || '';

  try {
    const response = isAuth ? await authShippingQuotes(cartId) : await guestShippingQuotes(cartId, reqData);
    const shippingOptions = response?.shippingOptions ?? [];
    
    return shippingOptions.map(shippingOption => ({
      ...shippingOption,
      name: shippingOption.optionName,
      value: shippingOption.shippingQuoteOptionId,
      price: shippingOption.optionPriceText,
    }));
  } catch (error) {
    toast.error(error.message || "Something went wrong");
    return [];
  }
}


async function authShippingQuotes(cartId: string) {
  return await client.shipping.authShippingQuotes(cartId);
}

async function guestShippingQuotes(cartId: string, reqData: ShippingQuotesReq) {
  return await client.shipping.guestShippingQuotes(cartId, reqData)
}
