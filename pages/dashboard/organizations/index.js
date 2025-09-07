import React from 'react'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import {
    redirectToLogin,
    QrCentraalCooKieAccessToken,
    QrCentraalHasActiveSubscriptionPlan,
    redirectToSubscriptionRenew
} from '../../../utils/cookie'
import OraganizationList from "../../../components/organizations/OraganizationList";

export default function Index() {
    return (<OraganizationList/>)
}

export const getServerSideProps = async (ctx) => {
    let accessToken = ctx.req.cookies[QrCentraalCooKieAccessToken]
    if (!accessToken) {
        return redirectToLogin()
    }

    let hasUsableSubscription = ctx.req.cookies[QrCentraalHasActiveSubscriptionPlan]
    if (hasUsableSubscription === 'false') {
        return redirectToSubscriptionRenew()
    }

    // Pass data to the page via props
    return {
        props: {}
    }
}
