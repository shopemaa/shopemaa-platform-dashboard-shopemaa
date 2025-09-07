const FooterNavCredit = () => {
    return (<>
        <li className="list-inline-item">
            &copy; {new Date().getFullYear()} QrCentraal
        </li>
        <li className="list-inline-item">
            All rights reserved
        </li>
        <li className="list-inline-item">
            <a className="link-secondary" rel="noopener">
                Version {process.env.NEXT_PUBLIC_BUILD_HASH ? process.env.NEXT_PUBLIC_BUILD_HASH : 'Unknown'}
            </a>
        </li>
    </>)
}

export default FooterNavCredit
