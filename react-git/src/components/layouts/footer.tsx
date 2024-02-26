import { STATIC_CONTENT } from '@/lib/constants/static-content';
import { useTranslation } from 'next-i18next';
import { siteSettings } from '@/settings/site';
import Link from '@/components/ui/link';
import Logo from '@/components/ui/logo';
import { useSettings } from '@/framework/settings';
import { useEffect, useState } from 'react';
import { getLocalData } from '@/framework/client/helper';
import { PAGES_KEY } from '@/framework/utils/constants';
import { InstagramIcon } from '../icons/social';
import { TwitterIcon } from '../icons/social';
import { YouTubeIcon } from '../icons/social';
import { FacebookIcon } from '../icons/facebook';
import { PinterestIcon } from '../icons/social/pinterest';
import { logoPlaceholder } from '@/lib/placeholders';
import { useNavigation } from '@/framework/navigation';
import {LinkedInIcon} from '../icons/social';
import router from 'next/router';



const Footer= () => {
  
  const {
    settings: {
      storeName,
      storeMailAddress,
      storeContactNumber,
      storeAddress,
      instagram,
      facebook,
      pinterest,
      linkedIn,
      youtube,
      twitter,
      displayStoreName,
      displayBlog,
      logo,
    },
  } = useSettings();
  const [navigation, setNavigation] = useState<Navigation[]>([]);
  let data = getLocalData(PAGES_KEY);

  useEffect(() => {
    if (data) {
      const parseData: Navigation[] = data ? JSON.parse(data) : [];
      setNavigation(parseData);
    }
  }, [data]);

  const { navigation: pages, error: navigationError } = useNavigation();
  return (
    <div className="footer-bg-color flex w-full flex-col border-gray-800  px-5 md:px-10 lg:px-[50px] xl:px-16">
      {/* Top */}

      <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6 pt-16 md:grid-cols-3 lg:pt-24 lg:pb-16 xl:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] xl:gap-8 2xl:grid-cols-5">
        <div className="flex flex-col">
          <div className="mb-[2px] flex h-16 w-60 items-start">
            {/* <Logo className="min-h-[4rem] max-h-[4rem] min-w-[4rem] max-w-[16rem]" /> */}
            {displayStoreName ? (
              <div className="flex items-center lg:w-auto ">
                <Logo className="mx-auto lg:mx-0" />
              </div>
            ) : (
              <div className="relative flex w-60 items-center">
                <img
                  src={logo ?? logoPlaceholder}
                  className="max-h-[4rem] min-h-[4rem] min-w-[4rem] max-w-[16rem]"
                  alt=""
                />
              </div>
            )}
          </div>
          <span className="footer-text-color mb-3 text-sm font-semibold">
            {storeName}
          </span>
          <address className="footer-text-color mb-7 text-sm not-italic">
            {storeAddress}
          </address>
        </div>

        <div className="flex flex-col">
          <h3 className="footer-text-color mt-3 mb-4 font-semibold lg:mb-7">
            {STATIC_CONTENT['text-explore']}
          </h3>
          
          <ul className="space-y-3">
            {pages.map(({ label, href, id, displayedInFooter }) => {

              if(!displayedInFooter) return;

              return <li key={`${href}-${id}`}>
                <Link
                  href={href}
                  className="text-sm footer-text-color transition-colors hover:text-green-600  truncate w-full block"
                >
                  {label}
                </Link>
              </li>
            })}
            {displayBlog && <li>
              <button className="text-sm footer-text-color transition-colors hover:text-green-600" 
                onClick={() => {
                  router.push('/blogs');
                }}
              >BLOGS</button>
            </li>}
          </ul> 

        </div>

        <div className="flex flex-col">
          <h3 className="footer-text-color mt-3 mb-4 font-semibold lg:mb-7">
            {STATIC_CONTENT['text-contact-details']}
          </h3>
          <div className="flex flex-col gap-3">
            <span className="footer-text-color mb-1 text-sm">
              {storeMailAddress}
            </span>
            <span className="footer-text-color text-sm">
              {storeContactNumber}
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <h3 className="footer-text-color mt-3 mb-4 font-semibold lg:mb-7">
            {STATIC_CONTENT['text-social-media']}
          </h3>
          
          <ul className="space-y-3">
            {
              instagram ?     <li key={`${`instagram`}`}>
              <Link
                href={instagram ?? ''}
                className="footer-text-color text-sm transition-colors hover:text-green-600"
              >
                <div className="flex items-center  gap-1">
                  <div className="h-4 w-4">
                    <InstagramIcon />
                  </div>
                  <p>Instagram</p>
                </div>
              </Link>
            </li> : ""
            }
            {
              facebook ?      <li key={`${`facebook`}`}>
              <Link
                href={facebook ?? ''}
                className="footer-text-color text-sm transition-colors hover:text-green-600"
              >
                <div className="flex items-center  gap-1">
                  <div className="h-4 w-4">
                    <FacebookIcon />
                  </div>
                  <p>Facebook</p>
                </div>
              </Link>
            </li> :""
            }
            {
              pinterest ?    <li key={`${`pinterest`}`}>
              <Link
                href={pinterest ?? ''}
                className="footer-text-color text-sm transition-colors hover:text-green-600"
              >
                <div className="flex items-center  gap-1">
                  <div className="h-4 w-4">
                    <PinterestIcon />
                  </div>
                  <p>Pinterest</p>
                </div>
              </Link>
            </li> : ""
            }
            {
              linkedIn ?      <li key={`${`linkdIn`}`}>
              <Link
                href={linkedIn ?? ''}
                className="text-sm footer-text-color transition-colors hover:text-green-600"
              >
                <div className="flex items-center  gap-1">
                  <div className="h-4 w-4">
                    <LinkedInIcon />
                  </div>
                  <p>linkedIn</p>
                </div>
              </Link>
            </li> : ""
            }
            {
              youtube ?   <li key={`${`youtube`}`}>
              <Link
                href={youtube ?? ''}
                className="text-sm footer-text-color transition-colors hover:text-green-600"
              >
                <div className="flex items-center  gap-1">
                  <div className="h-4 w-4">
                    <YouTubeIcon />
                  </div>
                  <p>youtube</p>
                </div>
              </Link>
            </li> :""
            }
            {
              twitter ?  <li key={`${`twitter`}`}>
              <Link
                href={twitter ?? ''}
                className="text-sm footer-text-color transition-colors hover:text-green-600"
              >
                <div className="flex items-center  gap-1">
                  <div className="h-4 w-4">
                    <TwitterIcon />
                  </div>
                  <p>twitter</p>
                </div>
              </Link>
            </li> : ""
            }
            
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-8 flex w-full flex-col items-center border-t border-gray-200 pt-8 pb-12 lg:mt-0 lg:flex-row lg:justify-between lg:border-t-0">
        <span className="footer-text-color order-2 text-sm lg:order-1">
          &copy; {STATIC_CONTENT['text-copyright']} {new Date().getFullYear()}{' '}
          <Link
            className="footer-text-color font-bold transition-colors hover:text-accent"
            href="/"
          >
            {storeName ?? ''}.
          </Link>{' '}
          {STATIC_CONTENT['text-rights-reserved']}
        </span>
      </div>
    </div>
  );
};

export default Footer;