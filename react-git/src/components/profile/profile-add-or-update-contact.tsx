import { STATIC_CONTENT } from '@/lib/constants/static-content';
import { useTranslation } from 'next-i18next';
import { useModalState } from '@/components/ui/modal/modal.context';
import OtpForm from '@/components/otp/otp-form';
import { useUpdateUser } from '@/framework/user';
import { User } from '@/types';

const ProfileAddOrUpdateContact = () => {
  
  const {
    data: { customerId, contact, profileId },
  } = useModalState();
  const { mutate: updateProfile } = useUpdateUser();

  function onContactUpdate({ phone_number , user }: { phone_number: string , user: User }) {
    if (!customerId) {
      return false;
    }
    updateProfile({
      id: customerId,
      billing: {
        ...user?.billing,
        phone: phone_number
      }
    });
  }

  return (
    <div className="flex flex-col justify-center min-h-screen p-5 bg-light sm:p-8 md:min-h-0 md:rounded-xl">
      <h1 className="mb-5 text-sm font-semibold text-center text-heading sm:mb-6">
        {contact ? STATIC_CONTENT['text-update'] : STATIC_CONTENT['text-add-new']}{' '}
        {STATIC_CONTENT['text-contact-number']}
      </h1>
      <OtpForm phoneNumber={contact} onVerifySuccess={onContactUpdate} />
    </div>
  );
};

export default ProfileAddOrUpdateContact;
