import { STATIC_CONTENT } from '@/lib/constants/static-content';
import * as yup from 'yup';
import { Controller, SubmitHandler } from 'react-hook-form';
import type {
  ForgotPasswordUserInput,
  ResetPasswordUserInput,
  VerifyForgotPasswordUserInput,
} from '@/types';
import { Form } from '@/components/ui/forms/form';
import Input from '@/components/ui/forms/input';
import Button from '@/components/ui/button';

import {
  StateMachineProvider,
  createStore,
  useStateMachine,
  GlobalState,
} from 'little-state-machine';
import { useModalAction } from '@/components/ui/modal/modal.context';
import PasswordInput from '@/components/ui/forms/password-input';
import {
  useForgotPassword,
  useVerifyForgotPasswordToken,
  useResetPassword,
  useUserExists,
  useSendOtpCode,
  useVerifyOtpCode,
} from '@/framework/user';
import { useTranslation } from 'next-i18next';
import Logo from '@/components/ui/logo';
import Alert from '../ui/alert';
import { ArrowPrevIcon } from '../icons/arrow-prev';
import { ArrowNextIcon } from '../icons/arrow-next';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import Label from '../ui/forms/label';
import MobileOtpInput from 'react-otp-input';
import { maxLengthFun } from '@/framework/utils/helper';
import { useSettings } from '@/framework/settings';
import { logoPlaceholder } from '@/lib/placeholders';

const phoneNumberFormValidation = yup.object().shape({
  phonenumber: yup.string().required('error-mobilenumber-required').min(10, 'Must be exactly 10 digits').max(10, 'Must be exactly 10 digits'),
});
const tokenFormValidation = yup.object().shape({
  token: yup.string().required('error-password-required')
});
const passwordFormValidation = yup.object().shape({
  password: yup.string().required().min(4, 'Must be exactly 4 digits').max(4, 'Must be exactly 4 digits'),
  passwordConfirmation: yup.string().oneOf([yup.ref('password')], 'error-match-passwords').required(),
});

export const initialState: GlobalState = {
  step: 'PhoneNumber',
  phoneNumber: '',
  password: '',
  token: '',
};
//@ts-ignore
createStore(initialState);

export const updateFormState = (
  state: typeof initialState,
  payload: {
    step: 'PhoneNumber' | 'Token' | 'Password';
    [key: string]: string;
  }
) => {
  return {
    ...state,
    ...payload,
  };
};

function MobileNumberForm({
  phonenumber,
  onSubmit,
  isLoading,
  serverError,
}: {
  phonenumber: string;
  onSubmit: SubmitHandler<Pick<ForgotPasswordUserInput, 'phonenumber'>>;
  isLoading: boolean;
  serverError: any;
}) {

  return (
    <Form<Pick<ForgotPasswordUserInput, 'phonenumber'>>
      onSubmit={onSubmit}
      useFormProps={{
        defaultValues: { phonenumber },
      }}
      validationSchema={phoneNumberFormValidation}
      serverError={serverError && t(serverError)}
      className="text-left"
    >
      {({ register, formState: { errors } }) => (
        <>
          <Input
            label={STATIC_CONTENT['text-mobilenumber']}
            {...register('phonenumber')}
            variant="outline"
            className="mb-5"
            id="InputNumber"
            type="number"
            maxLength={10}
            onInput={(e) => maxLengthFun(e, 10)} 
            error={errors.phonenumber?.message!}
          />
          <Button
            type="submit"
            className="!mt-5 w-full text-sm tracking-[0.2px] lg:!mt-6"
            loading={isLoading}
            disabled={isLoading}
          >
            {STATIC_CONTENT['text-submit-number']}
            <ArrowNextIcon className="w-5" />
          </Button>
        </>
      )}
    </Form>
  );
}

