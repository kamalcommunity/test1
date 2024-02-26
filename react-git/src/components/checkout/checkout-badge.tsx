import { productPlaceholder } from "@/lib/placeholders";

const CheckoutBadge: React.FC<any> = ({ text, code, image }) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <img src={image ? image : productPlaceholder} className="h-12 w-12 text-[8px] border" alt="checkout-badge" />
      <div className="font-normal text-body">Secure</div>
      <div className="font-bold text-accent overflow-auto px-2 truncate w-full  text-center text-sm">{text}</div>
    </div>
  );
};

export default CheckoutBadge;
  