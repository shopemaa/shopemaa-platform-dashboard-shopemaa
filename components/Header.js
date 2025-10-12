import {
    logout,
    QrCentraalCooKieAccessToken, QrCentraalHasActiveSubscriptionPlan,
    QrCentraalOrgId,
} from "../utils/cookie";
import {useEffect, useState} from "react";
import {organizationApi, userApi} from "../core_api";
import Cookies from "js-cookie";
import {useRouter} from "next/router";
import {handleApi} from "../common_api";
import Subheader from "./Subheader";
import {showErrorMessage} from "../helpers/errors";

const Header = () => {
    const restrictedRoutes = [
        '/dashboard/organizations',
        '/dashboard/billing',
        '/dashboard/billing/subscription-ended',
        '/dashboard/billing/subscription-list',
        '/page-builder'
    ];

    const withoutSubscriptionAllowedRoutes = [
        '/dashboard/billing',
        '/dashboard/billing/subscription-list',
        '/dashboard/billing/subscription-ended',
        '/dashboard/profile'
    ]

    const withoutOrgAllowedRoutes = [
        '/dashboard/billing',
        '/dashboard/billing/subscription-list',
        '/dashboard/billing/subscription-ended',
        '/dashboard/organizations',
        '/dashboard/profile'
    ]

    const router = useRouter();

    const [fullName, setFullName] = useState("Unnamed User")
    const [orgName, setOrgName] = useState("None")
    const [isUserProfileLoaded, setIsUserProfileLoaded] = useState(false)
    const [isOrgInfoLoaded, setIsOrgInfoLoaded] = useState(false)
    const [accessToken, setAccessToken] = useState(Cookies.get(QrCentraalCooKieAccessToken));
    const [orgId, setOrgId] = useState(Cookies.get(QrCentraalOrgId));
    const [hasUsableSubscription, setHasUsableSubscription] = useState(Cookies.get(QrCentraalHasActiveSubscriptionPlan));

    const onLogout = () => {
        logout(null)
        window.location.href = "/"
    }

    useEffect(() => {
        if (!isUserProfileLoaded) {
            let userClient = userApi(accessToken)
            handleApi(
                null,
                userClient.userMe()
            ).then(resp => {
                setIsUserProfileLoaded(true)

                if (resp.data.first_name && resp.data.last_name) {
                    setFullName(resp.data.first_name + " " + resp.data.last_name)
                }
            }).catch(showErrorMessage);
        }
    }, [isUserProfileLoaded])

    useEffect(() => {
        if (hasUsableSubscription === 'false' && !withoutSubscriptionAllowedRoutes.includes(router.pathname)) {
            router.push("/dashboard/billing/subscription-ended")
            return;
        }

        if (hasUsableSubscription && !orgId && !withoutOrgAllowedRoutes.includes(router.pathname)) {
            router.push("/dashboard/organizations")
            return
        }

        if (!isOrgInfoLoaded && orgId) {
            let orgClient = organizationApi(accessToken);
            
            handleApi(
                null,
                orgClient.findOrganizationById(orgId)
            ).then(resp => {
                setOrgName(resp.data.name)
                setIsOrgInfoLoaded(true)
            }).catch(showErrorMessage);
        }
    }, [isOrgInfoLoaded, orgId, hasUsableSubscription])

    return (
        <>
            <header className="navbar navbar-expand-md d-print-none">
                <div className="container-xl">
                  {
                    router.pathname && !restrictedRoutes.includes(router.pathname) &&
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbar-menu" aria-controls="#navbar-menu" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                  }
                    <h1 className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
                        <a href="/">
                            <img src="/shopemaa/shopemaa_wordmark.png" style={{height: '36px'}} alt="Shopemaa Logo"
                                 className="navbar-brand-image"/>
                        </a>
                    </h1>

                    <div className="navbar-nav flex-row order-md-last">
                        <div className="d-none d-md-flex">
                            <div className="nav-item dropdown d-none d-md-flex me-3">
                                <a href="#" className="nav-link px-0" data-bs-toggle="dropdown" tabIndex="-1">
                                    {/*SVG Icon*/}
                                    &nbsp;EN
                                </a>
                                <div className="dropdown-menu dropdown-menu-arrow dropdown-menu-end dropdown-menu-card">
                                    <div className="card">
                                        <div className="list-group list-group-flush list-group-hoverable">
                                            <div className="list-group-item">
                                                <div className="row align-items-center">
                                                    <div className="col text-truncate">
                                                        {/*SVG Icon*/}
                                                        <a href="#" className="text-body d-block">NL</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="nav-item dropdown">
                            <a href="#" className="nav-link d-flex lh-1 text-reset p-0" data-bs-toggle="dropdown"
                               aria-label="Open user menu">
                                <img alt={''} className="avatar avatar-sm"
                                     src={'/svgs/user.svg'}
                                     style={{
                                         padding: '5px',
                                     }}/>
                                <div className="d-none d-xl-block ps-2">
                                    <div className={'text-primary'}>{fullName}</div>
                                    <span className={'text-secondary'}>{orgName}</span>
                                </div>
                            </a>
                            <div className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                <a href="/dashboard/profile" className="dropdown-item">My Account</a>
                                <a href="/dashboard/organizations" className="dropdown-item">My Organizations</a>
                                <a href="/dashboard/billing" className="dropdown-item">Billing</a>
                                <a href="#" onClick={event => {
                                    event.preventDefault();
                                    onLogout()
                                }} className="dropdown-item">Logout</a>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {router.pathname && !restrictedRoutes.includes(router.pathname) && <Subheader/>}
        </>
    )
}

export default Header