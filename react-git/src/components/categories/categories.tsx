import ErrorMessage from '@/components/ui/error-message';
import dynamic from 'next/dynamic';
import { useCategories } from '@/framework/category';
import SectionBlockWithHeader from '../ui/section-block-with-header';
import { toast } from 'react-toastify';
import SectionBlock from '../ui/section-block';
import { ROUTES } from '@/lib/routes';
import router, { useRouter } from 'next/router';

const StickySidebarListCategories = dynamic(
  () => import('@/components/categories/sticky-sidebar-list-categories')
);
const StaticSidebarVerticalRectangleCategories = dynamic(
  () => import('@/components/categories/sliding-vertical-rectangle-categories')
);
const StickySidebarBoxedCategories = dynamic(
  () => import('@/components/categories/sticky-sidebar-boxed-categories')
);
const FilterCategoryGrid = dynamic(
  () => import('@/components/categories/filter-category-grid')
);
const SlidingCardCategories = dynamic(
  () => import('@/components/categories/sliding-card-category')
);
const JewelleryCategoryGrid = dynamic(
  () => import('@/components/categories/jewellery-category-grid')
);

const MAP_CATEGORY_TO_GROUP: Record<string, any> = {
  classic: StickySidebarListCategories,
  modern: StickySidebarBoxedCategories,
  standard: StaticSidebarVerticalRectangleCategories,
  minimal: FilterCategoryGrid,
  compact: SlidingCardCategories,
  jewe: JewelleryCategoryGrid,
  square: SlidingCardCategories,
  default: StickySidebarListCategories,
};
interface CategoriesProps {
  layout: string;
  variables: any;
  className?: string;
}
export default function Categories({
  layout,
  className,
  variables,
}: CategoriesProps) {
  
  const { categories, isLoading, error } = useCategories(variables);
  const router = useRouter();

  if (error) return <ErrorMessage message={error.message} />;
  // if (error) return toast.error(error.message);
  const Component = MAP_CATEGORY_TO_GROUP[layout];
  const shouldDisplaySectionBlock = !router.asPath.includes('categories');
  
  return (
    categories && categories.length > 0 ?
      <SectionBlockWithHeader title={'Shop By Category'} subTitle={'Browse through your favourite categories. We`ve got them all!'}>
      {shouldDisplaySectionBlock &&  <SectionBlock title={"Which Category You Like to See?"} href={ROUTES.CATEGORIES}>
        </SectionBlock> }
        <Component
          notFound={!Boolean(categories.length)}
          categories={categories}
          loading={isLoading}
          className={className}
          variables={variables}
        />
      </SectionBlockWithHeader>

      : null
  );
}
