// import cn from 'classnames';
// import { avatarPlaceholder } from '@/lib/placeholders';
// import { useTranslation } from 'next-i18next';
// import { Image } from '@/components/ui/image';
// import Link from '@/components/ui/link';
// import { ROUTES } from '@/lib/routes';
// import { formatAddress } from '@/lib/format-address';
// import { isEmpty } from 'lodash';
// import React from 'react';
// import { MapPin } from '@/components/icons/map-pin';
// import { getIcon } from '@/lib/get-icon';
// import * as socialIcons from '@/components/icons/social';
// import JewelleryCategoriesMenu from '../ui/jewellery-category-menu';

// interface TestmonialCardProps {
//   item: any;
//   className?: string;
// }

// const  TestmonialCard: React.FC<any> = ({ item, className }) => {
//   const { t } = useTranslation();
//   return (
//     <Link href={`${item?.type?.slug}/search/?category=${item?.description?.friendlyUrl}`}>
//     <div className='px-12 pb-24'>
//     <div className='text-center py-8'> 
//     <h2 className='text-4xl font-bold uppercase text-yellow-600'>Our Reviews</h2>
//     <p className='text-lg'>We value your feedback, Tell us how did we do,</p>
//     </div>

//     <div className='grid md:grid-cols-3 sm:grid-cols-2 gap-6  '> 
//       <div className='shadow-400 rounded-xl px-4 lg:py-6 py-4'>
//         <div className='flex'>
//           <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYcwc-vZE3ffRDEsJlbZgjE6NlhDEqedx_5w&usqp=CAU" className='lg:w-20 lg:h-20 w-18 h-18 mr-4 rounded-[50%]' alt="user logo" />
//           <div className=' items-center justify-center flex flex-col'>
//             <strong className='block lg:text-lg'>Jane Cooper</strong>
//             <p className='lg:text-lg text-xs'> ⭐⭐⭐⭐⭐</p>
//           </div>
//         </div>
//         <div>
//            <p className='py-3 lg:text-base text-sm'>"No matter where you go, It's is the coolest, most happening thing around! Not able to tell you how happy I am with it."</p>
//            <p className='text-accent font-semibold mt-1 lg:text-base text-sm'> <span className='text-black'>
//               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 inline">
//                 <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
//               </svg>  Share | Reviewed on:</span> Dual Toned Gold Bracelet
//             </p>
//         </div>
//       </div>

//       <div className='shadow-400 rounded-xl px-4 lg:py-6 py-4'>
//         <div className='flex'>
//           <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYcwc-vZE3ffRDEsJlbZgjE6NlhDEqedx_5w&usqp=CAU" className='lg:w-20 lg:h-20 w-18 h-18 mr-4 rounded-[50%]' alt="user logo" />
//           <div className='items-center justify-center flex flex-col'>
//           <strong className='block lg:text-lg'>Jane Cooper</strong>
//             <p className='lg:text-lg text-xs'> ⭐⭐⭐⭐⭐</p>
//           </div>
//         </div>
//         <div>
//            <p className='py-3 lg:text-base text-sm'>"No matter where you go, It's is the coolest, most happening thing around! Not able to tell you how happy I am with it."</p>
//            <p className='text-accent font-semibold mt-1 lg:text-base text-sm'> <span className='text-black'>
//               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 inline">
//                 <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
//               </svg>  Share | Reviewed on:</span> Dual Toned Gold Bracelet
//             </p>
//         </div>
//       </div>

//       <div className='shadow-400 rounded-xl px-4 lg:py-6 py-4'>
//         <div className='flex'>
//           <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYcwc-vZE3ffRDEsJlbZgjE6NlhDEqedx_5w&usqp=CAU" className='lg:w-20 lg:h-20 w-18 h-18 mr-4 rounded-[50%]' alt="user logo" />
//           <div className='items-center justify-center flex flex-col'>
//           <strong className='block lg:text-lg'>Jane Cooper</strong>
//             <p className='lg:text-lg text-xs'> ⭐⭐⭐⭐⭐</p>
//           </div>
//         </div>
//         <div>
//            <p className='py-3 lg:text-base text-sm'>"No matter where you go, It's is the coolest, most happening thing around! Not able to tell you how happy I am with it."</p>
//            <p className='text-accent font-semibold mt-1 lg:text-base text-sm'> <span className='text-black'>
//               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 inline">
//                 <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
//               </svg>  Share | Reviewed on:</span> Dual Toned Gold Bracelet
//             </p>
//         </div>
//       </div>

//     </div>
//   </div>
//     </Link>
//   );
// };

// export default  TestmonialCard;
