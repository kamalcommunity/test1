import { useInfiniteQuery, useQuery } from "react-query";
import client from "./client";
import { mapPaginatorData } from "./utils/data-mappers";
import { API_ENDPOINTS } from "./client/api-endpoints";
import { Blog, BlogPaginator } from "@/types";
import { productPlaceholder } from "@/lib/placeholders";
import { BLOGS_PER_PAGE } from "./client/variables";


export function useBlogs(options?: Partial<any>) {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery<BlogPaginator, Error>(
    [API_ENDPOINTS.BLOG],
    ({ queryKey, pageParam }) =>
      getBlogs(Object.assign({}, queryKey[1], pageParam)),
    {
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 },
    }
  );

  function handleLoadMore() {
    fetchNextPage();
  }

  return {
    blogs: data?.pages.flatMap((page) => page.data) ?? [],
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


export function useBlog(code:string) {
  
  const { data, isLoading, error } = useQuery<Blog, Error>(
    [API_ENDPOINTS.ORDERS, code],
    () => getBlog(code)
  );
  
  return {
    blog: data,
    isLoading,
    error,
  };
}

const getBlog = async (code: string): Promise<Blog | undefined | null> => {
  const response = await client.blog.get(code);
  if (response) {
    const formatedBlogs: Blog = {
      ...response,
      desc: response?.description?.description ?? "",
      label: response?.description?.title ?? "",
      imagePath: response?.image?.path ?? productPlaceholder,
      imageName: response?.image?.name ?? "",
      href: response?.description?.friendlyUrl ?? "",
    }
    return formatedBlogs;
  }
}


const getBlogs = async ({ ...params }): Promise<any> => {
  // try {
  let blogPaginatorData;
  // throw new Error("test error")
  const response = await client.blog.all(params);
  if (response) {
    const formatedBlogs: Blog[] = response?.items.map(((item: Blog) => {
      return {
        ...item,
        desc: item?.description?.description ?? "",
        label: item?.description?.title ?? "",
        imagePath: item?.image?.path ?? productPlaceholder,
        imageName: item?.image?.name ?? "",
        href: item?.description?.friendlyUrl ?? "",
      }
    }))
    blogPaginatorData = {
      ...response,
      data: formatedBlogs ?? [],
      blogs: formatedBlogs ?? [],
      total: response.recordsTotal,
      recordsTotal: response.recordsTotal,
      recordsFiltered: response.recordsFiltered,
      totalPages: response.totalPages,
      number: response.number,
      current_page: (params.page) ? params.page : 0,
      count: BLOGS_PER_PAGE,
      last_page: response.totalPages - 1,
      firstItem: 0,
      lastItem: response.recordsTotal - 1,
      per_page: BLOGS_PER_PAGE,
      links: [],
      path: "",
      to: 0,
      from: response.recordsTotal - 1,
      first_page_url: "",
      last_page_url: "",
      next_page_url: "",
      prev_page_url: "",
    };
  }
  return blogPaginatorData;
  // } catch (error) {
  //   return error;
  // }

}

