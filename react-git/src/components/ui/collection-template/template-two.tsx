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

const TemplateTwo: React.FC<Props> = ({

}) => {
  //   
  //   const router = useRouter();

  //   const handleClick = (path: string) => {
  //     router.push(path);
  //   };

  return (
    <>
      <div className='flex flex-row w-full pt-12'>
        <div className='sm:flex w-full'>
          <div className='relative sm:w-6/12 sm:h-[80vh]'>
            <img className='' style={{ width: '100%', height: '100%' }} src='https://images.pexels.com/photos/13661790/pexels-photo-13661790.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' />
            <Link href='jewellery/search?category=designer-lehenga-engagement'>
              <div className='bg-red-800 opacity-60 absolute bottom-0 w-full h-[100px] flex justify-center items-center flex-col'>
                <h2 className='font-bold text-2xl italic uppercase text-white'>BRIDAL DRESSES</h2>
                <p className='italic uppercase text-white'> With over 50% off</p>
              </div>
            </Link>
          </div>
          <div className='sm:w-6/12'>
            <div className='relative w-full sm:h-[50vh]'>
              <img className='' style={{ width: '100%', height: '100%' }} src='https://images.pexels.com/photos/2106463/pexels-photo-2106463.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' />
              <Link href='jewellery/search?category=designer-lehenga-engagement'>
                <div className='bg-red-800 opacity-60 absolute bottom-0 w-full h-[40px] flex justify-center items-center uppercase text-white'>view all</div>
              </Link>
            </div>
            <div className='relative w-full sm:h-[30vh] '>
              <img className='' style={{ width: '100%', height: '100%' }} src='https://images.pexels.com/photos/13779677/pexels-photo-13779677.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' />
              <Link href='jewellery/search?category=designer-lehenga-engagement'>
                <div className='bg-red-800 opacity-60 absolute bottom-0 w-full h-[40px] flex justify-center items-center uppercase text-white'>view all</div>
              </Link>
            </div>
          </div>
        </div>
    </div>
</>
  );
};

export default TemplateTwo;
