import Heading from './Heading';

const Sidebar = ({ children, className }) => {
    return (
        <div className='drawer drawer-mobile'>
            <input id='my-drawer-2' type='checkbox' className='drawer-toggle' />
            <DashboardMenu>{children}</DashboardMenu>
            <div className='drawer-side'>
                <Navigation />
            </div>
        </div>
    );
};

const Navigation = ({}) => {
    return (
        <>
            <label htmlFor='my-drawer-2' className='drawer-overlay'></label>
            <div className='menu p-6 w-[295px] bg-base-100 text-base-content'>
                {/* <!-- Sidebar content here --> */}
                <div className='logo-container mt-5 flex justify-center items-center gap-4 mb-[56px]'>
                    <img src='./src/assets/Logo-Nugas.svg' alt='' />
                    <h1 className='logo-heading '>TaskSpace</h1>
                </div>
                <Heading.SecondHeading text={'Daily use'} />
                <div className='sidebar-active hover:bg-blue-100  duration-200 cursor-pointer mt-[16px] p-[12px] rounded-[16px] gap-[18px]'>
                    <img className='w-[24px] h-[24px]' src='./src/assets/icons-overview.svg' alt='' />
                    <a>Overview</a>
                </div>
                <li>
                    <a>Sidebar Item 2</a>
                </li>
            </div>
        </>
    );
};

const DashboardMenu = ({ children, className }) => {
    return (
        <div className='drawer-content '>
            {/* <!-- Page content here --> */}
            <label htmlFor='my-drawer-2' className='btn btn-primary drawer-button lg:hidden'>
                Open drawer
            </label>
            <div className={`${className}`}>{children}</div>
            {/* <!-- end of Page content here --> */}
        </div>
    );
};
Sidebar.DashboardMenu = DashboardMenu;

export default Sidebar;
