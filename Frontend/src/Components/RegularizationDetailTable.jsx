import * as React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import ReusableTable from './ReusableTable';
import { getRegularizationbyDateandUser } from '../feature/attendancefetch/attendanceSlice.js';
import { useDispatch, useSelector } from 'react-redux';
function Row({ row }) {
  return (
    <React.Fragment>
      <TableRow>
        <TableCell>{row.MissingPunch}</TableCell>
        <TableCell>{row.Reason}</TableCell>
        <TableCell>{row.Remarks}</TableCell>
        <TableCell>{row.Status}</TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    MissingPunch: PropTypes.string,
    Reason: PropTypes.string,
    Remakarks: PropTypes.string,
    Status: PropTypes.string,
  }).isRequired,
};

export default function RegularizationDetailTable({ user, UserName, Date }) {
  const dispatch = useDispatch();
  const [detail, setdetail] = React.useState([]);
  const { fetchedRegularizationByDetail } = useSelector(
    (state) => state.markAttendance
  );
  React.useEffect(() => {
    dispatch(getRegularizationbyDateandUser({ Date: Date, user: user }));
  }, []);

  React.useEffect(() => {
    if (fetchedRegularizationByDetail?.message) {
      setdetail(fetchedRegularizationByDetail.message);
    }
  }, [fetchedRegularizationByDetail]);

  const columns = [
    { field: 'MissingPunch', headerName: 'Missing Punch' },
    { field: 'Reason', headerName: 'Reason' },
    { field: 'Remarks', headerName: 'Remarks' },
    { field: 'Status', headerName: 'Status' },
  ];

  return (
    <>
      <div className="flex w-full mb-6">
        <div className="w-[50%]">
          <h2 className="text-md  mt-4 text-gray-700">
            <p className="font-bold">User Name :</p>
            <p className="text-md text-gray-600 font-[500]">{UserName}</p>
          </h2>
        </div>
        <div className="w-[50%]">
          <h2 className="text-md  mt-4 text-gray-700">
            <p className="font-bold">Date :</p>
            <p className="text-md text-gray-600 font-[500]">{Date}</p>
          </h2>
        </div>
      </div>
      <ReusableTable
        width="full"
        columns={columns}
        data={detail}
        RowComponent={Row}
        pagination={false}
      />
    </>
  );
}
