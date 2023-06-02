import { useState } from 'react';
import { useForm } from 'react-hook-form';
import AddFundingForm from '../components/AddFundingForm';
import AddConsultationServiceForm from '../components/AddConsultationForm';
import { Navigate } from 'react-router-dom';

const FundingForm = () => {
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('user')) || {});

    if (userInfo['class'] == undefined) return <Navigate to={'/auth'} />;

    return <div>{userInfo['class'] == 'C' ? <AddConsultationServiceForm /> : <AddFundingForm />}</div>;
};

export default FundingForm;
