import {
  Attachment,
  Author,
  AuthorPaginator,
  AuthorQueryOptions,
  AuthResponse,
  CategoryPaginator,
  CategoryQueryOptions,
  ChangePasswordUserInput,
  CheckoutVerificationInput,
  CouponPaginator,
  CouponQueryOptions,
  CreateContactUsInput,
  CreateOrderInput,
  CreateRefundInput,
  DownloadableFilePaginator,
  ForgotPasswordUserInput,
  LoginUserInput,
  Manufacturer,
  ManufacturerPaginator,
  ManufacturerQueryOptions,
  Order,
  OrderPaginator,
  OrderQueryOptions,
  OrderStatusPaginator,
  OtpLoginInputType,
  OTPResponse,
  PasswordChangeResponse,
  PopularProductQueryOptions,
  Product,
  ProductPaginator,
  ProductQueryOptions,
  QueryOptions,
  Refund,
  RefundPaginator,
  RegisterUserInput,
  ResetPasswordUserInput,
  SendOtpCodeInputType,
  Settings,
  Shop,
  ShopPaginator,
  ShopQueryOptions,
  SocialLoginInputType,
  TagPaginator,
  TagQueryOptions,
  Type,
  TypeQueryOptions,
  UpdateUserInput,
  User,
  VerifiedCheckoutData,
  VerifyCouponInputType,
  VerifyCouponResponse,
  VerifyForgotPasswordUserInput,
  VerifyOtpInputType,
  CartQueryOptions,
  CartCreate,
  NavigationQueryOptions,
  Navigation,
  PageContent,
  Slider,
  SliderQueryOptions,
  AutocompleteRequestObj,
  AutoCompleteResponse,
  Country,
  CheckoutResponse,
  PaymentModule,
  CheckoutReq,
  Zone,
  Cart,
  OrderInitializationInput,
  PaymentInitializationInput,
  CalculateOrderTotalResponse,
  ShippingQuotesReq,
  ShippingQuoteResponse,
  GroupProducts,
  CatalogResponsePaginator,
  ProductReview,
  ProductReviewReq,
  CatalogResponse,
  Testmonial,
  ContentBoxesQueryOptions,
  ContentBoxesPaginator,
  // HelloBar,
  CheckoutBadges,
  Inquiry,
  ProfileChangePasswordUserInput,
  BlogsReponse,
  Blog,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from './http-client';
import { HttpClient_Shopiana } from './http-client-2';
import { OTPVerifyResponse } from '@/types';
import { getStore, setLocalData } from './helper';
import { BLOGS_PER_PAGE, PRODUCTS_PER_PAGE } from '../client/variables';
import {
  DEFAULT_STORE_CODE,
  DEFUALT_ITEM_COUNT,
  DEFUALT_LAYOUT_TYPE,
  TYPE_DATA,
  TYPE_DEFUALT_INDEX,
} from '../utils/constants';

class Client {
  products = {
    all: ({
      type,
      categories,
      name,
      shop_id,
      author,
      // manufacturer,
      min_price,
      max_price,
      tags,
      store,
      manufacturers,
      categorySlugs,
      // sortedBy, /
      orderBy,
      criteriaOrderByField,
      count,
      ...params
    }: Partial<ProductQueryOptions>) => {
      // if (window) {
      return HttpClient_Shopiana.get<ProductPaginator>(
        API_ENDPOINTS.PRODUCTS,
        {
          store: DEFAULT_STORE_CODE,
          count: count ?? DEFUALT_ITEM_COUNT,
          page: params.page,
          limit: null,
          search: name,
          manufacturers,
          // categorySlugs,
          ...(categorySlugs && categorySlugs.length && { categorySlugs }),
          // sortedBy,
          // orderBy: orderBy ?? "",
          // criteriaOrderByField
        }
      );
      // } else {
      //   return [];
      // }
    },
    popular: ({
      type,
      categories,
      name,
      shop_id,
      author,
      manufacturer,
      min_price,
      max_price,
      tags,
      ...params
    }: Partial<ProductQueryOptions>) => {
      return HttpClient_Shopiana.get<ProductPaginator>(
        API_ENDPOINTS.PRODUCTS +
        API_ENDPOINTS.GROUP +
        API_ENDPOINTS.FEATURED_ITEM,
        {
          ...params,
          manufacturer,
          store: getStore(),
          count: 10,
          page: params.page,
          orderBy: null,
          sortedBy: null,
          limit: null,
          categorySlug: categories,
        }
      );
    },

    get: (slug: string) =>
      HttpClient_Shopiana.get<Product>(
        `${API_ENDPOINTS.PRODUCTS}${API_ENDPOINTS.SLUG}/${slug}?store=${DEFAULT_STORE_CODE}`
      ),
    relatedProducts: (id: string, store?: string) =>
      HttpClient_Shopiana.get<Product[]>(
        `${API_ENDPOINTS.PRODUCTS}/${id}${API_ENDPOINTS.RELATED}?store=${store}`
      ),
    productGroups: (store?: any) =>
      HttpClient_Shopiana.get<GroupProducts>(
        `${API_ENDPOINTS.PRODUCTS}${API_ENDPOINTS.GROUPS}?store=${store ? store : getStore()}`
      ),
    getGroupProductsByCode: (code: string) =>
      HttpClient_Shopiana.get<GroupProducts>(
        `${API_ENDPOINTS.PRODUCTS}${API_ENDPOINTS.GROUP
        }/${code}?store=${getStore()}`
      ),
  };
  categories = {
    all: ({ type, store, ...params }: Partial<CategoryQueryOptions>) => {
      // if (window) {
      return HttpClient_Shopiana.get<CategoryPaginator>(
        API_ENDPOINTS.CATEGORIES,
        {
          // searchJoin: 'and',
          ...params,
          ...(type && {
            search: HttpClient_Shopiana.formatSearchParams({ type }),
          }),
          store: DEFAULT_STORE_CODE,
          count: 1000,
          limit: null,
          parent: null,
          search: null,
        }
      );
      // } else {
      //   return [];
      // }
    },
  };
  cart = {
    get: (cartID: string | undefined | null) =>
      HttpClient_Shopiana.get<CartCreate>(
        `${API_ENDPOINTS.CART}/${cartID}?store=${DEFAULT_STORE_CODE}`
      ),
    getAuthWithoutCart: (cartID: string | undefined | null) =>
      HttpClient_Shopiana.get<CartCreate>(
        `${API_ENDPOINTS.AUTH}${API_ENDPOINTS.CUSTOMER}${API_ENDPOINTS.CART
        }?store=${DEFAULT_STORE_CODE}`
      ),
    getAuthWithCart: (cartID: string | undefined | null) =>
      HttpClient_Shopiana.get<CartCreate>(
        `${API_ENDPOINTS.AUTH}${API_ENDPOINTS.CUSTOMER}${API_ENDPOINTS.CART
        }?store=${DEFAULT_STORE_CODE}&cart=${cartID}`
      ),
    create: (input: Partial<CartQueryOptions>) =>
      HttpClient_Shopiana.post<CartCreate>(
        API_ENDPOINTS.CART + `?store=${DEFAULT_STORE_CODE}`,
        input
      ),
    update: (
      input: Partial<CartQueryOptions>,
      cartId: string | undefined | null
    ) => {
      console.log('api call cart update');

      return HttpClient_Shopiana.put<CartCreate>(
        API_ENDPOINTS.CART + '/' + cartId + `?store=${DEFAULT_STORE_CODE}`,
        input
      )
    },

    delete: (
      product: number | string | undefined | null,
      cartId: string | undefined | null
    ) =>
      HttpClient_Shopiana.delete<CartCreate>(
        API_ENDPOINTS.CART +
        '/' +
        cartId +
        '/product/' +
        product +
        '?store=' +
        DEFAULT_STORE_CODE +
        '&body=true'
      ),
    getAuthCart: (cartCode: string) =>
      HttpClient_Shopiana.get<Cart>(
        API_ENDPOINTS.AUTH +
        API_ENDPOINTS.CUSTOMER +
        API_ENDPOINTS.CART +
        '?store=' +
        DEFAULT_STORE_CODE +
        '&cart=' +
        cartCode
      ),
    getGuestCart: (cartCode: string) =>
      HttpClient_Shopiana.get<Cart>(
        API_ENDPOINTS.CART + '/' + cartCode + '?store=' + DEFAULT_STORE_CODE
      ),
  };
  tags = {
    all: (params: Partial<TagQueryOptions>) => ({} as Partial<TagQueryOptions>),
    // HttpClient.get<TagPaginator>(API_ENDPOINTS.TAGS, params),
  };
  types = {
    all: (params?: Partial<TypeQueryOptions>) => TYPE_DATA,
    get: (slug: string) => TYPE_DATA[TYPE_DEFUALT_INDEX],
    // HttpClient.get<Type>(`${API_ENDPOINTS.TYPES}/${slug}`),
  };
  shops = {
    all: (params: Partial<ShopQueryOptions>) => [],
    // HttpClient.get<ShopPaginator>(API_ENDPOINTS.SHOPS, params),
    get: (slug: string) => { },
    // HttpClient.get<Shop>(`${API_ENDPOINTS.SHOPS}/${slug}`),
  };
  authors = {
    all: (params: Partial<AuthorQueryOptions>) =>
      HttpClient.get<AuthorPaginator>(API_ENDPOINTS.AUTHORS, params),
    top: (params: Pick<QueryOptions, 'limit'>) =>
      HttpClient.get<Author[]>(API_ENDPOINTS.AUTHORS_TOP, params),
    get: (slug: string) =>
      HttpClient.get<Author>(`${API_ENDPOINTS.AUTHORS}/${slug}`),
  };
  manufacturers = {
    all: (params: Partial<ManufacturerQueryOptions>) => { },
    // HttpClient.get<ManufacturerPaginator>(
    //   API_ENDPOINTS.MANUFACTURERS,
    //   params
    // ),
    top: (params: Pick<QueryOptions, 'limit'>) =>
      HttpClient_Shopiana.get<Manufacturer[]>(
        API_ENDPOINTS.MANUFACTURERS,
        {...params, store: DEFAULT_STORE_CODE}
      ),
    get: (slug: string) => { },
    // HttpClient.get<Manufacturer>(`${API_ENDPOINTS.MANUFACTURERS}/${slug}`),
  };
  coupons = {
    all: (params: Partial<CouponQueryOptions>) => { },
    // HttpClient.get<CouponPaginator>(API_ENDPOINTS.COUPONS, params),
    verify: ({ cartCode, code }: VerifyCouponInputType) =>
      HttpClient_Shopiana.post<VerifyCouponResponse>(
        `${API_ENDPOINTS.CART}/${cartCode}${API_ENDPOINTS.PROMO
        }/${code}?store=${getStore()}`,
        {}
      ),
    remove: (cartCode: any) => {
      return HttpClient_Shopiana.put<any>(`${API_ENDPOINTS.CART}/${cartCode}${API_ENDPOINTS.PROMO
        }?store=${getStore()}`, {})
    }
  };
  orders = {
    all: (params: Partial<OrderQueryOptions>) =>
      HttpClient_Shopiana.get<OrderPaginator>(
        `${API_ENDPOINTS.AUTH}${API_ENDPOINTS.ORDERS}?store=${DEFAULT_STORE_CODE}`,
        params
      ),
    get: (tracking_number: string) =>
      HttpClient_Shopiana.get<Order>(
        `${API_ENDPOINTS.AUTH + API_ENDPOINTS.ORDERS}/${tracking_number}?store=${DEFAULT_STORE_CODE}`
      ),
    getGuest: (tracking_number: string) =>
      HttpClient_Shopiana.get<Order>(
        `${API_ENDPOINTS.ORDER}/${tracking_number}?store=${DEFAULT_STORE_CODE}`
      ),
    create: (input: CreateOrderInput) => { },
    // HttpClient.post<Order>(API_ENDPOINTS.ORDERS, input),
    statuses: (params: Pick<QueryOptions, 'limit'>) => { },
    // HttpClient.get<OrderStatusPaginator>(API_ENDPOINTS.ORDERS_STATUS, params),
    refunds: (params: Pick<QueryOptions, 'limit'>) => { },
    // HttpClient.get<RefundPaginator>(API_ENDPOINTS.ORDERS_REFUNDS, params),
    createRefund: (input: CreateRefundInput) => { },
    // HttpClient.post<Refund>(API_ENDPOINTS.ORDERS_REFUNDS, input),

    downloadable: (query?: OrderQueryOptions) => { },
    // HttpClient.get<DownloadableFilePaginator>(
    //   API_ENDPOINTS.ORDERS_DOWNLOADS,
    //   query
    // ),
    verify: (input: CheckoutVerificationInput) => { },
    // HttpClient.post<VerifiedCheckoutData>(
    //   API_ENDPOINTS.ORDERS_CHECKOUT_VERIFY,
    //   input
    // ),
    generateDownloadLink: (input: { digital_file_id: string }) => '',
    // HttpClient.post<string>(
    //   API_ENDPOINTS.GENERATE_DOWNLOADABLE_PRODUCT_LINK,
    //   input
    // ),
    calculateOrderTotal: (reqUrl: string) =>
      HttpClient_Shopiana.get<CalculateOrderTotalResponse>(reqUrl),

    // calculateAuthOrderTotal: ({ cartId }: CalculateAuthOrderTotalParams) => HttpClient_Shopiana.get<any>(API_ENDPOINTS.AUTH + API_ENDPOINTS.CART + cartId + '/' + API_ENDPOINTS.TOTAL),
    // // http://65.21.199.181:8080/api/v1/auth/cart/1212/total
    // calculateGuestOrderTotal: ({ cartId }: CalculateAuthOrderTotalParams) => HttpClient_Shopiana.get<any>(API_ENDPOINTS.AUTH + API_ENDPOINTS.CART + cartId + '/' + API_ENDPOINTS.TOTAL)
  };
  users = {
    me: () =>
      HttpClient_Shopiana.get<User>(
        API_ENDPOINTS.AUTH + API_ENDPOINTS.CUSTOMER + API_ENDPOINTS.PROFILE + `?store=${DEFAULT_STORE_CODE}`
      ),
    update: (user: UpdateUserInput) =>
      HttpClient_Shopiana.patch<User>(
        `${API_ENDPOINTS.AUTH}${API_ENDPOINTS.CUSTOMER}?store=${DEFAULT_STORE_CODE}`,
        user
      ),
    login: (input: LoginUserInput) =>
      HttpClient_Shopiana.post<AuthResponse>(
        API_ENDPOINTS.CUSTOMER + API_ENDPOINTS.LOGIN + '?store=' + DEFAULT_STORE_CODE,
        input
      ),
    socialLogin: (input: SocialLoginInputType) =>
      HttpClient.post<AuthResponse>(API_ENDPOINTS.SOCIAL_LOGIN, input),
    sendOtpCode: (input: SendOtpCodeInputType) =>
      HttpClient_Shopiana.post<OTPResponse>(
        API_ENDPOINTS.CUSTOMER +
        API_ENDPOINTS.GENERATE +
        API_ENDPOINTS.OTP +
        '?store=' +
        DEFAULT_STORE_CODE,
        input
      ),
    verifyOtpCode: (input: VerifyOtpInputType) =>
      HttpClient_Shopiana.post<OTPVerifyResponse>(
        API_ENDPOINTS.CUSTOMER +
        API_ENDPOINTS.VALIDATE +
        API_ENDPOINTS.OTP +
        '?store=' +
        DEFAULT_STORE_CODE,
        input
      ),
    OtpLogin: (input: OtpLoginInputType) =>
      HttpClient_Shopiana.post<AuthResponse>(API_ENDPOINTS.OTP_LOGIN, input),
    register: (input: RegisterUserInput) =>
      HttpClient_Shopiana.post<AuthResponse>(
        API_ENDPOINTS.CUSTOMER +
        API_ENDPOINTS.USERS_REGISTER +
        '?store=' +
        DEFAULT_STORE_CODE,
        input
      ),
    forgotPassword: (input: ForgotPasswordUserInput) => { },
    // HttpClient.post<PasswordChangeResponse>(
    //   API_ENDPOINTS.USERS_FORGOT_PASSWORD,
    //   input
    // ),
    verifyForgotPasswordToken: (input: VerifyForgotPasswordUserInput) => { },
    // HttpClient.post<PasswordChangeResponse>(
    //   API_ENDPOINTS.USERS_VERIFY_FORGOT_PASSWORD_TOKEN,
    //   input
    // ),
    resetPassword: (input: ResetPasswordUserInput) => { },
    // HttpClient.post<PasswordChangeResponse>(
    //   API_ENDPOINTS.USERS_RESET_PASSWORD,
    //   input
    // ),
    // changePassword: (input: ChangePasswordUserInput) => {},
    // HttpClient.post<PasswordChangeResponse>(
    //   API_ENDPOINTS.USERS_CHANGE_PASSWORD,
    //   input
    // ),
    // logout: () => HttpClient.post<boolean>(API_ENDPOINTS.USERS_LOGOUT, {}),

    profileChangePassword: (input: ProfileChangePasswordUserInput) =>
      HttpClient_Shopiana.put<PasswordChangeResponse>(
        API_ENDPOINTS.CUSTOMER +
        API_ENDPOINTS.PASSWORD +
        '?store=' +
        DEFAULT_STORE_CODE,
        input
      ),

    logout: () => true,
    deleteAddress: ({ id }: { id: string }) => { },
    // HttpClient.delete<boolean>(`${API_ENDPOINTS.USERS_ADDRESS}/${id}`),
    subscribe: (input: { email: string }) => { },
    // HttpClient.post<any>(API_ENDPOINTS.USERS_SUBSCRIBE_TO_NEWSLETTER, input),
    contactUs: (input: CreateContactUsInput) =>
      HttpClient_Shopiana.post<any>(
        `${API_ENDPOINTS.CONTACT}?store=${DEFAULT_STORE_CODE}`,
        input
      ),
    // HttpClient.post<any>(API_ENDPOINTS.USERS_CONTACT_US, input),
    exists: ({ userName }: { userName: number }) =>
      HttpClient_Shopiana.get<any>(
        `${API_ENDPOINTS.CUSTOMER}${API_ENDPOINTS.USERNAME}/${userName}${API_ENDPOINTS.EXISTS}?store=${DEFAULT_STORE_CODE}`
      ),
    authUserAddressUpdate: (data: any) =>
      HttpClient_Shopiana.patch<any>(
        `${API_ENDPOINTS.AUTH}${API_ENDPOINTS.CUSTOMER}${API_ENDPOINTS.USERS_ADDRESS
        }?store=${DEFAULT_STORE_CODE}`,
        data
      ),
  };
  navigation = {
    all: (params?: Partial<NavigationQueryOptions>) =>
      HttpClient_Shopiana.get<Navigation[]>(
        API_ENDPOINTS.CONTENT +
        API_ENDPOINTS.PAGE +
        API_ENDPOINTS.NAVIGATION +
        '/' +
        `?store=${DEFAULT_STORE_CODE}`,
        params
      ),
    get: (slug: string, store: string) =>
      HttpClient_Shopiana.get<PageContent>(
        `${API_ENDPOINTS.CONTENT + API_ENDPOINTS.PAGES}/${slug}?store=${store}`
      ),
  };
  settings = {
    //FIXME: check this async function
    all: async ({ ...params }) => {
      if (typeof window !== 'undefined') {
        return HttpClient_Shopiana.get<Settings>(
          API_ENDPOINTS.CONFIG + API_ENDPOINTS.INITIAL + API_ENDPOINTS.URL,
          {
            store: DEFAULT_STORE_CODE,
          }
        );
      } else if (params.host) {
        return HttpClient_Shopiana.get<Settings>(
          API_ENDPOINTS.CONFIG + API_ENDPOINTS.INITIAL + API_ENDPOINTS.URL,
          {
            store: DEFAULT_STORE_CODE,
          }
        );
      }
      //   HttpClient_Shopiana.get<Settings>(API_ENDPOINTS.CONFIG + API_ENDPOINTS.INITIAL + API_ENDPOINTS.URL, {
      //   url: (typeof window !== "undefined") ? decodeURI(window?.location?.protocol + "//" + window?.location?.host) : "http://" + params.host //"http://localhost:3000"
      // })
    },
    upload: (input: File[]) => {
      let formData = new FormData();
      input.forEach((attachment) => {
        formData.append('attachment[]', attachment);
      });
      return [];
      //  HttpClient.post<Attachment[]>(API_ENDPOINTS.UPLOADS, formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });
    },
    // pageNavMenus: () => HttpClient_Shopiana.get<PageNavigationItem[]>(API_ENDPOINTS.CONTENT + API_ENDPOINTS.PAGE + API_ENDPOINTS.NAVIGATION, {
    //   store: getStore(),
    // }),
    // getPage: (code: string) => HttpClient_Shopiana.get<PageContent>(API_ENDPOINTS.CONTENT + API_ENDPOINTS.PAGES + `/${code}`, {
    //   store: getStore(),
    // })
  };
  slider = {
    get: (params?: Partial<SliderQueryOptions>) =>
      HttpClient_Shopiana.get<Slider>(
        API_ENDPOINTS.STORE + API_ENDPOINTS.SLIDER,
        params
      ),
  };
  search = {
    autocomplete: (body: AutocompleteRequestObj) =>
      HttpClient_Shopiana.post<AutoCompleteResponse>(
        API_ENDPOINTS.SEARCH + API_ENDPOINTS.AUTOCOMPLETE,
        body,
        {
          store: getStore(),
        }
      ),
  };
  country = {
    get: () => HttpClient_Shopiana.get<Country[]>(`${API_ENDPOINTS.COUNTRY}`),
  };
  states = {
    get: (countryCode: string) =>
      HttpClient_Shopiana.get<Zone[]>(
        `${API_ENDPOINTS.ZONES}?code=${countryCode}`
      ),
  };
  checkout = {
    authcheckout: (data: { cartCode: string; data: CheckoutReq }) =>
      HttpClient_Shopiana.post<CheckoutResponse>(
        `${API_ENDPOINTS.AUTH}${API_ENDPOINTS.CART}/${data.cartCode}${API_ENDPOINTS.CHECKOUT
        }?store=${DEFAULT_STORE_CODE}`,
        data.data
      ),
    guestcheckout: (data: { cartCode: string; data: CheckoutReq }) =>
      HttpClient_Shopiana.post<CheckoutResponse>(
        `${API_ENDPOINTS.CART}/${data.cartCode}${API_ENDPOINTS.CHECKOUT
        }?store=${DEFAULT_STORE_CODE}`,
        data.data
      ),
  };
  paymentmodules = {
    get: () =>
      HttpClient_Shopiana.get<PaymentModule[]>(
        `${API_ENDPOINTS.MODULES}${API_ENDPOINTS.PAYMENT}?store=${DEFAULT_STORE_CODE}`
      ),
  };
  onlinePayment = {
    guestOrderInit: (input: OrderInitializationInput) => {
      return HttpClient_Shopiana.post<number>(
        `${API_ENDPOINTS.CART}/${input.cartId}${API_ENDPOINTS.CHECKOUT}${API_ENDPOINTS.DEFINITION
        }?store=${DEFAULT_STORE_CODE}`,
        input.data
      );
    },
    authOrderInit: (input: OrderInitializationInput) => {
      return HttpClient_Shopiana.post<number>(
        `${API_ENDPOINTS.AUTH}${API_ENDPOINTS.CART}/${input.cartId}${API_ENDPOINTS.CHECKOUT
        }${API_ENDPOINTS.DEFINITION}?store=${DEFAULT_STORE_CODE}`,
        input.data
      );
    },
    guestPaymentInitialization: (input: PaymentInitializationInput) => {
      return HttpClient_Shopiana.post(
        `${API_ENDPOINTS.CART}/${input.cartId}${API_ENDPOINTS.PAYMENT}${API_ENDPOINTS.INIT
        }?store=${DEFAULT_STORE_CODE}`,
        input.data
      );
    },
    authPaymentInitialization: (input: PaymentInitializationInput) => {
      return HttpClient_Shopiana.post(
        `${API_ENDPOINTS.AUTH}${API_ENDPOINTS.CART}/${input.cartId}${API_ENDPOINTS.PAYMENT
        }${API_ENDPOINTS.INIT}?store=${DEFAULT_STORE_CODE}`,
        input.data
      );
    },
  };
  shipping = {
    guestShippingQuotes: (cartId: string, data: ShippingQuotesReq) =>
      HttpClient_Shopiana.post<ShippingQuoteResponse>(
        API_ENDPOINTS.CART +
        '/' +
        cartId +
        API_ENDPOINTS.SHIPPING +
        '?store=' +
        DEFAULT_STORE_CODE,
        data
      ),
    authShippingQuotes: (cartId: string) =>
      HttpClient_Shopiana.get<ShippingQuoteResponse>(
        API_ENDPOINTS.AUTH +
        API_ENDPOINTS.CART +
        '/' +
        cartId +
        API_ENDPOINTS.SHIPPING +
        '?store=' +
        DEFAULT_STORE_CODE
      ),
  };
  catalog = {
    all: ({ store, ...params }: Partial<OrderQueryOptions>) =>
      HttpClient_Shopiana.get<CatalogResponse>(
        `${API_ENDPOINTS.CATALOGS}${API_ENDPOINTS.DEFINITIONS
        }?store=${store ? store : getStore()}`,
        params
      ),
  };
  //for new review
  productReviews = {
    get: (id: number, store: string) =>
      HttpClient_Shopiana.get<ProductReview[]>(
        `${API_ENDPOINTS.PRODUCTS}/${id}${API_ENDPOINTS.REVIEWS}?store=${store}`
      ),
    createReview: (data: ProductReviewReq) =>
      HttpClient_Shopiana.post<any>(
        `${API_ENDPOINTS.AUTH}${API_ENDPOINTS.PRODUCTS}/${data.productId}${API_ENDPOINTS.REVIEWS
        }?store=${getStore()}`,
        data
      ),
  };
  // for testmonials
  testmonial = {
    get: () =>
      HttpClient_Shopiana.get<Testmonial>(
        `${API_ENDPOINTS.PLUGIN}${API_ENDPOINTS.STORE}${API_ENDPOINTS.REVIEWS
        }?store=${getStore()}`
      ),
  };
  contentboxes = {
    all: ({ type, ...params }: Partial<any>) => {
      return HttpClient_Shopiana.get<ContentBoxesPaginator>(
        `${API_ENDPOINTS.CONTENT}${API_ENDPOINTS.BOXES}?store=${getStore()}`,
        {
          // searchJoin: 'and',
          ...params,
          // ...(type && {
          //   search: HttpClient_Shopiana.formatSearchParams({ type }),
          // }),
          store: getStore(),
          count: 1000,
          limit: null,
          parent: null,
          search: null,
        }
      );
    },
  };
  // for hellobar
  helloBar = {
    get: () =>
      HttpClient_Shopiana.get<any>(
        `${API_ENDPOINTS.PLUGIN}${API_ENDPOINTS.HELLOBAR}?store=${getStore()}`
      ),
  };

  // for blogs
  blog = {
    all: (params?: Partial<any>) =>
      HttpClient_Shopiana.get<BlogsReponse>(
        `${API_ENDPOINTS.CONTENT}${API_ENDPOINTS.BOXES}?contentType=BLOG`,
        {
          ...params,
          count: BLOGS_PER_PAGE,
          page: params?.page,
          status: 'publish',
          store: getStore()
        }
      ),
    get: (code: string) =>
      HttpClient_Shopiana.get<Blog>(
        `${API_ENDPOINTS.CONTENT}${API_ENDPOINTS.BLOG}/${code}`,
        {
          store: getStore()
        })
  };

  // for checkout badges
  // checkoutBadges = {
  //   get: (store: string) =>
  //     HttpClient_Shopiana.get<CheckoutBadges>(
  //       `${API_ENDPOINTS.PLUGIN}${API_ENDPOINTS.BADGES}?store=${store}`
  //     ),
  // };

  // FOR inqury
  inquiry = {
    createInquiry: (data: Inquiry) =>
      HttpClient_Shopiana.post<any>(
        `${API_ENDPOINTS.INQUIRY}?store=${getStore()}`,
        data
      ),
  };
  // for checkout badges
  checkoutBadges = {
    get: (store: string) => HttpClient_Shopiana.get<CheckoutBadges>(`${API_ENDPOINTS.PLUGIN}${API_ENDPOINTS.BADGES}?store=${store}`)
  }
}

export default new Client();
