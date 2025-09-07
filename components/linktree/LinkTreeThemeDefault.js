import React from 'react';

const LinkTreeThemeDefault = () => {
    return (
        <div className="page-wrapper bg-light">
            <div className="container-xl d-flex justify-content-center align-items-center vh-100">
                <div className="card shadow-sm" style={{width: '360px', borderRadius: '20px'}}>
                    {/* Header with background and avatar */}
                    <div
                        className="card-header p-0"
                        style={{backgroundColor: '#5abbaf', borderRadius: '20px 20px 0 0'}}
                    >
                        <div className="d-flex justify-content-center py-5">
              <span className="avatar avatar-xl" style={{border: '4px solid #fff'}}>
                <img
                    src="/avatar.jpg"
                    alt="Jenny Leslie"
                    className="rounded-circle"
                />
              </span>
                        </div>
                    </div>

                    {/* Name and bio */}
                    <div className="card-body text-center">
                        <h3 className="mb-2">Jenny Leslie</h3>
                        <p className="text-muted mb-4">
                            Join me on my social media journey for daily inspiration,
                            positivity, and fun!
                        </p>

                        {/* Link buttons in Linktree style */}
                        <div className="d-grid gap-3">
                            <a
                                href="#"
                                className="d-block w-100 py-3 text-white text-decoration-none"
                                style={{backgroundColor: '#5abbaf', borderRadius: '8px'}}
                            >
                                <div className="d-flex align-items-center justify-content-center">
                                    <i className="ti ti-face-smile me-2"></i>
                                    <span>Jenny's Makeup</span>
                                </div>
                            </a>

                            <a
                                href="#"
                                className="d-block w-100 py-3 text-white text-decoration-none"
                                style={{backgroundColor: '#5abbaf', borderRadius: '8px'}}
                            >
                                <div className="d-flex align-items-center justify-content-center">
                                    <i className="ti ti-brand-instagram me-2"></i>
                                    <span>Instagram Profile</span>
                                </div>
                            </a>

                            <a
                                href="#"
                                className="d-block w-100 py-3 text-white text-decoration-none"
                                style={{backgroundColor: '#5abbaf', borderRadius: '8px'}}
                            >
                                <div className="d-flex align-items-center justify-content-center">
                                    <i className="ti ti-brand-tiktok me-2"></i>
                                    <span>TikTok Videos</span>
                                </div>
                            </a>

                            <a
                                href="#"
                                className="d-block w-100 py-3 text-white text-decoration-none"
                                style={{backgroundColor: '#5abbaf', borderRadius: '8px'}}
                            >
                                <div className="d-flex align-items-center justify-content-center">
                                    <i className="ti ti-brand-youtube me-2"></i>
                                    <span>Trip to Costa Rica</span>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LinkTreeThemeDefault;
