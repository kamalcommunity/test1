import type { Banner, Type, TypeQueryOptions } from '@/types';
import { useQuery } from 'react-query';
import client from './client';
import { API_ENDPOINTS } from './client/api-endpoints';
import { getStore } from './client/helper';
import { DEFUALT_LAYOUT_TYPE } from './utils/constants';

export function useTypes(options?: Partial<TypeQueryOptions>) {
  const { data, isLoading, error } = useQuery<Type[], Error>(
    [API_ENDPOINTS.TYPES, options],
    ({ queryKey }) => getTypes(options)
  );
  return {
    types: data,
    isLoading,
    error,
  };
}

export function useType(slug: string) {
  const { data, isLoading, error } = useQuery<Type, Error>(
    [API_ENDPOINTS.TYPES, slug],
    () => client.types.get(slug),
    {
      enabled: Boolean(slug),
    }
  );

  const { data: bannerData, error: sliderError } = useQuery<Banner[], Error>(
    [API_ENDPOINTS.SLIDER],
    () => getSliderData()
  );
  if (data) {
    data['banners'] = bannerData || [];
  }
  return {
    type: data,
    isLoading,
    error,
  };
}

const getSliderData = async () => {
  const store = getStore();
  let data: Banner[] = [];
  const response = await client.slider.get({ store });
  if (response) {
    data = response?.slider?.map(item => {
      let imageAttachment = {
        id: 0,
        original: item?.image?.path,
        thumbnail: item?.image?.path,
        imageName: item?.image?.name,
        imageUrl: item?.image?.path,
        videoUrl: "",
        imageType: item?.image?.path
      }
      return {
        id: item.id,
        image: imageAttachment,
      }
    })
  }
  return data || [];
}

async function getTypes(queryKey: any): Type[] | Promise<Type[]> {
  let data = await client.types.all(Object.assign({}, queryKey[1]))
  data = data.map(type => {
    return type.settings.layoutType === DEFUALT_LAYOUT_TYPE ? {
      ...type,
      settings: {
        ...type.settings,
        isHome: true
      }
    } : {
      ...type,
      settings: {
        ...type.settings,
        isHome: false
      }
    }
  })
  return data;
}
