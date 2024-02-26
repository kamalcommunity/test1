import { STATIC_CONTENT } from '@/lib/constants/static-content';
import { useTranslation } from "next-i18next";

const CashOnDelivery = () => {
  const { t } = useTranslation("common");
  return (
    <>
      <span className="text-sm text-body block">{STATIC_CONTENT["text-cod-message"]}</span>
    </>
  );
};
export default CashOnDelivery;
