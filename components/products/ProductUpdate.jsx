// components/products/ProductCreateForm.jsx
import React, {useEffect, useMemo, useState} from "react";

/**
 * ProductCreateForm (UI component)
 * - Modular sections: Basics, Type, Attributes, Variants, Stock, Review
 * - Mocked AttributeGroups/Values loader (replace with API)
 * - Generates variants from selected attribute values for VARIANT_PARENT
 * - SIMPLE: single variant editor
 * - BUNDLE: uses "Included" (BUNDLE_ITEM) attribute values as items; single variant
 *
 * Exports a self-contained form. Parent page controls routing / submission if desired.
 */

// ---------------- Mock Data Loaders (replace with API) ----------------
const mockLoadAttributeGroups = async () => {
    // Mirrors AttributeGroup + AttributeValue (simplified)
    const groups = [
        {
            id: "ag_colour",
            code: "COLOUR",
            name: "Colour",
            dataType: "COLOR",
            priceAffecting: true,
            inventoryDimension: true,
            values: [
                {id: "av_black", value: "Black", priceDelta: 0},
                {id: "av_white", value: "White", priceDelta: 0},
                {id: "av_red", value: "Red", priceDelta: 0},
            ],
        },
        {
            id: "ag_size",
            code: "SIZE",
            name: "Size",
            dataType: "STRING",
            priceAffecting: false,
            inventoryDimension: true,
            values: [
                {id: "av_s", value: "S", priceDelta: 0},
                {id: "av_m", value: "M", priceDelta: 0},
                {id: "av_l", value: "L", priceDelta: 0},
            ],
        },
        {
            id: "ag_material",
            code: "MATERIAL",
            name: "Material",
            dataType: "STRING",
            priceAffecting: true,
            inventoryDimension: false,
            values: [
                {id: "av_cotton", value: "Cotton", priceDelta: 0},
                {id: "av_merino", value: "Merino", priceDelta: 500},
            ],
        },
        // For bundle composition
        {
            id: "ag_bundle_item",
            code: "BUNDLE_ITEM",
            name: "Included",
            dataType: "STRING",
            priceAffecting: false,
            inventoryDimension: false,
            values: [
                {id: "bi_console", value: "Next-gen Console", priceDelta: 0},
                {id: "bi_controller", value: "Extra Wireless Controller", priceDelta: 0},
                {id: "bi_game1", value: "Star Quest (Game)", priceDelta: 0},
                {id: "bi_game2", value: "Racer X (Game)", priceDelta: 0},
            ],
        },
    ];
    return groups;
};

// ---------------- Utilities ----------------
const toSlug = (s = "") =>
    s
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

const moneyFmt = (cents, currency = "USD") => {
    if (typeof cents !== "number") return "—";
    try {
        return new Intl.NumberFormat(undefined, {style: "currency", currency}).format(cents / 100);
    } catch {
        return `${(cents / 100).toFixed(2)} ${currency}`;
    }
};

const PT = {
    SIMPLE: "SIMPLE",
    VARIANT_PARENT: "VARIANT_PARENT",
    BUNDLE: "BUNDLE",
};

// Cartesian product helper
const cartesian = (arrays) =>
    arrays.reduce((a, b) => a.flatMap((d) => b.map((e) => [...d, e])), [[]]);

// ---------------- Subcomponents ----------------
function Section({title, subtitle, children, right}) {
    return (
        <div className="card mb-3">
            <div className="card-header d-flex align-items-center">
                <div>
                    <div className="card-title mb-0 h3">{title}</div>
                    {subtitle && <div className="text-muted small">{subtitle}</div>}
                </div>
                {right && <div className="ms-auto">{right}</div>}
            </div>
            <div className="card-body">{children}</div>
        </div>
    );
}

