import { useState } from 'react';
import Home from './Home';
import Button from '../../components/Button';
import Card from '../../components/Card';

const ClassUserHome = () => {
    return;
};

const Benefit = () => {
    return (
        <div className='bg-white pb-12 lg:pb-0 lg:h-[217px] container mx-auto grid place-content-center pl-5 pr-5'>
            <div className='grid grid-cols-2 lg:flex gap-3 lg:gap-8'>
                <div className='flex items-center gap-3'>
                    <img src='./public/img/checklist-icon.svg' className='max-w-[30px] h-auto' alt='' />
                    <h1 className='font-medium text-feature-class-user-bg text-2xl leading-8'>
                        1000+ <span className='text-primary'>Consultants</span>
                    </h1>
                </div>
                <div className='flex items-center gap-3'>
                    <img src='./public/img/checklist-icon.svg' className='max-w-[30px] h-auto' alt='' />
                    <h1 className='font-medium text-feature-class-user-bg text-2xl leading-8'>
                        Easy-to-<span className='text-primary'>Learn</span>
                    </h1>
                </div>
                <div className='flex items-center gap-3'>
                    <img src='./public/img/checklist-icon.svg' className='max-w-[30px] h-auto' alt='' />
                    <h1 className='font-medium  text-feature-class-user-bg text-2xl leading-8'>
                        Community <span className='text-primary'>Forum</span>
                    </h1>
                </div>
                <div className='flex items-center gap-3'>
                    <img src='./public/img/checklist-icon.svg' className='max-w-[30px] h-auto' alt='' />
                    <h1 className='font-medium text-feature-class-user-bg text-2xl leading-8'>
                        Investor<span className='text-primary'> Assistance</span>
                    </h1>
                </div>
            </div>
        </div>
    );
};

const ListConsultantSectionHome = ({ text1, text2 }) => {
    const [filterConsultant, setFilterConsultant] = useState('Food & Beverage');

    const handleFilterConsultant = (e) => {
        setFilterConsultant(e.target.innerText);
    };

    return (
        <div className='container mx-auto pt-12 pb-12 flex flex-col justify-center items-center gap-12 '>
            <div id='text-about-us' className='flex flex-col items-center gap-3 pl-5 pr-5'>
                <Home.HeadingHome text={text1} className={'text-base text-[#1496FF] font-semibold leading-6'} />
                <Home.HeadingHome text={text2} className={'about-us-heading max-w-[793px] text-center leading-[120%] xl:leading-10 font-semibold'} />
            </div>
            <div className='filter-consultant max-w-[1170px] flex gap-4 lg:gap-8 overflow-x-scroll w-full justify-center'>
                <Button className={`btn ${filterConsultant != 'Food & Beverage' && 'btn-outline'} btn-primary lg:btn-wide`} onClick={handleFilterConsultant}>
                    Food & Beverage
                </Button>
                <Button className={`btn ${filterConsultant != 'Digital' && 'btn-outline'}  btn-primary lg:btn-wide`} onClick={handleFilterConsultant}>
                    Digital
                </Button>
                <Button className={`btn ${filterConsultant != 'Fashion' && 'btn-outline'} btn-primary lg:btn-wide`} onClick={handleFilterConsultant}>
                    Fashion
                </Button>
                <Button className={`btn ${filterConsultant != 'Service' && 'btn-outline'} btn-primary lg:btn-wide`} onClick={handleFilterConsultant}>
                    Service
                </Button>
            </div>
            <div id='about-us-card' className='max-w-[1170px] w-full flex flex-col sm:grid grid-cols-2 lg:grid-cols-3 justify-center gap-6 pl-5 pr-5'>
                <ConsultantCardWithPrice consultantName='Mbak Mbak asia' category='Food & Beverage' />
                <ConsultantCardWithPrice consultantName='Sultan Hafizh' category='Retail' />
                <ConsultantCardWithPrice consultantName='Oktovivian' category='Automotive' />
                <ConsultantCardWithPrice consultantName='Mbak Mbak asia' category='Food & Beverage' />
                <ConsultantCardWithPrice consultantName='Sultan Hafizh' category='Retail' />
                <ConsultantCardWithPrice consultantName='Oktovivian' category='Automotive' />
            </div>
            <Button className={'btn-primary btn-outline'}>Explore All Consultant</Button>
        </div>
    );
};

const ListConsultantAll = {};

const ConsultantCardWithPrice = ({ url = './public/img/counseling.svg', consultantName = 'consultant name', description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit....' }) => {
    return (
        <Card className={' bg-white w-full border overflow-hidden rounded-[8px_!important]  duration-300 cursor-pointer sm:max-w-[416px] h-[424px]'}>
            <Card.Body className={'flex flex-col gap-2 '}>
                <div className='flex flex-col items-center '>
                    <div className='h-[250px] bg-slate-500 w-full'></div>
                    <div className='flex flex-col p-5 gap-3'>
                        <h1 className='text-xl font-bold leading-[150%]'>{consultantName}</h1>
                        <p className='leading-[120%] font-normal text-lg '>{description}</p>
                        <p className='text-primary'>Rp. 100.000</p>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

//Show Consultant based on the category

ClassUserHome.ListConsultanSectionHome = ListConsultantSectionHome;
ClassUserHome.Benefit = Benefit;
ClassUserHome.ConsultantCardWithPrice = ConsultantCardWithPrice;
export default ClassUserHome;
