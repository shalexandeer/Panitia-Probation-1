import { useState } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ClassUserHome from './ClassUserHome';

const Home = () => {
    const [userClass, setUserClass] = useState('all');

    return (
        <div className='flex flex-col'>
            <div className={`grid place-items-center pb-12 pl-5 pr-5 sm:pl-6 sm:pr-6 ${userClass == 'U' && 'class-user-bg'} `} id='home-landing-page'>
                <div className='container mx-auto flex flex-col-reverse gap-10 lg:gap-0 lg:pt-12 lg:grid lg:grid-cols-2'>
                    <div className='flex flex-col justify-center items-center lg:items-start gap-6 lg:gap-7 lg:pt-12 lg:pb-12'>
                        {userClass == 'all' && (
                            <>
                                <h1 className='text-center lg:text-start leading-10 md:leading-[3rem] xl:leading-[5rem] home-landing-heading font-semibold'>
                                    Welcome to <br className='hidden lg:block' /> <span className='text-primary'>Fundify</span> Consult Your <br /> <span className='text-primary'>Business</span> Now!
                                </h1>
                                <p className='lg:text-start md:text-start max-w-[1054px] hidden text-center sm:flex font-normal text-lg text-[#6B7280] leading-6 md:leading-7 home-hero-paragraph'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
                                <div id='call-to-action-wrapper' className='grid grid-cols-2 lg:flex lg:flex-row items-center gap-4 lg:gap-7 max-lg:w-full'>
                                    <Button className={'bg-[#1496FF] text-white border-none text-base  lg:text-lg max-sm:max-w-[375px] w-full lg:w-[196px]'}>Consult</Button>
                                    <Button className='btn-outline font-semibold  text-primary leading-7 lg:text-lg max-sm:max-w-[375px] w-full lg:w-[196px] text-center'>Get Investor</Button>
                                </div>
                            </>
                        )}
                        {userClass == 'U' && (
                            <>
                                <h1 className='pt-12  lg:p-0  text-center lg:text-start leading-10 md:leading-[3rem] xl:leading-[5rem] home-landing-heading font-semibold'>
                                    Find The Best <br className='hidden lg:block' /> Business Consultant <br /> In <span className='text-primary'>Fundify</span>
                                </h1>
                                <p className='lg:text-start md:text-start max-w-[1054px] text-center font-normal text-lg text-[#6B7280] leading-6 md:leading-7 home-hero-paragraph'>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                    <br /> sed do eiusmod tempor incididunt ut labore et dolore
                                </p>
                                <div id='call-to-action-wrapper' className='grid grid-cols-1 lg:flex lg:flex-row items-center gap-4 lg:gap-7  max-lg:items-center'>
                                    <Button className={'bg-[#1496FF] text-white border-none text-base  lg:text-lg max-sm:max-w-[375px] w-full lg:w-[196px] max-lg:max-w-[375px]'}>Consultation Chat</Button>
                                </div>
                            </>
                        )}
                    </div>
                    {userClass == 'all' && (
                        <div id='image-landing-user'>
                            <img src='./public/img/image-landing-alluser.svg' className='w-full h-auto' alt='' />
                        </div>
                    )}
                </div>
            </div>
            {userClass == 'all' && (
                <>
                    <div id='aboutusbg' className={`pl-5 pr-5 ${userClass == 'all' ? 'flex' : 'hidden'}`}>
                        <AboutUs text1='About us' text2='Provide various services to help grow your business your business' />
                    </div>
                    <div id='commercial-landing' className='pl-5 pr-5 sm:pl-6 sm:pr-6 '>
                        <Commercial />
                    </div>
                </>
            )}
            {userClass == 'U' && <ClassUserHome.Benefit />}
            <div id='consultant-home' className='pl-5 pr-5 sm:pl-6 sm:pr-6 '>
                <ConsultantSection text1='Our Best Consultant' text2='Consultants at Fundify are experienced and good problem solvers.' />
            </div>
            {userClass == 'U' && <ClassUserHome.ListConsultanSectionHome text1={'Find other consultant recommendations'} text2={'Fundify consultants are experts in their fields who can help grow your business.'} />}
            {userClass == 'all' && (
                <>
                    <div id='banner-get-investor' className='pl-5 pr-5 sm:pl-6 sm:pr-6 lg:h-[911px] '>
                        <BannerGetInvestor />
                    </div>{' '}
                    <div id='forum-section' className='pl-5 pr-5 sm:pl-6 sm:pr-6  '>
                        <ForumSection text1={'Community Forum'} text2={'Fundify Talk'} />
                    </div>
                </>
            )}
        </div>
    );
};

