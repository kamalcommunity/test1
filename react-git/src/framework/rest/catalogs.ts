import { productPlaceholder } from "@/lib/placeholders";
import { Catalog, CatalogResponsePaginator, CatalogResponseQueryOptions, Configuration } from "@/types";
import { useInfiniteQuery } from "react-query";
import client from "./client";
import { API_ENDPOINTS } from "./client/api-endpoints";
import { mapPaginatorData } from "./utils/data-mappers";
import { findType } from "./utils/helper";

export function useCatalogs(options?: Partial<CatalogResponseQueryOptions>) {
    // const formattedOptions = formatProductsArgs(options);
    
    const {
        data,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
    } = useInfiniteQuery<CatalogResponsePaginator, Error>(
        [API_ENDPOINTS.CATALOGS, options],
        ({ queryKey, pageParam }) =>
            // getProducts(Object.assign({}, queryKey[1], pageParam)),
            getCatalogs(options),
        {
            getNextPageParam: ({ current_page, last_page }) =>
                last_page > current_page && { page: current_page + 1 },
        }
    );
    // debugger

    function handleLoadMore() {
        fetchNextPage();
    }
    // debugger
    return {
        catalogs: data?.pages.flatMap((page) => page.data) ?? [],
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

const getCatalogs = async ({ ...params }) => {
    const response = await client.catalog.all(params);
    let typeData = findType(params);

    const catalogsResponse = response.items?.map((catalog: Catalog) => {
        let parse_Configuration: Configuration = JSON.parse(catalog?.configuration);
        
        return {
            ...catalog,
            id: catalog?.id,
            type: typeData,
            catalog_name: catalog?.name,
            catalog_subtitle: catalog?.description,
            category_count: catalog?.category.length,
            parse_Configuration,
            category: catalog?.category?.map(category => {
                return {
                    ...category,
                    type: typeData,
                    id: category?.id,
                    href: `${typeData?.slug}/search/?category=${category?.description?.friendlyUrl}`,
                    img_src: category?.image?.path ?? productPlaceholder,
                    description: category?.description?.name,
                    category_friendlyUrl: category?.description?.friendlyUrl,
                    slug: category?.type?.slug ?? "",
                    parse_Configuration,
                }
            }),
        }
    });

    return {
        data: catalogsResponse,
        catalogs: catalogsResponse,
        total: response.recordsTotal,
        recordsTotal: response.recordsTotal,
        recordsFiltered: response.recordsFiltered,
        totalPages: response.totalPages,
        number: response.number,
        current_page: (params.page) ? params.page : 0,
        count: 10,
        last_page: response.totalPages - 1,
        firstItem: 0,
        lastItem: response.recordsTotal - 1,
        per_page: 10,
        links: [],
        path: "",
        to: 0,
        from: response.recordsTotal - 1,
        first_page_url: "",
        last_page_url: "",
        next_page_url: "",
        prev_page_url: ""
    };
}