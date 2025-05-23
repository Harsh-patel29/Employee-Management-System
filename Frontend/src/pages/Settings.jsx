import React from 'react';
import {
  Sheet,
  SheetDescription,
  SheetTrigger,
  SheetContent,
  SheetHeader,
} from '../Components/components/ui/sheet.tsx';
import SmtpForm from '../Components/SmtpForm.jsx';
import { useDispatch, useSelector } from 'react-redux';
import {
  createSMTP,
  getSMTP,
  updateSMTP,
  resetCreateSMTP,
  resetUpdateSMTP,
} from '../feature/smtpfetch/smtpSlice.js';
import { toast } from 'react-toastify';
import AttendanceSettingForm from '../Components/AttendanceSettingForm.jsx';

const Settings = () => {
  const [sheetopen, setsheetopen] = React.useState(false);
  const [Attendancesheetopen, setAttendancesheetopen] = React.useState(false);
  const [mode, setmode] = React.useState('');
  const dispatch = useDispatch();
  const { smtp, fetchedsmtp, updatedsmtp } = useSelector(
    (state) => state.smtpSlice
  );

  React.useEffect(() => {
    dispatch(getSMTP());
  }, []);

  React.useEffect(() => {
    if (fetchedsmtp?.message) {
      if (Array.from(fetchedsmtp?.message).length === 1) {
        setmode('update');
      } else {
        setmode('create');
      }
    }
  }, [fetchedsmtp]);

  React.useEffect(() => {
    if (smtp?.success) {
      toast.success('SMTP created Successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      dispatch(resetCreateSMTP());
      setsheetopen(false);
    }
  }, [smtp]);

  React.useEffect(() => {
    if (updatedsmtp?.success) {
      dispatch(resetUpdateSMTP());
      setAttendancesheetopen(false);
      setsheetopen(false);
    }
  }, [updatedsmtp]);

  return (
    <>
      <div className=" w-full px-2 font-semibold text-3xl h-full mb-2">
        Settings
      </div>
      <div className=" ml-8 mt-5 flex gap-x-8 ">
        <div
          className="bg-white min-w-[25%] w-auto cursor-pointer shadow-xl rounded-xl flex h-auto flex-col"
          onClick={setsheetopen}
        >
          <div className="flex h-auto min-h-24">
            <div className="flex h-full ml-2 items-center justify-center">
              <Sheet open={sheetopen} onOpenChange={setsheetopen}>
                <SheetTrigger>
                  <img
                    src="./SMTP_Image.png"
                    className="h-15 w-15 rounded-md cursor-pointer"
                    alt="SMTP Image"
                  />
                </SheetTrigger>
                <SheetContent
                  showCloseButton={false}
                  className="bg-white min-w-xl"
                >
                  <SheetHeader>
                    <SheetDescription>
                      <SmtpForm
                        mode={mode}
                        onSubmit={(data) => {
                          {
                            mode === 'update'
                              ? dispatch(updateSMTP(data))
                              : dispatch(createSMTP(data));
                          }
                          dispatch(resetUpdateSMTP());
                          dispatch(resetCreateSMTP());
                        }}
                      />
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
              <div className="flex flex-col  justify-center px-2">
                <h1 className="font-semibold text-xl">SMTP Settings</h1>
                <p className="text-gray-400">Configure email server settings</p>
              </div>
            </div>
          </div>
        </div>
        <div
          className="bg-white min-w-[25%] w-auto cursor-pointer rounded-xl shadow-xl flex items-center justify-center"
          onClick={setAttendancesheetopen}
        >
          <div className="flex h-full ml-2 items-center justify-center">
            <Sheet
              open={Attendancesheetopen}
              onOpenChange={setAttendancesheetopen}
            >
              <SheetTrigger>
                <svg
                  class="w-15 h-15 text-[#006bb3] cursor-pointer"
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
              </SheetTrigger>
              <SheetContent
                showCloseButton={false}
                className="bg-white min-w-xl"
              >
                <SheetHeader>
                  <SheetDescription>
                    <AttendanceSettingForm
                      onSubmit={(data) => {
                        dispatch(updateSMTP(data));
                      }}
                    />
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
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
