import { CalculateOrderTotalResponse, Catalog, Category, Configuration, GroupProducts, Product, ProductGroupItem, ProductPaginator, ProductReview, ShippingOption, Type } from "@/types";
import { TYPE_DATA, TYPE_DEFUALT_INDEX } from "./constants";
import { productPlaceholder } from "@/lib/placeholders";
import { PRODUCTS_PER_PAGE } from "../client/variables";
import client from "../client";
import { calculateOrderTotal } from "../order";
import { toast } from "react-toastify";
import { orderTotalFillter } from "./data-mappers";

export function findType(params: any) {
  let typeData;
  if (params) {
    if (typeof params === 'string') {
      typeData = TYPE_DATA.find(res => res.settings.layoutType === params);
    } else {
      typeData = TYPE_DATA.find(res => res.settings.layoutType === params?.type);
    }
  } else {
    typeData = TYPE_DATA[TYPE_DEFUALT_INDEX];
  }
  return typeData;
}


export const maxLengthFun = (e: any, maxLength: number) => {
  let sanitizedValue = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
  sanitizedValue = sanitizedValue.slice(0, maxLength); // Limit to maxLength digits

  e.target.value = sanitizedValue;
};

export const formatCategory = (category: any, type: any, children?: any[]) => {
  return {
    ...category,
    slug: category.categoryDescription.friendlyUrl,
    name: category.categoryDescription.name,
    image: {
      id: category.id,
      original: category.image?.path ?? '',
      thumbnail: category.image?.path ?? '',
    },
    icon: category?.image?.path ?? '',
    type: type,
    href: `${type?.slug}/search/?categorySlugs=${category?.description?.friendlyUrl}`,
    children: children ? children : [],
    label: category?.description?.name ?? '',
    parent_id: category?.depth > 0 ? category?.parent?.id : 0
  };
}

export const formateCateogries = (categories: any[], type: any) => {
  let childParentCategories: any = [];
  return categories?.map((category: Category) => {
    const children = category.children.map((child) => {
      return formatCategory(child, type);
    });
    let item = formatCategory(category, children);
    childParentCategories.push(item, ...children);
    return item;
  });
}

export const formateCataloges = (items: Catalog[], typeData: any) => {
  const catalogsResponse = items?.map((catalog: Catalog) => {
    let parse_Configuration: Configuration = JSON.parse(catalog?.configuration);

    return {
      ...catalog,
      id: catalog?.id,
      type: typeData,
      catalog_name: catalog?.name,
      catalog_subtitle: catalog?.description,
      category_count: catalog?.category.length,
      parse_Configuration,
      category: catalog?.category?.map(category => {
        return {
          ...category,
          type: typeData,
          id: category?.id,
          href: `${typeData?.slug}/search/?category=${category?.description?.friendlyUrl}`,
          img_src: category?.image?.path ?? productPlaceholder,
          description: category?.description?.name,
          category_friendlyUrl: category?.description?.friendlyUrl,
          slug: category?.type?.slug ?? "",
          parse_Configuration,
        }
      }),
    }
  });
  return catalogsResponse;
}



// common function for formate product data
export function formateProductsWithQueryData(products: Product[], response: never[] | ProductPaginator | any, params: { [x: string]: any; }) {
  return {
    data: products,
    products: products,
    total: response.recordsTotal,
    recordsTotal: response.recordsTotal,
    recordsFiltered: response.recordsFiltered,
    totalPages: response.totalPages,
    number: response.number,
    current_page: (params.page) ? params.page : 0,
    count: PRODUCTS_PER_PAGE,
    last_page: response.totalPages - 1,
    firstItem: 0,
    lastItem: response.recordsTotal - 1,
    per_page: PRODUCTS_PER_PAGE,
    links: [],
    path: "",
    to: 0,
    from: response.recordsTotal - 1,
    first_page_url: "",
    last_page_url: "",
    next_page_url: "",
    prev_page_url: ""
  };
}

// common function for formate product data
export function formateProductsData(
  product: any,
  originalPrice: any,
  finalPrice: any,
  gallery: any[],
  typeData: Type | any
) {
  return {
    ...product,
    slug: product?.productDescription?.friendlyUrl,
    name: product?.productDescription?.name,
    product_type: (product.options.length > 0) ? "variable" : "simple",
    price: originalPrice,
    sale_price: finalPrice,
    max_price: originalPrice,
    min_price: originalPrice,
    image: {
      ...product.image,
      original: product.image?.imageUrl,
      thumbnail: product.image?.imageUrl
    },
    images: gallery,
    unit: product?.productPrice?.productUnitCode,
    type: typeData,
    description: product.productDescription.description ?? "",
  };
}

