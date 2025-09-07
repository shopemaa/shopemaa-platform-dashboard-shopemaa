import RestaurantReports from "../../../../components/restaurant/RestaurantReports";
import {
    logout,
    QrCentraalCooKieAccessToken,
    QrCentraalOrgId, redirectToErr500,
    redirectToLogin,
    redirectToOrgList
} from "../../../../utils/cookie";
import {projectApi} from "../../../../qrcode_api";

const ReportsIndex = ({project}) => {
    return (
        <>
            <RestaurantReports project={project}/>
        </>
    )
}

export default ReportsIndex;

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
        let projectResp = await projectApiClient.projectByIdAndOwner(projectId, organizationId)
        project = JSON.parse(JSON.stringify(projectResp.data))
        console.log(project)
    } catch (error) {
        console.error(error)

        if (error.status === 403) {
            logout(ctx)
            return redirectToLogin()
        }
    }

    if (!project) {
        return redirectToErr500()
    }

    // Pass data to the page via props
    return {
        props: {
            project: project
        }
    }
}
