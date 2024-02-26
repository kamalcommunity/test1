import type {
  Author,
  AuthorPaginator,
  AuthorQueryOptions,
  QueryOptions,
} from '@/types';
import { useInfiniteQuery, useQuery } from 'react-query';
import client from './client';
import { API_ENDPOINTS } from './client/api-endpoints';
import { mapPaginatorData } from '@/framework/utils/data-mappers';

export function useAuthors(options?: Partial<AuthorQueryOptions>) {
  // const {
  //   data,
  //   isLoading,
  //   error,
  //   fetchNextPage,
  //   hasNextPage,
  //   isFetching,
  //   isFetchingNextPage,
  // } = useInfiniteQuery<AuthorPaginator, Error>(
  //   [API_ENDPOINTS.AUTHORS, options],
  //   ({ queryKey, pageParam }) =>
  //     client.authors.all(Object.assign({}, queryKey[1], pageParam)),
  //   {
  //     getNextPageParam: ({ current_page }) => ({ page: current_page + 1 }),
  //   }
  // );

  // function handleLoadMore() {
  //   fetchNextPage();
  // }

  let isLoading = false;
  let error = '';
  let isFetching = false;

  return {
    authors: [],
    paginatorInfo: [],
    isLoading,
    error,
    isFetching,
    isLoadingMore: false,
    loadMore: () => { },
    hasMore: Boolean(false),
  };
}

export function useTopAuthors(options: Pick<QueryOptions, 'limit'>) {
  // const { data, isLoading, error } = useQuery<Author[], Error>(
  //   [API_ENDPOINTS.AUTHORS_TOP, options],
  //   ({ queryKey }) => client.authors.top(queryKey[1] as QueryOptions)
  // );
  return {
    authors: [],
    isLoading: false,
    error: '',
  };
}
