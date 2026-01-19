import { createRoot } from "react-dom/client";
import "@/assets/css/index.css";
import "@/assets/css/bootstrap.min.css";
import "@/assets/css/sweetalert2.min.css";
import "@/assets/css/mermaid.min.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import store from "@/store/store";
import App from "./App";
import { Provider } from "react-redux";


createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
