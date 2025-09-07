import React from 'react';

function FailureMessage({message}) {
    return (
        <div
            className="d-flex justify-content-center align-items-center bg-danger-lt border border-danger rounded shadow-sm p-3 position-relative"
            role="alert"
            style={{minHeight: '80px', transition: 'all 0.2s ease'}}>
            <div className="d-flex align-items-center">
                <div
                    className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{width: 40, height: 40}}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-x-circle"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        strokeWidth="3"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z"/>
                        <circle cx="12" cy="12" r="9"/>
                        <path d="M10 10l4 4m0 -4l-4 4"/>
                    </svg>
                </div>

                <div className="ms-3 fw-semibold text-center text-danger">
                    {message}
                </div>
            </div>
        </div>
    );
}

export default FailureMessage;
