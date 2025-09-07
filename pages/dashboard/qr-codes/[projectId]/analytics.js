import React from 'react'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import {
    QrCentraalCooKieAccessToken,
    QrCentraalOrgId,
    redirectToOrgList
} from '../../../../utils/cookie'
import {projectApi} from '../../../../qrcode_api'
import {handleApi, handleError} from "../../../../common_api";
import QrAnalytics from "../../../../components/qrcode/QrAnalytics";

export default function Analytics({project}) {
    return (<QrAnalytics project={project}/>)
}

export const getServerSideProps = async (ctx) => {
    let projectId = ctx.params.projectId
    let accessToken = ctx.req.cookies[QrCentraalCooKieAccessToken]
    let organizationId = ctx.req.cookies[QrCentraalOrgId]
    if (!organizationId) {
        return redirectToOrgList()
    }

    let projectApiClient = projectApi(accessToken)

    let project = null

    try {
        let projectResp = await handleApi(ctx, projectApiClient.projectByIdAndOwner(projectId, organizationId))
        if (projectResp.redirect) {
            return projectResp
        }

        project = JSON.parse(JSON.stringify(projectResp.data))
        console.log(project)
    } catch (error) {
        console.error('reached here: ', error)
        return handleError(ctx, error)
    }

    // Pass data to the page via props
    return {
        props: {
            project: project
        }
    }
}
