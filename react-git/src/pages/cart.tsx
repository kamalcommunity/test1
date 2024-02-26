import { useTranslation } from 'next-i18next';
import { DEFAULT_STORE_CODE } from '@/framework/utils/constants';
import client from '@/framework/client';
import Link from 'next/link';
import GeneralLayout from '@/components/layouts/_general';
import AuthorizedMenu from '@/components/layouts/menu/authorized-menu';
import { authorizationAtom } from '@/store/authorization-atom';
import { useAtom } from 'jotai';
//[[UI_IMPORT]]
export const getServerSideProps: any = async () => {
  try {
    //[[API_DATA]]
    return {
      props: {    
        //[[API_DATA_PROP]]
      },
    };
  } catch (error) {
    console.log(error);
    return {}
  }
}

const cartPage = ({ 
  //[[UI_VARIABLE]]

 }:any)=> {
 const [isAuthorize] = useAtom(authorizationAtom);
//[[UI_HOOK]]
  return (
    <>
    
 <div>
  Main page
 </div>


    </>
  );
};
cartPage.getLayout = function getLayout(page: React.ReactElement){
  return (
    <GeneralLayout layout='' >
      {page}
    </GeneralLayout>
  );
};
export default cartPage;
