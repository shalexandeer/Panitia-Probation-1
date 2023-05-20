const Button = ({ children, type = 'submit', className, ...props }) => {
    return (
        <button {...props} className={`${className} p-4 rounded-lg `}>
            {children}
        </button>
    );
};
export default Button;
