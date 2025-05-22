import * as React from 'react';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';

const ReusableTable = ({
  columns,
  data,
  RowComponent,
  rowProps = {},
  pagination = true,
  containerStyle = {},
  tableStyle = {},
  headStyle = {},
  cellStyle = {},
  maxHeight = 500,
  width = '98%',
  noDataMessageField = true,
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = pagination
    ? data?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : data;

  function noDataMessage() {
    return (
      <TableRow className="flex h-10">
        <TableCell
          colSpan={columns.length}
          align="center"
          className="font-semibold text-[15px]"
        >
          <h3 className="text-[14px]">There is no Data to display</h3>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <div className={`${noDataMessageField === true ? '' : 'hidden'}`}>
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: 'white',
          marginTop: 0.5,
          color: 'black',
          maxHeight: { maxHeight },
          width: { width },
          borderRadius: 2,
          ...containerStyle,
        }}
      >
        <Table
          sx={{
            '& .MuiTableCell-root': {
              padding: 0.4,
              color: 'black',
              textAlign: 'center',
            },
            ...tableStyle,
          }}
        >
          <TableHead
            sx={{
              backgroundColor: '#c1dde9',
              height: '40px',
              position: 'sticky',
              top: 0,
              zIndex: 40,
              ...headStyle,
            }}
          >
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  sx={{
                    fontWeight: '200',
                    fontSize: 'medium',
                    ...cellStyle,
                  }}
                >
                  {column.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData && paginatedData.length > 0
              ? paginatedData?.map((row, index) => (
                  <RowComponent
                    key={row._id || index}
                    row={{
                      ...row,
                      index: pagination
                        ? page * rowsPerPage + index + 1
                        : index + 1,
                    }}
                    {...rowProps}
                  />
                ))
              : noDataMessageField === true
                ? noDataMessage()
                : ''}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && (
        <TablePagination
          className="flex w-full justify-center"
          component="div"
          count={data?.length || 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </div>
  );
};

ReusableTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      headerName: PropTypes.string.isRequired,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  RowComponent: PropTypes.elementType.isRequired,
  rowProps: PropTypes.object,
  pagination: PropTypes.bool,
  containerStyle: PropTypes.object,
  tableStyle: PropTypes.object,
  headStyle: PropTypes.object,
  cellStyle: PropTypes.object,
};

export default ReusableTable;
