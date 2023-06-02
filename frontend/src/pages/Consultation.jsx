import { useEffect } from 'react';
import Button from '../components/Button';
import ClassUserHome from './Homepage/ClassUserHome';
import { useState } from 'react';
import axios from 'axios';
import { IconCheck, IconStar } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

const Consultation = () => {
    const [groupList, setGroupList] = useState([]);
    //for modal detail consultation
    const [modalData, setModalData] = useState();
    const handleModalData = (e) => {
        setModalData(e);
    };

    useEffect(() => {
        axios
            .get('/api/list_consultationoffer')
            .then((resp) => {
                setGroupList(resp.data.list);
                console.log(groupList, resp.data);
            })
            .catch((e) => console.log(e.message));
    }, []);

    return (
        <div className='bg-[#f6f6f6]'>
            <div className='container mx-auto pl-5 pr-5 lg:pl-0 lg:pr-0 flex flex-col gap-12 pt-12 pb-12 items-center'>
                <div className='grid place-items-center'>
                    <div className='flex flex-col items-center gap-2 '>
                        <h1 className='header-list-consultation-page '>Choose Your Consultant</h1>
                        {/* <h1>{JSON.stringify(groupList)} </h1> */}
                        <p className='max-sm:text-xs text-center lg:text-start'>Learn with fashion experts and leading organisations on one of our highey rated fashion consultants to give your business a boost</p>
                    </div>
                </div>
                <div className='flex flex-col gap-9'>
                    <div className='flex justify-between items-center' id='filter-count'>
                        <GetConsultant list={groupList.length} />
                        <select className='select select-bordered w-full max-w-xs'>
                            <option disabled selected>
                                Sort by: Most Popular
                            </option>
                            <option>Han Solo</option>
                            <option>Greedo</option>
                        </select>
                    </div>
                    <div id='about-us-card' className='w-full flex flex-col sm:grid grid-cols-2 lg:grid-cols-4 justify-center gap-x-6 gap-y-6  lpl-5 pr-5 lg:p-0'>
                        {groupList.map((item, index) => {
                            return (
                                <div key={item.id}>
                                    <label htmlFor='my-modal-3' onClick={() => handleModalData(index)}>
                                        <ClassUserHome.ConsultantCardWithPrice consultantName={item.title.slice(9)} hargaKonsultasi={`165.000`} url={item.account % 2 == 0 ? `masmasjowo` : 'masmasganteng'} category='Food & Beverage' />
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <Button className={'w-1/6 btn btn-primary'}>Show More</Button>

                {/* Put this part before </body> tag */}
                <input type='checkbox' id='my-modal-3' className='modal-toggle' />
                <div className='modal'>
                    <div className='modal-box w-11/12 max-w-full lg:p-[50px] xl:p-[100px]'>
                        <label htmlFor='my-modal-3' className='btn btn-sm btn-circle absolute right-2 top-2'>
                            ✕
                        </label>
                        <div className='flex flex-col-reverse md:grid grid-cols-2 gap-6 lg:flex lg:flex-row lg:gap-14 '>
                            <div className='' id='detail-paket'>
                                <div id='user-biodata' className='flex flex-col gap-2 md:gap-4'>
                                    <div className='h-[237px] max-w-[356px] lg:w-[356px] rounded-lg bg-slate-500 bg-[url(./public/img/backgroundRegister.svg)] bg-cover'></div>
                                    {modalData != undefined && <h1 className='text-2xl font-semibold'>{groupList[modalData].title.slice(9)}</h1>}
                                    <div className='flex items-center gap-3 '>
                                        <p className='text-xl'>4.8</p>
                                        <IconStar className='w-4' />
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col w-full'>
                                {modalData != undefined && (
                                    <>
                                        <h1 className='card-modal-consultation pb-3'>{groupList[modalData].title}</h1>
                                        <p className='card-modal-consultation-category leading-[120%] text-primary'>{groupList[modalData].category}</p>
                                    </>
                                )}
                                <div className='divider'></div>
                                <div className='flex flex-col gap-2'>
                                    <p className='font-semibold'>Description</p>
                                    <p className=''>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col gap-6 md:grid md:grid-cols-3 max-lg:pt-12'>
                            <div id='bussines-package' className='max-lg:border p-2 flex flex-col gap-4'>
                                <div>
                                    <h1 className='card-modal-consultation-category font-semibold'>Basic</h1>
                                    <div className='flex items-end gap-1'>
                                        <h1 className='card-modal-consultation pb-3'>Rp165.000</h1>
                                        <h1 className='text-base pb-3'>/hours</h1>
                                    </div>
                                </div>
                                <Link to={'/payment'}>
                                    <Button className={'btn btn-primary w-full'}>Buy Packet</Button>
                                </Link>
                                <p>Everything necessary to get started.</p>
                                <div className='flex gap-3'>
                                    <IconCheck className='bg-primary p-1 text-white rounded-full' />
                                    <p>Panduan penyusunan MBC</p>
                                </div>
                                <div className='flex gap-3'>
                                    <IconCheck className='bg-primary p-1 text-white rounded-full' />
                                    <p>Panduan action plan</p>
                                </div>
                                <div className='flex gap-3'>
                                    <IconCheck className='bg-primary p-1 text-white rounded-full' />
                                    <p>Panduan aktivasi Sosial</p>
                                </div>
                            </div>
                            <div id='bussines-package' className='max-lg:border p-2 flex flex-col gap-4'>
                                <div>
                                    <h1 className='card-modal-consultation-category font-semibold'>Business Setup</h1>
                                    <div className='flex items-end gap-1'>
                                        <h1 className='card-modal-consultation pb-3'>Rp500.000</h1>
                                        <h1 className='text-base pb-3'>/hours</h1>
                                    </div>
                                </div>
                                <Button className={'btn btn-primary w-full'}>Buy Packet</Button>
                                <p>Everything in Basic, plus essential tools for growing your business.</p>
                                <div className='flex gap-3'>
                                    <IconCheck className='bg-primary p-1 text-white rounded-full' />
                                    <p>Free website 1 tahun </p>
                                </div>
                                <div className='flex gap-3'>
                                    <IconCheck className='bg-primary p-1 text-white rounded-full' />
                                    <p>Free email bisnis 1 tahun</p>
                                </div>
                                <div className='flex gap-3'>
                                    <IconCheck className='bg-primary p-1 text-white rounded-full' />
                                    <p>Free rekomendasi software</p>
                                </div>
                            </div>
                            <div id='bussines-package' className=' max-lg:border p-2 flex flex-col gap-4'>
                                <div>
                                    <h1 className='card-modal-consultation-category font-semibold'>Business Success</h1>
                                    <div className='flex items-end gap-1'>
                                        <h1 className='card-modal-consultation pb-3'>Rp800.000</h1>
                                        <h1 className='text-base pb-3'>/hours</h1>
                                    </div>
                                </div>
                                <Button className={'btn btn-primary w-full'}>Buy Packet</Button>
                                <p>Everything in Essential, plus collaboration tools and deeper insights.</p>
                                <div className='flex gap-3'>
                                    <IconCheck className='bg-primary p-1 text-white rounded-full' />
                                    <p>Free website 1 tahun </p>
                                </div>
                                <div className='flex gap-3'>
                                    <IconCheck className='bg-primary p-1 text-white rounded-full' />
                                    <p>Free email bisnis 1 tahun</p>
                                </div>
                                <div className='flex gap-3'>
                                    <IconCheck className='bg-primary p-1 text-white rounded-full' />
                                    <p>Free rekomendasi software</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const GetConsultant = ({ list }) => {
    return <h1>{list} Consultants</h1>;
};

export default Consultation;
