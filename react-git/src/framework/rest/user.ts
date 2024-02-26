import { useModalAction } from '@/components/ui/modal/modal.context';
import { useTranslation } from 'next-i18next';
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import { toast } from 'react-toastify';
import client from './client';
import { authorizationAtom } from '@/store/authorization-atom';
import { useAtom } from 'jotai';
import { useToken } from '@/lib/hooks/use-token';
import { API_ENDPOINTS } from './client/api-endpoints';
import { useState } from 'react';
import {
  RegisterUserInput,
  ChangePasswordUserInput,
  OtpLoginInputType,
  User,
  Address,
  Country,
  Zone,
  ProfileChangePasswordUserInput,
} from '@/types';
import { initialOtpState, optAtom } from '@/components/otp/atom';
import { useStateMachine } from 'little-state-machine';
import {
  initialState,
  updateFormState,
} from '@/components/auth/forgot-password';
import { clearCheckoutAtom, verifiedResponseAtom } from '@/store/checkout';
import { AddressType } from './utils/constants';

import { getCart } from '../../store/quick-cart/cart.utils';
import { useCart } from '@/store/quick-cart/cart.context';
import { removeLocalData } from '../../framework/rest/client/helper';
import { useRouter } from 'next/router';
import { STATIC_CONTENT } from '@/lib/constants/static-content';



export function useUser() {
  const [isAuthorized] = useAtom(authorizationAtom);
  const { data, isLoading, error } = useQuery<User, Error>(
    [API_ENDPOINTS.USERS_ME],
    () => getUser(),
    // client.users.me,
    {
      enabled: isAuthorized,
      onError: (err) => {
        console.log(err);
      },
    }
  );
  //TODO: do some improvement here
  return { me: data, isLoading, error, isAuthorized };
}

export const useDeleteAddress = () => {
  const { closeModal } = useModalAction();
  const queryClient = useQueryClient();
  return useMutation(client.users.deleteAddress, {
    onSuccess: (data) => {
      if (data) {
        toast.success('successfully-address-deleted');
        closeModal();
        return;
      }
    },
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};

      toast.error(data?.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries('/me');
    },
  });
};

export const useUpdateUser = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { closeModal } = useModalAction();
  return useMutation(client.users.update, {
    onSuccess: (data) => {
      // debugger
      if (data?.id) {
        toast.success(STATIC_CONTENT['profile-update-successful']);
        closeModal();
      }
    },

    onError: (error) => {
      toast.error(STATIC_CONTENT['error-something-wrong']);
      // console.log(error);

    },
    onSettled: () => {
      queryClient.invalidateQueries('/me');
    },
  });
};

export const useUpdateAuthUserAddress = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [_, setVerifiedResponse] = useAtom(verifiedResponseAtom);

  const { closeModal } = useModalAction();
  return useMutation(client.users.authUserAddressUpdate, {
    onSuccess: (data) => {
      // if (data?.id) {
      setVerifiedResponse(null);
      toast.success(STATIC_CONTENT['profile-update-successful']);
      closeModal();
      // }
    },
    onError: (error) => {
      toast.error(STATIC_CONTENT['error-something-wrong']);
    },
    onSettled: () => {
      queryClient.invalidateQueries('/me');
    },
  });
};

export const useContact = () => {


  return useMutation(client.users.contactUs, {
    onSuccess: (data) => {
      toast.success(t(data.message));
    },
    onError: (err) => {
      console.log(err);
    },
  });
};

export function useLogin() {

  const [_, setAuthorized] = useAtom(authorizationAtom);
  const { closeModal } = useModalAction();
  const { setToken } = useToken();
  let [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const { mutate, isLoading } = useMutation(client.users.login, {
    onSuccess: (data) => {
      if (!data.token) {
        toast.error(STATIC_CONTENT['error-credential-wrong']);
        setServerError('error-credential-wrong');
        return;
      }
      toast.success('Successfully Login.');
      setToken(data.token);
      setAuthorized(true);
      router.push('/');

      // getCart();
      // updateCart();
      // closeModal();
    },
    onError: (error: Error) => {
      toast.error(STATIC_CONTENT['error-credential-wrong']);
      setServerError('error-credential-wrong');
      console.log(error.message);
    },
  });

  return { mutate, isLoading, serverError, setServerError };
}

export function useSocialLogin() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { setToken } = useToken();
  const [_, setAuthorized] = useAtom(authorizationAtom);

  return useMutation(client.users.socialLogin, {
    onSuccess: (data) => {
      if (data?.token && data?.permissions?.length) {
        setToken(data?.token);
        setAuthorized(true);
        return;
      }
      if (!data.token) {
        toast.error(STATIC_CONTENT['error-credential-wrong']);
      }
    },
    onSettled: () => {
      queryClient.clear();
    },
  });
}

