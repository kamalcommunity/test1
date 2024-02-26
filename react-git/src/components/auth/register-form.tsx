import { STATIC_CONTENT } from '@/lib/constants/static-content';
import { useRouter } from 'next/router';
import Logo from '@/components/ui/logo';
// import Input from '@/components/ui/forms/input';
// import PasswordInput from '@/components/ui/forms/password-input';
// import Button from '@/components/ui/button';
import { useTranslation } from 'next-i18next';
import { useModalAction } from '@/components/ui/modal/modal.context';
// import { Form } from '@/components/ui/forms/form';
// import type { RegisterUserInput } from '@/types';
import * as yup from 'yup';
import {
  useRegister,
  // useOtpLogin,
  useSendOtpCode,
  useUserExists,
  useVerifyOtpCode,
} from '@/framework/user';
import { useAtom } from 'jotai';
import { initialOtpState, optAtom } from '@/components/otp/atom';
import Alert from '@/components/ui/alert';
import PhoneNumberForm from '@/components/otp/phone-number-form';
import OtpCodeForm from '@/components/otp/code-verify-form';
import OtpRegisterForm from '@/components/otp/otp-register-form';
import { toast } from 'react-toastify';
import { useSettings } from '@/framework/settings';
import { logoPlaceholder } from '@/lib/placeholders';
import { useEffect } from 'react';

// const registerFormSchema = yup.object().shape({
//   name: yup.string().required('error-name-required'),
//   email: yup
//     .string()
//     .email('error-email-format')
//     .required('error-email-required'),
//   password: yup.string().required('error-password-required').min(4, 'Must be exactly 4 digits').max(4, 'Must be exactly 4 digits'),
// });

