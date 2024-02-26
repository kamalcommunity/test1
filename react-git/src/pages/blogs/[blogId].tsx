import BlogDetails from '@/components/blogs/blog-details';
import { getLayout } from '@/components/layouts/layout';
import BackButton from '@/components/ui/back-button';
import ErrorMessage from '@/components/ui/error-message';
import Spinner from '@/components/ui/loaders/spinner/spinner';
import SectionBlock from '@/components/ui/section-block';
import { useBlog } from '@/framework/blogs';
export { getServerSideProps } from '@/framework/order.ssr';
import { useRouter } from 'next/router';

export default function BlogsPage() {
  const router = useRouter();
  const { query } = router;

  // Access the query parameters
  const { blogId } = query;

  const { blog, error, isLoading } = useBlog(blogId);

  if (isLoading) {
    return <Spinner showText={false} />
  }

  if (error) return <ErrorMessage message={error.message} />

  return (
    <>
      <div className='py-10 h-full w-full'>
        <SectionBlock>
          <div className='text-left pb-4'>
            <BackButton />
          </div>
          {
            blog &&
            <BlogDetails blog={blog} />
          }
        </SectionBlock>
      </div>
    </>
  );
}

BlogsPage.getLayout = getLayout;


