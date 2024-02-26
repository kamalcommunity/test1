import { Product, ProductReview } from "@/types";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

interface ProductState {
    product: Product | null,
    product_review: ProductReview[],
    product_review_count: number
}
export const defaultProduct: ProductState = {
    product: null,
    product_review: [],
    product_review_count: 0
};

// Original atom.
// export const productAtom = atomWithStorage('product', defaultProduct);

export const clearproductAtom = atom(null, (_get, set, _data) => {
    return set(productAtom, defaultProduct);
});

export const productAtom = atom<ProductState>({
    product: null,
    product_review: [],
    product_review_count: 0
});


// export const setProductAtom = atom(
//     (get) => get(productAtom),
//     (get, set, data: ProductState) => {
//         const prev = get(productAtom);
//         return set(productAtom, { ...prev, product: data.product, product_review: data.product_review, product_review_count: data.product_review_count });
//     }
// );