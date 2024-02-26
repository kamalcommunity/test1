import BakeryCategoryLoader from '@/components/ui/loaders/bakery-categories-loader';
import NotFound from '@/components/ui/not-found';
import SectionBlock from '@/components/ui/section-block';
import SolidCardCategory from '@/components/ui/solid-card-category';
import { Category } from '@//types';
interface SlidingCardCategoriesProps {
  notFound: boolean;
  loading: boolean;
  categories: Category[];
  Component: React.FunctionComponent
}

const SlidingCardCategories: React.FC<SlidingCardCategoriesProps> = ({
  notFound,
  categories,
  loading,
  Component
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
    {/* <Component /> */}
    {!notFound ? (
      <SolidCardCategory items={categories} className="py-8" />
    ) : (
      <div className="min-h-full">
        <NotFound text="text-no-category" className="h-96" />
      </div>
    )}
    </>
  );
};

export default SlidingCardCategories;
