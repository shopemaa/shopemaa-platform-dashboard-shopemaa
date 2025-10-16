import { useState } from "react";
import SearchIcon from "../icons/SearchIcon";
import { useRouter } from "next/router";

export default function CategoryList() {
  const router = useRouter();

  const [searchKey, setSearchSet] = useState();
  const [selected, setSelected] = useState(new Set());

  function onCreate() {
    router.push("/dashboard/categories/create");
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="d-flex w-100 align-items-center gap-2">
          <div className="input-icon w-100 w-sm-auto" style={{ maxWidth: 380 }}>
            <span className="input-icon-addon">
              <SearchIcon />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search products, SKU…"
              value={searchKey}
              onChange={(e) => {
                setSearchSet(e.target.value.trim());
              }}
              aria-label="Search products"
            />
          </div>

          {selected.size > 0 ? (
            <div className="btn-list ms-auto">
              <button className="btn btn-outline-danger">Archive</button>
              <button className="btn btn-outline-secondary">
                Mark as draft
              </button>
              <button className="btn btn-outline-primary">Activate</button>
            </div>
          ) : (
            <div className="ms-auto">
              <button className="btn btn-primary" onClick={onCreate}>
                Add new category
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-vcenter card-table qrcentral-table">
          <thead className="d-md-table-header-group">
            <tr>
              <th style={{ width: 36 }}>
                <label className="form-check m-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    aria-label="Select all products"
                  />
                </label>
              </th>
              <th>Category</th>
              <th className="w-1 text-end">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td data-header="">
                <div className="form-check m-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    aria-label={`Select `}
                  />
                </div>
              </td>
              <td data-header="SKU">
                <div className="text-muted">Category 1</div>
              </td>

              <td data-header="SKU">
                <div className="text-muted">
                  <button
                    className="btn btn-sm btn-outline"
                    title="Quick view"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#productQuickView"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" />
                      <circle cx="12" cy="12" r="2" />
                      <path d="M22 12c-2.667 4 -6 6 -10 6s-7.333 -2 -10 -6c2.667 -4 6 -6 10 -6s7.333 2 10 6" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
