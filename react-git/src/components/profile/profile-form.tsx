import { STATIC_CONTENT } from '@/lib/constants/static-content';
import Button from '@/components/ui/button';
import Card from '@/components/ui/cards/card';
import FileInput from '@/components/ui/forms/file-input';
import Input from '@/components/ui/forms/input';
import TextArea from '@/components/ui/forms/text-area';
import { useTranslation } from 'next-i18next';
import pick from 'lodash/pick';
import { Form } from '@/components/ui/forms/form';
import { useUpdateUser } from '@/framework/user';
import type { UpdateUserInput, User } from '@/types';

const ProfileForm = ({ user }: { user: User }) => {
  
  const { mutate: updateProfile, isLoading } = useUpdateUser();

  function onSubmit(values: UpdateUserInput) {
    if (!user) {
      return false;
    }
    let firstName = values?.name?.substring(0, values?.name?.indexOf(' '));
    let lastName = values?.name?.substring(values?.name?.indexOf(' ') + 1);
    updateProfile({
      id: user.id,
      // name: values.name,
      firstName,
      lastName,
      // profile: {
      //   id: user?.profile?.id,
      //   bio: values?.profile?.bio ?? '',
      //   //@ts-ignore
      //   avatar: values?.profile?.avatar?.[0],
      // },
    });
  }

  return (
    <Form<UpdateUserInput>
      onSubmit={onSubmit}
      useFormProps={{
        ...(user && {
          defaultValues: {
            name: user.firstName + " " + user.lastName
          },
        }),
      // useFormProps={{
      //   ...(user && {
      //     defaultValues: pick(user, ['name', 'profile.bio', 'profile.avatar']),
      //   }),
      }}
    >
      {({ register, control }) => (
        <>
          <div className="mb-8 flex">
            <Card className="w-full">
              {/* <div className="mb-8">
                <FileInput control={control} name="profile.avatar" />
              </div> */}

              <div className="mb-6 flex flex-row">
                <Input
                  className="flex-1"
                  label={STATIC_CONTENT['text-name']}
                  {...register('name')}
                  variant="outline"
                />
              </div>

              {/* <TextArea
                label={STATIC_CONTENT['text-bio']}
                //@ts-ignore
                {...register('profile.bio')}
                variant="outline"
                className="mb-6"
              /> */}

              <div className="flex">
                <Button
                  className="ltr:ml-auto rtl:mr-auto"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {STATIC_CONTENT['text-save']}
                </Button>
              </div>
            </Card>
          </div>
        </>
      )}
    </Form>
  );
};

export default ProfileForm;
