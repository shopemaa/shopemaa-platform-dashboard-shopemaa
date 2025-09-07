import React, {useState, useMemo, useEffect} from "react";

// DEMO DATA (Replace with your own backend/API)
const RESTAURANT = {
    name: "Grand Plaza Restaurant",
    address: "123 Gulshan Ave, Dhaka",
    phone: "01711-123456",
    logo: "https://tabler.io/static/logo.svg",
    status: "Open",
    hours: "10:00 AM - 11:00 PM",
    brandColor: "#214a3b"
};
const VAT_PERCENT = 7, SD_PERCENT = 5, SERVICE_PERCENT = 10;
const MENU = [
    {
        id: 1, name: "Margherita Pizza", price: 400, category: "Pizza", options: [
            {
                name: "Size", type: "radio", required: true, values: [
                    {value: "Small", price: 0}, {value: "Medium", price: 60}, {value: "Large", price: 120}
                ]
            }
        ], extras: [
            {name: "Chili Flakes", price: 15},
            {name: "Extra Cheese", price: 40}
        ]
    },
    {
        id: 2,
        name: "Veggie Delight",
        price: 430,
        category: "Pizza",
        options: [],
        extras: [{name: "Jalapeno", price: 25}]
    },
    {id: 3, name: "Coke", price: 70, category: "Drinks", options: [], extras: []},
    {id: 4, name: "Chocolate Lava Cake", price: 180, category: "Dessert", options: [], extras: []}
];
const CATEGORIES = Array.from(new Set(MENU.map(m => m.category)));

