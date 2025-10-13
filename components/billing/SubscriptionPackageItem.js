import {formatAmount} from "../../helpers/currency_helper";

const SubscriptionPackageItem = ({subscription, isActive, showCheckoutCallback, changePlanCallback}) => {
    const featureList = () => {
        return JSON.parse(subscription.features)
    }

    const formattedFeature = (key, value) => {
        switch (key) {
            case 'number_of_projects':
                if (value === -1) {
                    return 'Unlimited QR codes'
                }
                return value + ' QR codes'
            case 'scans_per_month':
                if (value === -1) {
                    return 'Unlimited scans per month'
                }
                return value + ' scans per month'
            case 'has_scan_analytics':
                if (value) {
                    return 'Scan analytics (how many, when, where)'
                }
                return ''
            case 'has_priority_email_support':
                if (value) {
                    return 'Priority email support'
                }
                return ''
            case 'number_of_team_account':
                if (value) {
                    return value + ' Team accounts'
                }
                return ''
            case 'number_of_team_members':
                if (value) {
                    return value + ' members per team'
                }
                return ''
            case 'support_white_level_domain':
                if (value) {
                    return 'Custom domain support'
                }
                return ''
            case 'has_api_access':
                if (value) {
                    return 'API access'
                }
                return ''
            case 'has_short_link':
                if (value) {
                    return 'Short link supported'
                }
                return ''
            case 'is_custom_slug_enabled':
                if (value) {
                    return 'Custom short link'
                }
                return ''
            case 'magic_credits':
                if (value) {
                    return value + ' AI credits'
                }
                return ''
            case 'email_credits':
                if (value) {
                    return value + ' Email credits'
                }
                return ''
            case 'is_data_export_enabled':
                if (value) {
                    return 'Data export supported'
                }
                return ''
            default:
                return ''
        }
    }

    return (
        <div className="col-12">
            <div className="card card-md">
                <div className="card-body text-center">
                    <div className="text-uppercase text-primary font-weight-medium">{subscription.name}</div>
                    <div className="h1 mt-2">
                        {formatAmount(subscription.price_in_cents, subscription.price_in_currency, subscription.billing_cycle)}
                    </div>
                    <div className="text-secondary mb-3">{subscription.description}</div>

                    <ul className="list-unstyled lh-lg">
                        {subscription.eligible_for_trial && (
                            <li className={"bg-teal-lt p-1 mb-1"}>First month free</li>
                        )}

                        {Object.keys(featureList()).map((key) => {
                            const value = formattedFeature(key, featureList()[key]);
                            return value ? (
                                <li key={key} className="bg-primary-lt p-1 mb-1">
                                    {value}
                                </li>
                            ) : '';
                        })}

                        <li className={"bg-primary-lt p-1 mb-1"}>Variety of QR types</li>
                        <li className={"bg-primary-lt p-1 mb-1"}>Unlimited modifications</li>
                        <li className={"bg-primary-lt p-1 mb-1"}>Multiple QR code download formats</li>
                    </ul>

                    {showCheckoutCallback && (
                        <div className="text-center mt-4">
                            <button onClick={() => {
                                showCheckoutCallback(subscription)
                            }} disabled={isActive}
                                    className="btn btn-primary w-100">
                                {isActive ? 'Current Plan' : (subscription.price_in_cents < 0 ? 'Contact Us' : 'Choose Plan')}
                            </button>
                        </div>
                    )}

                    {changePlanCallback && (
                        <div className="text-center mt-4">
                            <button onClick={() => {
                                changePlanCallback()
                            }} className="btn btn-primary w-100">
                                {isActive ? 'Change Plan' : (subscription.price_in_cents < 0 ? 'Contact Us' : 'Choose Plan')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SubscriptionPackageItem
