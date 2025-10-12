import React, {useState} from 'react'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import SubscriptionPackageList from "../../../components/billing/SubscriptionPackageList";
import {addressApi, subscriptionApi, subscriptionPublicApi, userApi} from "../../../core_api";
import {handleApi, handleError} from "../../../common_api";
import {QrCentraalCooKieAccessToken, redirectToLogin} from "../../../utils/cookie";
import BaseSelect from "../../../components/base/BaseSelect";
import Cookies from "js-cookie";
import {showErrorMessage} from "../../../helpers/errors";
import {useRouter} from "next/router";
import {Toaster, toast} from "react-hot-toast";

export default function SubscriptionList({subscriptions, countries, activeSubscription}) {
    const [showCheckout, setShowCheckout] = useState(null);
    const [disableSubscribeBtn, setDisableSubscribeBtn] = useState(false);

    const [selectedCountry, setSelectedCountry] = useState(countries[0]);

    const [activeSubscriptionId, setActiveSubscriptionId] = useState(
        activeSubscription ? activeSubscription.subscription_plan.id : null
    );

    const [street, setStreet] = useState('');
    const [streetAdditional, setStreetAdditional] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');

    const [accessToken, setAccessToken] = useState(Cookies.get(QrCentraalCooKieAccessToken))
    const [subscriptionClient, setSubscriptionClient] = useState(subscriptionApi(accessToken))

    const router = useRouter();

    const handleCountryChange = (event) => {
        let country = countries.find(c => c.value === event.target.value)
        setSelectedCountry({
                ...country
            }
        )
    }

    const handleOnSubscribe = () => {
        if (street.trim() === '' || city.trim() === '' || zip.trim() === '') {
            return
        }

        setDisableSubscribeBtn(!disableSubscribeBtn);

        subscriptionClient.enrollUserToSubscriptionPlan({
            subscription_plan_id: showCheckout.id,
            billing_address_street: street,
            billing_address_street_optional: '',
            billing_address_city: city,
            billing_address_state: '',
            billing_address_postal_code: zip,
            billing_address_country_id: selectedCountry.value,
        })
            .then(resp => {
                let subscription = resp.data;
                let subscriptionId = resp.data.id;
                let status = resp.data.status;

                if (subscription.next_billing_cycle_subscription_plan_id) {
                    toast('Your subscription plan change is confirmed and will take effect starting with your next billing cycle.', {
                        position: 'top-center',
                        className: 'success',
                        duration: 5000,
                    })
                    setDisableSubscribeBtn(false);
                    setShowCheckout(null);
                    return;
                }

                if (status === 'ACTIVE') {
                    router.push('/dashboard/billing');
                    return
                }

                let host = window.location.origin;

                subscriptionClient.initiateSubscriptionCheckout(subscriptionId, {
                    success_url: `${host}/dashboard/billing?success=true`,
                    cancel_url: `${host}/dashboard/billing/subscription-list?success=false`,
                })
                    .then(checkoutResp => {
                        window.location.replace(checkoutResp.data);
                    })
                    .catch(showErrorMessage)
                    .finally(() => {
                        setDisableSubscribeBtn(false);
                    })
            })
            .catch(err => {
                showErrorMessage(err)
                setDisableSubscribeBtn(false);
            })
    }

    return (<>
        <div className="page-body">
            <div className="container-xl">
                <div className={`modal modal-blur fade ${showCheckout ? 'show d-block' : ''}`} id="modal-show-checkout"
                     tabIndex="-1"
                     role="dialog" aria-hidden="false">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Subscription Checkout</h5>
                                <button onClick={() => {
                                    setShowCheckout(null)
                                }} type="button" className="btn-close" data-bs-dismiss="modal"
                                        disabled={disableSubscribeBtn}
                                        aria-label="Close"></button>
                            </div>

                            <div className="modal-body">
                                <div className="row mb-3 align-items-end">
                                    <div className="col">
                                        <label className="form-label required">Street</label>
                                        <input
                                            defaultValue={street}
                                            onChange={event => {
                                                setStreet(event.target.value)
                                            }} type="text" className="form-control"/>
                                    </div>
                                </div>

                                <div className="row mb-3 align-items-end">
                                    <div className="col">
                                        <label className="form-label">Street additional</label>
                                        <input
                                            defaultValue={streetAdditional}
                                            onChange={event => {
                                                setStreetAdditional(event.target.value)
                                            }}
                                            type="text" className="form-control"/>
                                    </div>
                                </div>

                                <div className="row mb-3 align-items-end">
                                    <div className="col">
                                        <label className="form-label required">City</label>
                                        <input
                                            defaultValue={city}
                                            onChange={event => {
                                                setCity(event.target.value)
                                            }}
                                            type="text" className="form-control"/>
                                    </div>

                                    <div className="col">
                                        <label className="form-label">State</label>
                                        <input
                                            defaultValue={state}
                                            onChange={event => {
                                                setState(event.target.value)
                                            }}
                                            type="text" className="form-control"/>
                                    </div>
                                </div>

                                <div className="row mb-3 align-items-end">
                                    <div className="col">
                                        <label className="form-label required">Postcode</label>
                                        <input
                                            defaultValue={zip}
                                            onChange={event => {
                                                setZip(event.target.value)
                                            }}
                                            type="text" className="form-control"/>
                                    </div>

                                    <div className="col">
                                        <BaseSelect
                                            label={'Country'}
                                            options={countries}
                                            value={selectedCountry.value}
                                            className={'mb-0'}
                                            required
                                            onChange={handleCountryChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    disabled={disableSubscribeBtn}
                                    onClick={() => {
                                        setShowCheckout(null)
                                    }} type="button" className="btn me-auto w-25" data-bs-dismiss="modal">Cancel
                                </button>

                                <button
                                    disabled={disableSubscribeBtn}
                                    onClick={() => {
                                        handleOnSubscribe()
                                    }}
                                    type="button" className="btn btn-primary w-66" data-bs-dismiss="modal">
                                    Subscribe
                                    {disableSubscribeBtn && (
                                        <>
                                            &nbsp;&nbsp;&nbsp;
                                            <div className="spinner-border spinner-border-sm text-white"
                                                 role="status"></div>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row row-cards">
                    <SubscriptionPackageList
                        subscriptions={subscriptions}
                        showCheckoutCallback={setShowCheckout}
                        activeSubscriptionId={activeSubscriptionId}
                    />
                </div>
            </div>

            <Toaster/>
        </div>
    </>)
}

export const getServerSideProps = async (ctx) => {
    let accessToken = ctx.req.cookies[QrCentraalCooKieAccessToken]
    if (!accessToken) {
        return redirectToLogin()
    }
    let userCurrency = 'USD'

    let subscriptionApiClient = subscriptionApi(accessToken)
    let subscriptionPublicApiClient = subscriptionPublicApi()
    let addressClient = addressApi(accessToken)
    let userClient = userApi(accessToken)

    try {
        let userResp = await handleApi(ctx, userClient.userMe())
        if (userResp.redirect) {
            return userResp
        }

        let user = JSON.parse(JSON.stringify(userResp.data))
        userCurrency = user.currency
    } catch (e) {
        console.error(e)
    }

    let subscriptionList = []
    let countries = []

    let activeSubscription = null

    try {
        let subscriptionResp = await handleApi(ctx, subscriptionPublicApiClient.listSubscriptionPlans("QR_CENTRAAL", {
            userCurrency: userCurrency,
        }))
        if (subscriptionResp.redirect) {
            return subscriptionResp
        }

        subscriptionList = JSON.parse(JSON.stringify(subscriptionResp.data))
    } catch (error) {
        console.error(error)
        return handleError(ctx, error)
    }

    try {
        let addressResp = await handleApi(ctx, addressClient.listAllCountriesByUser())
        if (addressResp.redirect) {
            return addressResp
        }

        countries = JSON.parse(JSON.stringify(addressResp.data))
    } catch (error) {
        console.error(error)
        return handleError(ctx, error)
    }

    try {
        let activeSubscriptionResp = await handleApi(ctx, subscriptionApiClient.findActiveSubscription('QR_CENTRAAL'))
        if (activeSubscriptionResp.redirect) {
            return activeSubscriptionResp
        }

        activeSubscription = JSON.parse(JSON.stringify(activeSubscriptionResp.data))
    } catch (error) {
        if (error.response && error.response.status !== 404) {
            console.error(error)
            return handleError(ctx, error)
        }
    }

    // Pass data to the page via props
    return {
        props: {
            subscriptions: subscriptionList,
            countries: countries.map(c => {
                return {
                    label: c.name,
                    value: c.id,
                }
            }),
            activeSubscription: activeSubscription,
        }
    }
}
