import React, {useEffect, useState} from 'react'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import {redirectToErr404} from "../../../../utils/cookie";
import {campaignPublicApi, projectPublicApi} from "../../../../qrcode_api";
import AppHead from "../../../../components/AppHead";
import PoweredBy from "../../../../components/PoweredBy";
import SuccessMessage from "../../../../components/SuccessMessage";
import ProcessingRequestMsgModal from "../../../../components/modals/ProcessingRequestMsgModal";
import FailureMessage from "../../../../components/FailureMessage";
import {useRouter} from "next/router";
import {getQrcnUrl} from "../../../../common_api";

export default function CampaignSubscriptionConfirm({userEmail, projectSlug, token}) {
    const [displayMessage, setDisplayMessage] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showLoading, setShowLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        if (userEmail && projectSlug && token) {
            fetchProject()
        }
    }, [userEmail, projectSlug, token]);

    const fetchProject = () => {
        let projectClient = projectPublicApi()
        projectClient
            .projectBySlug(projectSlug)
            .then(response => {
                if (response && response.data) {
                    verifyUserEmail(response.data.campaign)
                }
            })
            .catch(error => {
                console.log(error)
                setDisplayMessage("Sorry! email verification failed. Please try again.")
                setShowError(true);
                setShowLoading(false);
            })
    }

    const verifyUserEmail = (campaign) => {
        let campaignClient = campaignPublicApi()
        campaignClient.campaignSubscriberEmailVerify(campaign.utm_campaign, {
            email: userEmail,
            token: token
        }).then(response => {
            if (response && response.data) {
                setDisplayMessage("Thank you! We’ve confirmed your email address.")
                setShowSuccess(true);

                setTimeout(() => {
                    router.push(`${getQrcnUrl()}/${projectSlug}`);
                }, 5000);
            }
        }).catch(error => {
            console.log(error)
            setDisplayMessage("Verification unsuccessful. Check your link or request a new one.")
            setShowError(true);
        }).finally(() => {
            setShowLoading(false);
        })
    }

    return (<>
        <Head
            title={"QrCentraal"}
        />

        <ProcessingRequestMsgModal title={'Just a sec'} message={'We’re confirming your email address...'}
                                   show={showLoading}/>

        <div>
            {showSuccess && <SuccessMessage message={displayMessage}/>}
            {showError && <FailureMessage message={displayMessage}/>}
        </div>

        <PoweredBy/>
    </>)
}

export const getServerSideProps = async ({req, query, resolvedUrl}) => {
    const projectSlug = query.campaignSlug;
    const userEmail = query.email;
    const token = query.token;

    if (!userEmail || !projectSlug || !token) {
        return redirectToErr404()
    }

    // Pass data to the page via props
    return {
        props: {
            userEmail: userEmail,
            projectSlug: projectSlug,
            token: token,
        }
    }
}
