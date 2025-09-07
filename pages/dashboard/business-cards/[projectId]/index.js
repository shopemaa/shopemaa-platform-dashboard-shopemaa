import React from 'react'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import BusinessCardSettings from '../../../../components/businesscard/BusinessCardSettings'
import {projectApi} from '../../../../qrcode_api'
import {
    logout,
    redirectToLogin,
    QrCentraalCooKieAccessToken,
    redirectToErr500,
    QrCentraalOrgId, redirectToOrgList
} from '../../../../utils/cookie'
import {addressApi} from '../../../../core_api'
import {unwrapBusinessCard, unwrapQrCodeConfig} from "../../../../helpers/responseUnwrapper";
import {handleApi, handleError} from "../../../../common_api";

export default function BusinessCardIndex({project, countryList}) {
    return (<BusinessCardSettings project={project} countryList={countryList}/>)
}

export const getServerSideProps = async (ctx) => {
    let projectId = ctx.params.projectId
    let accessToken = ctx.req.cookies[QrCentraalCooKieAccessToken]
    let organizationId = ctx.req.cookies[QrCentraalOrgId]
    if (!organizationId) {
        return redirectToOrgList()
    }

    let projectApiClient = projectApi(accessToken)
    let addressApiClient = addressApi(accessToken)

    let project = null
    let countryList = []

    try {
        let projectResp = await handleApi(ctx, projectApiClient.projectByIdAndOwner(projectId, organizationId))
        if (projectResp.redirect) {
            return projectResp
        }

        project = JSON.parse(JSON.stringify(projectResp.data))

        console.log(project)
    } catch (error) {
        console.error(error)
        return handleError(ctx, error)
    }

    try {
        let countryListResp = await handleApi(ctx, addressApiClient.listAllCountriesByUser())
        if (countryListResp.redirect) {
            return countryListResp
        }

        countryList = countryListResp.data.map((country) => ({
            ...country
        }))
    } catch (error) {
        console.error(error)
        return handleError(ctx, error)
    }

    // Pass data to the page via props
    return {
        props: {
            project: project,
            countryList: countryList.map(c => ({
                'label': c.name,
                'value': c.id
            }))
        }
    }
}
