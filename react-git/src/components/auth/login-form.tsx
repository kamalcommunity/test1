import { STATIC_CONTENT } from '@/lib/constants/static-content';

import { signIn } from 'next-auth/react';
import Logo from '@/components/ui/logo';
import Alert from '@/components/ui/alert';
import Input from '@/components/ui/forms/input';
import PasswordInput from '@/components/ui/forms/password-input';
import Button from '@/components/ui/button';
import { useTranslation } from 'next-i18next';
import * as yup from 'yup';
import { GoogleIcon } from '@/components/icons/google';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { MobileIcon } from '@/components/icons/mobile-icon';
import { Form } from '@/components/ui/forms/form';
import { useLogin } from '@/framework/user';
import type { LoginUserInput } from '@/types';
import { AnonymousIcon } from '@/components/icons/anonymous-icon';
import { useRouter } from 'next/router';
import { ROUTES } from '@/lib/routes';
import { useSettings } from '@/framework/settings';
import { logoPlaceholder } from '@/lib/placeholders';
import { maxLengthFun } from '@/framework/utils/helper';

const loginFormSchema = yup.object().shape({
  username: yup.string().required('error-mobilenumber-required').min(10, 'Must be exactly 10 digits').max(10, 'Must be exactly 10 digits'),
  password: yup.string().required('error-password-required').min(4, 'Must be exactly 4 digits').max(4, 'Must be exactly 4 digits'),
  email: yup.string().email('error-email-format').optional(),
});

function LoginForm() {
  
  const router = useRouter();
  const { openModal } = useModalAction();
  const isCheckout = router.pathname.includes('checkout');
  const { mutate: login, isLoading, serverError, setServerError } = useLogin();
  
  const {
    settings: {
      allowGuestUser
    },
  } = useSettings();

  function onSubmit({ username, password }: LoginUserInput) {
    login({
      username,
      password,
    });
  }

  return (
    <>
      <Alert
        variant="error"
        message={serverError}
        className="mb-6"
        closeable={true}
        onClose={() => setServerError(null)}
      />
      <Form<LoginUserInput>
        onSubmit={onSubmit}
        validationSchema={loginFormSchema}
      >
        {({ register, formState: { errors } }) => (
          <>
            <Input
              label={STATIC_CONTENT['text-mobilenumber']}
              {...register('username')}
              variant="outline"
              className="mb-5"
              id='InputNumber'
              type="number"
              maxLength={10}
              onInput={(e) => maxLengthFun(e, 10)} 
              error={errors.username?.message!}
            />
            <PasswordInput
              label={STATIC_CONTENT['text-password']}
              {...register('password')}
              error={errors.password?.message!}
              variant="outline"
              className="mb-5"
              maxLength={4}
              type="number"
              onInput={(e) => maxLengthFun(e, 4)} 
              forgotPageRouteOnClick={() => openModal('FORGOT_VIEW')}
            />
            <div className="mt-8">
              <Button
                className="h-11 w-full sm:h-12"
                loading={isLoading}
                disabled={isLoading}
              >
                {STATIC_CONTENT['text-login']}
              </Button>
            </div>
          </>
        )}
      </Form>
      {/* //===============// */}
      <div className="relative mt-8 hidden mb-6 flex flex-col items-center justify-center text-sm text-heading sm:mt-11 sm:mb-8">
        <hr className="w-full" />
        <span className="absolute -top-2.5 bg-light px-2 ltr:left-2/4 ltr:-ml-4 rtl:right-2/4 rtl:-mr-4">
          {STATIC_CONTENT['text-or']}
        </span>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-4">
        <Button
          className="!bg-social-google hidden !text-light hover:!bg-social-google-hover"
          disabled={isLoading}
          onClick={() => {
            signIn('google');
          }}
        >
          <GoogleIcon className="h-4 w-4 ltr:mr-3 rtl:ml-3" />
          {STATIC_CONTENT['text-login-google']}
        </Button>

        <Button
          className="h-11 w-full hidden !bg-gray-500 !text-light hover:!bg-gray-600 sm:h-12"
          disabled={isLoading}
          onClick={() => openModal('OTP_LOGIN')}
        >
          <MobileIcon className="h-5 text-light ltr:mr-2 rtl:ml-2" />
          {STATIC_CONTENT['text-login-mobile']}
        </Button>

        {allowGuestUser && (
          <Button
            className="h-11 w-full bg-accent !text-light hover:bg-accent-hover sm:h-12"
            disabled={isLoading}
            onClick={() => router.push(`${ROUTES.CHECKOUT}/guest`)}
          >
            <AnonymousIcon className="h-6 text-light ltr:mr-2 rtl:ml-2" />
            {STATIC_CONTENT['text-guest-checkout']}
          </Button>
        )}
      </div>
      <div className="relative mt-8 mb-6 flex flex-col items-center justify-center text-sm text-heading sm:mt-11 sm:mb-8">
        <hr className="w-full" />
      </div>
      <div className="text-center text-sm text-body sm:text-base">
        {STATIC_CONTENT['text-no-account']}{' '}
        <button
          onClick={() => openModal('REGISTER')}
          className="font-semibold text-accent underline transition-colors duration-200 hover:text-accent-hover hover:no-underline focus:text-accent-hover focus:no-underline focus:outline-none ltr:ml-1 rtl:mr-1"
        >
          {STATIC_CONTENT['text-register']}
        </button>
      </div>
    </>
  );
}

export default function LoginView() {
  
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
      <p className="mt-4 mb-8 text-center text-sm text-body sm:mt-5 sm:mb-10 md:text-base">
        {STATIC_CONTENT['login-helper']}
      </p>
      <LoginForm />
    </div>
  );
}
