import ErrorMessage from '@/components/ui/error-message';
import Spinner from '@/components/ui/loaders/spinner/spinner';
import ProgressBox from '@/components/ui/progress-box/progress-box';
import { useOrderStatuses } from '@/framework/order';
import { OrderStatusEnum } from '@/framework/utils/constants';
import { OrderStatus } from '@/types';

interface Props {
  status: number;
}

const OrderStatuses = ({ status }: Props) => {
  
  // const { orderStatuses, isLoading, error } = useOrderStatuses({
  //   limit: 100,
  // });

  const orderStatuses: OrderStatus[] = [
    {
      id: '1',
      name: OrderStatusEnum.ORDERED,
      serial: 1,
      color: '#23b848',
      created_at: '2021-03-08T21:33:52.000000Z',
      updated_at: '2021-03-08T21:34:04.000000Z',
      language: 'en',
      translated_languages: ['en'],
    },
    {
      id: '2',
      name:OrderStatusEnum.PROCESSED,
      serial: 2,
      color: '#23b848',
      created_at: '2021-03-08T21:33:52.000000Z',
      updated_at: '2021-03-08T21:34:04.000000Z',
      language: 'en',
      translated_languages: ['en'],
    },
    {
      id: '3',
      name: OrderStatusEnum.DISPATCHED,
      serial: 3,
      color: '#23b848',
      created_at: '2021-03-08T21:33:52.000000Z',
      updated_at: '2021-03-08T21:34:04.000000Z',
      language: 'en',
      translated_languages: ['en'],
    },
    {
      id: '4',
      name: OrderStatusEnum.DELIVERED,
      serial: 4,
      color: '#23b848',
      created_at: '2021-03-08T21:33:52.000000Z',
      updated_at: '2021-03-08T21:34:04.000000Z',
      language: 'en',
      translated_languages: ['en'],
    },
  ];
  // if (isLoading) return <Spinner showText={false} />;
  // if (error) return <ErrorMessage message={error.message} />;
  return <ProgressBox data={orderStatuses} status={status} />;
};

export default OrderStatuses;
