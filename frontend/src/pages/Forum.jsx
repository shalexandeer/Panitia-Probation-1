import { useState, useEffect } from 'react';
import Card from './../components/Card';
import Button from '../components/Button';
import { useForm } from 'react-hook-form';
import LayoutInputLabel from '../components/LayoutInputLabel';
import Modal from '../components/Modal';
import { Navigate, useNavigate } from 'react-router-dom';

//Layout
const Forum = () => {
    const [sizeWindow, setSizeWindow] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setSizeWindow(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
    }, [sizeWindow]);
    return (
        <div className='bg-[#FAFCFE] h-screen'>
            {' '}
            <div className={`container mx-auto grid ${sizeWindow > 1026 || sizeWindow == undefined ? 'grid-cols-[30%_1fr]' : 'grid-cols-1'}  pt-5 md:pt-11 md:gap-7 xl:gap-14`}>
                <ForumLayout />{' '}
            </div>
        </div>
    );
};

const ForumLayout = () => {
    return (
        <>
            <div className='flex flex-col gap-9'>
                <DiscussingNowList />
            </div>
            <div className='rounded-[1rem_!important]'>
                <AllDiscussion />
            </div>
        </>
    );
};

const AllDiscussion = ({}) => {
    //handle filter button active
    const [filterActive, setFilterActive] = useState('Newest');

    // event trigger button active
    const handleActiveFilter = (event) => {
        setFilterActive(event.target.innerText);
    };

    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('user')) || {});

    const [pageAddQuestion, setPageAddQuestion] = useState(false);
    const handleSwitchAddQuestion = () => {
        if (userInfo['class'] == undefined) navigate('/auth');
        setPageAddQuestion((prev) => !prev);
    };

    return (
        <div className='flex flex-col gap-3 p-5'>
            <div className='flex justify-between'>
                <Card.Title text={pageAddQuestion ? 'Add Question' : `All Discussion`} />
                <Button className={'btn btn-primary'} onClick={handleSwitchAddQuestion}>
                    {!pageAddQuestion ? '+ Ask Question' : '< Back'}
                </Button>
            </div>
            <div className={`divider m-[0px_!important]`}></div>
            {pageAddQuestion ? <AddQuestion /> : <AllQuestion filterActive={filterActive} handleActiveFilter={handleActiveFilter} />}
        </div>
    );
};

const AllQuestion = ({ filterActive, handleActiveFilter }) => {
    return (
        <>
            <div id='count-and-filter' className='flex flex-col md:flex-row gap-4 items-start md:items-center'>
                <CountAllQuestion />
                <div className='flex gap-4'>
                    <Button className={`btn btn-primary ${filterActive !== 'Newest' && 'btn-outline'} `} onClick={handleActiveFilter}>
                        Newest
                    </Button>
                    <Button className={`btn btn-primary ${filterActive !== 'Popular' && 'btn-outline'} `} onClick={handleActiveFilter}>
                        Popular
                    </Button>
                    <Button className={`btn btn-primary ${filterActive !== 'Unanswered' && 'btn-outline'} `} onClick={handleActiveFilter}>
                        Unanswered
                    </Button>
                </div>
            </div>
            <Card className={'rounded-[1rem_!important] border '}>
                <Card.Body>
                    <div className='flex flex-col'>
                        <DiscussionCardLayout />
                    </div>
                </Card.Body>
            </Card>
        </>
    );
};

const DiscussingNowList = () => {
    return (
        <Card className={'border rounded-[1rem_!important] p-5 flex flex-col gap-6 max-sm:border-none'}>
            <Card.Title text='Discussing Now' />
            <Card.Body className={'flex flex-col gap-5'}>
                <ForumCardDiscussingNow />
            </Card.Body>
        </Card>
    );
};

const AddQuestion = () => {
    const { register, handleSubmit } = useForm();
    const onSubmit = (data) => {
        console.log(data);
    };

    //all filled
    const [formFilled, setFormFilled] = useState({ subject: '', question: '' });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <div className='flex flex-col md:flex-row w-full gap-4 '>
                    <div className='h-[70px] w-[70px] bg-slate-500 rounded-full'></div>
                    <div id='form-input-add-question' className='w-full'>
                        <LayoutInputLabel>
                            <input
                                {...register('title')}
                                placeholder={'Add Title'}
                                className='h-[70px] '
                                onChange={(e) => {
                                    setFormFilled({ ...formFilled, subject: e.target.value });
                                }}
                                value={formFilled.subject}
                                required
                            />
                            <textarea
                                {...register('question-text')}
                                placeholder={'Your Question'}
                                className='h-[70px]'
                                onChange={(e) => {
                                    setFormFilled({ ...formFilled, question: e.target.value });
                                }}
                                value={formFilled.question}
                                required
                            />
                        </LayoutInputLabel>
                    </div>
                </div>
                <div className='modal-action'>
                    <Modal.ModalButton className={`btn  ${formFilled.subject != '' && formFilled.question != '' ? 'btn-primary' : 'btn-disabled bg-slate-400'}`} text='Proceed Question' />
                </div>
            </div>
            <Modal onSubmit={onSubmit} />
        </form>
    );
};
//

const ForumCardDiscussingNow = ({ className = '', showDivider }) => {
    return (
        <div className={`${className} `}>
            <div className={`divider m-[0px_!important] pb-4 ${showDivider == false && 'hidden'} `}></div>
            <div className='flex justify-between items-center'>
                <div className='flex gap-4'>
                    <div id='question-information'>
                        <ForumTopicTitle />
                        <CountAnswer />
                    </div>
                </div>
            </div>
        </div>
    );
};

const DiscussionCardLayout = () => {
    return (
        <div>
            <DiscussionCard />
        </div>
    );
};

const DiscussionCard = () => {
    return (
        <Card className={'flex p-12'}>
            <Card.Body className={'flex flex-col md:flex-row gap-4'}>
                <div className='h-[200px] lg:h-[168px] w-full lg:max-w-[168px] rounded-2xl bg-slate-300'></div>
                <div className='lg:h-full flex flex-col max-lg:gap-4 lg:justify-between pt-3 pb-3'>
                    <ForumTopicTitle className={'text-2xl font-semibold leading-8'} />
                    <ForumDescription className={`text-base leading-7`} />
                    <div className='flex justify-between'>
                        <CountAnswer />
                        <GetPostTime />
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

// topic functionallity
const ForumTopicTitle = ({ className }) => {
    return <h1 className={`${className}`}>Lorem ipsum dolor sit amet consectetur adipiscing elit?</h1>;
};

const ForumDescription = ({ className }) => {
    return <p className={`${className}`}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>;
};
const CountAnswer = () => {
    return <p>117 Answer</p>;
};

const CountAllQuestion = () => {
    return <h1>1,245 questions</h1>;
};

const GetPostTime = () => {
    return <h1>1 hours ago</h1>;
};
//

export default Forum;
