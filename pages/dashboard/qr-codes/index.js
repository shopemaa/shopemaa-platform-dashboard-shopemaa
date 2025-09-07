import React, {useState} from 'react'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import {QrCentraalCooKieAccessToken, QrCentraalOrgId, redirectToOrgList} from '../../../utils/cookie'
import {projectApi} from '../../../qrcode_api'
import MyQrCodesList from '../../../components/qrcode/MyQrCodesList'
import Cookies from "js-cookie";

export default function Index({result}) {
    return (<MyQrCodesList result={result}/>)
}

export const getServerSideProps = async (ctx) => {
    let accessToken = ctx.req.cookies[QrCentraalCooKieAccessToken]
    let organizationId = ctx.req.cookies[QrCentraalOrgId]
    if (!organizationId) {
        return redirectToOrgList()
    }

    let projectApiClient = projectApi(accessToken)
    let projects = []
    let totalPages = 0
    let totalItems = 0

    let currentPage = ctx.query.currentPage ? ctx.query.currentPage : 0
    let limit = ctx.query.limit ? ctx.query.limit : 10
    let query = ctx.query.query ? ctx.query.query : null

    try {
        let projectsResp = await projectApiClient.listProjects(organizationId, {
            currentPage: currentPage,
            perPage: limit,
            query: query
        })
        projects = JSON.parse(JSON.stringify(projectsResp)).data.items
        totalItems = projectsResp.data.total_items
        totalPages = projectsResp.data.total_pages
    } catch (err) {
        console.log(err)
    }

    // Pass data to the page via props
    return {
        props: {
            result: {
                projects: projects,
                totalPages: totalPages,
                totalItems: totalItems,
                currentPage: currentPage,
                limit: limit,
            }
        }
    }
}
