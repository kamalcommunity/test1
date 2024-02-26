import { useType } from '@/framework/type';
import { Type } from '@/types';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';
const ErrorMessage = dynamic(() => import('@/components/ui/error-message'));
const BannerWithSearch = dynamic(
  () => import('@/components/banners/banner-with-search')
);
const BannerShort = dynamic(() => import('@/components/banners/banner-short'));
const BannerWithoutSlider = dynamic(
  () => import('@/components/banners/banner-without-slider')
);
const BannerWithPagination = dynamic(
  () => import('@/components/banners/banner-with-pagination')
);

const BannerWithFullWidth = dynamic(
  () => import('@/components/banners/banner-with-full-width')
);

const Square = dynamic(() => import('@/components/layouts/square'));

const MAP_BANNER_TO_GROUP: Record<string, any> = {
  classic: BannerWithSearch,
  modern: BannerShort,
  minimal: BannerWithoutSlider,
  standard: BannerWithSearch,
  compact: BannerWithPagination,
  jewe: BannerWithFullWidth,
  square: BannerWithFullWidth,
  default: BannerWithSearch,
};

const Banner: React.FC<{ layout: string; variables: any }> = ({
  layout,
  variables,
}) => {
  const { type, isLoading, error }:any = useType(variables.type);
  // if (error) return <ErrorMessage message={error.message} />;
  // if (error) return toast.error(error.message);
  const Component = MAP_BANNER_TO_GROUP[layout];
  return (
      <Component banners={type?.banners ?? []} layout={layout} slug={type?.slug} />
  );
};

export default Banner;
