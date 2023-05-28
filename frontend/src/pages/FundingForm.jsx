import { useForm } from 'react-hook-form';

const FundingForm = () => {
    const { register, handleSubmit } = useForm();
    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <h1>nafas</h1>
        // <div>
        //     <form onSubmit={handleSubmit(onSubmit)}>
        //         <h1 className='Funding_forum'>Funding Form</h1>
        //         <div className='mainPanel'>
        //             <div className='leftPanel'>
        //                 <p>Company Name</p>
        //                 <input {...register('company')} className='Company_name_input' type='text' placeholder='Senjani Nathania' name='companyName' required />
        //                 <p>Category</p>
        //                 <select className='Category_select' {...register('category')}>
        //                     <option value=''>Select Category</option>
        //                     <option value='Food & Baverage'>Food & Baverage</option>
        //                     <option value='Retail'>Retail</option>
        //                     <option value='Fashion'>Fashion</option>
        //                     <option value='Automotive'>Automotive</option>
        //                 </select>
        //                 <p>Company Address</p>
        //                 <input {...register('address')} className='Company_address_input' type='text' placeholder='Enter Company Address' name='companyAddress' required />
        //                 <p>Phone Number</p>
        //                 <p>
        //                     <input className='Phone_number_input' type='number' placeholder='Enter phone number' name='phoneNumber' required />
        //                 </p>
        //             </div>
        //             <div className='rightPanel'>
        //                 <p>Company Email</p>
        //                 <input {...register('email')} className='Company_email_input' type='email' placeholder='Enter Company Email' name='companyEmail' required />
        //                 <p>Nominal</p>
        //                 <input {...register('nominal')} className='Nominal_input' type='number' placeholder='Enter nominal' name='nominal' required />
        //                 <p>Objective</p>
        //                 <input {...register('objective')} className='Objective_input' type='text' placeholder='Enter objective' name='objective' required />
        //                 <p>Estimation</p>
        //                 <input {...register('estimation')} className='Estimation_input' type='number' placeholder='Enter estimation' name='estimation' required />
        //                 {/* <p>Thumbnail</p>
        //                 <div className='thumbnail'>
        //                     <div className='drag_area'>
        //                         <div className='icon'>
        //                             <img src='photo/img.png' alt='file logo' />
        //                         </div>
        //                         <span className='header1'>
        //                             Drop your file here,or <span className='button'>browse</span>
        //                         </span>
        //                         <span className='support'>Support: PDF</span>
        //                     </div>
        //                 </div> */}
        //                 <div className='submit'>
        //                     <button className='fundingSubmission' type='submit' href=''>
        //                         Submit Form
        //                     </button>
        //                 </div>
        //             </div>
        //         </div>
        //     </form>
        // </div>
    );
};

export default FundingForm;
