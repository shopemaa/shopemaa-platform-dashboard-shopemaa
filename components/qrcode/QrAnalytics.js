import React, {useEffect, useState} from "react";
import {analyticsApi} from "../../qrcode_api";
import {handleApi} from "../../common_api";
import Cookies from "js-cookie";
import {QrCentraalCooKieAccessToken} from "../../utils/cookie";
import {mapProjectTypeToResourceUrl, prettifyDuration} from "../../helpers/helpers";
import ProcessingRequestMsgModal from "../modals/ProcessingRequestMsgModal";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const BRAND_COLOR = "#214a3b";
const METRIC_CARD_BG = "#f5faf7";
const SCAN_COLOR = "#25be7b";
const UNIQUE_COLOR = "#214a3b";

const todayStr = () => new Date().toISOString().slice(0, 10);

const QrAnalytics = ({project}) => {
    const [accessToken] = useState(Cookies.get(QrCentraalCooKieAccessToken));
    const [showProcessingModal, setShowProcessingModal] = useState(false);
    const [metrics, setMetrics] = useState({
        totalVisits: 0,
        uniqueVisits: 0,
        visitsPerUser: 0,
        bounceRate: 0,
        visitDuration: 0,
        geoBreakdown: [],
        deviceBreakdown: [],
        timeseries: []
    });

    // Date range state
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [dateError, setDateError] = useState("");

    useEffect(() => {
        if (project) {
            setShowProcessingModal(true);
            loadAnalytics();
        }
        // eslint-disable-next-line
    }, [project]);

    const loadAnalytics = (dateRange) => {
        setShowProcessingModal(true);
        const analyticsClient = analyticsApi(accessToken);
        handleApi(
            null,
            analyticsClient.analyticsTraffic(project.id, dateRange || {fromDate: null, toDate: null})
        )
            .then((resp) => {
                let data = resp.data || {};
                setMetrics({
                    totalVisits: data.total_visits || 0,
                    uniqueVisits: data.unique_visits || 0,
                    visitsPerUser: data.visit_per_user || 0,
                    bounceRate: data.bounce_rate || 0,
                    visitDuration: data.avg_session_duration || 0,
                    geoBreakdown: Array.isArray(data.geo_breakdowns) ? data.geo_breakdowns : [],
                    deviceBreakdown: Array.isArray(data.device_breakdowns) ? data.device_breakdowns : [],
                    timeseries: Array.isArray(data.timeseries) ? data.timeseries : []
                });
            })
            .catch(console.error)
            .finally(() => setShowProcessingModal(false));
    };

    const handleDateChange = (which, val) => {
        setDateError("");
        if (which === "from") setFromDate(val);
        if (which === "to") setToDate(val);
    };

    const handleViewRange = () => {
        setDateError("");
        if (fromDate && toDate && fromDate > toDate) {
            setDateError("“From” date cannot be after “To” date.");
            return;
        }
        loadAnalytics({
            fromDate: fromDate || null,
            toDate: toDate || null
        });
    };

    return (
        <div>
            <ProcessingRequestMsgModal
                show={showProcessingModal}
                title="Hold tight"
                message="Getting QR Analytics..."
            />

            <div className="container-xl py-3">
                {/* Breadcrumb */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb bg-transparent px-0" style={{fontSize: 15}}>
                        <li className="breadcrumb-item">
                            <a
                                href={`/${mapProjectTypeToResourceUrl(project.type)}/${project.id}`}
                                className="text-brand"
                                style={{textDecoration: "none", color: BRAND_COLOR, fontWeight: 600}}
                            >
                                {project.name}
                            </a>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Analytics
                        </li>
                    </ol>
                </nav>
            </div>

            {/* --- Date range controls --- */}
            <div className="container-xl mb-2">
                <div className="row align-items-center g-2">
                    <div className="col-auto">
                        <label className="form-label mb-0" style={{fontWeight: 500}}>
                            From:
                            <input
                                type="date"
                                className="form-control ms-2"
                                style={{display: "inline-block", width: 150, minWidth: 0}}
                                value={fromDate}
                                max={toDate || todayStr()}
                                onChange={(e) => handleDateChange("from", e.target.value)}
                            />
                        </label>
                    </div>
                    <div className="col-auto">
                        <label className="form-label mb-0" style={{fontWeight: 500}}>
                            To:
                            <input
                                type="date"
                                className="form-control ms-2"
                                style={{display: "inline-block", width: 150, minWidth: 0}}
                                value={toDate}
                                min={fromDate}
                                max={todayStr()}
                                onChange={(e) => handleDateChange("to", e.target.value)}
                            />
                        </label>
                    </div>
                    <div className="col-auto">
                        <button
                            className="btn btn-success px-4"
                            style={{fontWeight: 700, background: BRAND_COLOR, borderRadius: 10}}
                            onClick={handleViewRange}
                        >
                            View
                        </button>
                    </div>
                    {dateError && (
                        <div className="col-12">
                            <span className="text-danger" style={{fontWeight: 500}}>{dateError}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* ----------- Analytics Metrics & Tables ----------- */}
            <div className="container-xl pb-2">
                <div className="row">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm" style={{borderRadius: 14}}>
                            <div className="card-header bg-white" style={{borderRadius: "14px 14px 0 0"}}>
                <span className="h2 mb-0" style={{color: BRAND_COLOR, fontWeight: 800}}>
                  Analytics Overview
                </span>
                            </div>
                            <div className="card-body">
                                <div className="row g-3 mb-4">
                                    <MetricCard label="Unique Scans" value={metrics.uniqueVisits}/>
                                    <MetricCard label="Total Scans" value={metrics.totalVisits}/>
                                    <MetricCard label="Scans Per User" value={metrics.visitsPerUser}/>
                                    <MetricCard label="Bounce Rate" value={metrics.bounceRate + "%"}/>
                                    <MetricCard label="Avg. Visit Duration"
                                                value={prettifyDuration(metrics.visitDuration)}/>
                                </div>
                                <div className="row g-4">
                                    <div className="col-md-6 col-lg-5">
                                        <BreakdownTable
                                            title="Locations"
                                            columns={["Country", "City", "Visits", "%"]}
                                            data={metrics.geoBreakdown.map(geo => [
                                                geo.country,
                                                geo.city,
                                                geo.visits,
                                                (geo.visits_per_user || 0) + "%"
                                            ])}
                                        />
                                    </div>
                                    <div className="col-md-6 col-lg-5">
                                        <BreakdownTable
                                            title="Devices"
                                            columns={["OS", "Browser", "Visits", "%"]}
                                            data={metrics.deviceBreakdown.map(dev => [
                                                dev.os,
                                                dev.browser,
                                                dev.visits,
                                                (dev.visits_per_user || 0) + "%"
                                            ])}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ----------- Analytics Chart ----------- */}
            <div className="container-xl mb-4">
                <div className="card" style={{borderRadius: 14}}>
                    <div className="card-header pb-1 bg-white" style={{borderRadius: "14px 14px 0 0"}}>
            <span className="h4 mb-0" style={{color: BRAND_COLOR, fontWeight: 700}}>
              QR Code Scans Over Time
            </span>
                    </div>
                    <div className="card-body pt-2">
                        <ResponsiveContainer width="100%" height={320}>
                            <LineChart
                                data={metrics.timeseries}
                                margin={{top: 18, right: 25, left: 8, bottom: 8}}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={d => d}
                                    stroke="#8a9b91"
                                    fontSize={14}
                                    minTickGap={8}
                                />
                                <YAxis fontSize={14}/>
                                <Tooltip/>
                                <Legend verticalAlign="top" height={36}/>
                                <Line
                                    type="monotone"
                                    dataKey="unique_scans"
                                    name="Unique Scans"
                                    stroke={UNIQUE_COLOR}
                                    strokeWidth={3}
                                    dot={{r: 3}}
                                    activeDot={{r: 6}}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="total_scans"
                                    name="Total Scans"
                                    stroke={SCAN_COLOR}
                                    strokeWidth={3}
                                    dot={{r: 3}}
                                    activeDot={{r: 6}}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                        {(!metrics.timeseries || metrics.timeseries.length === 0) && (
                            <div className="text-center text-muted mt-4 mb-2">No data to show for selected range.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Styles */}
            <style jsx>{`
                .text-brand {
                    color: ${BRAND_COLOR} !important;
                }

                .metric-card {
                    background: ${METRIC_CARD_BG};
                    border-radius: 1.2em;
                    box-shadow: 0 2px 12px 0 rgba(33, 74, 59, 0.06);
                    border: none;
                    padding: 1.25rem 1.4rem;
                    margin-bottom: 0.5rem;
                }

                .metric-label {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #82978b;
                }

                .metric-value {
                    font-size: 2.1rem;
                    color: ${BRAND_COLOR};
                    font-weight: 800;
                }

                .breakdown-table th,
                .breakdown-table td {
                    font-size: 1rem;
                    padding: 0.42rem 0.65rem;
                }

                .breakdown-table th {
                    color: #214a3bbd;
                    font-weight: 700;
                    background: #f7faf9;
                }

                .breakdown-table tbody tr {
                    background: #fff;
                }

                @media (max-width: 900px) {
                    .metric-value {
                        font-size: 1.35rem;
                    }

                    .metric-label {
                        font-size: 0.97rem;
                    }
                }

                @media (max-width: 767px) {
                    .metric-card {
                        padding: 0.9rem 1rem;
                    }

                    .breakdown-table {
                        min-width: 400px;
                    }
                }

                @media (max-width: 575px) {
                    .metric-card {
                        margin-bottom: 1.1rem;
                    }
                }
            `}</style>
        </div>
    );
};

// Metric card component
function MetricCard({label, value}) {
    return (
        <div className="col-6 col-sm-4 col-md-3 col-lg-2">
            <div className="metric-card text-center">
                <div className="metric-label mb-1">{label}</div>
                <div className="metric-value">{typeof value !== "undefined" ? value : "-"}</div>
            </div>
        </div>
    );
}

// Table for breakdowns (locations/devices)
function BreakdownTable({title, columns, data}) {
    return (
        <div className="card shadow-sm" style={{borderRadius: 12, minHeight: 330}}>
            <div className="card-header pb-2" style={{background: "transparent"}}>
                <h4 className="mb-0" style={{color: "#214a3b", fontWeight: 700}}>{title}</h4>
            </div>
            <div className="table-responsive" style={{borderRadius: 10}}>
                <table className="table breakdown-table mb-0">
                    <thead>
                    <tr>
                        {columns.map((c, i) => (
                            <th key={i}>{c}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {Array.isArray(data) && data.length > 0 ? (
                        data.map((row, idx) => (
                            <tr key={idx}>
                                {row.map((cell, i) => (
                                    <td key={i}>{cell || "-"}</td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="text-center text-muted py-4">
                                No data available.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default QrAnalytics;
