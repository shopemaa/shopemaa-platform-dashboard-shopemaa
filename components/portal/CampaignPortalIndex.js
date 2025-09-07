import AppHead from "../AppHead";
import GenericAdView from "../ads/themes/GenericAdView";
import RealStateAdView from "../ads/themes/RealStateAdView";
import PoweredBy from "../PoweredBy";
import React from "react";
import {getSpaceUrl} from "../../core_api";

const CampaignPortalIndex = ({campaign, contentUrl}) => {
    return (<>
        <AppHead
            title={campaign.title}
            description={campaign.description}
            bannerImage={getSpaceUrl() + '/' + campaign.banner_image_path}
            contentUrl={contentUrl}
        />

        {campaign && campaign.campaign_type === 'GENERIC' && (
            <GenericAdView
                campaign={campaign}
                projectName={campaign.title}
                subtitle={campaign.subtitle}
                description={campaign.description}
            />
        )}

        {campaign && campaign.campaign_type === 'REAL_ESTATE' && (
            <RealStateAdView
                campaign={campaign}
                projectName={campaign.title}
                mainImage={campaign.banner_image_path}
                thumbnails={campaign.additional_images ? [campaign.banner_image_path, ...campaign.additional_images] : []}
                subtitle={campaign.subtitle}
                description={campaign.description}
            />
        )}

        <PoweredBy/>
    </>)
}

export default CampaignPortalIndex;