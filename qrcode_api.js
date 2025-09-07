import {
    ApiClient,
    ProjectApi,
    BusinessCardApi,
    QrCodeApi,
    CampaignApi,
    AnalyticsApi,
    CampaignPublicApi,
    MagicApi,
    CustomSlugApi,
    UniTextApi, ProjectPublicApi, OnePageApi
} from './clients/qrcodesvc/src'

const BASE_URL = process.env.NEXT_PUBLIC_QRCODE_API_URL ?? '';
const API_VERSION = 'v1';

const createClient = (token) => {
    const client = new ApiClient(BASE_URL);
    if (token) {
        client.defaultHeaders.Authorization = `Bearer ${token}`;
    }
    return client;
};

export const businessCardApi = (token) => new BusinessCardApi(createClient(token));
export const uniTextApi = (token) => new UniTextApi(createClient(token));
export const qrCodeConfigApi = (token) => new QrCodeApi(createClient(token));
export const projectApi = (token) => new ProjectApi(createClient(token));
export const campaignApi = (token) => new CampaignApi(createClient(token));
export const analyticsApi = (token) => new AnalyticsApi(createClient(token));
export const magicApi = (token) => new MagicApi(createClient(token));
export const customSlugApi = (token) => new CustomSlugApi(createClient(token));
export const onePageApi = (token) => new OnePageApi(createClient(token));

export const projectPublicApi = () => new ProjectPublicApi(createClient());
export const campaignPublicApi = () => new CampaignPublicApi(createClient());

export const getQrCodeSvcUrl = () => `${BASE_URL}/secure/${API_VERSION}`;
export const getQrCodeSvcPublicUrl = () => `${BASE_URL}/${API_VERSION}`;
