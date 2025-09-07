import React from 'react';

function SuccessMessage({message}) {
    return (
        <div
            className="d-flex justify-content-center align-items-center bg-success-lt border border-success rounded shadow-sm p-3 position-relative"
            role="alert"
            style={{minHeight: '80px', transition: 'all 0.2s ease'}}>
            <div className="d-flex align-items-center">
                <div
                    className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{width: 40, height: 40}}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-circle-check"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        strokeWidth="3"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z"/>
                        <path d="M9 12l2 2l4 -4"/>
                        <path d="M12 20a8 8 0 1 0 0 -16a8 8 0 0 0 0 16z"/>
                    </svg>
                </div>

                <div className="ms-3 fw-semibold text-center">
                    {message}
                </div>
            </div>
        </div>
    );
}

export default SuccessMessage;
