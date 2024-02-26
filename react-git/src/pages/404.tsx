import { STATIC_CONTENT } from '@/lib/constants/static-content';
import type { GetStaticProps } from 'next';
import { Image } from '@/components/ui/image';
import Link from '@/components/ui/link';
import { ROUTES } from '@/lib/routes';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import noResult from '@/assets/no-result.svg';

export default function NotFoundPage() {
  

  return (
    <div className="grid min-h-screen p-4 place-items-center sm:p-8">
      <div className="text-center">
        <p className="mb-4 text-sm tracking-widest uppercase text-body-dark 2xl: sm:mb-5">
          {STATIC_CONTENT['404-heading']}
        </p>
        <h1 className="mb-5 text-2xl font-bold leading-normal sm:text-3xl text-bolder">
          {STATIC_CONTENT['404-sub-heading']}
        </h1>
        <div className="mb-11">
          <Image src={noResult} alt={STATIC_CONTENT['404-heading']} />
        </div>
        <Link
          href={ROUTES.HOME}
          className="inline-flex items-center underline sm:text-base text-bolder focus:outline-none hover:no-underline hover:text-body-dark"
        >
          {STATIC_CONTENT['404-back-home']}
        </Link>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common'])),
    },
  };
};
