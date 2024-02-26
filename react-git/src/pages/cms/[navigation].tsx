import { useWindowSize } from '@/lib/use-window-size';
import { useTranslation } from 'next-i18next';
import { getLayout } from '@/components/layouts/layout';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from '@/types';
import { InferGetStaticPropsType } from 'next';
import { getStaticProps } from '@/framework/shop.ssr';
import { useGetPage } from '@/framework/settings';
import React from 'react';

export { getServerSideProps } from '@/framework/product.ssr';

const ShopPage: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ pageContent }:any) => {
  const router = useRouter();
  const query: any = router.query;

  // setHtmlContent(pageContent);
  const { width } = useWindowSize();
  const { t } = useTranslation('banner');
  const isBook = router.asPath.includes('/book');

  return <>
    <p>hello world</p>
  </>;
};

ShopPage.getLayout = getLayout;
export default ShopPage;

function HtmlContentView({ slug }:any) {
 const { pageContent, error, isLoading } = useGetPage(slug);

  return <div>{pageContent}</div>;
}
