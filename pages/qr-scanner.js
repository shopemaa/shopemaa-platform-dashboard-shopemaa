import 'react-responsive-carousel/lib/styles/carousel.min.css'
import AppHead from "../components/AppHead";
import QrScanner from "../components/qrcode/QrScanner";

export default function QrScannerIndex() {
    const handleOnResult = (text) => {
        console.log(text);
    }

    const handleOnError = (err) => {
        console.log(err)
    }

    return (<>
        <AppHead/>

        <div className="page page-center">
            <div className="container container-normal py-4">
                <div className="row align-items-center g-4">
                    <div className="col-lg">
                        <div className="container-tight">
                            <div className="text-center mb-4">
                                <a href="/" className="navbar-brand navbar-brand-autodark">
                                    <img src="/qrc/qrc-group2_2x.png" height="36" alt=""/>
                                </a>
                            </div>

                            <div className="card card-md">
                                <div className="card-body">
                                    <h2 className="h2 text-center mb-4">Qr Scanner</h2>
                                    <QrScanner onResult={handleOnResult} onError={handleOnError} autoStart={true}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export const getStaticProps = async () => {
    return {
        props: {}, revalidate: 60
    }
}
