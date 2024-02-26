import { Product } from "@/types";

export function formatAllProducts(products: Product[]): any {
  return products && products.length > 0
    ? products.map((product: any) => formatProductData(product))
    : [];
}

export function formatCategoryData(category: any, children?: any) {

  let href = category?.children.length > 0 ? `categories?category=${category?.description?.friendlyUrl}` ?? '/404' : `/search/?categorySlugs=${category?.description?.friendlyUrl ?? '/404'}`
  return {
    ...category,
    slug: category.categoryDescription.friendlyUrl,
    name: category.categoryDescription.name,
    image: {
      id: category.id,
      original: category.image?.path ?? '',
      thumbnail: category.image?.path ?? '',
      imageUrl: category.image?.path ?? '',
    },
    icon: category?.image?.path ?? '',
    href: href,
    children: children ? children : [],
    label: category?.description?.title ?? '',
    parent_id: category?.depth > 0 ? category?.parent?.id : 0
  };
}


// common function for formate product data
export function formatProductData(
  product: Product,
) {
  const gallery = formatProductImages(product?.images ?? [])
  return {
    ...product,
    slug: product?.productDescription?.friendlyUrl,
    name: product?.productDescription?.name,
    product_type: (product.options.length > 0) ? "variable" : "simple",
    price: product?.productPrice?.originalPriceDecimal,
    sale_price: product?.productPrice?.finalPriceDecimal,
    max_price: product?.productPrice?.originalPriceDecimal,
    min_price: product?.productPrice?.originalPriceDecimal,
    image: product?.image ? {
      ...product.image,
      original: product?.image?.imageUrl,
      thumbnail: product?.image?.imageUrl,
      imageName: product?.image?.imageName,
      imageUrl: product?.image?.imageUrl,
      videoUrl: product?.image?.videoUrl,
      imageType: product?.image?.imageType
    } : {},
    images: gallery,
    unit: product?.productPrice?.productUnitCode,
    description: product?.productDescription?.description ?? "",
    available: product?.available,
    originalPrice: product?.productPrice?.originalPriceDecimal,
    finalPrice: product?.productPrice?.finalPriceDecimal,
    href: `/products/${product?.productDescription?.friendlyUrl ?? "/404"}`,
    quantity: product?.quantity,
  };
}

// common function for formate product data
function formatProductImages(images: any[]): any[] {
  return images.map((image) => {
    return {
      id: Number(image.id),
      original: image?.imageUrl,
      thumbnail: image?.imageUrl,
      imageName: image?.imageName,
      imageUrl: image?.imageUrl,
      videoUrl: image?.videoUrl,
      imageType: image?.imageType
    }
  })
}


export function formatChildParentCategories(categories: any[]) {
  return categories && categories.length > 0
    ? categories.map((category: any) => {
        const children = category.children.map((child: any) => {
          return formatCategoryData(child);
        });
        return formatCategoryData(category, children);
      })
    : [];
}
