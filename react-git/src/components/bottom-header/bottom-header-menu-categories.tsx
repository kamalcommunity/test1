import { Category, Navigation } from '@/types';
import BakeryCategoryLoader from '../ui/loaders/bakery-categories-loader';
import JewelleryCategoriesMenu from '../ui/jewellery-category-menu';

interface BottomHeaderMenuCategoriesProps {
  notFound: boolean;
  loading: boolean;
  categories: Category[];
  className?: string;
  variables: any;
  pages: Navigation[];
}

const BottomHeaderMenuCategories: React.FC<BottomHeaderMenuCategoriesProps> = ({
  notFound,
  categories,
  loading,
  variables,
  pages
}) => {
  if (loading) {
    return (
      <div className="hidden xl:block">
        <div className="w-full h-52 flex justify-center mt-8 px-2">
          <BakeryCategoryLoader />
        </div>
      </div>
    );
  }
  return (
    <>
      {!notFound ? (
        <JewelleryCategoriesMenu items={{categories: categories, pages: pages}} />
      ) : (
        <div className="min-h-full  ">
          {/* <NotFound text="text-no-category" className="h-96" /> */}
        </div>
      )}
    </>
  );
};

export default BottomHeaderMenuCategories;
