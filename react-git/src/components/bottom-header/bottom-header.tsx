import ErrorMessage from '@/components/ui/error-message';
import dynamic from 'next/dynamic';
import { useCategories } from '@/framework/category';
import cn from 'classnames';
import { useNavigation } from '@/framework/navigation';

const BottomHeaderMenuCategories = dynamic(
    () => import('@/components/bottom-header/bottom-header-menu-categories')
);

const MAP_CATEGORY_TO_GROUP: Record<string, any> = {
    jewe: BottomHeaderMenuCategories,
    square: BottomHeaderMenuCategories,
    default: BottomHeaderMenuCategories
};
interface CategoriesProps {
    layout: string;
    variables?: any;
    className?: string;
}
export default function BottomHeader({
    layout,
    className,
    variables,
}: CategoriesProps) {
    const { categories, isLoading, error } = useCategories(variables);

    const {
        navigation,
        error: navigationError
    } = useNavigation();


    // if (error) return <ErrorMessage message={error.message} />;
    // if (error) return toast.error(error.message);
    if (navigationError) return <ErrorMessage message={navigationError.message} />;
    const Component = MAP_CATEGORY_TO_GROUP[layout];

    return (
      categories.length > 0 ? <header className={cn('site-header-with-search w-full lg:block hidden')}>
            <div
                className={cn(
                    'z-10 flex w-full flex-col items-center bottom-header-bg-color px-2 py-[10px] shadow-sm transition-transform duration-300 ltr:lg:pl-12 ltr:lg:pr-8 rtl:lg:pr-12 rtl:lg:pl-8'
                )}>
                {categories && categories.length > 0 ?
                    <Component
                        notFound={!Boolean(categories.length)}
                        categories={categories}
                        pages={navigation}
                        loading={isLoading}
                        className={className}
                        variables={variables}
                    /> : null}
            </div>
        </header> : <></>
    )


}