// common function for formate product data
export function formateProductImages(images: any[]): any[] {
  return images.map((image) => {
    return {
      id: Number(image.id),
      original: image?.imageUrl ?? "null",
      thumbnail: image?.imageUrl ?? "null",
      imageName: image?.imageName ?? "null",
      imageUrl: image?.imageUrl ?? "null",
      videoUrl: image?.videoUrl ?? "null",
      imageType: image?.imageType ?? "null"
    }
  })
}

// common function for formate product data
export function formateCategories(categories: any[]) {
  return categories.map((category) => {
    return {
      ...category,
      id: category.id,
      name: category.categoryDescription?.name,
      slug: category.categoryDescription?.friendlyUrl ?? "",
      description: category.categoryDescription?.description ?? "",
      image: {
        id: Number(category.id),
        original: "",
        thumbnail: "",
        imageName: "",
        imageUrl: "",
        videoUrl: "",
      },
      children: [],
      code: category.code
    }
  })
}

export function formateProductGroups(productGroups: GroupProducts, typeData: any) {
  return productGroups && productGroups?.map((productGroup: ProductGroupItem) => {
    const products = productGroup.products?.map(product => {
      const originalPrice = product?.productPrice?.originalPriceDecimal;
      const finalPrice = product?.productPrice?.finalPriceDecimal;
      const gallery = formateProductImages(product.images)
      return formateProductsData(product, originalPrice, finalPrice, gallery, typeData)
    });
    console.log(productGroup);

    return {
      products,
      id: productGroup?.id,
      name: productGroup?.code.toUpperCase(),
      code: productGroup?.code,
      is_approved: productGroup?.active,
      image: {
        id: productGroup?.id,
        original: productGroup?.readableImage?.path ?? "null",
        thumbnail: productGroup?.readableImage?.path ?? "null"
      },
      slug: productGroup?.code,
      title: productGroup?.title,
      subTitle: productGroup?.description,
      socials: [],
    }
  })

}


export async function getRelatedProducts(id: string, storeCode: string, typeData: any) {
  try {
    let response = await client.products.relatedProducts(id, storeCode);
    let relatedProducts = response.map(product => {
      const originalPrice = product.productPrice.originalPriceDecimal;
      const finalPrice = product.productPrice.finalPriceDecimal;

      const gallery = product.images.map((image) => {
        return {
          id: (image.id) ? Number(image.id) : null,
          original: (image?.imageUrl) ? image?.imageUrl : null,
          thumbnail: (image.imageUrl) ? image.imageUrl : null,
          imageName: (image?.imageUrl) ? image?.imageUrl : null,
          imageUrl: (image?.imageUrl) ? image?.imageUrl : null,
          videoUrl: (image.videoUrl) ? image.videoUrl : null,
        }
      })

      return {
        ...product,
        slug: product.productDescription.friendlyUrl,
        name: product.productDescription.name,
        product_type: (product.options.length > 0) ? "variable" : "simple",
        price: originalPrice,
        sale_price: finalPrice,
        max_price: originalPrice,
        min_price: originalPrice,
        image: {
          ...product.image,
          original: (product.image?.imageUrl) ? product.image?.imageUrl : null,
          thumbnail: (product.image?.imageUrl) ? product.image?.imageUrl : null,
        },
        images: gallery,
        unit: product.productPrice.productUnitCode,
        productUnitQuantity: product.productPrice.productUnitQuantity,
        type: typeData,
      }
    })
    return relatedProducts;

  } catch (error) {

  }

}

export const getProductReviews = async (id: string, storeCode: string) => {
  try {
    let response: ProductReview[] = await client.productReviews.get(+id, storeCode);

    return response.map(item => {
      return {
        ...item,
        customer_name: `${item?.customer?.billing?.firstName ?? 'Unknown'} ${item?.customer?.billing?.lastName ?? 'User'}`,
        review_msg: item?.description,
        review_date: item?.date,
        id: item?.id,
      }
    })
  } catch (error) {

  }

}

const combinations = (arr: any[], includeEmpty = false) => {
  const groups = {};

  arr.forEach(({ name, value, id, varient }) => {
    if (!groups[name]) {
      groups[name] = includeEmpty ? [null] : [];
    }
    groups[name].push({ id, varient, name, value });
  });

  let output = [[]];
  Object.values(groups).forEach(group => {
    const temp: never[][] = [];
    group.forEach((item: ConcatArray<never>) => {
      output.forEach(list => temp.push(item ? list.concat(item) : list));
    });
    // deep copy
    output = JSON.parse(JSON.stringify(temp));
  });
  return output;
};