// class all user
const AboutUs = ({ text1 = 'text1', text2 = 'text2' }) => {
    return (
        <div className='container mx-auto pt-12 pb-12 flex flex-col justify-center items-center gap-12'>
            <div id='text-about-us' className='flex flex-col items-center gap-3'>
                <HeadingHome text={text1} className={'text-base text-[#1496FF] font-semibold leading-6'} />
                <HeadingHome text={text2} className={'about-us-heading max-w-[793px] text-center xl:leading-10 font-semibold'} />
            </div>
            <div id='about-us-card' className='max-w-[1296px] w-full lg:h-[273px] flex flex-col sm:grid grid-cols-2 md:flex md:flex-row justify-center gap-6 '>
                <AboutUsCard featureName='Counseling' description='Need a solution for your business? Come on, tell a story!' />
                <AboutUsCard featureName='Get Investor' description='Need capital for your business? Lets apply to investors!' />
                <AboutUsCard featureName='Forum Community' description='Struggling to find a business solution? Discuss it with the community.' />
            </div>
        </div>
    );
};

const AboutUsCard = ({ url = './public/img/counseling.svg', featureName = 'your feature name', description = 'your desc' }) => {
    return (
        <Card className={' bg-white hover:bg-primary grid place-content-center w-full shadow-xl border rounded-xl hover:text-[#ffffff_!important] duration-300 cursor-pointer sm:max-w-[416px] p-7'}>
            <Card.Body className={'flex flex-col text-center gap-2'}>
                <div className='flex flex-col gap-5 items-center'>
                    <img
                        src={url}
                        alt=''
                        className='w-[46px] h-auto
            '
                    />
                    <h1 className='text-2xl font-bold leading-[150%]'>{featureName}</h1>
                </div>
                <p className='max-w-[293px] leading-[180%] font-normal text-base '>{description}</p>
            </Card.Body>
        </Card>
    );
};

