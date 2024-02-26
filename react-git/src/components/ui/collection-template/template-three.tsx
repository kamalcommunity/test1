import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import Link from '@/components/ui/link';

type Props = {
  //   className?: string;
  //   suggestions: any;
  //   visible: boolean;
  //   notFound: boolean;
  //   showLoaders: boolean;
  //   seeMore: boolean;
  //   seeMoreLink: (e: any) => void;
};

const TemplateThree: React.FC<Props> = ({

}) => {
  //   
  //   const router = useRouter();

  //   const handleClick = (path: string) => {
  //     router.push(path);
  //   };

  return (
    <>
      <div className='w-full pt-12'>
        <div>
          <div className='flex sm:flex-row flex-col sm:h-[28rem]'>
            <div className='sm:w-1/2 w-full flex justify-center items-center md:px-0 sm:px-8 overflow-hidden'>
              <img src="https://images.pexels.com/photos/13661822/pexels-photo-13661822.jpeg?auto=compress&cs=tinysrgb&w=600" className='sm:h-full h-[70vh] sm:w-auto w-full' alt="..." />           
               </div>
            <div className='sm:w-1/2 flex justify-center sm:items-start items-center flex-col'>
              <h3 className='text-[32px] font-bold sm:block hidden'>LEHENGA</h3>
              <p className='text-lg text-[#636363] sm:block hidden '>Lehenga patterns are embroidered</p>
              <Link href='jewellery/search?category=lehenga-5500-12000'>
                <button type='button' className='inline-block px-2 py-3 border-2 border-gray-800 text-black font-medium text-sm leading-tight uppercase rounded focus:outline-none focus:ring-0 transition duration-150 ease-in-out mt-8 hover:bg-accent hover:text-white'>SHOP ALL LEHENGAS</button>
              </Link>
            </div>
          </div>

          <div className='flex sm:flex-row flex-col sm:h-[28rem] sm:pt-0 pt-10'>
            <div className='sm:w-1/2  flex justify-center items-center flex-col sm:order-1 order-2'>
              <div className='w-auto'>
                <h3 className='font-bold text-[32px] sm:block hidden'>SHERWANI</h3>
                <p className='text-lg text-[#636363] sm:block hidden'>Jodhpuri designs are the best</p>
                <Link href='jewellery/search?category=sherwani-2022'>
                  <button type='button' className='inline-block px-2 py-3 border-2 border-gray-800 text-black font-medium text-sm leading-tight uppercase rounded focus:outline-none focus:ring-0 transition duration-150 ease-in-out mt-8 hover:bg-accent hover:text-white'>SHOP ALL SHERWANI</button>
                </Link>
              </div>
            </div>
            <div className='sm:w-1/2 flex justify-center items-center md:px-0 sm:px-8 sm:order-2 order-1'>
              <img src="https://images.pexels.com/photos/12730009/pexels-photo-12730009.jpeg?auto=compress&cs=tinysrgb&w=600" className='sm:h-full h-[70vh] sm:w-auto w-full' alt="..." />
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default TemplateThree;
