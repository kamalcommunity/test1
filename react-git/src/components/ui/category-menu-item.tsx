import { ControlledMenu } from "@szhsin/react-menu";
import { useRouter } from "next/router";
import { useRef } from "react";
import Link from "./link";

function CategoryMenuItem({
    label,
    href,
    child,
    menuProps,
  }: any) {
    const router = useRouter();
    const ref = useRef<any>(); 
    return (
      <>
        <button
          className="flex items-center text-sm whitespace-nowrap font-semibold bottom-header-text-color transition-colors hover:text-green-600"
          onClick={() => {
            router.push(href);
          }}
          ref={ref}
        >
          <img
            className="mr-3 h-7 rounded-tl-md rounded-tr-md"
          />
  
          {label.length > 10 ? label.toUpperCase().slice(0, 8) + '...' : label.toUpperCase()}
        </button>
        {child.length > 0 ? (
          <ControlledMenu
            position="anchor"
            overflow='auto'
            {...menuProps} anchorRef={ref}>
            {child?.map((item: any) => {
              if(item.displayedInHeader === false) return;

              return <Link
                  className="text-sm flex whitespace-nowrap px-6 py-2 text-heading transition-colors hover:bg-gray-100 hover:text-accent"
                  key={item?.id}
                  href={item?.href}
                >
                  {/* <img
                    className="mr-3 h-7"
                    src={child?.image?.thumbnail ?? 'https://media.istockphoto.com/id/1368424494/photo/studio-portrait-of-a-cheerful-woman.jpg?s=612x612&w=is&k=20&c=S6Je1dyOxHNSMuE3mweAATneAAH9l3u9zdJqN8S0xxc='}
                  /> */}
                  {item?.label.toUpperCase()}
                </Link>
            })}
          </ControlledMenu>
        ) : (
          <></>
        )}
      </>
    );
}

export default CategoryMenuItem;