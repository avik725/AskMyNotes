import { Footer, Header } from "@/components";
import { routeSet } from "@/routes/routeSet";
import { getCurrentUserHandler } from "@/services/apiHandlers";
import { login } from "@/store/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router";

export default function MainLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      const response = await getCurrentUserHandler();
      if (response.success) {
        dispatch(login(response.data));
      }
    };
    fetchUser();
  }, [dispatch]);

  return (
    <>
      {/* Header Section Starts */}
      <Header />
      {/* Header Section Ends */}

      <Outlet />

      {/* Footer Section Starts */}
      <Footer />
      {/* Footer Section Ends */}
    </>
  );
}
