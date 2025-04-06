import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./feature/datafetch/datafetchSlice";
import Loader from "./Components/Loader";

const PrivateRoute = () => {
  const dispatch = useDispatch();
  const [initialLoading, setInitialLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth())
      .finally(() => setInitialLoading(false));
  }, [dispatch]);

  if (initialLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#f4f4f4]">
        <Loader />
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
