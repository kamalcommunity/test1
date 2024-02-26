import { STATIC_CONTENT } from '@/lib/constants/static-content';
import { useTranslation } from 'react-i18next';

interface Props {
  from: number;
  to: number;
  total: number;
}

const SearchCount = ({ from, to, total }: Props) => {
  

  return (
    <span className="text-sm font-semibold text-heading">{`${STATIC_CONTENT[
      'text-showing'
    ]} ${from} - ${to} ${STATIC_CONTENT['text-of']} ${total} ${STATIC_CONTENT['text-products']}`}</span>
  );
};

export default SearchCount;
