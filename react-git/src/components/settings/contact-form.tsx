import { STATIC_CONTENT } from '@/lib/constants/static-content';
import type { CreateContactUsInput } from '@/types';
import Button from '@/components/ui/button';
import { Form } from '@/components/ui/forms/form';
import Input from '@/components/ui/forms/input';
import TextArea from '@/components/ui/forms/text-area';
import { useContact } from '@/framework/user';
import { useTranslation } from 'next-i18next';
import * as yup from 'yup';

const contactFormSchema = yup.object().shape({
  name: yup.string().required('error-name-required'),
  email: yup
    .string()
    .email('error-email-format')
    .required('error-email-required'),
  subject: yup.string().required('error-subject-required'),
  description: yup.string().required('error-description-required'),
});
const ContactForm = () => {
  
  const { mutate, isLoading } = useContact();

  let resetForm: any;

  function onSubmit(values: CreateContactUsInput) {
    mutate(values);
    if(resetForm) {
      resetForm();
    }
  }

  return (
    <div className='sm:px-10 px-4 pt-6 pb-24'> 
    <div className='rounded-xl border shadow-xl px-10 py-10'>
    <h4 className='md:text-4xl text-2xl  pb-6'> {STATIC_CONTENT['text-contact-us']} </h4>
    <Form<CreateContactUsInput>
      onSubmit={onSubmit}
      validationSchema={contactFormSchema}
    >
      {({ register, formState: { errors }, reset: reset }) => {
        resetForm = reset;

        return(
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              label={STATIC_CONTENT['text-name']}
              {...register('name')}
              variant="outline"
              error={errors.name?.message!}
            />
            <Input
              label={STATIC_CONTENT['text-email']}
              {...register('email')}
              type="email"
              variant="outline"
              error={errors.email?.message!}
            />
          </div>
          <Input
            label={STATIC_CONTENT['text-subject']}
            {...register('subject')}
            variant="outline"
            className="my-6"
            error={errors.subject?.message!}
          />
          <TextArea
            label={STATIC_CONTENT['text-description']}
            {...register('description')}
            variant="outline"
            className="my-6"
            error={errors.description?.message!}
          />

          <Button loading={isLoading} disabled={isLoading}>
            {STATIC_CONTENT['text-submit']}
          </Button>
        </>
      )}}
    </Form>
    </div>
    </div>
  );
};

export default ContactForm;
