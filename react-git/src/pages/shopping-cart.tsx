import { STATIC_CONTENT } from '@/lib/constants/static-content';
import CartSidebarView from "@/components/cart/cart-sidebar-view";
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import CartCheckBagIcon from '@/components/icons/cart-check-bag';
import EmptyCartIcon from '@/components/icons/empty-cart';
import { CloseIcon } from '@/components/icons/close-icon';
import CartItem from '@/components/cart/cart-item';
import { fadeInOut } from '@/lib/motion/fade-in-out';
// import { Routes } from '@/config/routes';
import usePrice from '@/lib/use-price';
import { useCart } from '@/store/quick-cart/cart.context';
import { formatString } from '@/lib/format-string';
import { useTranslation } from 'next-i18next';
import { useAtom } from 'jotai';
import { drawerAtom } from '@/store/drawer-atom';
import RightSideView from "@/components/checkout/right-side-view";
import UnverifiedItemList from '@/components/checkout/item/unverified-item-list';
import { CheckAvailabilityAction } from '@/components/checkout/check-availability-action';
import ItemCard from '@/components/checkout/item/item-card';
import { ItemInfoRow } from '@/components/checkout/item/item-info-row';
import { isEmpty } from 'lodash';
import Button from '@/components/ui/button';
import classNames from 'classnames';
import DashboardLayout from '@/layouts/_dashboard';
import GeneralLayout from '@/components/layouts/_general';
import { authorizationAtom } from '@/store/authorization-atom';

const ShopingCart: any = ({ product }: any) => {
    const { items, totalUniqueItems, total, language }: any = useCart();
    const [_, closeSidebar] = useAtom(drawerAtom);
    const router = useRouter();
    function handleCheckout() {
        const isRegularCheckout = items.find((item: any) => !Boolean(item.is_digital));
        if (isRegularCheckout) {
            router.push("/checkout", undefined, {
                locale: language,
            });
        } else {
            router.push("/checkout/digital", undefined, {
                locale: language,
            });
        }

        closeSidebar({ display: false, view: '' });
    }

    const { price: totalPrice } = usePrice({
        amount: total,
    });
    //   const { width } = useWindowSize();
    return (
        <div className="flex p-8 gap-4 mr-8 ml-8">
            <div className="col-8">
                <section className="relative flex h-full flex-col">
                    {/* <header className="fixed top-0 z-10 flex w-full max-w-md items-center justify-between border-b border-border-200 border-opacity-75 bg-light px-6 py-4">
                        <div className="flex font-semibold text-accent">
                            <CartCheckBagIcon className="shrink-0" width={24} height={22} />
                            <span className="flex ltr:ml-2 rtl:mr-2">
                                {formatString(totalUniqueItems, STATIC_CONTENT['text-item'])}
                            </span>
                        </div>
                        <button
                            onClick={() => closeSidebar({ display: false, view: '' })}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-muted transition-all duration-200 hover:bg-accent hover:text-light focus:bg-accent focus:text-light focus:outline-0 ltr:ml-3 ltr:-mr-2 rtl:mr-3 rtl:-ml-2"
                        >
                            <span className="sr-only">{STATIC_CONTENT['text-close']}</span>
                            <CloseIcon className="h-3 w-3" />
                        </button>
                    </header> */}
                    {/* End of cart header */}

                    <motion.div layout className="grow pt-16 pb-20">
                        {items.length > 0 ? (
                            items?.map((item: any) => <CartItem item={item} key={item.id} />)
                        ) : (
                            // <motion.div
                            //     layout
                            //     initial="from"
                            //     animate="to"
                            //     exit="from"
                            //     variants={fadeInOut(0.25)}
                            //     className="flex h-full flex-col items-center justify-center"
                            // >
                            //     <EmptyCartIcon width={140} height={176} />
                            //     <h4 className="mt-6 text-base font-semibold">
                            //         No Products
                            //     </h4>
                            // </motion.div>
                            <></>
                        )}
                    </motion.div>
                    {/* End of cart items */}


                    {/* End of footer */}
                </section>
            </div>


            <div className="total-column col-4 flex-0.5 h-120 relative bg-white p-4 rounded">
                <div className="mt-10 mb-10 w-full sm:mb-12 lg:mb-0 lg:w-96">
                    {/* <RightSideView /> */}
                    <RightSideCartView/>
                </div>
                {/* <footer className="bottom-0 z-10 w-full max-w-md bg-light px-6 py-5">
                    <button
                        className="flex h-12 w-full justify-between rounded-full bg-accent p-1 text-sm font-bold shadow-700 transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-0 md:h-14"
                        onClick={handleCheckout}
                    >
                        <span className="flex h-full flex-1 items-center px-5 text-light">
                            Checkout
                        </span>
                        <span className="flex h-full shrink-0 items-center rounded-full bg-light px-5 text-accent">
                            {totalPrice}
                        </span>
                    </button>
                </footer> */}
            </div>
        </div>
    );
};


 function RightSideCartView() {
  const [authorization] = useAtom(authorizationAtom);

    const { items, total, isEmpty } = useCart();
    const router = useRouter();
    const { price: subtotal } = usePrice(
      items && {
        amount: total,
      }
    );
  return (
    <div className="w-full">
    {true && (
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
    {
      !isEmpty &&   <Button
      className={classNames('mt-5 w-full')}
      onClick={() =>{
        if (authorization) {
          router.push('/checkout')
        } else {
          router.push('/login')
        }
      }}
    >
    {STATIC_CONTENT['text-checkout']}
    </Button>
    }
  
    {/* <CheckAvailabilityAction>
    </CheckAvailabilityAction> */}
  </div>
  )
}

ShopingCart.getLayout = function getLayout(page: React.ReactElement){
  
    const [_, setDrawerView] = useAtom(drawerAtom);
    return (
      <GeneralLayout layout='' >
        {page}
      </GeneralLayout>
    );
  };
// ProductPage.getLayout = getLayout;
export default ShopingCart;

