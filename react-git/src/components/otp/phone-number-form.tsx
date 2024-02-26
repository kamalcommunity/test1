import { STATIC_CONTENT } from '@/lib/constants/static-content';
import { Controller, SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { Form } from '@/components/ui/forms/form';
import PhoneInput from '@/components/ui/forms/phone-input';
import Button from '@/components/ui/button';
import * as yup from 'yup';

type FormValues = {
  phone_number: string;
};

const checkoutContactSchema = yup.object().shape({
  phone_number: yup.string().required('error-contact-required').min(12, 'Must be exactly 10 digits').max(12, 'Must be exactly 10 digits'),
});

interface PhoneNumberFormProps {
  onSubmit: SubmitHandler<FormValues>;
  phoneNumber?: string;
  isLoading?: boolean;
  view?: 'login' | undefined;
}
export default function PhoneNumberForm({
  phoneNumber,
  onSubmit,
  isLoading,
  view,
}: PhoneNumberFormProps) {
  

  return (
    <Form<FormValues>
      onSubmit={onSubmit}
      validationSchema={checkoutContactSchema}
      className="w-full"
      useFormProps={{
        defaultValues: {
          phone_number: phoneNumber,
        },
      }}
    >
      {({ control, formState: { errors } }) => (
        <div className="flex flex-col">
          <div className="flex w-full items-center md:min-w-[360px]">
            <Controller
              name="phone_number"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  country="in"
                  inputClass="!p-0 ltr:!pr-4 rtl:!pl-4 ltr:!pl-14 rtl:!pr-14 !flex !items-center !w-full !appearance-none !transition !duration-300 !ease-in-out !text-heading !text-sm focus:!outline-none focus:!ring-0 !border !border-border-base ltr:!border-r-0 rtl:!border-l-0 !rounded ltr:!rounded-r-none rtl:!rounded-l-none focus:!border-accent !h-12"
                  dropdownClass="focus:!ring-0 !border !border-border-base !shadow-350"
                  {...field}
                />
              )}
            />
            <Button
              className="!text-sm ltr:!rounded-l-none rtl:!rounded-r-none"
              loading={isLoading}
              disabled={isLoading}
            >
              {view === 'login' ? (
                STATIC_CONTENT['text-send-otp']
              ) : (
                <>
                  {Boolean(phoneNumber) ? STATIC_CONTENT['text-update'] : STATIC_CONTENT['text-add']}{' '}
                  {STATIC_CONTENT['nav-menu-contact']}
                </>
              )}
            </Button>
          </div>
          {errors.phone_number?.message && (
            <p className="mt-2 text-xs text-red-500 ltr:text-left rtl:text-right">
              {errors.phone_number.message}
            </p>
          )}
        </div>
      )}
    </Form>
  );
}
