import React from 'react'
import {IconArrowLeft} from '@tabler/icons-react'

const Error404 = ({title, msg}) => {
    return (
        <>
            <div className="page page-center">
                <div className="container-tight py-4">
                    <div className="empty">
                        <div className="empty-header">404</div>
                        <p className="empty-title">{title}</p>
                        <p className="empty-subtitle text-muted">
                            {msg}
                        </p>

                        <div className="empty-action">
                            <a href="/" className="btn btn-orange">
                                <IconArrowLeft />&nbsp;
                                Take me home
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Error404
