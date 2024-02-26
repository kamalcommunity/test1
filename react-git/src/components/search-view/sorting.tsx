import { STATIC_CONTENT } from '@/lib/constants/static-content';
import Scrollbar from '@/components/ui/scrollbar';
import Select from '@/components/ui/select/select';
import { RadioGroup } from '@headlessui/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsRTL } from '@/lib/locals';
interface Plan {
  id: number | string;
  key: string;
  label: string;
  value?: string;
  // orderBy?: string;
  orderBy?: 'ASC' | 'DESC';
  sortedBy?: string;
}
const plans: Plan[] = [
  {
    id: '1',
    key: 'sorting',
    label: 'New Released',
    value: 'created_at',
    // orderBy: 'created_at',
    sortedBy: 'created_at',
    orderBy: 'ASC',
  },
  {
    id: '2',
    key: 'sorting',
    label: 'Sort by Price: Low to High',
    value: 'min_price',
    sortedBy: 'min_price',
    orderBy: 'ASC',
  },
  {
    id: '3',
    key: 'sorting',
    label: 'Sort by Price: High to Low',
    value: 'max_price',
    sortedBy: 'max_price',
    orderBy : 'DESC',
  },
];

type Props = {
  variant?: 'radio' | 'dropdown';
};

const Sorting: React.FC<Props> = ({ variant = 'radio' }) => {
  const router = useRouter();
  
  const { isRTL } = useIsRTL();
  const [selected, setSelected] = useState(
    () =>
      plans.find((plan) => plan.sortedBy === router.query.sortedBy) ?? plans[0]
  );

  useEffect(() => {
    if (!router.query.orderBy) {
      setSelected(plans[0]);
    }
  }, [router.query.orderBy]);

  function handleChange(values: Plan) {
    const { orderBy, sortedBy } = values;
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        orderBy,
        sortedBy,
      },
    });
    setSelected(values);
  }

  return (
    <>
    <div className='z-10 relative'>
      {variant === 'dropdown' && (
        <Select
          defaultValue={selected}
          isRtl={isRTL}
          options={plans}
          isSearchable={false}
          // @ts-ignore
          onChange={handleChange}
        />
      )}
    </div>
      {variant === 'radio' && (
        <Scrollbar style={{ maxHeight: '400px' }}>
          <RadioGroup value={selected} onChange={handleChange}>
            <RadioGroup.Label className="sr-only">
              {STATIC_CONTENT['text-sort']}
            </RadioGroup.Label>
            <div className="space-y-4">
              {plans.map((plan) => (
                <RadioGroup.Option key={plan.id} value={plan}>
                  {({ checked }) => (
                    <>
                      <div className="flex items-center w-full cursor-pointer">
                        <span
                          className={`h-[18px] w-[18px] rounded-full bg-white ltr:mr-3 rtl:ml-3 ${
                            checked
                              ? 'border-[5px] border-gray-800'
                              : 'border border-gray-600'
                          }`}
                        />
                        <RadioGroup.Label as="p" className="text-sm text-body">
                          {plan.label}
                        </RadioGroup.Label>
                      </div>
                    </>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </Scrollbar>
      )}
    </>
  );
};

export default Sorting;
