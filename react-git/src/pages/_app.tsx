import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { SessionProvider } from 'next-auth/react';
import '@/assets/css/main.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { ModalProvider } from '@/components/ui/modal/modal.context';
import ManagedModal from '@/components/ui/modal/managed-modal';
import ManagedDrawer from '@/components/ui/drawer/managed-drawer';
import DefaultSeo from '@/components/seo/default-seo';
import { SearchProvider } from '@/components/ui/search/search.context';
import PrivateRoute from '@/lib/private-route';
import { CartProvider } from '@/store/quick-cart/cart.context';
import SocialLogin from '@/components/auth/social-login';
import { NextPageWithLayout } from '@/types';
import QueryProvider from '@/framework/client/query-provider';

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import Router from 'next/router';
import Head from 'next/head';
import { getLocalData } from '@/framework/client/helper';
import { DEFAULT_THEME_COLOR_CODE_1,DEFAULT_THEME_COLOR_CODE_2, DEFAULT_THEME_COLOR_CODE_3, DEFAULT_THEME_COLOR_CODE_4, DEFAULT_THEME_COLOR_CODE_5, DEFAULT_THEME_COLOR_CODE_6, DEFAULT_THEME_COLOR_CODE_7, DEFAULT_THEME_COLOR_CODE_8, DEFAULT_THEME_COLOR_CODE_9 } from '@/framework/utils/constants';

NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 800,
  showSpinner: false,
});

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
function CustomApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);
  const authenticationRequired = Component.authenticationRequired ?? false;

  Router.events.on('routeChangeStart', () => NProgress.start());
  Router.events.on('routeChangeComplete', () => NProgress.done());
  Router.events.on('routeChangeError', () => NProgress.done());
  
  let settings;
  try {
    let data: any = getLocalData('config') ?? {};
    settings = data ? JSON.parse(data) : {};
  } catch (error) {
    
  }



  return (
    <>
      <Head>
        <style>
          {`:root {

              /* primary color */
              --color-accent: ${settings?.themeLayoutColor ?? DEFAULT_THEME_COLOR_CODE_1
              } !important;


              /* Hover state color of primary color */
              --color-accent-hover: ${settings?.themeLayoutHoverColor ?? DEFAULT_THEME_COLOR_CODE_2
              } !important;

              /* text color used for body/base text -> gray-500 */
              --color-base: rgb !important;

              /* light color */
              --color-light-hover: ${settings?.themeLayoutTextColor ?? DEFAULT_THEME_COLOR_CODE_3
              } !important;

            }`}

            {`
                .header-bg-color {
                  background-color: rgb(${settings?.topHeaderBackgroundColor ??  DEFAULT_THEME_COLOR_CODE_4}) !important;
                }
              
                .header-text-color {
                  color: rgb(${settings?.topHeaderTextColor ?? DEFAULT_THEME_COLOR_CODE_5}) !important;
                }
              
                .bottom-header-bg-color {
                  background-color: rgb(${settings?.bottomHeaderBackgroundColor ?? DEFAULT_THEME_COLOR_CODE_6}) !important;
                }
              
                .bottom-header-text-color {
                  color: rgb(${settings?.bottomHeaderTextColor ?? DEFAULT_THEME_COLOR_CODE_7}) !important;
                }
              
                .footer-bg-color {
                  background-color: rgb(${settings?.footerBackgroundColor ?? DEFAULT_THEME_COLOR_CODE_8}) !important;
                }
              
                .footer-text-color {
                  color: rgb(${settings?.footerTextColor ?? DEFAULT_THEME_COLOR_CODE_9}) !important;
                }
            `}

        </style>
      </Head>
      <SessionProvider session={session}>
        <QueryProvider pageProps={pageProps}>
          <SearchProvider>
            <ModalProvider>
              <CartProvider>
                <>
                  <DefaultSeo />
                  {authenticationRequired ? (
                    <PrivateRoute>
                      {getLayout(<Component {...pageProps} />)}
                    </PrivateRoute>
                  ) : (
                    getLayout(<Component {...pageProps} />)
                  )}
                  <ManagedModal />
                  <ManagedDrawer />
                  <ToastContainer autoClose={2000} theme="colored" />
                  <SocialLogin />
                </>
              </CartProvider>
            </ModalProvider>
          </SearchProvider>
        </QueryProvider>
      </SessionProvider>
    </>
  );
}
export default CustomApp;
