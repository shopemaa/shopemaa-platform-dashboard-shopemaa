import FooterNavItems from './FooterNavItems'
import FooterNavCredit from './FooterNavCredit'

const Footer = () => {
    return (<footer className="footer footer-transparent d-print-none">
        <div className="container-xl">
            <div className="row text-center align-items-center flex-row-reverse">
                <div className="col-lg-auto ms-lg-auto">
                    <ul className="list-inline list-inline-dots mb-0">
                        <FooterNavItems />
                    </ul>
                </div>
                <div className="col-12 col-lg-auto mt-3 mt-lg-0">
                    <ul className="list-inline list-inline-dots mb-0">
                        <FooterNavCredit />
                    </ul>
                </div>
            </div>
        </div>
    </footer>)
}

export default Footer
