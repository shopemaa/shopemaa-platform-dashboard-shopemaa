import {useEffect} from 'react'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import Footer from '../components/Footer'
import Header from '../components/Header'

export default function Pricing() {

    useEffect(() => {
        // if (error) {
        //     addToast(error.message, {
        //         appearance: 'error'
        //     })
        // }
    }, [])

    return (<>
        <div className="page">
            <Header user={{}} />

            <div className="page-wrapper">
                <div className="page-header d-print-none">
                    <div className="container-xl">
                        <div className="row g-2 align-items-center">
                            <h1 style={{fontSize: '48px'}} className={'text-center'}>
                                Pricing plans
                            </h1>
                        </div>
                        <div className="row align-items-center">
                            <h4 className={'text-center'}>
                                No transaction fees, no hidden costs
                            </h4>
                        </div>
                    </div>
                </div>

                <div className="page-body">
                    <div className="container-xl">
                        <div className="card">
                            <div className="table-responsive">
                                <table className="table table-vcenter table-bordered table-nowrap card-table">
                                    <thead>
                                    <tr>
                                        <td className="w-50">
                                            <div className="text-muted text-wrap">
                                                Choose an affordable plan that comes with the best features to engage
                                                your audience and increase sales.
                                            </div>
                                        </td>

                                        <td className="text-center">
                                            <div className="text-uppercase text-muted font-weight-medium">Starter</div>
                                            <div className="display-6 fw-bold my-3">$0</div>
                                            <a href="#" className="btn w-100">Choose plan</a>
                                        </td>
                                        <td className="text-center">
                                            <div className="text-uppercase text-muted font-weight-medium">Professional
                                            </div>
                                            <div className="display-6 fw-bold my-3">$9</div>
                                            <a href="#" className="btn btn-green w-100">Choose plan</a>
                                        </td>
                                        <td className="text-center">
                                            <div className="text-uppercase text-muted font-weight-medium">Business</div>
                                            <div className="display-6 fw-bold my-3">$16</div>
                                            <a href="#" className="btn w-100">Choose plan</a>
                                        </td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr className="bg-light">
                                        <th colSpan="4" className="subheader">Features</th>
                                    </tr>
                                    <tr>
                                        <td>Some info about feature</td>
                                        <td className="text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon text-green"
                                                 width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
                                                 stroke="currentColor" fill="none" stroke-linecap="round"
                                                 stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M5 12l5 5l10 -10" />
                                            </svg>
                                        </td>
                                        <td className="text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon text-green"
                                                 width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
                                                 stroke="currentColor" fill="none" stroke-linecap="round"
                                                 stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M5 12l5 5l10 -10" />
                                            </svg>
                                        </td>
                                        <td className="text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon text-green"
                                                 width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
                                                 stroke="currentColor" fill="none" stroke-linecap="round"
                                                 stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M5 12l5 5l10 -10" />
                                            </svg>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Online payment gateway</td>
                                        <td className="text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon text-red" width="24"
                                                 height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                                                 fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M18 6l-12 12" />
                                                <path d="M6 6l12 12" />
                                            </svg>
                                        </td>
                                        <td className="text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon text-green"
                                                 width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
                                                 stroke="currentColor" fill="none" stroke-linecap="round"
                                                 stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M5 12l5 5l10 -10" />
                                            </svg>
                                        </td>
                                        <td className="text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon text-green"
                                                 width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
                                                 stroke="currentColor" fill="none" stroke-linecap="round"
                                                 stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M5 12l5 5l10 -10" />
                                            </svg>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Unlimited products can be sold</td>
                                        <td className="text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon text-red" width="24"
                                                 height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                                                 fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M18 6l-12 12" />
                                                <path d="M6 6l12 12" />
                                            </svg>
                                        </td>
                                        <td className="text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon text-red" width="24"
                                                 height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                                                 fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M18 6l-12 12" />
                                                <path d="M6 6l12 12" />
                                            </svg>
                                        </td>
                                        <td className="text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon text-green"
                                                 width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
                                                 stroke="currentColor" fill="none" stroke-linecap="round"
                                                 stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M5 12l5 5l10 -10" />
                                            </svg>
                                        </td>
                                    </tr>
                                    <tr className="bg-light">
                                        <th colSpan="4" className="subheader">Reporting</th>
                                    </tr>
                                    <tr>
                                        <td>Free hosting and domain name</td>
                                        <td className="text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon text-green"
                                                 width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
                                                 stroke="currentColor" fill="none" stroke-linecap="round"
                                                 stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M5 12l5 5l10 -10" />
                                            </svg>
                                        </td>
                                        <td className="text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon text-green"
                                                 width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
                                                 stroke="currentColor" fill="none" stroke-linecap="round"
                                                 stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M5 12l5 5l10 -10" />
                                            </svg>
                                        </td>
                                        <td className="text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon text-green"
                                                 width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
                                                 stroke="currentColor" fill="none" stroke-linecap="round"
                                                 stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M5 12l5 5l10 -10" />
                                            </svg>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Admin dashboard to control items</td>
                                        <td className="text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon text-green"
                                                 width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
                                                 stroke="currentColor" fill="none" stroke-linecap="round"
                                                 stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M5 12l5 5l10 -10" />
                                            </svg>
                                        </td>
                                        <td className="text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon text-green"
                                                 width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
                                                 stroke="currentColor" fill="none" stroke-linecap="round"
                                                 stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M5 12l5 5l10 -10" />
                                            </svg>
                                        </td>
                                        <td className="text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon text-green"
                                                 width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
                                                 stroke="currentColor" fill="none" stroke-linecap="round"
                                                 stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M5 12l5 5l10 -10" />
                                            </svg>
                                        </td>
                                    </tr>
                                    <tr className="bg-light">
                                        <th colSpan="4" className="subheader">Support</th>
                                    </tr>
                                    <tr>
                                        <td>Email marketing and service</td>
                                        <td className="text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon text-red" width="24"
                                                 height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                                                 fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M18 6l-12 12" />
                                                <path d="M6 6l12 12" />
                                            </svg>
                                        </td>
                                        <td className="text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon text-red" width="24"
                                                 height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                                                 fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M18 6l-12 12" />
                                                <path d="M6 6l12 12" />
                                            </svg>
                                        </td>
                                        <td className="text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon text-green"
                                                 width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
                                                 stroke="currentColor" fill="none" stroke-linecap="round"
                                                 stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M5 12l5 5l10 -10" />
                                            </svg>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>24/7 customer support online</td>
                                        <td className="text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon text-red" width="24"
                                                 height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                                                 fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M18 6l-12 12" />
                                                <path d="M6 6l12 12" />
                                            </svg>
                                        </td>
                                        <td className="text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon text-green"
                                                 width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
                                                 stroke="currentColor" fill="none" stroke-linecap="round"
                                                 stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M5 12l5 5l10 -10" />
                                            </svg>
                                        </td>
                                        <td className="text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon text-green"
                                                 width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
                                                 stroke="currentColor" fill="none" stroke-linecap="round"
                                                 stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M5 12l5 5l10 -10" />
                                            </svg>
                                        </td>
                                    </tr>
                                    </tbody>
                                    <tfoot>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <a href="#" className="btn w-100">Choose plan</a>
                                        </td>
                                        <td>
                                            <a href="#" className="btn btn-green w-100">Choose plan</a>
                                        </td>
                                        <td>
                                            <a href="#" className="btn w-100">Choose plan</a>
                                        </td>
                                    </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    </>)
}

export const getStaticProps = async () => {
    return {
        props: {}, revalidate: 60
    }
}