export function useSendOtpCode() {
  let [serverError, setServerError] = useState<string | null>(null);
  const [otpState, setOtpState] = useAtom(optAtom);

  const { mutate, isLoading } = useMutation(client.users.sendOtpCode, {
    onSuccess: (data, variables) => {
      if (data.success == 'error') {
        setServerError(data.message!);
        return;
      }
      setOtpState({
        ...otpState,
        otpId: data?.id!,
        isContactExist: data?.is_contact_exist!,
        phoneNumber: variables?.userName!,
        step: data?.is_contact_exist! ? 'OtpForm' : 'RegisterForm',
      });
      toast.success('Successfully otp generated');
    },
    onError: (error: Error) => {
      console.log(error.message);
    },
  });

  return { mutate, isLoading, serverError, setServerError };
}

export function useVerifyOtpCode({
  onVerifySuccess,
}: {
  onVerifySuccess: Function;
}) {
  const [otpState, setOtpState] = useAtom(optAtom);
  let [serverError, setServerError] = useState<string | null>(null);
  const { mutate, isLoading } = useMutation(client.users.verifyOtpCode, {
    onSuccess: (data, variables) => {
      // if (!data.success) {
      //   setServerError(data?.message!);
      //   return;
      // }
      if (onVerifySuccess) {
        onVerifySuccess({
          phone_number: otpState.phoneNumber,
          password: variables?.password!,
        });
      }
      setOtpState({
        ...initialOtpState,
      });
    },
    onError: (error: Error) => {
      toast.error("Please enter a valid otp");
    },
  });

  return { mutate, isLoading, serverError, setServerError };
}

export function useOtpLogin() {
  const [otpState, setOtpState] = useAtom(optAtom);
  const router = useRouter();
  const [_, setAuthorized] = useAtom(authorizationAtom);
  const { closeModal } = useModalAction();
  const { setToken } = useToken();
  const queryClient = new QueryClient();
  let [serverError, setServerError] = useState<string | null>(null);

  const { mutate: otpLogin, isLoading } = useMutation(client.users.OtpLogin, {

    onSuccess: (data) => {
      if (!data.token) {
        setServerError('text-otp-verify-failed');
        return;
      }
      setToken(data.token!);
      setAuthorized(true);
      setOtpState({
        ...initialOtpState,
      });
      router.replace("/");
      closeModal();
    },
    onError: (error: Error) => {
      console.log(error.message);
    },
    onSettled: () => {
      queryClient.clear();
    },
  });

  function handleSubmit(input: OtpLoginInputType) {
    otpLogin({
      ...input,
      phone_number: otpState.phoneNumber,
      otp_id: otpState.otpId!,
    });
  }

  return { mutate: handleSubmit, isLoading, serverError, setServerError };
}

export function useRegister() {

  const { setToken } = useToken();
  const [_, setAuthorized] = useAtom(authorizationAtom);
  const { closeModal } = useModalAction();
  let [formError, setFormError] = useState<Partial<RegisterUserInput> | null>(
    null
  );

  const { mutate, isLoading } = useMutation(client.users.register, {
    onSuccess: (data) => {
      // if (data?.token && data?.permissions?.length) {
      if (data?.token) {
        setToken(data?.token);
        setAuthorized(true);
        closeModal();
        return;
      }
      if (!data.token) {
        toast.error(STATIC_CONTENT['error-credential-wrong']);
      }
    },
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};

      setFormError(data);
    },
  });

  return { mutate, isLoading, formError, setFormError };
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { setToken } = useToken();
  const [_, setAuthorized] = useAtom(authorizationAtom);
  const [_r, resetCheckout] = useAtom(clearCheckoutAtom);
  const { resetCart } = useCart();
  const router = useRouter();

  return useMutation(client.users.logout, {
    onSuccess: (data) => {
      if (data) {
        setToken('');
        setAuthorized(false);
        resetCheckout();
        resetCart();
        removeLocalData('cartId');
        removeLocalData('isCartSync');
        router.push('/');
      }
    },
    onSettled: () => {
      queryClient.clear();
    },
  });
}

export function useChangePassword() {

  let [formError, setFormError] =
    useState<Partial<ChangePasswordUserInput> | null>(null);

  const { mutate, isLoading } = useMutation(client.users.changePassword, {
    onSuccess: (data) => {
      if (!data.success) {
        setFormError({
          oldPassword: data?.message ?? '',
        });
        return;
      }
      toast.success(STATIC_CONTENT['password-successful']);
    },
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};
      setFormError(data);
    },
  });

  return { mutate, isLoading, formError, setFormError };
}

