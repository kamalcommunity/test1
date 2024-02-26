import Link from "./link";
import { productPlaceholder } from '@/lib/placeholders';
import { Image } from '@/components/ui/image';
import CategoryItem from "./category-item";

interface SubCategoryItemProps {
    item: any;
}
const SubCategoryItem: React.FC<SubCategoryItemProps> = ({ item }) => { 
    return (
        <>
        <CategoryItem item={item} key={item.key}/>

        {item.children.map((item: any) => ( 
                <div className="relative overflow-hidden text-center cursor-pointer group"  key={item.key}>
                    <Link href={item.href}>
                        <Image
                            src={item?.image?.original ? item?.image?.original : productPlaceholder}
                            alt={item?.name}
                            width={200}
                            height={240}
                            layout="responsive"
                            className="rounded-md"
                        />
                    </Link>
                    <span className="block mt-2 text-base font-semibold transition-colors text-heading group-hover:text-orange-500 ltr:text-left rtl:text-right">
                        {item?.name}
                    </span>
                </div>
            ))
        }
        </>
    );
};

export default SubCategoryItem;