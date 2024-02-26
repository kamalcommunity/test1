import { Product, ProductReview } from '@/types';
import React from 'react';
// type State = typeof initialState;

interface State {
    product: Product,
    product_reviews: ProductReview[];
}
const initialState = {
    product: null,
    product_reviews: []
};
export const ProductDetailsContext = React.createContext<State | any>(initialState);
ProductDetailsContext.displayName = 'AttributesContext';

export const ProductDetailsProvider: React.FC = (props) => {
  const [state, dispatch] = React.useState(initialState);
  const value = React.useMemo(
    () => ({ productDetailsCtx: state, setProductDetailsCtx: dispatch }),
    [state]
  );
  return <ProductDetailsContext.Provider value={value} {...props} />;
};

export const useProductDetailsContext = () => {
  const context = React.useContext(ProductDetailsContext);
  if (context === undefined) {
    throw new Error(`useAttributes must be used within a SettingsProvider`);
  }
  return context;
};
