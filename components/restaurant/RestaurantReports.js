import React, {useState, useMemo} from "react";

const BRAND_COLOR = "#214a3b";
const BG_LIGHT = "#f9fbfc";
const summary = {
    sales: 45320,
    orders: 121,
    avgValue: 375,
    topItem: "Margherita Pizza",
    topCategory: "Pizza"
};
const REPORT_DATA = [
    {
        id: "ORD-0202",
        time: "12:45 PM",
        type: "Dine In",
        table: "T01",
        customer: "Arif",
        total: 890,
        payment: "Cash",
        status: "Delivered"
    },
    {
        id: "ORD-0201",
        time: "12:33 PM",
        type: "Takeaway",
        table: "-",
        customer: "Walk-in",
        total: 530,
        payment: "Card",
        status: "Delivered"
    },
    {
        id: "ORD-0200",
        time: "12:02 PM",
        type: "Dine In",
        table: "VIP1",
        customer: "Fatema",
        total: 1340,
        payment: "Mobile",
        status: "Ready"
    },
    {
        id: "ORD-0199",
        time: "11:58 AM",
        type: "Dine In",
        table: "T03",
        customer: "Rahim",
        total: 1070,
        payment: "Cash",
        status: "In Progress"
    },
];
const SALES_CHART = [
    {date: "Jul 26", sales: 6200, orders: 19},
    {date: "Jul 27", sales: 9210, orders: 23},
    {date: "Jul 28", sales: 8100, orders: 18},
    {date: "Jul 29", sales: 11230, orders: 32},
    {date: "Jul 30", sales: 6780, orders: 14},
];
const STATUS_COLOR = {
    Delivered: "#00b341",
    Ready: "#20c997",
    "In Progress": "#f59f00",
    Pending: "#FFA500",
    Cancelled: "#d63939"
};

