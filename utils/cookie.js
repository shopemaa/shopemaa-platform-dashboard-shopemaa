import Cookies from 'js-cookie'
import {setCookie} from 'cookies-next';

export const QrCentraalCooKieAccessToken = 'qrCentraalAccessToken'
export const QrCentraalCooKieRefreshToken = 'qrCentraalRefreshToken'
export const QrCentraalCookieExpireAt = 'qrCentraalExpireAt'
export const QrCentraalHasActiveSubscriptionPlan = 'qrCentraalHasActiveSubscriptionPlan'

export const QrCentraalCooKieUser = 'qrCentraalUser'
export const QrCentraalOrgId = 'qrCentraalOrgId'

export const QrCentraalDistinctIdKey = 'qrCentraalDistinctId'

export const hasAccessToken = (token) => {
    return token !== undefined && token !== null &&
        token !== 'null' && token !== 'undefined'
}

export const hasRefreshToken = (token) => {
    return token !== undefined && token !== null &&
        token !== 'null' && token !== 'undefined'
}

export const logout = (req) => {
    Cookies.remove(QrCentraalCooKieAccessToken)
    Cookies.remove(QrCentraalCooKieRefreshToken)
    Cookies.remove(QrCentraalCookieExpireAt)
    Cookies.remove(QrCentraalOrgId)

    if (hasCtx(req)) {
        req.cookies.clear()
    }
}

export const redirectToLogin = () => {
    return {
        redirect: {
            destination: '/login?refresh=true',
            permanent: false
        }
    }
}

export const redirectToSubscriptionRenew = () => {
    return {
        redirect: {
            destination: '/dashboard/billing/subscription-ended',
            permanent: false
        }
    }
}

export const redirectToOrgList = () => {
    return {
        redirect: {
            destination: '/dashboard/organizations',
            permanent: false
        }
    }
}

export const hasCtx = (ctx) => {
    return ctx !== null && ctx !== undefined
}

export const redirectToErr500 = () => {
    return {
        redirect: {
            destination: `/500`,
            permanent: false
        }
    }
}

export const redirectToErr404 = () => {
    return {
        redirect: {
            destination: `/404`,
            permanent: false
        }
    }
}

export const setCookieFromSSR = (ctx, name, value) => {
    setCookie(name, value, {
        req: ctx.req,
        res: ctx.res,
        path: '/'
    })
}
