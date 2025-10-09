import "react-responsive-carousel/lib/styles/carousel.min.css";
import {IconBrandGoogle, IconEye, IconEyeOff} from "@tabler/icons-react";
import {handleApi, userPublicApi} from "../core_api";
import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {
    QrCentraalCooKieAccessToken,
    QrCentraalCookieExpireAt,
    QrCentraalCooKieRefreshToken,
} from "../utils/cookie";
import FullPageLoader from "../components/FullPageLoader";
import {useRouter} from "next/router";
import {productDomain} from "../common_api";
import AppHead from "../components/AppHead";

export default function Login({refresh}) {
    const client = userPublicApi();
    const router = useRouter();

    const [loginData, setLoginData] = useState({email: "", password: ""});
    const [showEmailErr, setShowEmailErr] = useState(false);
    const [showPasswordErr, setShowPasswordErr] = useState(false);
    const [emailErr, setEmailErr] = useState("");
    const [passwordErr, setPasswordErr] = useState("");
    const [disableLoginBtn, setDisableLoginBtn] = useState(false);
    const [visiblePassword, setVisiblePassword] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [loginErrors, setLoginErrors] = useState(null);

    useEffect(() => {
        if (refresh) {
            window.location = "/login";
        }
    }, [refresh]);

    const onLogin = () => {
        setLoginErrors(null);
        setShowEmailErr(false);
        setShowPasswordErr(false);

        // Form validation
        let valid = true;
        if (!loginData.email.trim()) {
            setShowEmailErr(true);
            setEmailErr("Email is required");
            valid = false;
        }
        if (!loginData.password.trim()) {
            setShowPasswordErr(true);
            setPasswordErr("Password is required");
            valid = false;
        }
        if (!valid) return;

        setDisableLoginBtn(true);

        client
            .loginUser({
                email: loginData.email.trim(),
                password: loginData.password,
                product_domain: productDomain(),
            })
            .then((response) => {
                let data = response.data;
                let accessToken = data.access_token;
                let refreshToken = data.refresh_token;
                let expireAt = data.expires_in;

                Cookies.set(QrCentraalCooKieAccessToken, accessToken);
                Cookies.set(QrCentraalCooKieRefreshToken, refreshToken);
                Cookies.set(QrCentraalCookieExpireAt, expireAt);

                router.push("/dashboard/billing/subscription-ended");
            })
            .catch((error) => {
                setDisableLoginBtn(false);
                setLoginErrors(error?.body?.error || {error_message: "Login failed. Please check your credentials."});
            });
    };

    return (
        <>
            <AppHead/>
            {showLoading && <FullPageLoader loadingMsg={"Preparing login, please wait..."}/>}
            {!showLoading && (
                <div
                    className="page page-center min-vh-100 bg-white d-flex flex-column justify-content-center align-items-center">
                    <div className="container container-normal py-4">
                        <div className="row align-items-center g-4">
                            <div className="col-lg-6 mx-auto">
                                <div className="container-tight">
                                    <div className="text-center mb-4">
                                        <a href="/" className="navbar-brand navbar-brand-autodark">
                                            <img src="/shopemaa/shopemaa_wordmark.png" height="60" alt="Shopemaa Logo"/>
                                        </a>
                                    </div>
                                    <div className="card card-md shadow-lg rounded-3 border-0">
                                        <div className="card-body py-4 px-4 px-md-5">
                                            <h2 className="h2 text-center mb-4 text-primary">Sign in to Shopemaa</h2>
                                            <form
                                                autoComplete="off"
                                                noValidate
                                                onSubmit={e => {
                                                    e.preventDefault();
                                                    onLogin();
                                                }}>
                                                <div className="mb-3">
                                                    <label className="form-label">Email address</label>
                                                    <input
                                                        type="email"
                                                        className={`form-control ${showEmailErr ? "is-invalid" : ""}`}
                                                        placeholder="you@domain.com"
                                                        autoComplete="username"
                                                        value={loginData.email}
                                                        onChange={e => {
                                                            setLoginData({...loginData, email: e.target.value});
                                                            setShowEmailErr(false);
                                                        }}
                                                        required
                                                    />
                                                    {showEmailErr && (
                                                        <div className="invalid-feedback">{emailErr}</div>
                                                    )}
                                                </div>

                                                <div className="mb-2">
                                                    <label className="form-label">
                                                        Password
                                                        <span className="form-label-description ms-2">
                                                            <a href="/forgot-password" className="text-secondary small">
                                                                Forgot password?
                                                            </a>
                                                        </span>
                                                    </label>
                                                    <div className="input-group input-group-flat">
                                                        <input
                                                            type={visiblePassword ? "text" : "password"}
                                                            className={`form-control ${showPasswordErr ? "is-invalid" : ""}`}
                                                            placeholder="Your password"
                                                            autoComplete="current-password"
                                                            value={loginData.password}
                                                            onChange={e => {
                                                                setLoginData({...loginData, password: e.target.value});
                                                                setShowPasswordErr(false);
                                                            }}
                                                            required
                                                        />
                                                        <button
                                                            type="button"
                                                            tabIndex={-1}
                                                            onClick={() => setVisiblePassword(!visiblePassword)}
                                                            className="btn btn-link p-0 px-2 text-muted"
                                                            style={{background: "none", border: 0}}
                                                            aria-label={visiblePassword ? "Hide password" : "Show password"}>
                                                            {visiblePassword ? <IconEye size={20}/> :
                                                                <IconEyeOff size={20}/>}
                                                        </button>
                                                    </div>
                                                    {showPasswordErr && (
                                                        <div className="invalid-feedback d-block">{passwordErr}</div>
                                                    )}
                                                </div>

                                                {loginErrors?.error_message && (
                                                    <div className="alert alert-danger py-2 mt-2 mb-2 text-center">
                                                        {loginErrors.error_message}
                                                    </div>
                                                )}

                                                <div className="form-footer mt-4">
                                                    <button
                                                        type="submit"
                                                        disabled={disableLoginBtn}
                                                        className="btn btn-primary w-100 py-2 rounded-2 d-flex align-items-center justify-content-center">
                                                        <span>Login</span>
                                                        {disableLoginBtn && (
                                                            <span className="ms-2">
                                                                <span
                                                                    className="spinner-border spinner-border-sm text-white"
                                                                    role="status"></span>
                                                            </span>
                                                        )}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>

                                        {/*<div className="hr-text">or</div>*/}
                                        {/*<div className="card-body pt-2 pb-4 px-4 px-md-5">*/}
                                        {/*    <a href="#"*/}
                                        {/*       className="btn btn-outline-qrc w-100 d-flex align-items-center justify-content-center"*/}
                                        {/*       style={{minHeight: 44}}>*/}
                                        {/*        <IconBrandGoogle size={20}/>*/}
                                        {/*        <span className="ms-2">Sign in with Google</span>*/}
                                        {/*    </a>*/}
                                        {/*</div>*/}
                                    </div>
                                    <div className="text-center text-muted mt-4">
                                        Don&apos;t have an account yet?{" "}
                                        <a className="text-qrc" href="/register">
                                            Sign up
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 d-none d-lg-flex align-items-center">
                                <img
                                    src="/static/illustrations/qrcentraal_illustration_1_t.png"
                                    style={{maxHeight: 420, objectFit: "contain"}}
                                    className="d-block mx-auto"
                                    alt="Shopemaa illustration"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export const getServerSideProps = async (ctx) => {
    let refresh = false;
    try {
        refresh = ctx.query.refresh === "true";
    } catch (e) {
    }
    return {props: {refresh}};
};
