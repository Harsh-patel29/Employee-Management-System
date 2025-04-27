import * as React from 'react';
import PropTypes, { func } from 'prop-types';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useSelector, useDispatch } from 'react-redux';
import ReusableTable from './ReusableTable.jsx';
import { getAllTasks } from '../feature/taskfetch/taskfetchSlice.js';
import { useNavigate } from 'react-router';
import { Table } from '@mui/material';
function Row({ row }) {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  return (
    <React.Fragment>
      <TableRow>
        <TableCell>{row.index}</TableCell>
        <TableCell>
          {user?.permission.task.canUpdateTask}
          <p
            className="text-[rgb(64,140,182)] cursor-pointer"
            onClick={() => {
              {
                user?.permission.task.canUpdateTask
                  ? navigate(`/productivity/tasks/${row.CODE}`)
                  : '';
              }
            }}
          >
            {row.CODE}
          </p>
        </TableCell>
        <TableCell>{row.title}</TableCell>
        <TableCell>{row.Project}</TableCell>
        <TableCell>{row.EndDate}</TableCell>
        <TableCell>{row.Status}</TableCell>
        <TableCell>{row.Asignee}</TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    index: PropTypes.number,
    CODE: PropTypes.string,
    title: PropTypes.string,
    Project: PropTypes.string,
    EndDate: PropTypes.string,
    Status: PropTypes.string,
    Asignee: PropTypes.string,
  }).isRequired,
};
export default function DashTaskTable() {
  const dispatch = useDispatch();
  const [Tasks, setTasks] = React.useState([]);
  const [taskid, settaskid] = React.useState();
  const { tasks } = useSelector((state) => state.task);

  React.useEffect(() => {
    dispatch(getAllTasks());
  }, []);

  React.useEffect(() => {
    if (tasks?.message) {
      setTasks(tasks.message);
    } else {
      setTasks([]);
    }
  }, [tasks]);

  const filteredTask = Tasks?.filter(
    (t) =>
      t.Status !== 'Completed' &&
      t.Status !== 'Deployed' &&
      t.Status !== 'Done' &&
      t.Status !== 'Backlog'
  );

  const columns = [
    { field: 'index', headerName: '#' },
    { field: 'CODE', headerName: 'Code' },
    { field: 'title', headerName: 'Task Name' },
    { field: 'Project', headerName: 'Project' },
    { field: 'EndDate', headerName: 'End Date' },
    { field: 'Status', headerName: 'Status' },
    { field: 'Asignee', headerName: 'Asignee' },
  ];
  return (
    <ReusableTable
      maxHeight={200}
      data={filteredTask}
      RowComponent={Row}
      columns={columns}
      pagination={true}
    />
  );
}
