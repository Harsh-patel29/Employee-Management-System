import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useSelector, useDispatch } from 'react-redux';
import {
  getAllTasks,
  updateTaskStatus,
} from '../feature/taskfetch/taskfetchSlice';
import { Link, useNavigate } from 'react-router';

const KanbanView = ({ viewType = 'kanban' }) => {
  const { tasks } = useSelector((state) => state.task);
  const filterValue = useSelector((state) => state.filter.filterValue);
  const [task, setTask] = useState([]);
  const dispatch = useDispatch();
  const [columns, setcolumns] = useState({
    Backlog: [],
    In_Progress: [],
    Due_Today: [],
    OverDue: [],
    Completed: [],
  });

  useEffect(() => {
    dispatch(getAllTasks());
  }, []);

  useEffect(() => {
    if (tasks?.message) {
      setTask(tasks.message);
    } else {
      setTask([]);
    }
  }, [tasks]);

  const filteredData = tasks?.message?.filter((item) => {
    if (
      filterValue === undefined ||
      filterValue === null ||
      Object?.keys(filterValue).length === 0
    )
      return true;
    const asigneeMatch =
      !filterValue.Asignee || item.Asignee === filterValue.Asignee;
    const projectMatch =
      !filterValue.Project || item.Project === filterValue.Project;
    const taskMatch = !filterValue.Task || item.CODE === filterValue.Task;
    const startDateMatch =
      !filterValue.StartDate || item.StartDate === filterValue.StartDate;
    const endDateMatch =
      !filterValue.EndDate || item.EndDate === filterValue.EndDate;
    const statusMatch =
      !filterValue.Status || item.Status === filterValue.Status;
    return (
      asigneeMatch &&
      projectMatch &&
      taskMatch &&
      startDateMatch &&
      endDateMatch &&
      statusMatch
    );
  });

  useEffect(() => {
    if (filteredData?.length > 0) {
      dispatch(getAllTasks());
    }
  }, [filterValue]);

  const prevDate = new Date(new Date().setDate(new Date().getDate() - 1));

  useEffect(() => {
    const groupedTasks = {
      Backlog: filteredData?.filter(
        (task) =>
          task.Status === 'Backlog' &&
          task.EndDate !==
            new Date().toLocaleDateString('en-CA').split('/').join('-') &&
          !['Completed', 'Done', 'Deployed'].includes(task.Status)
      ),
      In_Progress: filteredData?.filter(
        (task) =>
          task.Status === 'In_Progress' &&
          task.EndDate !==
            new Date().toLocaleDateString('en-CA').split('/').join('-') &&
          task.EndDate !==
            prevDate.toLocaleDateString('en-CA').split('/').join('-') &&
          !['Completed', 'Done', 'Deployed'].includes(task.Status)
      ),
      Due_Today: filteredData?.filter(
        (task) =>
          task.EndDate ===
            new Date().toLocaleDateString('en-CA').split('/').join('-') &&
          !['Completed', 'Done', 'Deployed'].includes(task.Status)
      ),
      OverDue: filteredData?.filter(
        (task) =>
          task.EndDate ===
            prevDate.toLocaleDateString('en-CA').split('/').join('-') &&
          !['Completed', 'Done', 'Deployed'].includes(task.Status)
      ),
      Completed: filteredData?.filter((task) =>
        ['Completed', 'Done', 'Deployed'].includes(task.Status)
      ),
    };
    const boardViewTasks = {
      Backlog: filteredData?.filter(
        (task) =>
          task.Status === 'Backlog' &&
          task.EndDate !==
            new Date().toLocaleDateString('en-CA').split('/').join('-') &&
          !['Completed', 'Done', 'Deployed'].includes(task.Status)
      ),
      In_Progress: filteredData?.filter(
        (task) =>
          task.Status === 'In_Progress' &&
          task.EndDate !==
            new Date().toLocaleDateString('en-CA').split('/').join('-') &&
          !['Completed', 'Done', 'Deployed'].includes(task.Status)
      ),
      Done: filteredData?.filter(
        (task) =>
          task.Status === 'Done' &&
          task.EndDate !==
            new Date().toLocaleDateString('en-CA').split('/').join('-')
      ),
      Completed: filteredData?.filter((task) =>
        ['Completed'].includes(task.Status)
      ),
      Deployed: filteredData?.filter(
        (task) =>
          task.Status === 'Deployed' &&
          task.EndDate !==
            new Date().toLocaleDateString('en-CA').split('/').join('-')
      ),
    };
    if (viewType === 'kanban') {
      setcolumns(groupedTasks);
    } else if (viewType === 'board') {
      setcolumns(boardViewTasks);
    }
  }, [task, viewType]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = [...columns[source.droppableId]];
    const destCol = [...columns[destination.droppableId]];
    const [moved] = sourceCol.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceCol.splice(destination.index, 0, moved);
      setcolumns({ ...columns, [source.droppableId]: sourceCol });
    } else {
      destCol.splice(destination.index, 0, moved);
      setcolumns({
        ...columns,
        [source.droppableId]: sourceCol,
        [destination.droppableId]: destCol,
      });
    }

    dispatch(
      updateTaskStatus({ taskId: moved._id, status: destination.droppableId })
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        className="flex flex-row justify-evenly p-4 w-full 
      "
      >
        {Object.entries(columns).map(([columnId, columnTasks]) => (
          <Droppable
            direction="vertical"
            droppableId={columnId}
            key={columnId}
            isDropDisabled={false}
            isCombineEnabled={false}
            ignoreContainerClipping={false}
          >
            {(provided, snapshot) => (
              <div className="w-full overflow-y-auto">
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`bg-gray-100 h-[500px] shadow-xl min-xl:w-64 w-full rounded ${snapshot.isDraggingOver ? 'bg-gray-200' : ''}`}
                >
                  <div
                    className={` ${columnId === 'Backlog' ? 'border-t-[rgb(253,80,78)] border-4' : columnId === 'In_Progress' ? 'border-t-[rgb(250,139,52)] border-4' : columnId === 'Due_Today' ? 'border-t-[rgb(145,150,135)] border-4' : columnId === 'OverDue' ? 'border-t-[rgb(217,37,34)] border-4' : columnId === 'Completed' ? 'border-t-[rgb(69,222,103)] border-4' : columnId === 'Done' ? 'border-t-[rgb(145,150,135)] border-4' : columnId === 'Deployed' ? 'border-t-[rgb(130,216,239)] border-4' : 'bg-white'} h-14 scrollbar-thin flex justify-between bg-white items-center border border-b-0 border-l-0 border-r-0 shadow rounded-tr-md rounded-tl-md`}
                  >
                    <h2 className="capitalize font-bold mb-2 ml-4 text-black">
                      {columnId}
                    </h2>
                    <div className="capitalize font-bold mb-2 text-black mr-3 border-2 bg-gray-200 rounded-full h-6 w-6 flex items-center justify-center">
                      {columnTasks?.length}
                    </div>
                  </div>
                  {columnTasks?.map((task, index) => (
                    <Link to={`/productivity/tasks/${task.CODE}`}>
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            className={` ${columnId === 'Backlog' ? 'border-l-[rgb(253,80,78)] border-4' : columnId === 'In_Progress' ? 'border-l-[rgb(250,139,52)] border-4' : columnId === 'Due_Today' ? 'border-l-[rgb(145,150,135)] border-4' : columnId === 'OverDue' ? 'border-l-[rgb(217,37,34)] border-4' : columnId === 'Completed' ? 'border-l-[rgb(69,222,103)] border-4' : columnId === 'Done' ? 'border-l-[rgb(145,150,135)] border-4' : columnId === 'Deployed' ? 'border-l-[rgb(130,216,239)] border-4' : 'bg-white'} border-b-0 border-t-0 border-r-0  rounded-md mt-2`}
                          >
                            <div
                              className={`p-2 rounded shadow mb-2 transition-all duration-300 ${
                                snapshot.isDragging
                                  ? 'bg-blue-200 transform scale-102 shadow-lg'
                                  : 'bg-white'
                              }`}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              #{task.CODE}
                              <div className="flex  justify-between">
                                <div className=" flex items-center justify-start ml-3">
                                  {task.title}
                                </div>
                                {task.Project ? (
                                  <div className="flex justify-end text-[13px] font-bold text-[rgb(59,130,246)] bg-[rgb(239,246,255)] px-2 py-1 rounded-md">
                                    {task.Project}
                                  </div>
                                ) : (
                                  <></>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    </Link>
                  ))}
                </div>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};
export default KanbanView;
