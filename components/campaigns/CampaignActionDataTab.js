import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {QrCentraalCooKieAccessToken} from "../../utils/cookie";
import {campaignApi} from "../../qrcode_api";
import {handleApi} from "../../common_api";
import CampaignSubscriberList from "./CampaignSubscriberList";

const PER_PAGE = 10;

const CampaignActionDataTab = ({project}) => {
    const [actionEventTitle, setActionEventTitle] = useState("Campaign Data");
    const [showLoader, setShowLoader] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [total, setTotal] = useState(0);

    const [accessToken] = useState(Cookies.get(QrCentraalCooKieAccessToken));
    const [subscribers, setSubscribers] = useState([]);

    // Debounce search input
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(t);
    }, [search]);

    // Fetch data
    useEffect(() => {
        if (project && project.campaign) {
            if (project.campaign.campaign_action === "SUBSCRIBE") {
                setActionEventTitle("Subscribers");
                fetchSubscribers();
            } else if (project.campaign.campaign_action === "FEEDBACK") {
                setActionEventTitle("Feedbacks");
                // fetchFeedbacks() etc
            }
        }
        // eslint-disable-next-line
    }, [project, page, debouncedSearch]);

    // Reset to page 1 if campaign/project changes
    useEffect(() => setPage(1), [project?.id]);

    const fetchSubscribers = () => {
        setShowLoader(true);
        let campaignClient = campaignApi(accessToken);
        handleApi(
            null,
            campaignClient.listCampaignSubscribedUsers(
                project.id,
                PER_PAGE,
                page - 1, // backend: pageIndex
                {query: debouncedSearch || null}
            )
        )
            .then((response) => {
                setSubscribers(response.data || []);
                setTotal(response.data?.length || 0);
            })
            .catch((error) => {
                setSubscribers([]);
                setTotal(0);
                console.error(error);
            })
            .finally(() => setShowLoader(false));
    };

    const onExport = () => {
        // implement your export logic here!
        alert("Export not implemented yet.");
    };

    return (
        <div className="row row-deck row-cards">
            <div className="col-12">
                <div className="card">
                    <div className="card-body border-bottom py-3">
                        <div className="d-flex flex-wrap align-items-center gap-2">
              <span className="h3 mb-0" style={{color: "#214a3b", fontWeight: 700, paddingLeft: 6}}>
                {actionEventTitle}
              </span>
                            <button className="btn btn-sm btn-qrc ms-3" onClick={onExport}>
                                Export
                            </button>
                            <div className="ms-auto d-flex align-items-center">
                                <span className="me-2 text-secondary">Search:</span>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    aria-label="Search subscribers"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Name, email or phone"
                                    style={{minWidth: 180, background: "#f6f8f8"}}
                                />
                            </div>
                        </div>
                    </div>

                     {project?.campaign?.campaign_action === "SUBSCRIBE" ? (
                      <CampaignSubscriberList
                         subscribers={subscribers}
                         showLoader={showLoader}
                        />
                     ) : (
                     <div className="p-5">No subscribers yet</div>
                      )}

                    {/* Pagination */}
                    {!showLoader && total > PER_PAGE && (
                        <div className="card-footer d-flex justify-content-end align-items-center">
              <span className="me-3 small text-muted">
                Page <b>{page}</b> of <b>{Math.ceil(total / PER_PAGE)}</b> ({total} total)
              </span>
                            <nav>
                                <ul className="pagination mb-0" style={{gap: 4}}>
                                    <li className={`page-item${page === 1 ? " disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => setPage(page - 1)}
                                            disabled={page === 1}
                                            aria-label="Previous page"
                                        >
                                            &lt;
                                        </button>
                                    </li>
                                    {[...Array(Math.ceil(total / PER_PAGE))].map((_, i) => (
                                        <li key={i} className={`page-item${page === i + 1 ? " active" : ""}`}>
                                            <button
                                                className="page-link"
                                                style={{
                                                    borderRadius: 14,
                                                    fontWeight: 500,
                                                    color: page === i + 1 ? "#fff" : "#214a3b",
                                                    background: page === i + 1 ? "#214a3b" : "#fff",
                                                    borderColor: "#e0e6eb",
                                                }}
                                                onClick={() => setPage(i + 1)}
                                            >
                                                {i + 1}
                                            </button>
                                        </li>
                                    ))}
                                    <li className={`page-item${page === Math.ceil(total / PER_PAGE) ? " disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => setPage(page + 1)}
                                            disabled={page === Math.ceil(total / PER_PAGE)}
                                            aria-label="Next page"
                                        >
                                            &gt;
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CampaignActionDataTab;