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
} from "../Components/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../Components/components/ui/dialog";
import { Button } from "../Components/components/ui/button.tsx";
import ProjectForm from "./ProjectForm.jsx";
import { Link, useNavigate } from "react-router";
import { createproject,getProjects,deleteProject,updateproject ,resetProject,deleteLogo} from "../feature/projectfetch/createproject.js";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import TablePagination from "@mui/material/TablePagination";
import Loader from "../Components/Loader.jsx";
import { Bounce,toast } from "react-toastify";
import ExporttoExcel from "./Export.jsx";
function Row({ row, openDialog, navigate, openSheet }) {
  const theme = useSelector((state) => state.theme.theme);
  const [updatesheetopen, setupdatesheetopen] = React.useState(false);

  const dispatch = useDispatch();
  const { logo ,updatedproject} = useSelector((state) => state.project);


  return (
    <React.Fragment>
      <TableRow
        sx={{
          backgroundColor: theme === "light" ? "white" : "#161b22",
          color: theme === "light" ? "black" : "#f8f9fa",
        }}
      >
        <TableCell>{row.index}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            {row.logo}
            <Link
              to={`/productivity/project/${row._id}`}
              style={{ color: "#408cb6" }}
            >
              {row.name}
            </Link>
          </div>
        </TableCell>
        <TableCell>{row.progress_status}</TableCell>
        <TableCell>{row.status}</TableCell>
        <TableCell>
          {
            <Sheet
              open={updatesheetopen}
              onOpenChange={(open) => {
                setupdatesheetopen(open);
                if (!open) {
                  navigate("/productivity/project");
                }
              }}
            >
              <SheetTrigger
                onClick={() => {
                  openSheet(row._id);
                }}
                asChild
              >
                <FaEdit className="font-[200] text-lg" />
              </SheetTrigger>
              <SheetContent className="min-w-2xl">
                <SheetHeader>
                  <SheetDescription>
                    <ProjectForm
                      mode="update"
                      onSubmit={(data) => {
                        dispatch(updateproject({ data, id: row._id }));
                        setupdatesheetopen(false);
                      }}
                    />
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          }
        </TableCell>
        <TableCell sx={{ color: "#ff3b30" }}>
          <Dialog
            onOpenChange={(open) => {
              if (!open) navigate("/productivity/project");
            }}
          >
            <DialogTrigger
              onClick={() => {
                openDialog(row._id);
              }}
              asChild
            >
              <MdDelete className="font-[200] text-lg" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the
                  user's account and remove their data from servers.
                  <Button
                    className="flex w-full mt-4 bg-red-600 hover:bg-red-800"
                    onClick={() => {
                      dispatch(deleteProject(row._id));
                      navigate("/productivity/project", { replace: true });
                    }}
                  >
                    Delete
                  </Button>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
Row.propTypes = {
  row: PropTypes.shape({
    index: PropTypes.number,
    Project: PropTypes.string,
    Progress: PropTypes.string,
    Status: PropTypes.string,
  }).isRequired,
};
export default function ProjectTable() {
  const navigate = useNavigate();
  const [Projects, setProjects] = React.useState([]);
  const [sheetopen, setsheetopen] = React.useState(false);
  const [dialogOpen, setdialogOpen] = React.useState(false);
  const [updatesheet, setupdatesheet] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);

  const { project, projects, logo, loading,  deletedproject, updatedproject,deletedlogo } =
    useSelector((state) => state.project);
  const openDialog = (id) => {
    navigate(`/productivity/project/delete/${id}`);
    setTimeout(() => {
      setdialogOpen(true);
    }, 0);
  };

  const openSheet = (id) => {
    navigate(`/productivity/project/update/${id}`);
    setTimeout(() => {
      setupdatesheet(true);
    }, 0);
  };

  React.useEffect(() => {
    dispatch(getProjects());
  }, []);

  React.useEffect(() => {
    if (projects?.message) {
      setProjects(projects.message);
    } else {
      setProjects([]);
    }
  }, [projects]);

  React.useEffect(() => {
    if (project?.success == true) {
      dispatch(getProjects());
      setsheetopen(false);
    }
  }, [project]);

  React.useEffect(() => {
    if (deletedproject?.success === true) {
      navigate(`/productivity/project`, { replace: true });
      dispatch(getProjects());
    }
  }, [deletedproject, dispatch]);

  React.useEffect(() => {
    if (updatedproject?.success === true) {
      setupdatesheet(false);
      navigate("/productivity/project");
      dispatch(getProjects());
    }
  }, [updatedproject]);

React.useEffect(()=>{
  if(deletedproject?.success){
    toast.success("Project deleted successfully",{
      position: "top-right",
      autoClose: 3000,
    })
  }
  return ()=>{
    dispatch(resetProject())
  }
},[deletedproject?.success])
  
React.useEffect(()=>{
  if(!sheetopen &&!project?.success){
    dispatch(deleteLogo(logo?.message?.public_id))
  }
},[sheetopen])



  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedProjects = Projects.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return loading ? (
    <Loader />
  ) : (
    <>
      <div className="inline-flex justify-between w-full bg-white h-15 rounded-md mt-1">
        <h5 className="text-[22px] font-[450] font-[Inter,sans-serif]  flex items-center ml-2">
          Project
        </h5>
        <div className="flex items-center">
          <button className="bg-[#ffffff] text-[#338DB5] font-[400] gap-2 border-[rgb(51,141,181)] border border-solid cursor-pointer rounded-lg w-[120px] justify-center text-[17px] h-9 mr-3 flex items-center hover:bg-[#dbf4ff]  transition-all duration-300">
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 512 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
              style={{ fontSize: "var(--THEME-ICON-SIZE)" }}
            >
              <title>filters</title>
              <path d="M16 120h480v48H16zm80 112h320v48H96zm96 112h128v48H192z"></path>
            </svg>
            Filters
          </button>
          <Sheet open={sheetopen} onOpenChange={setsheetopen}>
            <SheetTrigger >
              <div className="bg-[#ffffff] text-[#338DB5] font-[400] gap-3 border-[rgb(51,141,181)] border border-solid cursor-pointer rounded-lg w-[160px] justify-center text-[17px] h-9 mr-3 flex items-center hover:bg-[#dbf4ff] transition-all duration-300">
                <svg
                  class="w-6 h-6 text-[#338DB5]"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <title>Create Project</title>

                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  ></path>
                </svg>
                Create Project
              </div>
            </SheetTrigger>
            <SheetContent
              className={`${theme === "light" ? "bg-white " : "bg-[#121212]"} 
            min-w-2xl`}
            >
              <SheetHeader>
                <SheetDescription>
                  <ProjectForm
                    mode="create"
                    onSubmit={(formdata) => dispatch(createproject(formdata))}
                  />
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        <ExporttoExcel data={paginatedProjects} fileName="Projects" className="bg-blue-500 text-white px-4 py-2 rounded-md"/>
        </div>
      </div>

      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: "white",
          marginTop: 0.5,
          color: "black",
          maxHeight: 500,
          width: "98%",
          marginLeft: 1.7,
          borderRadius: 2,
        }}
      >
        <Table
          sx={{
            "& .MuiTableCell-root": {
              padding: 0.4,
            },
          }}
        >
          <TableHead sx={{ backgroundColor: "#c1dde9" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "200", fontSize: "medium" }}>
                #
              </TableCell>
              <TableCell sx={{ fontWeight: "200", fontSize: "medium" }}>
                Project
              </TableCell>
              <TableCell sx={{ fontWeight: "200", fontSize: "medium" }}>
                Progress
              </TableCell>
              <TableCell sx={{ fontWeight: "200", fontSize: "medium" }}>
                Status
              </TableCell>
              <TableCell sx={{ fontWeight: "200", fontSize: "medium" }}>
                Update
              </TableCell>
              <TableCell sx={{ fontWeight: "200", fontSize: "medium" }}>
                Delete
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProjects.map((project, index) => (
              <Row
                key={project._id}
                row={{
                  ...project,
                  index: page * rowsPerPage + index + 1,
                  logo: (
                    <img
                      src={project.logo.url}
                      alt="Project"
                      className="w-8 h-8 object-cover rounded-3xl"
                    />
                  ),
                }}
                navigate={navigate}
                openDialog={openDialog}
                openSheet={openSheet}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        className="flex w-full justify-center"
        component="div"
        count={Projects.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}
