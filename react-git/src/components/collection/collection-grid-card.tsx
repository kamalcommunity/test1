import dynamic from 'next/dynamic';
import Link from '@/components/ui/link';
import { productPlaceholder } from '@/lib/placeholders';
import { Catalog, Category, Configuration } from '@/types';
import Carousel from '../ui/carousel';

const breakpoints = {
  320: {
    slidesPerView: 1,
  },

  600: {
    slidesPerView: 2,
  },

  960: {
    slidesPerView: 3,
  },

  1280: {
    slidesPerView: 4,
  },

  1600: {
    slidesPerView: 4,
  },
  2600: {
    slidesPerView: 4,
  },
};

interface CollectionGridCardProps {
  notFound: boolean;
  loading: boolean;
  items: Category[];
  className?: string;
  variables: any;
}

const CollectionGridCard: React.FC<CollectionGridCardProps> = ({
  notFound,
  items,
  loading,
  variables,
}) => {
  // debugger
  // if (loading) {
  //   return (
  //     <div className="hidden xl:block">
  //       <div className="w-full h-52 flex justify-center mt-8 px-2">
  //         <BakeryCategoryLoader />
  //       </div>
  //     </div>
  //   );
  // }

  const renderCard = (category: Category) => {
    const { href, img_src, description, parse_Configuration } = category;
    switch (parse_Configuration?.cardType) {
      case 'longBigger':
        return (<Link href={href}>
          <div className="bg-light border rounded-lg">
            <div className='w-full bg-gray-100 flex flex-col'>
              <img className='h-[70vh] rounded-tl-md rounded-tr-md' src={img_src} />
              <div className='h-16 flex flex-row justify-between rounded-bl-md rounded-br-md'>
                <p className='text-base font-bold truncate px-4 py-4'>{description}</p>
                <p className='text-xs truncate px-8 py-4 mt-1 '> Explore</p>
              </div>
            </div>
          </div>
        </Link>)
        // case 'longNormal':
        //   return (<Link href={href}>
        //     <div className="bg-light border rounded-lg">
        //       <div className='w-full bg-gray-100 flex flex-col'>
        //         <img className='h-[50vh] rounded-tl-md rounded-tr-md' src={img_src} />
        //         <div className='h-16 flex flex-row justify-between rounded-bl-md rounded-br-md'>
        //           <p className='text-base font-bold truncate px-4 py-4'>{description}</p>
        //           <p className='text-xs truncate px-8 py-4 mt-1 '> Explore</p>
        //         </div>
        //       </div>
        //     </div> 
        //   </Link>)
          // case 'longSmall':
          //   return (<Link href={href}>
          //     <div className="bg-light justify-center items-center flex rounded-lg">
          //       <div className='w-50 h-70 sm:w-44 sm:h-56 bg-gray-100 flex flex-col'>
          //         <img className='h-40 rounded-tl-md rounded-tr-md' src={img_src} />
          //         <div className='h-16 flex flex-col justify-center text-center rounded-bl-md rounded-br-md'>
          //           <p className='text-base font-bold truncate px-4'>{description}</p>
          //           <p className='text-xs truncate px-4'> Explore</p>
          //         </div>
          //       </div>
          //     </div>
          //   </Link>)
      // case 'squareSmall':
      //   return (
      //     <>
      //       <div className="bg-light justify-center items-center flex">
      //         <div className='w-60 h-68 sm:w-60 sm:h-68 bg-gray-100 flex-col flex'>
      //           <img className='h-40 rounded-tl-md rounded-tr-md' src={img_src} />
      //           <div className='h-16 flex flex-col justify-center text-center rounded-bl-md rounded-br-md'>
      //             <p className='text-base font-bold truncate px-4'>{description}</p>
      //             <p className='text-xs truncate px-4'> Explore</p>
      //           </div>
      //         </div>
      //       </div>
      //     </>
      //   )
        // case 'squareNormal':
        // return (
        //   <>
        //  <div className="bg-light border rounded-lg">
        //     <div className='w-full bg-gray-100 flex flex-col'>
        //       <img className='h-[35vh] rounded-tl-md rounded-tr-md' src={img_src} />
        //       <div className='h-16 flex flex-row justify-between rounded-bl-md rounded-br-md'>
        //         <p className='text-base font-bold truncate px-4 py-4'>{description}</p>
        //         <p className='text-xs truncate px-8 py-4 mt-1 '> Explore</p>
        //       </div>
        //      </div>
        //   </div>
        //   </>
        // )
        // case 'squareBigger':
        //   return (
        //     <>
        //    <div className="bg-light border rounded-lg">
        //       <div className='w-full h-full bg-gray-100 flex flex-col'>
        //         <img className='h-[50vh] w-full rounded-tl-md rounded-tr-md' src={img_src} />
        //         <div className='h-16 flex flex-row justify-between rounded-bl-md rounded-br-md'>
        //           <p className='text-base font-bold truncate px-4 py-4'>{description}</p>
        //           <p className='text-xs truncate px-8 py-4 mt-1 '> Explore</p>
        //         </div>
        //        </div>
        //     </div>
        //     </>
        //   )
      default:
        return (<Link href={href}>
          <div className="bg-light border rounded-lg">
            <div className='w-full bg-gray-100 flex flex-col'>  
              {img_src.src ? <p className='h-[50vh] flex items-center justify-center text-6xl font-thin'>{category.description.slice(0, 1)}</p> : <img src={img_src} className='h-[50vh] rounded-tl-md rounded-tr-md object-contain'/>} 
              <div className='h-16 flex flex-row justify-between rounded-bl-md rounded-br-md'>
                <p className='text-base font-bold truncate px-4 py-4'>{description}</p>
                <p className='text-xs truncate px-8 py-4 mt-1 '> Explore</p>
              </div>
            </div>
          </div>
        </Link>)
    }

  }

  return (
    <>
      {!notFound ? (
        <Carousel
          items={items}
          breakpoints={breakpoints}
          spaceBetween={15}
        >

          {(item: any) => renderCard(item)}

        </Carousel>
        // items.map((item:any) => renderCard(item))
      ) : (
        <div className="min-h-full">
          {/* <NotFound text="text-no-category" className="h-96" /> */}
        </div>
      )}

    </>
  );
};

export default CollectionGridCard;
