import React from "react";
import logo from "@/assets/images/logo_icon.png";
import { useNavigate } from "react-router";
import { routeSet } from "@/routes/routeSet";
import ThemeButton from "./themeButton";
import { useDispatch, useSelector } from "react-redux";
import { userLogoutHandler } from "@/services/apiHandlers";
import { logout } from "@/store/authSlice";
import fireSweetAlert from "@/utils/fireSweetAlert";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, userData } = useSelector((state) => state.auth);

  async function logoutHandler() {
    const response = await userLogoutHandler();

    fireSweetAlert({
      success: response?.success,
      message: response?.message,
    });
    if (response.success) {
      dispatch(logout());
      navigate(routeSet?.public?.home);
    }
  }

  return (
    <header id="header-section" className="px-4 shadow-sm">
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <a
            className="navbar-brand d-flex align-items-center"
            href={routeSet.public.home}
          >
            <img src={logo} alt="icon" />
            <h5 className="mb-0 ms-2">AskMyNotes</h5>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav pt-2 ps-3 ps-md-4">
              <li className="nav-item">
                <button
                  className="nav-link me-3 text-black"
                  onClick={() => navigate(routeSet.public.home)}
                >
                  Home
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link me-3 text-black"
                  onClick={()=>navigate(routeSet.public.notesGallery)}
                >
                  Notes Library
                </button>
              </li>

              {!isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <ThemeButton
                      onClick={() => navigate(routeSet.auth.login)}
                      className="nav-link"
                    >
                      Login
                    </ThemeButton>
                    <button
                      className="nav-link d-lg-none me-3 text-black"
                      onClick={() => navigate(routeSet.auth.login)}
                    >
                      Login
                    </button>
                  </li>
                  <li className="nav-item">
                    <ThemeButton
                      onClick={() => navigate(routeSet.auth.register)}
                      className="nav-link"
                    >
                      Register
                    </ThemeButton>
                    <button
                      className="nav-link d-lg-none me-3 text-black"
                      onClick={() => navigate(routeSet.auth.register)}
                    >
                      Register
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <button
                      className="nav-link me-3 text-black"
                      onClick={() =>
                        navigate(routeSet.authenticated.uploadNotes)
                      }
                    >
                      Upload Notes
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link me-3 text-black"
                      onClick={() => navigate(routeSet.authenticated.myUploads)}
                    >
                      My Uploads
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link me-3 text-black"
                      onClick={() => navigate(routeSet.authenticated.privateNotes)}
                    >
                      Private Notes
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link me-3 text-black"
                      onClick={() => {}}
                    >
                      Ask AI
                    </button>
                  </li>
                  <li className="nav-item dropdown cursor-pointer">
                    <span
                      className="rounded-circle dropdown-toggle"
                      data-bs-toggle="dropdown"
                      data-bs-auto-close="outside"
                      aria-expanded="false"
                    >
                      <img
                        src={
                          userData.profile_pic.trim() !== "" &&
                          userData.profile_pic !== null
                            ? userData.profile_pic
                            : "assets/images/user_default_logo.png"
                        }
                        alt="icon"
                        className="rounded-circle"
                        style={{ width: 40 }}
                      />
                    </span>
                    <ul className="dropdown-menu dropdown-menu-end mt-2 border-0 shadow-lg">
                      <li>
                        <button
                          className="btn dropdown-item"
                          onClick={() =>
                            navigate(routeSet.authenticated.myProfile)
                          }
                        >
                          My Profile
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item btn"
                          onClick={logoutHandler}
                          id="logoutBtn"
                        >
                          Log Out
                        </button>
                      </li>
                    </ul>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
