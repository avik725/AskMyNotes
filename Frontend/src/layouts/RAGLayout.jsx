import { Footer, Header } from "@/components";
import { getCurrentUserHandler } from "@/services/apiHandlers";
import { login } from "@/store/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router";

export default function RAGLayout() {

  return (
    <>

      <Outlet />

      {/* Footer Section Starts */}
      <section>
        <p>AskMyNotes AI can be inaccurate; please double-check its responses.</p>
      </section>
      {/* Footer Section Ends */}
    </>
  );
}
