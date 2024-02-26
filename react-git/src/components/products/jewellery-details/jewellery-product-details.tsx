import { STATIC_CONTENT } from '@/lib/constants/static-content';
import BackButton from '@/components/ui/back-button';
import { AddToCart } from '@/components/products/add-to-cart/add-to-cart';
import usePrice from '@/lib/use-price';
import { ThumbsCarousel } from '@/components/ui/thumb-carousel';
import { useTranslation } from 'next-i18next';
import { getVariations } from '@/lib/get-variations';
import {  useEffect, useMemo,useState } from 'react';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import { scroller, Element } from 'react-scroll';
import { useRouter } from 'next/router';
import { ROUTES } from '@/lib/routes';
import type { CheckoutBadges, IBadge, Product, ProductReview } from '@/types';
import { useAtom } from 'jotai';
import { isVariationSelected } from '@/lib/is-variation-selected';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { Waypoint } from 'react-waypoint';
import { stickyShortDetailsAtom } from '@/store/sticky-short-details-atom';
import { displayImage } from '@/lib/display-product-preview-images';
import parse from 'html-react-parser';
import { useSettings } from '@/framework/settings';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import VariationGroups from '../details/variation-groups';
import { useAttributes } from '../details/attributes.context';
import classNames from 'classnames';
import VariationPrice from '../details/variation-price';
import CategoryBadges from '../details/category-badges';
import { authorizationAtom } from '@/store/authorization-atom';
import RelatedProducts from '../details/related-products';
import SectionBlock from '@/components/ui/section-block';
import ReactStars from 'react-rating-stars-component';
import { useProductDetailsContext } from '../details/product-details.context';
import CheckoutBadge from '@/components/checkout/checkout-badge';
import { productPlaceholder } from '@/lib/placeholders';


