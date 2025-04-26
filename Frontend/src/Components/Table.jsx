import * as React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate, useParams } from 'react-router';
import { FaEdit } from 'react-icons/fa';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from '../Components/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../Components/components/ui/dialog';
import AdminForm from './AdminForm';
import { MdDelete } from 'react-icons/md';
import { Button } from '../Components/components/ui/button.tsx';
import { Bounce, toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import {
  createuser,
  fetchuser,
  deleteuser,
  updateuser,
  resetCreatedUser,
  resetUpdatedUser,
  reseterror,
  resetDeletedUser,
} from '../feature/createuserfetch/createuserSlice.js';
import Loader from '../Components/Loader.jsx';
import ReusableTable from './ReusableTable.jsx';
import { checkAuth } from '../feature/datafetch/datafetchSlice.js';
function Row({
  row,
  canUpdateUser,
  openSheet,
  navigate,
  isDefault,
  openDialog,
}) {
  const [open, setOpen] = React.useState(false);
  const [updatesheetopen, setupdatesheetopen] = React.useState(false);
  const { updateduser } = useSelector((state) => state.createuser);
  const { user } = useSelector((state) => state.auth);
  React.useEffect(() => {
    if (updateduser?.success === true) {
      setupdatesheetopen(false);
    }
  }, [updateduser]);
  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();
  return (
    <React.Fragment>
      <TableRow
        sx={{
          backgroundColor: 'white',
          color: 'black',
        }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <KeyboardArrowDownIcon
                sx={{ color: theme === 'light' ? 'black' : '#f8f9fa' }}
              />
            ) : (
              <KeyboardArrowRightIcon
                sx={{ color: theme === 'light' ? 'black' : '#f8f9fa' }}
              />
            )}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" sx={{ color: 'inherit' }}>
          {row.index}
        </TableCell>
        <TableCell component="th" scope="row" sx={{ color: 'inherit' }}>
          {row.Name}
        </TableCell>
        <TableCell sx={{ color: 'inherit' }}>{row.EMP_CODE}</TableCell>
        <TableCell sx={{ color: 'inherit' }}>{row.role}</TableCell>
        <TableCell sx={{ color: 'inherit' }}>{row.Email}</TableCell>
        <TableCell sx={{ color: 'inherit' }}>{row.Mobile_Number}</TableCell>
        <TableCell sx={{ color: 'inherit' }}>{row.ReportingManager}</TableCell>
        <TableCell sx={{ color: 'inherit' }}>
          <div className="flex items-center gap-2 justify-center">
            {(user?.permission?.user?.can_update_user ||
              row._id === user.user._id) && (
              <Sheet open={updatesheetopen} onOpenChange={setupdatesheetopen}>
                <SheetTrigger
                  onClick={() => {
                    openSheet(row._id);
                  }}
                  asChild
                >
                  <FaEdit className="cursor-pointer font-semibold text-lg" />
                </SheetTrigger>
                <SheetContent
                  className={`${theme === 'light' ? 'bg-white ' : 'bg-[#121212]'} 
                min-w-6xl`}
                >
                  <SheetHeader>
                    <SheetDescription>
                      <AdminForm
                        mode="update"
                        onSubmit={(data) => {
                          dispatch(updateuser({ data, userid: row._id }));
                        }}
                      />
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            )}

            {user?.permission?.user?.can_delete_user &&
              row.role !== 'Admin' && (
                <div>
                  <Dialog
                    onOpenChange={(open) => {
                      if (!open) navigate('/users');
                    }}
                  >
                    <DialogTrigger
                      onClick={() => {
                        openDialog(row._id);
                      }}
                      asChild
                    >
                      <MdDelete className="font-semibold text-lg text-[#ff3b30] cursor-pointer" />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently
                          delete the user's account and remove their data from
                          servers.
                          <Button
                            className="flex w-full mt-4 bg-red-600 hover:bg-red-800"
                            onClick={() => {
                              dispatch(deleteuser(row._id));
                              navigate('/users');
                            }}
                          >
                            Delete
                          </Button>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{
            paddingBottom: 0,
            paddingTop: 0,
          }}
          colSpan={9}
          sx={{
            backgroundColor: 'white',
            color: 'black',
          }}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table
                sx={{
                  alignContent: 'center',
                }}
              >
                <TableHead
                  sx={{
                    backgroundColor: '#c1dde9',
                  }}
                >
                  <TableRow
                    sx={{ borderRadius: 2 }}
                    className=" border-gray-200 border-2"
                  >
                    <TableCell className="border-2 border-gray-200">
                      Date of Joining
                    </TableCell>
                    <TableCell className="border-2 border-gray-200">
                      Mobile Number
                    </TableCell>
                    <TableCell className="border-2 border-gray-200">
                      Email
                    </TableCell>
                    <TableCell className="border-2 border-gray-200">
                      Date of Birth
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow className="border-2 border-gray-200">
                    {console.log(row)}
                    <TableCell className="border-2 border-gray-200">
                      {row.DATE_OF_JOINING}
                    </TableCell>
                    <TableCell className="border-2 border-gray-200">
                      {row.Mobile_Number}
                    </TableCell>
                    <TableCell className="border-2 border-gray-200">
                      {row.Email}
                    </TableCell>
                    <TableCell className="border-2 border-gray-200">
                      {row.Date_of_Birth}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    index: PropTypes.number,
    Name: PropTypes.string,
    Email: PropTypes.string,
    role: PropTypes.string,
    EMP_CODE: PropTypes.string,
    Date_of_Birth: PropTypes.string,
    Mobile_Number: PropTypes.string,
    Designation: PropTypes.string,
    ReportingManager: PropTypes.string,
  }).isRequired,
};

