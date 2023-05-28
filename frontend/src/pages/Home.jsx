import Button from '../components/Button';
import axios from 'axios';
import { useEffect, useState } from 'react';

const Home = () => {
    const [listData, setListData] = useState([]);

    useEffect(() => {
        //misalkan seorang user sudah login, token loginnya ini (mungkin ada di localStorage)
        //token ini expire sekitar 2 jam setelah login
        const token = 'eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOiIxNjg1MjMyNjI3IiwiaWQiOiI1In0.xoiYsSHrh9GAP_OfZePaqJx-VWbrhL7lsoLpQYKpB8E';

        // dari token di atas (yang expirenya lama), karena beberapa alasan, kita
        // akan membuat token baru, yang expirenya cepat, namanya "flash_token"
        axios
            .get('/api/konsultasi_flash_auth', {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
            .then((resp) => {
                const flash_token = resp.data['token'];

                const konsultasi_id = 1; // ini bisa dapet dari /api/list_konsultasi

                // menggunakan endpoint /api/live_konsultasi/<konsultasi_id>?token=<flash_token>, kita
                // terhubung dengan sumber event baru
                const sse = new EventSource('/api/live_konsultasi/' + String(konsultasi_id) + '?token=' + encodeURI(flash_token));

                // ada namanya event "receive" yaitu jika suatu user send message pada chat konsultasi
                sse.addEventListener('receive', (e) => {
                    console.log('halo');
                    setListData((old) => [...old, JSON.parse(e.data)]);
                });
            });
    }, []);

    return (
        <div className='flex flex-col'>
            <div className='grid place-items-center h-screen pl-5 pr-5 sm:pl-6 sm:pr-6 xl:pl-[100px] xl:pr-[100px]' id='home-landing-page'>
                <div className='flex flex-col justify-center items-center gap-7 container mx-auto'>
                    <pre>listData = {JSON.stringify(listData)}</pre>
                    <h1 className='text-center leading-10 sm:leading-[3.75rem] home-heading font-semibold'>
                        Welcome to Fundify <br className='hidden md:block' /> consult your business now!
                    </h1>
                    <p className='text-center max-w-[1054px] font-normal text-lg text-[#6B7280] leading-6 md:leading-7 home-hero-paragraph'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    <div id='call-to-action-wrapper' className='flex flex-col md:flex-row items-center gap-7'>
                        <Button className={'bg-[#1496FF] text-white border-none text-xl'}>Consult now</Button>
                        <p className='font-semibold text-xl text-[#111827] leading-7'>Learn more</p>
                    </div>
                </div>
            </div>
            {/* <div className='h-[200px] bg-black'></div> */}
        </div>
    );
};

export default Home;
