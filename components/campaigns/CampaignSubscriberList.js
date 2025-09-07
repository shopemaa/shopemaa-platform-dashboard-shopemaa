import {useState, useMemo} from "react";
import {IconCircleCheck, IconChevronLeft, IconChevronRight} from "@tabler/icons-react";
import ListItemPlaceholder from "../ListItemPlaceholder";

const PER_PAGE = 10;

const CampaignSubscriberList = ({subscribers = [], showLoader}) => {
    const [page, setPage] = useState(1);

    const totalPages = Math.ceil((subscribers?.length || 0) / PER_PAGE);

    // Memoize paginated data
    const pageSubscribers = useMemo(() => {
        if (!Array.isArray(subscribers)) return [];
        const start = (page - 1) * PER_PAGE;
        return subscribers.slice(start, start + PER_PAGE);
    }, [subscribers, page]);

    // Handle page change
    const goToPage = (p) => {
        setPage(Math.max(1, Math.min(totalPages, p)));
    };

    // Reset to page 1 if subscribers list changes (e.g. new search/filter)
    useMemo(() => setPage(1), [subscribers]);

    const hasSubscribers = Array.isArray(subscribers) && subscribers.length > 0;

    return (
        <div>
            <div className="table-responsive">
                <table className="table card-table table-vcenter text-nowrap datatable mb-0" style={{minWidth: 600}}>
                    <thead className="bg-white sticky-top" style={{zIndex: 1}}>
                    <tr>
                        <th className="text-center">Full Name</th>
                        <th className="text-center">Email</th>
                        <th className="text-center">Phone</th>
                        <th className="text-center"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {showLoader && (
                        <tr>
                            <td colSpan={4}>
                                <ListItemPlaceholder/>
                            </td>
                        </tr>
                    )}

                    {!showLoader && !hasSubscribers && (
                        <tr>
                            <td colSpan={4} className="text-center text-muted py-5">
                                <div className="py-3" style={{fontWeight: 500, color: "#214a3b"}}>
                                    No subscribers yet.
                                </div>
                            </td>
                        </tr>
                    )}

                    {!showLoader &&
                        hasSubscribers &&
                        pageSubscribers.map((subscriber, index) => (
                            <tr key={subscriber.email || subscriber.phone || index}>
                                <td className="text-center align-middle">
                                    {(subscriber.first_name || "") + " " + (subscriber.last_name || "")}
                                </td>
                                <td className="text-center align-middle">
                                    {subscriber.email || "-"}
                                    &nbsp;
                                    {subscriber.is_email_verified && (
                                        <IconCircleCheck
                                            size={18}
                                            color="#22c55e"
                                            title="Verified"
                                            style={{verticalAlign: "-2px"}}
                                        />
                                    )}
                                </td>
                                <td className="text-center align-middle">
                                    {subscriber.phone || "-"}
                                    &nbsp;
                                    {subscriber.is_phone_verified && (
                                        <IconCircleCheck
                                            size={18}
                                            color="#22c55e"
                                            title="Verified"
                                            style={{verticalAlign: "-2px"}}
                                        />
                                    )}
                                </td>
                                <td className="text-center align-middle">
                                    <button
                                        className="btn btn-sm btn-outline-success px-3"
                                        style={{borderRadius: 16, fontWeight: 500, fontSize: "0.98rem"}}
                                        tabIndex={0}
                                    >
                                        Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination controls */}
            {!showLoader && hasSubscribers && totalPages > 1 && (
                <nav className="d-flex justify-content-between align-items-center mt-3" aria-label="Pagination">
                    <div className="small text-muted">
                        Showing <b>{(page - 1) * PER_PAGE + 1}</b>
                        {"-"}
                        <b>{Math.min(page * PER_PAGE, subscribers.length)}</b> of <b>{subscribers.length}</b>
                    </div>
                    <ul className="pagination mb-0" style={{gap: 4}}>
                        <li className={`page-item${page === 1 ? " disabled" : ""}`}>
                            <button
                                className="page-link"
                                style={{borderRadius: 14}}
                                onClick={() => goToPage(page - 1)}
                                disabled={page === 1}
                                aria-label="Previous page"
                            >
                                <IconChevronLeft size={18}/>
                            </button>
                        </li>
                        {[...Array(totalPages)].map((_, i) => (
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
                                    onClick={() => goToPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item${page === totalPages ? " disabled" : ""}`}>
                            <button
                                className="page-link"
                                style={{borderRadius: 14}}
                                onClick={() => goToPage(page + 1)}
                                disabled={page === totalPages}
                                aria-label="Next page"
                            >
                                <IconChevronRight size={18}/>
                            </button>
                        </li>
                    </ul>
                </nav>
            )}

            <style jsx>{`
                .table-responsive {
                    border-radius: 14px;
                    overflow-x: auto;
                }

                .sticky-top {
                    position: sticky !important;
                    top: 0;
                    background: #fff !important;
                }

                .pagination .page-link {
                    border: 1px solid #e0e6eb;
                    color: #214a3b;
                    min-width: 36px;
                    min-height: 36px;
                }

                .pagination .active .page-link {
                    background: #214a3b;
                    color: #fff !important;
                    border-color: #214a3b;
                }

                .pagination .page-link:focus {
                    outline: 2px solid #214a3b2c;
                }

                @media (max-width: 600px) {
                    .table {
                        font-size: 0.97rem;
                    }

                    .pagination .page-link {
                        min-width: 32px;
                        min-height: 32px;
                        font-size: 0.98rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default CampaignSubscriberList;
