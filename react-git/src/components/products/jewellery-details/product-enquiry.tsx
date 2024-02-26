import { STATIC_CONTENT } from '@/lib/constants/static-content';
import React, { useState } from 'react';
import * as yup from 'yup';
import {
  AddressType,
  INQUIRY_ORDER_TYPE,
  INQUIRY_STATUS,
} from '@/framework/utils/constants';
import { useCountries } from '@/framework/user';
import { useTranslation } from 'next-i18next';
import { Form } from '@/components/ui/forms/form';
import Input from '@/components/ui/forms/input';
import Button from '@/components/ui/button';
import { useInquiry } from '@/framework/order';
import { useModalState } from '@/components/ui/modal/modal.context';
import { CustomerBilling, Inquiry } from '@/types';
import Select from 'react-select';
import TextArea from '@/components/ui/forms/text-area';
import PhoneInput from '@/components/ui/forms/phone-input';
import { Controller } from 'react-hook-form';
import { maxLengthFun } from '@/framework/utils/helper';

type FormValues = {
  title: string;
  name: string;
  type: AddressType;
  address: {
    country: any;
    countryValue: any;
    state: any;
    stateValue: any;
    email: any;
    subject: string;
    message: string;
    phone: number;
  };
};

const enquiryaddressSchema = yup.object().shape({
  type: yup.string().oneOf([AddressType.Billing, AddressType.Shipping]),
  // .required('error-type-required'),
  title: yup.string(),
  name: yup.string().required('enquiry-name'),
  address: yup.object().shape({
    country: yup.object().optional(),
    countryValue: yup.string().required('error-country-required'),
    stateValue: yup.string().required('error-state-required'),
    phone: yup.number().required('error-phone-number'),
    email: yup.string().required('enquiry-email').email(),
    subject: yup.string().required('enquiry-subject'),
    message: yup.string().required('enquiry-message'),
  }),
});

