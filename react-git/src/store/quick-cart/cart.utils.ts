import client from '../../framework/rest/client/index';
import { getLocalData, setLocalData, removeLocalData } from "../../framework/rest/client/helper";
import { useToken } from "../../lib/hooks/use-token";

export interface Item {
  id: string | number;
  price: number;
  quantity?: number;
  stock?: number;
  [key: string]: any;
}

export interface UpdateItemInput extends Partial<Omit<Item, "id">> { }

export function addItemWithQuantity(
  items: Item[],
  item: Item,
  quantity: number
) {
  if (quantity <= 0)
    throw new Error("cartQuantity can't be zero or less than zero");

  const cartId = getLocalData("cartId");
  let attributes = getAttributes(item);
  const productId = (item.productId) ? item.productId : item.id;
  const access_token = useToken().getToken();

  if (cartId) {
    const existingItemIndex = items.findIndex(
      (existingItem) => existingItem.id === item.id
    );

    if (existingItemIndex > -1) {
      const newItems = [...items];
      newItems[existingItemIndex].quantity! += quantity;

      //api intergeration update cart
      const cartItem = {
        product: productId,
        quantity: newItems[existingItemIndex].quantity,
        attributes: attributes
      };
      client.cart.update(cartItem, cartId).catch(error => {
        removeLocalData("cartId");
        removeLocalData("isCartSync");
      });

      return newItems;
    } else {
      //api intergeration update cart
      const cartItem = {
        product: productId,
        quantity: quantity,
        attributes: attributes
      };
      client.cart.update(cartItem, cartId).catch(error => {
        removeLocalData("cartId");
        removeLocalData("isCartSync");
      });
    }
  } else {
    //api intergeration create cart
    const cartItem = {
      product: productId,
      quantity: quantity,
      attributes: attributes
    };
    const cart = client.cart.create(cartItem).then(cart => {
      setLocalData("cartId", cart.code)
      if (cart && access_token) {
        client.cart.getAuthWithCart(cart.code).then(authCart => {
          setLocalData('cartId', authCart.code);
          setLocalData('isCartSync', true);
        });
      }
    }).catch(error => {
      removeLocalData("cartId");
      removeLocalData("isCartSync");
    });
  }

  return [...items, { ...item, quantity }];
}

export function removeItemOrQuantity(
  items: Item[],
  id: Item["id"],
  quantity: number
) {
  return items.reduce((acc: Item[], item) => {
    if (item.id === id) {
      const newQuantity = item.quantity! - quantity;

      //api intergeration update item from cart
      const cartId = getLocalData("cartId");
      let attributes = getAttributes(item);
      const productId = (item.productId) ? item.productId : item.id;

      const cartItem = {
        product: productId,
        quantity: newQuantity,
        attributes: attributes
      };
      client.cart.update(cartItem, cartId).catch(error => {
        removeLocalData("cartId");
        removeLocalData("isCartSync");
      });;

      return newQuantity > 0
        ? [...acc, { ...item, quantity: newQuantity }]
        : [...acc];
    }
    return [...acc, item];
  }, []);
}
// Simple CRUD for Item
export function addItem(items: Item[], item: Item) {
  return [...items, item];
}

export function getItem(items: Item[], id: Item["id"]) {
  return items.find((item) => item.id === id);
}

export function updateItem(
  items: Item[],
  id: Item["id"],
  item: UpdateItemInput
) {
  return items.map((existingItem) =>
    existingItem.id === id ? { ...existingItem, ...item } : existingItem
  );
}

export function removeItem(items: Item[], id: Item["id"]) {
  //api intergeration update item from cart
  const cartId = getLocalData("cartId");
  const item = getItem(items, id);
  const productId = (item?.productId) ? item?.productId : item?.id;
  let attributes = getAttributes(item);
  const cartItem = {
    product: productId,
    quantity: 0,
    attributes: attributes
  };
  client.cart.update(cartItem, cartId)
    .catch(err => {
      console.log(err);
      removeLocalData("cartId");
      removeLocalData("isCartSync");
    });

  return items.filter((existingItem) => existingItem.id !== id);
}
export function inStock(items: Item[], id: Item["id"]) {
  const item = getItem(items, id);
  if (item) return item["quantity"]! < item["stock"]!;
  return false;
}
export const calculateItemTotals = (items: Item[]) =>
  items.map((item) => ({
    ...item,
    itemTotal: item.price * item.quantity!,
  }));

export const calculateTotal = (items: Item[]) =>
  items.reduce((total, item) => total + item.quantity! * item.price, 0);

export const calculateTotalItems = (items: Item[]) =>
  items.reduce((sum, item) => sum + item.quantity!, 0);

export const calculateUniqueItems = (items: Item[]) => items.length;

interface PriceValues {
  totalAmount: number;
  tax: number;
  shipping_charge: number;
}
export const calculatePaidTotal = (
  { totalAmount, tax, shipping_charge }: PriceValues,
  discount?: number
) => {
  let paidTotal = totalAmount + tax + shipping_charge;
  if (discount) {
    paidTotal = paidTotal - discount;
  }
  return paidTotal;
};

const getAttributes = (item: any) => {
  let attributes: any[] = [];

  if (item.variationId) {
    const variationIds = item.variationId.split("-");

    if (variationIds.length == 0) {
      attributes = [
        {
          id: item.variationId
        }
      ]
    } else {
      attributes = variationIds.map((variationId: any) => {
        return {
          id: variationId
        }
      })
    }
  }

  return attributes;
}

export function addItemWithQuantityAuth(
  items: Item[],
  item: Item,
  quantity: number
) {
  if (quantity <= 0)
    throw new Error("cartQuantity can't be zero or less than zero");

  const existingItemIndex = items.findIndex(
    (existingItem) => existingItem.id === item.id
  );

  if (existingItemIndex > -1) {
    const newItems = [...items];
    newItems[existingItemIndex].quantity! += quantity;
    return newItems;
  }
  return [...items, { ...item, quantity }];
}

export const getCart = async () => {
  let responseObj = {};
  try {
    const access_token = useToken().getToken();
    const cartID = getLocalData("cartId");
    let cart;

    if (access_token) {
      if (cartID) {
        cart = await client.cart.getAuthWithCart(cartID);
      } else {
        cart = await client.cart.getAuthWithoutCart(cartID);
      }
    } else {
      cart = await client.cart.get(cartID)
    }

    if (cart) {
      responseObj = {
        ...responseObj,
        responseData: cart,
        hasError: false,
      };

      if (access_token && cart.code != cartID) {
        setLocalData("cartId", cart.code);
      }
    }

  } catch (error) {
    console.log(error);
    // removeLocalData("cartId");
    responseObj = {
      ...responseObj,
      hasError: true,
    };
  }

  return responseObj;
};