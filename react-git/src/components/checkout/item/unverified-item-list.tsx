import { STATIC_CONTENT } from '@/lib/constants/static-content';
import { useCart } from '@/store/quick-cart/cart.context';
import { useTranslation } from 'next-i18next';
import ItemCard from './item-card';
import EmptyCartIcon from '@/components/icons/empty-cart';
import usePrice from '@/lib/use-price';
import { ItemInfoRow } from './item-info-row';
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
      {!hideTitle && (
        <div className="flex flex-col items-center mb-4 space-x-4 rtl:space-x-reverse">
          <span className="text-base font-bold text-heading">
            {STATIC_CONTENT['text-your-order']}
          </span>
        </div>
      )}
      <div className="flex flex-col py-3 border-b border-border-200">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full mb-4">
            <EmptyCartIcon width={140} height={176} />
            <h4 className="mt-6 text-base font-semibold">
              {STATIC_CONTENT['text-no-products']}
            </h4>
          </div>
        ) : (
          items?.map((item) => <ItemCard item={item} key={item.id} />)
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
      <CheckAvailabilityAction>
        {STATIC_CONTENT['text-check-availability']}
      </CheckAvailabilityAction>
    </div>
  );
};
export default UnverifiedItemList;
