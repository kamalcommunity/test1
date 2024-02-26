import { STATIC_CONTENT } from '@/lib/constants/static-content';
import CheckboxGroup from './checkbox-group';
import { useState, useEffect, useMemo } from 'react';
import Checkbox from '@/components/ui/forms/checkbox/checkbox';
import { useRouter } from 'next/router';
import Scrollbar from '@/components/ui/scrollbar';
import { useTranslation } from 'react-i18next';
import ErrorMessage from '@/components/ui/error-message';
import { useTags } from '@/framework/tag';
import Spinner from '@/components/ui/loaders/spinner/spinner';
import { toast } from 'react-toastify';

interface Props {
  tags: any[];
}

const TagFilterView = ({ tags }: Props) => {
  

  const router = useRouter();
  const selectedValues = useMemo(
    () => (router.query.tags ? (router.query.tags as string)?.split(',') : []),
    [router.query.tags]
  );
  const [state, setState] = useState<string[]>(selectedValues);
  useEffect(() => {
    setState(selectedValues);
  }, [selectedValues]);

  function handleChange(values: string[]) {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        tags: values.join(','),
      },
    });
  }

  return (
    <div className="relative -mb-5 after:absolute after:bottom-0 after:flex after:h-6 after:w-full after:bg-gradient-to-t after:from-white ltr:after:left-0 rtl:after:right-0">
      <Scrollbar style={{ maxHeight: '400px' }} className="pb-6">
        <span className="sr-only">{STATIC_CONTENT['text-tags']}</span>
        <div className="grid grid-cols-1 gap-4">
          <CheckboxGroup values={state} onChange={handleChange}>
            {tags.map((plan) => (
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

const TagFilter = () => {
  const { tags, isLoading, error } = useTags({ limit: 100 });
  // if (error) return <ErrorMessage message={error.message} />;
  // if (error) return toast.error(error.message);
  if (isLoading)
    return (
      <div className="flex items-center justify-center w-full py-5">
        <Spinner className="w-6 h-6" simple={true} />
      </div>
    );

  return <TagFilterView tags={tags} />;
};

export default TagFilter;
