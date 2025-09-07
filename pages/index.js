import React from 'react'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import {redirectToLogin, QrCentraalCooKieAccessToken} from '../utils/cookie'

export default function Index() {
    return (<></>)
}

export const getServerSideProps = async (ctx) => {
    let accessToken = ctx.req.cookies[QrCentraalCooKieAccessToken]
    if (!accessToken) {
        return redirectToLogin()
    }

    // Pass data to the page via props
    // return {
    //     props: {}
    // }
    return {
        redirect: {
            destination: '/dashboard/qr-codes/create',
            permanent: false
        }
    }
}
