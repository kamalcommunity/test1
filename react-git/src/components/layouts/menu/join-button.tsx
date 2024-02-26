import { STATIC_CONTENT } from '@/lib/constants/static-content';
import Button from '@/components/ui/button';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { useTranslation } from 'next-i18next';

export default function JoinButton() {
  
  const { openModal } = useModalAction();
  function handleJoin() {
    // return openModal('LOGIN_VIEW');
  }
  return (
    <Button className="font-semibold" size="small" onClick={handleJoin}>
      {STATIC_CONTENT['join-button']}
    </Button>
  );
}
