import React from "react";
import CreateRoleForm from "../Components/CreateRoleForm";
import { useDispatch, useSelector } from "react-redux";
import { createRole, getKeys, resetCreatedRole, updateRole } from "../feature/rolesfetch/getrolesSlice.js";
import { Bounce, toast } from "react-toastify";
import { useParams } from "react-router-dom";

const NewRoles = () => {
  const dispatch = useDispatch();
  const { createdRole, updatedRole } = useSelector((state) => state.getrole);
  const { id } = useParams();
  const mode = id ? "update" : "create";

  const handleSubmit = async (data) => {
    if (mode === "update") {
      dispatch(updateRole({ id, data }));
    } else {
      dispatch(createRole(data));
    }
  };

  React.useEffect(() => {
    if ((mode === "update" && updatedRole?.success) || (mode === "create" && createdRole?.success)) {
      toast.success(`Role ${mode === "update" ? "updated" : "created"} successfully!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }

    return () => {
      dispatch(resetCreatedRole());
    };
  }, [createdRole?.success, updatedRole?.success, dispatch, mode]);

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <CreateRoleForm onSubmit={handleSubmit} mode={mode} />
    </div>
  );
};

export default NewRoles;
