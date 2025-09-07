import clsx from "clsx";

export default function InputField({
  type = "text",
  label,
  value,
  onChange,
  placeholder,
  error,
  name,
  disabled = false,
  required = false,
  containerClassName = "mb-3",
  labelClassName = "form-label h3",
  inputClassName = "form-control form-control-color w-100",
  errorClassName = "text-danger text-xs italic mt-1",
}) {
  return (
    <div className={containerClassName}>
      {label && (
        <label className={clsx([labelClassName, { required: required }])}>
          {label}
        </label>
      )}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        name={name}
        className={inputClassName}
      />
      {error && <p className={errorClassName}>{error}</p>}
    </div>
  );
}
