import * as React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router';
import { MdDelete } from 'react-icons/md';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../Components/components/ui/dialog';
import { Button } from '../Components/components/ui/button.tsx';
import { getname } from '../feature/projectfetch/assignuser.js';
import { deleteassignuser } from '../feature/projectfetch/assignuser.js';
import ReusableTable from './ReusableTable.jsx';

function Row({ row, handleDelete }) {
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme.theme);
  const { id } = useParams();
  return (
    <React.Fragment>
      <TableRow
        sx={{
          backgroundColor: theme === 'light' ? 'white' : '#161b22',
          color: theme === 'light' ? 'black' : '#f8f9fa',
        }}
      >
        <TableCell>{row.username}</TableCell>
        <TableCell>{row.rolesName}</TableCell>
        <TableCell sx={{ color: '#ff3b30' }} className="flex">
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
                    onClick={() => handleDelete(id, row.userid, row.roleId)}
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
    username: PropTypes.string,
    rolesName: PropTypes.string,
    userid: PropTypes.string,
    roleId: PropTypes.string,
  }).isRequired,
};

export default function AssignUserTable() {
  const { id } = useParams();
  const [name, setname] = React.useState([]);
  const [userid, setuserid] = React.useState(id);
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();

  const { totalassignedusers, assigneduser, deleteuser } = useSelector(
    (state) => state.assignusers
  );

  React.useEffect(() => {
    dispatch(getname(id));
  }, [dispatch, id]);

  React.useEffect(() => {
    if (totalassignedusers?.message) {
      setname(totalassignedusers.message);
    }
  }, [totalassignedusers]);

  React.useEffect(() => {
    if (assigneduser?.success === true) {
      dispatch(getname(userid));
    }
  }, [assigneduser, userid, dispatch]);

  const handleDelete = async (projectId, userId, roleId) => {
    try {
      dispatch(deleteassignuser({ id: projectId, userId, roleId }));
      setname((prev) => prev.filter((item) => item.userid !== userId));
    } catch (error) {
      console.log('Something went wrong while deleting user', error);
    }
  };

  React.useEffect(() => {
    if (deleteuser?.success === true) {
      navigate(`/productivity/project/${id}`, { replace: true });
      dispatch(getname(userid));
    }
  }, [deleteuser, userid, dispatch, id, navigate]);

  const columns = [
    { field: 'username', headerName: 'User' },
    { field: 'rolesName', headerName: 'Role' },
    { field: 'delete', headerName: 'Delete' },
  ];

  return (
    <>
      <ReusableTable
        columns={columns}
        data={name}
        RowComponent={Row}
        pagination={false}
        tableStyle={{
          '& .MuiTableCell-root': {
            padding: '10px',
          },
        }}
        rowStyle={{
          padding: '10px',
        }}
        rowProps={{
          handleDelete,
        }}
      />
    </>
  );
}
