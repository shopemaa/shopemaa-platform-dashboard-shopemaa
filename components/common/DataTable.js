import clsx from "clsx";

export default function DataTable({ columns, data }) {
  return (
    <div className="table-responsive qrcentral-table">
      <table className="table card-table table-vcenter text-nowrap datatable">
        <thead className="d-none d-md-table-header-group">
          <tr>
            <th className="w-1">
              <input
                className="form-check-input m-0 align-middle"
                type="checkbox"
                aria-label="Select all invoices"
              />
            </th>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data &&
            data.length > 0 &&
            data.map((item) => (
              <tr key={item.id}>
                <td>
                  <input
                    className="form-check-input m-0 align-middle"
                    type="checkbox"
                    aria-label="Select project"
                  />
                </td>
                <td data-header={column.label} className={column.tdClass || ""}>
                  <div
                    className={clsx([
                      "d-flex align-items-center",
                      column.tdInnerClass,
                    ])}
                  >
                    {item.type === "link" ? (
                      <Link {...item.linkAttr}>{item.name}</Link>
                    ) : (
                      item.name
                    )}
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
