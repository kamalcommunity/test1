import { STATIC_CONTENT } from '@/lib/constants/static-content';
import { useIsRTL } from '@/lib/locals';
import { useTranslation } from 'next-i18next';
import dayjs from 'dayjs';
import Badge from '@/components/ui/badge';
import { formatString } from '@/lib/format-string';
import usePrice from '@/lib/use-price';
import Link from '@/components/ui/link';
import { ROUTES } from '@/lib/routes';
import { Table } from '@/components/ui/table';

interface SuborderItemsProps {
  items: any;
}

const SuborderItems: React.FC<SuborderItemsProps> = ({ items }) => {
  
  const { alignLeft, alignRight } = useIsRTL();

  const orderTableColumns = [
    {
      title: STATIC_CONTENT['text-tracking-number'],
      dataIndex: 'tracking_number',
      key: 'tracking_number',
      align: alignLeft,
    },
    {
      title: STATIC_CONTENT['text-date'],
      dataIndex: 'date',
      key: 'date',
      align: alignLeft,
      render: (created_at: string) => dayjs(created_at).format('MMMM D, YYYY'),
    },
    {
      title: STATIC_CONTENT['text-status'],
      dataIndex: 'status',
      key: 'status',
      align: alignLeft,
      render: function renderStatus(status: any) {
        return (
          <Badge
            text={status?.name}
            style={{ backgroundColor: status?.color }}
          />
        );
      },
    },
    {
      title: STATIC_CONTENT['text-item'],
      dataIndex: 'products',
      key: 'products',
      align: alignLeft,
      render: (products: any) => formatString(products?.length, STATIC_CONTENT['text-item']),
    },
    {
      title: STATIC_CONTENT['text-total-price'],
      dataIndex: 'paid_total',
      key: 'paid_total',
      align: alignRight,
      // width: 100,
      render: function TotalPrice(paid_total: any) {
        const { price } = usePrice({ amount: paid_total });
        return <p>{price}</p>;
      },
    },
    {
      title: '',
      dataIndex: 'tracking_number',
      key: 'tracking_number',
      align: alignRight,
      // width: 100,
      render: function renderTrackingNumber(tracking_number: string) {
        return (
          <Link
            href={`${ROUTES.ORDERS}/${tracking_number}`}
            className="inline-flex items-center justify-center flex-shrink-0 font-semibold leading-none rounded outline-none transition duration-300 ease-in-out focus:outline-none focus:shadow bg-gray-700 text-light border border-transparent hover:bg-gray-900 px-4 py-0 h-10 text-sm"
          >
            {STATIC_CONTENT['text-view']}
          </Link>
        );
      },
    },
  ];
  return (
    <Table
      //@ts-ignore
      columns={orderTableColumns}
      emptyText={STATIC_CONTENT['table:empty-table-data']}
      //@ts-ignore
      data={items}
      rowKey="id"
      scroll={{ x: 800 }}
    />
  );
};

export default SuborderItems;
