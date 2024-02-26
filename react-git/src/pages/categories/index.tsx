import { STATIC_CONTENT } from '@/lib/constants/static-content';
import { getLayout as getSiteLayout } from '@/components/layouts/layout';
import { useTranslation } from 'next-i18next';
import Search from '@/components/ui/search/search';
import ManufacturersGrid from '@/components/manufacturer/manufacturers-grid';
import { Fragment } from 'react';
import Categories from '@/components/categories/categories';
import CategoriesGrid from '@/components/categories/categories-grid';
// export { getStaticProps } from '@/framework/manufacturers-page.ssr';

export default function CategoriesPage() {
  
  return (
    <Fragment>
      <div className="flex flex-col items-center">
        {/* <h1 className="text-2xl font-bold text-accent sm:text-3xl lg:text-4xl"> 
          Categories
        </h1> 

        <div className="mt-8 w-full max-w-screen-md">
          <Search
            variant="minimal"
            label="search"
            placeholder={STATIC_CONTENT['search categories']}
          />
        </div> */}
      </div> 
      {/* <CategoriesGrid/> */}
      <Categories layout="minimal" variables={{}} />
    </Fragment>
  );
}

const getLayout = (page: React.ReactElement) =>
  getSiteLayout(
    <div className="w-full bg-light">
      <div className="mx-auto min-h-screen max-w-1920 pt-6 xl:pt-10">
        {page}
      </div>
    </div>
  );

CategoriesPage.getLayout = getLayout;
