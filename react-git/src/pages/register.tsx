import RegisterForm from "@/components/auth/register-form";


const RegisterPage: any = ({ product }: any) => {

    return (
        <div className="flex p-8 gap-4 mr-8 ml-8">
                <RegisterForm />
        </div>
    );
};
// ProductPage.getLayout = getLayout;
export default RegisterPage;

