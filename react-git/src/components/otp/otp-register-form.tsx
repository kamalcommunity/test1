import { STATIC_CONTENT } from '@/lib/constants/static-content';
import { useTranslation } from 'react-i18next';
import MobileOtpInput from 'react-otp-input';
import Button from '@/components/ui/button';
import Input from '@/components/ui/forms/input';
import Label from '@/components/ui/forms/label';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { Form } from '@/components/ui/forms/form';
import { Controller } from 'react-hook-form';
import * as yup from 'yup';
import PasswordInput from '../ui/forms/password-input';
import { maxLengthFun } from '@/framework/utils/helper';

interface OtpRegisterFormProps {
  onSubmit: (formData: any) => void;
  loading: boolean;
}

type OtpRegisterFormValues = {
  email?: string;
  name?: string;
  code: string;
  password: string;
};

const otpLoginFormSchemaForNewUser = yup.object().shape({
  email: yup.string().email('error-email-format').optional(),
  // .required('error-email-required'),
  name: yup.string().optional(), // .required('error-name-required'),
  code: yup.string().required('Otp is Required').min(6, 'Must be exactly 6 digits').max(6, 'Must be exactly 6 digits'),
  password: yup.string().required('error-password-required').min(4, 'Must be exactly 4 digits').max(4, 'Must be exactly 4 digits'),
});

export default function OtpRegisterForm({
  onSubmit,
  loading,
}: OtpRegisterFormProps) {
  
  const { closeModal } = useModalAction();

  const handleOtpChange = (onChange: any) => (value: any) => {
    // Remove any non-numeric characters from the input value
    const numericValue = value.replace(/\D/g, '');
  
    // Call the original onChange function with the updated value
    onChange(numericValue);
  };

  return (
    <div className="space-y-5 rounded border border-gray-200 p-5">
      <Form<OtpRegisterFormValues>
        onSubmit={onSubmit}
        validationSchema={otpLoginFormSchemaForNewUser}
      >
        {({ register, control, formState: { errors } }) => (
          <>
            {/* <Input
              label={STATIC_CONTENT['text-email']}
              {...register('email')}
              type="email"
              variant="outline"
              className="mb-5"
              error={errors.email?.message!}
            />
            <Input
              label={STATIC_CONTENT['text-name']}
              {...register('name')}
              variant="outline"
              className="mb-5"
              error={errors.name?.message!}
            /> */}

            <PasswordInput
              label={STATIC_CONTENT['text-password']}
              {...register('password')}
              error={errors.password?.message!}
              variant="outline"
              className="mb-5"
              maxLength={4}
              onInput={(e) => maxLengthFun(e, 4)} 
            />

            <div className="mb-5">
              <Label>{STATIC_CONTENT['text-otp-code']}</Label>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <MobileOtpInput

                    value={value} 
                    onChange={handleOtpChange(onChange)}
                    numInputs={6}
                    separator={
                      <span className="hidden sm:inline-block">-</span>
                    }
                    containerStyle="flex items-center justify-between -mx-2"
                    inputStyle="flex items-center justify-center !w-full mx-2 sm:!w-9 !px-0 appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base rounded focus:border-accent h-12"
                    disabledStyle="!bg-gray-100"
                  />
                )}
                name="code"
                defaultValue=""
              />
              {errors.code && <p className="text-red-600 pt-2 text-xs">OTP Code is required</p>}
            </div>

            <div className="grid grid-cols-2 gap-5">
              <Button
                variant="outline"
                className="hover:border-red-500 hover:text-white hover:bg-red-500"
                onClick={closeModal}
              >
                {STATIC_CONTENT['text-cancel']}
              </Button>

              <Button loading={loading} disabled={loading}>
                {STATIC_CONTENT['text-verify-code']}
              </Button>
            </div>
          </>
        )}
      </Form>
    </div>
  );
}
