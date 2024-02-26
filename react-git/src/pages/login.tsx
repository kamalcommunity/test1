import Card from '@/components/ui/cards/card';

import Seo from '@/components/seo/seo';

import DashboardLayout from '@/layouts/_dashboard';

// import MyReports from '@/components/reports/report-view';

import { useModalAction } from '@/components/ui/modal/modal.context';

import { useSettings } from '@/framework/settings';

import { useLogin } from '@/framework/user';

import { LoginUserInput } from '@/types';

import { useTranslation } from 'next-i18next';

import { useRouter } from 'next/router';

import * as yup from 'yup';

import { Form } from '@/components/ui/forms/form';

import Button from '@/components/ui/button';

import Link from 'next/link';

import Alert from '@/components/ui/alert';

import GeneralLayout from '@/components/layouts/_general';

import AuthorizedMenu from '@/components/layouts/menu/authorized-menu';

import { authorizationAtom } from '@/store/authorization-atom';

import { useAtom } from 'jotai';

//[[UI_IMPORT]]
const loginFormSchema = yup.object().shape({
  username: yup.string().required('error-mobilenumber-required').min(10, 'Must be exactly 10 digits').max(10, 'Must be exactly 10 digits'),
  password: yup.string().required('error-password-required').min(4, 'Must be exactly 4 digits').max(4, 'Must be exactly 4 digits'),
  email: yup.string().email('error-email-format').optional(),
});

const LoginPage = () => {
   const [isAuthorize] = useAtom(authorizationAtom);
//[[UI_HOOK]]
  const { t } = useTranslation('common');
  const router = useRouter();
  const { openModal } = useModalAction();
  const isCheckout = router.pathname.includes('checkout');
  const { mutate: login, isLoading, serverError, setServerError } = useLogin();

  // const {
  //   settings: {
  //     allowGuestUser
  //   },
  // } = useSettings();

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
        message={serverError && t(serverError)}
        className="mb-6"
        closeable={true}
        onClose={() => setServerError(null)}
      />
      
 <div className="container px-4 py-2" id="inl5jl">
  <div className="row p-2">
   <div className="col">
    <div id="iq6xnf">
     Sign In
    </div>
   </div>
  </div>
 </div>
 <div className="container px-4 py-2" id="iajxrk">
  <Form<LoginUserInput>
        onSubmit={onSubmit}
        validationSchema={loginFormSchema} id="i80whf">
   {({ register, formState: { errors } }) => (
                <>
                <div className="mb-3" id="ije0hx"><label className="form-label" for="username" id="iji26s">Phone Number</label><input aria-describedby="emailHelp" className="form-control" id="exampleInputEmail1" name="username" placeholder="Phone Number" required="" type="number" {...register('username')}/><div className="form-text" id="emailHelp">We'll never share your email with anyone else.</div></div>
<div className="mb-3" id="iesjh5"><label className="form-label" for="pin" id="iimfhp">Pin</label><input className="form-control" id="exampleInputPassword1" name="password" placeholder="Pin" required="" type="password" {...register('password')}/></div>
<button id="iu071t" type="submit">Login</button>
<div className="col" id="iqo34n"><div action-type="register" button-type="auth" id="i62pee"><button onClick={() => openModal('REGISTER')} className="btn btn-link" id="ilqdi9" type="button">Create Account</button></div><div action-type="reset-pin" button-type="auth" id="itopu8"><button onClick={() => openModal('REGISTER')} className="btn btn-link" id="i2gn9f" type="button">Forgot pin</button></div></div>
                </>
                )}
  </Form>
 </div>




    </>
  );
};
LoginPage.getLayout = function getLayout(page: React.ReactElement){
  return (
    <GeneralLayout layout='' >
      {page}
    </GeneralLayout>
  );
};
export default LoginPage;

     
