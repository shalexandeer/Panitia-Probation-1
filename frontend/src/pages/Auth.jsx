import { useState } from 'react';
import CardRegister from '../components/CardRegister';
import CardLogin from '../components/CardLogin';

const Auth = () => {
    const [inLoginPage, setInLoginPage] = useState(true);
    const handleInLoginPage = (newState) => {
        setInLoginPage(newState);
    };
    return (
        <div className="h-[100vh] sm:bg-[url('./public/img/backgroundRegister.svg')] bg-no-repeat bg-cover " id='register-all-wrapper'>
            <div className='mt-24 sm:pl-6 sm:pr-6 lg:pl-[100px] lg:pr-[100px]'>
                <div className='flex justify-center  lg:justify-end'>{inLoginPage ? <CardLogin inLoginPage={inLoginPage} onStateChange={handleInLoginPage} /> : <CardRegister inLoginPage={inLoginPage} onStateChange={handleInLoginPage} />}</div>
            </div>
        </div>
    );
};

export default Auth;
