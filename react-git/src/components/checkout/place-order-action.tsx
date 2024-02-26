import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import isEmpty from 'lodash/isEmpty';
import classNames from 'classnames';
import Button from '@/components/ui/button';
import { useCart } from '@/store/quick-cart/cart.context';
import { checkoutAtom, discountAtom, shippingAddressAtom } from '@/store/checkout';
import {
  calculateTotal,
} from '@/store/quick-cart/cart.utils';
import { useCheckout } from '@/framework/checkout';
import { authorizationAtom } from '@/store/authorization-atom';
import { getLocalData } from '@/framework/client/helper';
import {
  DEFAULT_CURRENCY,
  INIT,
  ONLINEPAYMENT,
  PAYMENT,
  PAYMENT_FAILED,
  RECEIPT_ORDER,
} from '@/framework/utils/constants';
import {
  Payment,
  CheckoutReq,
  CheckoutCustomerDetails,
  OrderInitCustomerData,
  OrderInitializationRequest,
  PaymentInitializationRequest,
} from '@/types';
import {
  useOrderInitialization,
  usePaymentInitialization,
} from '@/framework/payment';
import { orderInitializationAtom } from '@/store/payment-atom';
import useRazorpay from 'react-razorpay';
import { toast } from 'react-toastify';
import { useSettings } from '@/framework/settings';
import { useTranslation } from 'next-i18next';
import { shippingQouteAtom } from '@/store/shipping-qoute-atom';


export const PlaceOrderAction: React.FC<{ className?: string }> = (props) => {
  const { t } = useTranslation();
  const Razorpay = useRazorpay();
  // const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAuthorize] = useAtom(authorizationAtom);
  const { checkout } = useCheckout(isAuthorize);
  const [cartId, setcartId] = useState<string>('');
  const [orderId] = useAtom(orderInitializationAtom);
  const { mutateAsync: orderInitialization, isLoading: orderInitIsLoading } = useOrderInitialization(isAuthorize);
  const { mutateAsync: paymentInitialization } = usePaymentInitialization(isAuthorize);
  const { settings: { storeName, currency } } = useSettings();
  const [shippingQoute] = useAtom(shippingQouteAtom);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cartId: string = getLocalData('cartId') ?? '';
    setcartId(cartId);
  }, []);

  const { items } = useCart();
  const [
    {
      billing_address,
      verified_response,
      customer_contact,
      payment_gateway,
      token,
    },
  ] = useAtom(checkoutAtom);

  const [discount] = useAtom(discountAtom);

  // useEffect(() => {
  //   setErrorMessage(null);

  // }, [payment_gateway]);

  const available_items = items?.filter(
    (item) => !verified_response?.unavailable_products?.includes(item.id)
  );

  const subtotal = calculateTotal(available_items);
  // const total = calculatePaidTotal(
  //   {
  //     totalAmount: subtotal,
  //     tax: verified_response?.total_tax!,
  //     shipping_charge: verified_response?.shipping_charge!,
  //   },
  //   Number(discount)
  // );

  const total = verified_response?.total ?? 0;

  const handlePlaceOrder = () => {
    if (payment_gateway === 'STRIPE') {
      //@ts-ignore
      input.token = token;
    }
    // razorpay payment
    if (payment_gateway === PAYMENT.RAZORPAY_UPPERCASE) {
      onRazorpayPayment();
    }
    // cod payment
    if (payment_gateway === PAYMENT.COD_UPPERCASE) {
      // console.log('cod order start.......');

      onCheckout({
        orderId: orderId,
        paymentId: '',
        paymentModule: PAYMENT.COD,
        signature: '',
        paymentType: PAYMENT.COD_UPPERCASE,
        amount: '' + total,
        integrationKeys: {} as any,
        paymentToken: '',
        transactionType: PAYMENT.AUTHORIZECAPTURE,
      });
    }
  };

  // online payment initailizer
  const onOnlinePaymentInitiate = async () => {
    // if (shippingQoute) {
    // order initiate
    let shippingQouteId: number = shippingQoute?.shippingQuoteOptionId ?? 0;
    const orderInitializationData = await onOrderInitialization(
      isAuthorize,
      billing_address,
      total,
      orderInitialization,
      cartId,
      shippingQouteId
    );
    // payment initiate
    const orderPaymentData = await onPaymentInitialization(
      total,
      payment_gateway,
      orderInitializationData,
      paymentInitialization,
      cartId
    );

    return {
      orderId: orderInitializationData?.id,
      paymentData: orderPaymentData,
    };

    // }

  };

  // on razorpay payment
  const onRazorpayPayment = async () => {
    try {
      // order initiate
      const { orderId, paymentData: order }: any =
        await onOnlinePaymentInitiate();
      if (orderId && order) {
        const details = JSON.parse(order.details);
        const options = {
          key: order.metadata.keyId,
          amount: details.amount,
          currency: currency,
          name: storeName,
          description: '',
          image: '',
          order_id: order.paymentToken,
          receipt: RECEIPT_ORDER + orderId,
          handler: (res: any) => {
            onCheckout({
              orderId: orderId,
              paymentId: res?.razorpay_payment_id,
              paymentModule: PAYMENT.RAZORPAY,
              signature: res.razorpay_signature,
              paymentType: PAYMENT.ONLINEPAYMENT,
              amount: '' + total,
              integrationKeys: {} as any,
              paymentToken: res.razorpay_order_id,
              transactionType: PAYMENT.AUTHORIZECAPTURE,
            });
          },
          prefill: {
            name:
              billing_address?.billing?.firstName +
              ' ' +
              billing_address?.billing?.lastName,
            email: billing_address?.billing?.email,
            contact: billing_address?.billing?.phone,
          },
          theme: {
            color: '#3399cc',
          },
        };

        const rzp1 = new Razorpay(options);
        rzp1.on(PAYMENT_FAILED, function (_: any) { });
        rzp1.open();
        
      } else {
        const errorMessage = STATIC_CONTENT['PICKBAZAR_ERROR.SOMETHING_WENT_WRONG'];
        toast.error(errorMessage);
      }
    } catch (error: any) {
      const errorMessage = error?.message || STATIC_CONTENT['PICKBAZAR_ERROR.SOMETHING_WENT_WRONG'];
      toast.error(errorMessage);
    }
  };

  // checkout order.....
  const onCheckout = (payment: Payment) => {
    try {
      setIsLoading(true);

      // customer data as per checkout request requirement
      let customer: CheckoutCustomerDetails = {
        billing: {
          ...billing_address?.billing,
          stateProvince: billing_address?.billing?.stateProvince,
          zone: billing_address?.billing?.stateProvince,
          country: billing_address?.billing?.countryCode,
          countryCode: billing_address?.billing?.countryCode,
        },
        emailAddress: 'test@gmail.com',
      };
      // checkout req data
      let data: CheckoutReq = {
        attributes: [],
        comments: '',
        currency: DEFAULT_CURRENCY,
        customerAgreement: true,
        id: 0,
        payment,
        shippingQuote: shippingQoute ? +shippingQoute?.shippingQuoteOptionId : 0,
        customer: !isAuthorize ? customer : ({} as CheckoutCustomerDetails),
      };

      // Checkout custom hook call for http api call...
      checkout({ cartCode: cartId, data });

    } catch (error: any) {
      setIsLoading(false);
      const errorMessage = error?.message || STATIC_CONTENT['PICKBAZAR_ERROR.SOMETHING_WENT_WRONG'];
      toast.error(errorMessage);
    }
  };

  const isDigitalCheckout = available_items.find((item) =>
    Boolean(item.is_digital)
  );

  const formatRequiredFields = isDigitalCheckout
    ? [customer_contact, payment_gateway, available_items]
    : [
      // customer_contact,
      payment_gateway,
      billing_address,
      // shipping_address,
      // delivery_time,
      // available_items,
    ];

  const isAllRequiredFieldSelected = formatRequiredFields.every(
    (item) => !isEmpty(item)
  );

  return (
    <>
      <Button
        // loading={orderInitIsLoading}
        className={classNames('mt-5 w-full', props.className)}
        onClick={handlePlaceOrder}
        disabled={isLoading}
        {...props}
      />
      {/* {errorMessage && (
        <div className="mt-3">
          <ValidationError message={errorMessage} />
        </div>
      )} */}
    </>
  );
};