function RegisterForm() {
  
  const { openModal ,closeModal } = useModalAction();
  // const { mutate, isLoading, formError } = useRegister();
  const [otpState, setOtpState] = useAtom(optAtom);

  useEffect(() => {
    setOtpState({
      ...initialOtpState,
    });
  }, [])

  // function onSubmit({ name, email, password }: RegisterUserInput) {
  //   mutate({
  //     name,
  //     email,
  //     password,
  //   });
  // }

  const {
    mutate: sendOtpCode,
    isLoading: sendOtpCodeLoading,
    serverError,
    setServerError,
  } = useSendOtpCode();

  const {
    mutate: otpLogin,
    isLoading: otpLoginLoading,
    formError: optLoginError,
  } = useRegister();

  const { mutate: verifyOtpCode, isLoading: otpVerifyLoading } =
    useVerifyOtpCode({ onVerifySuccess });

  async function onSendCodeSubmission({
    phone_number,
  }: {
    phone_number: string;
  }) {
    let phoneNummber = parseInt(phone_number.replace('91', ''));
    const userExists = await useUserExists(phoneNummber);

    if (userExists) {
      setServerError(STATIC_CONTENT['text-already-account-login']);
      toast.error(STATIC_CONTENT['text-already-account-login']);
      closeModal();
      return;
    }

    sendOtpCode({
      code: 'shopiana',
      otp: 0,
      userName: `${phone_number.replace('91', '')}`,
    });
  }

  function onVerifySuccess({ ...params }) {
    otpLogin({
      userName: params.phone_number,
      password: params.password,
    });
  }

  function onOtpLoginSubmission(values: any) {
    verifyOtpCode({
      ...values,
      code: 'shopiana',
      userName: otpState.phoneNumber,
      otp: values.code,
    });
  }

  return (
    <>
      <div className="mt-4">
        {otpState.step === 'PhoneNumber' && (
          <>
            <Alert
              variant="error"
              message={serverError}
              className="mb-4"
              closeable={true}
              onClose={() => setServerError(null)}
            />
            <div className="flex items-center">
              <PhoneNumberForm
                onSubmit={onSendCodeSubmission}
                isLoading={sendOtpCodeLoading}
                view="login"
              />
            </div>
          </>
        )}
        {otpState.step === 'OtpForm' && (
          <OtpCodeForm
            isLoading={otpLoginLoading}
            onSubmit={onOtpLoginSubmission}
          />
        )}
        {otpState.step === 'RegisterForm' && (
          <OtpRegisterForm
            loading={otpLoginLoading}
            onSubmit={onOtpLoginSubmission}
          />
        )}
      </div>
      {/* <Form<RegisterUserInput>
        onSubmit={onSubmit}
        validationSchema={registerFormSchema}
        serverError={formError}
      >
        {({ register, formState: { errors } }) => (
          <>
            <Input
              label={STATIC_CONTENT['text-name']}
              {...register('name')}
              variant="outline"
              className="mb-5"
              error={errors.name?.message!}
            />
            <Input
              label={STATIC_CONTENT['text-email']}
              {...register('email')}
              type="email"
              variant="outline"
              className="mb-5"
              error={errors.email?.message!}
            />
            <PasswordInput
              label={STATIC_CONTENT['text-password']}
              {...register('password')}
              error={errors.password?.message!}
              variant="outline"
              className="mb-5"
            />
            <div className="mt-8">
              <Button
                className="h-12 w-full"
                loading={isLoading}
                disabled={isLoading}
              >
                {STATIC_CONTENT['text-register']}
              </Button>
            </div>
          </>
        )}
      </Form> */}
      {/* End of forgot register form */}

      <div className="relative mt-8 mb-6 flex flex-col items-center justify-center text-sm text-heading sm:mt-11 sm:mb-8">
        <hr className="w-full" />
        <span className="absolute -top-2.5 bg-light px-2 ltr:left-2/4 ltr:-ml-4 rtl:right-2/4 rtl:-mr-4">
          {STATIC_CONTENT['text-or']}
        </span>
      </div>
      <div className="text-center text-sm text-body sm:text-base">
        {STATIC_CONTENT['text-already-account']}{' '}
        <button
          onClick={() => closeModal()}
          className="font-semibold text-accent underline transition-colors duration-200 hover:text-accent-hover hover:no-underline focus:text-accent-hover focus:no-underline focus:outline-none ltr:ml-1 rtl:mr-1"
        >
          {STATIC_CONTENT['text-login']}
        </button>
      </div>
    </>
  );
}
export default function RegisterView() {
  
  const router = useRouter();
  const { closeModal } = useModalAction();
  function handleNavigate(path: string) {
    router.push(`/${path}`);
    closeModal();
  }
  const { settings: { displayStoreName, logo } } = useSettings();

  return (
    <div className="flex h-full min-h-screen w-screen flex-col justify-center bg-light py-6 px-5 sm:p-8 md:h-auto md:min-h-0 md:max-w-[480px] md:rounded-xl">
      <div className="flex justify-center">
        {displayStoreName ?
          <div className='flex items-center lg:w-auto '>
            <Logo className="mx-auto lg:mx-0" />
          </div> :
          <div className="flex items-center justify-center w-60 relative">
            <img src={logo ?? logoPlaceholder} className="min-h-[4rem] max-h-[3rem] min-w-[4rem] max-w-[16rem]" alt="Logo" />
          </div>
        }

      </div>
      <p className="mt-4 mb-7 px-2 text-center text-sm leading-relaxed text-body sm:mt-5 sm:mb-10 sm:px-0 md:text-base">
        {STATIC_CONTENT['registration-helper']}
        {/* <span
          onClick={() => handleNavigate('terms')}
          className="mx-1 cursor-pointer text-accent underline hover:no-underline"
        >
          {STATIC_CONTENT['text-terms']}
        </span>
        &
        <span
          onClick={() => handleNavigate('privacy')}
          className="cursor-pointer text-accent underline hover:no-underline ltr:ml-1 rtl:mr-1"
        >
          {STATIC_CONTENT['text-policy']}
        </span> */}
      </p>
      <RegisterForm />
    </div>
  );
}
