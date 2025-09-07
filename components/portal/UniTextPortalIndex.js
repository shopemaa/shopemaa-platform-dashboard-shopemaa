import AppHead from "../AppHead";
import FullPageLoader from "../FullPageLoader";
import PoweredBy from "../PoweredBy";
import React, {useEffect} from "react";
import {getWhatsAppUrl} from "../../common_api";

const isHttpUrl = (s) => /^https?:\/\//i.test(String(s || '').trim());

function safeHttpUrl(raw) {
    const str = String(raw || '').trim();
    if (!str) return null;
    try {
        const u = new URL(isHttpUrl(str) ? str : `https://${str}`);
        if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
        return u;
    } catch {
        return null;
    }
}

function buildWhatsappUrl(phoneRaw, messageRaw) {
    const base = getWhatsAppUrl(); // e.g., 'https://wa.me' or 'https://api.whatsapp.com/send'
    const phone = String(phoneRaw || '').replace(/\D/g, ''); // digits only
    const msg = typeof messageRaw === 'string' ? messageRaw : '';

    let u;
    try {
        u = new URL(base);
    } catch {
        u = new URL('https://wa.me/');
    }

    const hostname = u.hostname.toLowerCase();
    const path = u.pathname.replace(/\/+$/, ''); // trim trailing slash

    const isWaMe = hostname === 'wa.me';
    const isSendApi = hostname.endsWith('api.whatsapp.com') && path.endsWith('/send');

    if (isWaMe) {
        u.pathname = `/${phone}`;
        u.search = '';
        if (msg) u.searchParams.set('text', msg);
    } else {
        if (!isSendApi) u.pathname = '/send';
        u.searchParams.set('phone', phone);
        if (msg) u.searchParams.set('text', msg);
    }
    return u;
}

const UniTextPortalIndex = ({project, uniText}) => {
    const [showData, setShowData] = React.useState(false);

    useEffect(() => {
        if (uniText) {
            setTimeout(function () {
                handleUniText()
            }, 2000)
        }
    }, [uniText])

    const handleUniText = () => {
        if (uniText.uni_text_type === 'URL') {
            const u = safeHttpUrl(uniText.data);
            if (u) {
                window.location.assign(u.toString());
            } else {
                setShowData(true); // fallback if invalid
            }
        } else if (uniText.uni_text_type === 'WHATSAPP') {
            const u = buildWhatsappUrl(uniText.data, uniText.extra_data);
            window.location.assign(u.toString()); // params encoded via URLSearchParams
        } else {
            setShowData(true);
        }
    }

    return (
        <>
            <AppHead title={project.name}/>

            {showData && uniText.uni_text_type !== 'PORTFOLIO_PAGE' && (
                <div className={'row row-cards'}>
                    <div class="col-md-12 col-12 ps-8 pe-8 pt-4 pb-2">
                        <a class="card card-link">
                            <div class="card-body text-center">{uniText.data}</div>
                        </a>
                    </div>
                </div>
            )}
            {!showData && (
                <FullPageLoader/>
            )}

            <PoweredBy/>
        </>
    )
}

export default UniTextPortalIndex