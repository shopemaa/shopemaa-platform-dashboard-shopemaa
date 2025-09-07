import { nanoid } from "nanoid";

export default function Switch({ label, value, onChange }) {
  const id = nanoid();

  return (
    <div className="mb-3">
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id={id}
          value={value}
          onChange={onChange}
        />

        {label && (
          <label className="form-check-label" htmlFor={id}>
            {label}
          </label>
        )}
      </div>
    </div>
  );
}
