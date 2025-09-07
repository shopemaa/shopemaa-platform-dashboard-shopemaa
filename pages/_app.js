import {NextIntlProvider} from "next-intl";
import {useRouter} from "next/router";
import Layout from "../components/layouts/Layout";
import {useEffect} from "react";
import {ToastContainer} from 'react-toastify';
import '../styles/default.scss';
import posthog from "posthog-js";
import {PostHogProvider} from "posthog-js/react";
import Cookies from "js-cookie";
import {QrCentraalDistinctIdKey} from "../utils/cookie";
import {nanoid} from "nanoid";

/*
Portal - is open public facing functionality
Dashboard - is authenticated merchant facing functionality
 */

const pathsWithoutLayout = () => {
    return [
        [/^\/login/],
        [/^\/register/],
        [/^\/forgot-password/],
        [/^\/reset-password/],
        [/^\/verify-email/],
        [/^\/portal/],
        [/^\/404/],
        [/^\/500/],
        [/^\/verify/],
        [/^\/qr-scanner/],
        [/^\/page-viewer/],
        [/^\/page-builder/],
    ]
}

const shouldNotUseLayout = () => {
    const router = useRouter()
    let matched = false
    let paths = pathsWithoutLayout()
    for (let path of paths) {
        matched = path.some((pattern) =>
            pattern.test(router.pathname)
        )

        if (matched) {
            break
        }
    }
    return matched
}

export default function App({Component, pageProps}) {
    // Check if current route matches any pattern
    const useLayout = !shouldNotUseLayout()
    const router = useRouter()

    const initiateOrUserIdentity = (posthog) => {
        let distinctKey = Cookies.get(QrCentraalDistinctIdKey)
        if (!distinctKey) {
            distinctKey = nanoid()
            Cookies.set(QrCentraalDistinctIdKey, distinctKey)
        }
        posthog.identify(distinctKey)
    }

    useEffect(() => {
        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
            api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
            person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
            defaults: '2025-05-24',
            // Enable debug mode in development
            loaded: (posthog) => {
                if (process.env.NODE_ENV === 'development') posthog.debug()
                initiateOrUserIdentity(posthog)
            }
        })
    }, [])

    const content = <>
        <PostHogProvider client={posthog}>
            <Component {...pageProps} />
            <ToastContainer/>
        </PostHogProvider>
    </>

    return (
        <>
            <NextIntlProvider
                // To achieve consistent date, time and number formatting
                // across the app, you can define a set of global formats.
                formats={{
                    dateTime: {
                        short: {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        },
                    },
                }}
                messages={pageProps.messages}
                // Providing an explicit value for `now` ensures consistent formatting of
                // relative values regardless of the server or client environment.
                now={new Date(pageProps.now)}
                // Also an explicit time zone is helpful to ensure dates render the
                // same way on the client as on the server, which might be located
                // in a different time zone.
                timeZone="UTC">
                {useLayout ? <Layout>{content}</Layout> : content}
            </NextIntlProvider>
        </>
    );
}
