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
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { FaEdit } from "react-icons/fa";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../Components/components/ui/sheet";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
} from "../Components/components/ui/drawer.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../Components/components/ui/dialog";
import AuthForm from "./Form.jsx";
import AdminForm from "./AdminForm";
import { MdDelete } from "react-icons/md";
import { Button } from "../Components/components/ui/button.tsx";
import { Bounce, toast } from "react-toastify";
function Row({
  row,
  canAddUser,
  updateUser,
  canUpdateUser,
  canDeleteUser,
  openSheet,
  navigate,
  deleteUser,
}) {
  const [open, setOpen] = React.useState(false);
  const theme = useSelector((state) => state.theme.theme);
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
            <Sheet
              onOpenChange={(open) => {
                if (!open) navigate("/users");
              }}
            >
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
                    {<AdminForm onSubmit={updateUser} />}
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          }
        </TableCell>
        <TableCell
          sx={{ color: "#ff3b30" }}
          className={`${canAddUser ? "flex" : "hidden"}`}
        >
          <Dialog
            onOpenChange={(open) => {
              if (!open) navigate("/users");
            }}
          >
            <DialogTrigger
              onClick={() => {
                openSheet(row._id);
              }}
              asChild
            >
              <MdDelete
                className={`${
                  canDeleteUser ? "font-semibold text-lg" : "hidden"
                }`}
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
                      deleteUser();
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
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [canAddUser, setcanAddUser] = React.useState(false);
  const [canUpdateUser, setcanUpdateUser] = React.useState(false);
  const [canDeleteUser, setcanDeleteUser] = React.useState(false);

  React.useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/user/", {
          withCredentials: true,
        });
        setUsers(res.data.message);
      } catch (error) {
        console.error(
          "Error fetching users:",
          error?.response?.data || error.message
        );
      } finally {
        setLoading(false);
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
      const deleteRole = user.permission.can_delete_user;
      if (deleteRole === true) {
        setcanDeleteUser(true);
      } else {
        setcanDeleteUser(false);
      }
    }
    fetchUsers();
  }, []);

  const { id } = useParams();
  const [sheetopen, setsheetopen] = React.useState(false);
  const [userid, setuserid] = React.useState(id);

  const openSheet = (id) => {
    navigate(`/users/${id}`);
    setTimeout(() => {
      setsheetopen(true);
    }, 0);
  };

  React.useEffect(() => {
    setuserid(id);
  }, [id]);

  const addUser = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/createUser",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success === true) {
        navigate("/dashboard");
        toast.success("User Created Successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.log("Something went wrong while creating user");
    }
  };

  const updateUser = async (data) => {
    const res = await axios.put(
      `http://localhost:8000/api/v1/user/${id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    if (res.data.success === true) {
      navigate("/dashboard");
      toast.success("User Updated Successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
    return res.data;
  };

  const deleteUser = async () => {
    const res = await axios.delete(`http://localhost:8000/api/v1/user/${id}`, {
      withCredentials: true,
    });
    if (res.data.success === true) {
      navigate("/dashboard");
      toast.success("User Deleted Successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
    return res.data;
  };

  const theme = useSelector((state) => state.theme.theme);

  return loading ? (
    <div>Loading....</div>
  ) : (
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: theme === "light" ? "white" : "#111827",
        color: theme === "light" ? "black" : "#8a94a7",
        maxHeight: 400,
      }}
    >
      <div className="text-3xl pb-4 flex ml-2 justify-between mt-2  ">
        Users
        <Drawer>
          <DrawerTrigger
            className={`${canAddUser ? "flex" : "hidden"}
            ${theme === "light" ? "hover:bg-gray-200" : " hover:bg-gray-700"}
            w-10 h-10 rounded-3xl justify-center`}
          >
            +
          </DrawerTrigger>
          <DrawerContent
            className={`${theme === "light" ? "bg-white" : "bg-[#121212]"}
              ${theme === "light" ? "text-black" : "text-white"}
            `}
          >
            <AuthForm onSubmit={addUser} />
          </DrawerContent>
        </Drawer>
      </div>
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
              {`${canDeleteUser ? "Delete" : ""}`}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index) => (
            <Row
              key={user._id}
              row={{ ...user, index: index + 1 }}
              canAddUser={canAddUser}
              canUpdateUser={canUpdateUser}
              canDeleteUser={canDeleteUser}
              addUser={addUser}
              updateUser={updateUser}
              openSheet={openSheet}
              navigate={navigate}
              deleteUser={deleteUser}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
