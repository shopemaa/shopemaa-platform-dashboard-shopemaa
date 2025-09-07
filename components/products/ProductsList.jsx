import React, {useMemo, useState, useEffect, useRef} from "react";

export default function ProductsList({
                                         rows = [],                    // [{ id, title, sku, price, currency, thumbnail, status, inventory, variantsCount, updatedAt, productType? }]
                                         onRowClick,                   // (product) => void
                                         onSearch,                     // (term) => void
                                         onCreate,                     // () => void
                                         onBulkAction,                 // (action, selectedIds) => void
                                         onEdit,                       // (product) => void
                                         onDelete,                     // (productId) => Promise<void> | void
                                         onDuplicate,                  // (productId) => Promise<void> | void
                                         loadProductDetails,           // async (id) => ProductDetails (see shape below)
                                         initialSearch = ""
                                     }) {
    /**
     * ProductDetails shape expected from `loadProductDetails(id)`:
     * {
     *   id, name, slug, description?, productType: "SIMPLE"|"VARIANT_PARENT"|"BUNDLE",
     *   variants: [{
     *     id, sku, basePrice, enabled,
     *     attributes: [{ // from VariantAttribute
     *       group: { id, code, name, dataType }, // derived from AttributeValue.attributeGroup
     *       value: { id, value, priceDelta }
     *     }],
     *     stockUnits?: [{
     *       id, quantity,
     *       dimensions: [{ group: {id, code, name, dataType}, value: {id, value} }]
     *     }]
     *   }]
     * }
     */

    const [term, setTerm] = useState(initialSearch);
    const [selected, setSelected] = useState(new Set());

    // Quick view state
    const [quickViewProduct, setQuickViewProduct] = useState(null);   // row-level summary
    const [details, setDetails] = useState(null);                     // full ProductDetails
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsError, setDetailsError] = useState("");

    // Offcanvas bootstrap binding (Tabler bundles Bootstrap)
    const offcanvasRef = useRef(null);
    useEffect(() => {
        if (typeof window !== "undefined" && window.bootstrap && offcanvasRef.current) {
            // eslint-disable-next-line no-new
            new window.bootstrap.Offcanvas(offcanvasRef.current);
        }
    }, []);

    // Header checkbox indeterminate handling
    const headerCheckRef = useRef(null);

    const allSelected = rows.length > 0 && selected.size === rows.length;
    const someSelected = selected.size > 0 && selected.size < rows.length;
    useEffect(() => {
        if (headerCheckRef.current) headerCheckRef.current.indeterminate = someSelected;
    }, [someSelected]);

    const toggleAll = () => {
        if (allSelected || someSelected) {
            setSelected(new Set());
        } else {
            setSelected(new Set(rows.map((r) => r.id)));
        }
    };

    const toggleOne = (id) => {
        const next = new Set(selected);
        next.has(id) ? next.delete(id) : next.add(id);
        setSelected(next);
    };

    const shown = useMemo(() => {
        if (!term) return rows;
        const t = term.toLowerCase();
        return rows.filter((r) =>
            [r.title, r.sku].filter(Boolean).some((s) => String(s).toLowerCase().includes(t))
        );
    }, [rows, term]);

    const money = (price, currency) => {
        try {
            return new Intl.NumberFormat(undefined, {style: "currency", currency}).format(price / 100);
        } catch {
            return `${(price / 100).toFixed(2)} ${currency || ""}`.trim();
        }
    };

    const statusBadge = (s) => {
        const map = {
            active: "bg-lime",
            draft: "bg-yellow",
            archived: "bg-secondary",
            out_of_stock: "bg-red",
            low_stock: "bg-orange",
        };
        const key = map[s] || "bg-blue";
        return (
            <span className={`badge ${key}-lt text-uppercase`}>
        {(s || "active").replaceAll("_", " ")}
      </span>
        );
    };

    const typeBadge = (t) => {
        if (!t) return null;
        const label = String(t).replaceAll("_", " ");
        const tone =
            t === "SIMPLE" ? "bg-primary" :
                t === "VARIANT_PARENT" ? "bg-indigo" :
                    t === "BUNDLE" ? "bg-teal" : "bg-secondary";
        return <span className={`badge ${tone}-lt text-uppercase`}>{label}</span>;
    };

    const bulkAction = (action) => {
        if (onBulkAction && selected.size) onBulkAction(action, Array.from(selected));
    };

    const handleEdit = (e, p) => {
        e.stopPropagation();
        if (onEdit) onEdit(p);
    };

    const handleDuplicate = (e, p) => {
        e.stopPropagation();
        if (onDuplicate) onDuplicate(p.id);
    };

    const handleDelete = async (e, p) => {
        e.stopPropagation();
        const ok = window.confirm(`Delete "${p.title || p.sku || p.id}"? This cannot be undone.`);
        if (!ok) return;
        if (onDelete) await onDelete(p.id);
    };

    const openQuickView = async (e, p) => {
        e.stopPropagation();
        setQuickViewProduct(p);
        setDetails(null);
        setDetailsError("");
        if (!window.bootstrap && offcanvasRef.current) {
            offcanvasRef.current.classList.add("show");
            offcanvasRef.current.style.visibility = "visible";
            document.body.classList.add("offcanvas-backdrop", "show");
        }
        if (typeof loadProductDetails === "function") {
            try {
                setDetailsLoading(true);
                const d = await loadProductDetails(p.id);
                setDetails(d || null);
            } catch (err) {
                setDetailsError("Failed to load product details.");
            } finally {
                setDetailsLoading(false);
            }
        }
    };

    const closeQuickView = () => {
        if (offcanvasRef.current) {
            offcanvasRef.current.classList.remove("show");
            offcanvasRef.current.style.removeProperty("visibility");
            document.body.classList.remove("offcanvas-backdrop", "show");
        }
        setQuickViewProduct(null);
        setDetails(null);
        setDetailsError("");
    };

    // Helpers to render attributes/stock
    const variantAttrToPairs = (variant) => {
        if (!variant?.attributes?.length) return [];
        return variant.attributes.map((a) => ({
            groupCode: a.group?.code || a.group?.name || "ATTR",
            groupName: a.group?.name || a.group?.code || "Attribute",
            value: a.value?.value || "",
            dataType: a.group?.dataType || "STRING",
        }));
    };

    const variantStockQty = (variant) => {
        if (!variant?.stockUnits?.length) return undefined;
        return variant.stockUnits.reduce((sum, su) => sum + (su.quantity || 0), 0);
    };

    const renderAttrChips = (pairs) => {
        if (!pairs.length) return <span className="text-muted">—</span>;
        return (
            <div className="d-flex flex-wrap gap-1">
                {pairs.map((p, idx) => (
                    <span key={idx} className="badge bg-secondary-lt">
            <span className="text-muted">{p.groupName}:</span>&nbsp;{p.value}
          </span>
                ))}
            </div>
        );
    };

    const summarizeGroupMatrix = (variants) => {
        // Build a map of group -> set of values across all variants
        const map = new Map();
        (variants || []).forEach((v) => {
            variantAttrToPairs(v).forEach(({groupName, value}) => {
                if (!map.has(groupName)) map.set(groupName, new Set());
                map.get(groupName).add(value);
            });
        });
        return Array.from(map.entries()).map(([group, set]) => ({group, values: Array.from(set)}));
    };

    return (
        <div className="card">
            {/* Header / Actions */}
            <div className="card-header">
                <div className="d-flex w-100 align-items-center gap-2">
                    <div className="input-icon w-100 w-sm-auto" style={{maxWidth: 380}}>
            <span className="input-icon-addon">
              <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="20" height="20" viewBox="0 0 24 24"
                   strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path
                  stroke="none" d="M0 0h24v24H0z"/><circle cx="10" cy="10" r="7"/><line x1="21" y1="21" x2="15"
                                                                                        y2="15"/></svg>
            </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search products, SKU…"
                            value={term}
                            onChange={(e) => {
                                setTerm(e.target.value);
                                if (onSearch) onSearch(e.target.value);
                            }}
                            aria-label="Search products"
                        />
                    </div>

                    {selected.size > 0 ? (
                        <div className="btn-list ms-auto">
                            <button className="btn btn-outline-danger" onClick={() => bulkAction("archive")}>Archive
                            </button>
                            <button className="btn btn-outline-secondary" onClick={() => bulkAction("draft")}>Mark as
                                draft
                            </button>
                            <button className="btn btn-outline-primary"
                                    onClick={() => bulkAction("activate")}>Activate
                            </button>
                        </div>
                    ) : (
                        <div className="ms-auto">
                            <button className="btn btn-primary" onClick={onCreate}>Add product</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="table-responsive">
                <table className="table table-vcenter card-table qrcentral-table">
                    <thead className="d-md-table-header-group">
                    <tr>
                        <th style={{width: 36}}>
                            <label className="form-check m-0">
                                <input
                                    ref={headerCheckRef}
                                    className="form-check-input"
                                    type="checkbox"
                                    aria-label="Select all products"
                                    checked={allSelected}
                                    onChange={toggleAll}
                                />
                            </label>
                        </th>
                        <th>Product</th>
                        <th>SKU</th>
                        <th className="d-none d-lg-table-cell">Type</th>
                        <th className="text-end">Price</th>
                        <th className="text-end">Inventory</th>
                        <th>Status</th>
                        <th className="w-1">Updated</th>
                        <th className="w-1 text-end">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {shown.map((p) => (
                        <tr
                            key={p.id}
                            role={onRowClick ? "button" : undefined}
                            onClick={(e) => {
                                const tag = e.target.tagName.toLowerCase();
                                if (tag !== "input" && onRowClick) onRowClick(p);
                            }}
                            style={{cursor: onRowClick ? "pointer" : "default"}}
                        >
                            {/* checkbox */}
                            <td data-header="">
                                <div className="form-check m-0">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={selected.has(p.id)}
                                        onChange={() => toggleOne(p.id)}
                                        onClick={(e) => e.stopPropagation()}
                                        aria-label={`Select ${p.title}`}
                                    />
                                </div>
                            </td>

                            {/* product (thumb + title + variants) */}
                            <td data-header="Product">
                                <div className="d-flex align-items-center">
                                    {p.thumbnail ? (
                                        <span
                                            className="avatar me-2"
                                            style={{backgroundImage: `url(${p.thumbnail})`}}
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <span
                                            className="avatar me-2"
                                            style={{background: "rgba(var(--shopemaa-brand-rgb), .12)"}}
                                            aria-hidden="true"
                                        >
                        {String(p.title || "?").charAt(0).toUpperCase()}
                      </span>
                                    )}
                                    <div className="lh-sm">
                                        <div className="fw-medium">{p.title || "Untitled product"}</div>
                                        <div className="text-muted small">
                                            {p.variantsCount ? `${p.variantsCount} variants` : "Single variant"}
                                        </div>
                                    </div>
                                </div>
                            </td>

                            {/* sku */}
                            <td data-header="SKU">
                                <div className="text-muted">{p.sku || "—"}</div>
                            </td>

                            {/* type */}
                            <td data-header="Type" className="d-none d-lg-table-cell">
                                {typeBadge(p.productType)}
                            </td>

                            {/* price */}
                            <td data-header="Price" className="text-end">
                                <div className="fw-medium">
                                    {typeof p.price === "number" ? money(p.price, p.currency || "USD") : "—"}
                                </div>
                            </td>

                            {/* inventory */}
                            <td data-header="Inventory" className="text-end">
                                <div
                                    className={Number(p.inventory) <= 0 ? "text-danger" : Number(p.inventory) < 5 ? "text-warning" : ""}>
                                    {Number.isFinite(p.inventory) ? p.inventory : "—"}
                                </div>
                            </td>

                            {/* status */}
                            <td data-header="Status">
                                {statusBadge(p.status || (p.inventory <= 0 ? "out_of_stock" : "active"))}
                            </td>

                            {/* updated */}
                            <td data-header="Updated" className="text-muted">
                                {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : "—"}
                            </td>

                            {/* actions */}
                            <td data-header="Actions" className="text-end">
                                <div className="btn-list flex-nowrap d-inline-flex">
                                    <button
                                        className="btn btn-sm btn-outline"
                                        title="Quick view"
                                        data-bs-toggle="offcanvas"
                                        data-bs-target="#productQuickView"
                                        onClick={(e) => openQuickView(e, p)}
                                        aria-label={`Quick view ${p.title}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="18" height="18"
                                             viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"
                                             strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z"/>
                                            <circle cx="12" cy="12" r="2"/>
                                            <path
                                                d="M22 12c-2.667 4 -6 6 -10 6s-7.333 -2 -10 -6c2.667 -4 6 -6 10 -6s7.333 2 10 6"/>
                                        </svg>
                                    </button>

                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        title="Edit"
                                        onClick={(e) => handleEdit(e, p)}
                                        aria-label={`Edit ${p.title}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="18" height="18"
                                             viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"
                                             strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z"/>
                                            <path d="M7 21h7"/>
                                            <path
                                                d="M20.385 7.627l-3 -3a1.5 1.5 0 0 0 -2.121 0l-10.243 10.243a1 1 0 0 0 -.263 .464l-1.258 4.514a.5.5 0 0 0 .621 .621l4.514 -1.258a1 1 0 0 0 .464 -.263l10.243 -10.243a1.5 1.5 0 0 0 0 -2.121z"/>
                                        </svg>
                                    </button>

                                    <button
                                        className="btn btn-sm btn-outline-secondary"
                                        title="Duplicate"
                                        onClick={(e) => handleDuplicate(e, p)}
                                        aria-label={`Duplicate ${p.title}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="18" height="18"
                                             viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"
                                             strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z"/>
                                            <rect x="7" y="7" width="10" height="10" rx="2"/>
                                            <path d="M3 7a2 2 0 0 1 2 -2h4"/>
                                        </svg>
                                    </button>

                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        title="Delete"
                                        onClick={(e) => handleDelete(e, p)}
                                        aria-label={`Delete ${p.title}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="18" height="18"
                                             viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"
                                             strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z"/>
                                            <path d="M4 7h16"/>
                                            <path d="M10 11v6"/>
                                            <path d="M14 11v6"/>
                                            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"/>
                                            <path d="M9 7V4h6v3"/>
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}

                    {shown.length === 0 && (
                        <tr>
                            <td colSpan={9} className="text-center text-muted py-5">
                                No products found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Footer / Pagination placeholder */}
            <div className="card-footer d-flex align-items-center">
                <p className="m-0 text-muted">
                    Showing {shown.length} of {rows.length} products
                </p>
                <ul className="pagination m-0 ms-auto">
                    <li className="page-item disabled">
                        <a className="page-link" href="#" tabIndex={-1} aria-disabled="true">prev</a>
                    </li>
                    <li className="page-item active">
                        <a className="page-link" href="#">1</a>
                    </li>
                    <li className="page-item">
                        <a className="page-link" href="#">2</a>
                    </li>
                    <li className="page-item">
                        <a className="page-link" href="#">next</a>
                    </li>
                </ul>
            </div>

            {/* Quick View Offcanvas */}
            <div
                className="offcanvas offcanvas-end"
                tabIndex="-1"
                id="productQuickView"
                aria-labelledby="productQuickViewLabel"
                ref={offcanvasRef}
                style={{width: 520}}
            >
                <div className="offcanvas-header">
                    <h2 className="offcanvas-title h3" id="productQuickViewLabel">
                        {quickViewProduct?.title || "Product"}
                    </h2>
                    <button
                        type="button"
                        className="btn-close text-reset"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                        onClick={closeQuickView}
                    />
                </div>

                <div className="offcanvas-body">
                    {/* Summary header */}
                    <div className="d-flex align-items-center mb-3">
                        {quickViewProduct?.thumbnail ? (
                            <span className="avatar me-3"
                                  style={{backgroundImage: `url(${quickViewProduct.thumbnail})`}}/>
                        ) : (
                            <span className="avatar me-3" style={{background: "rgba(var(--shopemaa-brand-rgb), .12)"}}>
                {String(quickViewProduct?.title || "?").charAt(0).toUpperCase()}
              </span>
                        )}
                        <div className="lh-sm">
                            <div className="fw-medium">{quickViewProduct?.title}</div>
                            <div className="d-flex gap-2 align-items-center">
                                {typeBadge(quickViewProduct?.productType)}
                                {statusBadge(quickViewProduct?.status)}
                            </div>
                        </div>
                    </div>

                    {/* Price / Inventory overview */}
                    <div className="row g-3 mb-3">
                        <div className="col-6">
                            <div className="text-muted small mb-1">From price</div>
                            <div className="fw-medium">
                                {typeof quickViewProduct?.price === "number"
                                    ? money(quickViewProduct.price, quickViewProduct.currency || "USD")
                                    : "—"}
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="text-muted small mb-1">Inventory</div>
                            <div>{Number.isFinite(quickViewProduct?.inventory) ? quickViewProduct.inventory : "—"}</div>
                        </div>
                    </div>

                    <div className="text-muted small mb-2">
                        Last
                        updated: {quickViewProduct?.updatedAt ? new Date(quickViewProduct.updatedAt).toLocaleString() : "—"}
                    </div>

                    {/* Details loader state */}
                    {detailsLoading && (
                        <div className="card card-sm mb-3">
                            <div className="card-body d-flex align-items-center">
                                <div className="spinner-border me-2" role="status" aria-hidden="true"/>
                                <div>Loading product details…</div>
                            </div>
                        </div>
                    )}
                    {detailsError && (
                        <div className="alert alert-danger" role="alert">
                            {detailsError}
                        </div>
                    )}

                    {/* Attributes matrix: show available values per attribute group across variants */}
                    {details && details.variants?.length > 0 && (
                        <>
                            <div className="mb-2 fw-bold">Attributes</div>
                            <div className="row g-2 mb-3">
                                {(() => {
                                    const matrix = summarizeGroupMatrix(details.variants);
                                    if (!matrix.length) {
                                        return <div className="col-12 text-muted">—</div>;
                                    }
                                    return matrix.map(({group, values}) => (
                                        <div key={group} className="col-12">
                                            <div className="d-flex align-items-center flex-wrap gap-2">
                                                <span className="text-muted small" style={{minWidth: 80}}>{group}</span>
                                                <div className="d-flex flex-wrap gap-1">
                                                    {values.map((v, i) => (
                                                        <span key={i} className="badge bg-secondary-lt">{v}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ));
                                })()}
                            </div>

                            {/* Variants table */}
                            <div className="mb-2 fw-bold">Variants</div>
                            <div className="table-responsive mb-3">
                                <table className="table table-sm">
                                    <thead>
                                    <tr>
                                        <th>SKU</th>
                                        <th className="text-end">Base price</th>
                                        <th>Enabled</th>
                                        <th>Attributes</th>
                                        <th className="text-end">Qty</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {details.variants.map((v) => {
                                        const pairs = variantAttrToPairs(v);
                                        const qty = variantStockQty(v);
                                        return (
                                            <tr key={v.id}>
                                                <td className="text-nowrap">{v.sku}</td>
                                                <td className="text-end">{money(v.basePrice, quickViewProduct?.currency || "USD")}</td>
                                                <td>{v.enabled ? <span className="badge bg-lime-lt">Yes</span> :
                                                    <span className="badge bg-secondary-lt">No</span>}</td>
                                                <td>{renderAttrChips(pairs)}</td>
                                                <td className="text-end">{Number.isFinite(qty) ? qty : "—"}</td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Optional stock breakdown per variant (dimensions) */}
                            {details.variants.some(v => Array.isArray(v.stockUnits) && v.stockUnits.length) && (
                                <>
                                    <div className="mb-2 fw-bold">Stock units</div>
                                    <div className="table-responsive">
                                        <table className="table table-sm">
                                            <thead>
                                            <tr>
                                                <th>Variant (SKU)</th>
                                                <th>Dimensions</th>
                                                <th className="text-end">Qty</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {details.variants.flatMap((v) =>
                                                (v.stockUnits || []).map((su) => (
                                                    <tr key={su.id}>
                                                        <td className="text-nowrap">{v.sku}</td>
                                                        <td>
                                                            {su.dimensions?.length ? renderAttrChips(
                                                                su.dimensions.map(d => ({
                                                                    groupName: d.group?.name || d.group?.code || "Attribute",
                                                                    value: d.value?.value || "",
                                                                }))
                                                            ) : <span className="text-muted">—</span>}
                                                        </td>
                                                        <td className="text-end">{su.quantity}</td>
                                                    </tr>
                                                ))
                                            )}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {/* Fallback when no loader provided */}
                    {!detailsLoading && !details && !detailsError && (
                        <div className="card card-sm">
                            <div className="card-body">
                                <div className="text-muted">
                                    No extended details. Provide a <code>loadProductDetails</code> prop to populate
                                    variants & attributes.
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="d-flex gap-2 mt-4">
                        <button className="btn btn-primary"
                                onClick={() => onEdit && quickViewProduct && onEdit(quickViewProduct)}>
                            Edit product
                        </button>
                        <button className="btn btn-outline-secondary"
                                onClick={() => onDuplicate && quickViewProduct && onDuplicate(quickViewProduct.id)}>
                            Duplicate
                        </button>
                        <button className="btn btn-outline-danger ms-auto"
                                onClick={() => onDelete && quickViewProduct && onDelete(quickViewProduct.id)}>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
