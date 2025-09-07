const FullPageLoader = ({loadingMsg}) => {
    return (
        <div className="page page-center">
            <div className="container container-slim py-4">
                <div className="text-center">
                    <div className="mb-3">
                        <a href="/" className="navbar-brand navbar-brand-autodark">
                            <img src="/qrc/qrc-group3_2x.png" alt={'QrCentraal Logo'}/>
                        </a>
                    </div>
                    <div className="text-muted mb-3">{loadingMsg}</div>
                    <div className="progress progress-sm">
                        <div className="progress-bar progress-bar-indeterminate bg-teal-lt"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FullPageLoader
