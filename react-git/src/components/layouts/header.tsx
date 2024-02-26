import { STATIC_CONTENT } from '@/lib/constants/static-content';
import Logo from '@/components/ui/logo';
import cn from 'classnames';
import StaticMenu from './menu/static-menu';
import { useAtom } from 'jotai';
import { displayHeaderSearchAtom } from '@/store/display-header-search-atom';
import { displayMobileHeaderSearchAtom } from '@/store/display-mobile-header-search-atom';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { authorizationAtom } from '@/store/authorization-atom';
import { useIsHomePage } from '@/lib/use-is-homepage';
import { useEffect } from 'react';
import GroupsDropdownMenu from './menu/groups-menu';
import Link from '@/components/ui/link';
import { useRouter } from 'next/router';
import SearchWithSuggestion from '../ui/search/search-with-suggestion';
import Head from "next/head"
import { logoPlaceholder } from '@/lib/placeholders'; 
import { useHelloBar, useSettings } from '@/framework/settings';
import HelloBar from '../hello-bar/hello-bar';
const Search = dynamic(() => import('@/components/ui/search/search'));

const AuthorizedMenu = dynamic(() => import('./menu/authorized-menu'), {
  ssr: false,
});
const JoinButton = dynamic(() => import('./menu/join-button'), { ssr: false });

const Header = ({ layout }: { layout: string }) => {
  const router = useRouter();
  const {
    settings: { storeName , favicon, displayStoreName, logo},
  } = useSettings();

  
  const [displayHeaderSearch, setDisplayHeaderSearch] = useAtom(
    displayHeaderSearchAtom
  );
  const [displayMobileHeaderSearch] = useAtom(displayMobileHeaderSearchAtom);
  const [isAuthorize] = useAtom(authorizationAtom);
  const isHomePage = useIsHomePage();
  useEffect(() => {
    if (!isHomePage) {
      setDisplayHeaderSearch(false);
    }
  }, [isHomePage, setDisplayHeaderSearch]);
  const isFlattenHeader =
    !displayHeaderSearch && isHomePage && layout !== 'modern';

  const favico = favicon ? favicon : logoPlaceholder.src;
  
  return ( 
    <header className={cn('site-header-with-search sticky top-0 z-50 h-auto')}>
    <div className="w-full row p-0" data-gjs-type="ui-header" id="irl3"><nav className="navbar navbar-expand-lg navbar-light"><div className="container-fluid"><div className="hamburger1"><span className="bar1"></span><span className="bar1"></span><span className="bar1"></span></div><div className="collapse navbar-collapse" id="collapseId"><div className="navbar-nav"><div className="nav-item nav-link" href="#" id="is27o"><p className="m-0" id="ii2vl">dfdsf</p></div></div><div action-type="sign-in" button-type="auth" id="it5xwp">
                    {
                      isAuthorize ? <AuthorizedMenu minimal={true} /> :
                        <Link href={'/login'}>
                          Sign in
                        </Link>
                    }

                    {/* {isAuthorize ?  : <JoinButton />} */}
                  </div><a id="i7jn4">asdfdssfsdfsd</a></div></div></nav></div>
    </header>
  );
};

export default Header;
