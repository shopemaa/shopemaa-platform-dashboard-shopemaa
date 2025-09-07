import React from 'react'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import {
    redirectToLogin,
    QrCentraalCooKieAccessToken,
    QrCentraalHasActiveSubscriptionPlan,
    redirectToSubscriptionRenew
} from '../../../../utils/cookie'
import OrganizationManager from "../../../../components/organizations/OrganizationManager";
import { organizationApi} from '../../../../core_api'
import { handleApi, handleError} from '../../../../common_api'

export default function Manage({organizationId, organization, organizationMembers,organizationInvites}) {
    return (<OrganizationManager 
               organizationId={organizationId} 
               organization={organization} 
               organizationMembers={organizationMembers}
               organizationInvites={organizationInvites}/>)
}

export const getServerSideProps = async (ctx) => {
    let accessToken = ctx.req.cookies[QrCentraalCooKieAccessToken]
    const {organizationId}=ctx.params
    
    if (!accessToken) {
        return redirectToLogin()
    }

    let hasUsableSubscription = ctx.req.cookies[QrCentraalHasActiveSubscriptionPlan]
    if (hasUsableSubscription === 'false') {
        return redirectToSubscriptionRenew()
    }


    let organizationApiClient=organizationApi(accessToken)
    
    //----------get organization data---------- 
    let organization;
    try {
        let organizationRes = await handleApi(ctx, organizationApiClient.findOrganizationById(organizationId))
        if (organizationRes.redirect) {
            return organizationRes
        }

        organization = JSON.parse(JSON.stringify(organizationRes.data))

     } catch (error) {
       console.error("Failed to fetch organization:", error);
      return handleError(ctx,err)
     }

    //----------get organization members----------
    let organizationMembers;
    try {
        let organizationRes = await handleApi(ctx, organizationApiClient.listOrganizationMembers(organizationId))
        if (organizationRes.redirect) {
            return organizationRes
        }

        organizationMembers = JSON.parse(JSON.stringify(organizationRes.data))

     } catch (err) {
       console.error("Failed to fetch organization members:", err);
      return handleError(ctx,err)
     }

    //----------get organization joining invites----------
    let organizationInvites;
    try {
        let getOrganizationInvitesRes = await handleApi(ctx, organizationApiClient.listOrganizationJoiningInvites(organizationId))
        if (getOrganizationInvitesRes.redirect) {
            return organizationInvites
        }

        organizationInvites = JSON.parse(JSON.stringify(getOrganizationInvitesRes.data))

     } catch (err) {
       console.error("Failed to fetch organization invites:", err);
      return handleError(ctx,err)
     }

    // Pass data to the page via props
    return {
        props: { 
            organizationId , 
            organization , 
            organizationMembers, 
            organizationInvites
        }
    }
}
