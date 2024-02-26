import dynamic from 'next/dynamic';
import { useCatalogs } from '@/framework/catalogs';
import SectionBlockWithHeader from '../ui/section-block-with-header';
import { Catalog } from '@/types';

const CollectionGridCard = dynamic(
    () => import('@/components/collection/collection-grid-card')
);

const MAP_CATEGORY_TO_GROUP: Record<string, any> = {
    jewe: CollectionGridCard,
    square: CollectionGridCard,
};
interface CollectionProps {
    layout: string;
    variables?: any;
    className?: string;
}
export default function Collection({
    layout,
    className,
    variables,
}: CollectionProps) {
    // const { categories, isLoading, error } = useCategories(variables);
    const { catalogs, isLoading, error } = useCatalogs(variables);
    // if (error) return <ErrorMessage message={error.message} />;
    // if (error) return toast.error(error.message);
    const Component = MAP_CATEGORY_TO_GROUP[layout];

    return (catalogs && catalogs.length > 0 ?
        catalogs?.map(({ id, catalog_name, category, category_count, description }: Catalog) => {
            return category && category_count > 0 ?
                <SectionBlockWithHeader key={id} title={catalog_name} subTitle={description}>
                    <Component
                        notFound={!Boolean(category_count)}
                        items={category}
                        // loading={isLoading}
                        className={className}
                        variables={variables}
                    />
                </SectionBlockWithHeader> : <></>
        })
        : null);
}
