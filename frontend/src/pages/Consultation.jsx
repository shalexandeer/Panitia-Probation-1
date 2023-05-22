import Button from './../components/Button';

const Consultation = () => {
    return (
        <div className='grid place-items-center h-screen' id='home-landing-page'>
            <div className='flex flex-col justify-center items-center  gap-7 lg:pl-[100px] lg:pr-[100px]'>
                <h1 className='text-center leading-[3.75rem] text-6xl font-semibold'>
                    Welcome to Fundify <br /> consult your business now!
                </h1>
                <p className='text-center max-w-[1054px] font-normal text-lg text-[#6B7280] leading-7'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
                <div id='call-to-action-wrapper' className='flex items-center gap-7'>
                    <Button className={'bg-[#1496FF] text-white border-none text-xl'}>Consult now</Button>
                    <p className='font-semibold text-xl text-[#111827] leading-7'>Learn more</p>
                </div>
            </div>
        </div>
    );
};

export default Consultation;