const variationsObject = (product: { productAttributes: any; variation_options: any; productDescription: { name: any; }; quantity: any; sku: any; id: any; }) => {
  let productAttributes = product.productAttributes;
  productAttributes = productAttributes.reduce(function (r: { [x: string]: { id: any; varient: any; name: any; value: any; }[]; }, a: { optionValue: { optionCode: string | number; description: { name: any; }; }; id: any; option: { description: { name: any; }; }; }) {
    r[a.optionValue.optionCode] = r[a.optionValue.optionCode] || [];
    r[a.optionValue.optionCode].push({
      id: a.id,
      varient: a,
      name: a.option.description.name,
      value: a.optionValue.description.name
    });
    return r;
  }, Object.create(null));

  const productAttributeKeys = Object.keys(productAttributes);

  const options = productAttributeKeys.flatMap(key => {
    return productAttributes[key];
  })

  const optionsCombinations = combinations(options);

  let variation_options: never[] = [];

  optionsCombinations.flatMap(option => {
    const varient = {
      ...product.variation_options,
      id: "",
      slug: "",
      title: product.productDescription.name,
      image: null,
      price: "",
      sale_price: null,
      quantity: product.quantity,
      is_disable: 0,
      sku: product.sku,
      options: [],
      product_id: product.id,
    };
    let varientTotals = 0; // need to verify

    option.map(productAttribute => {
      varient.id = (varient.id.length == 0) ? varient.id.concat(productAttribute.id) : varient.id.concat("-" + productAttribute.id);
      varient.slug = productAttribute.varient.option.code;
      varientTotals += productAttribute.varient.productAttributePriceWithoutCurrency; // need to verify
      varient.sku = varient.sku + "-" + productAttribute.varient.optionValue.code;
      varient.title = varient.title + " - " + productAttribute.varient.optionValue.code;

      if (varient.options.length == 0) {
        varient.options = [{
          name: productAttribute.name,
          value: productAttribute.value
        }];
      } else {
        varient.options.push({
          name: productAttribute.name,
          value: productAttribute.value
        });
      }
    })
    varient.price = product.price + varientTotals;  // need to verify
    variation_options.push(varient);
  })

  return variation_options;
}

export function manageProduct(product: Product) {
  const originalPrice = product.productPrice.originalPriceDecimal;
  const finalPrice = product.productPrice.finalPriceDecimal;

  const categories = product.categories.map((category) => {
    return {
      ...category,
      id: category.id,
      name: category.categoryDescription?.name,
      slug: category.categoryDescription?.friendlyUrl,
      description: category.categoryDescription?.description,
      image: {
        id: Number(category.id),
        original: "",
        thumbnail: "",
        imageName: "",
        imageUrl: "",
        videoUrl: "",
      },
      children: [],
      code: category.code
    };
  });

  const gallery = product.images.map((image) => {
    return {
      id: Number(image?.id),
      original: image?.imageUrl,
      thumbnail: image?.imageUrl,
      imageName: image?.imageName,
      imageUrl: image?.imageUrl,
      videoUrl: image?.videoUrl,
      imageType: image?.imageType
    };
  });

  const variation_options = (product.productAttributes.length > 0) ? variationsObject(product) : [];

  const variations = (product.productAttributes.length > 0) ? product.productAttributes.map(variation => {
    return {
      ...product.variations,
      id: variation.id,
      slug: variation.option.code,
      attribute_id: variation.option.id,
      value: variation.optionValue.description.name,
      meta: null,
      pivot: {
        product_id: product.id,
        attribute_value_id: variation.id
      },
      attribute: {
        id: variation.id,
        slug: variation.option.code,
        name: variation.option.description.name,
        shop_id: 7,
        values: [
          {
            id: variation.optionValue.id,
            attribute_id: variation.option.id,
            value: variation.optionValue.description.name,
            meta: null,
          }
        ]
      }
    };
  }) : [];
  return { originalPrice, finalPrice, categories, gallery, variation_options, variations };
}

export async function onCalculateOrderTotalByShippingQoute(isAuthorize: boolean, shippingOption: ShippingOption) {
  try {
    const calculatedOrderTotal: CalculateOrderTotalResponse = await calculateOrderTotal(isAuthorize, `${shippingOption.shippingQuoteOptionId}`);

    if (!calculatedOrderTotal) {
      throw new Error("Something went wrong");
    }
    const totals = calculatedOrderTotal?.totals ?? [];
    return orderTotalFillter(totals);
  } catch (err) {
    if (err instanceof Error) {
      toast.error(err.message || 'Failed to calculate order total.');
    } else {
      toast.error('An error occurred while calculating order total.');
    }
  }
}