export default function RestaurantReports({project}) {
    const [dateRange, setDateRange] = useState("last7");
    const [type, setType] = useState("all");
    const [payment, setPayment] = useState("all");

    const filteredData = useMemo(() => {
        // This demo filter does nothing, in real-world use filter data by all 3
        return REPORT_DATA;
    }, [dateRange, type, payment]);

    return (
        <div>
            <div className="container-xl py-3">
                {/* Mobile-friendly Breadcrumb */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb bg-transparent px-0" style={{fontSize: 15, flexWrap: "wrap"}}>
                        <li className="breadcrumb-item active" aria-current="page">
                            <span style={{fontWeight: 500}}>{project.name}</span>
                        </li>

                        <li className="breadcrumb-item">
                            <a href={`/dashboard/restaurants/${project.id}`} className="text-primary"
                               style={{textDecoration: "none"}}>
                                <span style={{fontWeight: 500}}>Dashboard</span>
                            </a>
                        </li>

                        <li className="breadcrumb-item active" aria-current="page">
                            <span style={{fontWeight: 500}}>Reports</span>
                        </li>
                    </ol>
                </nav>
            </div>

            <div className="container-xl py-1">
                {/* Headline */}
                <div className="mb-4">
                    <h1 className="fw-bold mb-1"
                        style={{color: BRAND_COLOR, letterSpacing: ".5px", fontSize: 34}}>Reports & Analytics</h1>
                    <div className="text-muted" style={{fontSize: 17}}>Monitor sales, orders, and key metrics for your
                        restaurant
                    </div>
                </div>
                {/* Filter bar */}
                <div className="d-flex flex-wrap align-items-center gap-3 mb-4 p-3" style={{
                    background: "#fff", borderRadius: 18, boxShadow: "0 3px 24px 0 rgba(33,74,59,0.04)"
                }}>
                    <select className="form-select" style={{maxWidth: 155}} value={dateRange}
                            onChange={e => setDateRange(e.target.value)}>
                        <option value="today">Today</option>
                        <option value="yesterday">Yesterday</option>
                        <option value="last7">Last 7 days</option>
                        <option value="last30">Last 30 days</option>
                    </select>
                    <select className="form-select" style={{maxWidth: 145}} value={type}
                            onChange={e => setType(e.target.value)}>
                        <option value="all">All Types</option>
                        <option value="dinein">Dine In</option>
                        <option value="takeaway">Takeaway</option>
                        <option value="delivery">Delivery</option>
                    </select>
                    <select className="form-select" style={{maxWidth: 155}} value={payment}
                            onChange={e => setPayment(e.target.value)}>
                        <option value="all">All Payments</option>
                        <option value="cash">Cash</option>
                        <option value="card">Card</option>
                        <option value="mobile">Mobile</option>
                    </select>
                    <button className="btn ms-auto" style={{
                        background: BRAND_COLOR, color: "#fff", borderRadius: 14, fontWeight: 500, minWidth: 100
                    }}>
                        Export CSV
                    </button>
                </div>
                {/* Summary Cards */}
                <div className="row g-3 mb-4">
                    <div className="col-6 col-md-3 col-lg-2">
                        <div className="card text-center shadow-sm border-0" style={{
                            borderRadius: 22, background: "#fff", transition: "box-shadow .2s", cursor: "pointer"
                        }}>
                            <div className="card-body py-4">
                                <div className="fs-4 fw-bold mb-1" style={{color: BRAND_COLOR}}>৳{summary.sales}</div>
                                <div className="text-muted" style={{fontSize: 15}}>Total Sales</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3 col-lg-2">
                        <div className="card text-center shadow-sm border-0" style={{
                            borderRadius: 22, background: "#fff", transition: "box-shadow .2s", cursor: "pointer"
                        }}>
                            <div className="card-body py-4">
                                <div className="fs-4 fw-bold mb-1" style={{color: BRAND_COLOR}}>{summary.orders}</div>
                                <div className="text-muted" style={{fontSize: 15}}>Total Orders</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3 col-lg-2">
                        <div className="card text-center shadow-sm border-0" style={{
                            borderRadius: 22, background: "#fff", transition: "box-shadow .2s", cursor: "pointer"
                        }}>
                            <div className="card-body py-4">
                                <div className="fs-4 fw-bold mb-1"
                                     style={{color: BRAND_COLOR}}>৳{summary.avgValue}</div>
                                <div className="text-muted" style={{fontSize: 15}}>Avg. Order</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3 col-lg-3">
                        <div className="card text-center shadow-sm border-0" style={{
                            borderRadius: 22, background: "#fff", transition: "box-shadow .2s", cursor: "pointer"
                        }}>
                            <div className="card-body py-4">
                                <div className="fs-4 fw-bold mb-1" style={{color: BRAND_COLOR}}>{summary.topItem}</div>
                                <div className="text-muted" style={{fontSize: 15}}>Top Item</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3 col-lg-3">
                        <div className="card text-center shadow-sm border-0" style={{
                            borderRadius: 22, background: "#fff", transition: "box-shadow .2s", cursor: "pointer"
                        }}>
                            <div className="card-body py-4">
                                <div className="fs-4 fw-bold mb-1"
                                     style={{color: BRAND_COLOR}}>{summary.topCategory}</div>
                                <div className="text-muted" style={{fontSize: 15}}>Top Category</div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Chart and Table */}
                <div className="row g-4">
                    {/* Animated Sales Chart */}
                    <div className="col-lg-6">
                        <div className="card shadow-sm border-0" style={{
                            borderRadius: 22, background: "#fff"
                        }}>
                            <div className="card-header" style={{
                                background: "#f7f8fa", color: BRAND_COLOR, fontWeight: "bold",
                                borderRadius: "22px 22px 0 0"
                            }}>
                                Sales & Orders Trend
                            </div>
                            <div className="card-body">
                                <div style={{
                                    height: 200,
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "flex-end",
                                    gap: 16,
                                    marginBottom: 10
                                }}>
                                    {SALES_CHART.map((data, i) => (
                                        <div key={data.date} style={{
                                            flex: 1, display: "flex", flexDirection: "column", alignItems: "center"
                                        }}>
                                            <div style={{
                                                background: BRAND_COLOR,
                                                borderRadius: 8,
                                                width: 22,
                                                height: `${Math.max(data.sales / 60, 24)}px`,
                                                transition: "height .5s cubic-bezier(.6,1.4,.62,1.01)"
                                            }} title={`৳${data.sales} Sales`}/>
                                            <div style={{
                                                background: "#51cf66",
                                                borderRadius: 8,
                                                width: 22,
                                                marginTop: 4,
                                                height: `${Math.max(data.orders * 6, 10)}px`,
                                                transition: "height .5s cubic-bezier(.6,1.4,.62,1.01)"
                                            }} title={`${data.orders} Orders`}/>
                                            <div className="small mt-2 text-muted">{data.date}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="small mt-2 d-flex gap-4">
                  <span>
                    <span style={{
                        background: BRAND_COLOR, width: 16, height: 9, display: "inline-block",
                        borderRadius: 3, marginRight: 7, verticalAlign: "middle"
                    }}></span>
                    Sales
                  </span>
                                    <span>
                    <span style={{
                        background: "#51cf66", width: 16, height: 9, display: "inline-block",
                        borderRadius: 3, marginRight: 7, verticalAlign: "middle"
                    }}></span>
                    Orders
                  </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Orders Table */}
                    <div className="col-lg-6">
                        <div className="card shadow-sm border-0" style={{
                            borderRadius: 22, background: "#fff"
                        }}>
                            <div className="card-header" style={{
                                background: "#f7f8fa", color: BRAND_COLOR, fontWeight: "bold",
                                borderRadius: "22px 22px 0 0"
                            }}>
                                Orders Detail
                            </div>
                            <div className="card-body p-0">
                                <div style={{overflowX: "auto"}}>
                                    <table className="table table-borderless align-middle mb-0">
                                        <thead>
                                        <tr style={{background: "#f3f4f6"}}>
                                            <th>Order</th>
                                            <th>Time</th>
                                            <th>Type</th>
                                            <th>Table</th>
                                            <th>Customer</th>
                                            <th>Total</th>
                                            <th>Payment</th>
                                            <th>Status</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {filteredData.map(row => (
                                            <tr key={row.id} className="hover-row">
                                                <td className="fw-bold" style={{color: BRAND_COLOR}}>{row.id}</td>
                                                <td>{row.time}</td>
                                                <td>{row.type}</td>
                                                <td>{row.table}</td>
                                                <td>{row.customer}</td>
                                                <td>৳{row.total}</td>
                                                <td>{row.payment}</td>
                                                <td>
                            <span className="badge" style={{
                                background: STATUS_COLOR[row.status] || "#888", color: "#fff"
                            }}>{row.status}</span>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="card-footer d-flex justify-content-end"
                                 style={{background: "#fff", borderBottomLeftRadius: 22, borderBottomRightRadius: 22}}>
                                <button className="btn" style={{
                                    background: BRAND_COLOR, color: "#fff", borderRadius: 14, fontWeight: 500
                                }}>
                                    Export to CSV
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
