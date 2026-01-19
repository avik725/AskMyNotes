import React, { useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "@/routes/routes";
import { Provider, useDispatch } from "react-redux";
import { getCurrentUserHandler } from "./services/apiHandlers";
import { login } from "./store/authSlice";

export default function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      const response = await getCurrentUserHandler();
      if (response.success) {
        dispatch(login(response.data));
      }
    };
    fetchUser();
  }, [dispatch]);

  return <RouterProvider router={router} />;
}
