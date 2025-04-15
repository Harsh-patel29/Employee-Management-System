import * as React from "react";
import PropTypes from "prop-types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetDescription,
} from "./components/ui/sheet.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog.tsx";
import { Button } from "./components/ui/button.tsx";
import ProjectForm from "./ProjectForm.jsx";
import { Link, useNavigate } from "react-router";
import { createproject,getProjects,deleteProject,updateproject ,resetProject,deleteLogo} from "../feature/projectfetch/createproject.js";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import TablePagination from "@mui/material/TablePagination";
import Loader from "./Loader.jsx";
import { Bounce,toast } from "react-toastify";
import ReusableTable from "./ReusableTable.jsx";

function Row({row}){
  return(
    <React.Fragment>    
    <TableRow>
      <TableCell>{row.name}</TableCell>
    </TableRow>
    </React.Fragment>
  )
}

Row.propTypes = {
  row: PropTypes.shape({
    name: PropTypes.string,
    code: PropTypes.string,
  }).isRequired,
};

 export default function CreateLeaveTable() {


        const columns = [
            {field: "Name", headerName: "Name", },
            {field: "Code", headerName: "Code", },
            {field: "Action", headerName: "Action", },
            {field: "Delete", headerName: "Delete", },
        ]

  return (
    <>
     <div className="inline-flex justify-between w-full bg-white h-15 rounded-md mt-1 mb-2">
        <h5 className="text-[22px] font-[450] font-[Inter,sans-serif]  flex items-center ml-2">
          Leave Type
        </h5>
        </div>
    <ReusableTable
    columns={columns}
    pagination={true}
    />
    </>
  )
}