import { Category, Navigation } from '@/types';
import { ControlledMenu, useMenuState } from '@szhsin/react-menu';
import CategoryMenuItem from './category-menu-item';
import router from 'next/router';
import { useRef } from 'react';
import { useSettings } from '@/framework/settings';

function JewelleryCategoriesMenu({ items }: any) {
  const ref = useRef<any>();
  const {
    settings: {
      displayBlog
    },
  } = useSettings();
  
  return (
    <div className="xs:gap-0 w-full flex justify-center gap-12 px-20 sm:gap-2 md:gap-4 lg:gap-4 xl:gap-6 2xl:gap-8">

      {items?.categories && items?.categories.slice(0, 8)
        .map(({ label, href, children, id }: Category | Navigation) => {
          return (
            <Item
              id={id}
              key={id}
              label={label}
              href={href}
              child={children}
            />
          );
        })}

      {/* If categories.length > 8 or pages.length > 0  */}
      <MoreItem items={items} />
      {
        displayBlog &&
        <button className="flex items-center text-sm whitespace-nowrap font-semibold bottom-header-text-color transition-colors hover:text-green-600"
          onClick={() => {
            router.push('/blogs');
          }}
          ref={ref}
        >BLOGS</button>
      }


    </div>
  );
}

export default JewelleryCategoriesMenu;

const Item = ({ id, label, href, child }: any) => {
  const [menuProps, toggleMenu] = useMenuState({ transition: true });

  return (
    <span
      key={id}
      onMouseEnter={() => toggleMenu(true)}
      onMouseLeave={() => toggleMenu(false)}
    >
      <CategoryMenuItem
        menuProps={menuProps}
        label={label}
        href={href}
        child={child}
      />
    </span>
  );
};

interface MoreItemProps {
  items: {
    categories: Array<Category | Navigation>;
    pages: Array<any>;
  };
}

const MoreItem: React.FC<MoreItemProps> = ({ items }) => {
  const [moreMenuProps, toggleMoreMenu] = useMenuState({ transition: true });

  const renderMoreItem = () => (
    <span
      onMouseEnter={() => toggleMoreMenu(true)}
      onMouseLeave={() => toggleMoreMenu(false)}
    >
      <CategoryMenuItem
        menuProps={moreMenuProps}
        label={'More'}
        href={'/'}
        child={[...items.categories.slice(8), ...items.pages]}
      />
    </span>
  );

  if (items.categories.length > 8 || items.pages.length > 0) {
    return renderMoreItem();
  }

  // Deafult case
  return null;
};
