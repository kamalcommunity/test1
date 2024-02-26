import { STATIC_CONTENT } from '@/lib/constants/static-content';
import ProfileAddressGrid from '@/components/profile/profile-address';
import Card from '@/components/ui/cards/card';
import { useTranslation } from 'next-i18next';
import ProfileForm from '@/components/profile/profile-form';
import ProfileContact from '@/components/profile/profile-contact';
import Seo from '@/components/seo/seo';
import { useUser } from '@/framework/user';
import DashboardLayout from '@/layouts/_dashboard';
import dynamic from 'next/dynamic';
import { billingAddressAtom } from '@/store/checkout';
import { AddressType } from '@/framework/utils/constants';
// export { getStaticProps } from '@/framework/general.ssr';

const AddressGrid = dynamic(
  () => import('@/components/checkout/address-grid'),
  { ssr: false }
);
const ProfilePage = () => {
  
  const { me } = useUser();
  const { id, address, profile }:any = me ?? {};

  if (!me) return null;
  return (
    <>
      <Seo noindex={true} nofollow={true} />
      <div className="w-full overflow-hidden px-1 pb-1">
        {/* <div className="mb-8">
          <ProfileForm user={me} />
          <ProfileContact
            userId={me.id}
            profileId={me.profile?.id}
            contact={me.profile?.contact}
            user={me}
          />
        </div> */}

        {/* <Card className="w-full"> */}
          {/* <ProfileAddressGrid
            userId={me.id}
            //@ts-ignore
            addresses={me.address}
            label={STATIC_CONTENT['text-addresses']}
          /> */}
          <AddressGrid
              userId={id!}
              className="p-5 bg-white shadow-700 md:p-8"
              label={STATIC_CONTENT['text-addresses']}
              // count={1}
              // @ts-ignore
              addresses={address?.filter(
                (item:any) => item?.type === AddressType.Billing
              )}
              atom={billingAddressAtom}
              type={AddressType.Billing}
            />
        {/* </Card> */}
      </div>
    </>
  );
};

ProfilePage.authenticationRequired = true;

ProfilePage.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
export default ProfilePage;
