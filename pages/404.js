import {IconArrowLeft} from '@tabler/icons-react'
import Link from 'next/link'
import AppHead from "../components/AppHead";

const pageNotFound = () => {
    return (
        <>
            <AppHead/>

            <div className="page page-center">
                <div className="container-tight py-4">
                    <div className="empty">
                        <div className="empty-header">404</div>
                        <p className="empty-title">Houston, we have a problem!</p>
                        <p className="empty-subtitle text-muted">
                            The page you're looking for is on a coffee break. Apparently, even websites need their
                            caffeine
                            fix.
                        </p>
                        <div className="empty-action">
                            <Link href="/" className="btn btn-qrc">
                                <IconArrowLeft/>&nbsp;
                                Take me home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default pageNotFound
