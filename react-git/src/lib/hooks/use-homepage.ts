import { TYPES_PER_PAGE } from '@/framework/client/variables';
import { TYPE_DEFUALT_INDEX } from '@/framework/utils/constants';
import { useTypes } from '@/framework/type';

export default function useHomepage() {
  const { types } = useTypes({
    limit: TYPES_PER_PAGE,
  });
  if (!types) {
    return {
      homePage: {
        slug: '',
      },
    };
  }
  return {
    homePage: types.find((type) => type.settings.isHome) ?? types[TYPE_DEFUALT_INDEX],
  };
}
