import ErrorMessage from '@/components/ui/error-message';
import dynamic from 'next/dynamic';
import { useTestmonial } from '@/framework/testmonial';
import SectionBlock from '../ui/section-block';
import { toast } from 'react-toastify';

const TestmonialGridCard = dynamic(
  () => import('@/components/testmonials/testmonial-grid-card')
);

const MAP_CATEGORY_TO_GROUP: Record<string, any> = {
  jewe: TestmonialGridCard,
  square: TestmonialGridCard,
  default: TestmonialGridCard,
};
interface TestmonialProps {
  layout: string;
  variables: any;
  className?: string;
}
export default function Testmonial({
  layout,
  className,
  variables,
}: TestmonialProps) {
  const { isLoading, error, testmonialList, active, testmonial_count } =
    useTestmonial();
  // if (error) return <ErrorMessage message={error.message} />;
  // if (error) return toast.error(error.message);
  const Component = MAP_CATEGORY_TO_GROUP[layout];
  return (
    <SectionBlock>
      <Component
        notFound={!Boolean(testmonial_count)}
        items={testmonialList}
        loading={isLoading}
        className={className}
        variables={variables}
      />
    </SectionBlock>
  );
}
