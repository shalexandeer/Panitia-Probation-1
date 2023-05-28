import LayoutInputLabel from '../components/LayoutInputLabel';
import Label from './../components/Label';
import Button from './../components/Button';
import Card from './../components/Card';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const CardLogin = ({ onStateChange }) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [loadingButton, setLoadingButton] = useState(false);
    const [statusCode, setStatusCode] = useState(0);

    const { register, handleSubmit } = useForm();

    const navigate = useNavigate();

    function refreshPage() {
        window.location.reload(false);
    }

    const onSubmit = (data) => {
        axios
            .post(
                '/api/login',
                {
                    email: data.email,
                    password: data.password
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            .then((resp) => {
                console.log(resp.data);
                localStorage.setItem('token', resp.data['token']);
                setStatusCode(resp.status);
                setLoadingButton(false);
            });
        console.log(data);
        setTimeout(() => refreshPage(), 300);
    };

    const handleChange = () => {
        onStateChange((inLoginPage) => !inLoginPage);
    };
    // navigate to home
    if (statusCode == 200) return <Navigate replace to={'/'} />;
    //end of navigate to home

    return (
        <Card className={'flex flex-col gap-8 sm:border mt-10 sm:w-[531px] max-h-[876px] p-9 sm:p-16 rounded-3xl'}>
            <Card.Title text='Login to your account' />
            <Card.Body>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-8'>
                    <div className='flex flex-col gap-6'>
                        <div className='flex flex-col gap-4'>
                            <div className='flex flex-col gap-6' id='input-form-style'>
                                <LayoutInputLabel>
                                    <Label text={'Email'} />
                                    <input {...register('email')} placeholder={'Enter your email'} required />
                                </LayoutInputLabel>
                                <LayoutInputLabel>
                                    <Label text={'Password'} />
                                    <input {...register('password')} type='password' placeholder={'Enter your password'} required />
                                </LayoutInputLabel>
                            </div>
                            <div className='flex justify-between items-center'>
                                <div className='form-control'>
                                    <label className='label cursor-pointer gap-4'>
                                        <input type='checkbox' className='checkbox' />
                                        <span className='label-text'>Remember me</span>
                                    </label>
                                </div>
                                <p className='text-[#1496FF] font-medium text-sm'>Forgot password?</p>
                            </div>
                        </div>
                        <div className={`justify-end ${errorMessage == '' ? 'hidden' : 'flex'} `}>
                            <p className='text-error capitalize'>{errorMessage}</p>
                        </div>
                        <div className='flex flex-col gap-6' id='register-bottom'>
                            <button type='submit' className={`btn h-full btn-primary  text-white text-base font-medium border-none w-full`}>
                                {!loadingButton ? 'Login' : <Loading />}
                            </button>

                            <div className='divider text-base font-normal leading-5 text-[#757171]'>Or continue with</div>
                            <div className='flex justify-center'>
                                <p className='text-base text-[#BEBEBF] font-normal leading-[100%]'>
                                    Already Have An Account?{' '}
                                    <span className='text-blue-600' onClick={handleChange}>
                                        Register
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </Card.Body>
        </Card>
    );
};

export default CardLogin;
