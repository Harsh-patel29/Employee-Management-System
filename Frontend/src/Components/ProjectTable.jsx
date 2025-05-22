import * as React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetDescription,
} from '../Components/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../Components/components/ui/dialog';
import { Button } from '../Components/components/ui/button.tsx';
import ProjectForm from './ProjectForm.jsx';
import { Link, useNavigate } from 'react-router';
import {
  createproject,
  getProjects,
  deleteProject,
  updateproject,
  resetProject,
  deleteLogo,
} from '../feature/projectfetch/createproject.js';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import Loader from '../Components/Loader.jsx';
import { toast } from 'react-toastify';
import ExporttoExcel from './Export.jsx';
import ReusableTable from './ReusableTable.jsx';
import ProjectFilterSheet from './ProjectFilterSheet.jsx';
function Row({ row, openDialog, navigate, openSheet }) {
  const [updatesheetopen, setupdatesheetopen] = React.useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <React.Fragment>
      <TableRow
        sx={{
          backgroundColor: 'white',
          color: 'black',
        }}
      >
        <TableCell>{row.index}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2 w-full justify-center text-start">
            {row.logo}
            <Link
              to={`/productivity/project/${row._id}`}
              style={{ color: '#408cb6' }}
              className="w-20"
            >
              {row.name}
            </Link>
          </div>
        </TableCell>
        <TableCell>{row.progress_status}</TableCell>
        <TableCell>{row.status}</TableCell>
        <TableCell>
          <div className="flex justify-center">
            {user.permission.project.canUpdateProject && (
              <Sheet
                open={updatesheetopen}
                onOpenChange={(open) => {
                  setupdatesheetopen(open);
                  if (!open) {
                    navigate('/productivity/project');
                  }
                }}
              >
                <SheetTrigger
                  onClick={() => {
                    openSheet(row._id);
                  }}
                  asChild
                >
                  <FaEdit className="font-[200] text-lg cursor-pointer" />
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
            )}
            {user.permission.project.canDeleteProject && (
              <Dialog
                onOpenChange={(open) => {
                  if (!open) navigate('/productivity/project');
                }}
              >
                <DialogTrigger
                  onClick={() => {
                    openDialog(row._id);
                  }}
                  asChild
                >
                  <MdDelete className="font-[200] text-lg text-[#ff3b30] cursor-pointer" />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete
                      the user's account and remove their data from servers.
                      <Button
                        className="flex w-full mt-4 bg-red-600 hover:bg-red-800"
                        onClick={() => {
                          dispatch(deleteProject(row._id));
                          navigate('/productivity/project', { replace: true });
                        }}
                      >
                        Delete
                      </Button>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            )}
          </div>
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

  const dispatch = useDispatch();

  const { project, projects, logo, loading, deletedproject, updatedproject } =
    useSelector((state) => state.project);
  const { user } = useSelector((state) => state.auth);
  const filterValue = useSelector((state) => state.filter.filterValue);

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

  const formattedProject = Projects.map((data, index) => {
    return {
      _id: data._id,
      index: index + 1,
      logo: (
        <img
          src={data.logo.url}
          alt=""
          className="h-8 w-8 object-cover rounded-full"
        />
      ),
      name: data.name,
      progress_status: data.progress_status,
      status: data.status,
    };
  });

  const filteredData = formattedProject.filter((item) => {
    if (
      filterValue === undefined ||
      filterValue === null ||
      Object?.keys(filterValue).length === 0
    )
      return true;
    const projectStatus =
      !filterValue.progress_status ||
      item.progress_status === filterValue.progress_status;
    return projectStatus;
  });

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
      navigate('/productivity/project');
      dispatch(getProjects());
    }
  }, [updatedproject]);

  React.useEffect(() => {
    if (deletedproject?.success) {
      toast.success('Project deleted successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
    return () => {
      dispatch(resetProject());
    };
  }, [deletedproject?.success]);

  React.useEffect(() => {
    if (!sheetopen && !project?.success) {
      dispatch(deleteLogo(logo?.message?.public_id));
    }
  }, [sheetopen]);

  const columns = [
    { field: 'index', headerName: '#' },
    { field: 'Project', headerName: 'Project' },
    { field: 'Progress', headerName: 'Progress' },
    { field: 'Status', headerName: 'Status' },
    { field: 'Action', headerName: 'Action' },
  ];

  return loading ? (
    <Loader />
  ) : (
    <>
      <div className="inline-flex justify-between w-full bg-white h-15 rounded-md mt-1">
        <h5 className="text-[22px] font-[450] font-[Inter,sans-serif]  flex items-center ml-2">
          Project
        </h5>
        <div className="flex items-center">
          <button>
            <ProjectFilterSheet />
          </button>
          {user.permission.project.canAddProject && (
            <Sheet open={sheetopen} onOpenChange={setsheetopen}>
              <SheetTrigger>
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
              <SheetContent className="bg-white xl:min-w-2xl lg:min-w-xl md:w-lg sm:min-w-md">
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
          )}
          <button>
            <ExporttoExcel
              data={Projects}
              fileName="Projects"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            />
          </button>
        </div>
      </div>

      <ReusableTable
        width="full"
        columns={columns}
        data={filteredData}
        rowProps={{ openDialog, openSheet, navigate }}
        RowComponent={Row}
        tableStyle={{
          '& .MuiTableCell-root': {
            padding: 0.6,
            textAlign: 'center',
          },
        }}
      />
    </>
  );
}