export default function CollapsibleTable() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [users, setUsers] = React.useState([]);
  const [canAddUser, setcanAddUser] = React.useState(false);
  const [canUpdateUser, setcanUpdateUser] = React.useState(false);
  const [isDefault, setisDefault] = React.useState(false);
  const [sheetopen, setsheetopen] = React.useState(false);
  const [updatesheetopen, setupdatesheetopen] = React.useState(false);
  const [userid, setuserid] = React.useState(id);
  const [dialogOpen, setdialogOpen] = React.useState(false);

  const dispatch = useDispatch();

  const { createduser, fetchusers, deleteduser, updateduser, loading, error } =
    useSelector((state) => state.createuser);

  React.useEffect(() => {
    setuserid(id);
  }, [id]);

  const openSheet = (id) => {
    navigate(`/users/${id}`);
    setTimeout(() => {
      setupdatesheetopen(true);
    }, 0);
  };

  const openDialog = (id) => {
    navigate(`/users/${id}`);
    setTimeout(() => {
      setdialogOpen(true);
    }, 0);
  };

  React.useEffect(() => {
    async function getDetail() {
      try {
        const res = await axios.get(
          'http://localhost:8000/api/v1/user/role/defaultvalue',
          {
            withCredentials: true,
          }
        );
        setisDefault(res.data.message);
      } catch (error) {
        console.error(
          'Error fetching users:',
          error?.response?.data || error.message
        );
      }
    }
    getDetail();
  }, []);

  // Fetch users
  React.useEffect(() => {
    dispatch(fetchuser());
  }, []);

  React.useEffect(() => {
    if (fetchusers?.message) {
      setUsers(fetchusers.message);
    }
    const createrole = user.permission.user.can_add_user;
    if (createrole === true) {
      setcanAddUser(true);
    } else setcanAddUser(false);
    const updateRole = user.permission.user.can_update_user;
    if (updateRole === true) {
      setcanUpdateUser(true);
    } else {
      setcanUpdateUser(false);
    }
  }, [fetchusers]);

  // Create Users

  React.useEffect(() => {
    if (sheetopen === true) {
      dispatch(createuser());
    }
  }, [sheetopen, dispatch]);

  React.useEffect(() => {
    if (createduser?.success === true) {
      toast.success('User Created Successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      dispatch(fetchuser());
      setsheetopen(false);
      return () => {
        dispatch(resetCreatedUser());
      };
    }
  }, [createduser]);

  // Update Users
  React.useEffect(() => {
    if (updatesheetopen === true) {
      dispatch(updateuser());
    }
  }, [updatesheetopen, dispatch]);

  React.useEffect(() => {
    if (updateduser?.success === true) {
      toast.success('User updated Successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      dispatch(fetchuser());
      return () => {
        dispatch(resetUpdatedUser());
      };
    }
  }, [updateduser]);

  React.useEffect(() => {
    if (error) {
      const errorMessage =
        error.response?.data?.message || error.message || error;
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      });
      dispatch(reseterror());
    }
  }, [error]);

  React.useEffect(() => {
    if (updatesheetopen === false) {
      navigate('/users');
    }
  }, [updatesheetopen]);

  // Delete Users

  React.useEffect(() => {
    if (deleteduser?.success === true) {
      navigate(`/users`, { replace: true });
      toast.success('User Deleted Successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      dispatch(fetchuser());
      return () => {
        dispatch(resetDeletedUser());
      };
    }
  }, [deleteduser, dispatch]);

  const columns = [
    { field: 'expand', headerName: '', width: 50 },
    { field: 'index', headerName: '#' },
    { field: 'Name', headerName: 'Name' },
    { field: 'EMP_CODE', headerName: 'Employee Code' },
    { field: 'role', headerName: 'Role' },
    { field: 'Email', headerName: 'Email' },
    { field: 'Mobile_Number', headerName: 'Mobile Number' },
    { field: 'ReportingManager', headerName: 'Reporting Manager' },
    { field: 'Action', headerName: 'Action' },
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="inline-flex justify-between w-full bg-white h-15 rounded-md mt-1 mb-2">
        <h5 className="text-[22px] font-[450] font-[Inter,sans-serif]  flex items-center ml-2">
          Users
        </h5>
        <div className="flex items-center">
          {user?.permission?.user?.can_view_user_access && (
            <button
              className="bg-[#ffffff] text-[#338DB5] font-[400] gap-2 border-[rgb(51,141,181)] border border-solid cursor-pointer rounded-lg w-[160px] justify-center text-[17px] h-9 mr-3 flex items-center hover:bg-[#dbf4ff]  transition-all duration-300"
              onClick={() => navigate('/users/roles')}
            >
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="#338DB5"
                viewBox="0 0 24 24"
                style={{ fontSize: 'var(--THEME-ICON-SIZE)' }}
              >
                <title>Manage User</title>
                <path
                  fill-rule="evenodd"
                  d="M17 10v1.126c.367.095.714.24 1.032.428l.796-.797 1.415 1.415-.797.796c.188.318.333.665.428 1.032H21v2h-1.126c-.095.367-.24.714-.428 1.032l.797.796-1.415 1.415-.796-.797a3.979 3.979 0 0 1-1.032.428V20h-2v-1.126a3.977 3.977 0 0 1-1.032-.428l-.796.797-1.415-1.415.797-.796A3.975 3.975 0 0 1 12.126 16H11v-2h1.126c.095-.367.24-.714.428-1.032l-.797-.796 1.415-1.415.796.797A3.977 3.977 0 0 1 15 11.126V10h2Zm.406 3.578.016.016c.354.358.574.85.578 1.392v.028a2 2 0 0 1-3.409 1.406l-.01-.012a2 2 0 0 1 2.826-2.83ZM5 8a4 4 0 1 1 7.938.703 7.029 7.029 0 0 0-3.235 3.235A4 4 0 0 1 5 8Zm4.29 5H7a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h6.101A6.979 6.979 0 0 1 9 15c0-.695.101-1.366.29-2Z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Manage Users
            </button>
          )}
          <Sheet open={sheetopen} onOpenChange={setsheetopen}>
            <SheetTrigger
              className={`
                  ${canAddUser ? 'flex' : 'hidden'}
                  `}
            >
              <div className="bg-[#ffffff] text-[#338DB5] font-[400] gap-3 border-[rgb(51,141,181)] border border-solid cursor-pointer rounded-lg w-[130px] justify-center text-[17px] h-9 mr-3 flex items-center hover:bg-[#dbf4ff] transition-all duration-300">
                <svg
                  className="w-6 h-6 flex"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="#338DB5"
                  viewBox="0 0 24 24"
                  style={{ fontSize: 'var(--THEME-ICON-SIZE)' }}
                >
                  <title>Add User</title>
                  <path
                    fill-rule="evenodd"
                    d="M9 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H7Zm8-1a1 1 0 0 1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1Z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                Add user
              </div>
            </SheetTrigger>
            <SheetContent className="bg-white min-w-6xl">
              <SheetHeader>
                <SheetDescription>
                  <AdminForm
                    mode="create"
                    onSubmit={(data) => dispatch(createuser(data))}
                  />
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <ReusableTable
        columns={columns}
        data={users}
        RowComponent={Row}
        pagination={true}
        rowProps={{
          canUpdateUser,
          openSheet,
          navigate,
          isDefault,
          openDialog,
        }}
      />
    </>
  );
}
