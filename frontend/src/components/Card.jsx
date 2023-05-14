const Card = ({ children, className }) => {
    return <div className={`card rounded-[26px]  bg-white ${className}`}>{children}</div>;
};
const Body = ({ children, className }) => {
    return <div className={` ${className} flex flex-col justify-between`}>{children}</div>;
};

const Top = ({ text, number, className }) => {
    return (
        <div className={`card-content ${className}`}>
            <div className='flex justify-between'>
                <div className='flex flex-col'>
                    <h1 className={'card-title-dashboard'}>{text}</h1>
                    <h1 className={'text-[32px] font-[700] card-title-number'}>{number}</h1>
                </div>
                <div className='flex justify-center items-center'>
                    <div className='icon-add w-[32px] h-[32px] flex justify-center'>
                        <img src='./src/assets/sum-icons.svg' alt='' />
                    </div>
                </div>
            </div>
        </div>
    );
};

Card.Body = Body;
Card.Top = Top;

export default Card;
