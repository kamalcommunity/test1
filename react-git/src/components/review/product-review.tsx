import { STATIC_CONTENT } from '@/lib/constants/static-content';
import Alert from '@/components/ui/alert';
import Button from '@/components/ui/button';
import { useTranslation } from 'next-i18next';
import * as yup from 'yup';
import { useModalAction, useModalState } from '@/components/ui/modal/modal.context';
import { Form } from '@/components/ui/forms/form';
import { useUser } from '@/framework/user';
import type { ProductReviewInput } from '@/types';
import { useRouter } from 'next/router';
import TextArea from '../ui/forms/text-area';
import { useProductReview } from '@/framework/product';
import { AddressType, DEFUALT_LANGUAGE } from '@/framework/utils/constants';
import ReactStars from "react-rating-stars-component";
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const ProductReviewFormSchema = yup.object().shape({
    review: yup.string().required('error-review-required'),
    //   password: yup.string().required('error-password-required'),
    //   email: yup.string().email('error-email-format').optional(),
});

function ProductReviewForm() {
    const [ratingcount, setratingcount] = useState(0)
    
    const router = useRouter();
    // const isCheckout = router.pathname.includes('checkout');
    const { mutate: addReview, isLoading, serverError, setServerError } = useProductReview();
    const { me }: any = useUser();
    const { id }: any = me ?? {};
    const { openModal } = useModalAction();

    useEffect(() => {
        const { id, firstName, lastName }: any = me ?? {};
        if (!(id && firstName && lastName )) {
                const addressType = AddressType.Billing;
                toast.warning('Please first update your profile');
                openModal('ADD_OR_UPDATE_ADDRESS', { customerId: id, type: addressType });
        }
    }, [])


    const {
        data: { productId },
    } = useModalState();

    function onSubmit({ review }: ProductReviewInput) {
        if (!(review && ratingcount)) {
            toast.error("Rating and review not given")
            return;
        }
        addReview({
            customerId: id,
            description: review,
            id: 0,
            language: DEFUALT_LANGUAGE,
            productId: productId,
            rating: ratingcount
        })
    }

    const ratingChanged = (newRating: any) =>  {
        setratingcount(+newRating)
    };

    return (
        <>
            <Alert
                variant="error"
                message={serverError && t(serverError)}
                className="mb-6"
                closeable={true}
                onClose={() => setServerError(null)}
            />
            <div className="rating_demo">
                <ReactStars
                    count={5}
                    onChange={ratingChanged}
                    size={50}
                    isHalf={true}
                    emptyIcon={<i className="far fa-star"></i>}
                    halfIcon={<i className="fa fa-star-half-alt"></i>}
                    fullIcon={<i className="fa fa-star"></i>}
                    activeColor="#ffd700"
                />
            </div>
            <Form<ProductReviewInput>
                onSubmit={onSubmit}
                validationSchema={ProductReviewFormSchema}
            >
                {({ register, formState: { errors } }) => (
                    <>

                        <TextArea
                            label={STATIC_CONTENT['text-write-a-review']}
                            {...register('review')}
                            error={errors.review?.message!}
                            variant="outline"
                            className="col-span-2"
                        />
                        <div className="mt-8">
                            <Button
                                className="h-11 w-full sm:h-12"
                                loading={isLoading}
                                disabled={isLoading}
                            >
                                {STATIC_CONTENT['text-submit']}
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

export default function ProductReviewView() {
    
    return (
        <div className="flex h-full min-h-screen w-screen flex-col justify-center bg-light py-6 px-5 sm:p-8 md:h-auto md:min-h-0 md:max-w-[480px] md:rounded-xl">
            <ProductReviewForm />
        </div>
    );
}
