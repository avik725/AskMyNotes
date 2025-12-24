import { createRoot } from "react-dom/client";
import "@/assets/css/index.css";
import "@/assets/css/bootstrap-select.css";
import "@/assets/css/bootstrap.min.css";
import "@/assets/css/sweetalert2.min.css";
import "@/assets/css/mermaid.min.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { RouterProvider } from "react-router";
import { router } from "@/routes/routes";
import { Provider } from "react-redux";
import store from "@/store/store";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
