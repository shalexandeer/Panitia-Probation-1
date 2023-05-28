const Loading = ({ className }) => {
    return (
        <span className={`lds-ring ${className}`}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </span>
    );
};

export default Loading;
