// pages/products/new.jsx
import React from "react";
import {useRouter} from "next/router";
import ProductCreateForm from "../../../components/products/ProductCreate";

export default function ProductCreatePage() {
    const router = useRouter();

    const handleSubmitPayload = async (payload) => {
        // TODO: replace with real API call
        // await fetch('/api/products', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(payload) })
        console.log("SUBMIT PRODUCT:", payload);
        // Navigate back to products after successful create
        // router.push("/products");
    };

    return (
        <div className="container-xl py-4">
            <div className="d-flex align-items-center mb-3">
                <h1 className="m-0 fw-bold">Create product</h1>
                <div className="ms-auto btn-list">
                    <button type="button" className="btn btn-outline-secondary" onClick={() => router.back()}>
                        Cancel
                    </button>
                    <button form="__noop" className="btn btn-primary" onClick={() => { /* no-op: submit lives inside form */
                    }}>
                        Save
                    </button>
                </div>
            </div>

            <ProductCreateForm onSubmitPayload={handleSubmitPayload}/>
        </div>
    );
}