export function useProfileChangePassword() {

  let [formError, setFormError] =
    useState<Partial<ProfileChangePasswordUserInput> | null>(null);

  const { mutate, isLoading } = useMutation(
    client.users.profileChangePassword,
    {
      onSuccess: (data) => {
        if (!data.success) {
          toast.success('Password succesfully changed.');
          setFormError({
            current: data?.message ?? '',
          });
          return;
        }
      },
      onError: (error) => {
        const {
          response: { data },
        }: any = error ?? {};
        setFormError(data);
      },
    }
  );

  return { mutate, isLoading, formError, setFormError };
}

export function useForgotPassword() {
  const { actions } = useStateMachine({ updateFormState });
  let [message, setMessage] = useState<string | null>(null);
  let [formError, setFormError] = useState<any>(null);
  const { t } = useTranslation();

  const { mutate, isLoading } = useMutation(client.users.forgotPassword, {
    onSuccess: (data, variables) => {
      if (!data.success) {
        setFormError({
          email: data?.message ?? '',
        });
        return;
      }
      setMessage(data?.message!);
      actions.updateFormState({
        email: variables.email,
        step: 'Token',
      });
    },
  });

  return { mutate, isLoading, message, formError, setFormError, setMessage };
}

export function useResetPassword() {
  const queryClient = useQueryClient();
  const { closeModal } = useModalAction();
  const { actions, state } = useStateMachine({ updateFormState });
  const { mutate: login, isLoading: loginISLoading, serverError, setServerError } = useLogin();

  const { mutate, isLoading } = useMutation(
    client.users.profileChangePassword,
    {
      onSuccess: (data) => {
        if (data) {
          toast.success('Successfully Update Password!');
          closeModal();
          login({
            username: state.phoneNumber,
            password: state.password,
          }); 
          actions.updateFormState({
            ...initialState,
          });

          return;
        }
      },
      onError: () => {
        toast.error("Password Update failed")
        // return;
      },
      onSettled: () => {
        queryClient.clear();
      },
    }
  );
  return { mutate, isLoading };
}

export function useVerifyForgotPasswordToken() {
  const { actions } = useStateMachine({ updateFormState });
  const queryClient = useQueryClient();
  let [formError, setFormError] = useState<any>(null);

  const { mutate, isLoading } = useMutation(client.users.verifyOtpCode, {
    onSuccess: (data, variables) => {
      if (!data) {
        setFormError({
          token: '',
        });
        return;
      }
      actions.updateFormState({
        step: 'Password',
        token: variables.code as string,
      });
    },
    onSettled: () => {
      queryClient.clear();
    },
    onError: (error: Error) => {
      toast.error("Please enter a valid otp");
    },
  });

  return { mutate, isLoading, formError, setFormError };
}

export function useUserExists(phone_number: number) {
  const userExists = client.users.exists({ userName: phone_number });
  return userExists;
}

const getUser = async () => {
  const user = await client.users.me();
  let addressArray: Address[] = user.billing
    ? [
      {
        id: user.id,
        title: user?.billing?.address,
        firstname: user?.billing?.firstName,
        lastname: user?.billing?.lastName,
        type: AddressType.Billing,
        address: {
          __typename: AddressType.Billing,
          country: user?.billing?.country,
          city: user?.billing?.city,
          state: user?.billing?.stateProvince,
          zip: user?.billing?.postalCode,
          phone: +user?.billing?.phone,
          street_address: user?.billing?.address,
        },
        billing: user?.billing ?? '',
      },
    ]
    : ([] as any);

  return {
    ...user,
    id: user.id,
    name: user?.firstName,
    email: user?.emailAddress,
    profile: {
      id: user.id,
      contact: user?.billing?.phone,
      bio: user?.firstName,
      avatar: {},
    },
    address: addressArray,
    userName: user?.userName,
  };
};

export function useCountries() {
  const { data, isLoading, error } = useQuery<any[], Error>(
    [API_ENDPOINTS.COUNTRY],
    () => getCountryData()
  );
  return {
    countries: data ?? [],
    isLoading,
    error,
  };
}
export function useStates(countryCode: string) {
  const { data, isLoading, error } = useQuery<any[], Error>(
    [API_ENDPOINTS.ZONES],
    () => getStateData(countryCode)
  );
  return {
    states: data ?? [],
    isLoading,
    error,
  };
}

const getStateData = async (countryCode: string) => {
  const data = await client.states.get(countryCode);
  let d = data.map((item) => {
    return {
      value: item,
      label: item.name,
    };
  });
  return d;
};

const getCountryData = async () => {
  const data = await client.country.get();
  let d = data.map((item) => {
    let zones = item.zones.map((zoneData) => {
      return {
        value: zoneData.code,
        label: zoneData.name,
      };
    });
    return {
      value: item.code,
      label: item.name,
      zones,
    };
  });
  return d;
};

const updateAuthUser = async () => {
  const response = await client.users.update;
  return response;
};
