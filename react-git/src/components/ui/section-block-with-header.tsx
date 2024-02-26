import { STATIC_CONTENT } from '@/lib/constants/static-content';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import Link from '@/components/ui/link';

type SectionProps = {
  className?: any;
  title?: string;
  subTitle?: string;
  href?: string;
};

/**
 * UI component for a section block
 * @param {string} title - The title of the section
 * @param {string} subTitle - The subtitle of the section
 * @param {string} description - The description of the section
 * @param {string} href - The href of the external page for this section
 */

const SectionBlockWithHeader: React.FC<SectionProps> = ({
  className,
  title,
  subTitle,
  href,
  children,
}) => {
  
  return (
    <div
      className={cn(
        'w-full flex pb-[40px] xl:pb-[54px] 3xl:pb-[60px] px-7 xl:px-16 flex-col',
        className
      )}
    >
      {title && (
        <div className="flex justify-center flex-col items-center mb-10 capitalize">
          {title && (
            <h2 className="font-bold text-center text-accent sm:text-3xl md:text-4xl text-2xl leading-10 ">
              {title}
            </h2>
          )}
          <p className='font-normal text-sm md:text-lg mt-2.5 md:px-0 sm:px-24 px-12 text-center'>{subTitle}</p>
          {href && (
            <Link
              href={href}
              className="text-base font-semibold justify-end transition-colors hover:text-accent"
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

export default SectionBlockWithHeader;
