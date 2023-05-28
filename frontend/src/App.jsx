import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import Auth from './pages/Auth';
import FundingForm from './pages/FundingForm';
import Forum from './pages/Forum';
import Consultation from './pages/Consultation';
import Navbar from './components/Navbar';
import Payment from './pages/Payment';
import Chat from './pages/Chat';
import Home from './pages/Homepage/Home';
import Footer from './components/Footer';

function App() {
    const location = useLocation().pathname;
    console.log(location);
    return (
        <div className=''>
            <Navbar className={`${location === '/auth' ? 'fixed' : ''}`}>
                <Routes>
                    <Route path='/' element={<Home />} location={location} />
                    <Route path='auth' element={<Auth />} location={location} />
                    <Route path='consultation' element={<Consultation />} location={location} />
                    <Route path='fundingform' element={<FundingForm />} location={location} />
                    <Route path='forum' element={<Forum />} />
                    <Route path='payment' element={<Payment />} />
                    <Route path='chat' element={<Chat />} />
                </Routes>
                {location == '/chat' || location == '/forum' || location == '/auth' ? '' : <Footer />}
            </Navbar>
        </div>
    );
}

export default App;
