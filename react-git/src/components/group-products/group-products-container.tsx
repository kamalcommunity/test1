import ErrorMessage from '@/components/ui/error-message';
import dynamic from 'next/dynamic';
import { useCategories } from '@/framework/category';
import GroupProductsCompact from './group-products-compact';
import { useProductGroups } from '@/framework/product';
import { toast } from 'react-toastify';


const GroupProductGrid = dynamic(
    () => import('@/components/group-products/group-product-grid')
);

const MAP_CATEGORY_TO_GROUP: Record<string, any> = {
    // compact: GroupProductsCompact,
    jewe: GroupProductGrid,
    square: GroupProductGrid,
};
interface GroupProductsContainerProps {
    layout: string;
    variables: any;
    className?: string;
}
export default function GroupProductsContainer({
    layout,
    className,
    variables,
}: GroupProductsContainerProps) {
    const { productGroups, isLoading, error } = useProductGroups(variables);
    // debugger
    // if (error) return <ErrorMessage message={error.message} />;
    // if (error) return toast.error(error.message);
    const Component = MAP_CATEGORY_TO_GROUP[layout];
    return (
        productGroups && productGroups.length > 0 ?
            <Component
                notFound={!Boolean(productGroups.length)}
                items={productGroups}
                // loading={isLoading}
                className={className}
                variables={variables}
            /> : <></>
    );
}
