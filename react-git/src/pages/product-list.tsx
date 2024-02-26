import { useTranslation } from 'next-i18next';
import { DEFAULT_STORE_CODE } from '@/framework/utils/constants';
import client from '@/framework/client';
import Link from 'next/link';
import GeneralLayout from '@/components/layouts/_general';
import AuthorizedMenu from '@/components/layouts/menu/authorized-menu';
import { authorizationAtom } from '@/store/authorization-atom';
import { useAtom } from 'jotai';
import { formatAllProducts } from '@/lib/format-api-data';
import { Product } from '@/types';
//[[UI_IMPORT]]
export const getServerSideProps: any = async () => {
  try {
    const womenProductReqData: any = {
      store: DEFAULT_STORE_CODE,
      count: 20,

    };
    const womenProductResponse: any = await client.products.all(womenProductReqData);
    const womenProducts = womenProductResponse.products && formatAllProducts(womenProductResponse.products);

    //[[API_DATA]]

    return {
      props: {
        womenProducts: womenProducts ?? [],
        //[[API_DATA_PROP]]

      },
    };
  } catch (error) {
    console.log(error);
    return {}
  }
}

const productListPage = ({
  womenProducts,
  //[[UI_VARIABLE]]


}: any) => {
  const [isAuthorize] = useAtom(authorizationAtom);
  //[[UI_HOOK]]
  return (
    <>

      <div className="container" collection-name="women" collection-type="product" count="20" data-gjs-type="product-collection" id="ifddvl" manufacturer-name="apple">
        <div className="row" data-gjs-type="product-gird">
          {womenProducts.map((product: any, key: any) => {
            return (
              <>
                <div className="col-lg-3 col-md-4 col-sm-6 col-12 py-3" data-gjs-type="product-card"><Link href={`/products/${product?.productDescription?.friendlyUrl}`}><div className="shadow pb-2 shopiana-bg-white"><div><img className="w-100 object-fit-cover shopiana-product-image-height" src={product.image?.imageUrl} /></div><div><p className="text-truncate px-3">{product.description.name}</p></div><div className="text-secondary"><p className="text-truncate px-3">{product.description.description}</p></div><div className="d-flex justify-content-cente"><p className="text-truncate px-3">{product.price}</p></div></div></Link></div>
              </>
            );
          })}
        </div>
      </div>


    </>
  );
};
productListPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <GeneralLayout layout='' >
      {page}
    </GeneralLayout>
  );
};
export default productListPage;
