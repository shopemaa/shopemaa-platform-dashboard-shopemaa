import React, {useState} from "react";

const BRAND_COLOR = "#214a3b";
const BADGE = {borderRadius: "1em", padding: "0.18em 0.7em", fontWeight: 500, fontSize: 13, verticalAlign: "middle"};

const categoryList = ["Pizza", "Drinks", "Dessert"]; // Replace with your dynamic categories!

export default function MenuItemForm({
                                         initial = null,
                                         onSubmit,
                                         onCancel,
                                     }) {
    // Form state
    const [name, setName] = useState(initial?.name || "");
    const [price, setPrice] = useState(initial?.price || "");
    const [category, setCategory] = useState(initial?.category || "");
    const [published, setPublished] = useState(initial?.published ?? true);
    const [deleted, setDeleted] = useState(initial?.deleted ?? false);

    const [options, setOptions] = useState(initial?.options?.map(opt => ({
        ...opt,
        values: [...(opt.values || [])]
    })) || []);
    const [extras, setExtras] = useState(initial?.extras?.map(e => ({...e})) || []);

    const [editingOption, setEditingOption] = useState(null);
    const [editingExtra, setEditingExtra] = useState(null);
    const [error, setError] = useState("");

    // Validation & Submit
    const handleSubmit = e => {
        e.preventDefault();
        setError("");
        if (!name.trim()) return setError("Name is required");
        if (!price || isNaN(price) || Number(price) < 0) return setError("Valid price required");
        if (!category) return setError("Category required");
        onSubmit({
            id: initial?.id,
            name: name.trim(),
            price: Number(price),
            category,
            published,
            deleted,
            options,
            extras,
        });
    };

    // --- Option groups modal ---
    function OptionEditModal() {
        const [optName, setOptName] = useState(editingOption?.name || "");
        const [type, setType] = useState(editingOption?.type || "radio");
        const [required, setRequired] = useState(editingOption?.required || false);
        const [max, setMax] = useState(editingOption?.max || "");
        const [values, setValues] = useState(editingOption?.values || []);
        const [newValue, setNewValue] = useState("");
        const [newValuePrice, setNewValuePrice] = useState("");

        const onSave = () => {
            if (!optName.trim()) return;
            if (type === "multi" && max && (isNaN(max) || max < 1)) return;
            if (values.length === 0) return;
            const newOpt = {
                name: optName.trim(),
                type,
                required,
                max: type === "multi" ? Number(max) || values.length : undefined,
                values,
            };
            if (editingOption.idx !== undefined) {
                setOptions(prev => prev.map((o, i) => i === editingOption.idx ? newOpt : o));
            } else {
                setOptions(prev => [...prev, newOpt]);
            }
            setEditingOption(null);
        };

        return (
            <div className="modal show fade" style={{
                display: "block", background: "rgba(33,74,59,0.14)", zIndex: 9999
            }}>
                <div className="modal-dialog modal-md" style={{marginTop: "8vh"}}>
                    <div className="modal-content"
                         style={{borderRadius: 20, boxShadow: "0 3px 32px rgba(33,74,59,0.18)"}}>
                        <div className="modal-header" style={{
                            background: BRAND_COLOR,
                            color: "#fff",
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20
                        }}>
                            <div>{editingOption.idx !== undefined ? "Edit Option Group" : "Add Option Group"}</div>
                            <button type="button" className="btn-close" aria-label="Close"
                                    onClick={() => setEditingOption(null)}></button>
                        </div>
                        <div className="modal-body">
                            <div className="row g-3">
                                <div className="col-md-7">
                                    <label className="form-label">Option Group Name</label>
                                    <input className="form-control" value={optName}
                                           onChange={e => setOptName(e.target.value)}/>
                                </div>
                                <div className="col-md-5">
                                    <label className="form-label">Type</label>
                                    <select className="form-select" value={type}
                                            onChange={e => setType(e.target.value)}>
                                        <option value="radio">Single Select</option>
                                        <option value="multi">Multi-Select</option>
                                    </select>
                                </div>
                                {type === "multi" &&
                                    <div className="col-md-6">
                                        <label className="form-label">Max Selections</label>
                                        <input className="form-control" type="number" min={1} placeholder="Max"
                                               value={max} onChange={e => setMax(e.target.value)}/>
                                    </div>
                                }
                                <div className="col-md-6 d-flex align-items-center">
                                    <label className="form-label mb-0 me-2">Required</label>
                                    <input type="checkbox" className="form-check-input" checked={required}
                                           onChange={e => setRequired(e.target.checked)}/>
                                </div>
                            </div>
                            <div className="my-3 border-top pt-2">
                                <label className="form-label">Option Values</label>
                                <div className="input-group mb-2" style={{maxWidth: 480}}>
                                    <input className="form-control" placeholder="Value name" value={newValue}
                                           onChange={e => setNewValue(e.target.value)}/>
                                    <input className="form-control" type="number" min={0} placeholder="Extra price"
                                           value={newValuePrice} onChange={e => setNewValuePrice(e.target.value)}/>
                                    <button className="btn btn-outline-primary"
                                            disabled={!newValue.trim()}
                                            onClick={() => {
                                                setValues(vs => [...vs, {
                                                    value: newValue.trim(),
                                                    price: Number(newValuePrice) || 0
                                                }]);
                                                setNewValue("");
                                                setNewValuePrice("");
                                            }}>Add
                                    </button>
                                </div>
                                <div>
                                    {values.length === 0 && <div className="text-muted">No values added.</div>}
                                    <ul className="list-unstyled mb-0">
                                        {values.map((v, i) =>
                                            <li key={i} className="mb-1">
                                                <span className="badge bg-light text-dark me-1"
                                                      style={{...BADGE, border: "1px solid #ddd"}}>{v.value}</span>
                                                {v.price > 0 && <span className="badge bg-info text-dark ms-1"
                                                                      style={BADGE}>+৳{v.price}</span>}
                                                <button className="btn btn-link btn-sm text-danger ms-1 p-0"
                                                        onClick={() => setValues(vals => vals.filter((_, idx) => idx !== i))}>&times;</button>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer d-flex justify-content-between">
                            <button className="btn btn-light" onClick={() => setEditingOption(null)}>Cancel</button>
                            <button className="btn btn-success px-4" onClick={onSave}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- Extras modal ---
    function ExtraEditModal() {
        const [exName, setExName] = useState(editingExtra?.name || "");
        const [exPrice, setExPrice] = useState(editingExtra?.price || "");
        const onSave = () => {
            if (!exName.trim()) return;
            const newExtra = {name: exName.trim(), price: Number(exPrice) || 0};
            if (editingExtra.idx !== undefined) {
                setExtras(prev => prev.map((e, i) => i === editingExtra.idx ? newExtra : e));
            } else {
                setExtras(prev => [...prev, newExtra]);
            }
            setEditingExtra(null);
        };
        return (
            <div className="modal show fade"
                 style={{display: "block", background: "rgba(33,74,59,0.14)", zIndex: 9999}}>
                <div className="modal-dialog" style={{marginTop: "16vh"}}>
                    <div className="modal-content" style={{borderRadius: 16}}>
                        <div className="modal-header" style={{
                            background: BRAND_COLOR,
                            color: "#fff",
                            borderTopLeftRadius: 16,
                            borderTopRightRadius: 16
                        }}>
                            <div>{editingExtra.idx !== undefined ? "Edit Extra" : "Add Extra"}</div>
                            <button type="button" className="btn-close" aria-label="Close"
                                    onClick={() => setEditingExtra(null)}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-2">
                                <label className="form-label">Extra Name</label>
                                <input className="form-control" value={exName}
                                       onChange={e => setExName(e.target.value)}/>
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Extra Price</label>
                                <input className="form-control" type="number" min={0} value={exPrice}
                                       onChange={e => setExPrice(e.target.value)}/>
                            </div>
                        </div>
                        <div className="modal-footer d-flex justify-content-between">
                            <button className="btn btn-light" onClick={() => setEditingExtra(null)}>Cancel</button>
                            <button className="btn btn-success px-4" onClick={onSave}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- Main Form ---
    return (
        <form className="card shadow" style={{
            maxWidth: 700, margin: "0 auto", borderRadius: 22,
            boxShadow: "0 4px 32px rgba(33,74,59,0.13)"
        }} onSubmit={handleSubmit}>
            <div className="card-body px-4 py-3">
                {error && <div className="alert alert-danger py-2">{error}</div>}
                <div className="row g-3">
                    <div className="col-md-8">
                        <label className="form-label">Menu Item Name</label>
                        <input className="form-control" value={name} onChange={e => setName(e.target.value)} required/>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Price (৳)</label>
                        <input className="form-control" type="number" min={0} value={price}
                               onChange={e => setPrice(e.target.value)} required/>
                    </div>
                    <div className="col-md-7">
                        <label className="form-label">Category</label>
                        <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}
                                required>
                            <option value="">Select...</option>
                            {categoryList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div className="col-md-5 d-flex align-items-center gap-4 mt-2">
                        <div>
                            <input type="checkbox" className="form-check-input me-2" checked={published}
                                   onChange={e => setPublished(e.target.checked)} id="chk-pub"/>
                            <label className="form-check-label" htmlFor="chk-pub">Published</label>
                        </div>
                        <div>
                            <input type="checkbox" className="form-check-input me-2" checked={deleted}
                                   onChange={e => setDeleted(e.target.checked)} id="chk-del"/>
                            <label className="form-check-label" htmlFor="chk-del">Deleted</label>
                        </div>
                    </div>
                </div>
                {/* --- Option Groups --- */}
                <div className="border-top mt-4 pt-3">
                    <div className="d-flex align-items-center mb-2">
                        <span className="fs-5 fw-semibold" style={{color: BRAND_COLOR}}>Option Groups</span>
                        <button type="button" className="btn btn-sm btn-outline-primary ms-2"
                                onClick={() => setEditingOption({})}>+ Add Option Group
                        </button>
                    </div>
                    <ul className="list-unstyled ms-2">
                        {options.map((opt, idx) => (
                            <li key={idx} className="mb-2 p-2 rounded"
                                style={{background: "#f6f8f7", border: "1px solid #ececec"}}>
                                <span className="fw-bold">{opt.name}</span>{" "}
                                <span className={`badge bg-${opt.type === "multi" ? "info" : "primary"} text-dark`}
                                      style={BADGE}>{opt.type === "multi" ? "Multi" : "Single"}</span>
                                {opt.required && <span className="badge bg-danger ms-2" style={BADGE}>required</span>}
                                {opt.type === "multi" && <span className="badge bg-warning ms-2 text-dark"
                                                               style={BADGE}>max {opt.max}</span>}
                                <ul className="list-inline mt-2 mb-0">
                                    {opt.values.map((v, i) =>
                                            <li key={i} className="list-inline-item">
                      <span className="badge bg-light text-dark" style={{...BADGE, border: "1px solid #eee"}}>
                        {v.value} {v.price > 0 && <span className="text-info">+৳{v.price}</span>}
                      </span>
                                            </li>
                                    )}
                                </ul>
                                <div className="mt-1">
                                    <button type="button" className="btn btn-link btn-sm text-primary"
                                            onClick={() => setEditingOption({...opt, idx})}>Edit
                                    </button>
                                    <button type="button" className="btn btn-link btn-sm text-danger ms-1"
                                            onClick={() => setOptions(ops => ops.filter((_, i) => i !== idx))}>Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* --- Extras --- */}
                <div className="border-top mt-4 pt-3">
                    <div className="d-flex align-items-center mb-2">
                        <span className="fs-5 fw-semibold" style={{color: BRAND_COLOR}}>Extras</span>
                        <button type="button" className="btn btn-sm btn-outline-primary ms-2"
                                onClick={() => setEditingExtra({})}>+ Add Extra
                        </button>
                    </div>
                    <ul className="list-unstyled ms-2">
                        {extras.map((ex, idx) => (
                            <li key={idx} className="mb-1 d-flex align-items-center">
                                <span className="badge bg-light text-dark me-2"
                                      style={{...BADGE, border: "1px solid #eee"}}>{ex.name}</span>
                                {ex.price > 0 &&
                                    <span className="badge bg-info text-dark" style={BADGE}>+৳{ex.price}</span>}
                                <button type="button" className="btn btn-link btn-sm text-primary ms-2"
                                        onClick={() => setEditingExtra({...ex, idx})}>Edit
                                </button>
                                <button type="button" className="btn btn-link btn-sm text-danger ms-1"
                                        onClick={() => setExtras(exs => exs.filter((_, i) => i !== idx))}>Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="card-footer d-flex gap-3 justify-content-end"
                 style={{borderBottomLeftRadius: 22, borderBottomRightRadius: 22}}>
                <button className="btn btn-danger px-4" type="button" onClick={onCancel}>Delete</button>
                <button className="btn btn-success px-4" type="submit">{initial ? "Update" : "Create"} Menu Item
                </button>
            </div>

            {/* Option/Extra modals */}
            {editingOption && <OptionEditModal/>}
            {editingExtra && <ExtraEditModal/>}
        </form>
    );
}
