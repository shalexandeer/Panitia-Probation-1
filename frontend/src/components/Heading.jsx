const Heading = ({ children }) => {
    return <div>{children}</div>;
};

const MainHeading = ({ text }) => {
    return <h1 className='main-heading'>{text}</h1>;
};

const SecondHeading = ({ text }) => {
    return <h1 className='secondary-heading'>{text}</h1>;
};

Heading.MainHeading = MainHeading;
Heading.SecondHeading = SecondHeading;

export default Heading;
