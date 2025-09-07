import React from "react";

// Demo data for preview/testing:
const RESTAURANT = {
    name: "Grand Plaza Restaurant",
    address: "123 Gulshan Ave, Dhaka",
    phone: "01711-123456",
    logo: "https://tabler.io/static/logo.svg",
    brandColor: "#214a3b"
};

const ORDER = {
    id: "ORD-2024-0192",
    status: "in_progress", // pending, accepted, in_progress, ready, delivered, cancelled
    placedAt: "2025-07-29T20:44:00Z",
    eta: "20-30 min",
    customer: { name: "Sakib", phone: "01712-223344" },
    note: "No onions in the pizza, please.",
    items: [
        {
            name: "Margherita Pizza",
            qty: 2,
            price: 400,
            selectedOptions: { Size: "Medium" },
            selectedExtras: ["Extra Cheese", "Chili Flakes"],
            subtotal: 400 + 60 + 40 + 15
        },
        {
            name: "Coke",
            qty: 1,
            price: 70,
            selectedOptions: {},
            selectedExtras: [],
            subtotal: 70
        }
    ],
    subtotal: 985,
    vat: 69,
    sd: 49,
    service: 99,
    total: 1202
};

const STATUS_MAP = {
    pending:  { color: "#FFA500", label: "Pending", icon: "🕒" },
    accepted: { color: "#228be6", label: "Accepted", icon: "👍" },
    in_progress: { color: "#f59f00", label: "In Progress", icon: "🍕" },
    ready:    { color: "#20c997", label: "Ready for Pickup", icon: "✅" },
    delivered: { color: "#00b341", label: "Delivered", icon: "✔️" },
    cancelled: { color: "#d63939", label: "Cancelled", icon: "❌" }
};

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

export default function CustomerOrderDetails({ order = ORDER, restaurant = RESTAURANT }) {
    const status = STATUS_MAP[order.status] || STATUS_MAP.pending;

    return (
        <div style={{ background: "#f7f8fa", minHeight: "100vh", fontFamily: "Segoe UI, sans-serif" }}>
            {/* Restaurant header */}
            <div style={{
                background: restaurant.brandColor, color: "#fff", padding: "18px 0 12px 0",
                borderBottomLeftRadius: 32, borderBottomRightRadius: 32, marginBottom: 5,
                boxShadow: "0 2px 14px rgba(33,74,59,0.09)",
                position: "sticky", top: 0, zIndex: 100
            }}>
                <div className="container-xl d-flex align-items-center gap-4">
                    <img src={restaurant.logo} alt="logo" style={{
                        height: 46, width: 46, objectFit: "contain", background: "#fff", borderRadius: 13, padding: 5, border: "1px solid #e4e4e4"
                    }} />
                    <div className="flex-grow-1">
                        <div className="fw-bold fs-5">{restaurant.name}</div>
                        <div className="small">{restaurant.address}</div>
                        <div className="small">Call: <a href={`tel:${restaurant.phone}`} style={{ color: "#fff", textDecoration: "underline" }}>{restaurant.phone}</a></div>
                    </div>
                </div>
            </div>

            <div className="container-xl py-4" style={{ maxWidth: 650 }}>
                <div className="card shadow-sm border-0" style={{ borderRadius: 16 }}>
                    {/* Order status */}
                    <div className="card-header d-flex flex-wrap justify-content-between align-items-center" style={{ background: "#fff", borderRadius: "16px 16px 0 0", border: "none" }}>
                        <div className="d-flex align-items-center gap-2">
              <span style={{
                  display: "inline-block", fontSize: 32, verticalAlign: "middle"
              }}>{status.icon}</span>
                            <span style={{
                                fontWeight: 600, color: status.color, fontSize: "1.25em"
                            }}>{status.label}</span>
                        </div>
                        <div className="text-muted small">Order #{order.id}</div>
                    </div>

                    <div className="card-body">
                        {/* ETA and placed at */}
                        <div className="mb-3">
                            <div className="d-flex flex-wrap align-items-center gap-2">
                <span className="badge" style={{ background: restaurant.brandColor, color: "#fff", fontWeight: 500 }}>
                  {formatDate(order.placedAt)}
                </span>
                                {order.eta && <span className="badge bg-info" style={{ fontWeight: 500 }}>ETA: {order.eta}</span>}
                            </div>
                        </div>
                        {/* Customer */}
                        <div className="mb-2 small">
                            <b>Customer:</b> {order.customer.name || "-"}
                            {order.customer.phone && <span className="ms-2">({order.customer.phone})</span>}
                        </div>
                        {order.note && <div className="mb-2"><b>Note:</b> <span className="fst-italic">{order.note}</span></div>}

                        {/* Items */}
                        <div className="mb-2 mt-4 fw-bold" style={{ color: restaurant.brandColor, fontSize: "1.13em" }}>
                            Items Ordered
                        </div>
                        <div>
                            {order.items.map((item, idx) => (
                                <div key={idx} className="d-flex justify-content-between align-items-center border-bottom py-2" style={{ fontSize: "1.09em" }}>
                                    <div>
                                        <span style={{ fontWeight: 600 }}>{item.name}</span>
                                        <span className="text-muted ms-2">x{item.qty}</span>
                                        {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                                            <div className="text-muted small">
                                                {Object.entries(item.selectedOptions).map(([k, v]) => (
                                                    <span key={k}>{k}: {Array.isArray(v) ? v.join(", ") : v}; </span>
                                                ))}
                                            </div>
                                        )}
                                        {item.selectedExtras && item.selectedExtras.length > 0 && (
                                            <div className="text-muted small">Extras: {item.selectedExtras.join(", ")}</div>
                                        )}
                                    </div>
                                    <div className="fw-bold" style={{ color: restaurant.brandColor }}>
                                        ৳{item.subtotal * item.qty}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pricing breakdown */}
                        <div className="mt-4">
                            <div className="d-flex justify-content-between"><span>Subtotal</span><span>৳{order.subtotal}</span></div>
                            <div className="d-flex justify-content-between"><span>VAT</span><span>৳{order.vat}</span></div>
                            <div className="d-flex justify-content-between"><span>SD</span><span>৳{order.sd}</span></div>
                            <div className="d-flex justify-content-between"><span>Service</span><span>৳{order.service}</span></div>
                            <div className="d-flex justify-content-between fs-5 fw-bold border-top pt-2 mt-2">
                                <span>Total</span>
                                <span style={{ color: restaurant.brandColor }}>৳{order.total}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Track/refresh button for status */}
                <div className="d-flex justify-content-center mt-4">
                    <button className="btn" style={{
                        background: restaurant.brandColor,
                        color: "#fff",
                        fontWeight: 600,
                        border: "none",
                        borderRadius: 24,
                        padding: "10px 34px"
                    }}>
                        Refresh Status
                    </button>
                </div>
            </div>
        </div>
    );
}
