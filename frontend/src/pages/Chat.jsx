import { useState, useEffect } from 'react';
import Card from './../components/Card';
import Button from '../components/Button';
import axios from 'axios';
import { useForm } from 'react-hook-form';
const Chat = () => {
    const [sizeWindow, setSizeWindow] = useState(window.innerWidth);

    const [listConsultant, setListConsultant] = useState([]);

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
                    //console.log(resp);
                    setListConsultant(resp.data.list);
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
            <div
                className={`container mx-auto grid 
                ${sizeWindow > 1026 || sizeWindow == undefined ? 'grid-cols-[30%_1fr]' : 'grid-cols-1'}  
                pt-5 md:pt-11 md:gap-7 xl:gap-14`}>
                {sizeWindow > 1026 || sizeWindow == undefined ? <DesktopChatView konsultasi_list={listConsultant} /> : <MobileChatView />}
            </div>
        </div>
    );
};
// chat sebelah kiri
const ChatList = ({ handleChooseChat, konsultasi_list, handleKonsultasiTarget }) => {
    const choosedChatHandle = (e) => {
        handleKonsultasiTarget(e);
    };

    return (
        <Card className={'border rounded-[1rem_!important] p-5 flex flex-col gap-6'}>
            <Card.Title text='Consultant' />
            <Card.Body className={'flex flex-col gap-5'}>
                {konsultasi_list.map((item) => {
                    return (
                        <div onClick={() => choosedChatHandle(item.id)} key={item.id}>
                            <ConsultantCard handleChooseChat={handleChooseChat} name={item.name} />
                        </div>
                    );
                })}
            </Card.Body>
        </Card>
    );
};
// component sebelah kiri
const ConsultantCard = ({ className, showDivider, handleChooseChat, name, key }) => {
    return (
        <div className={`${className}`}>
            <div value={key} className={`divider m-[0px_!important] pb-4 ${showDivider == false && 'hidden'} `}></div>
            <div className='flex justify-between items-center'>
                <div className='flex gap-4'>
                    <div className='avatar placeholder'>
                        <div className='bg-neutral-focus text-neutral-content rounded-full w-11'>
                            <span className='text-3xl'>K</span>
                        </div>
                    </div>
                    <div id='consultant-information'>
                        <h1>{name} message</h1>
                        <h1>halo</h1>
                    </div>
                </div>
                <h1>ongoing</h1>
            </div>
        </div>
    );
};

//chat detail sebelah kanan
const ChatDetailMessage = ({ handleCloseChat, handleSendMessage, messages }) => {
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
                <ChatMessage handleSendMessage={handleSendMessage} messages={messages} className={'p-5 lg:p-[2rem_4rem_1rem_3rem] h-screen max-h-[550px] overflow-y-scroll overflow-x-hidden'} />
            </Card.Body>
        </Card>
    );
};

const ChatMessage = ({ className, handleSendMessage, messages }) => {
    const { register, handleSubmit } = useForm();
    const onSubmit = (data) => {
        handleSendMessage(data.message);
        console.log(messages);
    };

    const [idUnique, setIdUnique] = useState(0);

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={`${className} flex flex-col gap-6 `}>
                    {messages.map((item, index) => {
                        //setIdUnique((old) => old + 1);
                        //console.log('item =', item);
                        return (
                            <div key={index}>
                                <ChatBubble message={item.message} userid={item.id} />
                            </div>
                        );
                    })}
                </div>
                <div id='chat-sending-bar' className='flex p-[2rem] gap-3'>
                    <input {...register('message')} placeholder={'Type Message'} className='w-full h-[50px] border rounded-2xl pl-6 ' />
                    <Button className={'btn btn-primary'} type='submit'>
                        {'Send >'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

//end of chat sebelah kanan

//view for layoyut
const DesktopChatView = ({ konsultasi_list }) => {
    const [konsultasiTarget, setKonsultasiTarget] = useState();
    //const [sendMessage, setSendMessage] = useState('');
    const [messages, setMessage] = useState([]);

    const [sse, setSse] = useState(null);

    const handleKonsultasiTarget = (konsultasi_id) => {
        setKonsultasiTarget(konsultasi_id);
        axios
            .get('/api/konsultasi_flash_auth', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
            .then((resp) => {
                const token = resp.data.token;
                console.log(typeof konsultasi_id, 'konsultasi_id=', konsultasi_id);
                console.log('token =', token);
                const sse = new EventSource('/api/live_konsultasi/' + konsultasi_id + '?token=' + token);

                sse.addEventListener('receive', (msg) => {
                    console.log('got data:', JSON.parse(msg.data));
                    setMessage((old) => [...old, JSON.parse(msg.data)]);
                    console.log(msg);
                });
                sse.onerror = () => {
                    console.log('error. closing sse');
                    sse.close();
                };
            });
    };

    const handleSendMessage = (message) => {
        axios
            .post(
                '/api/write_konsultasi',
                {
                    konsultasi_id: konsultasiTarget,
                    message: message
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                }
            )
            .then((resp) => {
                console.log(resp);
            });
        //console.log(e, konsultasiTarget, '<<<');
    };

    return (
        <>
            <div className='flex flex-col gap-9'>
                <SearchInput />
                {/* <p>{JSON.stringify(messages)}</p> */}
                <ChatList konsultasi_list={konsultasi_list} handleKonsultasiTarget={handleKonsultasiTarget} />
            </div>
            <div className='border rounded-[1rem_!important]'>
                <ChatDetailMessage handleSendMessage={handleSendMessage} messages={messages} />
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

//end of view for layoyut
const ChatBubble = ({ message, id }) => {
    return (
        <div className={`chat ${id == 5 ? 'chat-start' : 'chat-end'}`}>
            <div className='chat-image avatar'>
                <div className='w-10 rounded-full'>
                    <img src='./public/img/potrait.jpg' />
                </div>
            </div>
            <div className={`chat-bubble  ${id == 5 ? 'chat-bubble-primary' : 'bg-white shadow-lg text-[#00000_!important]'}`}>
                <h1>{message}</h1>
            </div>
        </div>
    );
};

//search input
const SearchInput = ({ className }) => {
    return <input placeholder='search' className={`p-3 border w-full rounded-lg ${className}`}></input>;
};

export default Chat;
