import React, { act, use, useState } from 'react';
import { Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import {
  collapedSideBar,
  expandSideBar,
  notVisible,
  visible,
} from '../feature/ToggelSideBar/ToggleSideBarSlice.js';

import { checkAuth } from '../feature/datafetch/datafetchSlice.js';

const Navigation = () => {
  const [dropdown, setdropdown] = useState(false);
  const [active, setActive] = useState(() => {
    return localStorage.getItem('active') || 'Dashboard';
  });
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    {
      id: 1,
      key: 'Dashboard',
      name: 'Dashboard',
      style: ' rounded-tr-[10px]',
      icon: (
        <svg
          stroke="currentColor"
          fill="none"
          stroke-width="2"
          viewBox="0 0 24 24"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="active-nav-icons "
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M4 18v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-12a2 2 0 0 1-2 -2z"></path>
          <path d="M7 14l3 -3l2 2l3 -3l2 2"></path>
        </svg>
      ),
    },
    {
      id: 2,
      key: 'Productivity',
      name: 'Productivity',
      icon: (
        <svg
          stroke="currentColor"
          fill="currentColor"
          stroke-width="0"
          viewBox="0 0 24 24"
          class="nav-icons"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="none"
            stroke-width="2"
            d="M9,15 L9,23 L1,23 L1,15 L9,15 Z M23,15 L23,23 L15,23 L15,15 L23,15 Z M9,1 L9,9 L1,9 L1,1 L9,1 Z M23,1 L23,9 L15,9 L15,1 L23,1 Z"
          ></path>
        </svg>
      ),
      children: [
        {
          key: 'project',
          name: 'Projects',
          link: 'productivity/project',
        },
        { key: 'tasks', name: 'Tasks', link: 'productivity/tasks' },
        {
          key: 'task timer',
          name: 'Task Timer',
          link: 'productivity/taskTimer',
        },
      ],
    },
    {
      id: 3,
      key: 'Attendance',
      name: 'Attendance',
      icon: (
        <svg
          stroke="currentColor"
          fill="currentColor"
          stroke-width="0"
          viewBox="0 0 24 24"
          class="nav-icons"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path fill="none" d="M0 0h24v24H0V0z"></path>
          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"></path>
        </svg>
      ),
      children: [
        {
          key: 'attendance',
          name: 'Attendance',
          link: 'attendance',
        },
        {
          key: 'Regularization',
          name: 'Regularization',
          link: 'attendance/regularization',
        },
        {
          key: 'Missed punch Regularization',
          name: 'Missed punch Regularization',
          link: 'attendance/missedPunchRegularization',
        },
        {
          key: 'Monthly_Report',
          name: 'Monthly Report',
          link: 'attendance/monthlyReport',
        },
      ],
    },
    {
      id: 4,
      key: 'Leave',
      name: 'Leave',
      icon: (
        <svg
          stroke="currentColor"
          fill="currentColor"
          stroke-width="0"
          viewBox="0 0 24 24"
          class="nav-icons"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path fill="none" d="M0 0h24v24H0z"></path>
          <path d="M17 10H7v2h10v-2zm2-7h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19a2 2 0 002 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zm-5-5H7v2h7v-2z"></path>
        </svg>
      ),
      children: [
        {
          key: 'leave',
          name: 'Leave',
          link: 'leave',
        },
        {
          key: 'leaveType',
          name: 'Leave Type',
          link: 'leave/leaveType',
        },
        {
          key: 'PendingLeave',
          name: 'Pending Leave',
          link: 'leave/leaveApprove',
        },
      ],
    },
    {
      id: 5,
      key: 'Master',
      name: 'Master',
      icon: (
        <svg
          stroke="currentColor"
          fill="none"
          stroke-width="2"
          viewBox="0 0 24 24"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="nav-icons"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"></path>
        </svg>
      ),
      children: [
        {
          key: 'Holiday',
          name: 'Holiday',
          link: 'master/holiday',
        },
        { key: 'Weekoff', name: 'Weekoff', link: 'master/weekoff' },
      ],
    },
    {
      id: 6,
      key: 'Users',
      name: 'Users',
      icon: (
        <svg
          stroke="currentColor"
          fill="none"
          stroke-width="2"
          viewBox="0 0 24 24"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="nav-icons"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
    },
    {
      id: 7,
      key: 'Settings',
      name: 'Settings',
      icon: (
        <svg
          stroke="currentColor"
          fill="none"
          stroke-width="2"
          viewBox="0 0 24 24"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="nav-icons"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="3"></circle>

          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      ),
    },
  ];

  const hasPermission = (user, subItem) => {
    const permissionMap = {
      leaveType: { category: 'leave', permission: 'canManageLeaveStatus' },
      PendingLeave: { category: 'leave', permission: 'canViewAllPendingLeave' },
      Regularization: {
        category: 'Attendance',
        permission: user.user?.role === 'Admin',
      },
      Monthly_Report: {
        category: 'Attendance',
        permission: user.user?.role === 'Admin',
      },
    };

    const permissionInfo = permissionMap[subItem.key];
    if (!permissionInfo) return true;

    return (
      (user.permission &&
        user.permission[permissionInfo.category] &&
        user.permission[permissionInfo.category][permissionInfo.permission]) ||
      (user.user.role === 'Admin') === true
    );
  };

  const dispatch = useDispatch();
  const isExpanded = useSelector((state) => state.Sidebar.isExpanded);
  const isVisible = useSelector((state) => state.Sidebar.visible);

  const [value, setValue] = useState(() => {
    return localStorage.getItem('val') || 'Dashboard';
  });

  React.useEffect(() => {
    localStorage.setItem('val', value);
  }, [value]);

  React.useEffect(() => {
    localStorage.setItem('active', active);
  }, [active]);

  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  React.useEffect(() => {
    dispatch(!isMobile ? visible() : notVisible());
    if (!isMobile) {
      dispatch(visible());
    }
  }, [isMobile]);

  return (
    <div
      style={{ position: 'absolute', zIndex: '50 ' }}
      className={`${!isMobile || isVisible ? 'flex' : 'hidden'} `}
    >
      <nav
        className={`${isExpanded ? 'rounded-none' : 'rounded-tr-[10px]'} transform transition-all translate-x-0 duration-45 delay-0 w-[114px] left-0 top-[78px]  rounded-br-[10px] rounded-bl-[10px] shadow-[4px_11px_12px_#8a8f93b8] bg-[#fff] h-[100vh] fixed z-[11] border-r-[solid] border-r-[1px]`}
      >
        <ul
          className="max-h-[calc(100vh-70px)] list-none block mx-0"
          style={{ unicodeBidi: 'isolate' }}
        >
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`${item.style} ${
                active === item.key
                  ? 'bg-[rgba(178,223,244,0.643)] border-l-[4px] border-l-[rgb(51,141,181)]'
                  : ''
              }
              relative box-border list-item h-[80px] w-full font-[400px] border-b-[0.8px] pt-[14px] 
              `}
              onClick={() => {
                setActive(item.key);
                setValue(item.key);
                if (!item.children) {
                  dispatch(collapedSideBar());
                }
                if (item.name == active && item.children) {
                  dispatch(isExpanded ? collapedSideBar() : expandSideBar());
                }
              }}
            >
              {item.children ? (
                <div
                  className="block items-center text-[16px] text-[rgb(40,42,43)] font-[sans-serif,Inter] text-center cursor-pointer "
                  onClick={() => {
                    dispatch(
                      isExpanded && !item.children
                        ? collapedSideBar()
                        : expandSideBar()
                    );
                  }}
                >
                  <div className="flex flex-col gap-y-1.5">
                    <div
                      className={`flex w-full justify-center items-center h-[26px] text-[28px]`}
                      style={{
                        color:
                          active === item.key
                            ? 'rgb(51,141,181)'
                            : 'rgb(126, 126, 126)',
                      }}
                    >
                      {item.icon}
                    </div>
                    <span
                      className={`${
                        active === item.key ? 'text-[rgb(51,141,181)]' : ''
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>
                </div>
              ) : (
                <div>
                  <Link
                    to={`/${item.key}`}
                    className="
                    block items-center justify-center w-full text-[16px] text-[rgb(40,42,43)] font-[sans-serif,Inter] text-center"
                  >
                    <div className="flex flex-col gap-1.5">
                      <div
                        className={`flex w-full justify-center items-center h-[26px] text-[28px] `}
                        style={{
                          color:
                            active === item.key
                              ? 'rgb(51,141,181)'
                              : 'rgb(126, 126, 126)',
                        }}
                      >
                        {item.icon}
                      </div>
                      <span
                        className={`${
                          active === item.key ? 'text-[rgb(51,141,181)]' : ''
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>
                  </Link>
                </div>
              )}
              {isExpanded && item.children && active === item.key && (
                <ul
                  className={`${
                    isExpanded
                      ? 'fixed left-full top-0 bg-[#fff] w-[170px] max-h-[calc(100vh-70px)] h-screen border border-gray-300 z-[1030] font-[Inter,sans-serif] text-[14px] font-[500] text-[rgb(108,117,125)] cursor-pointer rounded-tr-[10px]'
                      : 'hidden'
                  }`}
                >
                  {item.children &&
                    active === item.key &&
                    item.children
                      .filter((subItem) => hasPermission(user, subItem))
                      .map((subItem) => (
                        <li
                          key={subItem.link}
                          className="p-2 transition-all mt-1 duration-300 hover:bg-[#e6f7ffce]"
                        >
                          <Link
                            to={`/${subItem.link}`}
                            onClick={() => dispatch(collapedSideBar())}
                          >
                            {
                              <div className="box-border items-center flex h-6 pt-5 pb-5 max-w-[169.2px] ">
                                <div>
                                  <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    stroke-width="0"
                                    viewBox="0 0 24 24"
                                    class="me- mb-"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ color: 'var(--SUB-LINE-DOT)' }}
                                  >
                                    <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"></path>
                                  </svg>
                                </div>
                                <span className="text-left ms-2">{`${subItem.name}`}</span>
                              </div>
                            }{' '}
                          </Link>
                        </li>
                      ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Navigation;
