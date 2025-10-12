import React from "react";

const summary = [
    {icon: "🧾", value: 41, label: "Orders Today"},
    {icon: "💵", value: "৳15,230", label: "Sales Today"},
    {icon: "⏳", value: 4, label: "Pending Payments"},
    {icon: "🍽️", value: 7, label: "Active Tables"},
    {icon: "📆", value: 3, label: "Reservations"}
];
const recentOrders = [
    {id: "ORD-0194", status: "pending", time: "11:23 AM", total: 1490, customer: "Arif", table: "T04", items: 5},
    {id: "ORD-0193", status: "in_progress", time: "10:59 AM", total: 260, customer: "Walk-in", table: "T01", items: 2},
    {id: "ORD-0192", status: "ready", time: "10:42 AM", total: 1330, customer: "Fatema", table: "VIP1", items: 3},
    {id: "ORD-0191", status: "delivered", time: "10:10 AM", total: 1900, customer: "Rahim", table: "T05", items: 7}
];
const tableStatus = [
    {table: "T01", status: "Active", order: "ORD-0193"},
    {table: "T04", status: "Active", order: "ORD-0194"},
    {table: "VIP1", status: "Active", order: "ORD-0192"},
    {table: "T05", status: "Idle"},
    {table: "T02", status: "Idle"},
    {table: "T03", status: "Idle"}
];
const STATUS_MAP = {
    pending: {color: "#FFA500", label: "Pending", icon: "🕒"},
    accepted: {color: "#228be6", label: "Accepted", icon: "👍"},
    in_progress: {color: "#f59f00", label: "In Progress", icon: "🍕"},
    ready: {color: "#20c997", label: "Ready", icon: "✅"},
    delivered: {color: "#00b341", label: "Delivered", icon: "✔️"},
    cancelled: {color: "#d63939", label: "Cancelled", icon: "❌"}
};

