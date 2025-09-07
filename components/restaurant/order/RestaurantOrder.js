import React, {useState, useMemo, useEffect} from "react";

const BRAND_COLOR = "#214a3b";
const VAT_PERCENT = 7;
const SD_PERCENT = 5;
const SERVICE_PERCENT = 10;

// Menu data
const MENU = [
    {
        id: 1,
        name: "Margherita Pizza",
        price: 400,
        category: "Pizza",
        options: [
            {
                name: "Size",
                type: "radio",
                required: true,
                values: [
                    {value: "Small", price: 0},
                    {value: "Medium", price: 60},
                    {value: "Large", price: 120},
                ],
            },
            {
                name: "Toppings",
                type: "multi",
                required: false,
                max: 2,
                values: [
                    {value: "Olives", price: 30},
                    {value: "Mushrooms", price: 40},
                    {value: "Onion", price: 20},
                ],
            },
        ],
        extras: [
            {name: "Chili Flakes", price: 15},
            {name: "Extra Cheese", price: 40},
        ],
    },
    {
        id: 2,
        name: "Pepperoni Pizza",
        price: 480,
        category: "Pizza",
        options: [
            {
                name: "Size",
                type: "radio",
                required: true,
                values: [
                    {value: "Small", price: 0},
                    {value: "Medium", price: 70},
                    {value: "Large", price: 140},
                ],
            },
            {
                name: "Toppings",
                type: "multi",
                required: false,
                max: 1,
                values: [
                    {value: "Jalapenos", price: 25},
                    {value: "Onion", price: 15},
                ],
            },
        ],
        extras: [
            {name: "Garlic Dip", price: 15},
        ],
    },
    {
        id: 3,
        name: "Coke",
        price: 70,
        category: "Drinks",
        options: [],
        extras: [{name: "Ice", price: 0}],
    },
];

const CATEGORIES = ["All", ...Array.from(new Set(MENU.map((m) => m.category)))];
const PAGE_SIZE = 6;

// --- Fake table/customer data (replace with API calls as needed) ---
const tableList = [
    {id: 1, tableNumber: "T01"},
    {id: 2, tableNumber: "T02"},
    {id: 3, tableNumber: "VIP1"},
];
const customerList = [
    {id: 0, name: "Walk-in"},
    {id: 1, name: "Rahim Uddin"},
    {id: 2, name: "Fatema Begum"},
];

