import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {
    console.log(location.pathname);
    return <h1>page home</h1>;
};

export default Home;
