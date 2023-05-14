import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import Card from './components/Card';
import Heading from './components/Heading';
import Avatar from './components/Avatar';
import Sidebar from './components/Sidebar';

function App() {
    return (
        <div id='dashboard'>
            <Sidebar>
                <Sidebar.DashboardMenu className={'p-[24px] xl:p-[70px]'}>
                    <div id='card-top' className=' flex flex-col gap-[24px]'>
                        <Heading>
                            <Heading.MainHeading text={'Task Info'} />
                            <Heading.SecondHeading text={'Complete your tasks efficiently and avoid procrastination'} />
                        </Heading>

                        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[40px]'>
                            <Card>
                                <Card.Body className={'max-h-full p-[26px] h-[200px] '}>
                                    <Card.Top text={'Belum Selesai'} number='18' />
                                    <Avatar />
                                </Card.Body>
                            </Card>
                            <Card>
                                <Card.Body className={'max-h-full p-[26px] h-[200px] '}>
                                    <Card.Top text={'Sudah Selesai'} number='5' />
                                    <Avatar />
                                </Card.Body>
                            </Card>
                            <Card>
                                <Card.Body className={'max-h-full p-[26px] h-[200px] '}>
                                    <Card.Top text={'Revisi'} number='20' />
                                    <Avatar />
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </Sidebar.DashboardMenu>
            </Sidebar>
        </div>
    );
}

export default App;
