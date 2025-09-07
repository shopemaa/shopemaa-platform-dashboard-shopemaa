// pages/[projectSlug].jsx
import {projectPublicApi} from "../../qrcode_api";
import {redirectToErr404} from "../../utils/cookie";
import dynamic from "next/dynamic";
import {getQrcnUrl} from "../../common_api";

const CampaignPortalIndex = dynamic(
    () => import("../../components/portal/CampaignPortalIndex"),
    {ssr: true}
);
const OnePageIndex = dynamic(
    () => import("../../components/portal/OnePageIndex"),
    {ssr: true}
);
const BusinessCardPortalIndex = dynamic(
    () => import("../../components/portal/BusinessCardPortalIndex"),
    {ssr: true}
);
const UniTextPortalIndex = dynamic(
    () => import("../../components/portal/UniTextPortalIndex"),
    {ssr: true}
);
const RestaurantUserIndex = dynamic(
    () => import("../../components/portal/RestaurantUserIndex"),
    {ssr: true}
);

const componentMap = {
    Campaign: (project) => (
        <CampaignPortalIndex
            campaign={project.campaign}
            contentUrl={`${getQrcnUrl()}/${project.project_slug}`}
        />
    ),
    OnePage: (project) => (
        <OnePageIndex
            onePage={project.one_page}
        />
    ),
    BusinessCard: (project) => (
        <BusinessCardPortalIndex businessCard={project.business_card}/>
    ),
    UniText: (project) => (
        <UniTextPortalIndex uniText={project.uni_text} project={project}/>
    ),
    RestaurantMenu: (project) => (
        <RestaurantUserIndex project={project}/>
    )
};

export default function ProjectSlug({project}) {
    const Renderer = componentMap[project?.type];
    return Renderer ? Renderer(project) : null;
}

export const getServerSideProps = async ({query}) => {
    try {
        const client = projectPublicApi();
        const resp = await client.projectBySlug(query.projectSlug);
        const project = JSON.parse(JSON.stringify(resp.data));
        return {props: {project}};
    } catch (err) {
        console.error(err);
        return redirectToErr404();
    }
};
