import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DashAttendanceTable from '../Components/DashAttendanceTable';
import DashTaskTable from '../Components/DashTaskTable';
import { getProjects } from '../feature/projectfetch/createproject';
import { getAllTasks } from '../feature/taskfetch/taskfetchSlice.js';
const DashBoard = () => {
  const dispatch = useDispatch();
  const [Tasks, setTasks] = React.useState([]);
  const { projects } = useSelector((state) => state.project);
  const { tasks } = useSelector((state) => state.task);

  React.useEffect(() => {
    dispatch(getProjects());
  }, []);

  React.useEffect(() => {
    dispatch(getAllTasks());
  }, []);

  React.useEffect(() => {
    if (tasks?.message) {
      setTasks(tasks.message);
    } else {
      setTasks([]);
    }
  }, [tasks]);
  const inProgressTask = Tasks?.filter((item) => item.Status === 'In_Progress');
  const OverDueTask = Tasks?.filter(
    (item) =>
      item.EndDate !== '' &&
      item.EndDate <
        new Date().toLocaleDateString('en-CA').split('/').join('-') &&
      !['Completed', 'Done', 'Deployed'].includes(item.Status)
  );
  const DueTodayTask = Tasks?.filter(
    (item) =>
      item.EndDate !== '' &&
      item.EndDate ==
        new Date().toLocaleDateString('en-CA').split('/').join('-') &&
      !['Completed', 'Done', 'Deployed'].includes(item.Status)
  );

  return (
    <div className="bg-[#ffffff] rounded-xl xl:min-h-[450px]  lg:min-h-auto h-full  justify-center transition-all duration-300 ">
      <div className=" ">
        <div className="ml-6 ">
          <h5 className="text-[20.8px] text-start font-[Inter,sans-serif] font-[600]">
            OverView
          </h5>
        </div>
        <div className=" flex flex-wrap justify-center gap-6 mt-6 mb-10">
          <div className="bg-[#e5fef16b] border-l-[5px] border-[#2ade879c] min-w-[256px]  flex items-center justify-center h-25 shadow-xl  rounded-xl">
            <div class=" flex flex-col items-center transition-transform duration-300 hover:scale-120">
              <h3 className="font-bold text-xl">Total Projects</h3>
              <p className="text-[#2cdb86cd] font-semibold">
                {projects?.message?.length}
              </p>
            </div>
          </div>
          <div className="bg-[#feeddd55] border-l-[5px] border-[#f492379c] min-w-[256px]  flex items-center justify-center h-25 shadow-xl rounded-xl">
            <div className="flex flex-col items-center transition-transform duration-300 hover:scale-120">
              <h3 className="font-bold text-xl">On Going Task</h3>
              <p className="text-[#dc832fc5] font-semibold">
                {inProgressTask?.length}
              </p>
            </div>
          </div>
          <div className="bg-[#fadede57] border-l-[5px] border-[#ff36368c] min-w-[256px]  flex items-center justify-center h-25 shadow-xl rounded-xl">
            <div class=" flex flex-col items-center transition-transform duration-300 hover:scale-120">
              <h3 className="font-bold text-xl">Overdue Task</h3>
              <p class="text-[#d73737ad] font-semibold">
                {OverDueTask?.length}
              </p>
            </div>
          </div>
          <div className="bg-[#ddffff5f] border-l-[5px] border-[#22c2c28a] min-w-[256px]  flex items-center justify-center h-25 shadow-xl rounded-xl">
            <div class=" flex flex-col items-center transition-transform duration-300 hover:scale-120">
              <h3 className="font-bold text-xl">Due Today Task</h3>
              <p className="text-[#22c2c2bf]">{DueTodayTask?.length}</p>
            </div>
          </div>{' '}
        </div>
        <div className="flex w-full gap-2 mb-5 px-4 ">
          <div className="w-[30%] ">
            <h1 className="ml-4 font-semibold text-[20.8px] mb-4">Log Hours</h1>
            <DashAttendanceTable />
          </div>
          <div className="w-[70%] ">
            <h1 className="ml-4 font-semibold text-[20.8px] mb-4">
              Pending Task List
            </h1>
            <DashTaskTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
