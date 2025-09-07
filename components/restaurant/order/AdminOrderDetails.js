import React, {useState} from "react";

const BRAND_COLOR = "#214a3b";
const STATUS_MAP = {
    pending: {color: "#FFA500", label: "Pending", icon: "🕒", next: ["accepted", "cancelled"]},
    accepted: {color: "#228be6", label: "Accepted", icon: "👍", next: ["in_progress", "cancelled"]},
    in_progress: {color: "#f59f00", label: "In Progress", icon: "🍕", next: ["ready", "cancelled"]},
    ready: {color: "#20c997", label: "Ready", icon: "✅", next: ["delivered"]},
    delivered: {color: "#00b341", label: "Delivered", icon: "✔️", next: []},
    cancelled: {color: "#d63939", label: "Cancelled", icon: "❌", next: []}
};
const PAYMENT_STATUS_MAP = {
    unpaid: {label: "Unpaid", color: "#ff922b", next: ["paid"]},
    paid: {label: "Paid", color: "#51cf66", next: []},
    failed: {label: "Payment Failed", color: "#fa5252", next: ["paid"]},
    refunded: {label: "Refunded", color: "#868e96", next: []}
};
const PAYMENT_METHODS = [
    {value: "cash", label: "Cash"},
    {value: "card", label: "Card"},
    {value: "mobile", label: "Mobile Payment"}
];

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleString([], {dateStyle: "medium", timeStyle: "short"});
}

// DEMO menu (for add more items)
const MENU = [
    {id: 1, name: "Margherita Pizza", price: 400},
    {id: 2, name: "Pepperoni Pizza", price: 480},
    {id: 3, name: "Coke", price: 70}
];

const INITIAL_ORDER = {
    id: "ORD-2024-0192",
    status: "in_progress",
    placedAt: "2025-07-29T20:44:00Z",
    eta: "20-30 min",
    table: "T01",
    type: "Dine In",
    paymentMethod: "cash",
    customer: {name: "Sakib", phone: "01712-223344"},
    note: "No onions in the pizza, please.",
    items: [
        {
            name: "Margherita Pizza",
            qty: 2,
            price: 400,
            selectedOptions: {Size: "Medium"},
            selectedExtras: ["Extra Cheese", "Chili Flakes"],
            subtotal: 400 + 60 + 40 + 15
        },
        {
            name: "Coke",
            qty: 1,
            price: 70,
            selectedOptions: {},
            selectedExtras: ["Ice"],
            subtotal: 70
        }
    ],
    subtotal: 985,
    vat: 69,
    sd: 49,
    service: 99,
    total: 1202,
    paymentStatus: "unpaid", // unpaid, paid, failed, refunded
};

