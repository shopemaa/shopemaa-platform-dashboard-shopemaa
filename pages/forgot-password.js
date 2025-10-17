import {useState} from 'react'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import AppHead from "../components/AppHead";
import toast, {Toaster} from "react-hot-toast";

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const isEmailValid = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!email.trim()) {
            setError('Email is required');
            return;
        }
        if (!isEmailValid(email.trim())) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        // Replace with your actual API call:
        try {
            // await yourApiClient.forgotPassword(email.trim());
            // Simulate API
            await new Promise(r => setTimeout(r, 1000));

            setSuccess('If that email is in our system, you’ll receive reset instructions.');
            toast.success('Check your inbox for password reset instructions!', {position: "top-center"});
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
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
                                        <h2 className="h2 text-center mb-4 text-primary">Reset Your Password</h2>
                                        <form onSubmit={handleSubmit} autoComplete="off" noValidate>
                                            <div className="mb-3">
                                                <label className="form-label">Email address</label>
                                                <input
                                                    type="email"
                                                    className={`form-control ${error ? "is-invalid" : ""}`}
                                                    placeholder="your@email.com"
                                                    autoComplete="off"
                                                    value={email}
                                                    onChange={e => {
                                                        setEmail(e.target.value);
                                                        setError('');
                                                        setSuccess('');
                                                    }}
                                                    disabled={loading}
                                                />
                                                {error && (
                                                    <div className="invalid-feedback d-block">{error}</div>
                                                )}
                                                {success && (
                                                    <div className="text-success small pt-1">{success}</div>
                                                )}
                                            </div>
                                            <div className="form-footer mt-3">
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary w-100"
                                                    disabled={loading}
                                                >
                                                    {loading ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2"
                                                                  role="status"></span>
                                                            Sending...
                                                        </>
                                                    ) : (
                                                        "Reset Password"
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className="text-center text-muted mt-4">
                                    Remember password?{" "}
                                    <a className="text-primary" href="/login" tabIndex="-1">
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
