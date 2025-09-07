const FileInputField = ({label, className, onChange}) => {
    return (
        <div className={className ? className : 'mb-3'}>
            <div>{label ? label : 'Select file'}</div>
            <input type="file" onChange={onChange} />
        </div>
    )
}

export default FileInputField