function TokenForm({
  token,
  onSubmit,
  isLoading,
  serverError,
  handlePrevStep,
}: {
  token: string;
  onSubmit: SubmitHandler<Pick<VerifyForgotPasswordUserInput, 'token'>>;
  isLoading: boolean;
  serverError: any;
  handlePrevStep: () => void;
}) {
  const [message, setMessage] = useState('');
  
  const handleOtpChange = (onChange: any) => (value: any) => {
    // Remove any non-numeric characters from the input value
    const numericValue = value.replace(/\D/g, '');
  
    // Call the original onChange function with the updated value
    onChange(numericValue);
  };

  return (
    <Form<Pick<VerifyForgotPasswordUserInput, 'token'>>
      onSubmit={onSubmit}
      useFormProps={{
        defaultValues: { token },
      }}
      validationSchema={tokenFormValidation}
      serverError={serverError}
    >
      {({ register, control, formState: { errors } }) => (
        <>
          <div className="mb-5">
            {/* <Label>{STATIC_CONTENT['text-otp-code']}</Label> */}
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <MobileOtpInput
                  value={value}
                  onChange={handleOtpChange(onChange)}
                  numInputs={6}
                  separator={<span className="hidden sm:inline-block">-</span>}
                  // containerStyle="justify-center space-x-2 sm:space-x-0 rtl:space-x-reverse"
                  containerStyle="flex items-center justify-between -mx-2"
                  // inputStyle="flex items-center justify-center !w-full sm:!w-11 appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base rounded focus:border-accent h-12"
                  inputStyle="flex items-center justify-center !w-full mx-2 sm:!w-9 !px-0 appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base rounded focus:border-accent h-12"
                  disabledStyle="!bg-gray-100"
                />
              )}
              name="token"
              defaultValue=""
            />
            {errors.token && <p className="text-red-600 pt-2 text-xs">OTP Code is required</p>}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Button
              onClick={handlePrevStep}
              className="order-1 w-full text-sm tracking-[0.2px] hover:bg-accent-hover hover:text-light-hover bg-accent"
            >
              <ArrowPrevIcon className="w-5" />
              {STATIC_CONTENT['text-previous-step']}
            </Button>

            <Button
              className="w-full text-sm tracking-[0.2px] sm:order-2"
              loading={isLoading}
              disabled={isLoading}
            >
              {STATIC_CONTENT['text-submit-token']}
              <ArrowNextIcon className="w-5" />
            </Button>
          </div>
        </>
      )}
    </Form>
  );
}

function PasswordForm({
  onSubmit,
  isLoading,
  handlePrevStep,
}: {
  onSubmit: SubmitHandler<Pick<ResetPasswordUserInput, 'password' | 'passwordConfirmation'>>;
  isLoading: boolean;
  handlePrevStep: () => void;
}) {
  

  return (
    <Form<Pick<ResetPasswordUserInput, 'password' | 'passwordConfirmation'>>
      onSubmit={onSubmit}
      useFormProps={{
        defaultValues: { password: '', passwordConfirmation: '' },
      }}
      validationSchema={passwordFormValidation}
    >
      {({ register, formState: { errors } }) => (
        <>
          <PasswordInput
            label={STATIC_CONTENT['text-new-password']}
            {...register('password')}
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
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Button
              onClick={handlePrevStep}
              className="order-1 w-full hover:bg-accent-hover hover:text-light-hover bg-accent text-sm tracking-[0.2px]"
            >
              <ArrowPrevIcon className="w-5" />
              {STATIC_CONTENT['text-previous-step']}
            </Button>
            <Button
              className="w-full text-sm tracking-[0.2px] sm:order-2"
              loading={isLoading}
              disabled={isLoading}
            >
              {STATIC_CONTENT['text-reset-password']}
            </Button>
          </div>
        </>
      )}
    </Form>
  );
}

