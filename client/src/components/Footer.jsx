import { routeSet } from "@/routes/routeSet";
import React from "react";
import { useNavigate } from "react-router";

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer id="footer-section" className="pb-4 pt-md-5 pt-4 mt-lg-3">
      <div className="container">
        <div className="row">
          <div className="col-md-4 col-6 text-center">
            <button
              onClick={() => navigate(routeSet.public.about)}
              className="btn text-black-50 fs-sm-14"
            >
              About Us
            </button>
          </div>
          <div className="col-md-4 col-6 text-center">
            <button
              onClick={() => navigate(routeSet.public.contact)}
              className="btn text-black-50 fs-sm-14"
            >
              Contact Us
            </button>
          </div>
          <div className="col-md-4 col-12 text-center">
            <button
              onClick={() => navigate(routeSet.public.privacyPolicy)}
              className="btn text-black-50 fs-sm-14"
            >
              Privacy Policy
            </button>
          </div>
          <div className="col-lg-12">
            <p className="text-black-50 text-center fs-sm-14 my-3">
              &copy;2025 AskMyNotes. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
