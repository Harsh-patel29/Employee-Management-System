import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./feature/datafetch/datafetchSlice";

const PrivateRoute = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth()).finally(() => setLoading(false));
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
