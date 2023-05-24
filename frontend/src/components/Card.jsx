import Heading from './Heading';

const Card = ({ children, className }) => {
    return <div className={`${className == undefined ? '' : className} bg-white w-full  `}>{children}</div>;
};

const Title = ({ text = 'Create an account' }) => {
    return <h1 className='text-3xl font-semibold'>{text}</h1>;
};

const Body = ({ children, className }) => {
    return <div className={`${className}`}>{children}</div>;
};

Card.Title = Title;
Card.Body = Body;

export default Card;
