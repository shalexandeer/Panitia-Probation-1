const Button = ({ children, type = 'submit', className, ...props }) => {
    return (
        <button {...props} className={`${className} btn rounded-lg `}>
            {children}
        </button>
    );
};
export default Button;
