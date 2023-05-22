import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import Auth from './pages/Auth';
import Home from './pages/Home';
import FundingForm from './pages/FundingForm';
import Forum from './pages/Forum';
import Consultation from './pages/Consultation';
import Navbar from './components/Navbar';
import Payment from './pages/Payment';

function App() {
    const location = useLocation().pathname;
    return (
        <div className=''>
            <Navbar className={`${location === '/auth' ? 'absolute' : ''}`}>
                <Routes>
                    <Route path='/' element={<Home />} location={location} />
                    <Route path='auth' element={<Auth />} location={location} />
                    <Route path='consultation' element={<Consultation />} location={location} />
                    <Route path='fundingform' element={<FundingForm />} location={location} />
                    <Route path='forum' element={<Forum />} />
                    <Route path='payment' element={<Payment />} />
                </Routes>
            </Navbar>
        </div>
    );
}

export default App;
