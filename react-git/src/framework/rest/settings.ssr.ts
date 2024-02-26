import type { PageContent, Product } from '@/types';
import type { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import invariant from 'tiny-invariant';
import client from './client';
import { dehydrate } from 'react-query/hydration';
import { API_ENDPOINTS } from '@/framework/client/api-endpoints';
import { QueryClient } from 'react-query';

// This function gets called at build time
type ParsedQueryParams = {
  slug: string;
};
// export const getStaticPaths: GetStaticPaths<ParsedQueryParams> = async ({
//   locales,
// }) => {
//   invariant(locales, 'locales is not defined');
//   const { data } = await client.products.all({ limit: 100 });
//   const paths = data?.flatMap((product) =>
//     locales.map((locale) => ({ params: { slug: product.slug }, locale }))
//   );
//   return {
//     paths,
//     fallback: 'blocking',
//   };
// };
type PageProps = {
  pageContent: PageContent;
};
export const getServerSideProps: GetServerSideProps<
  PageProps,
  ParsedQueryParams
> = async ({ params, locale, req }) => {
  const { slug } = params!; //* we know it's required because of getStaticPaths

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    [API_ENDPOINTS.PAGES],
    client.settings.getPage(slug)
  );

  if (req.headers.host) {
    const settings = await client.settings.all({
      host: req.headers.host
    });

    try {
      // let product = await client.settings.getPage(encodeURIComponent(slug), settings?.storeCode);
      let response = await client.settings.getPage(encodeURIComponent(slug));
      // let pageContent = "";
      // if (response) {
      //     pageContent = response?.description?.description
      // }
      return {
        props: {
          ...(await serverSideTranslations(locale!, ['common'])),
          dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
        },
        // revalidate: 60,
      };
    } catch (error) {
      console.log(error);

      // return {
      //   notFound: true,
      // };
    }
  }
};
