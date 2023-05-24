import LayoutInputLabel from '../components/LayoutInputLabel';
import Label from './../components/Label';
import Button from './../components/Button';
import Card from './../components/Card';
import { useForm } from 'react-hook-form';
import axios from 'axios';
// import express from 'express';
import cors from 'cors';

const CardRegister = ({ inLoginPage, onStateChange }) => {
    const { register, handleSubmit } = useForm();

    //handle post with axios
    const onSubmit = (data) => {
        //headers
        const options = {
            url: 'http://localhost:3030/register',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                username: data.username,
                email: data.email,
                phone: data.phone,
                password: data.password,
                typ: data.role,
                address: data.address
            }
        };
        //data posted
        const userData = {};
        //submit data
        const submitData = async () => {
            try {
                const response = await axios.post('http://localhost:3030/register', userData, config);
                console.log(response);
            } catch (error) {
                console.log(error);
            }
        };

        submitData();
    };

    const handleChange = () => {
        onStateChange((inLoginPage) => !inLoginPage);
    };

    return (
        <Card className={'flex flex-col gap-8 sm:w-[900px] max-h-[876px] p-9 sm:p-16 rounded-3xl'}>
            <Card.Title text='Create an Account' />
            <Card.Body>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-8'>
                    <div className='flex flex-col gap-12'>
                        <div className='flex flex-col gap-6' id='input-form-style'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <LayoutInputLabel>
                                    <Label text={'Email'} />
                                    <input {...register('email')} placeholder={'Enter your email'} required />
                                </LayoutInputLabel>
                                <LayoutInputLabel>
                                    <Label text={'Username'} />
                                    <input {...register('username')} placeholder={'Enter your username'} required />
                                </LayoutInputLabel>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <LayoutInputLabel>
                                    <Label text={'Password'} />
                                    <input {...register('password')} type='password' placeholder={'Enter your password'} required />
                                </LayoutInputLabel>
                                <LayoutInputLabel>
                                    <Label text={'Phone Number'} />
                                    <input {...register('number')} type='number' placeholder={'Enter your phone number'} required />
                                </LayoutInputLabel>
                            </div>
                            <LayoutInputLabel>
                                <Label text={'Address'} />
                                <input {...register('address')} placeholder={'Enter your address'} required />
                            </LayoutInputLabel>
                            <LayoutInputLabel>
                                <Label text={'Pick Role'} />
                                <select {...register('role')} required>
                                    <option value='U'>UMKM</option>
                                    <option value='I'>Investor</option>
                                    <option value='C'>Consultant</option>
                                </select>
                            </LayoutInputLabel>
                        </div>
                        <div className='flex flex-col  gap-4 ' id='register-bottom'>
                            <Button type='submit' className={'bg-[#007DFA] text-white text-base font-medium border-none'}>
                                Create account
                            </Button>
                            <div className='divider text-base font-normal leading-5 text-[#757171]'>Or continue with</div>
                            <div className='flex justify-center'>
                                <p className='text-base text-[#BEBEBF] font-normal leading-[100%]'>
                                    Already Have An Account?{' '}
                                    <span className='text-blue-600' onClick={handleChange}>
                                        Login
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
export default CardRegister;
