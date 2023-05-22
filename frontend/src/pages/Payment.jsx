import Card from '../components/Card';
import LayoutInputLabel from './../components/LayoutInputLabel';
import Label from './../components/Label';
import { useForm } from 'react-hook-form';
import Heading from '../components/Heading';
import { useState } from 'react';
import Button from '../components/Button';

const Payment = () => {
    // handle change page
    let [pageCount, setPageCount] = useState(0);
    const handlePage = (event) => {
        event == '+' ? setPageCount((pageCount += 1)) : setPageCount((pageCount -= 1));
    };

    return (
        <div className=' bg-[#FAFCFE] bg-no-repeat bg-cover '>
            <div className='lg:grid lg:grid-cols-2 gap-[3.75rem] pt-[2rem] pl-5 pr-5 sm:pl-6 sm:pr-6 xl:pl-[100px] xl:pr-[100px]'>{pageCount == 0 ? <Payment.Order handlePage={handlePage} /> : pageCount == 1 ? <Payment.DetailPayment handlePage={handlePage} /> : ''}</div>
        </div>
    );
};

const Order = ({ handlePage }) => {
    const { register, handleSubmit } = useForm();
    const onSubmit = (data) => console.log(data);

    const [rememberChecked, setRememberChecked] = useState(false);

    //onchange remember me handler
    const handlerChange = () => {
        setRememberChecked(!rememberChecked);
    };
    return (
        <>
            <div className='flex flex-col gap-10'>
                <div>
                    <div className='flex items-center justify-between'>
                        <Heading className='text-[#111827] font-semibold heading-payment leading-[3.75rem]' text={'Customer Data'} />
                        <div className='lg:hidden'>
                            {/* The button to open modal */}
                            <label htmlFor='my-modal-4' className='text-primary underline'>
                                Detail Order
                            </label>
                            {/* Put this part before </body> tag */}
                            <input type='checkbox' id='my-modal-4' className='modal-toggle' />
                            <label htmlFor='my-modal-4' className='modal cursor-pointer'>
                                <label className='modal-box relative' htmlFor=''>
                                    <Heading className='text-[#111827] font-semibold leading-[3.75rem] heading-payment' text={'Detail Order'} />
                                    <Card className={'sm:border pt-6 pb-6'}>
                                        <div className='flex flex-col gap-4 pb-6'>
                                            <Heading className={'text-2xl font-semibold leading-[36px] sm:pl-12 sm:pr-12 heading-course-payment '} text={'Konsultasi Membangun Usaha Kuliner'} />
                                            <Heading className={'text-base text-[#41505C] font-semibold leading-[19px] sm:pl-12 sm:pr-12  '} text={'Basic Packet'} />
                                            <Heading className={'text-base text-[#41505C] font-semibold leading-[19px] sm:pl-12 sm:pr-12  '} text={'1 Hours'} />
                                        </div>
                                        <div className='divider m-[0px_!important]'></div>
                                        <div id='detail-order-payment' className='sm:pl-12 sm:pr-12 flex flex-col pt-6 gap-6'>
                                            <div>
                                                <div className='bg-slate-600 h-[200px] rounded-2xl'></div>
                                                <div className='flex flex-col justify-center'>
                                                    <Heading text={'Antontio Sanjaya'} className={'text-base font-semibold leading-9'} />
                                                    <h1 className='text-sm text-primary font-semibold'>Food & Beverage</h1>
                                                </div>
                                            </div>
                                            <div id='material-course' className='flex flex-col gap-2'>
                                                <p>Panduan Penyusunan BMC</p>
                                                <p>Panduan Action Plan</p>
                                                <p>Panduan Aktivasi Sosial</p>
                                            </div>
                                        </div>
                                    </Card>
                                </label>
                            </label>
                        </div>
                    </div>
                    <div className='divider m-[0px_!important] pb-5 sm:hidden'></div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Card className={'sm:border sm:p-12'}>
                            <Card.Body className={'flex flex-col gap-6'}>
                                <LayoutInputLabel>
                                    <Label text={'Name'} />
                                    <input {...register('name')} placeholder={'Enter your name'} />
                                </LayoutInputLabel>
                                <div className='grid grid-cols-1 2xl:grid-cols-2 gap-7'>
                                    <LayoutInputLabel>
                                        <Label text={'Phone Number'} />
                                        <div className='flex flex-row lg:grid lg:grid-cols-[20%_80%]'>
                                            <input disabled placeholder='+62' className='bg-slate-200 roun rounded-tr-[0_!important] rounded-br-[0_!important] max-lg:max-w-[60px]' />
                                            <input {...register('phoneNumber')} className='w-full rounded-tl-[0_!important] rounded-bl-[0_!important] ' placeholder={'Enter your phone number'} />
                                        </div>
                                    </LayoutInputLabel>
                                    <LayoutInputLabel>
                                        <Label text={'Email'} />
                                        <input {...register('email')} placeholder={'Enter your name'} />
                                    </LayoutInputLabel>
                                </div>
                            </Card.Body>
                        </Card>
                    </form>
                </div>
                <div id='total-payment'>
                    <Card className={'sm:border pt-6 pb-6'}>
                        <div className='flex justify-between sm:p-0'>
                            <Heading className={'text-2xl font-semibold leading-[3.75rem] sm:pl-12 sm:pr-12  '} text={'Total'} />
                            <Heading className={'text-2xl font-semibold leading-[3.75rem] sm:pl-12 sm:pr-12  '} text={'Rp 168.000'} />
                        </div>
                        <div className='divider m-[0px_!important] '></div>
                        <div id='total-payment-bottom' className=' sm:pl-12 sm:pr-12'>
                            <div className='flex justify-between total-payment-bottom-paragraph'>
                                <p>Basic Packet ( 1 hours )</p>
                                <p>Rp 165.000</p>
                            </div>
                            <div className='flex justify-between total-payment-bottom-paragraph'>
                                <p>Tax and Fee</p>
                                <p>Rp 3.000</p>
                            </div>
                        </div>
                    </Card>
                </div>
                <div id='payment-agreement' className='flex gap-3'>
                    <div className='form-control'>
                        <label className='label cursor-pointer flex gap-3'>
                            <input type='checkbox' className='checkbox checkbox-primary' onChange={handlerChange} value={rememberChecked} />
                            <span className='label-text label-text-style'>By clicking the button below, you agree to Fundify's Terms and Conditions and Privacy Policy.</span>
                        </label>
                    </div>
                </div>
                <div id='button-payment-wrapper' className='flex sm:justify-end '>
                    <Button className={'bg-primary border-none text-white sm:w-[439px] max-sm:w-full'} onClick={() => handlePage('+')}>
                        Go to Payment
                    </Button>
                </div>
            </div>
            <div className='hidden lg:flex flex-col'>
                <Heading className='text-[#111827] font-semibold leading-[3.75rem] heading-payment' text={'Detail Order'} />
                <Card className={'sm:border pt-6 pb-6'}>
                    <div className='flex flex-col gap-4 pb-6'>
                        <Heading className={'text-2xl font-semibold leading-[36px] sm:pl-12 sm:pr-12  '} text={'Konsultasi Membangun Usaha Kuliner'} />
                        <Heading className={'text-base text-[#41505C] font-semibold leading-[19px] sm:pl-12 sm:pr-12  '} text={'Basic Packet'} />
                        <Heading className={'text-base text-[#41505C] font-semibold leading-[19px] sm:pl-12 sm:pr-12  '} text={'1 Hours'} />
                    </div>
                    <div className='divider m-[0px_!important]'></div>
                    <div id='detail-order-payment' className='pl-12 pr-12 grid grid-cols-2 pt-6 gap-6'>
                        <div className='bg-slate-600 h-[200px] rounded-2xl'></div>
                        <div className='flex flex-col justify-center'>
                            <Heading text={'Antontio Sanjaya'} className={'text-base font-semibold leading-9'} />
                            <h1 className='text-sm text-primary font-semibold'>Food & Beverage</h1>
                        </div>
                        <div id='material-course' className='flex flex-col gap-2'>
                            <p>Panduan Penyusunan BMC</p>
                            <p>Panduan Action Plan</p>
                            <p>Panduan Aktivasi Sosial</p>
                        </div>
                    </div>
                </Card>
            </div>
        </>
    );
};