function RestaurantOrder({project}) {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [cart, setCart] = useState([]);
    const [page, setPage] = useState(1);

    // Table/customer selection
    const [selectedTable, setSelectedTable] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState("0"); // default to "Walk-in"
    const [orderError, setOrderError] = useState("");

    // OffCanvas state
    const [showConfig, setShowConfig] = useState(false);
    const [configItem, setConfigItem] = useState(null);
    const [configOptions, setConfigOptions] = useState({});
    const [configExtras, setConfigExtras] = useState([]);
    const [configQty, setConfigQty] = useState(1);
    const [error, setError] = useState("");

    // Scroll lock effect for OffCanvas
    useEffect(() => {
        if (showConfig) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [showConfig]);

    // Filtered & paginated menu
    const filteredMenu = useMemo(() => {
        return MENU.filter((item) => {
            const matchesCategory =
                category === "All" || item.category === category;
            const matchesSearch = item.name
                .toLowerCase()
                .includes(search.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [search, category]);
    const totalPages = Math.ceil(filteredMenu.length / PAGE_SIZE);
    const paginatedMenu = filteredMenu.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    // Cart subtotal/charges
    const calcSubtotal = () => {
        return cart.reduce((total, item) => {
            let optionTotal = 0;
            if (item.options) {
                item.options.forEach((opt) => {
                    const selected = item.selectedOptions?.[opt.name];
                    if (opt.type === "radio" && selected) {
                        const found = opt.values.find((v) => v.value === selected);
                        if (found) optionTotal += found.price;
                    }
                    if (opt.type === "multi" && selected?.length) {
                        selected.forEach((selVal) => {
                            const found = opt.values.find((v) => v.value === selVal);
                            if (found) optionTotal += found.price;
                        });
                    }
                });
            }
            let extraTotal = 0;
            if (item.extras && item.selectedExtras) {
                extraTotal += item.extras
                    .filter((ex) => item.selectedExtras.includes(ex.name))
                    .reduce((t, e) => t + e.price, 0);
            }
            return total + (item.price + optionTotal + extraTotal) * item.qty;
        }, 0);
    };
    const subtotal = calcSubtotal();
    const vat = Math.round((subtotal * VAT_PERCENT) / 100);
    const sd = Math.round((subtotal * SD_PERCENT) / 100);
    const service = Math.round((subtotal * SERVICE_PERCENT) / 100);
    const total = subtotal + vat + sd + service;

    // Remove/increase in cart
    const removeFromCart = (idx) => {
        const nextCart = cart
            .map((c, i) =>
                i === idx
                    ? {...c, qty: c.qty - 1}
                    : c
            )
            .filter((c) => c.qty > 0);
        setCart(nextCart);
    };
    const addQtyCart = (cartItem) => {
        const idx = cart.findIndex((c) =>
            c.id === cartItem.id &&
            JSON.stringify(c.selectedOptions) === JSON.stringify(cartItem.selectedOptions) &&
            JSON.stringify(c.selectedExtras) === JSON.stringify(cartItem.selectedExtras)
        );
        if (idx > -1) {
            const nextCart = [...cart];
            nextCart[idx].qty += 1;
            setCart(nextCart);
        }
    };

    // Price calculation in OffCanvas
    const calcConfigTotal = () => {
        if (!configItem) return 0;
        let price = configItem.price;
        (configItem.options || []).forEach((opt) => {
            const selected = configOptions[opt.name];
            if (opt.type === "radio" && selected) {
                const found = opt.values.find((v) => v.value === selected);
                if (found) price += found.price;
            }
            if (opt.type === "multi" && selected?.length) {
                selected.forEach((selVal) => {
                    const found = opt.values.find((v) => v.value === selVal);
                    if (found) price += found.price;
                });
            }
        });
        if (configItem.extras && configExtras.length > 0) {
            configItem.extras.forEach((ex) => {
                if (configExtras.includes(ex.name)) price += ex.price;
            });
        }
        return price * configQty;
    };

    // Add to cart from OffCanvas
    const handleAddToCart = () => {
        if (!configItem) return;
        // Validate required options (radio or multi with min)
        for (let opt of configItem.options || []) {
            if (opt.required) {
                if (opt.type === "radio" && !configOptions[opt.name]) {
                    setError(`Please select ${opt.name}`);
                    return;
                }
                if (opt.type === "multi") {
                    const selected = configOptions[opt.name] || [];
                    if (selected.length === 0) {
                        setError(`Please select at least one ${opt.name}`);
                        return;
                    }
                }
            }
        }
        // All good, push to cart
        setError("");
        const idx = cart.findIndex(
            (c) =>
                c.id === configItem.id &&
                JSON.stringify(c.selectedOptions) === JSON.stringify(configOptions) &&
                JSON.stringify(c.selectedExtras) === JSON.stringify(configExtras)
        );
        if (idx > -1) {
            const nextCart = [...cart];
            nextCart[idx].qty += configQty;
            setCart(nextCart);
        } else {
            setCart([
                ...cart,
                {
                    ...configItem,
                    qty: configQty,
                    selectedOptions: JSON.parse(JSON.stringify(configOptions)),
                    selectedExtras: [...configExtras],
                },
            ]);
        }
        // Reset OffCanvas
        setShowConfig(false);
        setConfigItem(null);
        setConfigOptions({});
        setConfigExtras([]);
        setConfigQty(1);
        setError("");
    };

    // Open item config
    const openConfig = (item) => {
        setShowConfig(true);
        setConfigItem(item);
        setConfigOptions({});
        setConfigExtras([]);
        setConfigQty(1);
        setError("");
    };

    // Option group render
    function renderOptionGroup(opt) {
        if (opt.type === "radio") {
            return (
                <div className="mb-3" key={opt.name}>
                    <label>
                        {opt.name}
                        {opt.required && <span className="text-danger">*</span>}
                    </label>
                    {opt.values.map((val) => (
                        <div className="form-check" key={val.value}>
                            <input
                                className="form-check-input"
                                type="radio"
                                name={`config-${opt.name}`}
                                checked={configOptions[opt.name] === val.value}
                                onChange={() =>
                                    setConfigOptions((prev) => ({...prev, [opt.name]: val.value}))
                                }
                            />
                            <label className="form-check-label">
                                {val.value} {val.price > 0 && `(৳${val.price})`}
                            </label>
                        </div>
                    ))}
                </div>
            );
        }
        if (opt.type === "multi") {
            const max = opt.max || opt.values.length;
            const selected = configOptions[opt.name] || [];
            return (
                <div className="mb-3" key={opt.name}>
                    <label>
                        {opt.name}
                        {opt.required && <span className="text-danger">*</span>}{" "}
                        <span className="small text-muted">
              {`Pick up to ${max}`}
            </span>
                    </label>
                    {opt.values.map((val) => (
                        <div className="form-check" key={val.value}>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={selected.includes(val.value)}
                                onChange={() => {
                                    setConfigOptions((prev) => {
                                        let arr = prev[opt.name] || [];
                                        if (arr.includes(val.value)) {
                                            arr = arr.filter((v) => v !== val.value);
                                        } else {
                                            if (arr.length < max) arr = [...arr, val.value];
                                        }
                                        return {...prev, [opt.name]: arr};
                                    });
                                }}
                            />
                            <label className="form-check-label">
                                {val.value} {val.price > 0 && `(৳${val.price})`}
                            </label>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    }

    // 100% robust OffCanvas
    const renderOffCanvas = () => {
        if (!showConfig || !configItem) return null;
        return (
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 9999,
                    background: "rgba(33,74,59,0.18)",
                    display: "flex",
                    justifyContent: "flex-end",
                }}
                onClick={() => setShowConfig(false)}
            >
                <div
                    className="card"
                    style={{
                        width: "400px",
                        maxWidth: "100vw",
                        height: "100vh",
                        borderRadius: 0,
                        display: "flex",
                        flexDirection: "column",
                        background: "#fff",
                        boxShadow: "0 0 24px rgba(0,0,0,0.13)",
                        position: "relative",
                        animation: "slideInDrawer 0.23s cubic-bezier(.4,1.02,.67,1)",
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    <div className="card-header" style={{background: BRAND_COLOR, color: "#fff"}}>
                        Configure {configItem.name}
                        <button
                            style={{
                                float: "right",
                                border: "none",
                                background: "transparent",
                                color: "#fff",
                                fontSize: "1.3em",
                                marginLeft: 8,
                            }}
                            onClick={() => setShowConfig(false)}
                        >
                            &times;
                        </button>
                    </div>
                    <div className="card-body flex-grow-1" style={{minHeight: 0, overflowY: "auto"}}>
                        <div className="mb-3">
                            <label>Quantity</label>
                            <input
                                type="number"
                                min={1}
                                className="form-control"
                                value={configQty}
                                onChange={e => setConfigQty(Math.max(1, Number(e.target.value)))}
                                style={{width: 80}}
                            />
                        </div>
                        {(configItem.options || []).map(renderOptionGroup)}
                        {(configItem.extras || []).length > 0 && (
                            <div className="mb-3">
                                <label>Extras</label>
                                {(configItem.extras || []).map((ex) => (
                                    <div className="form-check" key={ex.name}>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={configExtras.includes(ex.name)}
                                            onChange={() =>
                                                setConfigExtras((prev) =>
                                                    prev.includes(ex.name)
                                                        ? prev.filter((e) => e !== ex.name)
                                                        : [...prev, ex.name]
                                                )
                                            }
                                        />
                                        <label className="form-check-label">
                                            {ex.name}
                                            {ex.price > 0 && ` (৳${ex.price})`}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                        {error && <div className="alert alert-danger py-2">{error}</div>}
                    </div>
                    <div className="card-footer">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-bold">Subtotal</span>
                            <span className="fw-bold">৳{calcConfigTotal()}</span>
                        </div>
                        <button
                            className="btn w-100"
                            style={{background: BRAND_COLOR, color: "#fff"}}
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
                <style>{`
          @keyframes slideInDrawer {
            from { transform: translateX(100%);}
            to { transform: translateX(0);}
          }
          @media (max-width: 600px) {
            .card[style*="height: 100vh"] {
              width: 100vw !important;
              min-width: 0 !important;
              max-width: 100vw !important;
            }
          }
        `}</style>
            </div>
        );
    };

    // Place order (with validation for table/customer)
    const handlePlaceOrder = () => {
        setOrderError("");
        if (!selectedTable) {
            setOrderError("Please select a table.");
            return;
        }
        if (!selectedCustomer) {
            setOrderError("Please select a customer.");
            return;
        }
        if (cart.length === 0) {
            setOrderError("Please add at least one item to the cart.");
            return;
        }
        // Send data to backend (replace alert with API call)
        alert(
            `Order placed!\nTable: ${tableList.find(t => t.id === Number(selectedTable))?.tableNumber}\nCustomer: ${customerList.find(c => String(c.id) === String(selectedCustomer))?.name}\nItems: ${cart.length}`
        );
        setCart([]);
        setSelectedTable("");
        setSelectedCustomer("0");
    };

    return (
        <>
            <div className="container-xl py-3">
                {/* Mobile-friendly Breadcrumb */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb bg-transparent px-0" style={{fontSize: 15, flexWrap: "wrap"}}>
                        <li className="breadcrumb-item active" aria-current="page">
                            <span style={{fontWeight: 500}}>{project.name}</span>
                        </li>

                        <li className="breadcrumb-item">
                            <a href={`/dashboard/restaurants/${project.id}`} className="text-qrc"
                               style={{textDecoration: "none"}}>
                                <span style={{fontWeight: 500}}>Dashboard</span>
                            </a>
                        </li>

                        <li className="breadcrumb-item active" aria-current="page">
                            <span style={{fontWeight: 500}}>New Order</span>
                        </li>
                    </ol>
                </nav>
            </div>

            <div className="container-xl py-1" style={{fontFamily: "Segoe UI, sans-serif"}}>
                {renderOffCanvas()}
                <div className="row g-4">
                    {/* Menu */}
                    <div className="col-lg-7">
                        <div className="card">
                            <div
                                className="card-header"
                                style={{
                                    background: BRAND_COLOR,
                                    color: "#fff",
                                    fontWeight: "bold",
                                    fontSize: "1.2rem",
                                    letterSpacing: "1px",
                                }}
                            >
                                Menu
                            </div>
                            <div className="card-body" style={{minHeight: 400}}>
                                <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search menu..."
                                        value={search}
                                        onChange={e => {
                                            setSearch(e.target.value);
                                            setPage(1);
                                        }}
                                        style={{maxWidth: 240, borderColor: BRAND_COLOR}}
                                    />
                                    <div className="btn-group ms-2" role="group">
                                        {CATEGORIES.map((cat) => (
                                            <button
                                                key={cat}
                                                className={
                                                    "btn btn-outline-primary" +
                                                    (cat === category ? " active" : "")
                                                }
                                                onClick={() => {
                                                    setCategory(cat);
                                                    setPage(1);
                                                }}
                                                style={{
                                                    borderColor: BRAND_COLOR,
                                                    color: cat === category ? "#fff" : BRAND_COLOR,
                                                    background: cat === category ? BRAND_COLOR : "#fff",
                                                    fontWeight: cat === category ? "bold" : undefined,
                                                }}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="row g-3">
                                    {paginatedMenu.length === 0 && (
                                        <div className="col-12 text-muted">No menu items found.</div>
                                    )}
                                    {paginatedMenu.map((item) => (
                                        <div key={item.id} className="col-md-6 col-lg-4">
                                            <div className="card h-100 border-0 shadow-sm">
                                                <div className="card-body d-flex flex-column justify-content-between">
                                                    <div>
                                                        <h4 className="card-title" style={{color: BRAND_COLOR}}>
                                                            {item.name}
                                                        </h4>
                                                        <div className="text-muted mb-2">{item.category}</div>
                                                        <div className="fs-5 fw-bold mb-2">
                                                            ৳{item.price}
                                                        </div>
                                                    </div>
                                                    <button
                                                        className="btn mt-auto w-100"
                                                        style={{
                                                            background: BRAND_COLOR,
                                                            color: "#fff",
                                                            fontWeight: 500,
                                                            border: "none",
                                                        }}
                                                        onClick={() => openConfig(item)}
                                                    >
                                                        Add to Cart
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="d-flex justify-content-center align-items-center mt-4 gap-2">
                                        <button
                                            className="btn btn-outline-secondary"
                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                        >
                                            Prev
                                        </button>
                                        <span>
                    Page <span style={{color: BRAND_COLOR}}>{page}</span> of {totalPages}
                  </span>
                                        <button
                                            className="btn btn-outline-secondary"
                                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Cart & Info */}
                    <div className="col-lg-5">
                        <div className="card">
                            <div
                                className="card-header"
                                style={{
                                    background: BRAND_COLOR,
                                    color: "#fff",
                                    fontWeight: "bold",
                                    fontSize: "1.2rem",
                                    letterSpacing: "1px",
                                }}
                            >
                                Cart & Order Info
                            </div>
                            <div className="card-body p-0" style={{minHeight: 420}}>
                                <div className="p-3">
                                    <div className="mb-2">
                                        <label className="form-label">Table</label>
                                        <select
                                            className="form-select"
                                            value={selectedTable}
                                            onChange={e => setSelectedTable(e.target.value)}
                                        >
                                            <option value="">Select table...</option>
                                            {tableList.map(t =>
                                                <option key={t.id} value={t.id}>{t.tableNumber}</option>
                                            )}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Customer</label>
                                        <select
                                            className="form-select"
                                            value={selectedCustomer}
                                            onChange={e => setSelectedCustomer(e.target.value)}
                                        >
                                            {customerList.map(c =>
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            )}
                                        </select>
                                    </div>
                                    <div
                                        style={{
                                            maxHeight: 200,
                                            overflowY: "auto",
                                            padding: 0,
                                        }}
                                        className="mb-3"
                                    >
                                        {cart.length === 0 ? (
                                            <div className="text-muted">No items in cart.</div>
                                        ) : (
                                            <div className="list-group">
                                                {cart.map((item, idx) => (
                                                    <div
                                                        className="list-group-item d-flex flex-column align-items-start mb-2"
                                                        key={idx}
                                                        style={{border: "1px solid #eee", borderRadius: 10}}
                                                    >
                                                        <div
                                                            className="d-flex w-100 justify-content-between align-items-center">
                                                            <div>
                              <span className="fw-bold" style={{color: BRAND_COLOR}}>
                                {item.name}
                              </span>
                                                                <span className="text-muted ms-2">
                                x{item.qty}
                              </span>
                                                            </div>
                                                            <div>
                                                                <button
                                                                    className="btn btn-outline-secondary btn-sm me-1"
                                                                    onClick={() => removeFromCart(idx)}
                                                                >
                                                                    -
                                                                </button>
                                                                <button
                                                                    className="btn btn-outline-secondary btn-sm"
                                                                    onClick={() => addQtyCart(item)}
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </div>
                                                        {/* Option values */}
                                                        {item.selectedOptions &&
                                                            Object.keys(item.selectedOptions).map((opt) => (
                                                                <div className="text-muted small" key={opt}>
                                                                    {opt}: {Array.isArray(item.selectedOptions[opt]) ? item.selectedOptions[opt].join(", ") : item.selectedOptions[opt]}
                                                                </div>
                                                            ))}
                                                        {/* Extras */}
                                                        {item.selectedExtras && item.selectedExtras.length > 0 && (
                                                            <div className="text-muted small">
                                                                Extras: {item.selectedExtras.join(", ")}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {orderError && <div className="alert alert-danger py-2">{orderError}</div>}
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="d-flex flex-column gap-1 mb-2">
                                    <div className="d-flex justify-content-between">
                                        <span>Subtotal</span>
                                        <span>৳{subtotal}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span>VAT ({VAT_PERCENT}%)</span>
                                        <span>৳{vat}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span>SD ({SD_PERCENT}%)</span>
                                        <span>৳{sd}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span>Service Charge ({SERVICE_PERCENT}%)</span>
                                        <span>৳{service}</span>
                                    </div>
                                    <div className="d-flex justify-content-between fs-5 fw-bold border-top pt-2">
                                        <span>Total</span>
                                        <span style={{color: BRAND_COLOR}}>৳{total}</span>
                                    </div>
                                </div>
                                <button
                                    className="btn w-100"
                                    style={{
                                        background: BRAND_COLOR,
                                        color: "#fff",
                                        fontWeight: 500,
                                        border: "none",
                                    }}
                                    onClick={handlePlaceOrder}
                                    disabled={cart.length === 0}
                                >
                                    Place Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default RestaurantOrder;
