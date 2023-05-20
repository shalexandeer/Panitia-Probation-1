import Heading from './Heading';

const Card = ({ children, className }) => {
    return <div className={`${className == undefined ? '' : className} bg-white w-full sm:w-[531px] max-h-[876px] rounded-[32px] p-9 sm:p-16`}>{children}</div>;
};

const Title = ({ text = 'Create an account' }) => {
    return <h1 className='text-3xl font-semibold'>{text}</h1>;
};

const Body = ({ children }) => {
    return <div>{children}</div>;
};

Card.Title = Title;
Card.Body = Body;

export default Card;
