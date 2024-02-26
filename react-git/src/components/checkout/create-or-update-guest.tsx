import { STATIC_CONTENT } from '@/lib/constants/static-content';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { AddressForm } from '@/components/address/address-form';
import { AddressType } from '@/framework/utils/constants';
import { useTranslation } from 'next-i18next';
import { useAtom } from 'jotai';
import { toast } from 'react-toastify';
import { verifiedResponseAtom } from '@/store/checkout';

//FIXME: should be in types file
type FormValues = {
  title: string;
  type: AddressType;
  firstname: string;
  lastname: string;
  address: {
    country: any;
    countryValue: any;
    city: any;
    state: any;
    stateValue: any;
    zip: string;
    street_address: string;
    phone: number;
  };
};

const CreateOrUpdateGuestAddressForm = () => {
  const [billingAddress, setVerifiedResponse] = useAtom(verifiedResponseAtom);
  

  const {
    data: { atom, address, type },
  } = useModalState();

  const { closeModal } = useModalAction();

  const [_, setAddress] = useAtom(atom);

  function onSubmit(values: FormValues) {

    const formattedInput = {
      title: values.title,
      type: values.type,
      firstname: values.firstname,
      lastname: values.lastname,
      address: {
        country: values.address?.country?.label,
        countryData: values.address?.country,
        stateData: values.address?.state,
        countryValue: values.address?.countryValue,
        stateValue: values.address?.stateValue,
        state: values.address?.state?.label,
        city: values.address?.city,
        zip: values.address?.zip,
        street_address: values.address?.street_address,
        phone: values.address?.phone,
      },
      billing: {
        address: values.address.street_address,
        billingAddress: true,
        bilstateOther: '',
        city: values.address.city,
        company: '',
        country: values.address?.country?.label,
        countryCode: values.address?.country?.value,
        firstName: values.firstname,
        lastName: values.lastname,
        latitude: '',
        longitude: '',
        phone: values.address.phone,
        postalCode: values.address?.zip,
        stateProvince: values.address?.state?.value,
        zone: values.address?.state?.value,
      },
    };

    setAddress(formattedInput);
    setVerifiedResponse(null)
    toast.success(STATIC_CONTENT['profile-update-successful']);

    closeModal();
  }
  return (
    <div className="min-h-screen bg-light p-5 sm:p-8 md:min-h-0 md:rounded-xl">
      <h1 className="mb-4 text-center text-lg font-semibold text-heading sm:mb-6">
        {STATIC_CONTENT['text-add-new']} {STATIC_CONTENT['text-address']}
      </h1>
      <AddressForm
        onSubmit={onSubmit}
        defaultValues={{
          title: address?.title ?? '',
          type: address?.type ?? type,
          firstname: address?.firstname ?? '',
          lastname: address?.lastname ?? '',
          address: {
            ...address?.address,
          },
        }}
      />
    </div>
  );
};

export default CreateOrUpdateGuestAddressForm;
