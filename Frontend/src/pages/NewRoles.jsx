import React from 'react';
import CreateRoleForm from '../Components/CreateRoleForm';
import { useDispatch, useSelector } from 'react-redux';
import {
  createRole,
  getKeys,
  resetCreatedRole,
  resetUpdatedRole,
  updateRole,
} from '../feature/rolesfetch/getrolesSlice.js';
import { Bounce, toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const NewRoles = () => {
  const dispatch = useDispatch();
  const { createdRole, updatedRole, error } = useSelector(
    (state) => state.getrole
  );
  const { id } = useParams();
  const mode = id ? 'update' : 'create';

  const handleSubmit = async (data) => {
    try {
      if (mode === 'update') {
        dispatch(updateRole({ id, data }));
      } else {
        dispatch(createRole(data));
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      });
    }
  };

  React.useEffect(() => {
    if (error) {
      const errorMessage =
        error.response?.data?.message || error.message || error;
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      });
    }

    if (
      (mode === 'update' && updatedRole?.success) ||
      (mode === 'create' && createdRole?.success)
    ) {
      toast.success(
        `Role ${mode === 'update' ? 'updated' : 'created'} successfully!`,
        {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          transition: Bounce,
        }
      );
    }

    return () => {
      dispatch(resetCreatedRole());
      dispatch(resetUpdatedRole());
    };
  }, [createdRole?.success, updatedRole?.success, error, dispatch, mode]);

  return (
    <div className="min-w-full min-h-screen bg-gray-50">
      <CreateRoleForm onSubmit={handleSubmit} mode={mode} />
    </div>
  );
};

export default NewRoles;
