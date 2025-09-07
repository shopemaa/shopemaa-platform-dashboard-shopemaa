import React, {useState} from "react";

const CheckoutCanvas = ({cartItems = [], onClose}) => {
    const [billing, setBilling] = useState({
        name: "",
        email: "",
        address: "",
        city: "",
        zip: "",
        country: "",
    });

    const [paymentMethod, setPaymentMethod] = useState("card");

    const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setBilling((prev) => ({...prev, [name]: value}));
    };

    const handleCheckout = () => {
        // You would trigger your payment workflow here
        alert("Proceeding to payment...");
    };

    return (
        <div
            className="offcanvas offcanvas-end show"
            tabIndex="-1"
            style={{visibility: "visible", backgroundColor: "#fff"}}
            aria-labelledby="offcanvasCheckoutLabel"
        >
            <div className="offcanvas-header border-bottom">
                <h2 className="offcanvas-title" id="offcanvasCheckoutLabel">Checkout</h2>
                <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>

            <div className="offcanvas-body d-flex flex-column">
                {/* Cart Summary */}
                <div>
                    {cartItems.length === 0 ? (
                        <div className="text-muted text-center mt-4">Your cart is empty.</div>
                    ) : (
                        <div>
                            <h3 className="mb-3">Order Summary</h3>
                            {cartItems.map((item, idx) => (
                                <div key={idx} className="mb-2 d-flex justify-content-between">
                                    <div>
                                        <strong>{item.name}</strong>
                                        <div className="text-muted small">{item.qty} × €{item.price.toFixed(2)}</div>
                                    </div>
                                    <div className="fw-bold">€{(item.qty * item.price).toFixed(2)}</div>
                                </div>
                            ))}
                            <div className="d-flex justify-content-between border-top pt-2 mt-2 fw-bold">
                                <span>Total</span>
                                <span>€{total.toFixed(2)}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Billing Address */}
                <div className="mt-4">
                    <h3 className="mb-3">Billing Information</h3>
                    <div className="mb-2">
                        <input
                            type="text"
                            name="name"
                            value={billing.name}
                            onChange={handleInputChange}
                            placeholder="Full Name"
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <input
                            type="email"
                            name="email"
                            value={billing.email}
                            onChange={handleInputChange}
                            placeholder="Email Address"
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <input
                            type="text"
                            name="address"
                            value={billing.address}
                            onChange={handleInputChange}
                            placeholder="Street Address"
                            className="form-control"
                        />
                    </div>
                    <div className="mb-2">
                        <input
                            type="text"
                            name="city"
                            value={billing.city}
                            onChange={handleInputChange}
                            placeholder="City"
                            className="form-control"
                        />
                    </div>
                    <div className="row">
                        <div className="col-6 mb-2">
                            <input
                                type="text"
                                name="zip"
                                value={billing.zip}
                                onChange={handleInputChange}
                                placeholder="ZIP/Postal Code"
                                className="form-control"
                            />
                        </div>
                        <div className="col-6 mb-2">
                            <input
                                type="text"
                                name="country"
                                value={billing.country}
                                onChange={handleInputChange}
                                placeholder="Country"
                                className="form-control"
                            />
                        </div>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="mt-4">
                    <h3 className="mb-3">Payment Method</h3>
                    <div className="form-check mb-2">
                        <input
                            className="form-check-input"
                            type="radio"
                            id="card"
                            value="card"
                            checked={paymentMethod === "card"}
                            onChange={() => setPaymentMethod("card")}
                        />
                        <label className="form-check-label" htmlFor="card">
                            Credit/Debit Card
                        </label>
                    </div>
                    <div className="form-check mb-2">
                        <input
                            className="form-check-input"
                            type="radio"
                            id="paypal"
                            value="paypal"
                            checked={paymentMethod === "paypal"}
                            onChange={() => setPaymentMethod("paypal")}
                        />
                        <label className="form-check-label" htmlFor="paypal">
                            PayPal
                        </label>
                    </div>
                </div>

                {/* Checkout Button */}
                <div className="mt-4">
                    <button
                        className="btn btn-primary w-100"
                        onClick={handleCheckout}
                        disabled={cartItems.length === 0 || !billing.name || !billing.email}
                    >
                        Proceed to Pay €{total.toFixed(2)}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutCanvas;
