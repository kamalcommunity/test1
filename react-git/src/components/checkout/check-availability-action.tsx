import { formatOrderedProduct } from '@/lib/format-ordered-product';
import { useAtom } from 'jotai';
import { billingAddressAtom, shippingAddressAtom } from '@/store/checkout';
import Button from '@/components/ui/button';
import { useCart } from '@/store/quick-cart/cart.context';
import classNames from 'classnames';
import { useVerifyOrder } from '@/framework/order';
import omit from 'lodash/omit';
import { getLocalData } from '@/framework/client/helper';

export const CheckAvailabilityAction: React.FC<{ className?: string }> = (
  props
) => {
  // const [billing_address] = useAtom(billingAddressAtom);
  // const [shipping_address] = useAtom(shippingAddressAtom);
  const { items, total, isEmpty } = useCart();
  const cartId = getLocalData('cartId') ?? '';

  const { mutate: verifyCheckout, isLoading: loading } = useVerifyOrder();
  const [billing_address] = useAtom(billingAddressAtom);


  function handleVerifyCheckout() {
    verifyCheckout(cartId);
  }
  
  return (
    <>
      <Button
        loading={loading}
        className={classNames('mt-5 w-full', props.className)}
        onClick={handleVerifyCheckout}
        disabled={!(!!billing_address) || isEmpty}
        {...props}
      />
    </>
  );
};
