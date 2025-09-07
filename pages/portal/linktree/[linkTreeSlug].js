import React from 'react'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import PoweredBy from "../../../components/PoweredBy";
import AppHead from "../../../components/AppHead";
import LinkTreeThemeDefault from "../../../components/linktree/LinkTreeThemeDefault";

export default function LinkTreeIndex() {

    return (<>
        <Head title={`Link Tree`}/>
        <LinkTreeThemeDefault/>
        <PoweredBy/>
    </>)
}

export const getServerSideProps = async ({req, query, resolvedUrl}) => {
    let projectSlug = query.linkTreeSlug

    // Pass data to the page via props
    return {
        props: {}
    }
}
