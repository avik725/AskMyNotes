import { Footer, Header } from "@/components";
import { Outlet } from "react-router";

export default function MainLayout() {
  

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
