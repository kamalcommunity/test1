import { STATIC_CONTENT } from '@/lib/constants/static-content';
import { useCart } from '@/store/quick-cart/cart.context';
import { useTranslation } from 'next-i18next';
import CartItem from './cart-item';
import EmptyCartIcon from '@/components/icons/empty-cart';
import usePrice from '@/lib/use-price';
import { ItemInfoRow } from '@/components/checkout/digital/item-info-row';
import { CheckAvailabilityAction } from '@/components/checkout/check-availability-action';

const UnverifiedItemList = ({ hideTitle = false }: { hideTitle?: boolean }) => {
  
  const { items, total, isEmpty } = useCart();
  const { price: subtotal } = usePrice(
    items && {
      amount: total,
    }
  );
  return (
    <div className="w-full">
      <div className="flex flex-col border-b border-dashed pb-7 border-border-400">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full mb-4">
            <EmptyCartIcon width={140} height={176} />
            <h4 className="mt-6 text-base font-semibold">
              {STATIC_CONTENT['text-no-products']}
            </h4>
          </div>
        ) : (
          items?.map((item) => <CartItem item={item} key={item.id} />)
        )}
      </div>
      <div className="mt-4 space-y-2">
        <ItemInfoRow title={STATIC_CONTENT['text-sub-total']} value={subtotal} />
        <ItemInfoRow
          title={STATIC_CONTENT['text-tax']}
          value={STATIC_CONTENT['text-calculated-checkout']}
        />
        <ItemInfoRow
          title={STATIC_CONTENT['text-estimated-shipping']}
          value={STATIC_CONTENT['text-calculated-checkout']}
        />
      </div>
      <CheckAvailabilityAction className="w-full mt-8 font-normal h-[50px] !bg-gray-800 transition-colors hover:!bg-gray-900">
        {STATIC_CONTENT['text-check-availability']}
      </CheckAvailabilityAction>
    </div>
  );
};
export default UnverifiedItemList;
