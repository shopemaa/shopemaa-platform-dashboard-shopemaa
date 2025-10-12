import 'react-responsive-carousel/lib/styles/carousel.min.css'
import toast, {Toaster} from 'react-hot-toast'
import {useEffect, useState, useRef} from 'react'
import {useRouter} from 'next/router'
import {redirectToErr404} from "../utils/cookie";
import {userPublicApi} from "../core_api";
import {productDomain} from "../common_api";
import AppHead from "../components/AppHead";
import {IconCheck, IconX} from '@tabler/icons-react';

export default function Verify({token, email}) {
    const [status, setStatus] = useState("idle"); // idle, verifying, success, error
    const [hasTried, setHasTried] = useState(false); // whether user or effect has called verification at least once
    const router = useRouter();
    const isFirstRun = useRef(true);

    // Initial verify on mount
    useEffect(() => {
        if (token && email && isFirstRun.current) {
            isFirstRun.current = false;
            onVerify();
        }
        // eslint-disable-next-line
    }, [token, email]);

    function onVerify() {
        setStatus("verifying");
        setHasTried(true);

        userPublicApi()
            .verifyUserAccount({
                email: email,
                verification_token: token,
                product_domain: productDomain()
            })
            .then((result) => {
                if (result?.data) {
                    setStatus("success");
                    toast.success("Account verification successful. Redirecting to login…", {
                        position: "top-center"
                    });
                    setTimeout(() => {
                        router.push('/login')
                    }, 2000);
                } else {
                    setStatus("error");
                    toast.error("Unable to verify your account, please try again later.", {
                        position: "top-center"
                    });
                }
            })
            .catch(() => {
                setStatus("error");
                toast.error("Unable to verify your account, please try again later.", {
                    position: "top-center"
                });
            });
    }

    function renderStatus() {
        if (status === "verifying") {
            return (
                <>
                    <div className="text-center mb-3">
                        <div className="spinner-border text-primary" style={{width: 48, height: 48}} role="status"/>
                    </div>
                    <p className="text-center text-primary h4">Verifying your account…</p>
                    <p className="text-center text-muted small mb-0">Hang tight, we're confirming your details.</p>
                </>
            );
        }
        if (status === "success") {
            return (
                <>
                    <div className="text-center mb-3">
                        <IconCheck size={48} className="text-success"/>
                    </div>
                    <p className="text-center h4 text-success mb-2">Account verified!</p>
                    <p className="text-center text-muted mb-0">You'll be redirected to login shortly.</p>
                </>
            );
        }
        if (status === "error") {
            return (
                <>
                    <div className="text-center mb-3">
                        <IconX size={48} className="text-danger"/>
                    </div>
                    <p className="text-center h4 text-danger mb-2">Verification failed</p>
                    <p className="text-center text-muted mb-3">Could not verify your account.<br/>Please check your link
                        or try again later.</p>
                    <div className="form-footer">
                        <button
                            onClick={onVerify}
                            className="btn btn-primaryw-100"
                            disabled={status === "verifying"}
                        >
                            {status === "verifying" ? "Verifying…" : hasTried ? "Retry Verification" : "Verify Account"}
                        </button>
                    </div>
                </>
            );
        }
        // idle state - allow user to trigger verify (eg. page loads without effect, or if user wants to click manually)
        return (
            <div className="form-footer">
                <button
                    onClick={onVerify}
                    className="btn btn-primaryw-100"
                    disabled={status === "verifying"}
                >
                    Verify Account
                </button>
            </div>
        );
    }

    return (
        <>
            <AppHead/>
            <div className="page page-center">
                <div className="container container-normal py-4">
                    <div className="row align-items-center g-4">
                        <div className="col-lg">
                            <div className="container-tight">
                                <div className="text-center mb-4">
                                    <a href="/" className="navbar-brand navbar-brand-autodark">
                                        <img src="/qrc/qrc-group2_2x.png" alt="QRCentraal" height="40"/>
                                    </a>
                                </div>
                                <div className="card card-md">
                                    <div className="card-body">
                                        <h2 className="h2 text-center mb-4">Account Verification</h2>
                                        {renderStatus()}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg d-none d-lg-block">
                            <img src="/static/illustrations/qrcentraal_illustration_1_t.png"
                                 className="d-block mx-auto"
                                 style={{maxHeight: 400, objectFit: "contain"}}
                                 alt="Qrcentraal illustration"/>
                        </div>
                    </div>
                </div>
                <Toaster/>
            </div>
        </>
    )
}

export const getServerSideProps = async (ctx) => {
    let token = ctx.query.token
    let email = ctx.query.email

    if (token) token = token.trim()
    if (email) email = email.trim()

    if (!email || !token) {
        return redirectToErr404()
    }

    return {
        props: {
            token: token,
            email: email
        }
    }
}
