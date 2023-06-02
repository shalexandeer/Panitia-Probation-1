import axios from 'axios';
import { useForm } from 'react-hook-form';

const AddConsultationServiceForm = () => {
    const { register, handleSubmit } = useForm();
    const onSubmit = (data) => {
        console.log(data);
        axios
            .post(
                '/api/create_consultationoffer',
                {
                    title: data.title,
                    category: data.category,
                    description: data.description,
                    nominal: Number(data.price),
                    duration: Number(data.duration)
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                }
            )
            .then((resp) => {
                console.log(resp.data);
            })
            .catch((e) => console.log(e));
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1 className='Consultation_form'>Consultation Form</h1>
            <div className='mainPanel'>
                <div className='leftPanel'>
                    <p>Title</p>
                    <input {...register('title')} className='title_input' type='text' placeholder='Business Consultation' name='title' required />
                    <p>Description</p>
                    <textarea {...register('description')} className='description_input' placeholder='Enter Description'></textarea>
                    <p>Category</p>
                    <select className='Category_select' {...register('category')}>
                        <option value=''>Select Category</option>
                        <option value='Food & Baverage'>Food & Baverage</option>
                        <option value='Retail'>Retail</option>
                        <option value='Fashion'>Fashion</option>
                        <option value='Automotive'>Automotive</option>
                    </select>
                </div>
                <div className='rightPanel'>
                    <p>Consultant's name</p>
                    <input {...register('name')} className='Consultants_name_input' type='text' placeholder="Enter Consultant's name" name='name' required />
                    <p>Price</p>
                    <input {...register('price')} className='Price_input' type='number' placeholder='Enter price' name='price' required />
                    <p>Duration</p>
                    <input {...register('duration')} className='Duration_input' type='number' placeholder='Enter Duration' name='duration' required />
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

export default AddConsultationServiceForm;
