import { ContentBox, ContentBoxesPaginator } from "@/types";
import { useInfiniteQuery } from "react-query";
import client from "./client";
import { API_ENDPOINTS } from "./client/api-endpoints";
import { mapPaginatorData } from "./utils/data-mappers";
import { findType } from "./utils/helper";
import { productPlaceholder } from "@/lib/placeholders";
import parse from 'html-react-parser';

export function useContentBoxes() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery<ContentBoxesPaginator, Error>(
    [API_ENDPOINTS.BOXES],
    ({ queryKey, pageParam }) =>
      getContentBoxes(Object.assign({}, queryKey[1], pageParam)),
    {
      getNextPageParam: ({ current_page }) => ({ page: current_page + 1 }),
    }
  );
  function handleLoadMore() {
    fetchNextPage();
  }
  return {
    contentBoxes: data?.pages.flatMap((page) => page?.contentBoxes) ?? [],
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
}

const getContentBoxes = async ({ ...params }): Promise<any> => {
  let typeData = findType(params);
  let contentBoxPaginatorData;

  const response = await client.contentboxes.all({ type: typeData, params });

  if (response) {
    const formatedContentboxes: ContentBox[] = response?.items.map(((item: ContentBox) => {
      let des = item?.description?.description;
      let parsedDescData = des ? parse(des) : "";
      return {
        ...item,
        desc: parsedDescData,
        label: item?.description?.title ?? "",
        imagePath: item?.image?.path ?? productPlaceholder,
        imageName: item?.image?.name ?? "",
        href: item?.description?.friendlyUrl ?? "",
        path: item?.image?.path ?? "",
      }
    }))
    contentBoxPaginatorData = {
      ...response,
      data: formatedContentboxes ?? [],
      contentBoxes: formatedContentboxes ?? [],
      total: response.recordsTotal,
      recordsTotal: response.recordsTotal,
      recordsFiltered: response.recordsFiltered,
      number: response.number,
      last_page: response.totalPages - 1,
      from: response.recordsTotal - 1,
      totalPages: response.totalPages,
      current_page: (params.page) ? params.page : 0,
      per_page: 5,
      count: 5,
      path: "",
      to: 0,
      first_page_url: "",
      last_page_url: "",
      next_page_url: "",
      prev_page_url: "",
      links: [],
      firstItem: 0,
      lastItem: response.recordsTotal - 1,
    };
  }
  return contentBoxPaginatorData;
}