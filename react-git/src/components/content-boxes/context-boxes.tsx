import ErrorMessage from '@/components/ui/error-message';
import SectionBlock from '../ui/section-block';
import { toast } from 'react-toastify';
import { useContentBoxes } from '@/framework/content-box';
import Spinner from '../ui/loaders/spinner/spinner';
import { ContentBox } from '@/types';
import { Fragment } from 'react';

// const TestmonialGridCard = dynamic(
//   () => import('@/components/testmonials/testmonial-grid-card')
// );

// const MAP_CATEGORY_TO_GROUP: Record<string, any> = {
//   jewe: TestmonialGridCard,
//   square: TestmonialGridCard,
//   default: TestmonialGridCard,
// };
// interface TestmonialProps {
//   layout: string;
//   variables: any;
//   className?: string;
// }
export default function ContentBoxes({
    layout,
    className,
    variables,
}: any) {
    const { contentBoxes, error, isLoading } = useContentBoxes();

    // if (isLoading) return <Spinner showText={false} />

    if (error) {
        toast.dismiss();
        toast.error(error.message)
        return <ErrorMessage message={error.message} />
    }

    function renderContentBoxes() {
        if (contentBoxes) {
            return contentBoxes.map(({ desc, id }: any) => (
                desc && <SectionBlock key={id} className={'overflow-hidden'} >{desc}</SectionBlock>
            ));
        }
        return <></>;
    }

    return (<>{renderContentBoxes()}</>)
}
