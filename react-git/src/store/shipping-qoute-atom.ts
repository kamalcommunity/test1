import { ShippingOption } from "@/types";
import { atom } from "jotai";



export const shippingQouteAtom = atom<ShippingOption | null>(null);

// export const couponAtom = atom(
//     (get) => get(checkoutAtom).coupon,
//     (get, set, data: any | null) => {
//       const prev = get(checkoutAtom);
//       return set(checkoutAtom, { ...prev, coupon: data });
//     }
//   );