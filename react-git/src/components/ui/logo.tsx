import { Image } from '@/components/ui/image';
import cn from 'classnames';
import Link from '@/components/ui/link';
import { logoPlaceholder } from '@/lib/placeholders';
import { useSettings } from '@/framework/settings';

const Logo: React.FC<React.AnchorHTMLAttributes<{}>> = ({
  className,
  ...props
}) => {
  const {
    settings: { logo, siteTitle },
  } = useSettings();

  return (
    <Link href="/" className={cn('inline-flex', className)} {...props}>
      <span className="relative h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full">
        {logo ? (
          <Image
            src={logo ?? logoPlaceholder}
            alt={siteTitle}
            layout="fill"
            objectFit="cover"
            loading="eager"
          />
        ) : (
          <span
            className={cn(
              'relative flex h-16 w-16 shrink-0 pl-5 pt-3 font-semibold overflow-hidden   bg-gray-200'
            )}
          >
            {siteTitle ? siteTitle[0] : ''}
          </span>
        )}
      </span>
    </Link>
  );
};

export default Logo;
