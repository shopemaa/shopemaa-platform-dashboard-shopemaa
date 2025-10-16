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
    </div>
  );
}
