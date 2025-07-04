import React from 'react';
import { Link } from 'react-router';
import { IoExitOutline } from 'react-icons/io5';
import { FaUser } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../Components/components/ui/dropdown.tsx';
import axios from 'axios';
import HamburgerController from '../Components/HamBurgerComponent.jsx';
const NavBar = () => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const navigate = useNavigate();
  const handlelogout = async () => {
    const res = await axios.post(
      'http://localhost:8000/api/v1/user/logout',
      {},
      { withCredentials: true }
    );
    if (res.data.statusCode === 200) {
      navigate('/login');
      localStorage.setItem('val', 'Dashboard');
      localStorage.removeItem('viewMode');
    }
  };

  const theme = useSelector((state) => state.theme.theme);

  const { user, loading } = useSelector((state) => state.auth);
  if (loading) return <p>Loading...</p>;
  const value = localStorage.getItem('theme');
  return (
    <div
      style={{ top: 0, left: 0, position: 'fixed', zIndex: '50' }}
      className=" bg-white w-full sm:w-full flex flex-row  text-white h-20 border border-white shadow"
    >
      {isMobile ? (
        <HamburgerController onClick={toggleSidebar} />
      ) : (
        <Link to="/dashboard" className="focus:outline-none">
          <img
            src="https://ems.jiyantech.com/assets/imgs/theme/logo.png"
            className="xl:h-13 xl:w-50 xl:mt-2.5 xl:ml-12 max-sm:w-70 max-sm:h-10 max-sm:p-0.5 max-sm:ml-2 max-sm:mt-3 flex items-center lg:h-15 lg:w-50 lg:p-1 lg:ml-2 lg:mt-2 md:h-16 md:w-45 md:ml-2 md:p-1 md:mt-2 sm:h-17 sm:w-50 sm:p-2 sm:mt-1 focus:outline-none"
          />
        </Link>
      )}
      <div
        className={`flex items-center xl:w-full lg:w-full md:w-full sm:w-full max-sm:w-full  justify-end mr-10 space-x-11`}
      >
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none focus:ring-1 focus:ring-[#0000] rounded-2xl">
              <div
                className={`
                  ${theme === 'light' ? 'bg-[#64B2D559]' : 'bg-[#1e2939] '}
                  flex flex-row border h-8 w-auto border-black pr-[0.5rem] rounded-2xl  cursor-pointer `}
              >
                <div className="text-black  flex space-x-2.5 items-center">
                  <FaUser size={26} className="ml-2" />
                  <h1 className="text-sm">
                    {user?.user?.Name ? (
                      <p>{user.user.Name}</p>
                    ) : (
                      <p>Loading...</p>
                    )}
                  </h1>
                  <img
                    src="https://www.svgrepo.com/show/80156/down-arrow.svg"
                    className="h-6 w-3"
                    alt=""
                  />
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handlelogout}>
                <IoExitOutline />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
