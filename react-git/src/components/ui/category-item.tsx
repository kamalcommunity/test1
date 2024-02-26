import Link from "./link";
import { productPlaceholder } from '@/lib/placeholders';
import { Image } from '@/components/ui/image';

interface CategoryItemProps {
    item: any;
}
const CategoryItem: React.FC<CategoryItemProps> = ({ item }) => {
    
    return (
        <>
            <div className=" overflow-hidden text-center group">
                <div className="rounded-md border">
                    <Link href={item.children.length > 0 ? `categories?category=${item?.slug}` : item.href} className="cursor-pointer">
                        {/* <Image
                        src={item?.image?.original ? item?.image?.original : productPlaceholder}
                        alt={item?.name} 
                        height="400px"
                        width="400px"
                        layout="responsive"
                        className="rounded-md"
                    /> */} 
                            {
                                item?.image?.original ?
                                    <img src={item?.image?.original} alt={item?.name ?? ''} className="sm:h-32 h-24 w-full rounded-md object-contain" />
                                    : <div className='sm:h-32 h-24 w-full bg-gray-100 flex justify-center items-center text-4xl rounded-md'>
                                        <p>{item.name.toUpperCase().slice(0, 1)}</p>
                                    </div>
                            } 
                    </Link>
                </div>
                <span className="block mt-2 sm:text-sm text-xs font-semibold transition-colors text-heading group-hover:text-accent text-center truncate">
                    {item?.name}
                </span>
            </div>
        </>
    );
};

export default CategoryItem;