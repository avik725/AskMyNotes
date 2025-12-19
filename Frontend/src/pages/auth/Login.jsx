import React, { useEffect, useState } from "react";
import { getCurrentUser } from "@/services/apiEndPoints";
import { Header } from "@/components";
import { useNavigate } from "react-router";
import { routeSet } from "@/routes/routeSet";
import { useDispatch } from "react-redux";
import { login } from "@/store/authSlice";
import {
  getCurrentUserHandler,
  userLoginHandler,
} from "@/services/apiHandlers";
import fireSweetAlert from "@/utils/fireSweetAlert";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  async function onSubmitHandler(e) {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setError(true);
      fireSweetAlert({
        success: false,
        message: "Username or Password Should not be Empty !!",
      });
      return;
    }

    const response = await userLoginHandler(formData);

    fireSweetAlert({
      success: response.success,
      message: response.message,
    });
    if (response.success) {
      dispatch(login(response.data.user));
      navigate(routeSet.public.home);
    } else {
      setError(true);
    }
  }

  return (
    <main id="login-page">
      {/* Login Section Starts */}
      <section id="login-section" className="py-5 mt-lg-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-5 px-4">
              <div className="card rounded-4 border-0 p-4">
                <div className="card-body">
                  <h5 className="card-title text-center mb-4 fw-bold fs-28 fs-sm-24">
                    Welcome Back
                  </h5>
                  <div className="d-none registered-msg border border-success bg-success-subtle rounded-3 px-4 py-2 mb-3">
                    <p className="text-success m-0 p-0">
                      Registered Successfully ! You can login now...
                    </p>
                  </div>
                  <form id="login-form" onSubmit={(e) => onSubmitHandler(e)}>
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">
                        Username
                      </label>
                      <input
                        type="text"
                        className={`form-control py-md-3 py-2 rounded-4 ${
                          error ? "bg-danger-subtle border-danger" : "bg-light"
                        } fs-sm-14`}
                        id="username"
                        name="username"
                        placeholder="Enter your username"
                        onChange={(e) =>
                          setFormData((prev) => {
                            return { ...prev, username: e.target.value };
                          })
                        }
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        Password
                      </label>
                      <input
                        type="password"
                        className={`form-control py-md-3 py-2 rounded-4 ${
                          error ? "bg-danger-subtle border-danger" : "bg-light"
                        } fs-sm-14`}
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        onChange={(e) =>
                          setFormData((prev) => {
                            return { ...prev, password: e.target.value };
                          })
                        }
                        required
                      />
                      <p className="form-control-text-color text-end mt-3 fs-sm-14">
                        <a
                          href={routeSet.auth.forgotPassword}
                          className="btn p-1 form-control-text-color"
                        >
                          Forgot password ?
                        </a>
                      </p>
                    </div>
                    <div className="mb-3">
                      <button
                        className="btn theme-bg w-100 py-2 rounded-pill fw-semibold fs-sm-14"
                        type="submit"
                      >
                        Login
                      </button>
                      <p className="form-control-text-color text-center mt-3 fs-sm-14">
                        Don't have an account?
                        <button
                          onClick={() => navigate(routeSet.auth.register)}
                          className="btn px-1 form-control-text-color"
                        >
                          Register
                        </button>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Login Section Ends */}
    </main>
  );
}
