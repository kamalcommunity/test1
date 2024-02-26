import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document';
import { RTL_LANGUAGES } from '@/lib/constants';
import client from '@/framework/client';

function getDirection(language: string | undefined) {
  if (!language) return 'ltr';
  return RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';
}

export default class CustomDocument extends Document {
  // static async getInitialProps(ctx: DocumentContext) {
  //   return Document.getInitialProps(ctx);
  // }
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    const { req } = ctx;

    const settings = await client.settings.all({
      host: req?.headers?.host
    });
    
    return {
      ...initialProps,
      settings,
      req
    };
  }

  render() {
    const { locale, settings } = this.props.__NEXT_DATA__;
    const dir = getDirection(locale);


    return (
      <Html>
        <Head>

        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1" crossOrigin="anonymous" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js" rel="js"
    integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1" crossOrigin="anonymous" />
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW" crossOrigin="anonymous" />

  <script
          src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"
          rel="js"
        />
        
          {settings && settings.storeLogo && <link rel="icon" href={settings.storeLogo} />}
          <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=optional"
            rel="stylesheet"
          />
          {/* <!-- Google tag (gtag.js) --> */}
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-WXW19CV4X5"></script>
          {/* <script>
            window.dataLayer = window.dataLayer || [];
            function gtag() {dataLayer.push(arguments); }
            gtag('js', new Date());

            gtag('config', 'G-WXW19CV4X5');
          </script> */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '[G-WXW19CV4X5]');
        `,
            }}
          />
        </Head>
        <body dir={dir}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
