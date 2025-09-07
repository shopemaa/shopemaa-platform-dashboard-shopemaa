const Switch = ({label, value, className, onChange}) => {
    return (
        <div className={className ? className : 'mb-3'}>
            <label className="form-check form-switch">
                <input className="form-check-input" type="checkbox" value={value} onChange={onChange} />
                {label && <span className="form-check-label">{label}</span>}
            </label>
        </div>
    )
}

export default Switch
