import React from 'react'
import Head from 'next/head';

const AppHead = ({
                     title,
                     description,
                     bannerImage,
                     faviconUrl = '/qrc/qrc-favicon.png',
                     contentUrl,
                     lang
                 }) => {
    return (
        <Head>
            {contentUrl && (
                <link rel="canonical" href={contentUrl}/>
            )}

            {faviconUrl && (
                <link rel="icon" href={faviconUrl}/>
            )}

            {title && (
                <>
                    <title>{title}</title>
                    <meta property="og:title" content={title}/>
                    <meta property="twitter:title" content={title}/>
                </>
            )}
            {!title && (
                <>
                    <title>QrCentraal - Scan Smarter, Share Greener</title>
                    <meta property="og:title" content="QrCentraal - Scan Smarter, Share Greener"/>
                    <meta property="twitter:title" content="QrCentraal - Scan Smarter, Share Greener"/>
                </>
            )}

            {description && (
                <>
                    <meta name="og:description"
                          content={description}/>
                    <meta name="twitter:description" content={description}/>
                    <meta name="description"
                          content={description}/>
                </>
            )}

            {bannerImage && (
                <>
                    <meta property="og:image" content={bannerImage}/>
                    <meta property="twitter:image" content={bannerImage}/>
                </>
            )}

            {contentUrl && (
                <>
                    <meta property="og:url" content={contentUrl}/>
                </>
            )}

            <meta property="og:type" content="website"/>
        </Head>
    )
}

export default AppHead
