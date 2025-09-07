import React from 'react'

const SubscriptionEndedView = ({hasUsableSubscriptionPlan}) => {
    return (<>
            <div className="page-wrapper">
                <div className="page-body">
                    <div className="container container-tight py-4">
                        <div className="card card-md">
                            <div className="card-body">
                                <h2 className="mb-3 text-center">No active subscription</h2>
                                <p className="text-secondary mb-4">
                                    Keep enjoying QrCentraal - activate your subscription today!
                                </p>

                                <ul className="list-unstyled space-y">
                                    <li className="row g-2">
                                      <span className="col-auto">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon me-1 text-success"
                                             width="24" height="24" viewBox="0 0 24 24" strokeWidth="2"
                                             stroke="currentColor" fill="none" strokeLinecap="round"
                                             strokeLinejoin="round">
                                          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                          <path d="M5 12l5 5l10 -10"/>
                                        </svg>
                                      </span>
                                        <span className="col">
                                        <strong className="d-block">800+ QR codes launched</strong>
                                        <span className="d-block text-secondary">Share unlimited QR codes with trackable actions.</span>
                                      </span>
                                    </li>

                                    <li className="row g-2">
                                      <span className="col-auto">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon me-1 text-success"
                                             width="24" height="24" viewBox="0 0 24 24" strokeWidth="2"
                                             stroke="currentColor" fill="none" strokeLinecap="round"
                                             strokeLinejoin="round">
                                          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                          <path d="M5 12l5 5l10 -10"/>
                                        </svg>
                                      </span>
                                        <span className="col">
                                        <strong className="d-block">Access anywhere</strong>
                                        <span className="d-block text-secondary">Use QrCentraal from web, tablet, or mobile - no limits.</span>
                                      </span>
                                    </li>

                                    <li className="row g-2">
                                      <span className="col-auto">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon me-1 text-success"
                                             width="24" height="24" viewBox="0 0 24 24" strokeWidth="2"
                                             stroke="currentColor" fill="none" strokeLinecap="round"
                                             strokeLinejoin="round">
                                          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                          <path d="M5 12l5 5l10 -10"/>
                                        </svg>
                                      </span>
                                        <span className="col">
                                        <strong className="d-block">Customize your experience</strong>
                                        <span className="d-block text-secondary">Style your QR codes and target your audience your way.</span>
                                      </span>
                                    </li>
                                </ul>

                                <div className="my-4">
                                    <a href="/dashboard/billing/subscription-list" className="btn btn-qrc w-100">
                                        Choose your plan
                                    </a>
                                </div>
                                <p className="text-secondary">
                                    If you need to get a trial please feel free to <a href="#">contact
                                    us</a>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SubscriptionEndedView
