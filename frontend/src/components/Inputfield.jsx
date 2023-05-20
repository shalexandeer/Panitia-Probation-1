const Inputfield = ({ text, className, ...props }) => {
    return <input {...props} className={`${className} pt-4 pb-4 pl-3 pr-3 rounded-lg border border-solid border-[#BEBEBF] `} placeholder={text} />;
};

export default Inputfield;
