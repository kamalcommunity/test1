import { STATIC_CONTENT } from '@/lib/constants/static-content';
import { siteSettings } from '@/settings/site';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import DrawerWrapper from '@/components/ui/drawer/drawer-wrapper';
import { useAtom } from 'jotai';
import { drawerAtom } from '@/store/drawer-atom';
import { useUser ,useLogout } from '@/framework/user';


export default function MobileAuthorizedMenu() {
  
  const router = useRouter();
  const { me } = useUser();
  const [_, closeSidebar] = useAtom(drawerAtom);
  const { mutate: logout } = useLogout();
  function handleClick(path: string) {
    closeSidebar({ display: false, view: '' });
    if(path) {
      router.push(path);
    } else {
      logout();
    };
  }
  return (
    <DrawerWrapper>
      <ul className="flex-grow">
        {/* <li className="flex items-center justify-between w-full px-5 pt-3 text-sm font-semibold capitalize bg-gray-100 border-t border-dashed md:px-8 ltr:text-left rtl:text-right text-body focus:outline-none border-border-200">
          <span>{STATIC_CONTENT['text-total-points']}</span>
          <span>{me?.wallet?.total_points ?? 0}</span>
        </li>
        <li className="flex items-center justify-between w-full px-5 pt-3 text-sm font-semibold capitalize bg-gray-100 md:px-8 ltr:text-left rtl:text-right text-body focus:outline-none">
          <span>{STATIC_CONTENT['text-points-used']}</span>
          <span>{me?.wallet?.points_used ?? 0}</span>
        </li>
        <li className="flex items-center justify-between w-full px-5 py-3 text-sm font-semibold capitalize bg-gray-100 border-b border-dashed md:px-8 ltr:text-left rtl:text-right text-body focus:outline-none border-border-200">
          <span>{STATIC_CONTENT['text-available-points']}</span>
          <span>{me?.wallet?.available_points ?? 0}</span>
        </li> */}

        {siteSettings.authorizedLinksMobile.map(({ href, label }) => (
          <li key={`${href}${label}`}>
            <span
              className="block px-5 py-3 text-sm font-semibold capitalize transition duration-200 cursor-pointer md:px-8 text-heading hover:text-accent"
              onClick={() => handleClick(href)}
            >
              {label}
            </span>
          </li>
        ))}
      </ul>
    </DrawerWrapper>
  );
}
