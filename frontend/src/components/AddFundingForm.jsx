import { useForm } from 'react-hook-form';
import LayoutInputLabel from './LayoutInputLabel';
import Label from './Label';

const AddFundingForm = () => {
    const { register, handleSubmit } = useForm();
    const onSubmit = (data) => {
        console.log(data);
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1 className='Funding_forum'>Funding Form</h1>
            <div className='mainPanel'>
                <div className='leftPanel'>
                    <LayoutInputLabel>
                        <Label text={'Company Name'} />
                        <input {...register('company')} placeholder={'Enter company name'} required />
                    </LayoutInputLabel>
                    <p>Category</p>
                    <select className='Category_select' {...register('category')} required>
                        <option value=''>Select Category</option>
                        <option value='Food & Baverage'>Food & Baverage</option>
                        <option value='Retail'>Retail</option>
                        <option value='Fashion'>Fashion</option>
                        <option value='Automotive'>Automotive</option>
                    </select>
                    <LayoutInputLabel>
                        <Label text={'Company Address'} />
                        <input {...register('address')} placeholder={'Enter Company Address'} required />
                    </LayoutInputLabel>
                    <LayoutInputLabel>
                        <Label text={'Phone Number'} />
                        <input {...register('phone')} placeholder={'Enter Phone Number'} required />
                    </LayoutInputLabel>
                    <p>Bussiness Plan</p>
                    <div className='bussines'>
                        <div className='drag_area'>
                            <input type='file' required />
                            <span className='header1'>
                                Drop your file here,or <span className='button'>browse</span>
                            </span>
                            <span className='support'>Support: PDF</span>
                        </div>
                    </div>
                </div>
                <div className='rightPanel'>
                    <LayoutInputLabel>
                        <Label text={'Company Email'} />
                        <input {...register('companyemail')} placeholder={'Enter Phone Number'} type='email' required />
                    </LayoutInputLabel>
                    <p>Nominal</p>
                    <input {...register('nominal')} className='Nominal_input' type='number' placeholder='Enter nominal' name='nominal' required />
                    <p>Objective</p>
                    <input {...register('objective')} className='Objective_input' type='text' placeholder='Enter objective' name='objective' required />
                    <p>Estimation</p>
                    <input {...register('estimation')} className='Estimation_input' type='number' placeholder='Enter estimation' name='estimation' required />
                    <div className='submit'>
                        <button className='fundingSubmission' type='submit' href=''>
                            Submit Form
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default AddFundingForm;