const Commercial = () => {
    return (
        <div className='container mx-auto pt-12 pb-12 flex flex-col sm:grid grid-cols-2 lg:flex lg:flex-row justify-center max-w-[1524px] gap-6 xl:pl-[72px] xl:pr-[72px] xl:gap-20'>
            <div className='w-full'>
                <img src='./public/img/commercial.svg' alt='' className='w-full h-auto ' />
            </div>
            <div className='flex flex-col gap-3 lg:gap-4 justify-center'>
                <HeadingHome text={'Start developing your business now'} className={'text-base text-[#ED1E79] font-semibold leading-6'} />
                <HeadingHome text={'Fundify is a place for your stories'} className={'commercial-heading max-w-[793px] text-start lg:leading-[120%] font-semibold'} />
                <p className='font-normal text-lg text-[#6B7280] leading-6 md:leading-7 home-hero-paragraph'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
                <div id='start-form-commercial' className='flex flex-col items-end gap-3'>
                    <h1 className='commercial-start-from font-semibold'>
                        <span className='text-primary'>Start from</span> Rp. 50.000
                    </h1>
                    <Button className={'btn-outline btn-primary'}>Consult Now</Button>
                </div>
            </div>
        </div>
    );
};
// consultant section
const ConsultantSection = ({ text1 = 'text1', text2 = 'text2' }) => {
    return (
        <div className='container mx-auto pt-12 pb-12 flex flex-col justify-center items-center gap-12'>
            <div id='text-about-us' className='flex flex-col items-center gap-3'>
                <HeadingHome text={text1} className={'text-base text-[#1496FF] font-semibold leading-6'} />
                <HeadingHome text={text2} className={'about-us-heading max-w-[793px] text-center leading-[120%] xl:leading-10 font-semibold'} />
            </div>
            <div id='about-us-card' className='max-w-[978px] w-full  flex flex-col sm:grid grid-cols-2 md:flex md:flex-row justify-center gap-6 '>
                <ConsultantCard consultantName='Mbak Mbak asia' category='Food & Beverage' />
                <ConsultantCard consultantName='Sultan Hafizh' category='Retail' />
                <ConsultantCard consultantName='Oktovivian' category='Automotive' />
            </div>
        </div>
    );
};
const ConsultantCard = ({ url = './public/img/counseling.svg', consultantName = 'consultant name', category = 'consultant category' }) => {
    return (
        <Card className={' bg-white w-full border overflow-hidden rounded-[8px_!important]  duration-300 cursor-pointer sm:max-w-[416px] h-[424px]'}>
            <Card.Body className={'flex flex-col gap-2 '}>
                <div className='flex flex-col gap-5 items-center '>
                    <div className='h-[300px] bg-slate-500 w-full'></div>
                    <div className='flex flex-col '>
                        <h1 className='text-xl font-bold leading-[150%]'>{consultantName}</h1>
                        <p className='max-w-[293px] leading-[180%] font-normal text-sm text-center '>{category}</p>
                        <div className='flex justify-center rating  items-center gap-2'>
                            <input type='radio' name='rating-1' className='mask mask-star bg-yellow-500' />
                            <p className='text-sm'>4.8</p>
                        </div>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};
// end consultant section

// get investor banner
const BannerGetInvestor = () => {
    return (
        <div className='flex justify-end items-center h-full container mx-auto pt-12 pb-12'>
            <div className='flex flex-col justify-center items-center lg:items-start gap-6 lg:gap-7 lg:pt-12 lg:pb-12'>
                <h1 className='text-center lg:text-start leading-10 md:leading-[3rem] xl:leading-[5rem] home-landing-heading font-semibold text-white'>
                    Submit Your Business <br className='hidden lg:block' /> Plan And Get Help <br className='hidden lg:block' /> From Investors!
                </h1>
                <p className='lg:text-start md:text-start max-w-[1054px]  text-center font-normal text-lg text-white leading-6 md:leading-7 home-hero-paragraph'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, <br />
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.{' '}
                </p>
                <div id='call-to-action-wrapper' className='grid grid-cols-1 place-items-center lg:flex lg:flex-row items-center gap-4 lg:gap-7 max-lg:w-full'>
                    <Button className={'bg-[#ffffff] text-primary border-none text-base  lg:text-lg max-lg:max-w-[375px] w-full lg:w-[196px]'}>Get Investor</Button>
                </div>
            </div>
        </div>
    );
};

//Forum section\
const ForumSection = ({ text1, text2 }) => {
    return (
        <div className='container mx-auto pt-12 pb-12 flex flex-col justify-center items-center gap-12'>
            <div id='text-about-us' className='flex flex-col items-center gap-3'>
                <HeadingHome text={text1} className={'text-base text-[#1496FF] font-semibold leading-6'} />
                <HeadingHome text={text2} className={'about-us-heading max-w-[793px] text-center xl:leading-10 font-semibold'} />
            </div>
            <div id='about-us-card' className='max-w-[1296px] w-full  flex flex-col sm:grid grid-cols-2 md:flex md:flex-row justify-center gap-6 '>
                <ForumSectionCard featureName='Counseling' description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus aliquam volutpat massa et eget at. Dictum ut in eget maecenas turpis pharetra nunc pellentesque. Ut integer eu at massa diam amet congue. Facilisi vivamus integer id lectus. Vel luctus.' />
                <ForumSectionCard featureName='Get Investor' description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus aliquam volutpat massa et eget at. Dictum ut in eget maecenas turpis pharetra nunc pellentesque. Ut integer eu at massa diam amet congue. Facilisi vivamus integer id lectus. Vel luctus.' />
                <ForumSectionCard featureName='Forum Community' description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus aliquam volutpat massa et eget at. Dictum ut in eget maecenas turpis pharetra nunc pellentesque. Ut integer eu at massa diam amet congue. Facilisi vivamus integer id lectus. Vel luctus.' />
            </div>
            <div>
                <Button className={'btn btn-primary'}>Join Forum</Button>
            </div>
        </div>
    );
};

const ForumSectionCard = ({ url = './public/img/counseling.svg', featureName = 'your feature name', description = 'your desc', name = 'name', category = 'category' }) => {
    return (
        <Card className={' bg-white hover:bg-primary p-5 w-full shadow-xl border rounded-xl hover:text-[#ffffff_!important] duration-300 cursor-pointer sm:max-w-[416px] '}>
            <Card.Body className={'flex flex-col gap-3'}>
                <p className=' font-normal text-sm leading-5 '>{description}</p>
                <div className='flex gap-5 '>
                    <img
                        src={url}
                        alt=''
                        className='w-[46px] h-auto rounded-full
            '
                    />
                    <div className=''>
                        <h1 className='text-xl font-bold'>{name}</h1>
                        <h1 className='text-sm text-primary'>{category}</h1>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

const HomeUserAllUserClass = () => {
    return;
};

const HeadingHome = ({ text, className }) => {
    return <h1 className={`${className}`}>{text}</h1>;
};

const CarouselMobile = () => {
    return (
        <div className='carousel w-full'>
            <div id='slide1' className='carousel-item relative '>
                <ConsultantCard featureName='Counseling' description='Need a solution for your business? Come on, tell a story!' />
                <div className='absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2'>
                    <a href='#slide4' className='btn btn-circle'>
                        ❮
                    </a>
                    <a href='#slide2' className='btn btn-circle'>
                        ❯
                    </a>
                </div>
            </div>
        </div>
    );
};

Home.ConsultantCard = ConsultantCard;
Home.HeadingHome = HeadingHome;
export default Home;
