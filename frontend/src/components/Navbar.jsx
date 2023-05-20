import { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';

const Navbar = ({ children, className }) => {
    const [sizeWindow, setSizeWindow] = useState();

    useEffect(() => {
        const handleResize = () => {
            setSizeWindow(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
    }, [sizeWindow]);

    return (
        <>
            <div className='drawer drawer-end'>
                <input id='my-drawer-3' type='checkbox' className='drawer-toggle' />
                <div className='drawer-content flex flex-col'>
                    {/* <!-- Navbar --> */}
                    <div className={`w-full navbar ${className} lg:pl-[100px] lg:pr-[100px] `}>
                        <div className='flex-1 gap-7'>
                            <div>
                                <img src={`${sizeWindow < 640 ? './public/img/logo-blue.svg' : './public/img/logo.svg'}`} alt='' />
                            </div>{' '}
                            <ul className='menu menu-horizontal navbar-wrapper gap-7 text-2xl text-white items-center hidden lg:flex'>
                                {/* <!-- Navbar menu content here --> */}

                                <li className=''>
                                    <Link to='/'>Home</Link>
                                </li>
                                <li>
                                    <Link to='/consultation'>Consultation</Link>
                                </li>
                                <li>
                                    <Link to='/fundingform'>Funding Form</Link>
                                </li>
                                <li>
                                    <Link to='/forum'>Forum</Link>
                                </li>
                            </ul>
                        </div>
                        <div className={`flex-none hidden ${location.pathname == '/auth' ? 'hidden' : 'lg:block'}`}>
                            <ul className='flex navbar-wrapper gap-7 text-2xl text-white items-center'>
                                <li>
                                    <Link to='/auth'>Login</Link>
                                </li>
                            </ul>
                        </div>
                        <div className='flex-none lg:hidden'>
                            <label htmlFor='my-drawer-3' className='btn btn-square btn-ghost'>
                                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' className='inline-block w-6 h-6 stroke-current'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h16'></path>
                                </svg>
                            </label>
                        </div>
                    </div>
                    {/* <!-- Page content here --> */}
                    {children}
                </div>
                <div className='drawer-side'>
                    <label htmlFor='my-drawer-3' className='drawer-overlay'></label>
                    <ul className='menu p-4 w-80 bg-base-100'>
                        {/* <!-- Sidebar content here --> */}
                        <li>
                            <a>Sidebar Item 1</a>
                        </li>
                        <li>
                            <a>Sidebar Item 2</a>
                        </li>
                    </ul>
                </div>
            </div>
            <Outlet />
        </>
    );
};

export default Navbar;
