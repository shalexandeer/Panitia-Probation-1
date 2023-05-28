import Button from '../../components/Button';

const ClassInvestorHome = () => {};

//landing page text for investor user c.ass
const InvestorLanding = () => {
    return (
        <>
            <h1 className='text-center lg:text-start leading-10 md:leading-[3rem] xl:leading-[5rem] home-landing-heading font-semibold'>
                Invest Your <span className='text-primary'>Funds</span> In
                <br className='hidden lg:block' />
                Our Partners And <br />
                Get <span className='text-primary'>Profit</span>
            </h1>
            <p className='lg:text-start md:text-start max-w-[1054px] hidden text-center sm:flex font-normal text-lg text-[#6B7280] leading-6 md:leading-7 home-hero-paragraph'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
            <div id='call-to-action-wrapper' className='grid grid-cols-1 lg:flex lg:flex-row items-center gap-4 lg:gap-7 max-lg:w-full place-items-center'>
                <Button className={'bg-[#1496FF] text-white border-none text-base  lg:text-lg max-sm:max-w-[375px] w-full lg:w-[196px]'}>Consult UMKM</Button>
            </div>
        </>
    );
};

ClassInvestorHome.InvestorLanding = InvestorLanding;

export default ClassInvestorHome;
