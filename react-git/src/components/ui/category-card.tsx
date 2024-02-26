import { Image } from '@/components/ui/image';
import { productPlaceholder } from '@/lib/placeholders';
import { formatString } from '@/lib/format-string';
import { useTranslation } from 'next-i18next';
import Link from './link';

interface CategoryItemProps {
  item: any;
  onClick: () => void;
}
const CategoryCard: React.FC<CategoryItemProps> = ({ item, onClick }) => {
  // console.log('category item square ' , item);

   

  return (
    <Link href={item.href}>
    <div
      className="relative w-full transition-shadow group"
      // onClick={onClick}
      role="button"
    > 
     <div className="w-full rounded-lg h-40 overflow-hidden border">
        {
         item?.image?.original ? 
          <img src={item?.image?.original ?? productPlaceholder} alt={item?.name ?? ''} className="h-full w-full object-contain" /> 
          : <div className='h-full w-full bg-gray-100 flex justify-center items-center text-4xl'>
            <p>{item.name.toUpperCase().slice(0, 1)}</p>
          </div>
        }
      </div>

      <div className="flex flex-col flex-1 bottom-0 z-10 w-full px-4 pb-2 pt-1">
        <h3 className="text-heading font-semibold 2xl:text-lg text-sm text-center truncate">{item.name}</h3>
        {/* <span className="text-body text-s">
          {item?.children?.length
            ? `${item?.children?.length} ${
                item?.children?.length > 1
                  ? STATIC_CONTENT['text-categories']
                  : STATIC_CONTENT['text-category']
              }`
            : formatString(item?.products_count, 'Item')}
        </span> */}
      </div> 

    </div>
    </Link>
  );
};

export default CategoryCard;
