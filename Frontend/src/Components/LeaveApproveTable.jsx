import React from "react";
import ReusableTable from "../Components/ReusableTable.jsx"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "../Components/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../Components/components/ui/dialog";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import { Button } from "../Components/components/ui/button";
import LeaveForm from "./LeaveForm.jsx";
import { useDispatch,useSelector } from "react-redux";
import {  useNavigate } from "react-router-dom";
import { createLeave ,getAllLeave,resetError,rejectLeave,approveLeave,resetApprovedLeave,resetRejectedLeave} from "../feature/leavefetch/createleaveSlice";

import { Bounce,toast } from "react-toastify";
function Row({row,openDialog,navigate}){
    const dispatch = useDispatch()
  
    const [dialogOpen, setdialogOpen] = React.useState(false);
    const [rejectDialogOpen, setrejectDialogOpen] = React.useState(false);
   

    
  return(
    <React.Fragment>
      <TableRow
        sx={{
          backgroundColor: "white",
          color: "black",
        }}
      >
        <TableCell>{row.index}</TableCell>
        <TableCell>
            {row.EMPCODE}
        </TableCell>
        <TableCell>{row.userName}</TableCell>
        <TableCell>{row.Leave_Reason}</TableCell>
        <TableCell>{row.LEAVE_TYPE}</TableCell>
        <TableCell>{row.Start_Date}</TableCell>
        <TableCell>{row.End_Date}</TableCell>
        <TableCell>{row.Days}</TableCell>
        <TableHead>
        <TableCell>
<div className="flex items-center gap-2">
        <Dialog open={dialogOpen} onOpenChange={setdialogOpen}>
            <DialogTrigger
              onClick={() => {
                openDialog(row._id);
              }}
              asChild
            >
                <Button  className="px-4 py-2 bg-transparent hover:bg-emerald-600 hover:text-white border border-emerald-500 text-emerald-500 font-medium rounded-md transition-colors duration-200 shadow-none font-[sans-serif,Inter]">
            Approve
           </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone.Once approved, the leave can't be rejected.
                  <Button onClick={()=>{dispatch(approveLeave(row._id))
                    setdialogOpen(false)
                  }} className=" flex mt-3 w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 hover:text-white border border-emerald-500 text-white font-medium rounded-md transition-colors duration-200 shadow-none font-[sans-serif,Inter]">
            Approve
           </Button>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
                   <Dialog open={rejectDialogOpen} onOpenChange={setrejectDialogOpen}>
            <DialogTrigger
              onClick={() => {
                openDialog(row._id);
              }}
              asChild
            >
                  <Button  className="px-4 py-2 bg-transperant hover:bg-red-700 hover:text-white border border-red-500 text-red-600 font-medium rounded-md transition-colors duration-200 shadow-none font-[sans-serif,Inter]">
            Reject
          </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone.Once rejected, the leave can't be approved.
                  <Button onClick={()=>
                  {dispatch(rejectLeave(row._id))
                    setrejectDialogOpen(false)
                  }}className=" flex mt-3 w-full px-4 py-2 bg-red-500 hover:bg-red-600 hover:text-white border border-red-500 text-white font-medium rounded-md transition-colors duration-200 shadow-none font-[sans-serif,Inter]">
            Reject
           </Button>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
     </div>
        </TableCell>
        </TableHead>
      </TableRow>
    </React.Fragment>
  )
}

const LeaveApproveTable = () => {
  const {allLeave,error,leave,deletedLeave,approvedLeave,rejectedLeave} = useSelector((state)=>state.leave)
  const [Leave,setLeave] = React.useState([])
    const [sheetopen,setsheetopen] = React.useState(false)
    const [dialogOpen, setdialogOpen] = React.useState(false);
    const navigate = useNavigate()
    const dispatch = useDispatch()

    React.useEffect(()=>{
      dispatch(getAllLeave())
    },[dispatch])
    
    React.useEffect(()=>{
      if(allLeave?.message){
        setLeave(allLeave?.message)
      }
    },[allLeave])

    const openDialog = () => {
    setTimeout(() => {
      setdialogOpen(true);
    }, 0);
  };

    React.useEffect(()=>{
      if(approvedLeave?.success){
        toast.success("Leave approved Successfully", {
          position: "top-right",
          autoClose: 3000,
        });
        dispatch(getAllLeave())
        dispatch(resetApprovedLeave())
      }
    },[approvedLeave])

     React.useEffect(()=>{
      if(rejectedLeave?.success){
        toast.success("Leave rejected Successfully", {
          position: "top-right",
          autoClose: 3000,
        });
        dispatch(resetRejectedLeave())
      }
    },[rejectedLeave])

    React.useEffect(()=>{
      if (error) {
      const errorMessage = error.response?.data?.message || error.message || error;
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      dispatch(resetError());
    }
    },[error])




const columns =[
    {field:"index",headerName:"#"},
    {field:"EMP_CODE",headerName:"EMP CODE"},
    {field:"Name",headerName:"User Name"},
    {field:"Leave_Reason",headerName:"Leave Reason"},
    {field:"LEAVE_TYPE",headerName:"Leave Type"},
    {field:"Start_Date",headerName:"Start Date"},
    {field:"End_Date",headerName:"End Date"},
    {field:"Days",headerName:"Days"},
    {field:"Action",headerName:"Action"},
]

return(
    <>
     <div className="inline-flex justify-between w-full bg-white h-15 rounded-md mt-1 mb-2">
        <h5 className="text-[22px] font-[450] font-[Inter,sans-serif]  flex items-center ml-2">
          Pending Leave
        </h5>
        <div className="flex items-center">
          <Sheet open={sheetopen} onOpenChange={setsheetopen}>
            <SheetTrigger>
              <div className="bg-[#ffffff] text-[#338DB5] font-[400] gap-3 border-[rgb(51,141,181)] border border-solid cursor-pointer rounded-lg w-[130px] justify-center text-[17px] h-9 mr-3 flex items-center hover:bg-[#dbf4ff] transition-all duration-300">
               <svg className="h-6 w-6" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <title>create</title>
<circle cx="12" cy="12" r="10"></circle>
<line x1="12" y1="8" x2="12" y2="16"></line>
<line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
             Filter 
              </div>
            </SheetTrigger>
            <SheetContent showCloseButton={false}
              className="bg-white min-w-xl"
              >
              <SheetHeader>
                <SheetDescription>
                  <LeaveForm onSubmit={(data)=>{dispatch(createLeave(data))}}/>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    <ReusableTable columns={columns} data={Leave} RowComponent={Row} pagination={true} rowProps={{openDialog,navigate}}/>
    </>
)
}

export default LeaveApproveTable
