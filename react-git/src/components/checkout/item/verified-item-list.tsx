import { STATIC_CONTENT } from '@/lib/constants/static-content';
import Coupon from '@/components/checkout/coupon';
import usePrice from '@/lib/use-price';
import EmptyCartIcon from '@/components/icons/empty-cart';
import { CloseIcon } from '@/components/icons/close-icon';
import { useTranslation } from 'next-i18next';
import { useCart } from '@/store/quick-cart/cart.context';
import {
  calculatePaidTotal,
  calculateTotal,
} from '@/store/quick-cart/cart.utils';
import { useAtom } from 'jotai';
import {
  VerifiedResponse,
  billingAddressAtom,
  couponAtom,
  discountAtom,
  payableAmountAtom,
  shippingAddressAtom,
  verifiedResponseAtom,
  walletAtom,
} from '@/store/checkout';
import ItemCard from '@/components/checkout/item/item-card';
import { ItemInfoRow } from '@/components/checkout/item/item-info-row';
import PaymentGrid from '@/components/checkout/payment/payment-grid';
import { PlaceOrderAction } from '@/components/checkout/place-order-action';
import Wallet from '@/components/checkout/wallet/wallet';
import { useRemoveCoupon, useSettings } from '@/framework/settings';
import { useEffect, useState } from 'react';
import cn from 'classnames';
import { RadioGroup } from '@headlessui/react';
import { authorizationAtom } from '@/store/authorization-atom';
import { getShippingQuotes } from '@/framework/shipping';
import { ShippingOption, ShippingQuotesReq } from '@/types';
import { calculateOrderTotal } from '@/framework/order';
import { orderTotalFillter } from '@/framework/utils/data-mappers';
import { toast } from 'react-toastify';
import { getLocalData } from '@/framework/client/helper';
import { shippingQouteAtom } from '@/store/shipping-qoute-atom';
import { onCalculateOrderTotalByShippingQoute } from '@/framework/utils/helper';

