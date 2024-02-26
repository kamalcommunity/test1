import { useHelloBar } from '@/framework/settings';
import React, { useEffect, useState } from 'react';

export default function HelloBar() {
  const { data, isLoading, error } = useHelloBar();
  const [items, setItems] = useState(data?.value || []);

  useEffect(() => {
    if (data?.value) {
      setItems(data.value);
    }
  }, [data]);

  if (isLoading || error) {
    return null;
  }

  const handleCloseClick = (index:any) => {
    const updatedItems = [...items];
    updatedItems[index].helloBarActive = false;
    setItems(updatedItems);
  };

  return (
    <div className='w-full sticky top-0'>
      {items.map((item, index) => (
        item.helloBarActive ? (
          <div key={index}>
            <div
              className='flex justify-center items-center sm:py-2 py-1 text-white relative lg:text-lg sm:text-base text-sm '
              style={{
                backgroundColor: item.backgroundColor || '',
              }}
            >
              <div className='sm:w-full w-[92%] text-center'>
                <p
                  style={{
                    color: item.textColor || 'white',
                    fontFamily: item.fontFamily || 'Open Sans',
                  }}
                >
                  {item.text}
                </p>
              </div>

              <div
                className='sm:absolute right-4 cursor-pointer sm:w-auto w-[8%]'
                onClick={() => handleCloseClick(index)}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                  className='w-6 h-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </div>
            </div>
          </div>
        ) : null
      ))}
    </div>
  );
}
