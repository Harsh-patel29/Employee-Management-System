import React, { useState,useEffect } from "react";
import {DragDropContext,Droppable,Draggable} from 'react-beautiful-dnd'
import { useSelector,useDispatch } from "react-redux";
import { getAllTasks ,updateTaskStatus} from "../feature/taskfetch/taskfetchSlice";

const KanbanView = ()=>{
    const {tasks} = useSelector((state)=>state.task)
    const [task,setTask] = useState([])
    const dispatch = useDispatch()
    const [columns,setcolumns] = useState({
        Backlog:[],
        In_Progress:[],
        Due_Today:[],
        OverDue:[],
        Completed:[]
    });

    useEffect(()=>{
        dispatch(getAllTasks())
    },[])

    useEffect(()=>{
        if(tasks?.message){
            setTask(tasks.message)
        }else{
            setTask([])
        }
    },[tasks])

    useEffect(()=>{
        const groupedTasks = {
            Backlog:task.filter(task=>task.Status === 'Backlog'),
            In_Progress:task.filter(task=>task.Status === 'In_Progress'),
            Due_Today:task.filter(task=>task.Status === 'Due_Today'),
            OverDue:task.filter(task=>task.Status === 'OverDue'),
            Completed:task.filter(task=>task.Status === 'Completed')
        }
        setcolumns(groupedTasks)
    },[task])

    const onDragEnd = (result)=>{
        const {source,destination} = result
        if(!destination) return
    
        const sourceCol = [...columns[source.droppableId]]
        const destCol =[...columns[destination.droppableId]]
        const [moved]= sourceCol.splice(source.index,1)

        if(source.droppableId === destination.droppableId){
            sourceCol.splice(destination.index,0,moved)
            setcolumns({...columns, [source.droppableId]:sourceCol})
        }else{
            // moved.Status = destination.droppableId
            destCol.splice(destination.index,0,moved)
            setcolumns({...columns, [source.droppableId]:sourceCol, [destination.droppableId]:destCol})
        }

        dispatch(updateTaskStatus({taskId:moved._id,status:destination.droppableId}))
    }
    

    return(
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex justify-evenly p-4">
                {Object.entries(columns).map(([columnId, columnTasks])=>(
                    <Droppable droppableId={columnId} key={columnId} >
                        {(provided)=>(
                            <div className="">
                             <div ref={provided.innerRef} {...provided.droppableProps} className="bg-gray-100 h-[500px] shadow-xl rounded w-64 overflow-auto">
                            <div className={`${columnId==="Backlog"?"border-t-[rgb(253,80,78)] border-4":columnId==="In_Progress"?"border-t-[rgb(250,139,52)] border-4":columnId==="Due_Today"?"border-t-[rgb(145,150,135)] border-4":columnId==="OverDue"?"border-t-[rgb(217,37,34)] border-4":columnId==="Completed"?"border-t-[rgb(69,222,103)] border-4":"bg-white"} h-14 scrollbar-thin flex justify-between bg-white items-center border border-b-0 border-l-0 border-r-0 shadow rounded-tr-md rounded-tl-md`}>
                               <h2 className="capitalize font-bold mb-2 ml-4 text-black">{columnId}</h2>
                               <div className="capitalize font-bold mb-2 text-black mr-3 border-2 bg-gray-200 rounded-full h-6 w-6 flex items-center justify-center">{columnTasks.length}</div>
                               </div>
                               {columnTasks.map((task,index)=>(
                                <Draggable key={task._id} draggableId={task._id} index={index}>
                                    {(provided)=>(
                                        <div className={`${columnId==="Backlog"?"border-l-[rgb(253,80,78)] border-4":columnId==="In_Progress"?"border-l-[rgb(250,139,52)] border-4":columnId==="Due_Today"?"border-l-[rgb(145,150,135)] border-4":columnId==="OverDue"?"border-l-[rgb(217,37,34)] border-4":columnId==="Completed"?"border-l-[rgb(69,222,103)] border-4":"bg-white"} border-b-0 border-t-0 border-r-0  rounded-md mt-2`}>
                                       <div className="bg-white p-2 rounded shadow mb-2" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                        #{task.CODE}
                                        <div className="flex justify-between">
                                        <div className=" flex items-center justify-start ml-3">
                                        {task.title}
                                        </div>
                                        <div className="flex justify-end text-[13px] font-bold text-[rgb(59,130,246)] bg-[rgb(239,246,255)] px-2 py-1 rounded-md">
                                        {task.Project}
                                        </div>
                                        </div>
                                       </div>
                                        </div>
                                    )}
                                </Draggable>
                               ))}
                               {provided.placeholder}
                            </div>
                        </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext>
    )

}
export default KanbanView;