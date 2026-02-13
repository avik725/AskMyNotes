import React, { useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "@/routes/routes";
import { Provider, useDispatch } from "react-redux";
import { getCurrentUserHandler } from "./services/apiHandlers";
import { login, authCheckComplete } from "./store/authSlice";

export default function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      const response = await getCurrentUserHandler();
      if (response.success) {
        dispatch(login(response.data));
      } else {
        // Auth check finished but user is not logged in
        dispatch(authCheckComplete());
      }
    };
    fetchUser();
  }, [dispatch]);

  return <RouterProvider router={router} />;
}