function BasicsForm({name, setName, slug, setSlug, description, setDescription}) {
    useEffect(() => {
        setSlug((prev) => (prev ? prev : toSlug(name)));
    }, [name, setSlug]);

    return (
        <div className="row g-3">
            <div className="col-md-6">
                <label className="form-label">Name</label>
                <input
                    className="form-control"
                    placeholder="e.g., Classic Tee"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="col-md-6">
                <label className="form-label">Slug</label>
                <input
                    className="form-control"
                    placeholder="classic-tee"
                    value={slug}
                    onChange={(e) => setSlug(toSlug(e.target.value))}
                />
            </div>
            <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Optional description shown on product page."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
        </div>
    );
}

function TypeSelector({productType, setProductType}) {
    return (
        <div className="btn-group" role="group" aria-label="Product type">
            {Object.values(PT).map((t) => (
                <button
                    type="button"
                    key={t}
                    className={`btn ${productType === t ? "btn-primary" : "btn-outline"} `}
                    onClick={() => setProductType(t)}
                >
                    {t.replace("_", " ")}
                </button>
            ))}
        </div>
    );
}

function AttributesSelector({
                                groups, // [{ id, code, name, priceAffecting, inventoryDimension, values: [{id,value,priceDelta}...] }]
                                selected, // Map<groupId, Set<valueId>>
                                setSelected,
                                hiddenGroups = [],
                                allowMulti = true,
                                help,
                            }) {
    const showGroups = groups.filter((g) => !hiddenGroups.includes(g.code));

    const toggle = (gid, vid) => {
        const next = new Map(selected);
        const set = new Set(next.get(gid) || []);
        if (set.has(vid)) set.delete(vid);
        else {
            if (!allowMulti) set.clear();
            set.add(vid);
        }
        next.set(gid, set);
        setSelected(next);
    };

    return (
        <div className="vstack gap-3">
            {help && <div className="text-muted small">{help}</div>}
            {showGroups.map((g) => (
                <div key={g.id}>
                    <div className="mb-2 d-flex align-items-center">
                        <div className="fw-medium">{g.name}</div>
                        <div className="ms-2 small text-muted">
                            {g.priceAffecting && <span className="me-2 badge bg-orange-lt">Price affecting</span>}
                            {g.inventoryDimension && <span className="badge bg-indigo-lt">Inventory dimension</span>}
                        </div>
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                        {g.values.map((v) => {
                            const active = selected.get(g.id)?.has(v.id);
                            return (
                                <button
                                    key={v.id}
                                    type="button"
                                    className={`btn btn-sm ${active ? "btn-primary" : "btn-outline"}`}
                                    onClick={() => toggle(g.id, v.id)}
                                >
                                    {g.code === "COLOUR" ? (
                                        <span
                                            className="avatar avatar-xs me-1"
                                            style={{background: v.value.toLowerCase(), border: "1px solid #eee"}}
                                        />
                                    ) : null}
                                    {v.value}
                                    {v.priceDelta ? ` (+${moneyFmt(v.priceDelta)})` : ""}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}

function VariantsGenerator({
                               groups,
                               selectedValuesByGroup, // Map<groupId, Set<valueId>>
                               basePriceCents,
                               setBasePriceCents,
                               variants,
                               setVariants,
                               currency = "USD",
                           }) {
    const selectedGroups = useMemo(
        () => groups.filter((g) => (selectedValuesByGroup.get(g.id) || new Set()).size > 0),
        [groups, selectedValuesByGroup]
    );

    const generate = () => {
        const valueArrays = selectedGroups.map((g) =>
            Array.from(selectedValuesByGroup.get(g.id) || [])
                .map((vid) => g.values.find((v) => v.id === vid))
                .filter(Boolean)
        );
        if (!valueArrays.length) return;

        const combos = cartesian(valueArrays);
        const nowKey = Date.now();
        const next = combos.map((values, idx) => {
            const attrs = values.map((v) => ({valueId: v.id}));
            const delta = values.reduce((sum, v) => sum + (v.priceDelta || 0), 0);
            const price = Number(basePriceCents || 0) + delta;
            const skuSuffix = values.map((v) => v.value).join("-");
            return {
                id: `tmp_${nowKey}_${idx}`,
                sku: `SKU-${skuSuffix}`.toUpperCase().replace(/\s+/g, ""),
                basePrice: price,
                enabled: true,
                attributes: attrs, // [{ valueId }]
                stockUnits: [],
            };
        });
        setVariants(next);
    };

    const updateVariant = (i, patch) => {
        const next = variants.map((v, idx) => (idx === i ? {...v, ...patch} : v));
        setVariants(next);
    };

    const removeVariant = (i) => {
        const next = variants.filter((_, idx) => idx !== i);
        setVariants(next);
    };

    return (
        <>
            <div className="row g-3 align-items-end">
                <div className="col-md-4">
                    <label className="form-label">Base price</label>
                    <div className="input-group">
                        <span className="input-group-text">{currency}</span>
                        <input
                            className="form-control"
                            type="number"
                            min={0}
                            step={1}
                            placeholder="in cents"
                            value={basePriceCents}
                            onChange={(e) => setBasePriceCents(Number(e.target.value || 0))}
                        />
                    </div>
                    <div className="small text-muted mt-1">
                        Variant price = base price + sum(attribute price deltas)
                    </div>
                </div>
                <div className="col-md-8">
                    <button className="btn btn-primary" type="button" onClick={generate}>
                        Generate variants from selected attributes
                    </button>
                </div>
            </div>

            <div className="table-responsive mt-3">
                <table className="table table-sm">
                    <thead>
                    <tr>
                        <th>SKU</th>
                        <th>Attributes</th>
                        <th className="text-end">Price</th>
                        <th>Enabled</th>
                        <th className="w-1"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {variants.map((v, i) => (
                        <tr key={v.id}>
                            <td style={{minWidth: 180}}>
                                <input
                                    className="form-control form-control-sm"
                                    value={v.sku}
                                    onChange={(e) => updateVariant(i, {sku: e.target.value})}
                                />
                            </td>
                            <td>
                                <div className="d-flex flex-wrap gap-1">
                                    {v.attributes?.length ? (
                                        v.attributes.map((a, idx) => {
                                            const gv = groups.flatMap((g) => g.values.map((val) => ({g, val})));
                                            const found = gv.find((x) => x.val.id === a.valueId);
                                            const label = found ? `${found.g.name}: ${found.val.value}` : a.valueId;
                                            return <span key={idx} className="badge bg-secondary-lt">{label}</span>;
                                        })
                                    ) : (
                                        <span className="text-muted">—</span>
                                    )}
                                </div>
                            </td>
                            <td className="text-end" style={{minWidth: 140}}>
                                <input
                                    className="form-control form-control-sm text-end"
                                    type="number"
                                    min={0}
                                    step={1}
                                    value={v.basePrice}
                                    onChange={(e) => updateVariant(i, {basePrice: Number(e.target.value || 0)})}
                                />
                                <div className="small text-muted mt-1">{moneyFmt(v.basePrice)}</div>
                            </td>
                            <td style={{width: 110}}>
                                <label className="form-check form-switch m-0">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={!!v.enabled}
                                        onChange={(e) => updateVariant(i, {enabled: e.target.checked})}
                                    />
                                </label>
                            </td>
                            <td className="text-end">
                                <button className="btn btn-link text-danger p-0" type="button"
                                        onClick={() => removeVariant(i)}>
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                    {variants.length === 0 && (
                        <tr>
                            <td colSpan={5} className="text-muted">
                                No variants yet. Select attribute values and click “Generate”.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </>
    );
}

function SimpleVariantEditor({sku, setSku, price, setPrice, enabled, setEnabled, currency = "USD"}) {
    return (
        <div className="row g-3">
            <div className="col-md-4">
                <label className="form-label">SKU</label>
                <input className="form-control" value={sku} onChange={(e) => setSku(e.target.value)}/>
            </div>
            <div className="col-md-4">
                <label className="form-label">Price (in cents)</label>
                <input
                    className="form-control"
                    type="number"
                    min={0}
                    step={1}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value || 0))}
                />
                <div className="small text-muted mt-1">{moneyFmt(price, currency)}</div>
            </div>
            <div className="col-md-4 d-flex align-items-end">
                <label className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" checked={enabled}
                           onChange={(e) => setEnabled(e.target.checked)}/>
                    <span className="form-check-label">Enabled</span>
                </label>
            </div>
        </div>
    );
}

function StockEditor({
                         groups, // attribute groups
                         variants, // [{ id, sku, ... }]
                         stockUnitsByVariant, // Map<variantId, [{ quantity, dimensions: [{ valueId }] } ...]>
                         setStockUnitsByVariant,
                     }) {
    const invGroups = groups.filter((g) => g.inventoryDimension);

    const addStockUnit = (vid) => {
        const next = new Map(stockUnitsByVariant);
        const list = next.get(vid) ? [...next.get(vid)] : [];
        list.push({quantity: 0, dimensions: []});
        next.set(vid, list);
        setStockUnitsByVariant(next);
    };

    const updateUnit = (vid, idx, patch) => {
        const next = new Map(stockUnitsByVariant);
        const list = [...(next.get(vid) || [])];
        list[idx] = {...list[idx], ...patch};
        next.set(vid, list);
        setStockUnitsByVariant(next);
    };

    const toggleDimValue = (vid, idx, gid, valueId) => {
        const next = new Map(stockUnitsByVariant);
        const list = [...(next.get(vid) || [])];
        const unit = {...list[idx]};
        const dims = Array.isArray(unit.dimensions) ? [...unit.dimensions] : [];
        const others = dims.filter((d) => d.groupId !== gid);
        others.push({groupId: gid, valueId});
        unit.dimensions = others;
        list[idx] = unit;
        next.set(vid, list);
        setStockUnitsByVariant(next);
    };

    const removeUnit = (vid, idx) => {
        const next = new Map(stockUnitsByVariant);
        const list = [...(next.get(vid) || [])];
        list.splice(idx, 1);
        next.set(vid, list);
        setStockUnitsByVariant(next);
    };

    if (!variants.length) {
        return <div className="text-muted">No variants to stock.</div>;
    }

    return (
        <div className="vstack gap-3">
            {variants.map((v) => {
                const units = stockUnitsByVariant.get(v.id) || [];
                return (
                    <div key={v.id} className="border rounded p-3">
                        <div className="fw-medium mb-2">Variant: {v.sku}</div>
                        {units.length === 0 && <div className="text-muted small mb-2">No stock units yet.</div>}
                        <div className="vstack gap-2">
                            {units.map((u, idx) => (
                                <div key={idx} className="row g-2 align-items-end">
                                    {invGroups.map((g) => (
                                        <div key={g.id} className="col-md-3">
                                            <label className="form-label">{g.name}</label>
                                            <select
                                                className="form-select"
                                                value={u.dimensions.find((d) => d.groupId === g.id)?.valueId || ""}
                                                onChange={(e) => toggleDimValue(v.id, idx, g.id, e.target.value)}
                                            >
                                                <option value="">Select {g.name}</option>
                                                {g.values.map((val) => (
                                                    <option value={val.id} key={val.id}>
                                                        {val.value}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    ))}
                                    <div className="col-md-3">
                                        <label className="form-label">Quantity</label>
                                        <input
                                            type="number"
                                            min={0}
                                            step={1}
                                            className="form-control"
                                            value={u.quantity}
                                            onChange={(e) => updateUnit(v.id, idx, {quantity: Number(e.target.value || 0)})}
                                        />
                                    </div>
                                    <div className="col-md-3 text-end">
                                        <button className="btn btn-link text-danger" type="button"
                                                onClick={() => removeUnit(v.id, idx)}>
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-2">
                            <button className="btn btn-outline" type="button" onClick={() => addStockUnit(v.id)}>
                                Add stock unit
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ---------------- Main UI Component ----------------
export default function ProductUpdateForm({onSubmitPayload}) {
    const [loading, setLoading] = useState(true);
    const [groups, setGroups] = useState([]);

    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [productType, setProductType] = useState(PT.SIMPLE);

    // Attribute selections driving variants
    const [selectedValuesByGroup, setSelectedValuesByGroup] = useState(new Map());

    // SIMPLE fields
    const [simpleSku, setSimpleSku] = useState("");
    const [simplePrice, setSimplePrice] = useState(0);
    const [simpleEnabled, setSimpleEnabled] = useState(true);
    const [simpleStock, setSimpleStock] = useState(0);

    // VARIANT_PARENT fields
    const [basePriceCents, setBasePriceCents] = useState(0);
    const [variants, setVariants] = useState([]); // [{ id, sku, basePrice, enabled, attributes:[{valueId}], stockUnits:[] }]
    const [stockUnitsByVariant, setStockUnitsByVariant] = useState(new Map());

    // BUNDLE selections (values under BUNDLE_ITEM)
    const bundleGroup = useMemo(() => groups.find((g) => g.code === "BUNDLE_ITEM"), [groups]);
    const [bundleSelected, setBundleSelected] = useState(new Map()); // Map<groupId, Set<valueId>>
    const [bundleSku, setBundleSku] = useState("CONS-BNDL-2025");
    const [bundlePrice, setBundlePrice] = useState(49999);
    const [bundleEnabled, setBundleEnabled] = useState(true);
    const [bundleStock, setBundleStock] = useState(10);

    // Load attribute groups
    useEffect(() => {
        let alive = true;
        mockLoadAttributeGroups().then((g) => {
            if (!alive) return;
            setGroups(g);
            setLoading(false);
        });
        return () => {
            alive = false;
        };
    }, []);

    const resetForType = (t) => {
        setSelectedValuesByGroup(new Map());
        setVariants([]);
        setStockUnitsByVariant(new Map());
        if (t === PT.SIMPLE) {
            setSimpleSku("");
            setSimplePrice(0);
            setSimpleEnabled(true);
            setSimpleStock(0);
        }
        if (t === PT.BUNDLE) {
            setBundleSelected(new Map());
            setBundleSku("CONS-BNDL-2025");
            setBundlePrice(49999);
            setBundleEnabled(true);
            setBundleStock(10);
        }
    };

    // Compile payload for API
    const buildPayload = () => {
        const base = {
            name,
            slug: slug || toSlug(name),
            description: description || null,
            productType,
        };

        if (productType === PT.SIMPLE) {
            return {
                ...base,
                variants: [
                    {
                        sku: simpleSku || "SKU-0001",
                        basePrice: Number(simplePrice || 0),
                        enabled: !!simpleEnabled,
                        attributes: [],
                        stockUnits: [
                            {quantity: Math.max(0, simpleStock), dimensions: []},
                        ],
                    },
                ],
            };
        }

        if (productType === PT.BUNDLE) {
            const items = Array.from(bundleSelected.get(bundleGroup?.id || "") || []);
            return {
                ...base,
                variants: [
                    {
                        sku: bundleSku || "BUNDLE-SKU",
                        basePrice: Number(bundlePrice || 0),
                        enabled: !!bundleEnabled,
                        attributes: items.map((vid) => ({valueId: vid})), // BUNDLE_ITEM values
                        stockUnits: [
                            {quantity: Math.max(0, bundleStock), dimensions: []},
                        ],
                    },
                ],
            };
        }

        // VARIANT_PARENT
        const compiledVariants = variants.map((v) => ({
            sku: v.sku,
            basePrice: Number(v.basePrice || 0),
            enabled: !!v.enabled,
            attributes: (v.attributes || []).map((a) => ({valueId: a.valueId})),
            stockUnits: (stockUnitsByVariant.get(v.id) || []).map((u) => ({
                quantity: Number(u.quantity || 0),
                dimensions: (u.dimensions || []).map((d) => ({valueId: d.valueId})),
            })),
        }));

        return {
            ...base,
            variants: compiledVariants,
        };
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = buildPayload();
        if (typeof onSubmitPayload === "function") {
            onSubmitPayload(payload);
        } else {
            console.log("CREATE PRODUCT PAYLOAD:", payload);
            alert("Check console for payload.\n(Replace with API call, then navigate.)");
        }
    };

    if (loading) {
        return (
            <div className="card">
                <div className="card-body d-flex align-items-center justify-content-center" style={{minHeight: 240}}>
                    <div className="text-muted">Loading…</div>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            {/* Basics */}
            <Section title="Basics" subtitle="Name, slug, and description.">
                <BasicsForm
                    name={name}
                    setName={setName}
                    slug={slug}
                    setSlug={setSlug}
                    description={description}
                    setDescription={setDescription}
                />
            </Section>

            {/* Type */}
            <Section
                title="Product type"
                subtitle="Choose how this product behaves in catalog and checkout."
                right={<TypeSelector productType={productType} setProductType={(t) => {
                    setProductType(t);
                    resetForType(t);
                }}/>}
            >
                <div className="text-muted">
                    {productType === PT.SIMPLE && "A single SKU with a fixed price."}
                    {productType === PT.VARIANT_PARENT && "Generate multiple SKUs from attribute combinations (e.g., size, colour)."}
                    {productType === PT.BUNDLE && "A bundle that includes several items sold together as one SKU."}
                </div>
            </Section>

            {/* Attribute selection */}
            {productType === PT.VARIANT_PARENT && (
                <Section
                    title="Attributes"
                    subtitle="Select attribute values to generate variants. Marked attributes may affect price or inventory."
                >
                    <AttributesSelector
                        groups={groups}
                        selected={selectedValuesByGroup}
                        setSelected={setSelectedValuesByGroup}
                        hiddenGroups={["BUNDLE_ITEM"]}
                        help="Choose values for attributes like Colour, Size, Material."
                    />
                </Section>
            )}

            {productType === PT.BUNDLE && bundleGroup && (
                <Section title="Bundle items" subtitle="Pick what’s included in this bundle (for display).">
                    <AttributesSelector
                        groups={[bundleGroup]}
                        selected={bundleSelected}
                        setSelected={setBundleSelected}
                        hiddenGroups={[]}
                        help="These items will appear in product details and can inform fulfillment."
                    />
                </Section>
            )}

            {/* Variants or Simple or Bundle */}
            {productType === PT.VARIANT_PARENT && (
                <Section title="Variants" subtitle="Generate and edit variant SKUs, prices, and availability.">
                    <VariantsGenerator
                        groups={groups}
                        selectedValuesByGroup={selectedValuesByGroup}
                        basePriceCents={basePriceCents}
                        setBasePriceCents={setBasePriceCents}
                        variants={variants}
                        setVariants={setVariants}
                    />
                </Section>
            )}

            {productType === PT.SIMPLE && (
                <Section title="Simple variant" subtitle="Single SKU and price.">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <SimpleVariantEditor
                                sku={simpleSku}
                                setSku={setSimpleSku}
                                price={simplePrice}
                                setPrice={setSimplePrice}
                                enabled={simpleEnabled}
                                setEnabled={setSimpleEnabled}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Initial stock (units)</label>
                            <input
                                className="form-control"
                                type="number"
                                min={0}
                                step={1}
                                value={simpleStock}
                                onChange={(e) => setSimpleStock(Number(e.target.value || 0))}
                            />
                        </div>
                    </div>
                </Section>
            )}

            {productType === PT.BUNDLE && (
                <Section title="Bundle configuration" subtitle="Bundle SKU, price, and availability.">
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label">Bundle SKU</label>
                            <input className="form-control" value={bundleSku}
                                   onChange={(e) => setBundleSku(e.target.value)}/>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Bundle price (in cents)</label>
                            <input
                                className="form-control"
                                type="number"
                                min={0}
                                step={1}
                                value={bundlePrice}
                                onChange={(e) => setBundlePrice(Number(e.target.value || 0))}
                            />
                            <div className="small text-muted mt-1">{moneyFmt(bundlePrice)}</div>
                        </div>
                        <div className="col-md-4 d-flex align-items-end">
                            <label className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" checked={bundleEnabled}
                                       onChange={(e) => setBundleEnabled(e.target.checked)}/>
                                <span className="form-check-label">Enabled</span>
                            </label>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Bundle stock (units)</label>
                            <input
                                className="form-control"
                                type="number"
                                min={0}
                                step={1}
                                value={bundleStock}
                                onChange={(e) => setBundleStock(Number(e.target.value || 0))}
                            />
                        </div>
                    </div>
                </Section>
            )}

            {/* Stock */}
            {productType === PT.VARIANT_PARENT && (
                <Section
                    title="Stock & dimensions"
                    subtitle="Optional: track inventory per dimension (e.g., Colour + Size) per variant."
                >
                    <StockEditor
                        groups={groups}
                        variants={variants}
                        stockUnitsByVariant={stockUnitsByVariant}
                        setStockUnitsByVariant={setStockUnitsByVariant}
                    />
                </Section>
            )}

            {/* Review */}
            <Section
                title="Review & save"
                subtitle="We’ll compile a payload matching your backend model."
                right={
                    <button type="submit" className="btn btn-primary">
                        Save product
                    </button>
                }
            >
        <pre className="bg-light p-3 rounded small" style={{maxHeight: 320, overflow: "auto"}}>
          {JSON.stringify(
              (() => {
                  const base = {
                      name,
                      slug: slug || toSlug(name),
                      description: description || null,
                      productType,
                  };
                  if (productType === PT.SIMPLE) {
                      return {
                          ...base,
                          variants: [
                              {
                                  sku: simpleSku || "SKU-0001",
                                  basePrice: Number(simplePrice || 0),
                                  enabled: !!simpleEnabled,
                                  attributes: [],
                                  stockUnits: [{quantity: Math.max(0, simpleStock), dimensions: []}],
                              },
                          ],
                      };
                  }
                  if (productType === PT.BUNDLE) {
                      const items = Array.from(bundleSelected.get(bundleGroup?.id || "") || []);
                      return {
                          ...base,
                          variants: [
                              {
                                  sku: bundleSku || "BUNDLE-SKU",
                                  basePrice: Number(bundlePrice || 0),
                                  enabled: !!bundleEnabled,
                                  attributes: items.map((vid) => ({valueId: vid})),
                                  stockUnits: [{quantity: Math.max(0, bundleStock), dimensions: []}],
                              },
                          ],
                      };
                  }
                  // VARIANT_PARENT
                  return {
                      ...base,
                      variants: variants.map((v) => ({
                          sku: v.sku,
                          basePrice: Number(v.basePrice || 0),
                          enabled: !!v.enabled,
                          attributes: (v.attributes || []).map((a) => ({valueId: a.valueId})),
                          stockUnits: (stockUnitsByVariant.get(v.id) || []).map((u) => ({
                              quantity: Number(u.quantity || 0),
                              dimensions: (u.dimensions || []).map((d) => ({valueId: d.valueId})),
                          })),
                      })),
                  };
              })(),
              null,
              2
          )}
        </pre>
                <div className="text-muted small">
                    Replace the submit handler to POST this payload to your backend.
                </div>
            </Section>
        </form>
    );
}
