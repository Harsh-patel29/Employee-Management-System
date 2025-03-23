import * as React from "react";
import PropTypes from "prop-types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../Components/components/ui/dialog";
import { Button } from "../Components/components/ui/button.tsx";

function Row({ row, handleDelete, userId, roleId }) {
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme.theme);
  const { id } = useParams();
  return (
    <React.Fragment>
      <TableRow
        sx={{
          backgroundColor: theme === "light" ? "white" : "#161b22",
          color: theme === "light" ? "black" : "#f8f9fa",
        }}
      >
        <TableCell>{row.user}</TableCell>
        <TableCell>{row.Role}</TableCell>
        <TableCell sx={{ color: "#ff3b30" }} className="flex">
          <Dialog
            onOpenChange={(open) => {
              if (!open) navigate(`/productivity/project/${id}`);
            }}
          >
            <DialogTrigger
              onClick={() => {
                navigate(
                  `/productivity/project/${id}/${row.userid}/${row.roleId}`
                );
              }}
              asChild
            >
              <MdDelete className="font-semibold text-lg" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the
                  user's account and remove their data from servers.
                  <Button
                    className="flex w-full mt-4 bg-red-600 hover:bg-red-800"
                    onClick={() => handleDelete(row.userid, row.roleId)}
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
    user: PropTypes.number,
    Role: PropTypes.string,
  }).isRequired,
};
export default function AssignUserTable() {
  const { id } = useParams();
  const [name, setname] = React.useState([]);
  const [userid, setuserid] = React.useState(id);

  const theme = useSelector((state) => state.theme.theme);

  const dispatch = useDispatch();

  React.useEffect(() => {
    const getname = async (id) => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v3/project/project/roles/details/name/${userid}`,
          { withCredentials: true }
        );
        setname(res.data.message);
        return res.data;
      } catch (error) {
        console.log("Something wrong while fetching username", error);
      }
    };
    getname();
  }, [id]);

  React.useEffect(() => {
    setuserid(id);
  }, []);

  const handleDelete = async (userId, roleId) => {
    try {
      await deleteAssignedUser(userId, roleId);
    } catch (error) {
      console.log("Error in handleDelete:", error);
    }
  };

  const deleteAssignedUser = async (userId, roleId) => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v3/project/project/roles/details/name/delete/role/${id}/${userId}/${roleId}`,
        { withCredentials: true }
      );
      if (res.data.success === true) {
        window.location.assign(`/productivity/project/${id}`);
      }
      return res.data;
    } catch (error) {
      console.log("Something went wrong while deleting assigned user", error);
    }
  };

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: theme === "light" ? "white" : "#111827",
          color: theme === "light" ? "black" : "#8a94a7",
          maxHeight: 400,
        }}
      >
        <Table>
          <TableHead
            sx={{ backgroundColor: theme === "light" ? "#bfdbfe" : "#374151" }}
          >
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                User
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                Role
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {name.map((name) => (
              <Row
                key={name?.userid}
                row={{
                  ...name,
                  user: name?.username,
                  Role: name?.rolesName,
                }}
                handleDelete={handleDelete}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