const DetailPayment = ({ handlePage }) => {
    const [selectValue, setSelectValue] = useState('');

    const handleSelectValue = (event) => {
        setSelectValue(event.target.value);
    };

    return (
        <>
            <div className='flex flex-col gap-10'>
                <div className='flex flex-col gap-3'>
                    <div className='flex flex-col sm:flex-row justify-between '>
                        <Heading className='text-[#111827] font-semibold heading-payment leading-[3.75rem]' text={'Payment Method'} />
                        <div className='flex flex-col gap-4'>
                            <div>
                                <select className='select select-bordered w-full max-w-xs' onChange={handleSelectValue} defaultValue={'Select Payment Method'}>
                                    <option disabled selected>
                                        Select payment method
                                    </option>
                                    <option>Virtual Account</option>
                                    <option>Instant Payment</option>
                                </select>
                            </div>
                            <div className='lg:hidden flex justify-end'>
                                {/* The button to open modal */}
                                <label htmlFor='my-modal-4' className='text-primary underline'>
                                    Lihat Detail Order
                                </label>
                                {/* Put this part before </body> tag */}
                                <input type='checkbox' id='my-modal-4' className='modal-toggle' />
                                <label htmlFor='my-modal-4' className='modal cursor-pointer'>
                                    <label className='modal-box relative' htmlFor=''>
                                        <Heading className='text-[#111827] font-semibold leading-[3.75rem] heading-payment' text={'Detail Order'} />
                                        <Card className={'sm:border pt-6 pb-6'}>
                                            <div className='flex flex-col gap-4 pb-6'>
                                                <Heading className={'text-2xl font-semibold leading-[36px] sm:pl-12 sm:pr-12 heading-course-payment '} text={'Konsultasi Membangun Usaha Kuliner'} />
                                                <Heading className={'text-base text-[#41505C] font-semibold leading-[19px] sm:pl-12 sm:pr-12  '} text={'Basic Packet'} />
                                                <Heading className={'text-base text-[#41505C] font-semibold leading-[19px] sm:pl-12 sm:pr-12  '} text={'1 Hours'} />
                                            </div>
                                            <div className='divider m-[0px_!important]'></div>
                                            <div id='detail-order-payment' className='sm:pl-12 sm:pr-12 flex flex-col pt-6 gap-6'>
                                                <div>
                                                    <div className='bg-slate-600 h-[200px] rounded-2xl'></div>
                                                    <div className='flex flex-col justify-center'>
                                                        <Heading text={'Antontio Sanjaya'} className={'text-base font-semibold leading-9'} />
                                                        <h1 className='text-sm text-primary font-semibold'>Food & Beverage</h1>
                                                    </div>
                                                </div>
                                                <div id='material-course' className='flex flex-col gap-2'>
                                                    <p>Panduan Penyusunan BMC</p>
                                                    <p>Panduan Action Plan</p>
                                                    <p>Panduan Aktivasi Sosial</p>
                                                </div>
                                            </div>
                                        </Card>
                                    </label>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className='divider m-[0px_!important] pb-5 sm:hidden'></div>
                    <Card className={'sm:border sm:p-12'}>
                        <Card.Body className={'flex flex-col '}>{selectValue == 'Virtual Account' ? <Payment.VirtualAccount /> : <Payment.InstantPayment />}</Card.Body>
                    </Card>
                </div>
                <div id='button-payment-wrapper' className='flex flex-col sm:flex-row sm:justify-between gap-4'>
                    <button className='btn btn-outline btn-primary' onClick={() => handlePage('-')}>
                        go back
                    </button>
                    <Button className={'bg-primary border-none text-white lg::w-[439px] max-sm:w-full'} onClick={() => handlePage('+')}>
                        Confirm Payment
                    </Button>
                </div>
            </div>
            <div className='hidden lg:flex flex-col gap-3'>
                <Heading className='text-[#111827] font-semibold leading-[3.75rem] heading-payment' text={'Detail Order'} />
                <Card className={'sm:border pt-6 pb-6'}>
                    <div className='flex flex-col gap-4 pb-6 pt-6'>
                        <Heading className={'text-xl text-[#6B7280] font-medium leading-[19px] sm:pl-12 sm:pr-12'} text={'Total Payment'} />
                        <Heading className={'text-4xl font-semibold leading-[36px] sm:pl-12 sm:pr-12  '} text={'Rp 168.000'} />
                    </div>
                    <div className='divider m-[0px_!important]'></div>
                    <div className='flex flex-col gap-4 pb-6 pt-6'>
                        <Heading className={'text-xl text-[#6B7280] font-medium leading-[19px] sm:pl-12 sm:pr-12'} text={'No. Order'} />
                        <Heading className={'text-2xl font-medium leading-[36px] sm:pl-12 sm:pr-12  '} text={'120289000341'} />
                    </div>
                    <div className='divider m-[0px_!important]'></div>
                    <div className='flex flex-col gap-4 pb-6 pt-6'>
                        <Heading className={'text-xl text-[#6B7280] font-medium leading-[19px] sm:pl-12 sm:pr-12'} text={'Detail Order'} />
                        <Heading className={'text-2xl font-semibold leading-[19px] sm:pl-12 sm:pr-12'} text={'Konsultasi Membangun Usaha Kuliner'} />
                        <Heading className={'text-2xl font-medium leading-[36px] sm:pl-12 sm:pr-12  '} text={'120289000341'} />
                    </div>
                    <div className='divider m-[0px_!important]'></div>
                    <div className='flex flex-col gap-4 pb-6 pt-6'>
                        <Heading className={'text-xl text-[#6B7280] font-medium leading-[19px] sm:pl-12 sm:pr-12'} text={'Customer Name'} />
                        <Heading className={'text-2xl font-medium leading-[36px] sm:pl-12 sm:pr-12  '} text={'Senjani Nathania'} />
                    </div>
                    <div id='detail-order-payment' className='pl-12 pr-12 grid grid-cols-2 pt-6 gap-6'></div>
                </Card>
            </div>
        </>
    );
};