const ProductEnquiry: React.FC<any> = () => {
  // const [isAuthorize] = useAtom(authorizationAtom);
  const [selectedCountriesData, setselectedCountriesData] = useState<any>();
  const { countries, isLoading: isLoadingCountries, error } = useCountries();
  const [stateData, setStateData] = useState([]);
  const [selectedStateData, setselectedStateData] = useState<any>();

  
  const {
    mutate: addInquiry,
    isLoading,
    serverError,
    setServerError,
  } = useInquiry();

  const {
    data: { data, variations },
  } = useModalState();
  // console.log(data);

  const submit = ({
    name,
    address: { country, countryValue, email, message, phone, subject, state, stateValue },
    title,
    type,
  }: FormValues) => {
    const default_view = true;
    const productId = data?.id ?? 0;
    const productQuantity = 0;
    const customerId = 0;

    let inqueryData: Inquiry = formatInqueryData(
      subject,
      name,
      title,
      productQuantity,
      default_view,
      customerId,
      productId,
      phone,
      message,
      state,
      stateValue,
      country,
      countryValue
    );
    // debugger
    if (productId > 0) {
      addInquiry(inqueryData);
    }
  };

  return (
    <div className="min-h-screen bg-light p-5 sm:p-8 md:min-h-0 md:rounded-xl">
      <Form<FormValues>
        onSubmit={submit}
        className="grid h-full grid-cols-2 gap-5"
        // className="grid h-full"
        //@ts-ignore
        validationSchema={enquiryaddressSchema}
        useFormProps={{
          shouldUnregister: true,
        }}
      >
        {({ register, setValue, control, formState: { errors } }) => (
          <>
            <h1 className="mb-2 text-center text-lg font-semibold text-heading sm:mb-6 col-span-2">
              {STATIC_CONTENT['product-inquiry']}
            </h1>

            <Input
              type="text"
              label={STATIC_CONTENT['name-text']}
              {...register('name')}
              error={errors.name?.message!}
              variant="outline"
            />
            {/* <Input
              type="number"
              label={STATIC_CONTENT['text-phone']}
              {...register('address.phone')}
              error={errors.address?.phone?.message!}
              variant="outline"
              maxLength={10} 
              onInput={(e) => maxLengthFun(e, 10)}  
            />  */}
            <div>
              <label htmlFor="phoneInput" className='block mb-3 text-sm font-semibold leading-none text-body-dark'>Enter Number</label>
              <Controller
                name="address.phone"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    id="phoneInput"
                    country="in"
                    {...register('address.phone')}
                    inputClass="!p-0 ltr:!pr-4 rtl:!pl-4 ltr:!pl-14 rtl:!pr-14 !flex !items-center !w-full !appearance-none !transition !duration-300 !ease-in-out !text-heading !text-sm focus:!outline-none focus:!ring-0 !border !border-border-base !rounded focus:!border-accent !h-12"
                    dropdownClass="focus:!ring-0 !border !border-border-base !shadow-350"
                    {...field}
                  />
                )}
              />
              {errors.address?.phone?.message && (
                <p className="mt-2 text-xs text-red-500 ltr:text-left rtl:text-right">
                  {errors.address?.phone?.message}
                </p>
              )}
            </div>
            <Input
              type="email"
              id='email'
              label={STATIC_CONTENT['text-email']}
              {...register('address.email')}
              error={errors.address?.email?.message!}
              variant="outline"
            />
            <div className="flex flex-col gap-2">
              <label className="mb-3 block text-sm font-semibold leading-none text-body-dark">
                {STATIC_CONTENT['text-country']}
              </label>
              <Select
                width="140px"
                isSearchable={false}
                options={countries}
                name="address.country"
                onChange={(item: any) => {
                  setValue('address.state', '', {
                    shouldValidate: false,
                  });
                  setValue('address.stateValue', '', {
                    shouldValidate: false,
                  });
                  setValue('address.country', item, {
                    shouldValidate: true,
                  });
                  setValue('address.countryValue', item.value, {
                    shouldValidate: true,
                  });
                  setselectedStateData({
                    label: '',
                    value: '',
                  });
                  setStateData([...item?.zones]);
                  setselectedCountriesData(item);
                }}
              ></Select>
              <p className="text-xs text-red-500">
                {errors.address?.countryValue?.message!}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="mb-3 block text-sm font-semibold leading-none text-body-dark">
                {STATIC_CONTENT['text-state']}
              </label>
              <Select
                className=""
                // styles={customSelectStyles}
                isSearchable={false}
                width="140px"
                options={stateData}
                value={selectedStateData}
                name="address.state"
                onChange={(item: any) => {
                  setValue('address.state', item, {
                    shouldValidate: true,
                  });

                  setValue('address.stateValue', item.value, {
                    shouldValidate: true,
                  });
                  setselectedStateData(item);
                }}
              />
              <p className="text-xs text-red-500">
                {errors.address?.stateValue?.message!}
              </p>
            </div>
            <Input
              type="text"
              placeholder="Product Inquiry"
              label={STATIC_CONTENT['text-subject']}
              {...register('address.subject')}
              error={errors.address?.subject?.message!}
              variant="outline"
            />
            <TextArea
              label={STATIC_CONTENT['text-message']}
              {...register('address.message')}
              error={errors.address?.message?.message!}
              variant="outline"
              className='col-span-2'
            />
            <Button
              className="rounded-md bg-accent px-4 py-2 text-white col-span-2 w-full"
              disabled={false}
            // onClick={handleAddClick}
            >
              {STATIC_CONTENT['send-product-inquiry']}
            </Button>
          </>
        )}
      </Form>
    </div>
  );
};

export default ProductEnquiry;

function formatInqueryData(
  subject: string,
  name: string,
  title: string,
  productQuantity: number,
  default_view: boolean,
  customerId: number,
  productId: number,
  phone: number,
  description: string,
  state: any,
  stateValue: string,
  country: any,
  countryValue: string
) {
  let billingData: CustomerBilling = {
    postalCode: '',
    countryCode: countryValue,
    firstName: name,
    lastName: name,
    bilstateOther: '',
    company: '',
    phone: '',
    address: '',
    city: '',
    stateProvince: state?.value,
    billingAddress: false,
    latitude: '',
    longitude: '',
    zone: stateValue,
    country: country?.lable,
  };

  let inqueryData: Inquiry = {
    billing: billingData,
    cartCode: '',
    inquiryStatus: INQUIRY_STATUS,
    ipAddress: '',
    orderType: INQUIRY_ORDER_TYPE,
    quantity: productQuantity,
    view: default_view,
    description,
    customerId,
    productId,
  };
  return inqueryData;
}

