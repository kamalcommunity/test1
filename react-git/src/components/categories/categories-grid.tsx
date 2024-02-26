import { useCategories } from '@/framework/category'; 
import ManufacturerLoader from '../ui/loaders/manufacturer-loader';
import rangeMap from '@/lib/range-map'; 
import SubCategoryItem from '../ui/sub-category-item';


export default function CategoriesGrid({
    variables,
}: any) {
    const { categories, isLoading, error } = useCategories(variables);

    if (!isLoading && !categories.length) {
        return (
          <div className="min-h-full bg-white px-4 pt-6 pb-8 lg:p-8">
            {/* <NotFound text="text-no-manufacturers" /> */}
          </div>
        );
      }

    return (
        <div className="mx-auto w-full py-8 lg:py-14 xl:py-20">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 lg:gap-7">
                {isLoading && !categories.length ?
                    rangeMap(9, (i) => (
                        <ManufacturerLoader key={i} uniqueKey={`categories-${i}`} />
                    ))
                    :
                    categories?.map((item: any) => <SubCategoryItem item={item} key={item.key} />)
                }
            </div>
        </div>
    );
}
