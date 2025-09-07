import clsx from 'clsx'

const InputField = ({label, type = 'text', value, required, placeholder, className, onChange}) => {
    return (
        <div className={className ? className : 'mb-3'}>
            <label className={clsx(['form-label', {required}])}>{label}</label>
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                required={required}
                onChange={onChange}
                className={'form-control'}
            />
        </div>
    )
}

export default InputField
