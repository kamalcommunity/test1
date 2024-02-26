import { STATIC_CONTENT } from '@/lib/constants/static-content';
import CheckboxGroup from './checkbox-group';
import { useState, useEffect, useMemo } from 'react';
import Checkbox from '@/components/ui/forms/checkbox/checkbox';
import { useRouter } from 'next/router';
import Scrollbar from '@/components/ui/scrollbar';
import { useTranslation } from 'react-i18next';
import { useCategories } from '@/framework/category';
import ErrorMessage from '@/components/ui/error-message';
import Spinner from '@/components/ui/loaders/spinner/spinner';
import { toast } from 'react-toastify';

interface Props {
  categories: any[];
}

const CategoryFilterView = ({ categories }: Props) => {
  

  const router = useRouter();
  const selectedValues = useMemo(
    () =>
      router.query.categorySlugs ? (router.query.categorySlugs as string).split(',') : [],
    [router.query.categorySlugs]
  );
  const [state, setState] = useState<string[]>(() => selectedValues);
  useEffect(() => {
    setState(selectedValues);
  }, [selectedValues]);


  function handleChange(values: string[]) {
    // if (values.length <= 0) {
    //   if (router?.query?.hasOwnProperty('categorySlugs')) {
    //     delete router?.query['categorySlugs'];
    //     console.log(router?.query);
    //     debugger
        
    //   }
    // }
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          categorySlugs: values.join(','),
        },
      });
  }

  return (
    <div className="relative -mb-5 after:absolute after:bottom-0 after:flex after:h-6 after:w-full after:bg-gradient-to-t after:from-white ltr:after:left-0 rtl:after:right-0">
      <Scrollbar style={{ maxHeight: '400px' }} className="pb-6">
        <span className="sr-only">{STATIC_CONTENT['text-categories']}</span>
        <div className="grid grid-cols-1 gap-4">
          <CheckboxGroup values={state} onChange={handleChange}>
            {categories.map((plan) => (
              <Checkbox
                key={plan.id}
                label={plan.name}
                name={plan.slug}
                value={plan.slug}
                theme="secondary"
              />
            ))}
          </CheckboxGroup>
        </div>
      </Scrollbar>
    </div>
  );
};

const CategoryFilter: React.FC<{ type?: string }> = ({ type }) => {
  const { query } = useRouter();
  const {childParentCategories , isLoading, error } = useCategories({
    ...(type ? { type } : { type: query.searchType }),
    limit: 1000
  });
  
  // if (error) return <ErrorMessage message={error.message} />;
  // if (error) return toast.error(error.message);
  if (isLoading)
    return (
      <div className="flex w-full items-center justify-center py-5">
        <Spinner className="h-6 w-6" simple={true} />
      </div>
    );
  return <CategoryFilterView categories={childParentCategories} />;
};

export default CategoryFilter;
