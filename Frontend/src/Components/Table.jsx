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
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
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

function Row({
  row,
  updateUser,
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
          backgroundColor: theme === "light" ? "white" : "#161b22",
          color: theme === "light" ? "black" : "#f8f9fa",
        }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <KeyboardArrowUpIcon
                sx={{ color: theme === "light" ? "black" : "#f8f9fa" }}
              />
            ) : (
              <KeyboardArrowDownIcon
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
            backgroundColor: theme === "light" ? "white" : "#161b22",
            color: theme === "light" ? "black" : "#f8f9fa",
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
  const [loading, setLoading] = React.useState(true);
  const [canAddUser, setcanAddUser] = React.useState(false);
  const [canUpdateUser, setcanUpdateUser] = React.useState(false);
  const [isDefault, setisDefault] = React.useState(false);
  const [sheetopen, setsheetopen] = React.useState(false);
  const [updatesheetopen, setupdatesheetopen] = React.useState(false);
  const [userid, setuserid] = React.useState(id);
  const [dialogOpen, setdialogOpen] = React.useState(false);
  const dispatch = useDispatch();

  const { createduser, fetchusers, deleteduser, updateduser } = useSelector(
    (state) => state.createuser
  );

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
        setLoading(false);
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

  const theme = useSelector((state) => state.theme.theme);

  return loading ? (
    <div>Loading....</div>
  ) : (
    <>
      <div className="inline-flex justify-between w-full pb-3 mt-2 ">
        <div className="text-3xl flex ml-2">Users</div>
        <div className="text-3xl flex gap-10">
          <button
            className="bg-[#bfdbfe] cursor-pointer rounded-lg w-35 text-lg"
            onClick={() => navigate("/users/roles")}
          >
            Manage Users
          </button>
          <Sheet open={sheetopen} onOpenChange={setsheetopen}>
            <SheetTrigger
              className={`${
                theme === "light" ? "hover:bg-gray-200" : "hover:bg-gray-700"
              } 
              ${
                canAddUser
                  ? "h-10 w-10 rounded-3xl justify-center flex"
                  : "hidden"
              }
              `}
            >
              +
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
          backgroundColor: theme === "light" ? "white" : "#111827",
          color: theme === "light" ? "black" : "#8a94a7",
          maxHeight: 400,
        }}
      >
        <Table aria-label="collapsible table ">
          <TableHead
            sx={{ backgroundColor: theme === "light" ? "#bfdbfe" : "#374151" }}
          >
            <TableRow>
              <TableCell />
              <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                #
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                Name
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                EMP Code
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                Role
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                Email
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                Mobile
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                Reporting Manager
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                {`${canUpdateUser ? "Action" : ""}`}
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                {isDefault === false ? "Delete" : ""}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.map((user, index) => (
              <Row
                key={user._id}
                row={{ ...user, index: index + 1 }}
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
    </>
  );
}
