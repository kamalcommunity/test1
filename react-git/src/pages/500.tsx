import React from 'react';
import Link from '@/components/ui/link';
import { ROUTES } from '@/lib/routes';
import { useTranslation } from 'next-i18next';


const ServerErrorPage = () => {
  
  
  return (
    <div className='flex justify-center items-center h-screen w-screen flex-col'>
      <strong className='text-4xl'>500 | Internal Server Error</strong>
      <p className='text-accent text-center my-4'>Sorry, there were some technical issues while processing your request.</p>
      <Link
          href={ROUTES.HOME}
          className="bg-accent text-white py-2 px-3 rounded-lg hover:bg-accent-hover"
        >Take me home</Link>
    </div>
  );
};

export default ServerErrorPage;
