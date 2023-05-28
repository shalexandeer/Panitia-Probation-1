import { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';

const Navbar = ({ children, className }) => {
    //get window size
    const [sizeWindow, setSizeWindow] = useState();

    useEffect(() => {
        const handleResize = () => {
            setSizeWindow(window.innerWidth);
            //console.log(sizeWindow);
        };
        window.addEventListener('resize', handleResize);
    }, [sizeWindow]);

    //get page pathname
    const path = location.pathname;
    return (
        <>
            <div className='drawer drawer-end'>
                <input id='my-drawer-3' type='checkbox' className='drawer-toggle' />
                <div className={`drawer-content flex flex-col`}>
                    {/* <!-- Navbar --> */}
                    <div className={`${path == '/auth' ? 'bg-transparent' : 'bg-white border-b-[0.5px]'}`}>
                        <div className={`container mx-auto   `}>
                            <div className={`w-full navbar-new min-h-[none_!important] ${className} p-5 xl:p-[1.25rem_0_1.25rem_0]   `}>
                                <div className='flex-1 gap-7'>
                                    <div>
                                        <Link to={'/'}>
                                            <img src={`${sizeWindow < 640 || path != '/auth' ? './public/img/logo-blue.svg' : './public/img/logo.svg'}`} alt='' />
                                        </Link>
                                    </div>{' '}
                                    <ul className={`menu menu-horizontal navbar-wrapper gap-7 text-lg ${path == '/auth' ? 'text-white' : 'text-[#111827]'} items-center hidden lg:flex`} id='navbar-items'>
                                        {/* <!-- Navbar menu content here --> */}
                                        <li className={`${path == '/' && 'activeLink'}`}>
                                            <Link to='/'>Home</Link>
                                        </li>
                                        <li className={`${path == '/consultation' && 'activeLink'}`}>
                                            <Link to='/consultation'>Consultation</Link>
                                        </li>
                                        <li className={`${path == '/fundingform' && 'activeLink'}`}>
                                            <Link to='/fundingform'>Funding Form</Link>
                                        </li>
                                        <li className={`${path == '/forum' && 'activeLink'}`}>
                                            <Link to='/forum'>Forum</Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className={`flex-none hidden ${location.pathname == '/auth' ? 'hidden' : 'lg:block'}`}>
                                    <Link to='/auth'>
                                        {' '}
                                        <button className='btn btn-xs sm:btn-sm md:btn-md lg:btn-lg bg-[#1496FF] border-none text-white'>Login</button>
                                    </Link>
                                </div>
                                <div className='flex-none lg:hidden'>
                                    <label htmlFor='my-drawer-3' className='btn btn-square btn-ghost'>
                                        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' className='inline-block w-6 h-6 stroke-current'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h16'></path>
                                        </svg>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <!-- Page content here --> */}
                    {children}
                </div>
                <div className='drawer-side'>
                    <label htmlFor='my-drawer-3' className='drawer-overlay'></label>
                    <ul className='menu p-4 w-80 bg-base-100'>
                        {/* <!-- Sidebar content here --> */}

                        <li className={`${path == '/' && 'activeLink'}`}>
                            <Link to='/'>Home</Link>
                        </li>
                        <li className={`${path == '/consultation' && 'activeLink'}`}>
                            <Link to='/consultation'>Consultation</Link>
                        </li>
                        <li className={`${path == '/fundingform' && 'activeLink'}`}>
                            <Link to='/fundingform'>Funding Form</Link>
                        </li>
                        <li className={`${path == '/forum' && 'activeLink'}`}>
                            <Link to='/forum'>Forum</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <Outlet />
        </>
    );
};

export default Navbar;
