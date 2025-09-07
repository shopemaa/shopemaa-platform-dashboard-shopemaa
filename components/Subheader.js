const Subheader = () => {
    return (
        <header className="navbar-expand-md">
            <div className="collapse navbar-collapse" id="navbar-menu">
                <div className="navbar">
                    <div className="container-xl">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link" href="/dashboard/qr-codes/create">
                                        <span className="nav-link-icon d-md-none d-lg-inline-block">
                                            <img src="/svgs/plus_squre.svg" alt="Create QR Code"/>
                                        </span>
                                    <span className="nav-link-title">
                                          Create Project
                                        </span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/dashboard/qr-codes">
                                        <span className="nav-link-icon d-md-none d-lg-inline-block">
                                            <img src="/svgs/qrcode.svg" alt="List QR Codes"/>
                                        </span>
                                    <span className="nav-link-title">
                                          My Projects
                                        </span>
                                </a>
                            </li>
                        </ul>

                        {/*<div className="my-2 my-md-0 flex-grow-1 flex-md-grow-0 order-first order-md-last">*/}
                        {/*    <form action="./" method="get" autoComplete="off" noValidate>*/}
                        {/*        <div className="input-icon">*/}
                        {/*            <span className="input-icon-addon">*/}
                        {/*                <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24"*/}
                        {/*                     height="24"*/}
                        {/*                     viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"*/}
                        {/*                     stroke-linecap="round" stroke-linejoin="round"><path stroke="none"*/}
                        {/*                                                                          d="M0 0h24v24H0z"*/}
                        {/*                                                                          fill="none"/><path*/}
                        {/*                    d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"/><path*/}
                        {/*                    d="M21 21l-6 -6"/></svg>*/}
                        {/*            </span>*/}
                        {/*            <input type="text" value="" className="form-control" placeholder="Search…"*/}
                        {/*                   aria-label="Search in website"/>*/}
                        {/*        </div>*/}
                        {/*    </form>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
        </header>

    )
}

export default Subheader;