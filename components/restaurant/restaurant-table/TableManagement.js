import {useState} from "react";
import {IconPlus, IconEdit, IconTrash, IconQrcode} from "@tabler/icons-react";
import {OffCanvas} from "../../OffCanvas";

const initialTables = [
    {id: 1, name: "Table 1", seats: 4, location: "Indoor"},
    {id: 2, name: "Table 2", seats: 2, location: "Outdoor"},
    {id: 3, name: "VIP Booth", seats: 6, location: "Lounge"},
];

export default function TableManagement() {
    const [tables, setTables] = useState(initialTables);
    const [editing, setEditing] = useState(null); // {id, name, seats, location}
    const [offcanvasOpen, setOffcanvasOpen] = useState(false);
    const [form, setForm] = useState({name: "", seats: 2, location: ""});

    function openOffcanvas(table) {
        if (table) setForm(table);
        else setForm({name: "", seats: 2, location: ""});
        setEditing(table || null);
        setOffcanvasOpen(true);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (editing) {
            setTables(tables.map(t => (t.id === editing.id ? {...editing, ...form} : t)));
        } else {
            const nextId = Math.max(0, ...tables.map(t => t.id)) + 1;
            setTables([...tables, {...form, id: nextId}]);
        }
        setOffcanvasOpen(false);
        setEditing(null);
    }

    function handleDelete(id) {
        if (window.confirm("Delete this table?")) {
            setTables(tables.filter(t => t.id !== id));
        }
    }

    return (
        <div className="container-xl py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fw-bold" style={{color: "#214a3b"}}>Manage Tables</h1>
                <button className="btn btn-success d-flex align-items-center gap-1"
                        style={{borderRadius: 22, background: "#214a3b", fontWeight: 600}}
                        onClick={() => openOffcanvas(null)}>
                    <IconPlus size={18}/> Add Table
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-hover align-middle rounded shadow-sm bg-white">
                    <thead style={{background: "#eaf6f1"}}>
                    <tr>
                        <th>Name</th>
                        <th>Seats</th>
                        <th>Location</th>
                        <th style={{width: 120}}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tables.map(table => (
                        <tr key={table.id}>
                            <td>{table.name}</td>
                            <td>{table.seats}</td>
                            <td>{table.location}</td>
                            <td>
                                <button
                                    className="btn btn-link text-success p-1"
                                    onClick={() => openOffcanvas(table)}
                                    aria-label="Edit"
                                ><IconEdit size={19}/></button>
                                <button
                                    className="btn btn-link text-danger p-1"
                                    // onClick={() => handleDelete(table.id)}
                                    aria-label="Generate QR"
                                ><IconQrcode size={19}/></button>
                                <button
                                    className="btn btn-link text-danger p-1"
                                    onClick={() => handleDelete(table.id)}
                                    aria-label="Delete"
                                ><IconTrash size={19}/></button>
                            </td>
                        </tr>
                    ))}
                    {tables.length === 0 && (
                        <tr>
                            <td colSpan={4} className="text-center text-muted">No tables added yet.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Offcanvas for add/edit */}
            <OffCanvas
                open={offcanvasOpen}
                onClose={() => setOffcanvasOpen(false)}
                title={editing ? "Edit Table" : "Add Table"}>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Table Name</label>
                        <input
                            className="form-control"
                            required
                            value={form.name}
                            onChange={e => setForm(f => ({...f, name: e.target.value}))}
                            placeholder="e.g. Table 5"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Number of Seats</label>
                        <input
                            type="number"
                            min={1}
                            className="form-control"
                            required
                            value={form.seats}
                            onChange={e => setForm(f => ({...f, seats: Number(e.target.value)}))}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Location/Area</label>
                        <input
                            className="form-control"
                            value={form.location}
                            onChange={e => setForm(f => ({...f, location: e.target.value}))}
                            placeholder="e.g. Patio, Indoor, Rooftop"
                        />
                    </div>
                    <div className="d-flex gap-2 mt-4">
                        <button
                            type="submit"
                            className="btn btn-success fw-semibold px-4"
                            style={{borderRadius: 22, background: "#214a3b"}}
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-secondary px-4"
                            style={{borderRadius: 22}}
                            onClick={() => setOffcanvasOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </OffCanvas>
        </div>
    );
}
