import Document, {Html, Head, Main, NextScript} from 'next/document'
import React from 'react'

class MyDocument extends Document {
    render() {
        return (<Html lang="en">
            <Head>
                <meta charSet="utf-8"/>
                <meta httpEquiv={'X-UA-Compatible'} content="ie=edge"/>

                <link rel="stylesheet"
                      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"/>
                <link href="/css/tabler.css" rel="stylesheet"/>
                <link href="/css/tabler-flags.min.css" rel="stylesheet"/>
                <link href="/css/tabler-payments.min.css" rel="stylesheet"/>
                <link href="/css/tabler-vendors.min.css" rel="stylesheet"/>
            </Head>
            <body>
            <Main/>
            <NextScript/>

            <script src="/libs/apexcharts/dist/apexcharts.min.js" defer/>
            <script src="/libs/jsvectormap/dist/js/jsvectormap.min.js" defer/>
            <script src="/libs/jsvectormap/dist/maps/world.js" defer/>
            <script src="/libs/jsvectormap/dist/maps/world-merc.js" defer/>
            <script src="/libs/tinymce/tinymce.min.js" defer/>
            <script src="/libs/tom-select/dist/js/tom-select.base.min.js" defer/>
            <script src="/js/on-content-load.js" defer/>

            <script src="/js/tabler.min.js" defer/>

            <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/js/all.min.js"/>
            </body>
        </Html>)
    }
}

export default MyDocument
