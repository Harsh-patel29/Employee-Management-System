import React, { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetClose,
} from '../Components/components/ui/sheet';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, clearFilter } from '../feature/filterSlice/filterSlice';
import { Button } from '../Components/components/ui/button';
import { fetchuser } from '../feature/createuserfetch/createuserSlice.js';
import { getRoles } from '../feature/rolesfetch/getrolesSlice.js';

export default function UserFilterSheet({ screen }) {
  const dispatch = useDispatch();
  const [sheetopen, setsheetopen] = useState(false);
  const [User, setUser] = useState(null);
  const [Role, setRole] = useState(null);
  const [ReportingManager, setReportingManager] = useState(null);
  const { fetchusers, loading } = useSelector((state) => state.createuser);
  const { roles } = useSelector((state) => state.getrole);

  useEffect(() => {
    dispatch(fetchuser());
    dispatch(getRoles());
  }, [dispatch]);

  const handleFilter = (user, role, reportingManager) => {
    dispatch(
      setFilter({
        screen,
        values: {
          UserName: user?.label,
          Role: role?.label,
          ReportingManager: reportingManager?.label,
        },
      })
    );
  };
  const UserOptions = fetchusers?.message
    ? fetchusers.message.map((user) => ({
        value: user._id,
        label: user.Name,
      }))
    : [];

  const rolesOptions = roles?.message.map((role) => ({
    label: role.name,
    value: role.name,
  }));

  const ReportingManagerOptions = fetchusers?.message
    ? fetchusers?.message.map((user) => ({
        value: user.ReportingManager,
        label: user.ReportingManager,
      }))
    : [];

  const FilteredReportingManagerOptions = Array.from(
    new Map(ReportingManagerOptions.map((item) => [item.value, item])).values()
  );
  console.log(FilteredReportingManagerOptions);

  return (
    <Sheet open={sheetopen} onOpenChange={setsheetopen}>
      <SheetTrigger>
        <button className="bg-[#ffffff] text-[#338DB5] font-[400] gap-2 border-[rgb(51,141,181)] border border-solid cursor-pointer rounded-lg w-[120px] justify-center text-[17px] h-9 mr-3 flex items-center hover:bg-[#dbf4ff] transition-all duration-300">
          <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 512 512"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
            style={{ fontSize: 'var(--THEME-ICON-SIZE)' }}
          >
            <title>Filters</title>
            <path d="M16 120h480v48H16zm80 112h320v48H96zm96 112h128v48H192z"></path>
          </svg>
          Filters
        </button>
      </SheetTrigger>
      <SheetContent className="min-w-lg" showCloseButton={false}>
        <SheetHeader>
          <div className="flex w-full justify-end items-center border-b-2 border-gray-200 pb-4">
            <h1 className="text-2xl w-full">Filter User</h1>
            <Button
              id="clear-filter"
              className="bg-[#338DB5] text-white mr-6 hover:bg-[#338DB5]"
              onClick={() => {
                dispatch(clearFilter({ screen }));
                setUser(null);
                setRole(null);
                setReportingManager(null);
              }}
            >
              Clear All
            </Button>
          </div>
          <SheetClose>
            <Button className="absolute -right-2 top-4 bg-transparent text-black shadow-none border-none text-4xl hover:bg-transparent hover:text-black transition-all duration-300">
              &times;
            </Button>
          </SheetClose>
          <div className="font-[Inter,sans-serif]">
            <div className="flex flex-col gap-3">
              <label className="text-[16px] font-[500]">UserName</label>
              <Select
                value={User}
                id="UserName-filter"
                isClearable={true}
                options={UserOptions}
                onChange={(value) => {
                  handleFilter(value, Role, ReportingManager);
                  setUser(value);
                }}
                isLoading={loading}
                isDisabled={loading}
              />
              <label className="text-[16px] font-[500]">Role</label>
              <Select
                value={Role}
                isClearable={true}
                options={rolesOptions}
                onChange={(value) => {
                  handleFilter(User, value, ReportingManager);
                  setRole(value);
                }}
                isLoading={loading}
                isDisabled={loading}
              />
              <label className="text-[16px] font-[500]">
                Reporting Manager
              </label>
              <Select
                value={ReportingManager}
                isClearable={true}
                options={FilteredReportingManagerOptions}
                onChange={(value) => {
                  handleFilter(User, Role, value);
                  setReportingManager(value);
                }}
                isLoading={loading}
                isDisabled={loading}
              />
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
