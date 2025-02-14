import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./feature/datafetch/datafetchSlice.js";

const PrivateRoute = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth()); // Check authentication status on page load
  }, [dispatch]);

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
