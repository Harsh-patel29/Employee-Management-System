import React from 'react';
import { Link } from 'react-router';
import { FiPlus } from 'react-icons/fi';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { CgProfile } from 'react-icons/cg';
import { GiSettingsKnobs } from 'react-icons/gi';
import { BsClock } from 'react-icons/bs';
import { CiCircleInfo } from 'react-icons/ci';
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

const NavBar = () => {
  const navigate = useNavigate();
  const handlelogout = async () => {
    const res = await axios.post(
      'http://localhost:8000/api/v1/user/logout',
      {},
      { withCredentials: true }
    );
    if (res.data.statusCode === 200) {
      navigate('/login');
      localStorage.removeItem('active');
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
      style={{ top: 0, position: 'sticky', zIndex: '50' }}
      className=" bg-white w-full sm:w-full flex flex-row  text-white h-20 border border-white shadow"
    >
      <Link to="/dashboard">
        <img
          src="https://ems.jiyantech.com/assets/imgs/theme/logo.png"
          className="xl:h-13 xl:w-50 xl:mt-2.5 xl:ml-12 max-sm:w-70 max-sm:h-10 max-sm:p-0.5 max-sm:ml-2 max-sm:mt-3 flex items-center lg:h-15 lg:w-50 lg:p-1 lg:ml-2 lg:mt-2 md:h-16 md:w-45 md:ml-2 md:p-1 md:mt-2 sm:h-17 sm:w-50 sm:p-2 sm:mt-1"
        />
      </Link>
      <div
        className={`flex items-center xl:w-full lg:w-full md:w-full sm:w-full max-sm:w-full  justify-end mr-10 space-x-11 `}
      >
        <div className="text-black">
          <FiPlus size={26} style={{ fontWeight: 'bold' }} />
        </div>
        <div className="text-black">
          <IoMdNotificationsOutline size={26} />
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
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
              <DropdownMenuItem>
                <CgProfile />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <GiSettingsKnobs />
                Preferences
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BsClock />
                Last Viewed
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CiCircleInfo />
                About
              </DropdownMenuItem>
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