// order initzlization function definiation
async function onOrderInitialization(
  isAuthorize: boolean,
  billing_address: any,
  total: number,
  orderInitialization: any,
  cartId: string,
  shippingQuote: number
) {
  let customer: OrderInitCustomerData = isAuthorize
    ? ({} as OrderInitCustomerData)
    : {
      emailAddress: 'test@gmail.com',
      billing: {
        ...billing_address.billing,
        countryCode: billing_address?.billing?.countryCode,
        country: billing_address?.billing?.countryCode,
        stateProvince: billing_address?.billing?.zone,
        zone: billing_address?.billing?.zone,
      },
      delivery: {
        ...billing_address.billing,
        countryCode: billing_address?.billing?.countryCode,
        country: billing_address?.billing?.countryCode,
        stateProvince: billing_address?.billing?.zone,
        zone: billing_address?.billing?.zone,
      },
    };

  let input: OrderInitializationRequest = {
    comments: '',
    currency: DEFAULT_CURRENCY,
    customerAgreement: true,
    id: 0,
    amount: total,
    shippingQuote,
    customer: customer,
  };

  const orderInitializationData = await orderInitialization({
    cartId,
    data: input,
  });
  return orderInitializationData;
}

// payment initzlization function definiation
async function onPaymentInitialization(
  total: number,
  payment_gateway: string,
  orderInitializationData: any,
  paymentInitialization: any,
  cartId: string
) {
  const paymentInitdata: PaymentInitializationRequest = {
    amount: '' + total,
    paymentId: '',
    paymentModule: payment_gateway.toLowerCase(),
    paymentToken: '',
    paymentType: ONLINEPAYMENT,
    signature: '',
    transactionType: INIT,
    orderId: orderInitializationData?.id,
  };
  const orderPaymentData = await paymentInitialization({
    cartId,
    data: paymentInitdata,
  });
  return orderPaymentData;
}
