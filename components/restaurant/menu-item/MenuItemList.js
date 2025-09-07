import React, {useState, useMemo, useEffect} from "react";
import MenuItemForm from "./MenuItemForm";

const BRAND_COLOR = "#214a3b";

// Example data: replace with API fetch for real app
const menuItems = [
    {
        id: 1,
        name: "Margherita Pizza",
        price: 400,
        category: "Pizza",
        published: true,
        deleted: false,
        updatedAt: "2024-07-29T11:23:45Z",
        options: [
            {
                name: "Size",
                type: "radio",
                required: true,
                values: [
                    {value: "Small", price: 0},
                    {value: "Medium", price: 60},
                    {value: "Large", price: 120}
                ]
            }
        ],
        extras: [
            {name: "Chili Flakes", price: 15},
            {name: "Extra Cheese", price: 40}
        ]
    },
    {
        id: 2,
        name: "Pepperoni Pizza",
        price: 480,
        category: "Pizza",
        published: false,
        deleted: false,
        updatedAt: "2024-07-29T13:17:25Z",
        options: [],
        extras: []
    },
    {
        id: 3,
        name: "Coke",
        price: 70,
        category: "Drinks",
        published: true,
        deleted: true,
        updatedAt: "2024-07-25T14:08:10Z",
        options: [],
        extras: [{name: "Ice", price: 0}]
    }
];

const categories = ["All", ...Array.from(new Set(menuItems.map(m => m.category)))];
const PAGE_SIZE = 5;

