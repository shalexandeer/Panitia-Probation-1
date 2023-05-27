import Button from '../../components/Button';

const Home = () => {
    return (
        <div className='flex flex-col'>
            <div className='grid place-items-center h-screen pl-5 pr-5 sm:pl-6 sm:pr-6 xl:pl-[100px] xl:pr-[100px]' id='home-landing-page'>
                <div className='flex flex-col justify-center items-start gap-7 container mx-auto'>
                    <h1 className='text-start leading-10 sm:leading-[3.75rem] home-heading font-semibold'>
                        Welcome to Fundify <br className='hidden md:block' /> consult your business now!
                    </h1>
                    <p className='text-start max-w-[1054px] font-normal text-lg text-[#6B7280] leading-6 md:leading-7 home-hero-paragraph'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
                    <div id='call-to-action-wrapper' className='flex flex-col md:flex-row items-center gap-7'>
                        <Button className={'bg-[#1496FF] text-white border-none text-xl'}>Consult now</Button>
                        <p className='font-semibold text-xl text-[#111827] leading-7'>Learn more</p>
                    </div>
                </div>
            </div>
            {/* <div className='h-[200px] bg-black'></div> */}
        </div>
    );
};

export default Home;