type Props = {
  product: Product;
  backBtn?: boolean;
  isModal?: boolean;
  checkoutBadges: any;
};
const JewelleryProductDetails: React.FC<Props> = ({
  product,
  checkoutBadges,
  backBtn = true,
  isModal = false,
}) => {
  const {
    name,
    image, //could only had image we need to think it also
    description,
    unit,
    categories,
    gallery,
    type,
    quantity,
    shop,
    slug,
    product_reviews,
    product_reviews_count,
    rating,
    ratingCount,
    min_price,
    max_price,
    id,
    sale_price,
    sku,
    productUnitQuantity,
    price: productPrice
  } = product ?? {};
  const { productDetailsCtx, setProductDetailsCtx } = useProductDetailsContext();
  
  const {
    settings: { allowOnlinePurchase, displayProductPrice },
  } = useSettings();

  

  const [_, setShowStickyShortDetails] = useAtom(stickyShortDetailsAtom);

  const router = useRouter();

  const { openModal, closeModal } = useModalAction();

  const { attributes } = useAttributes();

  const [authorization] = useAtom(authorizationAtom);

  const [badgesData, setbadgesData] = useState<any>(null);

  useEffect(() => {
    let parsedData: CheckoutBadges;
    parsedData = {
      ...checkoutBadges,
      badges: checkoutBadges?.value ? JSON.parse(checkoutBadges?.value) : [],
    };
    setbadgesData(parsedData);
    // console.log(badgesData);
  }, [checkoutBadges]);

  // useEffect(() => {
  //   let parsedData: CheckoutBadges;
  //   parsedData = {
  //     ...checkoutBadges,
  //     badges: checkoutBadges?.value ? JSON.parse(checkoutBadges?.value) : [],
  //   };
  //   setbadgesData(parsedData);
  //   // console.log(badgesData);
  // }, [checkoutBadges]);

  // useEffect(() => {
  //   // setAttributes((prev: any) => ({
  //     console.log('productDetailsCtx' , productDetailsCtx);
  //     console.log('productReviews' , product_reviews);
  //   //   ...prev,
  //   //   [variationName]: attribute.value,
  //   // }))
  //   setProductDetailsCtx((pre: any) => {
  //     return {
  //       ...pre,
  //       product_reviews: ['11','121']
  //     }
  //   })
  //   console.log('productCtx', productDetailsCtx);

  // }, [product_reviews])

  const { price, basePrice, discount } = usePrice({
    amount: sale_price ? sale_price : productPrice!,
    baseAmount: productPrice,
  });

  const navigate = (path: string) => {
    router.push(path);
    closeModal();
  };

  const variations = useMemo(
    () => getVariations(product?.variations),
    [product?.variations]
  );
  const isSelected = isVariationSelected(variations, attributes);
  let selectedVariation: any = {};
  if (isSelected) {
    selectedVariation = product?.variation_options?.find((o: any) => {
     return  isEqual(
        o.options.map((v: any) => v.value).sort(),
        Object.values(attributes).sort()
      )
    }
    );
  }

  const scrollDetails = () => {
    scroller.scrollTo('details', {
      smooth: true,
      offset: -80,
    });
  };

  const onWaypointPositionChange = ({
    currentPosition,
  }: Waypoint.CallbackArgs) => {
    if (!currentPosition || currentPosition === 'above') {
      setShowStickyShortDetails(true);
    }
  };
  const hasVariations = !isEmpty(variations);
  const previewImages = displayImage(selectedVariation?.image, gallery, image);
  // console.log(previewImages);

  function onAdd() {
    openModal('PRODUCT_REVIEW_VIEW', { productId: id });
  }
  
  return (
    // product details
    <article className="rounded-lg bg-light">
      <div className="flex flex-col border-b border-border-200 border-opacity-70 md:flex-row">
        <div className="px-5 pt-6 pb-10 md:w-1/2 lg:pb-14">
          <div className="mb-6 flex items-center justify-between px-6">
            {backBtn && <BackButton />}
            {discount && (
              <div className="rounded-full bg-accent px-3 text-xs font-semibold leading-6 text-light ltr:ml-auto rtl:mr-auto">
                {discount}
              </div>
            )}
          </div>

          {previewImages && previewImages.length > 0 && previewImages[0].id && (
            <div className="product-gallery h-full">
              <ThumbsCarousel
                gallery={previewImages}
                hideThumbs={previewImages.length <= 1}
              />
            </div>
          )}
        </div>
        <div className="flex flex-col items-start px-5 pb-10 md:w-1/2 md:pt-6 lg:pb-14">
          <Waypoint
            onLeave={() => setShowStickyShortDetails(true)}
            onEnter={() => setShowStickyShortDetails(false)}
            onPositionChange={onWaypointPositionChange}
          >
            <div className="w-full">
              <h1
                className={classNames(
                  `mt-1 pb-2 text-lg font-semibold tracking-tight text-heading transition hover:text-accent md:text-xl xl:text-3xl overflow-auto`,
                  {
                    'cursor-pointer transition-colors hover:text-accent':
                      isModal,
                  } 
                )}
                {...(isModal && {
                  onClick: () => navigate(`${ROUTES.PRODUCT}/${slug}`),
                })}
              >
                {name}
              </h1>
              <span className="text-base tracking-normal text-body">
                {/* 513018BTSBAA002EDOO1029*/} {sku}
              </span>

              <div className="flex flex-row items-center font-semibold">
                <ReactStars
                  count={rating}
                  // onChange={review.}
                  value={rating}
                  size={30}
                  edit={false}
                  isHalf={true}
                  emptyIcon={<i className="far fa-star"></i>}
                  halfIcon={<i className="fa fa-star-half-alt"></i>}
                  fullIcon={<i className="fa fa-star"></i>}
                  activeColor="#ffd700"
                />
                <div className=" cursor-pointer pl-4 pt-1 transition hover:text-accent">
                  {' '}
                  <a href="#reviews">{ratingCount} Reviews</a>{' '}
                </div>
              </div>
              {/* {description && (

                <div className="text-sm leading-7 text-body font-semibold">
                  <Truncate
                    character={150}
                    {...(!isModal && {
                      onClick: () => scrollDetails(),
                      compressText: 'common:text-see-more',
                    })}
                  >
                    {parse(description)}
                  </Truncate>
                  <hr className='mt-4' />
                </div>
              )} */}

              {displayProductPrice && (
                <>
                  {hasVariations ? (
                    <>
                      <div className="my-1 flex items-center md:my-1">
                        <VariationPrice
                          selectedVariation={selectedVariation}
                          minPrice={min_price}
                          maxPrice={max_price}
                        />
                        <span className="flex items-center">
                          {/* <ins className="text-2xl font-semibold text-accent no-underline md:text-3xl">
                            {price}
                          </ins> */}
                          {basePrice && (
                            <del className="text-sm font-normal text-muted ltr:ml-2 rtl:mr-2 md:text-base">
                              {basePrice}
                            </del>
                          )}
                        </span>
                      </div>
                      <div>
                        <VariationGroups variations={variations} />
                      </div>
                    </>
                  ) : (
                    <span className="mt-1 flex items-center">
                      <ins className="text-2xl font-semibold text-accent no-underline md:text-3xl">
                        {price}
                      </ins>
                      {basePrice && (
                        <del className="text-sm font-normal text-muted ltr:ml-2 rtl:mr-2 md:text-base">
                          {basePrice}
                        </del>
                      )}
                    </span>
                  )}
                </>
              )}
              
               {unit && !hasVariations && (
                <span className=" mt-1 block text-sm font-normal text-body">
                  {STATIC_CONTENT['per-text-quantity']} {productUnitQuantity} {unit}
                </span>
              )}
              {allowOnlinePurchase ? (
                <div className="mt-4 flex flex-col items-center md:mt-6 lg:flex-row">
                  <div className="mb-3 flex w-full lg:mb-0 lg:max-w-[400px]">
                   {product &&
                    <AddToCart
                    data={product}
                    variant="big"
                    variation={selectedVariation}
                    disabled={
                      selectedVariation?.is_disable ||
                      !isSelected ||
                      quantity <= 0 || !product?.available
                    }
                    />
                   } 
                  </div>

                  {!hasVariations && (
                    <>
                      {Number(quantity) > 0 ? (
                        <span className="whitespace-nowrap text-base capitalize text-body ltr:lg:ml-7 rtl:lg:mr-7">
                          {quantity} {unit} {STATIC_CONTENT['text-pieces-available']}
                        </span>
                      ) : (
                        <div className="whitespace-nowrap text-red-500 ltr:lg:ml-7 rtl:lg:mr-7">
                          {STATIC_CONTENT['text-out-stock']}
                        </div>
                      )}
                    </>
                  )}
                  {!isEmpty(selectedVariation) && (
                    <span className="whitespace-nowrap text-base text-body ltr:lg:ml-7 rtl:lg:mr-7">
                      {selectedVariation?.is_disable ||
                      selectedVariation.quantity === 0
                        ? STATIC_CONTENT['text-out-stock']
                        : 
                        // `${selectedVariation.quantity} ${STATIC_CONTENT[
                        //     'text-pieces-available'
                        //   ]}`
                            `${selectedVariation.quantity} ${unit} ${STATIC_CONTENT[
                            'text-pieces-available'
                          ]}`
                          }
                    </span>
                  )}
                </div>
              ) : (
                <div className="mb-3 w-full lg:mb-0 lg:max-w-[400px]">
                  <button
                    className="flex w-full items-center justify-center rounded bg-accent py-4 px-5 text-sm font-light text-light transition-colors duration-300 hover:bg-accent-hover focus:bg-accent-hover focus:outline-none lg:text-base"
                    onClick={() => {
                      return openModal('PRODUCT_ENQUIRY', {
                        data: product,
                        variations: selectedVariation,
                      });
                    }}
                  >
                    <span>{STATIC_CONTENT['send-to-inquiry']}</span>
                  </button>
                </div>
              )}
            </div>
          </Waypoint>
          {/* <div className='flex flex-row mt-5 '>
            <div className=" px-6 p-3 border rounded-lg flex flex-row" >
              <Menu menuButton={<MenuButton>India</MenuButton>} transition>
                <MenuItem>New File</MenuItem>
                <MenuItem>Save</MenuItem>
                <MenuItem>Close Window</MenuItem>
              </Menu>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
              </svg>
            </div>
            <div className="ml-10 px-6 p-3 border rounded-lg" >
              <Menu menuButton={<MenuButton>Pin code</MenuButton>} transition>
                <MenuItem>New File</MenuItem>
                <MenuItem>Save</MenuItem>
                <MenuItem>Close Window</MenuItem>
              </Menu>
            </div>
          </div> */}
          {/* <div className='flex flew-row sm:mt-5 w-full sm:flex-nowrap flex-wrap'>
            <div className='flex flex-row items-center mr-4 sm:mt-0 mt-5'>
              <img className='mr-1 lg:h-8 h-8' src='https://cdn-icons-png.flaticon.com/512/81/81566.png' />
              <div className='flex flex-col text-sm'>
                <div className='text-body font-normal'>Secure</div>
                <div className='text-accent font-bold'>Checkout</div>
              </div>
            </div>
            <div className='flex flex-row items-center mr-4 sm:mt-0 mt-5'>
              <img className='mr-1 lg:h-8 h-8' src='https://cdn-icons-png.flaticon.com/512/0/822.png' />
              <div className='flex flex-col text-sm'>
                <div className='text-body font-normal'>Satisfaction</div>
                <div className='text-accent font-bold'>Guaranteed</div>
              </div>
            </div>
            <div className='flex flex-row items-center sm:mt-0 mt-5'>
              <img className='mr-1 lg:h-8 h-8' src='https://cdn-icons-png.flaticon.com/512/4104/4104799.png' />
              <div className='flex flex-col text-sm'>
                <div className='text-body font-normal'>Privacy</div>
                <div className='text-accent font-bold'>Protected</div>
              </div>
            </div>

          </div>  */}
          {/* <div className="flew-row flex w-full flex-wrap sm:mt-5 sm:flex-nowrap">
            {badgesData &&
              badgesData?.badges?.map((badge: IBadge) => {
                return (
                  <CheckoutBadge
                    text={badge.text}
                    image={badge.imageUrl}
                    code={badge.code}
                  />
                );
                // return <CheckoutBadge text={badge.text} image={badge.imageUrl} code={badge.code} />;
              })}
          </div> */}

          <div className="w-full grid 3xl:grid-cols-6 2xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-4 grid-cols-2 sm:mt-5">
            {badgesData &&
              badgesData?.badges?.map((badge: IBadge) => {
                return (
                  <div className="py-2">
                    <CheckoutBadge
                      key={id}
                      text={badge.text}
                      image={badge.imageUrl}
                      code={badge.code}
                    />
                  </div>
                );
              })}
          </div>

          {!!categories?.length && (
            <CategoryBadges
              categories={categories}
              basePath={`/${type?.slug}/search`}
              onClose={closeModal}
            />
          )}

          {shop?.name && (
            <div className="mt-2 flex items-center">
              <span className="py-1 text-sm font-semibold capitalize text-heading ltr:mr-6 rtl:ml-6">
                {STATIC_CONTENT['text-sellers']}
              </span>

              <button
                onClick={() =>
                  navigate(`${ROUTES.SHOPS}/${encodeURIComponent(shop?.slug)}`)
                }
                className="text-sm tracking-wider text-accent underline transition hover:text-accent-hover hover:no-underline"
              >
                {shop?.name}
              </button>
            </div>
          )}
        </div>
      </div>

      <Element
        name="details"
        className=" border-b border-border-200 border-opacity-70 px-5 py-4 text-sm font-semibold lg:px-16 lg:py-8"
      >
        <h2 className="mb-2 text-2xl font-semibold tracking-tight text-heading">
          {STATIC_CONTENT['text-details']}
        </h2>
        { product && <p className="text-sm text-body">{parse(description)}</p>}
      </Element>
      <div className="border-b border-border-200 py-4">
        <div
          id="reviews"
          className="flex flex-row items-center justify-center font-semibold"
        >
          <h2 className="text-5xl">{rating}</h2>
          <div className="flex flex-row items-center justify-center pl-5">
            <ReactStars
              count={rating}
              // onChange={review.}
              value={rating}
              size={30}
              edit={false}
              isHalf={true}
              emptyIcon={<i className="far fa-star"></i>}
              halfIcon={<i className="fa fa-star-half-alt"></i>}
              fullIcon={<i className="fa fa-star"></i>}
              activeColor="#ffd700"
            />
          </div>
          <div className="pl-5">{ratingCount} Reviews</div>
        </div>
        {authorization ? (
          <div className="mt-4 flex flex-row items-center justify-center gap-4">
            <button onClick={onAdd} className="rounded-lg border p-2 px-6">
              Write A Review
            </button>
            <button className="rounded-lg border p-2 px-6">
              Ask A Qustion
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
      <SectionBlock>
        {product_reviews && <>{reviewCard(product_reviews)}</>}
      </SectionBlock>
      <hr className="mt-4" />

      {product?.related_products && product?.related_products?.length > 1 && (
        <div className="p-5 lg:p-14 lg:pt-8 xl:p-16 xl:pt-8">
          <RelatedProducts
            products={product?.related_products}
            currentProductId={id}
            gridClassName="lg:grid-cols-4 2xl:grid-cols-5 !gap-3"
          />
        </div>
      )}
    </article>
  );

  function reviewCard(reviews: ProductReview[]) {
    return reviews?.map(
      ({
        customer_name,
        rating,
        review_msg,
        id,
        review_date,
      }: ProductReview) => {
        return (
          <>
            <div
              key={id}
              className="mt-7 flex flex-col justify-between sm:flex-row"
            >
              <div className="flex flex-row">
                <div>
                  <div className="relative h-10 w-10 rounded-full border bg-accent">
                    <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] font-bold text-white">
                      {customer_name.toUpperCase()[0]}
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="font-bold md:text-lg">{customer_name}</h3>
                  <div className="flex h-[32px]  flex-row items-end">
                    {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="orange" className="w-6 h-6">
                  <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
                </svg> */}
                    <ReactStars
                      count={rating}
                      // onChange={
                      value={rating}
                      size={30}
                      edit={false}
                      isHalf={true}
                      emptyIcon={<i className="far fa-star"></i>}
                      halfIcon={<i className="fa fa-star-half-alt"></i>}
                      fullIcon={<i className="fa fa-star"></i>}
                      activeColor="#ffd700"
                    />
                  </div>
                  {/* <p className='text-gray-500 font-bold  pb-1'>Excellent Desgin all time</p> */}
                  <p className="text-sm font-semibold text-accent sm:pr-8 md:text-base">
                    {review_msg}
                  </p>
                  {/* <p className='text-accent font-semibold mt-1 sm:pr-8 md:text-base text-sm'> <span className='text-black'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 inline">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>  Share | Reviewed on:</span> Dual Toned Gold Bracelet</p> */}
                  {/* <p className=' pb-1'>{}</p> */}
                </div>
              </div>
              <div className="mt-4 flex flex-col justify-between text-xs font-semibold text-gray-600 sm:mt-0 md:text-base">
                <div className="flex items-end justify-end text-accent">
                  {review_date}
                </div>
                {/* <div className='sm:block text-accent flex gap-1 justify-end sm:pt-0 pt-1'>
              Was This Helpful?
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="md:w-6 md:h-6 w-4 h-4 mx-1 inline">
                <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
              </svg> 0
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="inline md:w-6 md:h-6 w-4 h-4 ml-2 mr-1">
                <path d="M15.73 5.25h1.035A7.465 7.465 0 0118 9.375a7.465 7.465 0 01-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 01-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.498 4.498 0 00-.322 1.672V21a.75.75 0 01-.75.75 2.25 2.25 0 01-2.25-2.25c0-1.152.26-2.243.723-3.218C7.74 15.724 7.366 15 6.748 15H3.622c-1.026 0-1.945-.694-2.054-1.715A12.134 12.134 0 011.5 12c0-2.848.992-5.464 2.649-7.521.388-.482.987-.729 1.605-.729H9.77a4.5 4.5 0 011.423.23l3.114 1.04a4.5 4.5 0 001.423.23zM21.669 13.773c.536-1.362.831-2.845.831-4.398 0-1.22-.182-2.398-.52-3.507-.26-.85-1.084-1.368-1.973-1.368H19.1c-.445 0-.72.498-.523.898.591 1.2.924 2.55.924 3.977a8.959 8.959 0 01-1.302 4.666c-.245.403.028.959.5.959h1.053c.832 0 1.612-.453 1.918-1.227z" />
              </svg> 0
            </div> */}
              </div>
            </div>
          </>
        );
      }
    );
  }
};

export default JewelleryProductDetails;
