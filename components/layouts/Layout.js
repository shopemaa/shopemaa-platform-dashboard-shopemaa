import React, {useEffect} from 'react'
import AppHead from '../AppHead'
import Header from '../Header'
import Footer from '../Footer'

const Layout = ({children}) => {
    useEffect(() => {
    }, [])

    return <>
        <div className="page">
            <AppHead />
            <Header />

            <div className="page-wrapper">
                {children}
                <Footer />
            </div>
        </div>
    </>
}

export default Layout
