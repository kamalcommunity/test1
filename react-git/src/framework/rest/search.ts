import { AutocompleteRequestObj, AutoCompleteResponse } from "@/types";
import { useQuery } from "react-query";
import client from "./client";
import { API_ENDPOINTS } from "./client/api-endpoints";



export const useAutocomplete = (searchQuery: string) => {
    let reqBody: AutocompleteRequestObj = {
        count: 0,
        query: searchQuery,
        start: 0
    }

    const { data, isLoading, error } = useQuery<AutoCompleteResponse, Error>(
        [API_ENDPOINTS.SEARCH, API_ENDPOINTS.AUTOCOMPLETE, reqBody],
        () => client.search.autocomplete(reqBody)
    );

    return {
        data: data?.values ?? [],
        isLoading,
        error,
    };
};