function MenuItemList({project}) {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [page, setPage] = useState(1);

    const [addNewItem, setAddNewItem] = useState(false);

    const [items, setItems] = useState(menuItems);

    const filtered = useMemo(() => {
        return items.filter(item => {
            const matchCat = category === "All" || item.category === category;
            const matchName = item.name.toLowerCase().includes(search.toLowerCase());
            return matchCat && matchName;
        });
    }, [items, search, category]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // Toggle published
    const handleTogglePublished = id => {
        setItems(prev => prev.map(item =>
            item.id === id ? {...item, published: !item.published} : item
        ));
    };

    // Soft delete
    const handleSoftDelete = id => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        setItems(prev => prev.map(item =>
            item.id === id ? {...item, deleted: true} : item
        ));
    };

    // Restore item
    const handleRestore = id => {
        setItems(prev => prev.map(item =>
            item.id === id ? {...item, deleted: false} : item
        ));
    };

    const [viewItem, setViewItem] = useState(null);

    const renderItemDetail = (item) => (
        <MenuItemForm initial={item}/>
    );

    // Helper for icon fallback (shows emoji if Bootstrap icons missing)
    function Icon({name, label, style}) {
        // Basic fallback for some actions
        const emoji = name === "info-circle" ? "ℹ️"
            : name === "eye" ? "👁️"
                : name === "eye-slash" ? "🚫"
                    : name === "trash" ? "🗑️"
                        : name === "arrow-counterclockwise" ? "↩️"
                            : "❔";
        return (
            <span
                className={`bi bi-${name}`}
                aria-label={label}
                style={{
                    fontSize: "1.08em",
                    verticalAlign: "middle",
                    ...style
                }}
            >
        {emoji}
      </span>
        );
    }

    function OffCanvas({open, onClose, title, children}) {
        // Close on ESC key
        useEffect(() => {
            if (!open) return;

            function handleEsc(e) {
                if (e.key === "Escape") onClose();
            }

            window.addEventListener("keydown", handleEsc);
            return () => window.removeEventListener("keydown", handleEsc);
        }, [open, onClose]);

        return (
            <>
                <div
                    className={`offcanvas-backdrop${open ? " show" : ""}`}
                    onClick={onClose}
                    tabIndex={-1}
                    aria-hidden={!open}
                />
                <aside
                    className={`offcanvas-drawer${open ? " open" : ""}`}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="offcanvas-title"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="offcanvas-header" style={{background: BRAND_COLOR, color: "#fff"}}>
                        <div id="offcanvas-title" className="fw-bold">{title}</div>
                        <button
                            aria-label="Close"
                            className="offcanvas-close"
                            onClick={onClose}
                            style={{
                                border: "none", background: "transparent", color: "#fff", fontSize: "2em", marginLeft: 8
                            }}
                        >&times;</button>
                    </div>
                    <div className="offcanvas-body">{children}</div>
                </aside>
                <style jsx global>{`
                    .offcanvas-backdrop {
                        position: fixed;
                        inset: 0;
                        background: rgba(0, 0, 0, 0.13);
                        z-index: 1050;
                        opacity: 0;
                        pointer-events: none;
                        transition: opacity 0.21s;
                    }

                    .offcanvas-backdrop.show {
                        opacity: 1;
                        pointer-events: auto;
                    }

                    .offcanvas-drawer {
                        position: fixed;
                        top: 0;
                        right: 0;
                        width: 96vw;
                        max-width: 420px;
                        height: 100vh;
                        background: #fff;
                        z-index: 11000;
                        box-shadow: -2px 0 40px rgba(33, 74, 59, 0.13);
                        border-top-left-radius: 18px;
                        border-bottom-left-radius: 18px;
                        display: flex;
                        flex-direction: column;
                        transform: translateX(100%);
                        transition: transform 0.26s cubic-bezier(0.55, 0, 0.45, 1);
                    }

                    .offcanvas-drawer.open {
                        transform: translateX(0);
                    }

                    .offcanvas-header {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 1.1em 1.5em 1.1em 1.3em;
                        font-size: 1.25em;
                        border-top-left-radius: 18px;
                    }

                    .offcanvas-close {
                        cursor: pointer;
                    }

                    .offcanvas-body {
                        padding: 1.5em;
                        overflow-y: auto;
                        flex: 1;
                    }

                    @media (max-width: 600px) {
                        .offcanvas-drawer {
                            max-width: 99vw;
                            border-radius: 0;
                        }

                        .offcanvas-header {
                            font-size: 1.1em;
                            padding: 1em 1em 1em 1em;
                        }

                        .offcanvas-body {
                            padding: 1em;
                        }
                    }
                `}</style>
            </>
        );
    }

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
                            <span style={{fontWeight: 500}}>Menu</span>
                        </li>
                    </ol>
                </nav>
            </div>
            <div className="container-xl py-1" style={{fontFamily: "Segoe UI, sans-serif"}}>
                <div className="card">
                    <div className="card-header" style={{background: BRAND_COLOR, color: "#fff"}}>
                        <div className="d-flex justify-content-between align-items-center">
                            <div style={{fontWeight: 600, fontSize: 20}}>Menu Items</div>
                            &nbsp;&nbsp;
                            <button onClick={() => {
                                setAddNewItem(true)
                            }} className="btn btn-sm btn-light ps-2 pe-2" style={{color: BRAND_COLOR}}>
                                + Add Menu Item
                            </button>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="d-flex flex-wrap gap-3 mb-3">
                            <input
                                type="text"
                                className="form-control"
                                style={{maxWidth: 240, borderColor: BRAND_COLOR}}
                                placeholder="Search by name..."
                                value={search}
                                onChange={e => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                            />
                            <select
                                className="form-select"
                                style={{maxWidth: 180, borderColor: BRAND_COLOR}}
                                value={category}
                                onChange={e => {
                                    setCategory(e.target.value);
                                    setPage(1);
                                }}
                            >
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div className="table-responsive">
                            <table className="table align-middle table-hover">
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    <th>Updated</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {paged.map(item => (
                                    <tr key={item.id} style={item.deleted ? {background: "#ffefef"} : {}}>
                                        <td>
                                            <span style={{color: BRAND_COLOR, fontWeight: 500}}>{item.name}</span>
                                        </td>
                                        <td>{item.category}</td>
                                        <td>৳{item.price}</td>
                                        <td>
                                            {item.deleted
                                                ? <span className="badge bg-danger">Deleted</span>
                                                : item.published
                                                    ? <span className="badge bg-success">Published</span>
                                                    : <span className="badge bg-secondary">Unpublished</span>}
                                        </td>
                                        <td>{new Date(item.updatedAt).toLocaleDateString()}</td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-primary me-1"
                                                    title="View Details"
                                                    onClick={() => setViewItem(item)}>
                                                Edit
                                            </button>
                                            <button className="btn btn-sm btn-outline-secondary me-1"
                                                    disabled={item.deleted}
                                                    title={item.published ? "Unpublish" : "Publish"}
                                                    onClick={() => handleTogglePublished(item.id)}>
                                                {item.published
                                                    ? <Icon name="eye-slash" label="Unpublish"/>
                                                    : <Icon name="eye" label="Publish"/>
                                                }
                                            </button>
                                            {!item.deleted ? (
                                                <button className="btn btn-sm btn-outline-danger"
                                                        title="Delete"
                                                        onClick={() => handleSoftDelete(item.id)}>
                                                    <Icon name="trash" label="Delete"/>
                                                </button>
                                            ) : (
                                                <button className="btn btn-sm btn-outline-success"
                                                        title="Restore"
                                                        onClick={() => handleRestore(item.id)}>
                                                    <Icon name="arrow-counterclockwise" label="Restore"/>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {paged.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-center text-muted">
                                            No menu items found.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
                        <div className="d-flex justify-content-center align-items-center mt-3 gap-2">
                            <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >Prev
                            </button>
                            <span>
              Page <span style={{color: BRAND_COLOR}}>{page}</span> of {totalPages}
            </span>
                            <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >Next
                            </button>
                        </div>
                    </div>
                </div>

                {viewItem && (
                    <OffCanvas
                        open={!!viewItem}
                        onClose={() => setViewItem(null)}
                        title="Menu Item Details">
                        {renderItemDetail(viewItem)}
                    </OffCanvas>
                )}

                {addNewItem && (
                    <OffCanvas
                        open={addNewItem}
                        onClose={() => setAddNewItem(false)}
                        title="Menu Item Details">
                        {renderItemDetail(null)}
                    </OffCanvas>
                )}
            </div>
        </>
    );
}

export default MenuItemList;
