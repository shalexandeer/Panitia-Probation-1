const Select = ({ children, ...props }) => {
    return (
        <select {...props} className='pt-4 pb-4 pl-3 pr-3 rounded-lg border border-solid border-[#BEBEBF] '>
            {' '}
            {children}
        </select>
    );
};

export default Select;
