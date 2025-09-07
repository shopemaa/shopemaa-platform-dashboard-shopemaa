import clsx from 'clsx'
import Select from 'react-select'

const Multiselect = ({value, options, label, required, className, onChange}) => {
    return (
        <div className={className ? className : 'mb-3'}>
            {label && <div className={clsx(['form-label', {required}])}>{label}</div>}

            <Select closeMenuOnSelect={false} value={value} options={options} onChange={onChange} isMulti />
        </div>
    )
}

export default Multiselect
