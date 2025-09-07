import {useState} from 'react'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import {IconEye, IconEyeOff} from '@tabler/icons-react'
import AppHead from "../components/AppHead";
import toast, {Toaster} from "react-hot-toast";

export default function ResetPassword() {
    // These would come from your password-reset link
    // const email = "user@email.com"
    // const token = "...."

    // Simulate email from query or prop
    const email = "user@email.com";

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState('');

    const validate = () => {
        if (!password || !confirmPassword) return "All fields are required";
        if (password.length < 8) return "Password must be at least 8 characters";
        if (password !== confirmPassword) return "Passwords do not match";
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        const err = validate();
        if (err) {
            setError(err);
            return;
        }
        setSubmitting(true);

        try {
            // TODO: Replace with your API call for password reset.
            // await api.resetPassword({email, token, password});
            await new Promise(r => setTimeout(r, 1200)); // simulate API

            setSuccess("Your password has been updated. You may now log in.");
            toast.success("Password updated! You can log in.", {position: "top-center"});
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
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
                                        <img src="/qrc/qrc-group2_2x.png" height="40" alt="QR Centraal Logo"/>
                                    </a>
                                </div>
                                <div className="card card-md shadow-lg border-0 rounded-3">
                                    <div className="card-body py-4 px-4 px-md-5">
                                        <h2 className="h2 text-center mb-4 text-qrc">Create New Password</h2>
                                        <form onSubmit={handleSubmit} autoComplete="off" noValidate>
                                            <div className="mb-3">
                                                <label className="form-label">Email address</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    value={email}
                                                    disabled
                                                />
                                            </div>
                                            <div className="mb-2">
                                                <label className="form-label">New Password</label>
                                                <div className="input-group input-group-flat">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        className={`form-control ${error ? "is-invalid" : ""}`}
                                                        placeholder="Your password"
                                                        autoComplete="off"
                                                        value={password}
                                                        onChange={e => setPassword(e.target.value)}
                                                        minLength={8}
                                                        disabled={submitting}
                                                    />
                                                    <span className="input-group-text">
                                                        <button
                                                            type="button"
                                                            className="link-secondary border-0 bg-transparent"
                                                            title={showPassword ? "Hide password" : "Show password"}
                                                            tabIndex={-1}
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            style={{outline: "none"}}
                                                        >
                                                            {showPassword ? <IconEyeOff/> : <IconEye/>}
                                                        </button>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mb-2">
                                                <label className="form-label">Confirm New Password</label>
                                                <div className="input-group input-group-flat">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        className={`form-control ${error ? "is-invalid" : ""}`}
                                                        placeholder="Confirm password"
                                                        autoComplete="off"
                                                        value={confirmPassword}
                                                        onChange={e => setConfirmPassword(e.target.value)}
                                                        minLength={8}
                                                        disabled={submitting}
                                                    />
                                                </div>
                                            </div>
                                            {error && <div className="invalid-feedback d-block mb-2">{error}</div>}
                                            {success && <div className="text-success small mb-2">{success}</div>}
                                            <div className="form-footer mt-2">
                                                <button
                                                    type="submit"
                                                    className="btn btn-qrc w-100"
                                                    disabled={submitting}
                                                >
                                                    {submitting ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2"
                                                                  role="status"></span>
                                                            Updating...
                                                        </>
                                                    ) : (
                                                        "Update Password"
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className="text-center text-muted mt-4">
                                    Remember password?{" "}
                                    <a className="text-qrc" href="/login" tabIndex="-1">
                                        Login
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 d-none d-lg-flex align-items-center">
                            <img
                                src="/static/illustrations/qrcentraal_illustration_1_t.png"
                                style={{maxHeight: 420, objectFit: "contain"}}
                                className="d-block mx-auto"
                                alt="QRCentraal illustration"
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
    return {props: {}, revalidate: 60}
}
