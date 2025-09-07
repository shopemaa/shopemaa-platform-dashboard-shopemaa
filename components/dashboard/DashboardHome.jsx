import React from "react";
import {useRouter} from "next/router";

const ICON_SIZE = 28;

const ICONS = {
    box: (
        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width={ICON_SIZE} height={ICON_SIZE}
             viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round"
             strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z"/>
            <path d="M12 3l8 4.5v9l-8 4.5l-8-4.5v-9z"/>
            <path d="M12 12l8-4.5"/>
            <path d="M12 12v9"/>
            <path d="M12 12L4 7.5"/>
        </svg>
    ),
    tags: (
        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width={ICON_SIZE} height={ICON_SIZE}
             viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round"
             strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z"/>
            <path d="M7 7h-4v4l9 9l4 -4z"/>
            <path d="M13 6l5 5"/>
            <path d="M7.5 7.5l3 3"/>
        </svg>
    ),
    collection: (
        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width={ICON_SIZE} height={ICON_SIZE}
             viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round"
             strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z"/>
            <rect x="4" y="4" width="6" height="6" rx="1"/>
            <rect x="14" y="4" width="6" height="6" rx="1"/>
            <rect x="4" y="14" width="6" height="6" rx="1"/>
            <rect x="14" y="14" width="6" height="6" rx="1"/>
        </svg>
    ),
    orders: (
        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width={ICON_SIZE} height={ICON_SIZE}
             viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round"
             strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z"/>
            <path d="M9 6h11l-1 7h-9z"/>
            <path d="M7 6v7"/>
            <path d="M7 13a2 2 0 1 0 4 0"/>
            <path d="M5 6h2"/>
            <path d="M3 6h2"/>
        </svg>
    ),
    customers: (
        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width={ICON_SIZE} height={ICON_SIZE}
             viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round"
             strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M17 11v-2a4 4 0 1 1 0 8v-2"/>
            <path d="M6 21v-2a4 4 0 0 1 4 -4h2"/>
        </svg>
    ),
    settings: (
        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width={ICON_SIZE} height={ICON_SIZE}
             viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round"
             strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z"/>
            <path
                d="M10.325 4.317l.675 -1.317l2 0l.675 1.317a2 2 0 0 0 2.65 .894l1.3 -.75l1.414 1.414l-.75 1.3a2 2 0 0 0 .894 2.65l1.317 .675v2l-1.317 .675a2 2 0 0 0 -.894 2.65l.75 1.3l-1.414 1.414l-1.3 -.75a2 2 0 0 0 -2.65 .894l-.675 1.317h-2l-.675 -1.317a2 2 0 0 0 -2.65 -.894l-1.3 .75l-1.414 -1.414l.75 -1.3a2 2 0 0 0 -.894 -2.65l-1.317 -.675v-2l1.317 -.675a2 2 0 0 0 .894 -2.65l-.75 -1.3l1.414 -1.414l1.3 .75a2 2 0 0 0 2.65 -.894z"/>
            <circle cx="12" cy="12" r="3"/>
        </svg>
    ),
};

const FEATURES = [
    {
        name: "Products",
        key: "products",
        description: "Create and manage your catalog, variants, pricing, inventory.",
        href: "/dashboard/products",
        icon: ICONS.box
    },
    {
        name: "Categories",
        key: "categories",
        description: "Organize products into hierarchical categories.",
        href: "/dashboard/categories",
        icon: ICONS.tags
    },
    {
        name: "Collections",
        key: "collections",
        description: "Curate seasonal and campaign-driven collections.",
        href: "/dashboard/collections",
        icon: ICONS.collection
    },
    {
        name: "Orders",
        key: "orders",
        description: "Track payments, fulfillment, and order status.",
        href: "/dashboard/orders",
        icon: ICONS.orders
    },
    {
        name: "Customers",
        key: "customers",
        description: "View profiles, segments, and lifetime value.",
        href: "/dashboard/customers",
        icon: ICONS.customers
    },
    {
        name: "Store Settings",
        key: "settings",
        description: "Branding, taxes, checkout, shipping, and integrations.",
        href: "/dashboard/settings",
        icon: ICONS.settings
    },
];

export default function DashboardHome() {
    const router = useRouter();

    return (
        <>
            <div style={{minHeight: "100vh"}}>
                <div className="container-xl py-4 py-md-5">
                    <div className="d-flex align-items-center mb-4">
                        <div
                            className="me-3"
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 12,
                                background: "var(--shopemaa-brand)",
                                opacity: 0.12,
                            }}
                        />
                        <div>
                            <h1 className="fw-bold m-0" style={{lineHeight: 1.2}}>
                                Welcome to Shopemaa
                            </h1>
                            <div className="text-muted">Choose a module to get started.</div>
                        </div>
                    </div>

                    <div className="row g-3 g-md-4 align-items-stretch">
                        {FEATURES.map((f) => (
                            <div key={f.key} className="col-12 col-sm-6 col-xl-4 d-flex">
                                <button
                                    className="feature-card card flex-grow-1 text-start"
                                    onClick={() => router.push(f.href)}
                                    aria-label={`Open ${f.name}`}
                                    style={{
                                        border: "1px solid var(--shopemaa-border)",
                                        cursor: "pointer",
                                        borderRadius: "16px",
                                        overflow: "hidden",
                                        background:
                                            "linear-gradient(180deg, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.02) 100%)",
                                        transition:
                                            "transform .16s ease, box-shadow .18s ease, border-color .18s ease",
                                    }}>
                                    <div
                                        className="card-body d-flex flex-column align-items-center justify-content-between"
                                        style={{minHeight: 200}}>
                                        {/* Icon on top */}
                                        <div
                                            className="d-flex align-items-center justify-content-center"
                                            style={{
                                                width: 56,
                                                height: 56,
                                                borderRadius: 14,
                                                background: "rgba(var(--shopemaa-brand-rgb), .08)",
                                                boxShadow: "inset 0 0 0 1px rgba(var(--shopemaa-brand-rgb), .12)",
                                                marginBottom: 14,
                                            }}>
                                            {f.icon}
                                        </div>

                                        {/* Title in middle */}
                                        <div
                                            className="fw-bold text-center"
                                            style={{
                                                fontSize: 18,
                                                color: "var(--shopemaa-brand)",
                                                letterSpacing: ".2px",
                                                marginBottom: 8,
                                            }}>
                                            {f.name}
                                        </div>

                                        {/* Description at bottom */}
                                        <div className="text-muted text-center" style={{fontSize: 13, lineHeight: 1.5}}>
                                            {f.description}
                                        </div>
                                    </div>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .feature-card:focus,
                .feature-card:hover {
                    box-shadow: var(--shopemaa-shadow-lg) !important;
                    transform: translateY(-2px);
                    border-color: rgba(var(--shopemaa-brand-rgb), 0.22) !important;
                }

                .feature-card:focus-visible {
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(var(--shopemaa-brand-rgb), 0.28);
                }

                @media (max-width: 991px) {
                    .feature-card .card-body {
                        min-height: 170px;
                    }
                }

                @media (max-width: 575px) {
                    .feature-card .card-body {
                        min-height: 150px;
                    }
                }
            `}</style>
        </>
    );
}
