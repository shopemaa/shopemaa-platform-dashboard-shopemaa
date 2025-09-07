import {
    ApiClient,
    UserApi,
    AddressApi,
    MultimediaApi,
    OrganizationApi,
    SubscriptionApi,
    SubscriptionPublicApi,
    UserPublicApi, PaymentApi,
} from './clients/coresvc/src'

export const coreApiUrl = () => {
    return process.env.NEXT_PUBLIC_CORE_API_URL
}

export const createApiClient = (token) => {
    const apiUrl = coreApiUrl();
    const client = new ApiClient(apiUrl);

    if (token) {
        client.defaultHeaders['Authorization'] = 'Bearer ' + token;
    }

    return client;
};

export const userApi = (token) => new UserApi(createApiClient(token));
export const userPublicApi = () => new UserPublicApi(createApiClient());
export const addressApi = (token) => new AddressApi(createApiClient(token));
export const multimediaApi = (token) => new MultimediaApi(createApiClient(token));
export const organizationApi = (token) => new OrganizationApi(createApiClient(token));
export const subscriptionApi = (token) => new SubscriptionApi(createApiClient(token));
export const subscriptionPublicApi = () => new SubscriptionPublicApi(createApiClient());
export const paymentApi = (token) => new PaymentApi(createApiClient(token));

export const getSpaceUrl = () => `${process.env.NEXT_PUBLIC_SPACE_URL}`;
