import DashboardSidebar from '@/components/dashboard/sidebar';
import GeneralLayout from '@/components/layouts/_general';
import Header from '@/components/layouts/header';
import classNames from 'classnames';

type Props = {
  layout?: string;
  className?: string;
};

export default function DashboardLayout({
  children,
  layout,
  className,
}: React.PropsWithChildren<Props>) {
  return (
    <GeneralLayout layout="general">
       {/* <Header layout={layout} /> */}
      <div
        className={classNames(
          '_dashboard mx-auto flex w-full max-w-1920 flex-col items-start bg-white px-5 py-10 lg:flex-row xl:py-14 xl:px-8 2xl:px-14',
          className
        )}
      >
        <DashboardSidebar className="hidden shrink-0 ltr:mr-8 rtl:ml-8 lg:block xl:w-80" />
        {children}
      </div>
    </GeneralLayout>
  );
}
