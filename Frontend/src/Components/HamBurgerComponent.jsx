import { useState, useEffect } from 'react';
import {
  notVisible,
  visible,
} from '../feature/ToggelSideBar/ToggleSideBarSlice.js';
import { useSelector, useDispatch } from 'react-redux';

export default function HamburgerController({ isOpen, onClick }) {
  const [isMobile, setIsMobile] = useState(false);
  const isVisible = useSelector((state) => state.Sidebar.visible);
  const dispatch = useDispatch();
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <button
      onClick={() => {
        onClick;
        dispatch(isVisible ? notVisible() : visible());
      }}
      className="ml-8 h-[50%] mt-5 rounded-md hover:bg-blue-100 flex justify-center items-center w-20 focus:outline-none bg-blue-100 shadow-none"
      aria-label="Toggle sidebar"
    >
      {isOpen ? (
        <></>
      ) : (
        <>
          <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 512 512"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: 'var(--THEME-COLOR)' }}
          >
            <path
              fill="none"
              stroke-linecap="round"
              stroke-miterlimit="10"
              stroke-width="48"
              d="M88 152h336M88 256h336M88 360h336"
            ></path>
          </svg>
        </>
      )}
    </button>
  );
}
