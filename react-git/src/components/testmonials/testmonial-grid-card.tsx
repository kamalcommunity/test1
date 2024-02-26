import Link from '@/components/ui/link';
import { TestmonialDescription } from '@/types';
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
    slidesPerView: 3,
  },

  1600: {
    slidesPerView: 4,
  },
  2600: {
    slidesPerView: 4,
  },
};

interface TestmonialGridCardProps {
  notFound: boolean;
  loading: boolean;
  items: TestmonialDescription[];
  className?: string;
  variables: any;
}

const TestmonialGridCard: React.FC<TestmonialGridCardProps> = ({
  notFound,
  items,
  loading,
  variables,
}) => {
  return (
    <>
      {!notFound ? (
        <Carousel items={items} breakpoints={breakpoints} spaceBetween={25}>
          {({ name, description, imageUrl }: any) => 
            <>
              <Link href={''}>
                <div className='pt-12 mx-[.8rem]'> 
                  <div className="rounded-xl px-4 pt-4 shadow-400">
                    <div className='relative'>
                      {imageUrl === "null" ?
                        <p className="w-[4.5rem] h-[4.5rem] mr-4 rounded-[50%] lg:h-20 lg:w-20 bg-gray-100 -top-[3.7rem] left-[50%] translate-x-[-50%] border-4 absolute flex justify-center items-center text-4xl">{name.toUpperCase().slice(0, 1)}</p> :
                        <img
                          src={imageUrl}
                          className="w-[4.5rem] h-[4.5rem] -top-[3.7rem] left-[50%] translate-x-[-50%] border-4 absolute rounded-[50%] lg:h-20 lg:w-20 object-contain"
                          alt="user logo"
                        />
                      }
                    </div>
                    <div className='flex flex-col items-center
                     justify-center pt-10 pb-4'>
                      <strong className="block lg:text-xl">{name}</strong>
                      <p className="py-3 text-base lg:text-lg">
                        {
                          description
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </>} 
        </Carousel>
      ) : (
        <> </>
      )}
    </>
  );
};

export default TestmonialGridCard;
