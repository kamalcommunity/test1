import type { Navigation, PageContent } from '@/types';
import { useQuery } from 'react-query';
import client from './client';
import { API_ENDPOINTS } from './client/api-endpoints';
import parse from 'html-react-parser';


export const useNavigation = () => {
    const { data, isLoading, error } = useQuery<Navigation[], Error>(
        [API_ENDPOINTS.NAVIGATION],
        () => getNavigation()
    );

    return {
        navigation: data ?? [],
        isLoading,
        error,
    };
};

export const usePageData = (code: string ,store:string) => {
    const { data, isLoading, error } = useQuery<PageContent, Error>(
        [API_ENDPOINTS.NAVIGATION ,API_ENDPOINTS.PAGES],
        () => client.navigation.get(code ,store)
    )
    return {
        data: data ?? {} as PageContent,
        pageContent: (data && data?.description?.description)? parse(data?.description?.description): "",
        isLoading,
        error
    }
}

const getNavigation = async () => {
    const response = await client.navigation.all();
    return response ? buildNavigationHeader(response) : [] as Navigation[];
}

// const getNavigationPageByCode = async (code: string = "") => {
//     const response = await client.navigation.get(code);
//     console.log('response ------------------------ ', response);

//     return {
//         ...response,
//         pageData: response?.description?.description ?? "",
//     };
// }


function buildNavigationHeader(data: Navigation[]): Navigation[] {
    return data.map(
        ({ id, code, name, contentType, visible, title, sortOrder, image, children: data, parent, displayedInHeader, displayedInFooter }: Navigation) => {
            return {
                id: id,
                code: code,
                name: name,
                contentType: contentType,
                visible: visible,
                title: title,
                sortOrder: sortOrder,
                href: `/pages/${code}`,
                icon: "",
                label: title.toUpperCase(),
                image: image,
                parent: parent,
                displayedInFooter: displayedInFooter,
                displayedInHeader: displayedInHeader,
                children: (data && data.length > 0) ? buildNavigationHeader(data) : []
            };
        }).filter((item: Navigation) => {
            return item?.visible
        }) ?? [];
}

// children.map((item: Navigation) => {
//     return {
//         id: item?.id,
//         code: item?.code,
//         name: item?.name,
//         contentType: item?.contentType,
//         visible: item?.visible,
//         title: item?.title,
//         sortOrder: item?.sortOrder,
//         displayedInMenu: item?.displayedInMenu,
//         href: `/pages/${item?.code}`,
//         icon: "",
//         label: item?.code.toUpperCase(),
//         image: item?.image,
//     }
// })