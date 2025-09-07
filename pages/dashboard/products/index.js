// pages/products/index.jsx
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import ProductsList from "../../../components/products/ProductsList";

/**
 * Updated mock:
 * - Bundle example: "Gaming Console Bundle" with bundle-item attributes
 * - Simple example: "Ceramic Coffee Mug"
 * Includes loadProductDetails() so the offcanvas quick view shows variants/attributes/stock.
 */

// ----------------------------- Domain-shaped MOCK ---------------------------------
function loadProductsMockDomain() {
    const now = Date.now();

    // Attribute groups / values
    const COLOR = {id: "ag_color", code: "COLOUR", name: "Colour", dataType: "COLOR"};
    const SIZE = {id: "ag_size", code: "SIZE", name: "Size", dataType: "STRING"};
    const BUNDLE_ITEM = {id: "ag_bundle_item", code: "BUNDLE_ITEM", name: "Included", dataType: "STRING"};

    const V_BLACK = {id: "av_black", attributeGroup: COLOR, value: "Black"};
    const V_WHITE = {id: "av_white", attributeGroup: COLOR, value: "White"};
    const V_8 = {id: "av_8", attributeGroup: SIZE, value: "8"};
    const V_9 = {id: "av_9", attributeGroup: SIZE, value: "9"};

    // Bundle item attribute values
    const BI_CONSOLE = {id: "bi_console", attributeGroup: BUNDLE_ITEM, value: "Next-gen Console"};
    const BI_CTRL = {id: "bi_controller", attributeGroup: BUNDLE_ITEM, value: "Extra Wireless Controller"};
    const BI_GAME_1 = {id: "bi_game1", attributeGroup: BUNDLE_ITEM, value: "Star Quest (Game)"};
    const BI_GAME_2 = {id: "bi_game2", attributeGroup: BUNDLE_ITEM, value: "Racer X (Game)"};

    // Helpers
    const mkVariant = (id, sku, basePrice, enabled = true, attributeValues = []) => ({
        id, sku, basePrice, enabled,
        // mirror VariantAttribute shape minimally
        attributes: attributeValues.map(v => ({value: v})),
    });

    const mkStockUnit = (id, variant, quantity, dims = []) => ({
        id, variant, quantity,
        dimensions: dims.map(v => ({value: v})), // mirror StockUnitAttribute minimally
    });

    // VARIANT_PARENT: Sneakers
    const p1 = {
        id: "prd_sneaker_pro",
        name: "Sneakers Pro",
        slug: "sneakers-pro",
        description: "Performance sneakers with breathable mesh and cushioned sole.",
        productType: "VARIANT_PARENT",
        variants: []
    };
    const p1v1 = mkVariant("var_snp_bl8", "SNK-PRO-BLK-8", 9999, true, [V_BLACK, V_8]);
    const p1v2 = mkVariant("var_snp_bl9", "SNK-PRO-BLK-9", 9999, true, [V_BLACK, V_9]);
    const p1v3 = mkVariant("var_snp_wh8", "SNK-PRO-WHT-8", 9999, true, [V_WHITE, V_8]);
    p1.variants = [p1v1, p1v2, p1v3];
    const stock_p1 = [
        mkStockUnit("su_bl8_a", p1v1, 12, [V_BLACK, V_8]),
        mkStockUnit("su_bl9_a", p1v2, 0, [V_BLACK, V_9]),
        mkStockUnit("su_wh8_a", p1v3, 4, [V_WHITE, V_8]),
    ];

    // SIMPLE: Ceramic Coffee Mug
    const p2 = {
        id: "prd_coffee_mug",
        name: "Ceramic Coffee Mug",
        slug: "ceramic-coffee-mug",
        description: "Durable ceramic mug, dishwasher safe, 350ml.",
        productType: "SIMPLE",
        variants: []
    };
    const p2v1 = mkVariant("var_mug_std", "MUG-CRM-WHT", 1299, true, []);
    p2.variants = [p2v1];
    const stock_p2 = [mkStockUnit("su_mug_a", p2v1, 25, [])];

    // VARIANT_PARENT: Classic Tee
    const p3 = {
        id: "prd_classic_tee",
        name: "Classic Tee",
        slug: "classic-tee",
        description: "100% cotton crew neck t-shirt.",
        productType: "VARIANT_PARENT",
        variants: []
    };
    const p3vS = mkVariant("var_tee_s", "TEE-CLSC-BLK-S", 1999, true, [V_BLACK]);
    const p3vM = mkVariant("var_tee_m", "TEE-CLSC-BLK-M", 1999, true, [V_BLACK]);
    p3.variants = [p3vS, p3vM];
    const stock_p3 = [
        mkStockUnit("su_tee_s", p3vS, 24, []),
        mkStockUnit("su_tee_m", p3vM, 9, []),
    ];

    // BUNDLE: Gaming Console Bundle (attributes list components of the bundle)
    const p4 = {
        id: "prd_console_bundle",
        name: "Gaming Console Bundle",
        slug: "gaming-console-bundle",
        description: "Includes console, extra controller, and 2 top-selling games.",
        productType: "BUNDLE",
        variants: []
    };
    // Bundle expressed as a single variant with BUNDLE_ITEM attributes so offcanvas shows them
    const p4v1 = mkVariant(
        "var_console_bundle",
        "CONS-BNDL-2025",
        49999,
        true,
        [BI_CONSOLE, BI_CTRL, BI_GAME_1, BI_GAME_2]
    );
    p4.variants = [p4v1];
    const stock_p4 = [mkStockUnit("su_console_a", p4v1, 7, [])];

    // SIMPLE disabled/archived-like
    const p5 = {
        id: "prd_wool_scarf",
        name: "Wool Scarf",
        slug: "wool-scarf",
        description: "Soft merino scarf for winter.",
        productType: "SIMPLE",
        variants: []
    };
    const p5v1 = mkVariant("var_scarf_std", "SCF-WOOL-GRY", 3499, false, []);
    p5.variants = [p5v1];
    const stock_p5 = [mkStockUnit("su_scarf_a", p5v1, 12, [])];

    return Promise.resolve([
        {product: p1, stock: stock_p1, updatedAt: new Date(now - 72 * 3600 * 1000).toISOString()},
        {product: p2, stock: stock_p2, updatedAt: new Date(now - 26 * 3600 * 1000).toISOString()},
        {product: p3, stock: stock_p3, updatedAt: new Date(now - 2 * 3600 * 1000).toISOString()},
        {product: p4, stock: stock_p4, updatedAt: new Date(now - 1 * 3600 * 1000).toISOString()},
        {product: p5, stock: stock_p5, updatedAt: new Date(now - 240 * 3600 * 1000).toISOString()},
    ]);
}

