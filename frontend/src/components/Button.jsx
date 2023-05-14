const Button = ({ className, text, type = 'primary', children, ...props }) => {
    return (
        <button {...props} className={`btn btn-${type} ${className} btn-xs sm:btn-sm md:btn-md lg:btn-lg`}>
            {children}
        </button>
    );
};

export default Button;
