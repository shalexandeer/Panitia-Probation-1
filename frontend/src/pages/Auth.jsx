import { useState } from 'react';
import CardRegister from '../components/CardRegister';
import CardLogin from '../components/CardLogin';
import Toast from '../components/Toast';

const Auth = () => {
    const [inLoginPage, setInLoginPage] = useState(true);
    const handleInLoginPage = (newState) => {
        setInLoginPage(newState);
    };

    const [toastSuccess, setToastSuccess] = useState(false);
    const callbackToast = (e) => setToastSuccess(e);

    return (
        <div className="h-[100vh] sm:bg-[url('./public/img/backgroundRegister.svg')] bg-no-repeat bg-cover " id='register-all-wrapper'>
            <div className='h-full flex justify-center lg:justify-end items-center  sm:pl-6 sm:pr-6 lg:pl-[100px] lg:pr-[100px]'>
                <div className='flex justify-center lg:justify-end w-full'>{inLoginPage ? <CardLogin inLoginPage={inLoginPage} onStateChange={handleInLoginPage} /> : <CardRegister callbackToast={callbackToast} handleInLoginPage={handleInLoginPage} onStateChange={handleInLoginPage} />}</div>
            </div>
            {toastSuccess && <Toast />}
        </div>
    );
};

export default Auth;
