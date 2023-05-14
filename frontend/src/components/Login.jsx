const Login = ({ children }) => {
    return <PlaceContentCenter className={'h-screen bg-blue-400'}></PlaceContentCenter>;
};

const PlaceContentCenter = ({ children, className }) => {
    return <div className={`grid place-center ${className}`}>{children}</div>;
};

export default Login;
