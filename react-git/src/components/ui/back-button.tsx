import { STATIC_CONTENT } from '@/lib/constants/static-content';
import ArrowNarrowLeft from '@/components/icons/arrow-narrow-left';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';

const BackButton = () => {
  const router = useRouter();
  
  return (
    <button
      className="inline-flex items-center justify-center text-accent font-semibold transition-colors hover:text-accent-hover focus:text-accent-hover focus:outline-none"
      onClick={router.back}
    >
      <ArrowNarrowLeft
        className={cn('w-5 h-5 ltr:mr-2 rtl:ml-2', {
          'transform rotate-180':
            router.locale === 'ar' || router.locale === 'he',
        })}
        strokeWidth={1.7}
      />
      {STATIC_CONTENT['text-back']}
    </button>
  );
};

export default BackButton;
