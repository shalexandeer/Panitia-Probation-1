import LayoutInputLabel from '../components/LayoutInputLabel';
import Label from './../components/Label';
import Button from './../components/Button';
import Card from './../components/Card';
import { useForm } from 'react-hook-form';

const CardLogin = ({ onStateChange }) => {
    const { register, handleSubmit } = useForm();
    const onSubmit = (data) => console.log(data);

    const handleChange = () => {
        onStateChange((inLoginPage) => !inLoginPage);
    };

    return (
        <Card className={'flex flex-col gap-8 sm:border mt-10'}>
            <Card.Title text='Login to your account' />
            <Card.Body>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-8'>
                    <div className='flex flex-col gap-6'>
                        <div className='flex flex-col gap-4'>
                            <div className='flex flex-col gap-6' id='input-form-style'>
                                <LayoutInputLabel>
                                    <Label text={'Email'} />
                                    <input {...register('email')} placeholder={'Enter your email'} />
                                </LayoutInputLabel>
                                <LayoutInputLabel>
                                    <Label text={'Password'} />
                                    <input {...register('password')} type='password' placeholder={'Enter your password'} />
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
                        <div className='flex flex-col gap-6' id='register-bottom'>
                            <Button type='submit' className={'bg-[#007DFA] text-white text-base font-medium'}>
                                Login
                            </Button>
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