function RenderFormSteps() {
  const {
    mutate: forgotPassword,
    isLoading,
    message,
    formError,
  } = useForgotPassword();

  const {
    mutate: verifyForgotPasswordToken,
    isLoading: verifying,
    formError: tokenFormError,
  } = useVerifyForgotPasswordToken();

  const { mutate: resetPassword, isLoading: resetting } = useResetPassword();

  // use hook for getting form state and actions
  const { state, actions } = useStateMachine({ updateFormState });

  const {
    mutate: sendOtpCode,
    isLoading: sendOtpCodeLoading,
    serverError,
    setServerError,
  } = useSendOtpCode();

  const genrateOtpHandler: any = async (phonenumber) => {
    
    try {
      if (phonenumber) {
        sendOtpCode({
          phone_number: phonenumber,
          code: phonenumber,
          otp: 0,
          userName:phonenumber,
        })}
    } catch (error) {
      throw new Error('Something went wrong!');

    }
  };

  const phoneNumberFormHandle: SubmitHandler<
    Pick<ForgotPasswordUserInput, 'phonenumber'>
  > = async ({ phonenumber }) => {
    try {
      // let phoneNummber = parseInt(phonenumber.replace('91', ''));
      const userExists = await useUserExists(+phonenumber);
      
      if (userExists) {
        actions.updateFormState({
          phoneNumber: phonenumber,
          step: 'Token',
        });
        await genrateOtpHandler(phonenumber);
      } else {
        toast.error('Register your number');
      }
    } catch (error) {
      toast.error('Somthing went wrong!');
    }

    // forgotPassword({ email });
  };

  const passwordFormHandle: SubmitHandler<
    Pick<ResetPasswordUserInput, 'password' | 'passwordConfirmation'>
  > = ({ password, passwordConfirmation = "" }) => {
    actions.updateFormState({
      password: password,
      step: 'Password',
    });
    
    resetPassword({ current: "", password, otp: +state.token, username: state.phoneNumber, repeatPassword: passwordConfirmation });
  };

  const tokenFormHandle: SubmitHandler<
    Pick<VerifyForgotPasswordUserInput, 'token'>
  > = ({ token }) => {
    verifyForgotPasswordToken({
      userName: '' + state.phoneNumber,
      code: token,
      otp: token,
      password: '',
    });
  };

  function backToPreviousStep(step: GlobalState['step']) {
    actions.updateFormState({
      step,
    });
  }

  // const { state, actions } = useStateMachine({ updateFormState });
  useEffect(() => {
    actions.updateFormState({
      step: 'PhoneNumber',
      phoneNumber: '',
      password: '',
      token: '',
    });
  }, [])


  return (
    <div>
      {state.step === 'PhoneNumber' && (
        <MobileNumberForm
          phonenumber={state.phoneNumber}
          onSubmit={phoneNumberFormHandle}
          isLoading={isLoading}
          serverError={formError}
        />
      )}
      {state.step === 'Token' && (
        <>
          <Alert className="mb-4" message={message} />
          <TokenForm
            token={state.token}
            onSubmit={tokenFormHandle}
            isLoading={verifying}
            serverError={tokenFormError}
            handlePrevStep={() => backToPreviousStep('PhoneNumber')}
          />
        </>
      )}
      {state.step === 'Password' && (
        <>
          <PasswordForm
            onSubmit={passwordFormHandle}
            isLoading={resetting}
            handlePrevStep={() => backToPreviousStep('Token')}
          />
        </>
      )}
    </div>
  );
}

export default function ForgotUserPassword() {
  
  const { closeModal } = useModalAction();
  const { settings: { displayStoreName, logo } } = useSettings();

  return (
    <StateMachineProvider>
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
        <p className="mt-4 mb-7 text-center text-sm leading-relaxed text-body sm:mt-5 sm:mb-10 md:text-base">
          {STATIC_CONTENT['forgot-password-helper']}
        </p>
        <RenderFormSteps />
        <div className="relative mt-9 mb-7 flex flex-col items-center justify-center text-sm text-heading sm:mt-11 sm:mb-8">
          <hr className="w-full" />
          <span className="start-2/4 -ms-4 absolute -top-2.5 bg-light px-2">
            {STATIC_CONTENT['text-or']}
          </span>
        </div>
        <div className="text-center text-sm text-body sm:text-base">
          {STATIC_CONTENT['text-back-to']}{' '}
          <button
            onClick={() => closeModal()}
            className="ms-1 font-semibold text-accent underline transition-colors duration-200 hover:text-accent-hover hover:no-underline focus:text-accent-hover focus:no-underline focus:outline-none"
          >
            {STATIC_CONTENT['text-login']}
          </button>
        </div>
      </div>
    </StateMachineProvider>
  );
}
