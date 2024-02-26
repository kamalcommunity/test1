import { STATIC_CONTENT } from '@/lib/constants/static-content';
import { RadioGroup } from '@headlessui/react';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import Alert from '@/components/ui/alert';
import StripePayment from '@/components/checkout/payment/stripe';
import CashOnDelivery from '@/components/checkout/payment/cash-on-delivery';
import { useAtom } from 'jotai';
import { paymentGatewayAtom, PaymentMethodName } from '@/store/checkout';
import cn from 'classnames';
import { usePaymentModules } from '@/framework/payment';
import { PaymentModule } from '@/types';
import Razorpay from './razorpay';

interface PaymentMethodInformation {
  name: string;
  value: string;
  // value: PaymentMethodName;
  icon: string;
  component?: React.FunctionComponent;
  // active: boolean;
  // code: string;
  // configured: boolean;
  // image: string;
  // title: string;
}

// Payment Methods Mapping Object

// const AVAILABLE_PAYMENT_METHODS_MAP: Record<
//   PaymentMethodName,
//   PaymentMethodInformation
// > = {
//   STRIPE: {
//     name: 'Stripe',
//     value: 'STRIPE',
//     icon: '/payment/stripe.png',
//     component: StripePayment,
//   },
//   CASH_ON_DELIVERY: {
//     name: 'Cash On Delivery',
//     value: 'CASH_ON_DELIVERY',
//     icon: '',
//     component: CashOnDelivery,
//   },
// };

const PaymentGrid: React.FC<{ className?: string; theme?: 'bw' }> = ({
  className,
  theme,
}) => {
  const [gateway, setGateway] = useAtom<PaymentMethodName>(paymentGatewayAtom);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  

  const { data, isLoading, error } = usePaymentModules();
  let AVAILABLE_PAYMENT_METHODS_MAP = new Map<
    string,
    PaymentMethodInformation
  >();
  AVAILABLE_PAYMENT_METHODS_MAP = formateData(
    data,
    AVAILABLE_PAYMENT_METHODS_MAP
  );
  let PaymentMethod = AVAILABLE_PAYMENT_METHODS_MAP.get(gateway);
  const Component = PaymentMethod?.component ?? Razorpay;

  return (
    <div className={className}>
      {errorMessage ? (
        <Alert
          message={`${errorMessage}`}
          variant="error"
          closeable={true}
          className="mt-5"
          onClose={() => setErrorMessage(null)}
        />
      ) : null}

      <RadioGroup value={gateway} onChange={setGateway}>
        <RadioGroup.Label className="mb-5 block text-base font-semibold text-heading">
          {STATIC_CONTENT['text-choose-payment']}
        </RadioGroup.Label>

        <div className="mb-8 grid grid-cols-2 gap-4 lg:w-auto sm:w-[250px] w-[250px]">
          {Array.from(AVAILABLE_PAYMENT_METHODS_MAP.values()).map(({ name, icon, value }) => (
            <RadioGroup.Option value={value} key={value}>
              {({ checked }) => (
                <div
                  className={cn(
                    'relative flex h-full w-full cursor-pointer items-center justify-center rounded border border-gray-200 bg-light py-3 text-center px-2',
                    checked && '!border-accent bg-light shadow-600',
                    {
                      '!border-gray-800 bg-light shadow-600':
                        theme === 'bw' && checked,
                    }
                  )}
                >
                  {icon ? (
                    <>
                      {/* eslint-disable */}
                      <img src={icon} alt={name} className="h-[80px]" />
                    </>
                  ) : (
                    <span className="text-xs font-semibold text-heading">
                      {name}
                    </span>
                  )}
                </div>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
      <div>
        <Component />
      </div>
    </div>
  );
};

// formate function definition
const formateData = (
  data: PaymentModule[],
  map: Map<string, PaymentMethodInformation>
) => {
  data.forEach((item: PaymentModule) => {
    if (item.code === 'cod') {
      map.set(item.code.toUpperCase(), {
        name: item.code,
        value: item.code.toUpperCase(),
        icon: item?.image,
        component: CashOnDelivery,
      });
    }
    
    if(item.code === 'razorpay') {
      map.set(item.code.toUpperCase(), {
        name: item.code,
        value: item.code.toUpperCase(),
        icon: item?.image,
        component: Razorpay,
      });
    }
  });
  return map;
};

export default PaymentGrid;