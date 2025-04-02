import * as React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { data, useNavigate, useParams } from "react-router";
import { FaEdit } from "react-icons/fa";
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
import AdminForm from "./AdminForm";
import { MdDelete } from "react-icons/md";
import { Button } from "../Components/components/ui/button.tsx";
import { Bounce, toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { createuser } from "../feature/createuserfetch/createuserSlice.js";
import { fetchuser } from "../feature/createuserfetch/createuserSlice.js";
import { deleteuser } from "../feature/createuserfetch/createuserSlice.js";
import { updateuser } from "../feature/createuserfetch/createuserSlice.js";
import TablePagination from "@mui/material/TablePagination";
import Loader from "../Components/Loader.jsx";
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

  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();
  return (
    <React.Fragment>
      <TableRow
        sx={{
          backgroundColor: "white",
          color: "black",
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
                sx={{ color: theme === "light" ? "black" : "#f8f9fa" }}
              />
            ) : (
              <KeyboardArrowRightIcon
                sx={{ color: theme === "light" ? "black" : "#f8f9fa" }}
              />
            )}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" sx={{ color: "inherit" }}>
          {row.index}
        </TableCell>
        <TableCell component="th" scope="row" sx={{ color: "inherit" }}>
          {row.Name}
        </TableCell>
        <TableCell sx={{ color: "inherit" }}>{row.EMP_CODE}</TableCell>
        <TableCell sx={{ color: "inherit" }}>{row.role}</TableCell>
        <TableCell sx={{ color: "inherit" }}>{row.Email}</TableCell>
        <TableCell sx={{ color: "inherit" }}>{row.Mobile_Number}</TableCell>
        <TableCell sx={{ color: "inherit" }}>{row.ReportingManager}</TableCell>
        <TableCell sx={{ color: "inherit" }}>
          {
            <Sheet open={updatesheetopen} onOpenChange={setupdatesheetopen}>
              <SheetTrigger
                onClick={() => {
                  openSheet(row._id);
                }}
                asChild
              >
                <FaEdit
                  className={`${
                    canUpdateUser ? "font-semibold text-lg" : "hidden"
                  }`}
                />
              </SheetTrigger>
              <SheetContent
                className={`${theme === "light" ? "bg-white " : "bg-[#121212]"} 
                min-w-6xl`}
              >
                <SheetHeader>
                  <SheetDescription>
                    <AdminForm
                      mode="update"
                      onSubmit={(data) => {
                        dispatch(updateuser({ data, userid: row._id }));
                        setupdatesheetopen(false);
                      }}
                    />
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          }
        </TableCell>
        <TableCell
          sx={{ color: "#ff3b30" }}
          className={`${isDefault ? "hidden" : "flex"}`}
        >
          <Dialog
            onOpenChange={(open) => {
              if (!open) navigate("/users");
            }}
          >
            <DialogTrigger
              onClick={() => {
                openDialog(row._id);
              }}
              asChild
            >
              <MdDelete
                className={
                  isDefault === false ? "font-semibold text-lg" : "hidden"
                }
              />
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
                      dispatch(deleteuser(row._id));
                      navigate("/users");
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
      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={10}
          sx={{
            backgroundColor: "white",
            color: "black",
          }}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Additional Details
              </Typography>
              <Typography variant="body2">
                DOJ: {row.DATE_OF_JOINING}
              </Typography>
              <Typography variant="body2">
                Mobile: {row.Mobile_Number}
              </Typography>
              <Typography variant="body2">Email: {row.Email}</Typography>
              <Typography variant="body2">
                Date of Birth: {row.Date_of_Birth}
              </Typography>
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
  // const [loading, setLoading] = React.useState(true);
  const [canAddUser, setcanAddUser] = React.useState(false);
  const [canUpdateUser, setcanUpdateUser] = React.useState(false);
  const [isDefault, setisDefault] = React.useState(false);
  const [sheetopen, setsheetopen] = React.useState(false);
  const [updatesheetopen, setupdatesheetopen] = React.useState(false);
  const [userid, setuserid] = React.useState(id);
  const [dialogOpen, setdialogOpen] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const dispatch = useDispatch();

  const { createduser, fetchusers, deleteduser, updateduser, loading } =
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
          "http://localhost:8000/api/v1/user/role/defaultvalue",
          {
            withCredentials: true,
          }
        );
        setisDefault(res.data.message);
      } catch (error) {
        console.error(
          "Error fetching users:",
          error?.response?.data || error.message
        );
      } finally {
        setLoading(true);
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
    const createrole = user.permission.can_add_user;
    if (createrole === true) {
      setcanAddUser(true);
    } else setcanAddUser(false);
    const updateRole = user.permission.can_update_user;
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
      dispatch(fetchuser());
      setsheetopen(false);
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
      setupdatesheetopen(false);
      dispatch(fetchuser());
    }
  }, [updateduser]);

  React.useEffect(() => {
    if (updatesheetopen === false) {
      navigate("/users");
    }
  }, [updatesheetopen]);

  // Delete Users

  React.useEffect(() => {
    if (deleteduser?.success === true) {
      navigate(`/users`, { replace: true });
      dispatch(fetchuser());
    }
  }, [deleteduser, dispatch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedUsers = users.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const theme = useSelector((state) => state.theme.theme);

  return loading ? (
    <Loader />
  ) : (
    <>
      <div className="inline-flex justify-between w-full bg-white h-15 rounded-md mt-1">
        <h5 className="text-[22px] font-[450] font-[Inter,sans-serif]  flex items-center ml-2">
          Users
        </h5>
        <div className="flex items-center">
          <button
            className="bg-[#ffffff] text-[#338DB5] font-[400] gap-2 border-[rgb(51,141,181)] border border-solid cursor-pointer rounded-lg w-[160px] justify-center text-[17px] h-9 mr-3 flex items-center hover:bg-[#dbf4ff]  transition-all duration-300"
            onClick={() => navigate("/users/roles")}
          >
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="#338DB5"
              viewBox="0 0 24 24"
              style={{ fontSize: "var(--THEME-ICON-SIZE)" }}
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
          <Sheet open={sheetopen} onOpenChange={setsheetopen}>
            <SheetTrigger
              className={`
                  ${canAddUser ? "flex" : "hidden"}
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
                  style={{ fontSize: "var(--THEME-ICON-SIZE)" }}
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
            <SheetContent
              className={`${theme === "light" ? "bg-white " : "bg-[#121212]"} 
                min-w-6xl`}
            >
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
          aria-label="collapsible table"
          sx={{
            "& .MuiTableCell-root": {
              padding: 0.4,
            },
          }}
        >
          <TableHead sx={{ backgroundColor: "#c1dde9" }}>
            <TableRow className="h-2">
              <TableCell />
              <TableCell sx={{ fontWeight: "200", fontSize: "medium" }}>
                #
              </TableCell>
              <TableCell sx={{ fontWeight: "200", fontSize: "medium" }}>
                Name
              </TableCell>
              <TableCell sx={{ fontWeight: "200", fontSize: "medium" }}>
                EMP Code
              </TableCell>
              <TableCell sx={{ fontWeight: "200", fontSize: "medium" }}>
                Role
              </TableCell>
              <TableCell sx={{ fontWeight: "200", fontSize: "medium" }}>
                Email
              </TableCell>
              <TableCell sx={{ fontWeight: "200", fontSize: "medium" }}>
                Mobile
              </TableCell>
              <TableCell sx={{ fontWeight: "200", fontSize: "medium" }}>
                Reporting Manager
              </TableCell>
              <TableCell sx={{ fontWeight: "200", fontSize: "medium" }}>
                {`${canUpdateUser ? "Action" : ""}`}
              </TableCell>
              <TableCell sx={{ fontWeight: "200", fontSize: "medium" }}>
                {isDefault === false ? "Delete" : ""}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers?.map((user, index) => (
              <Row
                key={user._id}
                row={{ ...user, index: page * rowsPerPage + index + 1 }}
                canAddUser={canAddUser}
                canUpdateUser={canUpdateUser}
                openSheet={openSheet}
                openDialog={openDialog}
                navigate={navigate}
                sheetopen={sheetopen}
                dialogOpen={dialogOpen}
                currentId={userid}
                isDefault={isDefault}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        className="flex w-full justify-center"
        component="div"
        count={users.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}
