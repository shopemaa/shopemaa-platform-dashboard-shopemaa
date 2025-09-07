import React, {useEffect, useState} from 'react'
import Cookies from "js-cookie";
import {QrCentraalDistinctIdKey} from "../../utils/cookie";
import {campaignPublicApi} from "../../qrcode_api";
import toast from 'react-hot-toast'

const ShowSubscriptionForm = ({campaign, show, hideFormCallback}) => {
    const [isPhoneRequired, setIsPhoneRequired] = useState(false);
    const [isEmailRequired, setIsEmailRequired] = useState(false);
    const [isPhoneVerificationRequired, setIsPhoneVerificationRequired] = useState(false);
    const [isEmailVerificationRequired, setIsEmailVerificationRequired] = useState(false);

    const [distinctIdKey, setDistinctIdKey] = useState(Cookies.get(QrCentraalDistinctIdKey));

    const [disableCompleteBtn, setDisableCompleteBtn] = useState(false)

    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
    });

    useEffect(() => {
        if (campaign) {
            let subscriber_config = campaign.subscriber_config;
            if (subscriber_config) {
                setIsPhoneRequired(subscriber_config.is_phone_required);
                setIsEmailRequired(subscriber_config.is_email_required);
                setIsPhoneVerificationRequired(subscriber_config.is_phone_verification_required);
                setIsEmailVerificationRequired(subscriber_config.is_email_verification_required);
            }
        }
    }, [campaign]);

    const handleFormDataChange = (event) => {
        setUserData({
            ...userData,
            [event.target.name]: event.target.value,
        });
    }

    const handleFormSubmit = () => {
        console.log(userData)

        if (userData.firstName.trim() === '' || userData.lastName.trim() === '') {
            return
        }

        if (userData.email.trim() === '' && isEmailRequired) {
            return;
        }

        if (userData.phoneNumber.trim() === '' && isPhoneRequired) {
            return;
        }

        setDisableCompleteBtn(true)

        let campaignUtm = campaign.utm_campaign

        let payload = {
            utm_qrcu: distinctIdKey,
            first_name: userData.firstName,
            last_name: userData.lastName,
            email: userData.email,
            phone: userData.phoneNumber,
        }

        let campaignClient = campaignPublicApi()
        campaignClient
            .campaignSubscribe(campaignUtm, payload)
            .then(response => {
                if (response && response.data) {
                    const channels = [];
                    if (isEmailVerificationRequired) channels.push('email');
                    if (isPhoneVerificationRequired) channels.push('phone number');

                    let message = 'Your request was successful!';

                    if (channels.length) {
                        const channelList = channels.length === 1
                            ? channels[0]
                            : channels.slice(0, -1).join(', ') + ' and ' + channels.slice(-1);
                        message += ` Please check your ${channelList} for verification.`;
                    }

                    toast(message, {
                        position: "top-center",
                        autoClose: 5000,
                        className: "text-success",
                    })

                    hideFormCallback(false);
                    return
                }

                toast("Oops! We couldn’t process the request. Please try again.", {
                    position: "top-center",
                    autoClose: 5000,
                    className: "text-danger",
                })
            })
            .catch(error => {
                console.log(error)
                toast("Oops! We couldn’t process the request. Please try again.", {
                    position: "top-center",
                    autoClose: 5000,
                    className: "text-danger",
                })
            })
            .finally(() => {
                setDisableCompleteBtn(false)
            })
    }

    return (
        <div
            className={`modal modal-blur fade ${show ? 'show d-block' : ''}`}
            tabIndex="-1"
            role="dialog"
            aria-hidden={!show}>
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="modal-title">Never Miss an Update</div>
                            <div className="col-md-12 row">
                                <div className="mb-3 col-6">
                                    <label className="form-label required">First Name</label>
                                    <div>
                                        <input type="text" name={'firstName'} className="form-control"
                                               value={userData.firstName}
                                               onChange={(e) => handleFormDataChange(e)}
                                               placeholder="What's your first name?"/>
                                    </div>
                                </div>
                                <div className="mb-3 col-6">
                                    <label className="form-label required">Last Name</label>
                                    <div>
                                        <input type="text" name={'lastName'} className="form-control"
                                               value={userData.lastName}
                                               onChange={(e) => handleFormDataChange(e)}
                                               placeholder="What's your last name?"/>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-12 row">
                                <div className="mb-3 col-6">
                                    <label className={isEmailRequired ? 'form-label required' : 'form-label'}>Email
                                        address</label>
                                    <div>
                                        <input type="email" name={'email'} className="form-control"
                                               value={userData.email}
                                               onChange={(e) => handleFormDataChange(e)}
                                               placeholder="What's your email?"/>
                                    </div>
                                </div>
                                <div className="mb-3 col-6">
                                    <label className={isPhoneRequired ? 'form-label required' : 'form-label'}>Phone
                                        number</label>
                                    <div>
                                        <input type="text" name={'phoneNumber'} className="form-control"
                                               value={userData.phoneNumber}
                                               onChange={(e) => handleFormDataChange(e)}
                                               placeholder="What's your phone number?"/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="mb-3 col-12">
                                    <small className="form-hint">
                                        We’ll only send you exclusive offers and exciting updates - no spam, we
                                        promise.
                                    </small>
                                </div>
                            </div>

                            <div className="modal-footer text-end col-12">
                                <button
                                    disabled={disableCompleteBtn}
                                    onClick={() => {
                                        hideFormCallback(false);
                                    }}
                                    className="btn col-4">
                                    Cancel
                                </button>

                                <button
                                    disabled={disableCompleteBtn}
                                    onClick={() => {
                                        handleFormSubmit()
                                    }}
                                    className="btn btn-qrc col-6">
                                    Complete
                                    &nbsp;
                                    {disableCompleteBtn && (
                                        <div className="spinner-border spinner-border-sm text-white"
                                             role="status"></div>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShowSubscriptionForm
