const BaseSelect = ({label, value, required, className, options, onChange}) => {
    let innerClassName = className ? className : 'mb-3'
    if (required) {
        innerClassName += ' required'
    }

    return (
        <div>
            {label && <label className={innerClassName}>{label}</label>}

            <select className="form-select" value={value} onChange={onChange}>
                <option value={''} disabled>
                    Select
                </option>
                {options.length ? (
                    options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))
                ) : (
                    <option selected disabled>
                        No item found
                    </option>
                )}
            </select>
        </div>
    )
}

export default BaseSelect
