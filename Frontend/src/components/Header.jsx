import React from "react";
import logo from "@/assets/images/amn_logo.png";
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
    <header 
      id="header-section" 
      className="px-4 shadow-sm bg-white" 
      style={{ 
        width: '100%' 
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .nav-link-custom {
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: inline-block;
          font-weight: 500;
        }
        .nav-link-custom:hover {
          transform: scale(1.05) translateY(-2px);
          text-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .nav-item {
          perspective: 1000px;
        }
      `}} />

      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <a
            className="navbar-brand d-flex align-items-end"
            href={routeSet.public.home}
          >
            <img src={logo} alt="icon" style={{maxWidth: 40}} />
            <h3 className="mb-0 ms-2 fs-26 d-none d-md-block fw-bold">AskMyNotes</h3>
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
            <ul className="navbar-nav pt-2 ps-3 ps-md-4 align-items-center">
              <li className="nav-item">
                <button
                  className="nav-link me-3 text-black nav-link-custom shadow-none border-0 bg-transparent"
                  onClick={() => navigate(routeSet.public.home)}
                >
                  Home
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link me-3 text-black nav-link-custom shadow-none border-0 bg-transparent"
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
                      className="nav-link nav-link-custom"
                    >
                      Login
                    </ThemeButton>
                  </li>
                  <li className="nav-item ms-lg-2">
                    <ThemeButton
                      onClick={() => navigate(routeSet.auth.register)}
                      className="nav-link nav-link-custom"
                    >
                      Register
                    </ThemeButton>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <button
                      className="nav-link me-3 text-black nav-link-custom shadow-none border-0 bg-transparent"
                      onClick={() => navigate(routeSet.authenticated.publishedNotes)}
                    >
                      Published Notes
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link me-3 text-black nav-link-custom shadow-none border-0 bg-transparent"
                      onClick={() => navigate(routeSet.authenticated.privateNotes)}
                    >
                      Private Notes
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link me-3 text-black nav-link-custom shadow-none border-0 bg-transparent"
                      onClick={() => navigate(routeSet.authenticated.askAI)}
                    >
                      Ask AI
                    </button>
                  </li>
                  <li className="nav-item dropdown cursor-pointer ms-lg-3">
                    <span
                      className="rounded-circle dropdown-toggle nav-link-custom"
                      data-bs-toggle="dropdown"
                      data-bs-auto-close="outside"
                      aria-expanded="false"
                    >
                      <img
                        src={
                          userData?.profile_pic?.trim() !== "" &&
                          userData?.profile_pic !== null &&
                          userData?.profile_pic !== undefined
                            ? userData.profile_pic
                            : "/assets/images/user_default_logo.png"
                        }
                        alt="icon"
                        className="rounded-circle border"
                        style={{ width: 40, height: 40, objectFit: 'cover' }}
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
                          className="dropdown-item btn text-danger"
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