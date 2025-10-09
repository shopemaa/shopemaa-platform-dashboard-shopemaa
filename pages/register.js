import {useState} from 'react'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import {
    IconBrandGoogle, IconExternalLink,
    IconEye, IconEyeOff
} from '@tabler/icons-react'
import toast, {Toaster} from 'react-hot-toast'
import {useRouter} from 'next/router'
import {userPublicApi} from "../core_api";
import {showErrorMessage} from '../helpers/errors'
import InputField from '../components/common/InputField'
import {productDomain} from '../common_api'
import AppHead from "../components/AppHead";

export default function Register() {
    const client = userPublicApi();
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [disableSignupBtn, setDisableSignupBtn] = useState(false);

    const [userInfo, setUserInfo] = useState({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: ''
    });

    const [userInfoErr, setUserInfoErr] = useState({});

    // Email regex validation
    const isEmailValid = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Password policy (customize as needed)
    const isPasswordValid = (pw) => pw.length >= 6;

    const handleUserInfoChange = (key, value) => {
        setUserInfo(prev => ({...prev, [key]: value}));
        setUserInfoErr(prev => ({...prev, [`${key}Err`]: null}));
    };

    const onSignUp = () => {
        let hasErr = false;
        let errors = {};

        if (!userInfo.email) {
            errors.emailErr = 'Email is required';
            hasErr = true;
        } else if (!isEmailValid(userInfo.email)) {
            errors.emailErr = 'Email is invalid';
            hasErr = true;
        }

        if (!userInfo.firstName.trim()) {
            errors.firstNameErr = 'First name is required';
            hasErr = true;
        }
        if (!userInfo.lastName.trim()) {
            errors.lastNameErr = 'Last name is required';
            hasErr = true;
        }

        if (!userInfo.password) {
            errors.passwordErr = 'Password is required';
            hasErr = true;
        } else if (!isPasswordValid(userInfo.password)) {
            errors.passwordErr = 'Password must be at least 6 characters';
            hasErr = true;
        }

        if (!userInfo.confirmPassword) {
            errors.confirmPasswordErr = 'Please confirm your password';
            hasErr = true;
        } else if (userInfo.password !== userInfo.confirmPassword) {
            errors.confirmPasswordErr = 'Passwords do not match';
            hasErr = true;
        }

        setUserInfoErr(errors);

        if (hasErr) return;

        setDisableSignupBtn(true);

        client.registerUser({
            email: userInfo.email,
            password: userInfo.password,
            first_name: userInfo.firstName.trim(),
            last_name: userInfo.lastName.trim(),
            product_domain: productDomain()
        })
            .then(() => {
                toast.success('Signup completed. Please check email to verify your account.', {
                    position: 'top-center'
                });
                setTimeout(() => router.push('/login'), 2000);
            })
            .catch(showErrorMessage)
            .finally(() => setDisableSignupBtn(false));
    };

    return (
        <>
            <AppHead/>

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
                                <div className="card card-md shadow-lg border-0 rounded-3">
                                    <div className="card-body py-4 px-4 px-md-5">
                                        <h2 className="h2 text-center mb-4 text-primary">Get started with a free
                                            account!</h2>
                                        <form autoComplete="off" noValidate
                                              onSubmit={e => {
                                                  e.preventDefault();
                                                  onSignUp();
                                              }}
                                        >
                                            <InputField
                                                label="Email address"
                                                name="email"
                                                type="email"
                                                placeholder="you@email.com"
                                                onChange={e => handleUserInfoChange('email', e.target.value)}
                                                value={userInfo.email}
                                                error={userInfoErr.emailErr}
                                                required
                                            />

                                            <InputField
                                                label="First Name"
                                                name="firstName"
                                                type="text"
                                                placeholder="Sakib"
                                                onChange={e => handleUserInfoChange('firstName', e.target.value)}
                                                value={userInfo.firstName}
                                                error={userInfoErr.firstNameErr}
                                                required
                                            />

                                            <InputField
                                                label="Last Name"
                                                name="lastName"
                                                type="text"
                                                placeholder="Alim"
                                                onChange={e => handleUserInfoChange('lastName', e.target.value)}
                                                value={userInfo.lastName}
                                                error={userInfoErr.lastNameErr}
                                                required
                                            />

                                            <div className="mb-2">
                                                <label className="form-label">Password</label>
                                                <div className="input-group input-group-flat">
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        name="password"
                                                        autoComplete="new-password"
                                                        className={`form-control ${userInfoErr.passwordErr ? 'is-invalid' : ''}`}
                                                        placeholder="Your password"
                                                        value={userInfo.password}
                                                        onChange={e => handleUserInfoChange('password', e.target.value)}
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        tabIndex={-1}
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="btn btn-link p-0 px-2 text-muted"
                                                        style={{background: "none", border: 0}}
                                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                                    >
                                                        {showPassword ? <IconEye size={20}/> : <IconEyeOff size={20}/>}
                                                    </button>
                                                </div>
                                                {userInfoErr.passwordErr && (
                                                    <div
                                                        className="invalid-feedback d-block">{userInfoErr.passwordErr}</div>
                                                )}
                                            </div>
                                            <div className="mb-2">
                                                <label className="form-label">Confirm Password</label>
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="confirmPassword"
                                                    autoComplete="new-password"
                                                    className={`form-control ${userInfoErr.confirmPasswordErr ? 'is-invalid' : ''}`}
                                                    placeholder="Confirm password"
                                                    value={userInfo.confirmPassword}
                                                    onChange={e => handleUserInfoChange('confirmPassword', e.target.value)}
                                                    required
                                                />
                                                {userInfoErr.confirmPasswordErr && (
                                                    <div
                                                        className="invalid-feedback d-block">{userInfoErr.confirmPasswordErr}</div>
                                                )}
                                            </div>

                                            <div className="form-check my-3 text-center">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={agreedToTerms}
                                                    onChange={() => setAgreedToTerms(!agreedToTerms)}
                                                    id="termsCheck"
                                                />
                                                <label className="form-check-label ps-2" htmlFor="termsCheck">
                                                    I accept the <a href="#" target="_blank" className="text-primary">terms
                                                    of service <IconExternalLink size={14}/></a> and <a href="#"
                                                                                                        target="_blank"
                                                                                                        className="text-primary">privacy
                                                    policy <IconExternalLink size={14}/></a>
                                                </label>
                                            </div>

                                            <div className="form-footer mt-4">
                                                <button
                                                    type="submit"
                                                    disabled={!agreedToTerms || disableSignupBtn}
                                                    className="btn btn-primary w-100 py-2 rounded-2 d-flex align-items-center justify-content-center">
                                                    <span>Sign Up</span>
                                                    {disableSignupBtn && (
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
                                    {/*       className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center"*/}
                                    {/*       style={{minHeight: 44}}>*/}
                                    {/*        <IconBrandGoogle size={20}/>*/}
                                    {/*        <span className="ms-2">Signup with Google</span>*/}
                                    {/*    </a>*/}
                                    {/*</div>*/}
                                </div>
                                <div className="text-center text-muted mt-4">
                                    Already have an account? <a className="text-primary" href="/login"
                                                                tabIndex="-1">Login</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 d-none d-lg-flex align-items-center">
                            <img src="/static/illustrations/qrcentraal_illustration_1_t.png"
                                 style={{maxHeight: 420, objectFit: "contain"}}
                                 className="d-block mx-auto"
                                 alt="Shopemaa illustration"
                            />
                        </div>
                    </div>
                </div>
                <Toaster/>
            </div>
        </>
    )
}

export const getStaticProps = async () => {
    return {
        props: {}, revalidate: 60
    }
}
