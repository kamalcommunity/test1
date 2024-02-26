import Blogs from '@/components/blogs/blogs';
import { getLayout } from '@/components/layouts/layout';
export { getStaticProps } from '@/framework/general.ssr';

export default function BlogsPage() {
  return (
    <>
      <Blogs />
    </>
  );
}

BlogsPage.getLayout = getLayout;
