import { STATIC_CONTENT } from '@/lib/constants/static-content';
import Button from '@/components/ui/button';
import Input from '@/components/ui/forms/input';
import TextArea from '@/components/ui/forms/text-area';
import { useTranslation } from 'next-i18next';
import * as yup from 'yup';
import { useModalState } from '@/components/ui/modal/modal.context';
import { Form } from '@/components/ui/forms/form';
import { AddressType } from '@/framework/utils/constants';
import { useCountries, useUpdateAuthUserAddress } from '@/framework/user';
import Select from 'react-select';
import { useEffect, useState } from 'react';
import { customerContactAtom } from '@/store/checkout';
import { useAtom } from 'jotai';
import { Country } from '@/types';
import { Controller } from 'react-hook-form';
import PhoneInput from '../ui/forms/phone-input';
import { maxLengthFun } from '@/framework/utils/helper';
import classNames from 'classnames';

type FormValues = {
  title: string;
  firstname: string;
  lastname: string;
  type: AddressType;
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

const addressSchema = yup.object().shape({
  type: yup.string().oneOf([AddressType.Billing, AddressType.Shipping]),
  // .required('error-type-required'),
  title: yup.string(),
  firstname: yup.string().required('error-firstname-required'),
  lastname: yup.string().required('error-lastname-required'),
  address: yup.object().shape({
    country: yup.object().optional(),
    countryValue: yup.string().required('error-country-required'),
    stateValue: yup.string().required('error-state-required'),
    city: yup.string().required('error-city-required'),
    state: yup.object().optional(),
    zip: yup
      .string() 
      .required('error-zip-required') 
      .min(6, 'Must be exactly 6 digits')
      .max(6, 'Must be exactly 6 digits'),
    street_address: yup.string().required('error-street-required'), 
    phone: yup.string().required('error-must-number').matches(/^[0-9]+$/, "Must be only digits")
    .min(10, 'Must be exactly 10 digits')
    .max(10, 'Must be exactly 10 digits'),
  }),
});

export const AddressForm: React.FC<any> = ({
  onSubmit,
  defaultValues,
  isLoading,
}) => {
  const { countries, isLoading: isLoadingCountries, error } = useCountries();

  const [selectedCountriesData, setselectedCountriesData] = useState<any>();

  const [selectedStateData, setselectedStateData] = useState<any>();

  const [stateData, setStateData] = useState([]);

  

  const {
    data: { address },
  } = useModalState();

  useEffect(() => {
    if (defaultValues?.address?.countryData) {
      setselectedCountriesData(defaultValues?.address?.countryData);
      setselectedStateData(defaultValues?.address?.stateData);
      setStateData(defaultValues?.address?.countryData?.zones);
    }
  }, [defaultValues]);

  const customSelectStyles = {
    menu: (provided: any, state: any) => ({
      ...provided,
      width: state.selectProps.width,
      borderBottom: '1px dotted pink',
      color: state.selectProps.menuColor,
    }),
  };

  const submit = (values: FormValues) => {
    let newValues = {
      ...values,
      address: {
        ...address,
        city: values?.address?.city,
        phone: values.address.phone,
        street_address: values?.address?.street_address,
        zip: values.address.zip,
        countryValue: selectedCountriesData?.value,
        stateValue: selectedStateData?.value,
        country: selectedCountriesData,
        state: selectedStateData,
      },
    };

    onSubmit(newValues);
  };
  return (
    <Form<FormValues>
      onSubmit={submit}
      className="grid h-full grid-cols-2 gap-5"
      //@ts-ignore
      validationSchema={addressSchema}
      useFormProps={{
        shouldUnregister: true,
        defaultValues,
      }}
      resetValues={defaultValues}
    >
      {({ register, setValue, getValues,control, formState: { errors } }) => (
        <>
          <Input
            label={STATIC_CONTENT['firstname-text']}
            {...register('firstname')}
            error={errors.firstname?.message!}
            variant="outline"
            className=""
          />
          <Input
            label={STATIC_CONTENT['lastname-text']}
            {...register('lastname')}
            error={errors.lastname?.message!}
            variant="outline"
            className=""
          />
          <div className="hidden">
            <Input
              label={STATIC_CONTENT['lastname-text']}
              {...register('address.countryValue')}
              // error={errors.address?.countryValue.message!}
              variant="outline"
              className=""
            />
          </div>
          <div className="hidden">
            <Input
              label={STATIC_CONTENT['lastname-text']}
              {...register('address.stateValue')}
              // error={errors.address?.stateValue.message!}
              variant="outline"
              className=""
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="mb-3 block text-sm font-semibold leading-none text-accent">
              {STATIC_CONTENT['text-country']}
            </label>
            <Select
              styles={customSelectStyles}
              width="140px"
              isSearchable={false}
              options={countries}
              value={selectedCountriesData || ''}
              classNames={{
                option: ({ isDisabled, isFocused, isSelected }) =>{
                return classNames(
                  isSelected  && '!bg-accent',
                  !isSelected && isFocused && 'hover:!bg-accent-hover',
                  !isSelected && isFocused && 'hover:!text-light-hover',
                )}
              }}
              // defaultValue={
              //   defaultValues?.address?.countryData
              //     ? {
              //         label: defaultValues?.address?.countryData?.label,
              //         value: defaultValues?.address?.countryData?.label,
              //       }
              //     : null
              // }
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
            <label className="mb-3 block text-sm font-semibold leading-none text-accent">
              {STATIC_CONTENT['text-state']}
            </label>
            <Select
              className=""
              styles={customSelectStyles}
              isSearchable={false}
              width="130px"
              options={stateData}
              value={selectedStateData}
              name="address.state"
              classNames={{
                option: ({ isDisabled, isFocused, isSelected }) =>{
                return classNames(
                  isSelected && '!bg-accent',
                  !isSelected && isFocused && 'hover:!bg-accent-hover',
                  !isSelected && isFocused && 'hover:!text-light-hover',
                )}
              }}
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
            label={STATIC_CONTENT['text-city']}
            {...register('address.city')}
            error={errors.address?.city?.message!}
            variant="outline"
          />

          <Input
            label={STATIC_CONTENT['text-zip']}
            {...register('address.zip')}
            error={errors.address?.zip?.message!}
            variant="outline"
            maxLength={6}
            type="number"
            onInput={(e) => maxLengthFun(e, 6)} 
          />

          <div className="col-span-2">
            <Input
              label={STATIC_CONTENT['text-phone']}
              {...register('address.phone')}
              error={errors.address?.phone?.message!}
              variant="outline"
              maxLength={10} 
              type="number"
              onInput={(e) => maxLengthFun(e, 10)} 
            />
          </div>

          {/* <div className="col-span-2">
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
          </div> */}

        
          <TextArea
            label={STATIC_CONTENT['text-street-address']}
            {...register('address.street_address')}
            error={errors.address?.street_address?.message!}
            variant="outline"
            className="col-span-2"
          />

          <Button
            className="col-span-2 w-full"
            loading={isLoading}
            disabled={isLoading}
          >
            {Boolean(defaultValues) ? STATIC_CONTENT['text-update'] : STATIC_CONTENT['text-save']}{' '}
            {STATIC_CONTENT['text-address']}
          </Button>
        </>
      )}
    </Form>
  );
};

export default function CreateOrUpdateAddressForm() {
  

  const {
    data: {  address },
  } = useModalState();

  const { mutate: updateAuthUserAddress } = useUpdateAuthUserAddress();

  const [contactNumber] = useAtom(customerContactAtom);

  const { countries, isLoading: isLoadingCountries, error } = useCountries();

  const [authUserAddress, setauthUserAddress] = useState<any>();

  useEffect(() => {
    const configuredAddress = configuredAddressMap(countries, address);
    setauthUserAddress(configuredAddress);
  }, [countries.length > 0]); // FIX ME...........................

  function onSubmit({
    title,
    firstname,
    lastname,
    type,
    address: { city, country, phone, state, street_address, zip },
  }: FormValues) {
    updateAuthUserAddress({
      billing: {
        address: street_address,
        billingAddress: true,
        bilstateOther: '',
        city: city,
        company: '',
        country: country.value,
        countryCode: country.value,
        firstName: firstname,
        lastName: lastname,
        latitude: '',
        longitude: '',
        phone: phone,
        postalCode: zip,
        stateProvince: state.value,
        zone: state.value,
      },
      delivery: {
        address: street_address,
        billingAddress: true,
        bilstateOther: '',
        city: city,
        company: '',
        country: country.value,
        countryCode: country.value,
        firstName: firstname,
        lastName: lastname,
        latitude: '',
        longitude: '',
        phone: phone,
        postalCode: zip,
        stateProvince: state.value,
        zone: state.value,
      },
    });
  }

  return (
    <div className="min-h-screen bg-light p-5 sm:p-8 md:min-h-0 md:rounded-xl">
      <h1 className="mb-4 text-center text-lg font-semibold text-heading sm:mb-6">
        {address ? STATIC_CONTENT['text-update'] : STATIC_CONTENT['text-add-new']} {STATIC_CONTENT['text-address']}
      </h1>
      {!isLoadingCountries && authUserAddress ? (
        <AddressForm onSubmit={onSubmit} defaultValues={authUserAddress} />
      ) : (
        'loading'
      )}
    </div>
  );
}

const configuredAddressMap = (
  countries: any[],
  address: {
    billing: { countryCode: any; zone: any };
    title: any;
    firstname: any;
    lastname: any;
    type: any;
    address: { city: any; zip: any; street_address: any; phone: any };
  }
) => {
  let selectedState;
  // fillter selected country
  let selectedCountry: any = countries.find((country) => {
    return country?.value === address?.billing?.countryCode;
  });
  // fillter selected State
  selectedState = selectedCountry?.zones?.find((zone) => {
    return zone.value === address?.billing?.zone;
  });

  let configuredAddress = {
    title: address?.title ?? '',
    firstname: address?.firstname ?? '',
    lastname: address?.lastname ?? '',
    type: address && address?.type && address?.type,
    address: {
      ...address?.address,
      country: selectedCountry?.label,
      countryData: selectedCountry,
      countryValue: selectedCountry?.value,
      stateValue: selectedState?.value,
      stateData: selectedState,
      city: address?.address?.city,
      zip: address?.address?.zip,
      street_address: address?.address?.street_address,
      phone: address?.address?.phone,
    },
  };

  return configuredAddress;
};
