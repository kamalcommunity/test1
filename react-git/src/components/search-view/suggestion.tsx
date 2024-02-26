import dynamic from 'next/dynamic';
import ErrorMessage from '@/components/ui/error-message';
import { useProducts } from '@/framework/product';
import { useRouter } from 'next/router';
import { useAutocomplete } from '@/framework/search';
import { toast } from 'react-toastify';

const AutoSuggestion = dynamic(() => import('@/components/ui/auto-suggestion'));

interface AutoSuggestionProps {
  className?: string;
  searchQuery: string;
  visible: boolean;
  seeMore: boolean;
  seeMoreLink: (e: any) => void;
}
const AutoSuggestionBox: React.FC<AutoSuggestionProps> = ({
  searchQuery,
  className,
  visible,
  seeMoreLink,
  seeMore,
}) => {
  const { query } = useRouter();
  // const { isLoading, products, error } = useProducts({
  //   type: query?.pages?.[0] as string,
  //   searchQuery
  // });

  const { data, isLoading, error } = useAutocomplete(searchQuery);

  // if (error) return <ErrorMessage message={error.message} />;
  // if (error) return toast.error(error.message);

  return (
    <AutoSuggestion
      suggestions={data}
      notFound={!isLoading && !data.length}
      visible={visible}
      seeMoreLink={seeMoreLink}
      seeMore={seeMore}
      className={className}
      showLoaders={isLoading && !data.length}
    />
  );
};

export default AutoSuggestionBox;
