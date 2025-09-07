import React from 'react'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import MySubscriptionView from "../../../components/billing/MySubscriptionView";
import {
    QrCentraalCooKieAccessToken,
    QrCentraalHasActiveSubscriptionPlan,
    redirectToLogin,
    setCookieFromSSR
} from "../../../utils/cookie";
import {addressApi, paymentApi, subscriptionApi, subscriptionPublicApi} from "../../../core_api";
import {handleApi, handleError} from "../../../common_api";

export default function BillingIndex({activeSubscription, payments}) {
    return (<MySubscriptionView activeSubscription={activeSubscription} payments={payments}/>)
}

export const getServerSideProps = async (ctx) => {
    let accessToken = ctx.req.cookies[QrCentraalCooKieAccessToken]
    if (!accessToken) {
        return redirectToLogin()
    }

    let subscriptionApiClient = subscriptionApi(accessToken)
    let paymentApiClient = paymentApi(accessToken)

    let activeSubscription = null
    let payments = []

    try {
        let activeSubscriptionResp = await handleApi(ctx, subscriptionApiClient.findActiveSubscription('QR_CENTRAAL'))
        if (activeSubscriptionResp.redirect) {
            return activeSubscriptionResp
        }

        activeSubscription = JSON.parse(JSON.stringify(activeSubscriptionResp.data))
    } catch (error) {
        if (error.response && error.response.status !== 404) {
            console.error(error)
            return handleError(ctx, error)
        }
    }

    try {
        let subscriptionResp = await handleApi(ctx, subscriptionApiClient.hasUsableSubscriptionPlan("QR_CENTRAAL"))
        if (subscriptionResp.redirect) {
            return subscriptionResp
        }
        let hasUsableSubscriptionPlan = subscriptionResp.data
        setCookieFromSSR(ctx, QrCentraalHasActiveSubscriptionPlan, hasUsableSubscriptionPlan)
    } catch (error) {
        console.error(error)
        return handleError(ctx, error)
    }

    try {
        let paymentsResp = await handleApi(ctx, paymentApiClient.listPayments(0, 10))
        if (paymentsResp.redirect) {
            return paymentsResp
        }
        payments = JSON.parse(JSON.stringify(paymentsResp.data))
    } catch (error) {
        console.error(error)
        return handleError(ctx, error)
    }

    // Pass data to the page via props
    return {
        props: {
            activeSubscription: activeSubscription,
            payments: payments
        }
    }
}