const MethodPayment = ({ text, url }) => {
    return (
        <div className='flex justify-between items-center min-h-8'>
            <Heading text={text} className={'text-base'} />
            <div className='flex justify-center items-center gap-3'>
                <img src={url} alt='' className='' />
                <i className='arrow down'></i>
            </div>
        </div>
    );
};

const VirtualAccount = () => {
    return (
        <>
            <Heading className='text-[#111827] font-semibold heading-detail-payment leading-[3.75rem]' text={'Virtual Account'} />
            <p>Anda bisa membayar dengan transfer melalui ATM, Internet Banking, & Mobile Banking.</p>
            <div id='payment-method-bank' className='flex flex-col gap-2 mt-2'>
                <div className='divider m-[0px_!important]'></div>
                <Payment.MethodPayment text={'BCA Virtual Account'} url={`./public/img/bank-bca.svg`} />
                <div className='divider m-[0px_!important]'></div>
                <Payment.MethodPayment text={'Mandiri Virtual Account'} url={`./public/img/bank-bca.svg`} />
                <div className='divider m-[0px_!important]'></div>
                <Payment.MethodPayment text={'BNI Virtual Account'} url={`./public/img/bank-bca.svg`} />
                <div className='divider m-[0px_!important]'></div>
                <Payment.MethodPayment text={'BRIVA Virtual Account'} url={`./public/img/bank-bca.svg`} />
            </div>
        </>
    );
};

const InstantPayment = () => {
    return (
        <>
            <Heading className='text-[#111827] font-semibold heading-detail-payment leading-[3.75rem]' text={'Instant Payment'} />
            <p>Anda bisa membayar dengan transfer melalui ATM, Internet Banking, & Mobile Banking.</p>
            <div id='payment-method-bank' className='flex flex-col gap-2 mt-2'>
                <div className='divider m-[0px_!important]'></div>
                <Payment.MethodPayment text={'ShopeePay'} url={`./public/img/bank-bca.svg`} />
                <div className='divider m-[0px_!important]'></div>
                <Payment.MethodPayment text={'Gopay'} url={`./public/img/bank-bca.svg`} />
                <div className='divider m-[0px_!important]'></div>
                <Payment.MethodPayment text={'Dana'} url={`./public/img/bank-bca.svg`} />
                <div className='divider m-[0px_!important]'></div>
                <Payment.MethodPayment text={'OVO'} url={`./public/img/bank-bca.svg`} />
            </div>
        </>
    );
};

Payment.InstantPayment = InstantPayment;
Payment.VirtualAccount = VirtualAccount;
Payment.MethodPayment = MethodPayment;
Payment.Order = Order;
Payment.DetailPayment = DetailPayment;

export default Payment;
