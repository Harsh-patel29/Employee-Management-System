import React, { useEffect, useState, useRef } from 'react';
import { Play, StopCircle, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogClose,
} from './components/ui/dialog';
import { useDispatch, useSelector } from 'react-redux';
import {
  createTaskTimer,
  resetTaskTimer,
  updateTaskTimer,
  getTaskByUser,
} from '../feature/tasktimerfetch/tasktimerslice.js';
import { getAllTasks } from '../feature/taskfetch/taskfetchSlice.js';
import Select from 'react-select';
import { Input } from './components/ui/input';
const Timer = ({ openTimer, setOpenTimer }) => {
  const dispatch = useDispatch();
  const [time, setTime] = useState(0);
  const [selectedTask, setSelectedTask] = useState(null);
  const [message, setMessage] = useState('');
  const [taskId, setTaskId] = useState(null);
  const [hasSentData, setHasSentData] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { createdTaskTimer, taskByUser, updatedTaskTimer } = useSelector(
    (state) => state.tasktimer
  );
  const [isRunning, setIsRunning] = useState(false);
  const [task, setTask] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const savedTime = parseInt(localStorage.getItem('timerTime') || '0');
    const savedRunning = localStorage.getItem('timerRunning') === 'true';
    setTime(savedTime);
    setIsRunning(savedRunning);
  }, []);

  useEffect(() => {
    localStorage.setItem('timerTime', time.toString());
    localStorage.setItem('timerRunning', isRunning.toString());
  }, [time, isRunning]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(
        () => setTime((prev) => prev + 1),
        1000
      );
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const resetTimer = () => {
    setIsRunning(false);
    setTime(0);
    localStorage.removeItem('timerTime');
    localStorage.removeItem('timerRunning');
  };
  const formatTime = (unit) => String(unit).padStart(2, '0');
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  useEffect(() => {
    if (taskByUser?.message) {
      setTask(taskByUser.message);
    }
  }, [taskByUser]);

  useEffect(() => {
    if (createdTaskTimer?.success) {
      setTaskId(createdTaskTimer.message._id);
      dispatch(resetTaskTimer());
    }
  }, [createdTaskTimer]);

  useEffect(() => {
    if (taskId) {
      localStorage.setItem('taskId', taskId);
    }
  }, [taskId]);

  useEffect(() => {
    if (taskId && !hasSentData) {
      setHasSentData(true);
    }
  }, [taskId, hasSentData]);

  const filteredTask = task?.filter(
    (t) =>
      t.Status !== 'Completed' &&
      t.Status !== 'Deployed' &&
      t.Status !== 'Done' &&
      t.Status !== 'Backlog'
  );

  const taskOptions = filteredTask?.map((t) => ({
    value: `${t.CODE}${t?.title ? `- ${t?.title}` : ''}`,
    label: `${t.CODE}${t?.title ? `- ${t?.title}` : ''}`,
  }));

  const taskCode = selectedTask?.label.split('-')[0];

  useEffect(() => {
    const storedTaskId = localStorage.getItem('taskId');
    const storedTask = localStorage.getItem('selectedTask');
    const storedInput = localStorage.getItem('message');

    if (storedTaskId) {
      setTaskId(storedTaskId);
    }

    if (storedTask) {
      setSelectedTask(JSON.parse(storedTask));
    }

    if (storedInput) {
      setMessage(storedInput);
    }
  }, []);

  const errorMessage = document.getElementById('error-message');
  return (
    <>
      <Dialog open={openTimer} onOpenChange={setOpenTimer}>
        <DialogContent className="bg-white border-none p-0 w-100">
          <DialogHeader></DialogHeader>

          <div className="inset-0 flex items-center justify-center z-50">
            <div className=" rounded-2xl shadow-none  w-[90%] max-w-md relative">
              <div className="flex items-start justify-between w-full">
                <h2 className="text-xl font-semibold mb-6 text-gray-700">
                  Time Tracker
                </h2>
                <DialogClose>
                  <X className="h-4 w-4 mt-1.5 cursor-pointer" />
                </DialogClose>
              </div>
              <div className="flex justify-between">
                {[
                  { label: 'Hours', value: hours },
                  { label: 'Minutes', value: minutes },
                  { label: 'Seconds', value: seconds },
                ].map((t, i) => (
                  <div
                    key={i}
                    className="bg-gray-600 text-white rounded-md flex flex-col items-center justify-center w-24 h-24"
                  >
                    <span className="text-2xl font-bold">
                      {formatTime(t.value)}
                    </span>
                    <span className="text-xs mt-1 text-gray-200">
                      {t.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2 justify-center mt-4">
                <Select
                  isDisabled={isRunning}
                  className="w-full"
                  options={taskOptions}
                  onChange={(option) => {
                    setSelectedTask(option);
                    localStorage.setItem(
                      'selectedTask',
                      JSON.stringify(option)
                    );
                  }}
                  value={selectedTask}
                />
                <Input
                  disabled={isRunning}
                  type="text"
                  placeholder="Enter Message"
                  className="w-full shadow-none border border-gray-300 rounded-sm"
                  onChange={(e) => {
                    setMessage(e.target.value);
                    localStorage.setItem('message', e.target.value);
                  }}
                  value={message}
                />
                <span id="error-message" className={'text-sm text-red-500'}>
                  {/* Message is required */}
                </span>
              </div>
              <div className="mt-6 flex items-center justify-center gap-6 pb-6">
                <button
                  onClick={() => {
                    if (message && selectedTask) {
                      setIsRunning(true);
                      errorMessage.textContent = '';
                    } else {
                      errorMessage.textContent = 'Task and Message is Required';
                    }
                  }}
                  className="bg-gray-200 text-gray-700 p-3 rounded-full hover:bg-gray-300 "
                >
                  <button
                    type="submit"
                    className="w-5 h-5 flex items-center justify-center disabled:cursor-not-allowed"
                    onClick={() => {
                      dispatch(
                        createTaskTimer({
                          data: { TaskId: taskCode, Message: message },
                          id: user.Name,
                        })
                      );
                      setHasSentData(false);
                    }}
                  >
                    <button>
                      <Play />
                    </button>
                  </button>
                </button>
                <button
                  disabled={!isRunning}
                  onClick={resetTimer}
                  className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 disabled:cursor-not-allowed"
                >
                  <button
                    type="submit"
                    disabled={!message || !taskCode || !isRunning}
                    className="w-5 h-5 flex items-center justify-center disabled:cursor-not-allowed"
                    onClick={() => {
                      dispatch(
                        updateTaskTimer({
                          data: { id: taskId, TaskCode: taskCode },
                          id: user.Name,
                        })
                      );
                      dispatch(getAllTasks());
                    }}
                  >
                    <StopCircle
                      className="w-5 h-5"
                      onClick={() => {
                        resetTimer();
                        setTaskId(null);
                        setMessage('');
                        setSelectedTask(null);
                        localStorage.removeItem('taskId');
                        localStorage.removeItem('selectedTask');
                        localStorage.removeItem('message');
                      }}
                    />
                  </button>
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Timer;
