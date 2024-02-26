import { STATIC_CONTENT } from '@/lib/constants/static-content';
import React from 'react';
import SectionBlockWithHeader from '../ui/section-block-with-header';
import BackButton from '../ui/back-button';
import { useBlogs } from '@/framework/blogs';
import ErrorMessage from '../ui/error-message';
import Spinner from '../ui/loaders/spinner/spinner';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { toast } from 'react-toastify';
import { Image } from '@/components/ui/image';
import { productPlaceholder } from '@/lib/placeholders';
import { useRouter } from 'next/router';
import Button from '../ui/button';
import { useTranslation } from 'react-i18next';

export default function Blogs() {
  
  const { query } = useRouter();
  const { blogs, loadMore, isLoadingMore, hasMore, error, isLoading } = useBlogs();
  
  if (isLoading) {
    return <Spinner showText={false} />;
  }

  if (error) {
    toast.dismiss();
    toast.error(error.message);
    return <ErrorMessage message={error.message} />;
  }

  if (blogs.length === 0) {
    return (
      <div className="flex h-[86vh] w-full items-center justify-center">
        <p className="px-2 text-center text-2xl">
          Please first create a blog &#128522;
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white pt-8 sm:pt-10">
        <SectionBlockWithHeader title={'Blogs'}>
          <div className="pb-4 text-left">
            <BackButton />
          </div>
          <div className="grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10">
            {blogs &&
              blogs.length > 0 &&
              blogs.map(({ code, label, id, imagePath, image }) => {
                return (
                  <Link
                    href={`${ROUTES.BLOGS}/${code}`}
                    key={id}
                    passHref
                  >
                    <div className="overflow-hidden rounded-lg shadow-[1px_1px_5px_0px_rgba(0,0,0,0.20)]
                    cursor-pointer">

                      <div className='sm:h-80 h-72 w-full'>
                        {image ? (
                          <img
                            src={imagePath}
                            alt={label}
                            className='object-contain h-full w-full'
                          />
                        ) : (
                          <img
                            src={imagePath ? imagePath?.src : productPlaceholder}
                            alt={label}
                            className="object-contain h-full !w-full"
                          />
                        )}
                      </div>

                      <div className="py-2 px-3">
                        {/* <span className='block mb-2'>08 jun 2023</span> */}
                        <strong className="my-4 block">{label}</strong>
                      </div>
                    </div>
                  </Link>
                );
              })}

          </div>
          {hasMore && (
              <div className="mt-8 flex justify-center lg:mt-12">
                <Button
                  loading={isLoadingMore}
                  onClick={loadMore}
                  className="h-11 text-sm font-semibold md:text-base"
                >
                  {STATIC_CONTENT['text-load-more']}
                </Button>
              </div>
            )}
        </SectionBlockWithHeader>
      </div>
    </>
  );
}