interface Props {
  className?: string;
}
const VerifiedItemList: React.FC<Props> = ({ className }) => {
  const cartId: string = getLocalData('cartId') ?? '';
  const {
    settings: { displayDiscountCoupon, displayShippingOptions },
  } = useSettings();
  
  const { items, isEmpty: isEmptyCart } = useCart();
  const [isAuthorize] = useAtom(authorizationAtom);
  const [verifiedResponse, setVerifiedResponse] = useAtom(verifiedResponseAtom);
  const [coupon] = useAtom(couponAtom);
  const [discount] = useAtom(discountAtom);
  const [payableAmount] = useAtom(payableAmountAtom);
  const [use_wallet] = useAtom(walletAtom);
  const [selectedShippingQuote, setSelectedShippingQuote] =
    useState<ShippingOption>();
  const [shippingQuotes, setShippingQuotes] = useState<ShippingOption[]>([]);
  const [billing_address] = useAtom(billingAddressAtom);
  const [_, setShippingQoute] = useAtom(shippingQouteAtom);
  const { mutate: removeCoupon, isLoading: removeCouponLoading } = useRemoveCoupon();

  useEffect(() => {
    fetchShippingQouteAndApply();
  }, []);

  const fetchShippingQouteAndApply = async () => {
    try {
      if (displayShippingOptions) {
        const { countryCode, postalCode } = billing_address?.billing || {};
        const reqData: ShippingQuotesReq = { countryCode, postalCode };

        const shippingQuoteList = await getShippingQuotes(isAuthorize, reqData);
        
        if (!shippingQuoteList || shippingQuoteList.length === 0) {
          setShippingQoute([]);
          return
          // throw new Error('No shipping quotes available.');
        }

        if (shippingQuoteList && shippingQuoteList.length > 0) {
          setShippingQuotes(shippingQuoteList);
          const defaultShippingOption = shippingQuoteList[0];  // NEED TO IMPROVE.....TO DO SELECT SHIPPING QUOTE
          
          const calculateTotalsData = await onCalculateOrderTotalByShippingQoute(isAuthorize, defaultShippingOption);
          
          if (calculateTotalsData) {
            const { shipping_charge, couponDiscount, tax, orderTotal, amount } = calculateTotalsData;

            const data: VerifiedResponse = {
              ...verifiedResponse,
              discount: couponDiscount ?? 0.0,
              total_tax: tax ?? 0.0,
              shipping_charge: shipping_charge ?? 0.0,
              subtotal: amount,
              total: orderTotal
            };

            setVerifiedResponse(data);
            setSelectedShippingQuote(defaultShippingOption);
            setShippingQoute(defaultShippingOption);
          }
        } 
      }
    } catch (error) {
      setShippingQoute(null);
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to fetch shipping quotes.');
      } else {
        toast.error('An error occurred while fetching shipping quotes.');
      }
    }
  };

  // shipping qoute selection... TO-DO
  const selectShippingQuote = (shippingOption: ShippingOption) => {
    // TO DO.....selecte shipping quote
  };

  const available_items = items?.filter(
    (item) => !verifiedResponse?.unavailable_products?.includes(item.id)
  );

  const { price: tax } = usePrice(
    verifiedResponse && {
      amount: verifiedResponse.total_tax ?? 0.0,
    }
  );

  const { price: shipping } = usePrice(
    verifiedResponse && {
      amount: verifiedResponse.shipping_charge ?? 0.0,
    }
  );

  const { price: sub_total } = usePrice(
    verifiedResponse && {
      amount: verifiedResponse.subtotal ?? 0.0,
    }
  );

  const { price: discountPrice } = usePrice(
    //@ts-ignore
    discount && {
      amount: discount ?? 0.0,
    }
  );

  const { price: total } = usePrice(
    verifiedResponse && {
      amount: verifiedResponse.total ?? 0.0,
    }
  );

  return (
    <div className={className}>
      <div className="flex flex-col border-b border-border-200 pb-2">
        {!isEmptyCart ? (
          items?.map((item) => {
            const notAvailable = verifiedResponse?.unavailable_products?.find(
              (d: any) => d === item.id
            );
            return (
              <ItemCard
                item={item}
                key={item.id}
                notAvailable={!!notAvailable}
              />
            );
          })
        ) : (
          <EmptyCartIcon />
        )}
      </div>

      <div className="mt-4 space-y-2">
        <ItemInfoRow title={STATIC_CONTENT['text-sub-total']} value={sub_total} />
        <ItemInfoRow title={STATIC_CONTENT['text-tax']} value={tax} />
        <ItemInfoRow title={STATIC_CONTENT['text-shipping']} value={shipping} />
        {displayDiscountCoupon &&
          (coupon ? (
            <div className="flex justify-between">
              <p className="text-sm text-body ltr:mr-4 rtl:ml-4">
                {STATIC_CONTENT['text-discount']}
              </p>
              <span className="flex items-center text-xs font-semibold text-red-500 ltr:mr-auto rtl:ml-auto">
                ({coupon?.promoCode})
                <button onClick={() => removeCoupon(cartId)}>
                  <CloseIcon className="h-3 w-3 ltr:ml-2 rtl:mr-2" />
                </button>
              </span>
              <span className="text-sm text-body">{discountPrice}</span>
            </div>
          ) : (
            <div className="mt-5 !mb-4 flex justify-between">
              <Coupon />
            </div>
          ))}
        <div className="flex justify-between border-t-4 border-double border-border-200 pt-3">
          <p className="text-base font-semibold text-heading">
            {STATIC_CONTENT['text-total']}
          </p>
          <span className="text-base font-semibold text-heading">{total}</span>
        </div>
      </div>
      {/* {verifiedResponse && (
        <Wallet
          totalPrice={totalPrice}
          walletAmount={verifiedResponse.wallet_amount}
          walletCurrency={verifiedResponse.wallet_currency}
        />
      )} */}
      {/* {use_wallet && !Boolean(payableAmount) ? null : (
        <PaymentGrid className="p-5 mt-10 border border-gray-200 bg-light" />
      )} */}

      {displayShippingOptions && shippingQuotes && shippingQuotes.length > 0 && (
        <RadioGroup
          value={selectedShippingQuote}
          onChange={selectShippingQuote}
        >
          <RadioGroup.Label className="my-5 block text-base font-semibold text-heading">
            {STATIC_CONTENT['text-choose-shipping']}
          </RadioGroup.Label>

          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3">
            {shippingQuotes &&
              shippingQuotes?.map((item: any) => (
                <RadioGroup.Option value={item} key={item.value}>
                  {({ checked }) => (
                    <div
                      className={cn(
                        'relative flex h-full w-full cursor-pointer items-center justify-center rounded border border-gray-200 bg-light py-3 text-center',
                        checked && '!border-accent bg-light shadow-600',
                        {
                          '!border-accent bg-light shadow-600':
                            'bw' === 'bw' && checked,
                        }
                      )}
                    >
                      {item.icon ? (
                        <>
                          {/* eslint-disable */}
                          <img
                            src={item.icon}
                            alt={item.name}
                            className="h-[30px]"
                          />
                        </>
                      ) : (
                        <div className="flex w-full flex-col gap-1">
                          <span className="text-xs font-semibold text-heading">
                            {item.name}
                          </span>
                          <span className="text-xs font-semibold text-heading text-green-400">
                            {item.price}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </RadioGroup.Option>
              ))}
          </div>
        </RadioGroup>
      )}

      {Boolean(payableAmount) ? null : (
        <PaymentGrid className="mt-10 border border-gray-200 bg-light p-5" />
      )}

      <PlaceOrderAction>{STATIC_CONTENT['text-place-order']}</PlaceOrderAction>
    </div>
    // enquiry 
  );
};

export default VerifiedItemList;
