import { STATIC_CONTENT } from '@/lib/constants/static-content';
import { useTranslation } from 'next-i18next';
import {
  billingAddressAtom,
  clearCheckoutAtom,
  shippingAddressAtom,
} from '@/store/checkout';
import dynamic from 'next/dynamic';
import { getLayout } from '@/components/layouts/layout';
import { AddressType } from '@/framework/utils/constants';
import Seo from '@/components/seo/seo';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { useUser } from '@/framework/user';
import { authorizationAtom } from '@/store/authorization-atom';
import { useRouter } from 'next/router';
import { useSettings } from '@/framework/settings';
export { getStaticProps } from '@/framework/general.ssr';

const ScheduleGrid = dynamic(
  () => import('@/components/checkout/schedule/schedule-grid')
);
const GuestAddressGrid = dynamic(
  () => import('@/components/checkout/address-grid-guest')
);
const ContactGrid = dynamic(
  () => import('@/components/checkout/contact/contact-grid')
);
const RightSideView = dynamic(
  () => import('@/components/checkout/right-side-view'),
  { ssr: false }
);

export default function GuestCheckoutPage() {
  // const { me } = useUser();
  const { t } = useTranslation();
  const [, resetCheckout] = useAtom(clearCheckoutAtom);
  const [billingAddress] = useAtom(billingAddressAtom);
  const [shippingAddress] = useAtom(shippingAddressAtom);
  const [authorization] = useAtom(authorizationAtom);
  const router = useRouter();
  const {
    settings: {
      allowGuestUser
    },
  } = useSettings();

  useEffect(() => {
    resetCheckout();
  }, [resetCheckout]);

  useEffect(() => {
    if (authorization || !allowGuestUser) {
      router.back();
    }
  }, [authorization,allowGuestUser])
  

  return (
    <>
      <Seo noindex={true} nofollow={true} />
      <div className="bg-gray-100 px-4 py-8 lg:py-10 lg:px-8 xl:py-14 xl:px-16 2xl:px-20">
        <div className="m-auto flex w-full max-w-5xl flex-col items-center rtl:space-x-reverse lg:flex-row lg:items-start lg:space-x-8">
          <div className="w-full space-y-6 lg:max-w-2xl">
            {/* <ContactGrid
              className="bg-light p-5 shadow-700 md:p-8"
              contact={null}
              label={STATIC_CONTENT['text-contact-number']}
              count={1}
            /> */}

            <GuestAddressGrid
              className="bg-light p-5 shadow-700 md:p-8"
              label={STATIC_CONTENT['text-billing-address']}
              count={1}
              addresses={billingAddress ? [billingAddress] : []}
              atom={billingAddressAtom}
              type={AddressType.Billing}
            />
            {/* <GuestAddressGrid
              className="bg-light p-5 shadow-700 md:p-8"
              label={STATIC_CONTENT['text-shipping-address']}
              count={2}
              addresses={shippingAddress ? [shippingAddress] : []}
              atom={shippingAddressAtom}
              type={AddressType.Shipping}
            /> */}
            {/* <ScheduleGrid
              className="bg-light p-5 shadow-700 md:p-8"
              label={STATIC_CONTENT['text-delivery-schedule']}
              count={4}
            /> */}
          </div>
          <div className="mt-10 mb-10 w-full sm:mb-12 lg:mb-0 lg:w-96">
            <RightSideView />
          </div>
        </div>
      </div>
    </>
  );
}

GuestCheckoutPage.getLayout = getLayout;
