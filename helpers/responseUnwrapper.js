export const unwrapCountry = (address) => {
    if (address.country) {
        return {
            ...address.country
        }
    }
    return null
}

export const unwrapAddress = (businessCard) => {
    if (businessCard.address) {
        return {
            ...businessCard.address,
            country: unwrapCountry(businessCard.address)
        }
    }
    return null
}

export const unwrapBusinessCard = (project) => {
    if (project.business_card) {
        return {
            ...project.business_card,
            address: unwrapAddress(project.business_card)
        }
    }
    return null
}

export const unwrapMaskedLink = (project) => {
    if (project.masked_link) {
        return {
            ...project.masked_link,
        }
    }
    return null
}

export const unwrapCampaign = (project) => {
    if (project.campaign) {
        return {
            ...project.campaign,
            subscriber_config: unwrapCampaignSubscriberConfig(project.campaign)
        }
    }
    return null
}

export const unwrapCampaignSubscriberConfig = (campaign) => {
    if (campaign.subscriber_config) {
        return {
            ...campaign.subscriber_config,
        }
    }
    return null
}

export const unwrapQrCodeConfig = (project) => {
    if (project.qr_code_config) {
        return {
            ...project.qr_code_config
        }
    }
    return null
}