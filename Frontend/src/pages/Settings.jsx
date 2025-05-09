import React from 'react';
const Settings = () => {
  return (
    <>
      <div className=" w-full px-2 font-semibold text-3xl h-full mb-2">
        Settings
      </div>
      <div className=" ml-8 mt-5 flex gap-x-8 ">
        <div className="bg-white min-w-[25%] w-auto cursor-pointer shadow-xl rounded-xl flex h-auto flex-col">
          <div className="flex h-auto min-h-24">
            <div className="flex h-full ml-2 items-center justify-center">
              <img
                src="./SMTP_Image.png"
                className="h-15 w-15 rounded-md"
                alt="SMTP Image"
              />
            </div>
            <div className="flex flex-col  justify-center px-2">
              <h1 className="font-semibold text-xl">SMTP Settings</h1>
              <p className="text-gray-400">Configure email server settings</p>
            </div>
          </div>
        </div>
        <div className="bg-white min-w-[25%] w-auto cursor-pointer rounded-xl shadow-xl flex items-center justify-center">
          <div className="flex h-full ml-2 items-center justify-center">
            <svg
              class="w-15 h-15 text-[#006bb3]"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="square"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h2m10 1a3 3 0 0 1-3 3m3-3a3 3 0 0 0-3-3m3 3h1m-4 3a3 3 0 0 1-3-3m3 3v1m-3-4a3 3 0 0 1 3-3m-3 3h-1m4-3v-1m-2.121 1.879-.707-.707m5.656 5.656-.707-.707m-4.242 0-.707.707m5.656-5.656-.707.707M12 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </div>
          <div className="flex flex-col  justify-center px-2">
            <h1 className="font-semibold text-xl">Attendance Settings</h1>
            <p className="text-gray-400">
              Maintain Attendance rules and policies
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
