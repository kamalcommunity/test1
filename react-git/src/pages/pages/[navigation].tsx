import { getLayout as getSiteLayout } from '@/components/layouts/layout';
import client from '../../framework/rest/client';
import parse from 'html-react-parser';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

function Navigation({ pageContent }:any) {
  return <div>{parse(pageContent?.description?.description)}</div>;
}

const getLayout = (page: React.ReactElement) =>
  getSiteLayout(
    <div className="w-full bg-light">
      <div className="mx-auto min-h-screen w-full max-w-1920 px-5 py-10 xl:py-14 xl:px-16">
        {page}
      </div>
    </div>
  );
Navigation.getLayout = getLayout;

export const getServerSideProps = async (context: {
  params: { navigation: any };
  req: any;
}) => {
  const { navigation } = context.params!;
  const { req } = context!;

  if (req.headers.host) {
    const settings = await client.settings.all({
      host: req.headers.host,
    });

    const data = await client.navigation.get(
      encodeURIComponent(navigation),
      settings?.storeCode
    );

    //shopiana.s3.us-east-2.amazonaws.com/content/index.html

    https: if (!data) {
      return {
        notFound: true,
      };
    }

    return { props: {
       pageContent: data,
       ...(await serverSideTranslations(context.locale!, ['common'])),
        } };
  }
};

export default Navigation;