export default function RestaurantUserIndex() {
    // UI state
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [search, setSearch] = useState("");
    const [cart, setCart] = useState([]);
    const [showConfig, setShowConfig] = useState(false);
    const [configItem, setConfigItem] = useState(null);
    const [configOptions, setConfigOptions] = useState({});
    const [configExtras, setConfigExtras] = useState([]);
    const [configQty, setConfigQty] = useState(1);
    const [configError, setConfigError] = useState("");
    const [showCartMobile, setShowCartMobile] = useState(false);

    // Customer form
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [orderNote, setOrderNote] = useState("");
    const [orderError, setOrderError] = useState("");
    const [orderSuccess, setOrderSuccess] = useState("");

    // SSR-safe responsive logic
    const [isDesktop, setIsDesktop] = useState(false); // Assume mobile for SSR

    useEffect(() => {
        const check = () => setIsDesktop(window.innerWidth >= 992);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    useEffect(() => {
        if (typeof document !== "undefined") {
            if (showConfig || showCartMobile) document.body.style.overflow = "hidden";
            else document.body.style.overflow = "";
            return () => {
                document.body.style.overflow = "";
            };
        }
    }, [showConfig, showCartMobile]);

    // Filtered menu
    const filteredMenu = useMemo(() => {
        return MENU.filter(item =>
            (item.category === category) &&
            item.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [category, search]);

    // Cart logic
    const subtotal = cart.reduce((total, item) => {
        let optionTotal = 0;
        if (item.options) {
            item.options.forEach(opt => {
                const selected = item.selectedOptions?.[opt.name];
                if (opt.type === "radio" && selected) {
                    const found = opt.values.find(v => v.value === selected);
                    if (found) optionTotal += found.price;
                }
                if (opt.type === "multi" && selected?.length) {
                    selected.forEach(selVal => {
                        const found = opt.values.find(v => v.value === selVal);
                        if (found) optionTotal += found.price;
                    });
                }
            });
        }
        let extraTotal = 0;
        if (item.extras && item.selectedExtras) {
            extraTotal += item.extras
                .filter(ex => item.selectedExtras.includes(ex.name))
                .reduce((t, e) => t + e.price, 0);
        }
        return total + (item.price + optionTotal + extraTotal) * item.qty;
    }, 0);
    const vat = Math.round((subtotal * VAT_PERCENT) / 100);
    const sd = Math.round((subtotal * SD_PERCENT) / 100);
    const service = Math.round((subtotal * SERVICE_PERCENT) / 100);
    const total = subtotal + vat + sd + service;

    const removeFromCart = idx => {
        setCart(cart =>
            cart
                .map((c, i) => (i === idx ? {...c, qty: c.qty - 1} : c))
                .filter(c => c.qty > 0)
        );
    };
    const addQtyCart = cartItem => {
        const idx = cart.findIndex(c =>
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

    // Add-to-cart config drawer
    const handleAddToCart = () => {
        if (!configItem) return;
        for (let opt of configItem.options || []) {
            if (opt.required) {
                if (opt.type === "radio" && !configOptions[opt.name]) {
                    setConfigError(`Please select ${opt.name}`);
                    return;
                }
                if (opt.type === "multi") {
                    const selected = configOptions[opt.name] || [];
                    if (selected.length === 0) {
                        setConfigError(`Please select at least one ${opt.name}`);
                        return;
                    }
                }
            }
        }
        setConfigError("");
        const idx = cart.findIndex(
            c =>
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
                }
            ]);
        }
        setShowConfig(false);
        setConfigItem(null);
        setConfigOptions({});
        setConfigExtras([]);
        setConfigQty(1);
        setConfigError("");
    };

    const openConfig = item => {
        setShowConfig(true);
        setConfigItem(item);
        setConfigOptions({});
        setConfigExtras([]);
        setConfigQty(1);
        setConfigError("");
    };

    function renderOptionGroup(opt) {
        if (opt.type === "radio") {
            return (
                <div className="mb-3" key={opt.name}>
                    <label>
                        {opt.name}
                        {opt.required && <span className="text-danger">*</span>}
                    </label>
                    {opt.values.map(val => (
                        <div className="form-check" key={val.value}>
                            <input className="form-check-input" type="radio"
                                   name={`config-${opt.name}`}
                                   checked={configOptions[opt.name] === val.value}
                                   onChange={() => setConfigOptions(prev => ({...prev, [opt.name]: val.value}))}/>
                            <label className="form-check-label">{val.value} {val.price > 0 && `(৳${val.price})`}</label>
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
                        {opt.required && <span className="text-danger">*</span>}
                        <span className="small text-muted">{` (Pick up to ${max})`}</span>
                    </label>
                    {opt.values.map(val => (
                        <div className="form-check" key={val.value}>
                            <input className="form-check-input" type="checkbox"
                                   checked={selected.includes(val.value)}
                                   onChange={() => {
                                       setConfigOptions(prev => {
                                           let arr = prev[opt.name] || [];
                                           if (arr.includes(val.value)) {
                                               arr = arr.filter(v => v !== val.value);
                                           } else {
                                               if (arr.length < max) arr = [...arr, val.value];
                                           }
                                           return {...prev, [opt.name]: arr};
                                       });
                                   }}/>
                            <label className="form-check-label">{val.value} {val.price > 0 && `(৳${val.price})`}</label>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    }

    const calcConfigTotal = () => {
        if (!configItem) return 0;
        let price = configItem.price;
        (configItem.options || []).forEach(opt => {
            const selected = configOptions[opt.name];
            if (opt.type === "radio" && selected) {
                const found = opt.values.find(v => v.value === selected);
                if (found) price += found.price;
            }
            if (opt.type === "multi" && selected?.length) {
                selected.forEach(selVal => {
                    const found = opt.values.find(v => v.value === selVal);
                    if (found) price += found.price;
                });
            }
        });
        if (configItem.extras && configExtras.length > 0) {
            configItem.extras.forEach(ex => {
                if (configExtras.includes(ex.name)) price += ex.price;
            });
        }
        return price * configQty;
    };

    // Bottom sheet for option/extras
    const renderOffCanvas = () => {
        if (!showConfig || !configItem) return null;
        return (
            <div style={{
                position: "fixed", inset: 0, zIndex: 9999, background: "rgba(33,74,59,0.11)",
                display: "flex", alignItems: "flex-end", justifyContent: "center"
            }} onClick={() => setShowConfig(false)}>
                <div
                    className="card"
                    style={{
                        width: "100vw", maxWidth: 420, borderTopLeftRadius: 16, borderTopRightRadius: 16,
                        minHeight: 340, boxShadow: "0 -1px 18px rgba(33,74,59,0.13)", background: "#fff"
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    <div className="card-header" style={{background: RESTAURANT.brandColor, color: "#fff"}}>
                        Customize {configItem.name}
                        <button style={{
                            float: "right", border: "none", background: "transparent", color: "#fff", fontSize: "1.3em"
                        }} onClick={() => setShowConfig(false)}>&times;</button>
                    </div>
                    <div className="card-body">
                        <div className="mb-3">
                            <label>Quantity</label>
                            <input type="number" min={1} className="form-control"
                                   value={configQty} onChange={e => setConfigQty(Math.max(1, Number(e.target.value)))}
                                   style={{width: 90}}/>
                        </div>
                        {(configItem.options || []).map(renderOptionGroup)}
                        {(configItem.extras || []).length > 0 && (
                            <div className="mb-3">
                                <label>Extras</label>
                                {(configItem.extras || []).map(ex => (
                                    <div className="form-check" key={ex.name}>
                                        <input className="form-check-input" type="checkbox"
                                               checked={configExtras.includes(ex.name)}
                                               onChange={() =>
                                                   setConfigExtras(prev =>
                                                       prev.includes(ex.name)
                                                           ? prev.filter(e => e !== ex.name)
                                                           : [...prev, ex.name]
                                                   )
                                               }
                                        />
                                        <label
                                            className="form-check-label">{ex.name}{ex.price > 0 && ` (৳${ex.price})`}</label>
                                    </div>
                                ))}
                            </div>
                        )}
                        {configError && <div className="alert alert-danger py-2">{configError}</div>}
                    </div>
                    <div className="card-footer d-flex justify-content-between align-items-center">
                        <span className="fw-bold">Subtotal: ৳{calcConfigTotal()}</span>
                        <button className="btn"
                                style={{background: RESTAURANT.brandColor, color: "#fff"}}
                                onClick={handleAddToCart}>Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderMobileCart = () => {
        if (!showCartMobile) return null;
        return (
            <div style={{
                position: "fixed", inset: 0, zIndex: 9999, background: "rgba(33,74,59,0.13)",
                display: "flex", alignItems: "flex-end", justifyContent: "center"
            }} onClick={() => setShowCartMobile(false)}>
                <div
                    className="card"
                    style={{
                        width: "100vw", maxWidth: 420, borderTopLeftRadius: 20, borderTopRightRadius: 20,
                        minHeight: 350, boxShadow: "0 -1px 20px rgba(33,74,59,0.15)", background: "#fff"
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    {renderCart(true)}
                </div>
            </div>
        );
    };

    const handlePlaceOrder = () => {
        setOrderError("");
        setOrderSuccess("");
        if (!customerName.trim()) {
            setOrderError("Please enter your name.");
            return;
        }
        if (!customerPhone.trim()) {
            setOrderError("Please enter your phone.");
            return;
        }
        if (cart.length === 0) {
            setOrderError("Your cart is empty.");
            return;
        }
        setOrderSuccess("Your order has been placed! Thank you.");
        setCart([]);
        setCustomerName("");
        setCustomerPhone("");
        setOrderNote("");
        setTimeout(() => setOrderSuccess(""), 6000);
        setShowCartMobile(false);
    };

    function renderCart(isMobile) {
        return (
            <>
                <div className="card-header" style={{
                    background: RESTAURANT.brandColor,
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    borderTopLeftRadius: isMobile ? 20 : "",
                    borderTopRightRadius: isMobile ? 20 : ""
                }}>Your Cart
                </div>
                <div className="card-body p-0" style={{minHeight: 120}}>
                    <div style={{maxHeight: 150, overflowY: "auto"}} className="p-2">
                        {cart.length === 0 ? (
                            <div className="text-muted">No items in cart.</div>
                        ) : (
                            <div className="list-group">
                                {cart.map((item, idx) => (
                                    <div className="list-group-item d-flex flex-column align-items-start mb-2" key={idx}
                                         style={{border: "1px solid #eee", borderRadius: 9}}>
                                        <div className="d-flex w-100 justify-content-between align-items-center">
                                            <div>
                                                <span className="fw-bold"
                                                      style={{color: RESTAURANT.brandColor}}>{item.name}</span>
                                                <span className="text-muted ms-2">x{item.qty}</span>
                                            </div>
                                            <div>
                                                <button className="btn btn-outline-secondary btn-sm me-1"
                                                        onClick={() => removeFromCart(idx)}>-
                                                </button>
                                                <button className="btn btn-outline-secondary btn-sm"
                                                        onClick={() => addQtyCart(item)}>+
                                                </button>
                                            </div>
                                        </div>
                                        {item.selectedOptions &&
                                            Object.keys(item.selectedOptions).map(opt => (
                                                <div className="text-muted small" key={opt}>
                                                    {opt}: {Array.isArray(item.selectedOptions[opt]) ? item.selectedOptions[opt].join(", ") : item.selectedOptions[opt]}
                                                </div>
                                            ))}
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
                </div>
                <div className="card-footer">
                    <div className="d-flex flex-column gap-1 mb-2">
                        <div className="d-flex justify-content-between"><span>Subtotal</span><span>৳{subtotal}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                            <span>VAT ({VAT_PERCENT}%)</span><span>৳{vat}</span></div>
                        <div className="d-flex justify-content-between">
                            <span>SD ({SD_PERCENT}%)</span><span>৳{sd}</span></div>
                        <div className="d-flex justify-content-between">
                            <span>Service ({SERVICE_PERCENT}%)</span><span>৳{service}</span></div>
                        <div className="d-flex justify-content-between fs-5 fw-bold border-top pt-2">
                            <span>Total</span><span style={{color: RESTAURANT.brandColor}}>৳{total}</span></div>
                    </div>
                    <div className="mt-2">
                        <input className="form-control mb-2" placeholder="Your name" value={customerName}
                               onChange={e => setCustomerName(e.target.value)}/>
                        <input className="form-control mb-2" placeholder="Mobile" value={customerPhone}
                               onChange={e => setCustomerPhone(e.target.value)}/>
                        <textarea className="form-control mb-2" placeholder="Note (optional)" rows={2} value={orderNote}
                                  onChange={e => setOrderNote(e.target.value)}/>
                        {orderError && <div className="alert alert-danger py-2">{orderError}</div>}
                        {orderSuccess && <div className="alert alert-success py-2">{orderSuccess}</div>}
                        <button className="btn w-100" style={{
                            background: RESTAURANT.brandColor,
                            color: "#fff",
                            fontWeight: 500,
                            border: "none"
                        }}
                                disabled={cart.length === 0}
                                onClick={handlePlaceOrder}
                        >Place Order
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <div style={{background: "#f7f8fa", minHeight: "100vh", fontFamily: "Segoe UI, sans-serif"}}>
            {/* Restaurant Info */}
            <div style={{
                background: RESTAURANT.brandColor,
                color: "#fff",
                padding: "18px 0 14px 0",
                borderBottomLeftRadius: 32,
                borderBottomRightRadius: 32,
                marginBottom: 5,
                boxShadow: "0 2px 18px rgba(33,74,59,0.11)",
                position: "sticky",
                top: 0,
                zIndex: 101
            }}>
                <div className="container-xl d-flex align-items-center gap-4">
                    <img src={RESTAURANT.logo} alt="logo" style={{
                        height: 46,
                        width: 46,
                        objectFit: "contain",
                        background: "#fff",
                        borderRadius: 13,
                        padding: 5,
                        border: "1px solid #e4e4e4"
                    }}/>
                    <div className="flex-grow-1">
                        <div className="fw-bold fs-5">{RESTAURANT.name}</div>
                        <div className="small">{RESTAURANT.address}</div>
                        <div className="small">Call: <a href={`tel:${RESTAURANT.phone}`} style={{
                            color: "#fff",
                            textDecoration: "underline"
                        }}>{RESTAURANT.phone}</a></div>
                        <div>
                            <span
                                className={`badge bg-${RESTAURANT.status === "Open" ? "success" : "danger"} me-2`}>{RESTAURANT.status}</span>
                            <span className="badge bg-secondary">{RESTAURANT.hours}</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Categories horizontal scroll */}
            <div className="container-xl pb-2 pt-2"
                 style={{position: "sticky", top: 89, background: "#f7f8fa", zIndex: 100}}>
                <div className="d-flex overflow-auto gap-2" style={{scrollbarWidth: "none"}}>
                    {CATEGORIES.map(cat => (
                        <button key={cat}
                                className={"btn btn-sm " + (cat === category ? "btn-primary" : "btn-outline-primary")}
                                style={{
                                    minWidth: 110, fontWeight: "bold", borderRadius: 22,
                                    background: cat === category ? RESTAURANT.brandColor : "#fff",
                                    color: cat === category ? "#fff" : RESTAURANT.brandColor,
                                    borderColor: RESTAURANT.brandColor
                                }}
                                onClick={() => setCategory(cat)}
                        >{cat}</button>
                    ))}
                </div>
            </div>
            {/* Search bar */}
            <div className="container-xl mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search menu..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{borderColor: RESTAURANT.brandColor, maxWidth: 320}}
                />
            </div>
            {/* Menu + Cart Row */}
            <div className="container-xl pb-6">
                <div className="row g-3">
                    <div className={isDesktop ? "col-lg-8" : "col-12"}>
                        <div className="row g-3">
                            {filteredMenu.length === 0 && (
                                <div className="col-12 text-muted">No menu items found.</div>
                            )}
                            {filteredMenu.map(item => (
                                <div key={item.id} className="col-12 col-sm-6">
                                    <div className="card h-100 shadow-sm border-0">
                                        <div className="card-body d-flex flex-column justify-content-between">
                                            <div>
                                                <h4 className="card-title mb-2"
                                                    style={{color: RESTAURANT.brandColor}}>{item.name}</h4>
                                                <div className="text-muted mb-2">{item.category}</div>
                                                <div className="fs-5 fw-bold mb-2">৳{item.price}</div>
                                                {item.options && item.options.length > 0 && (
                                                    <div className="small text-info mb-1">
                                                        Has customization
                                                    </div>
                                                )}
                                                {item.extras && item.extras.length > 0 && (
                                                    <div className="small text-secondary mb-1">
                                                        Extras available
                                                    </div>
                                                )}
                                            </div>
                                            <button className="btn mt-auto w-100"
                                                    style={{
                                                        background: RESTAURANT.brandColor,
                                                        color: "#fff",
                                                        fontWeight: 500,
                                                        border: "none"
                                                    }}
                                                    onClick={() => openConfig(item)}
                                            >Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Desktop cart sidebar */}
                    {isDesktop &&
                        <div className="col-lg-4">
                            <div className="sticky-top" style={{top: 110}}>
                                <div className="card">{renderCart(false)}</div>
                            </div>
                        </div>
                    }
                </div>
            </div>
            {renderOffCanvas()}
            {renderMobileCart()}
            {/* Floating cart button for mobile only */}
            {!isDesktop && (
                <button
                    className="btn d-lg-none"
                    style={{
                        position: "fixed", bottom: 16, right: 18, zIndex: 2000,
                        background: RESTAURANT.brandColor, color: "#fff", borderRadius: "2em", fontWeight: 600,
                        boxShadow: "0 2px 14px rgba(33,74,59,0.15)", padding: "14px 32px"
                    }}
                    onClick={() => setShowCartMobile(true)}
                >
                    Cart {cart.length > 0 && <span className="badge bg-warning ms-2">{cart.length}</span>}
                </button>
            )}
        </div>
    );
}
