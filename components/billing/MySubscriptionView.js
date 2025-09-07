import {useEffect, useState} from "react";
import SubscriptionPackageItem from "./SubscriptionPackageItem";
import {formatAmount} from "../../helpers/currency_helper";
import {coreApiUrl, subscriptionApi} from "../../core_api";
import Cookies from "js-cookie";
import {QrCentraalCooKieAccessToken} from "../../utils/cookie";
import {showErrorMessage} from "../../helpers/errors";

const PAGE_SIZE = 10;

const MySubscriptionView = ({activeSubscription, payments: allPayments = []}) => {
    const [accessToken] = useState(Cookies.get(QrCentraalCooKieAccessToken));
    const [currentPage, setCurrentPage] = useState(1);

    // Pagination
    const totalPayments = allPayments.length;
    const totalPages = Math.ceil(totalPayments / PAGE_SIZE);
    const paginatedPayments = allPayments.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const subscriptionPlan = activeSubscription?.subscription_plan ?? null;

    const onChangePlan = () => window.location.replace('/dashboard/billing/subscription-list');

    const getPaymentProductInfo = (payment) =>
        payment.subscription?.subscription_plan
            ? `Subscription: ${payment.subscription.subscription_plan.name}`
            : "General payment";

    const onDownloadInvoice = (payment) => {
        const downloadLink = `${coreApiUrl()}/secure/v1/payments/${payment.id}/download?Authorization=${accessToken}`;
        window.open(downloadLink, '_blank');
    };

    const initiatePayment = (payment) => {
        const host = window.location.origin;
        const subscription = payment.subscription;
        const subscriptionClient = subscriptionApi(accessToken);

        subscriptionClient.initiateSubscriptionCheckout(subscription.id, {
            success_url: `${host}/dashboard/billing?success=true`,
            cancel_url: `${host}/dashboard/billing/subscription-list?success=false`,
        })
            .then(checkoutResp => window.location.replace(checkoutResp.data))
            .catch(showErrorMessage);
    };

    // Pagination button state helpers
    const canGoPrev = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    // Generate page numbers for pagination (show max 5 near current)
    const pageNumbers = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);
    for (let i = start; i <= end; i++) pageNumbers.push(i);

    useEffect(() => {
        // If payments shrink, make sure currentPage is valid
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    return (
        <div className="page-body">
            <div className="container-xl">

                {/* Current Subscription */}
                <div className="card card-md">
                    <div className="card-body">
                        {activeSubscription ? (
                            <div className="row align-items-center">
                                <div className="col-md-6 col-12 mb-3 mb-md-0">
                                    <h2 className="h2">{subscriptionPlan?.name}</h2>
                                    <p className="m-0 text-qrc pb-2">
                                        You’re on the <strong>{subscriptionPlan?.name}</strong> plan.<br/>
                                        Next renewal: <b>{activeSubscription.end_date}</b>.
                                    </p>
                                </div>
                                <div className="col-md-6 col-12">
                                    <SubscriptionPackageItem
                                        key={activeSubscription.subscription_plan.id}
                                        subscription={activeSubscription.subscription_plan}
                                        isActive={true}
                                        showCheckoutCallback={null}
                                        changePlanCallback={onChangePlan}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="text-center">
                                <p className="m-0 text-qrc pb-3">
                                    You do not have an active subscription plan.
                                </p>
                                <button onClick={onChangePlan} className='btn btn-qrc'>
                                    Choose Plan
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Payment History */}
                <div className="card card-md mt-4">
                    <div className="card-body">
                        <h2 className="h2 mb-4 mt-2">Payment History</h2>
                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Product</th>
                                    <th>Status</th>
                                    <th>Amount</th>
                                    <th>Discount</th>
                                    <th>Paid</th>
                                    <th>Date</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {paginatedPayments.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="text-center text-muted">
                                            No payments found.
                                        </td>
                                    </tr>
                                )}
                                {paginatedPayments.map((payment) => (
                                    <tr key={payment.id}>
                                        <td>{payment.id}</td>
                                        <td>{getPaymentProductInfo(payment)}</td>
                                        <td>
                                                <span className={
                                                    payment.payment_status === 'Paid'
                                                        ? "badge bg-success"
                                                        : payment.payment_status === 'Pending'
                                                            ? "badge bg-warning"
                                                            : "badge bg-secondary"
                                                }>
                                                    {payment.payment_status}
                                                </span>
                                        </td>
                                        <td>{formatAmount(payment.amount, payment.currency)}</td>
                                        <td>{formatAmount(payment.discount, payment.currency)}</td>
                                        <td>{formatAmount(payment.payment_amount, payment.currency)}</td>
                                        <td>{payment.created_at?.split('T')[0]}</td>
                                        <td>
                                            {payment.payment_status === 'Pending' ? (
                                                <button
                                                    onClick={() => initiatePayment(payment)}
                                                    className='btn btn-sm btn-qrc px-3'>
                                                    Pay Now
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => onDownloadInvoice(payment)}
                                                    className='btn btn-sm btn-outline-green px-3'>
                                                    Download Invoice
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="card-footer d-flex flex-wrap align-items-center justify-content-between">
                            <div className="text-secondary small flex-grow-1">
                                {totalPayments === 0
                                    ? "No items"
                                    : <>
                                        Showing <b>{(currentPage - 1) * PAGE_SIZE + 1}</b> to <b>{Math.min(currentPage * PAGE_SIZE, totalPayments)}</b> of <b>{totalPayments}</b> payments
                                    </>
                                }
                            </div>
                            <ul className="pagination m-0 ms-auto">
                                <li className={`page-item${!canGoPrev ? " disabled" : ""}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={!canGoPrev}
                                        tabIndex="-1"
                                    >
                                        <span aria-hidden="true">&laquo; Prev</span>
                                    </button>
                                </li>
                                {pageNumbers.map(page => (
                                    <li className={`page-item${page === currentPage ? " active" : ""}`} key={page}>
                                        <button
                                            className="page-link"
                                            onClick={() => setCurrentPage(page)}
                                        >
                                            {page}
                                        </button>
                                    </li>
                                ))}
                                <li className={`page-item${!canGoNext ? " disabled" : ""}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={!canGoNext}
                                    >
                                        <span aria-hidden="true">Next &raquo;</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MySubscriptionView;