// ----------------------------- Transformers ---------------------------------
function transformProductsToListRows(domainRows) {
    const currency = "USD";
    const placeholder = (seed) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/120/120`;

    return domainRows.map(({product, stock, updatedAt}) => {
        const enabledVariants = product.variants.filter(v => v.enabled);
        const primaryVariant = enabledVariants[0] || product.variants[0] || null;

        const enabledVariantIds = new Set(enabledVariants.map(v => v.id));
        const inventory = (stock || []).reduce((sum, su) => {
            if (su?.variant?.id && enabledVariantIds.has(su.variant.id)) return sum + (su.quantity || 0);
            return sum;
        }, 0);

        let status = "active";
        if (enabledVariants.length === 0) status = "archived";
        else if (inventory <= 0) status = "out_of_stock";
        else if (inventory < 5) status = "low_stock";

        return {
            id: product.id,
            title: product.name,
            sku: primaryVariant ? primaryVariant.sku : "—",
            price: primaryVariant ? primaryVariant.basePrice : 0,
            currency,
            thumbnail: placeholder(product.slug),
            status,
            inventory,
            variantsCount: product.variants.length || 1,
            productType: product.productType,
            updatedAt,
        };
    });
}

// Transform one domain entry to rich details for quick view
function transformDomainToDetails(entry) {
    if (!entry) return null;
    const {product, stock} = entry;

    // Build stock map by variantId
    const stockByVariant = new Map();
    (stock || []).forEach((su) => {
        const vid = su?.variant?.id;
        if (!vid) return;
        if (!stockByVariant.has(vid)) stockByVariant.set(vid, []);
        stockByVariant.get(vid).push(su);
    });

    const toGroup = (g) => g ? ({id: g.id, code: g.code, name: g.name, dataType: g.dataType}) : null;
    const toValue = (v) => v ? ({id: v.id, value: v.value, priceDelta: v.priceDelta || 0}) : null;

    const variants = (product.variants || []).map((v) => ({
        id: v.id,
        sku: v.sku,
        basePrice: v.basePrice,
        enabled: !!v.enabled,
        attributes: (v.attributes || []).map(va => ({
            group: toGroup(va.value?.attributeGroup),
            value: toValue(va.value),
        })),
        stockUnits: (stockByVariant.get(v.id) || []).map((su) => ({
            id: su.id,
            quantity: su.quantity,
            dimensions: (su.dimensions || []).map((d) => ({
                group: toGroup(d.value?.attributeGroup),
                value: {id: d.value?.id, value: d.value?.value},
            })),
        })),
    }));

    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        productType: product.productType,
        variants,
    };
}

// ----------------------------- Page Component ---------------------------------
export default function Index() {
    const router = useRouter();
    const [domainRows, setDomainRows] = useState([]);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let alive = true;
        loadProductsMockDomain()
            .then((domain) => {
                if (!alive) return;
                setDomainRows(domain);
                setRows(transformProductsToListRows(domain));
            })
            .finally(() => alive && setLoading(false));
        return () => {
            alive = false;
        };
    }, []);

    // Provide rich details for offcanvas (shows bundle items via attributes under group "Included")
    const loadProductDetails = async (id) => {
        const entry = domainRows.find((d) => d.product.id === id);
        return transformDomainToDetails(entry);
    };

    const onRowClick = (product) => router.push(`/products/${product.id}`);
    const onCreate = () => router.push("/dashboard/products/create");
    const onEdit = (product) => router.push(`/dashboard/products/${product.id}/edit`);
    const onDelete = async (productId) => {
        setRows((prev) => prev.filter((r) => r.id !== productId));
        setDomainRows((prev) => prev.filter((e) => e.product.id !== productId));
    };
    const onDuplicate = async (productId) => {
        const src = rows.find((r) => r.id === productId);
        if (!src) return;
        const clone = {...src, id: `${src.id}_copy`, title: `${src.title} (Copy)`, sku: `${src.sku}-COPY`};
        setRows((prev) => [clone, ...prev]);

        const srcDomain = domainRows.find((e) => e.product.id === productId);
        if (srcDomain) {
            const cloned = JSON.parse(JSON.stringify(srcDomain));
            cloned.product.id = clone.id;
            cloned.product.slug = `${cloned.product.slug}-copy`;
            cloned.product.name = clone.title;
            setDomainRows((prev) => [cloned, ...prev]);
        }
    };

    if (loading) {
        return (
            <div className="container-xl py-5">
                <div className="card">
                    <div className="card-body d-flex align-items-center justify-content-center"
                         style={{minHeight: 240}}>
                        <div className="text-muted">Loading products…</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-xl py-4">
            <ProductsList
                rows={rows}
                onRowClick={onRowClick}
                onCreate={onCreate}
                onEdit={onEdit}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                loadProductDetails={loadProductDetails}
            />
        </div>
    );
}