export default function AdminOrderDetails({initialOrder = INITIAL_ORDER}) {
    // Local UI state for demonstration (replace with API state in prod)
    const [order, setOrder] = useState(initialOrder);
    const [showAddItems, setShowAddItems] = useState(false);
    const [addQty, setAddQty] = useState(1);
    const [addItemId, setAddItemId] = useState(MENU[0].id);

    // Handlers for real-world workflow:
    const canEdit = !["paid", "delivered", "cancelled"].includes(order.paymentStatus) && !["delivered", "cancelled"].includes(order.status);

    const updateStatus = (nextStatus) => {
        setOrder(o => ({...o, status: nextStatus}));
    };
    const updatePaymentStatus = (nextStatus) => {
        setOrder(o => ({...o, paymentStatus: nextStatus}));
    };
    const updatePaymentMethod = (method) => {
        setOrder(o => ({...o, paymentMethod: method}));
    };
    // Add items logic
    const handleAddItem = () => {
        const menuItem = MENU.find(m => m.id === Number(addItemId));
        if (!menuItem) return;
        const existingIdx = order.items.findIndex(i => i.name === menuItem.name);
        let newItems;
        if (existingIdx > -1) {
            newItems = [...order.items];
            newItems[existingIdx].qty += addQty;
            // recalc subtotal for that item (no options/extras in this simple demo)
            newItems[existingIdx].subtotal = newItems[existingIdx].price * newItems[existingIdx].qty;
        } else {
            newItems = [
                ...order.items,
                {...menuItem, qty: addQty, selectedOptions: {}, selectedExtras: [], subtotal: menuItem.price * addQty}
            ];
        }
        // recalc all pricing
        let subtotal = newItems.reduce((sum, item) => sum + item.price * item.qty, 0);
        let vat = Math.round((subtotal * 7) / 100);
        let sd = Math.round((subtotal * 5) / 100);
        let service = Math.round((subtotal * 10) / 100);
        let total = subtotal + vat + sd + service;
        setOrder(o => ({
            ...o,
            items: newItems,
            subtotal, vat, sd, service, total
        }));
        setShowAddItems(false);
        setAddQty(1);
        setAddItemId(MENU[0].id);
    };

    const status = STATUS_MAP[order.status] || STATUS_MAP.pending;
    const paymentStatus = PAYMENT_STATUS_MAP[order.paymentStatus] || PAYMENT_STATUS_MAP.unpaid;

    return (
        <div className="container-xl py-5" style={{fontFamily: "Segoe UI, sans-serif"}}>
            <div className="row g-4">
                {/* Order Info & Items */}
                <div className="col-lg-7">
                    <div className="card shadow-sm border-0" style={{borderRadius: 16}}>
                        <div
                            className="card-header d-flex flex-wrap justify-content-between align-items-center"
                            style={{
                                background: "#fff",
                                borderRadius: "16px 16px 0 0",
                                border: "none",
                                fontWeight: "bold",
                                fontSize: "1.18em",
                                letterSpacing: "1px",
                            }}
                        >
                            <div className="d-flex align-items-center gap-2">
                                <span style={{display: "inline-block", fontSize: 32}}>{status.icon}</span>
                                <span style={{fontWeight: 600, color: status.color}}>{status.label}</span>
                                <span className="badge ms-2" style={{
                                    background: paymentStatus.color, color: "#fff", fontWeight: 500
                                }}>{paymentStatus.label}</span>
                            </div>
                            <div className="text-muted small">Order #{order.id}</div>
                        </div>
                        <div className="card-body">
                            <div className="mb-3 d-flex flex-wrap align-items-center gap-2">
                <span className="badge" style={{background: BRAND_COLOR, color: "#fff", fontWeight: 500}}>
                  {formatDate(order.placedAt)}
                </span>
                                {order.eta &&
                                    <span className="badge bg-info" style={{fontWeight: 500}}>ETA: {order.eta}</span>}
                                {order.table && <span className="badge bg-primary">Table: {order.table}</span>}
                                <span className="badge bg-secondary">{order.type || "Dine In"}</span>
                            </div>
                            <div className="mb-2 small">
                                <b>Customer:</b> {order.customer?.name || "-"}
                                {order.customer?.phone && <span className="ms-2">({order.customer.phone})</span>}
                            </div>
                            {order.note &&
                                <div className="mb-2"><b>Note:</b> <span className="fst-italic">{order.note}</span>
                                </div>}
                            {/* Items */}
                            <div className="mb-2 mt-4 fw-bold" style={{color: BRAND_COLOR, fontSize: "1.13em"}}>
                                Ordered Items
                                {canEdit && (
                                    <button
                                        className="btn btn-sm ms-2"
                                        style={{
                                            background: BRAND_COLOR,
                                            color: "#fff",
                                            fontWeight: 500,
                                            border: "none",
                                            borderRadius: 8,
                                            fontSize: "0.97em"
                                        }}
                                        onClick={() => setShowAddItems(true)}
                                    >
                                        + Add Items
                                    </button>
                                )}
                            </div>
                            <div>
                                {order.items.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="d-flex justify-content-between align-items-center border-bottom py-2"
                                        style={{fontSize: "1.09em"}}
                                    >
                                        <div>
                                            <span style={{fontWeight: 600}}>{item.name}</span>
                                            <span className="text-muted ms-2">x{item.qty}</span>
                                            {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                                                <div className="text-muted small">
                                                    {Object.entries(item.selectedOptions).map(([k, v]) => (
                                                        <span
                                                            key={k}>{k}: {Array.isArray(v) ? v.join(", ") : v}; </span>
                                                    ))}
                                                </div>
                                            )}
                                            {item.selectedExtras && item.selectedExtras.length > 0 && (
                                                <div className="text-muted small">
                                                    Extras: {item.selectedExtras.join(", ")}
                                                </div>
                                            )}
                                        </div>
                                        <div className="fw-bold" style={{color: BRAND_COLOR}}>
                                            ৳{item.subtotal}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Add Item Modal/Drawer */}
                    {showAddItems && (
                        <div style={{
                            position: "fixed", inset: 0, zIndex: 9999, background: "rgba(33,74,59,0.13)",
                            display: "flex", alignItems: "center", justifyContent: "center"
                        }} onClick={() => setShowAddItems(false)}>
                            <div
                                className="card"
                                style={{
                                    width: 350,
                                    maxWidth: "95vw",
                                    borderRadius: 18,
                                    boxShadow: "0 2px 14px rgba(33,74,59,0.11)",
                                    background: "#fff"
                                }}
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="card-header" style={{background: BRAND_COLOR, color: "#fff"}}>
                                    Add Item
                                    <button style={{
                                        float: "right",
                                        border: "none",
                                        background: "transparent",
                                        color: "#fff",
                                        fontSize: "1.2em"
                                    }}
                                            onClick={() => setShowAddItems(false)}>&times;</button>
                                </div>
                                <div className="card-body">
                                    <label>Menu Item</label>
                                    <select className="form-select mb-2"
                                            value={addItemId}
                                            onChange={e => setAddItemId(Number(e.target.value))}
                                    >
                                        {MENU.map(m => (
                                            <option value={m.id} key={m.id}>{m.name} (৳{m.price})</option>
                                        ))}
                                    </select>
                                    <label>Quantity</label>
                                    <input className="form-control mb-2" type="number" min={1} value={addQty}
                                           onChange={e => setAddQty(Math.max(1, Number(e.target.value)))}/>
                                    <button className="btn w-100"
                                            style={{background: BRAND_COLOR, color: "#fff", fontWeight: 500}}
                                            onClick={handleAddItem}>
                                        Add to Order
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {/* Billing & Actions */}
                <div className="col-lg-5">
                    <div className="card shadow-sm border-0" style={{borderRadius: 16}}>
                        <div
                            className="card-header"
                            style={{
                                background: BRAND_COLOR,
                                color: "#fff",
                                fontWeight: "bold",
                                fontSize: "1.2rem",
                                letterSpacing: "1px",
                                borderRadius: "16px 16px 0 0",
                            }}
                        >
                            Billing & Actions
                        </div>
                        <div className="card-body">
                            <div className="d-flex flex-column gap-1 mb-2">
                                <div className="d-flex justify-content-between">
                                    <span>Subtotal</span>
                                    <span>৳{order.subtotal}</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span>VAT</span>
                                    <span>৳{order.vat}</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span>SD</span>
                                    <span>৳{order.sd}</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span>Service Charge</span>
                                    <span>৳{order.service}</span>
                                </div>
                                <div className="d-flex justify-content-between fs-5 fw-bold border-top pt-2">
                                    <span>Total</span>
                                    <span style={{color: BRAND_COLOR}}>৳{order.total}</span>
                                </div>
                            </div>
                            <div className="mt-3 mb-2">
                                <label>Payment Method</label>
                                <select className="form-select"
                                        value={order.paymentMethod}
                                        disabled={!canEdit}
                                        onChange={e => updatePaymentMethod(e.target.value)}>
                                    {PAYMENT_METHODS.map(m => (
                                        <option value={m.value} key={m.value}>{m.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-2">
                                <label>Status</label>
                                <select className="form-select"
                                        value={order.status}
                                        disabled={!canEdit}
                                        onChange={e => updateStatus(e.target.value)}>
                                    {Object.entries(STATUS_MAP).map(([k, v]) =>
                                        <option value={k} key={k}>{v.label}</option>
                                    )}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label>Payment Status</label>
                                <select className="form-select"
                                        value={order.paymentStatus}
                                        disabled={order.paymentStatus === "paid" || ["delivered", "cancelled"].includes(order.status)}
                                        onChange={e => updatePaymentStatus(e.target.value)}>
                                    {Object.entries(PAYMENT_STATUS_MAP).map(([k, v]) =>
                                        <option value={k} key={k}>{v.label}</option>
                                    )}
                                </select>
                            </div>
                            <div className="d-flex flex-wrap gap-2 mt-2">
                                {canEdit && order.paymentStatus !== "paid" && (
                                    <button
                                        className="btn"
                                        style={{background: "#51cf66", color: "#fff", border: "none"}}
                                        onClick={() => updatePaymentStatus("paid")}
                                    >Mark as Paid</button>
                                )}
                                {canEdit && status.next.map(s => (
                                    <button
                                        key={s}
                                        className="btn"
                                        style={{
                                            background: STATUS_MAP[s]?.color || BRAND_COLOR,
                                            color: "#fff", border: "none"
                                        }}
                                        onClick={() => updateStatus(s)}
                                    >{STATUS_MAP[s]?.label || s}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
