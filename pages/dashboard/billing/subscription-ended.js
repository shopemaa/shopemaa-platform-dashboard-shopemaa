import React from 'react'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import {
    redirectToLogin,
    QrCentraalCooKieAccessToken,
    redirectToOrgList,
    QrCentraalHasActiveSubscriptionPlan, setCookieFromSSR
} from '../../../utils/cookie'
import SubscriptionEndedView from "../../../components/billing/SubscriptionEndedView";
import {subscriptionApi} from "../../../core_api";
import {handleApi, handleError} from "../../../common_api";

export default function SubscriptionEnded({hasUsableSubscriptionPlan}) {
    return (<SubscriptionEndedView hasUsableSubscriptionPlan={hasUsableSubscriptionPlan}/>)
}

export const getServerSideProps = async (ctx) => {
    let accessToken = ctx.req.cookies[QrCentraalCooKieAccessToken]
    if (!accessToken) {
        return redirectToLogin()
    }

    let subscriptionApiClient = subscriptionApi(accessToken)
    let hasUsableSubscriptionPlan = false

    try {
        let subscriptionResp = await handleApi(ctx, subscriptionApiClient.hasUsableSubscriptionPlan("QR_CENTRAAL"))
        if (subscriptionResp.redirect) {
            return subscriptionResp
        }
        hasUsableSubscriptionPlan = subscriptionResp.data
        console.log('hasUsableSubscriptionPlan: ', hasUsableSubscriptionPlan)
    } catch (error) {
        console.error(error)
        return handleError(ctx, error)
    }

    setCookieFromSSR(ctx, QrCentraalHasActiveSubscriptionPlan, hasUsableSubscriptionPlan)

    if (hasUsableSubscriptionPlan) {
        return redirectToOrgList()
    }

    // Pass data to the page via props
    return {
        props: {
            hasUsableSubscriptionPlan: hasUsableSubscriptionPlan
        }
    }
}
