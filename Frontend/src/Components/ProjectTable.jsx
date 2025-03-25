import * as React from "react";
import PropTypes from "prop-types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetDescription,
} from "../Components/components/ui/sheet";
import ProjectForm from "./ProjectForm.jsx";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import { createproject } from "../feature/projectfetch/createproject.js";
import { getProjects } from "../feature/projectfetch/createproject.js";
function Row({ row, openMap }) {
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
        <TableCell>{row.index}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            {row.logo}
            <Link
              to={`/productivity/project/${row._id}`}
              style={{ color: "#408cb6" }}
            >
              {row.name}
            </Link>
          </div>
        </TableCell>
        <TableCell>{row.progress_status}</TableCell>
        <TableCell>{row.status}</TableCell>
        <TableCell></TableCell>
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

  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);

  const { project, projects, loading, error } = useSelector(
    (state) => state.project
  );

  React.useEffect(() => {
    dispatch(getProjects());
  }, []);
  console.log(projects);

  React.useEffect(() => {
    if (projects?.message) {
      setProjects(projects.message);
    } else {
      setProjects([]);
    }
  }, [projects]);

  React.useEffect(() => {
    if (project?.success == true) {
      dispatch(getProjects());
      setsheetopen(false);
    }
  }, [project?.success]);

  return loading ? (
    <div>Loading...</div>
  ) : (
    <>
      <div className="inline-flex justify-between w-full pb-3 mt-2 ">
        <div className="text-3xl flex ml-2">Project</div>
        <div className="flex">
          <button className="bg-[#bfdbfe] cursor-pointer rounded-lg w-35 text-lg h-10 mr-8">
            Filter
          </button>
          <Sheet open={sheetopen} onOpenChange={setsheetopen}>
            <SheetTrigger>
              <button className="bg-[#bfdbfe] cursor-pointer rounded-lg w-35 h-10 text-lg mr-8">
                Create Project
              </button>
            </SheetTrigger>
            <SheetContent
              className={`${theme === "light" ? "bg-white " : "bg-[#121212]"} 
            min-w-2xl`}
            >
              <SheetHeader>
                <h1 className="text-2xl font-semibold w-full flex justify-center">
                  Create Project
                </h1>
                <SheetDescription>
                  <ProjectForm
                    onSubmit={(formdata) => dispatch(createproject(formdata))}
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
        <Table>
          <TableHead
            sx={{ backgroundColor: theme === "light" ? "#bfdbfe" : "#374151" }}
          >
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                #
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                Project
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                Progress
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                Status
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Projects.map((project, index) => (
              <Row
                key={project._id}
                row={{
                  ...project,
                  index: index + 1,
                  logo: (
                    <img
                      src={project.logo}
                      alt="Project"
                      className="w-12 h-12 object-cover rounded-3xl"
                    />
                  ),
                }}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
