import type { CategoryPaginator, CategoryQueryOptions } from '@/types';
import { useInfiniteQuery } from 'react-query';
import client from './client';
import { API_ENDPOINTS } from './client/api-endpoints';
import { mapPaginatorData } from '@/framework/utils/data-mappers';
import { TYPE_DATA, TYPE_DEFUALT_INDEX } from './utils/constants';
import { findType, formatCategory } from './utils/helper';
import { formatCategoryData } from '@/lib/format-api-data';

export function useCategories(options?: Partial<CategoryQueryOptions>) {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery<CategoryPaginator, Error>(
    [API_ENDPOINTS.CATEGORIES, options],
    ({ queryKey, pageParam }) =>
      client.categories.all(Object.assign({}, queryKey[1], pageParam)),
    {
      getNextPageParam: ({ current_page }) => ({ page: current_page + 1 }),
    }
  );

  function handleLoadMore() {
    fetchNextPage();
  }
  // const type = TYPE_DATA[9];
  let type = findType(options);
  let childParentCategories: any = [];
  let categories: any = data?.pages.flatMap((page) => {
    return page?.categories?.map((category) => {
      const children = category.children.map((child) => {
        return formatCategoryData(child);
      });
      let item = formatCategoryData(category, children);
      childParentCategories.push(item, ...children);
      return item;
    });
  });

  return {
    childParentCategories: childParentCategories ?? [],
    categories: categories ?? [],
    paginatorInfo: Array.isArray(data?.pages)
      ? mapPaginatorData(data?.pages[data.pages.length - 1])
      : null,
    isLoading,
    error,
    isFetching,
    isLoadingMore: isFetchingNextPage,
    loadMore: handleLoadMore,
    hasMore: Boolean(hasNextPage),
  };

  // function formatCategory(category: any, children?: any) {
  //   return {
  //     ...category,
  //     slug: category.categoryDescription.friendlyUrl,
  //     name: category.categoryDescription.name,
  //     image: {
  //       id: category.id,
  //       original: category.image?.path ?? '',
  //       thumbnail: category.image?.path ?? '',
  //     },
  //     icon: category?.image?.path ?? '',
  //     type: type,
  //     href: `${type?.settings.layoutType}/search/?categorySlugs=${category?.description?.friendlyUrl}`,
  //     children: children ? children : [],
  //     label: category?.description?.title ?? '',
  //     parent_id: category?.depth > 0 ? category?.parent?.id : 0
  //   };
  // }
}
