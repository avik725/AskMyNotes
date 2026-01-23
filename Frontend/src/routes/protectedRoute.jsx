import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import { routeSet } from "./routeSet";

export default function ProtectedRoute() {
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);

  if (!!isLoggedIn) {
    return <Outlet />;
  }

  return <Navigate to={routeSet.auth.login} replace />;
}
