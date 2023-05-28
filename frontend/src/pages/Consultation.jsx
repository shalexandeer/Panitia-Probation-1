import Button from '../components/Button';
import ClassUserHome from './Homepage/ClassUserHome';

const Consultation = () => {
    return (
        <div className='bg-[#f6f6f6]'>
            <div className='container mx-auto pl-5 pr-5 lg:pl-0 lg:pr-0 flex flex-col gap-12 pt-12 pb-12 items-center'>
                <div className='grid place-items-center'>
                    <div className='flex flex-col items-center gap-2 '>
                        <h1 className='header-list-consultation-page '>Fashion Consultant</h1>
                        <p className='max-sm:text-xs text-center lg:text-start'>Learn with fashion experts and leading organisations on one of our highey rated fashion consultants to give your business a boost</p>
                    </div>
                </div>
                <div className='flex flex-col gap-9'>
                    <div className='flex justify-between items-center' id='filter-count'>
                        <GetConsultant />
                        <select className='select select-bordered w-full max-w-xs'>
                            <option disabled selected>
                                Sort by: Most Popular
                            </option>
                            <option>Han Solo</option>
                            <option>Greedo</option>
                        </select>
                    </div>
                    <div id='about-us-card' className='w-full flex flex-col sm:grid grid-cols-2 lg:grid-cols-4 justify-center gap-x-6 gap-y-6  lpl-5 pr-5 lg:p-0'>
                        <label htmlFor='my-modal-3'>
                            <ClassUserHome.ConsultantCardWithPrice consultantName='Mbak Mbak asia' category='Food & Beverage' />
                        </label>
                        <label htmlFor='my-modal-3'>
                            <ClassUserHome.ConsultantCardWithPrice consultantName='Sultan Hafizh' category='Retail' />
                        </label>
                        <ClassUserHome.ConsultantCardWithPrice consultantName='Oktovivian' category='Automotive' />
                        <ClassUserHome.ConsultantCardWithPrice consultantName='Mbak Mbak asia' category='Food & Beverage' />
                        <ClassUserHome.ConsultantCardWithPrice consultantName='Sultan Hafizh' category='Retail' />
                        <ClassUserHome.ConsultantCardWithPrice consultantName='Oktovivian' category='Automotive' />
                        <ClassUserHome.ConsultantCardWithPrice consultantName='Oktovivian' category='Automotive' />
                        <ClassUserHome.ConsultantCardWithPrice consultantName='Oktovivian' category='Automotive' />
                        <ClassUserHome.ConsultantCardWithPrice consultantName='Oktovivian' category='Automotive' />
                        <ClassUserHome.ConsultantCardWithPrice consultantName='Oktovivian' category='Automotive' />
                    </div>
                </div>
                <Button className={'w-1/6 btn btn-primary'}>Show More</Button>

                {/* Put this part before </body> tag */}
                <input type='checkbox' id='my-modal-3' className='modal-toggle' />
                <div className='modal'>
                    <div className='modal-box w-11/12 max-w-full p-[100px]'>
                        <label htmlFor='my-modal-3' className='btn btn-sm btn-circle absolute right-2 top-2'>
                            ✕
                        </label>
                        <div className='' id='detail-paket'>
                            <div id='user-biodata'></div>
                        </div>
                        <p className='py-4'>You've been selected for a chance to get one year of subscription to use Wikipedia for free!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const GetConsultant = () => {
    return <h1>107 Consultants</h1>;
};

const ModalDetailConsultation = () => {
    <>
        <input type='checkbox' id='my-modal-3' className='modal-toggle' />
        <div className='modal'>
            <div className='modal-box relative'>
                <label htmlFor='my-modal-3' className='btn btn-sm btn-circle absolute right-2 top-2'>
                    ✕
                </label>
                <h3 className='text-lg font-bold'>Congratulations random Internet user!</h3>
                <p className='py-4'>You've been selected for a chance to get one year of subscription to use Wikipedia for free!</p>
            </div>
        </div>
    </>;
};

export default Consultation;
