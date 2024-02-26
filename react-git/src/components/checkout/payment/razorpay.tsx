import { useTranslation } from "next-i18next";

const Razorpay = () => {
  const { t } = useTranslation("common");
  return (
    <>
      <span className="text-sm text-body block">Online Payment</span>
    </>
  );
};
export default Razorpay;
