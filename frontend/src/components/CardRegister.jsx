import LayoutInputLabel from '../components/LayoutInputLabel';
import Label from './../components/Label';
import Select from './../components/Select';
import Button from './../components/Button';
import Card from './../components/Card';
import { useForm } from 'react-hook-form';

const CardRegister = ({ inLoginPage, onStateChange }) => {
    const { register, handleSubmit } = useForm();
    const onSubmit = (data) => console.log(data);

    const handleChange = () => {
        onStateChange((inLoginPage) => !inLoginPage);
    };

    return (
        <Card className={'flex flex-col gap-8'}>
            <Card.Title text='Create an Account' />
            <Card.Body>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-8'>
                    <div className='flex flex-col gap-12'>
                        <div className='flex flex-col gap-6' id='input-form-style'>
                            <LayoutInputLabel>
                                <Label text={'Email'} />
                                <input {...register('email')} placeholder={'Enter your email'} />
                            </LayoutInputLabel>
                            <LayoutInputLabel>
                                <Label text={'Username'} />
                                <input {...register('username')} placeholder={'Enter your username'} />
                            </LayoutInputLabel>
                            <LayoutInputLabel>
                                <Label text={'Password'} />
                                <input {...register('password')} type='password' placeholder={'Enter your password'} />
                            </LayoutInputLabel>
                            <LayoutInputLabel>
                                <Label text={'Phone Number'} />
                                <input {...register('number')} type='number' placeholder={'Enter your phone number'} />
                            </LayoutInputLabel>
                            <LayoutInputLabel>
                                <Label text={'Pick Role'} />
                                <select {...register('Role')}>
                                    <option value='female'>female</option>
                                    <option value='male'>male</option>
                                    <option value='other'>other</option>
                                </select>
                            </LayoutInputLabel>
                        </div>
                        <div className='flex flex-col  gap-4 ' id='register-bottom'>
                            <Button type='submit' className={'bg-[#007DFA] text-white text-base font-medium'}>
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
