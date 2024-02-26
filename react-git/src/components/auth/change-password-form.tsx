import { STATIC_CONTENT } from '@/lib/constants/static-content';
import Button from '@/components/ui/button';
import PasswordInput from '@/components/ui/forms/password-input';
import type { ProfileChangePasswordUserInput } from '@/types';
import { useTranslation } from 'next-i18next';
import { Form } from '@/components/ui/forms/form';
import { useProfileChangePassword, useUser } from '@/framework/user';
import * as yup from 'yup';
import { maxLengthFun } from '@/framework/utils/helper';

export const changePasswordSchema = yup.object().shape({
  oldPassword: yup.string().required('error-old-password-required'),
  newPassword: yup.string().required('error-new-password-required'),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'error-match-passwords')
    .required('error-confirm-password'),
});

export default function ChangePasswordForm() {
  
  const {
    mutate: profileChangePassword,
    isLoading: loading,
    formError,
  } = useProfileChangePassword();
  
  const { me } = useUser();
  if (!me) return null;
  
  function onSubmit(values: any) {

    profileChangePassword({
      current:values?.oldPassword,
      otp:0,
      password:values?.newPassword,
      repeatPassword:values?.passwordConfirmation,
      username:me?.userName
    });
  }

  return (
    <Form<ProfileChangePasswordUserInput & { passwordConfirmation: string }>
      onSubmit={onSubmit}
      validationSchema={changePasswordSchema}
      className="flex flex-col"
      serverError={formError}
    >
      {({ register, formState: { errors } }) => (
        <>
          <PasswordInput
            label={STATIC_CONTENT['text-old-password']}
            {...register('oldPassword')}
            error={errors.current?.message!}
            className="mb-5"
            variant="outline"
            maxLength={4}
            onInput={(e) => maxLengthFun(e, 4)} 
            type="number"
            
          />
          <PasswordInput
            label={STATIC_CONTENT['text-new-password']}
            {...register('newPassword')}
            error={errors.password?.message!}
            className="mb-5"
            variant="outline"
            maxLength={4}
            onInput={(e) => maxLengthFun(e, 4)} 
            type="number"
          />
          <PasswordInput
            label={STATIC_CONTENT['text-confirm-password']}
            {...register('passwordConfirmation')}
            error={errors.passwordConfirmation?.message!}
            className="mb-5"
            variant="outline"
            maxLength={4}
            onInput={(e) => maxLengthFun(e, 4)} 
            type="number"
          />
          <Button
            loading={loading}
            disabled={loading}
            className="ltr:ml-auto rtl:mr-auto"
          >
            {STATIC_CONTENT['text-submit']}
          </Button>
        </>
      )}
    </Form>
  );
}
