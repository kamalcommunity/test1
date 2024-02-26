import { DEFUALT_LAYOUT_TYPE, TYPE_DATA, TYPE_DEFUALT_INDEX } from '@/framework/utils/constants';
import { useRouter } from 'next/router';

import { useSettings } from '@/framework/settings';

const useLayout = () => {
  // const data = useTypes({
  //   limit: TYPES_PER_PAGE,
  // });
  const {
    settings,
  } = useSettings();

  const router = useRouter();
  const regex = /^\/$|^\/\?(.*)/;
  // let item;
  let item = TYPE_DATA.find(item => item.id === +settings?.themeLayoutId);

  if (regex.test(router?.asPath)) {
    // const homePage =
    //   data?.types?.find((type) => type?.settings?.isHome) ?? data?.types?.[TYPE_DEFUALT_INDEX]
    // const homePage = TYPE_DATA[TYPE_DEFUALT_INDEX] 
    const homePage = item ? item : TYPE_DATA[TYPE_DEFUALT_INDEX];
    
    return {
      layout: homePage?.settings?.layoutType ?? DEFUALT_LAYOUT_TYPE,
      page: homePage,
    };
  }
  const page = item?.types?.find((type) => router.asPath.includes(type.slug));
  return {
    layout: page?.settings?.layoutType ?? DEFUALT_LAYOUT_TYPE,
    page,
  };
};

export default useLayout;
