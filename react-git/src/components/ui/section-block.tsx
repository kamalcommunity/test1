import { STATIC_CONTENT } from '@/lib/constants/static-content';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import Link from '@/components/ui/link';

type SectionProps = {
  className?: any;
  title?: string;
  href?: string;
};

/**
 * UI component for a section block
 * @param {string} title - The title of the section
 * @param {string} description - The description of the section
 * @param {string} href - The href of the external page for this section
 */

const SectionBlock: React.FC<SectionProps> = ({
  className,
  title,
  href,
  children,
}) => {
  
  return (
    <div
      className={cn(
        'w-full flex pb-[40px] xl:pb-[54px] 3xl:pb-[60px] px-5 xl:px-10 flex-col',
        className
      )}
    >
      {title && (
        <div className="flex items-center justify-between sm:flex-row flex-col mb-7 relative">
          {title && (
            <h3 className="sm:text-2xl md:text-3xl text-lg font-semibold w-full text-center">
              {title}
            </h3>
          )}
          {href && (
            <Link
              href={href}
              className="sm:text-base text-xs sm:w-auto w-full font-bold justify-end transition-colors hover:text-accent sm:absolute right-0 md:top-auto sm:top-6 text-center sm:pt-0 pt-2"
            >
              {STATIC_CONTENT['text-see-all']}
            </Link>
          )}
        </div>
      )}

      {children}
    </div>
  );
};

export default SectionBlock;
