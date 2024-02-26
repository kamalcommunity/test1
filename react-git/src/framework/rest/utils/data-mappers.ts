import { Total } from '@/types';
import camelCaseKeys from 'camelcase-keys';
import { TOTALS_TOTAL, TOTALS_DISCOUNT, TOTALS_SUBTOTAL, TOTALS_SHIPPING, TOTALS_TAX } from './constants';

interface Paginator {
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: any[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
  data?: any[];
}

export const mapPaginatorData = (obj: Paginator | undefined) => {
  if (!obj) return null;
  const { data, ...formattedValues } = camelCaseKeys(obj);
  return {
    ...formattedValues,
    hasMorePages: formattedValues.lastPage !== formattedValues.currentPage,
    firstItem: formattedValues.from,
    lastItem: formattedValues.to,
  };
};

export function orderTotalFillter(orderTotals: Total[]) {
  let amount: number = 0.0; // subtotal
  let orderTotal: number = 0.0; // total
  let couponDiscount: number = 0.0;//totals array[discount].value
  let shipping_charge: number = 0.0 // shipping charges
  let tax: number = 0.0 // tax charges
  orderTotals?.map(total => {
    switch (total?.code) {
      case TOTALS_TOTAL:
        orderTotal = total?.value;
        break;
      case TOTALS_DISCOUNT:
        couponDiscount = total?.value;
        break;
      case TOTALS_SUBTOTAL:
        amount = total?.value;
        break;
      case TOTALS_SHIPPING:
        shipping_charge = total?.value;
        break;
      case TOTALS_TAX:
        tax = total?.value;
        break;
      default:
        break;
    }
  });
  return { orderTotal, couponDiscount, amount, shipping_charge ,tax};
}
