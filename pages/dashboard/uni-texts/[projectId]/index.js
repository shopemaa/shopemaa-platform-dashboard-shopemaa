import UniTextSettigns from "../../../../components/unitext/UniTextSettigns";
import {
    logout,
    redirectToLogin,
    QrCentraalCooKieAccessToken,
    QrCentraalOrgId,
    redirectToOrgList
} from '../../../../utils/cookie'
import {projectApi} from '../../../../qrcode_api'

export default function UniText({project, uniTextType}) {
    return <UniTextSettigns project={project} uniTextType={uniTextType}/>;
}

export const getServerSideProps = async ({query, req}) => {
    let projectId = query.projectId;
    let accessToken = req.cookies[QrCentraalCooKieAccessToken];
    let organizationId = req.cookies[QrCentraalOrgId]
    if (!organizationId) {
        return redirectToOrgList()
    }

    let uniTextType = query.type;

    let projectApiClient = projectApi(accessToken);

    let project = null;

    try {
        let projectResp = await projectApiClient.projectByIdAndOwner(projectId, organizationId);
        project = JSON.parse(JSON.stringify(projectResp.data));

        if (project.uni_text) {
            uniTextType = project.uni_text.uni_text_type;
        }
    } catch (error) {
        console.error(error);

        if (error.status === 403) {
            logout(req);
            return redirectToLogin();
        }
    }

    if (uniTextType === 'PORTFOLIO_PAGE') {
        return {
            redirect: {
                destination: `/dashboard/portfolios/${project.id}`,
                permanent: false
            }
        }
    }

    // Pass data to the page via props
    return {
        props: {
            project: project,
            uniTextType: uniTextType ? uniTextType : ''
        },
    };
};
