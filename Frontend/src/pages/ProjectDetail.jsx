import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import AssignSheet from '../Components/AssignSheet.jsx';
import { getname } from '../feature/projectfetch/assignuser.js';

const ProjectDetail = () => {
  const { id } = useParams();
  const [userid, setuserid] = useState(id);
  const [detail, setdetail] = useState();
  const [name, setname] = useState([]);
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    setuserid(id);
  }, [id]);

  const { totalassignedusers } = useSelector((state) => state.assignusers);

  const dispatch = useDispatch();

  const isExpanded = useSelector((state) => state.Sidebar.isExpanded);

  useEffect(() => {
    dispatch(getname(userid));
  }, []);

  useEffect(() => {
    if (totalassignedusers) {
      setname(totalassignedusers?.message);
    }
  }, [totalassignedusers]);

  useEffect(() => {
    const getDetails = async (id) => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v3/project/project/${id}`,
          { withCredentials: true }
        );
        setdetail(res.data.message);
        return res.data;
      } catch (error) {
        console.log('Error fetching detail', error);
      }
    };
    getDetails(id);
  }, [id]);

  return (
    <div className="rounded-md ml-28 top-26 shadow   lg:w-[90%]  transition-all duration-300 bg-gray-50">
      <div className="bg-gray-50  flex flex-col h-full">
        <div className="bg-[#6eaffe] rounded-lg p-4 mb-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center">
            <div className=" p-2 rounded-md mr-2">
              <img
                src={detail?.logo.url}
                alt="Project_Logo"
                className="w-10 h-10 rounded-4xl"
              />
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold">{detail?.name}</h1>
            </div>
          </div>
          <div className="flex flex-row gap-10 ">
            {user.permission.project.canAddProjectUsers && (
              <button className="bg-[#f9f9f9] cursor-pointer rounded-lg w-35 text-xl">
                {<AssignSheet />}
              </button>
            )}
            <div className="bg-sky-400/30 text-white px-4 py-1 rounded-full flex items-center">
              <span className="mr-2">●</span>
              <span>{detail?.status}</span>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto flex-grow ">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:-translate-y-2 transition-transform duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold">1</h2>
                  <p className="text-gray-500 ">Total Tasks</p>
                </div>
              </div>
              <div className="h-1 w-full bg-purple-100 rounded-full">
                <div className="h-1 bg-purple-500 rounded-full w-1/3"></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:-translate-y-2 transition-transform duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold">0</h2>
                  <p className="text-gray-500">Backlog Tasks</p>
                </div>
              </div>
              <div className="h-1 w-full bg-blue-100 rounded-full">
                <div className="h-1 bg-blue-500 rounded-full w-0"></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:-translate-y-2 transition-transform duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-orange-100 p-2 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-orange-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold">00</h2>
                  <p className="text-gray-500">In Progress</p>
                </div>
              </div>
              <div className="h-1 w-full bg-orange-100 rounded-full">
                <div className="h-1 bg-orange-500 rounded-full w-0"></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:-translate-y-2 transition-transform duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-2 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold">00</h2>
                  <p className="text-gray-500">Overdue</p>
                </div>
              </div>
              <div className="h-1 w-full bg-red-100 rounded-full">
                <div className="h-1 bg-red-500 rounded-full w-0"></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:-translate-y-2 transition-transform duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold">01</h2>
                  <p className="text-gray-500">Due Today</p>
                </div>
              </div>
              <div className="h-1 w-full bg-green-100 rounded-full">
                <div className="h-1 bg-green-500 rounded-full w-1/3"></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:-translate-y-2 transition-transform duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-teal-100 p-2 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-teal-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold">0</h2>
                  <p className="text-gray-500">Completed</p>
                </div>
              </div>
              <div className="h-1 w-full bg-teal-100 rounded-full">
                <div className="h-1 bg-teal-500 rounded-full w-0"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
            <h2 className="text-xl font-bold text-gray-800 pb-4 border-b border-gray-200">
              Project Overview
            </h2>

            <div className="flex items-center py-6 border-b border-gray-100">
              <div className="bg-indigo-50 p-3 rounded-lg mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Progress</p>
                <p className="text-gray-800 font-semibold">
                  {detail?.progress_status}
                </p>
              </div>
            </div>

            <div className="flex items-center py-6">
              <div className="bg-indigo-50 p-3 rounded-lg mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Team Members</p>
                <p className="text-gray-800 font-semibold">
                  {name?.map((name) => name.username).join(', ')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
