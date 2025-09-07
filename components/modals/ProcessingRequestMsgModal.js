import React from 'react'

const ProcessingRequestMsgModal = ({show, title, message}) => {
    return (
        <div
            className={`modal modal-blur fade ${show ? 'show d-block' : ''}`}
            tabIndex="-1"
            role="dialog"
            aria-hidden={!show}>
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-body">
                        <div className="modal-title">
                            {title}
                        </div>
                        <div className={'pb-2'}>
                            {message}
                        </div>
                        <div className="progress">
                            <div className="progress-bar progress-bar-indeterminate bg-qrc"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProcessingRequestMsgModal
