import { useState, useEffect } from 'react';
import Card from './../components/Card';
import Button from '../components/Button';
import axios from 'axios';
const Chat = () => {
    const [sizeWindow, setSizeWindow] = useState(window.innerWidth);

    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('user')) || {});

    useEffect(() => {
        return () => {
            axios
                .get('/api/list_konsultasi', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + (localStorage.getItem('token') || '')
                    }
                })
                .then((resp) => {
                    console.log(resp);
                });
        };
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setSizeWindow(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
    }, [sizeWindow]);
    return (
        <div className='bg-[#FAFCFE] h-screen'>
            {' '}
            <div className={`container mx-auto grid ${sizeWindow > 1026 || sizeWindow == undefined ? 'grid-cols-[30%_1fr]' : 'grid-cols-1'}  pt-5 md:pt-11 md:gap-7 xl:gap-14`}>{sizeWindow > 1026 || sizeWindow == undefined ? <DesktopChatView /> : <MobileChatView />} </div>
        </div>
    );
};

const SearchInput = ({ className }) => {
    return <input placeholder='search' className={`p-3 border w-full rounded-lg ${className}`}></input>;
};

const ChatList = ({ handleChooseChat }) => {
    return (
        <Card className={'border rounded-[1rem_!important] p-5 flex flex-col gap-6'}>
            <Card.Title text='Consultant' />
            <Card.Body className={'flex flex-col gap-5'}>
                <ConsultantCard handleChooseChat={handleChooseChat} />
                <ConsultantCard />
                <ConsultantCard />
            </Card.Body>
        </Card>
    );
};

const ConsultantCard = ({ className, showDivider, handleChooseChat }) => {
    return (
        <div className={`${className}`} onClick={handleChooseChat}>
            <div className={`divider m-[0px_!important] pb-4 ${showDivider == false && 'hidden'} `}></div>
            <div className='flex justify-between items-center'>
                <div className='flex gap-4'>
                    <div className='avatar placeholder'>
                        <div className='bg-neutral-focus text-neutral-content rounded-full w-11'>
                            <span className='text-3xl'>K</span>
                        </div>
                    </div>{' '}
                    <div id='consultant-information'>
                        <ConsultantName />
                        <ConsultantMessage />
                    </div>
                </div>
                <ConsultantStatus />
            </div>
        </div>
    );
};

const ConsultantName = () => {
    return <h1>Name</h1>;
};

const ConsultantMessage = () => {
    return <p>Consultantmessage</p>;
};

const ConsultantStatus = () => {
    return <h1>ongoing</h1>;
};

const ChatMessage = ({ className }) => {
    return (
        <div>
            <div className={`${className} flex flex-col gap-6 `}>
                <ChatBubble userClass='U' />
                <ChatBubble userClass='I' />
                <ChatBubble userClass='U' />
                <ChatBubble userClass='I' />
                <ChatBubble userClass='I' />
                <ChatBubble userClass='I' />
                <ChatBubble userClass='I' />
                <ChatBubble userClass='U' />
                <ChatBubble userClass='U' />
            </div>
            <div id='chat-sending-bar' className='flex p-[2rem] gap-3'>
                <input placeholder={'Type Message'} className='w-full h-[50px] border rounded-2xl pl-6 ' />
                <Button className={'btn btn-primary'}>{'Send >'}</Button>
            </div>
        </div>
    );
};

const ChatDetailMessage = ({ handleCloseChat }) => {
    const [sizeWindow, setSizeWindow] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setSizeWindow(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
    }, [sizeWindow]);
    return (
        <Card className={'rounded-[1rem_!important]  '}>
            <Card.Body>
                <div className='flex flex-col'>
                    <div className='flex flex-col sm:flex-row w-full pl-4 pr-4 gap-3'>
                        <div className='flex justify-start pt-4 items-center lg:hidden' onClick={handleCloseChat}>
                            <div className='flex justify-center items-center'>
                                <div className={`arrow left`}></div>
                            </div>
                            <h1 className='text-primary'>Back</h1>
                        </div>
                        <ConsultantCard className={`${sizeWindow < 1026 ? 'pt-4 pb-4 ' : 'p-[2rem_4rem_1rem_3rem] '} w-full `} showDivider={false} />
                    </div>
                    <div className={`divider m-[0px_!important]`}></div>
                </div>
                <ChatMessage className={'p-5 lg:p-[2rem_4rem_1rem_3rem] h-screen max-h-[550px] overflow-y-scroll overflow-x-hidden'} />
            </Card.Body>
        </Card>
    );
};

const DesktopChatView = () => {
    return (
        <>
            <div className='flex flex-col gap-9'>
                <SearchInput />
                <ChatList />
            </div>
            <div className='border rounded-[1rem_!important]'>
                <ChatDetailMessage />
            </div>
        </>
    );
};

const MobileChatView = () => {
    const [showDetail, setShowDetail] = useState(false);
    const handleCloseChat = () => {
        setShowDetail(false);
    };

    const MobileChatViewDetail = () => {
        return (
            <div className='flex flex-col gap-4'>
                <div className='border rounded-[1rem_!important] '>
                    <ChatDetailMessage handleCloseChat={handleCloseChat} />
                </div>
            </div>
        );
    };

    const handleChooseChat = () => {
        console.log('handeled');
        setShowDetail(true);
    };
    return (
        <div className='flex flex-col gap-5 pl-5 pr-5 md:p-0'>
            {!showDetail ? (
                <>
                    <SearchInput className={'w-full'} />
                    <ChatList handleChooseChat={handleChooseChat} />
                </>
            ) : (
                <MobileChatViewDetail />
            )}
        </div>
    );
};

const ChatBubble = ({ userClass = 'U' }) => {
    return (
        <div className={`chat ${userClass == 'U' ? 'chat-start' : 'chat-end'}`}>
            <div className='chat-image avatar'>
                <div className='w-10 rounded-full'>
                    <img src='./public/img/potrait.jpg' />
                </div>
            </div>
            <div className={`chat-bubble  ${userClass == 'U' ? 'chat-bubble-primary' : 'bg-white shadow-lg text-[#00000_!important]'}`}>
                <ReceiveMessage />
            </div>
        </div>
    );
};

const ReceiveMessage = () => {
    return <>It was said that you would, destroy the Sith, not join them.</>;
};

export default Chat;
