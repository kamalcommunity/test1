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

const TemplateOne: React.FC<Props> = ({

}) => {
  //   
  //   const router = useRouter();

  //   const handleClick = (path: string) => {
  //     router.push(path);
  //   };

  return (<>
 {/* SHOP BY COLLECTION  */}
 <div className='w-full'>
      <h2 className='font-bold text-center text-accent md:text-4xl text-3xl leading-10'>SHOP BY COLLECTIONS</h2>
      <div className='h-auto w-auto lg:flex flex-row mt-8'>
        <div className='lg:w-[33%] sm:w-1/2 w-full p-1 pb-0 inline-block lg:flex items-end relative'>
          <img className='min-h-[78vh] max-h-[78.1vh] w-full rounded-lg' src='https://images.pexels.com/photos/2106685/pexels-photo-2106685.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' />
          {/* translate-x-[-50%] translate-y-[-50%] left-[50%] right-[50%] */}
          <div className='absolute bottom-0 w-full'>
            <div className='flex justify-center items-center'>
              <div className='bg-[#B98B6A] w-1/3 h-36 pt-4'>
                <h4 className='text-white text-2xl ml-4'>Bridal </h4>
                <span className='text-white block ml-4 mb-5'>Collection</span>
                <Link href='jewellery/search?category=bridal-collection-202122'>
                  <button className='bg-white w-[120%] relative right-[10%] cursor-pointer hover:bg-accent  hover:text-white'>SHOP NOW</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className='lg:w-[33%] sm:w-1/2 w-full p-1 inline-block lg:flex pb-0 relative' >
          <img className='lg:min-h-[90vh] lg:max-h-[90.1vh] min-h-[78vh] max-h-[78.1vh] w-full rounded-lg lg:mb-7' src='https://images.pexels.com/photos/13031902/pexels-photo-13031902.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' />
          <div className='absolute bottom-0 w-full lg:mb-7'>
            <div className='flex justify-center items-center'>
              <div className='bg-[#9B5136] w-1/3 h-36 pt-4'>
                <h4 className='text-white text-2xl ml-4'>Bridal </h4>
                <span className='text-white block ml-4 mb-5'>Collection</span>
                <Link href='jewellery/search?category=bridal-collection-202122'>
                  <button className='bg-white w-[120%] relative right-[10%] cursor-pointer hover:bg-accent  hover:text-white'>SHOP NOW</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className='lg:w-[33%] sm:w-1/2 w-full mx-auto p-1 pb-0 flex items-end relative'>
          <img className='min-h-[78vh] max-h-[78.1vh] w-full rounded-lg' src='https://images.pexels.com/photos/13779730/pexels-photo-13779730.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' />
          <div className='absolute bottom-0 w-full'>
            <div className='flex justify-center items-center'>
              <div className='bg-[#B11B36] w-1/3 h-36 pt-4'>
                <h4 className='text-white text-2xl ml-4'>Bridal </h4>
                <span className='text-white block ml-4 mb-5'>Collection</span>
                <Link href='jewellery/search?category=bridal-collection-202122'>
                  <button className='bg-white w-[120%] relative right-[10%] cursor-pointer hover:bg-accent  hover:text-white'>SHOP NOW</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

     {/* BEST BRANDS  */}
     <div className='w-full mt-16'>
      <div className='relative h-96'>
        <img src="https://images.unsplash.com/photo-1601482985114-e509737ba2ed?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80" className='w-full h-full object-cover absolute top-0' alt="Our best brands" />
        <div className='w-full flex justify-center items-center h-full'>
          <div className='xl:w-[60%] lg:w-[50%] md:w-[40%] sm:w-[30%] sm:block hidden'></div>
          <div className='relative xl:w-[40%] lg:w-[50%] md:w-[60%] sm:w-[70%] h-[90%] flex justify-center items-center sm:m-0 m-8'>
            <div className='bg-white rounded-2xl 2xl:py-12 2xl:px-20 md:py-10 md:px-16 py-7 px-12'>
              <div>
                <h1 className='text-[orangered] sm:text-2xl text-xl font-bold'>BEST BRANDS </h1>
                <p className='text-sm'>PREMIUM SHOES TO ENHANCE WALKING </p>
              </div>
              <div>
                <span className='block sm:mt-10 mt-4'>FLAT </span>
                <strong className='text-[orangered] block text-2xl font-light'>50% off</strong>
              </div>

              <div>
                <Link href='jewellery/search?category=3-piece-suit-handmade'>
                  <button className='border-2 sm:px-8 sm:py-2 px-4 py-2 rounded-md border-black sm:mt-10 mt-4 text-sm cursor-pointer hover:bg-accent  hover:text-white'>GET THEM NOW!</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>);
};

export default TemplateOne;