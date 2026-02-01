import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import { routeSet } from "./routeSet";
import Loader from "@/components/Loader";

export default function ProtectedRoute() {
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  const isAuthChecking = useSelector((state) => state?.auth?.isAuthChecking);

  if (isAuthChecking) {
    return <Loader />;
  }

  if (isLoggedIn) {
    return <Outlet />;
  }

  return <Navigate to={routeSet.auth.login} replace />;
}

