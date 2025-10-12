import {IconArrowRight} from '@tabler/icons-react'
import Link from 'next/link'
import {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import AppHead from "../components/AppHead";

const pageInternalServerError = () => {
    const router = useRouter()
    const [callbackUrl, setCallbackUrl] = useState('/')

    useEffect(() => {
        if (router.query.callback_url) {
            setCallbackUrl(decodeURIComponent(router.query.callback_url))
        }
    })

    return (
        <>
            <AppHead/>

            <div className="page page-center">
                <div className="container-tight py-4">
                    <div className="empty">
                        <div className="empty-header">Oops!</div>
                        <p className="empty-title">Our server tripped over its own shoelaces!</p>
                        <p className="empty-subtitle text-muted">
                            Our team of highly trained monkeys has been dispatched to fix this issue.
                            In the meantime, maybe try refreshing the page or coming back in a bit.
                        </p>
                        <div className="empty-action">
                            <Link href={callbackUrl} className="btn btn-primary">
                                <IconArrowRight/>&nbsp;
                                Retry
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default pageInternalServerError
