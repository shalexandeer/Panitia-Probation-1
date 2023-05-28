const Footer = () => {
    return (
        <div className='h-[540px] grid place-items-center pt-[168px] gap-[116px] pb-[168px]'>
            <div className='flex flex-col gap-4 justify-center items-center'>
                <img src='./public/img/logo-with-text.svg' alt='' className='max-w-[190px]' />
                <h1 className='lg:text-xl leading-[150%] font-normal'>© 2023 Fundify Inc. All rights reserved.</h1>
            </div>
            <div>
                <h1>Privacy Policy | Changelog</h1>
            </div>
        </div>
    );
};

export default Footer;
