import { productPlaceholder } from "@/lib/placeholders";
import {Testmonial, TestmonialDescription } from "@/types";
import { useQuery } from "react-query";
import client from "./client";
import { API_ENDPOINTS } from "./client/api-endpoints";


export function useTestmonial() {
  
    const { data, isLoading, error } = useQuery<Testmonial, Error>(
      [API_ENDPOINTS.PLUGIN, API_ENDPOINTS.STORE,API_ENDPOINTS.REVIEWS],
      () => getTestmonials()
    );
    
    return {
      ...data,
      testmonialList: data?.value,
      active: data?.active && false,
      isLoading,
      error,
      testmonial_count: data?.value ? data?.value.length : 0
    };
  }


  const  getTestmonials = async () =>  {
    const response = await client.testmonial.get();
    let parseValue: any = response && response?.value ? JSON.parse(response.value) : [];
    return {
      ...response,
      value: parseValue
    };
    
  }