import { ProductGroupsQueryOptions, ProductQueryOptions } from '@/types';
import { DEFUALT_ITEM_COUNT } from './constants';

export const formatProductsArgs = (options?: Partial<ProductGroupsQueryOptions>) => {
  // Destructure
  const {
    // limit = 30,
    price,
    category,
    text,
    searchType,
    searchQuery,
    code,
    categorySlugs,
    orderBy,
    sortedBy,
    manufacturer,
    limit,
    ...restOptions
  } = options || {};
  return {
    // limit,
    ...(price && { min_price: price as string }),
    ...(text && { name: text.toString() }),
    ...(category && { categories: category.toString() }),
    ...(searchType && { type: searchType.toString() }),
    ...(searchQuery && { name: searchQuery.toString() }),
    ...(code && { code }),
    ...(categorySlugs && categorySlugs.length && { categorySlugs }),
    ...(orderBy && { orderBy }),
    ...(sortedBy && sortedBy.length && { criteriaOrderByField:sortedBy }),
    ...(manufacturer && { manufacturers: manufacturer }),
    ...(limit && { limit: null }),
    // ...(count && { count: count ?? DEFUALT_ITEM_COUNT}),
    ...options
  };
};