export default function RestaurantDashboard({project}) {
    const tablesActive = tableStatus.filter(t => t.status === "Active");
    const tablesIdle = tableStatus.filter(t => t.status !== "Active");

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
                    </ol>
                </nav>
            </div>

            <div className="container-xl py-1">
                <div className="row g-3 mb-4">
                    {summary.map((item, i) => (
                        <div key={item.label} className="col-6 col-lg-2">
                            <div className="card text-center border-0 shadow-sm"
                                 style={{
                                     borderRadius: 22,
                                     background: "#fff",
                                     transition: "box-shadow .2s",
                                     cursor: "pointer",
                                     minHeight: 25
                                 }}>
                                <div
                                    className="card-body py-4 d-flex flex-column align-items-center justify-content-center">
                                    <div className="fw-bold mb-1 h2">{item.value}</div>
                                    <div className="text-muted small">{item.label}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="row g-4">
                    <div className="col-lg-5">
                        <div className="card shadow-sm border-0 mb-4" style={{borderRadius: 22, background: "#fff"}}>
                            <div className="card-header"
                                 style={{
                                     background: "#f7f8fa",
                                     fontWeight: "bold",
                                     borderRadius: "22px 22px 0 0"
                                 }}>
                                Quick Actions
                            </div>
                            <div className="card-body d-flex flex-wrap gap-2">
                                <a href={`/dashboard/restaurants/${project.id}/orders`}
                                   className="btn flex-grow-1 bg-qrc" style={{
                                    color: "#fff",
                                    fontWeight: 500,
                                    borderRadius: 19,
                                    minWidth: 116,
                                    fontSize: 16
                                }}>
                                    + New Order
                                </a>
                                <a href={`/dashboard/restaurants/${project.id}/menu-items`}
                                   className="btn flex-grow-1 text-primary border-black"
                                   style={{
                                       color: "#fff",
                                       fontWeight: 500,
                                       borderRadius: 19,
                                       minWidth: 116,
                                       fontSize: 16
                                   }}>
                                    Menu
                                </a>

                                <a href={`/dashboard/restaurants/${project.id}/tables`}
                                   className="btn flex-grow-1 text-primary border-black"
                                   style={{
                                       color: "#fff",
                                       fontWeight: 500,
                                       borderRadius: 19,
                                       minWidth: 116,
                                       fontSize: 16
                                   }}>
                                    Manage Tables
                                </a>

                                <button className="btn flex-grow-1 text-primary border-black"
                                        style={{
                                            color: "#fff",
                                            fontWeight: 500,
                                            borderRadius: 19,
                                            minWidth: 116,
                                            fontSize: 16
                                        }}>
                                    Reservations
                                </button>

                                <a href={`/dashboard/restaurants/${project.id}/reports`}
                                   className="btn flex-grow-1 text-primary border-black"
                                   style={{
                                       color: "#fff",
                                       fontWeight: 500,
                                       borderRadius: 19,
                                       minWidth: 116,
                                       fontSize: 16
                                   }}>
                                    Reports
                                </a>

                                <a href={`/dashboard/qr-codes/${project.id}/configure`}
                                   className="btn flex-grow-1 text-primary border-black"
                                   style={{
                                       color: "#fff",
                                       fontWeight: 500,
                                       borderRadius: 19,
                                       minWidth: 116,
                                       fontSize: 16
                                   }}>
                                    QR Code
                                </a>
                            </div>
                        </div>

                        <div className="card shadow-sm border-0"
                             style={{
                                 borderRadius: 22
                             }}>
                            <div className="card-header"
                                 style={{
                                     background: "#f7f8fa",
                                     fontWeight: "bold",
                                     borderRadius: "22px 22px 0 0"
                                 }}>
                                Table Occupancy
                            </div>

                            <div className="card-body d-flex flex-wrap gap-3">
                                {tablesActive.map(t => (
                                    <div key={t.table}
                                         className="d-flex flex-column align-items-center justify-content-center p-2"
                                         style={{
                                             minWidth: 74,
                                             borderRadius: 15,
                                             background: "#eafaf1",
                                             fontWeight: 600,
                                             padding: "13px 0"
                                         }}>
                                        <div style={{fontSize: 19}}>{t.table}</div>
                                        <div className="text-muted small" style={{fontSize: 13}}>{t.order}</div>
                                    </div>
                                ))}
                                {tablesIdle.length > 0 && tablesIdle.map(t => (
                                    <div key={t.table}
                                         className="d-flex flex-column align-items-center justify-content-center"
                                         style={{
                                             minWidth: 74,
                                             borderRadius: 15,
                                             background: "#f3f4f6",
                                             color: "#b1b9b2",
                                             fontWeight: 500,
                                             padding: "13px 0"
                                         }}>
                                        <div style={{fontSize: 19}}>{t.table}</div>
                                        <div className="text-muted small" style={{fontSize: 13}}>Idle</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-7">
                        <div className="card shadow-sm border-0" style={{
                            borderRadius: 22
                        }}>
                            <div className="card-header h3">
                                Live Orders & Timeline
                            </div>

                            <div className="card-body" style={{minHeight: 230}}>
                                {recentOrders.length === 0 ? (
                                    <div className="text-muted">No recent orders.</div>
                                ) : (
                                    <div>
                                        {recentOrders.map(order => (
                                            <div key={order.id}
                                                 className="d-flex align-items-center border-bottom py-2 gap-3 hover-row"
                                                 style={{fontSize: "1.08em"}}>
                                                <span>{STATUS_MAP[order.status]?.icon || "•"}</span>
                                                <div className="flex-grow-1">
                                                    <div>
                                                        <b>{order.id}</b>
                                                        <span className="small text-muted ms-2">{order.time}</span>
                                                    </div>
                                                    <div className="text-muted small">
                                                        {order.customer} &bull; {order.table} &bull; {order.items} items
                                                    </div>
                                                </div>
                                                <span className="fw-bold">
                                                  ৳{order.total}
                                                </span>
                                                <span className="badge p-2"
                                                      style={{
                                                          background: STATUS_MAP[order.status]?.color || "#888",
                                                          color: "#fffff",
                                                      }}>{STATUS_MAP[order.status]?.label || order.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
