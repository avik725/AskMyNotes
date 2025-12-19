import React, { useState } from "react";
import { useNavigate } from "react-router";
import { routeSet } from "@/routes/routeSet";
import {
  checkUsernameIfAvailableHandler,
  userRegistrationHandler,
} from "@/services/apiHandlers";
import fireSweetAlert from "@/utils/fireSweetAlert";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isUsernameAvailable, SetIsUsernameAvailable] = useState(null);

  async function checkUsername(e) {
    e.preventDefault();

    const response = await checkUsernameIfAvailableHandler(formData.username);

    if (response.success) {
      fireSweetAlert({
        success: response.success,
        message: response.message,
      });
      SetIsUsernameAvailable(true);
    } else {
      fireSweetAlert({
        success: response.success,
        message: response.message,
      });
      SetIsUsernameAvailable(false);
    }
  }

  async function submitForm(e) {
    e.preventDefault();

    if (
      formData.username === "" ||
      formData.fullname === "" ||
      formData.email === "" ||
      formData.password === "" ||
      formData.confirmPassword === ""
    ) {
      fireSweetAlert({ success: false, message: "All Fields are Required" });
      return;
    }

    const response = await userRegistrationHandler(formData);

    if (response.success) {
      fireSweetAlert({
        success: response.success,
        message: response.message,
      });
      navigate(routeSet.auth.login);
    } else {
      fireSweetAlert({
        success: response.success,
        message: response.message,
      });
    }
  }

  return (
    <main id="register-page">
      {/* Register Section Starts */}
      <section id="register-section" className="pb-lg-5 pt-lg-5 pt-2">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-8 px-md-4">
              <div className="card rounded-4 border-0 p-4 mt-lg-4">
                <div className="card-body">
                  <h5 className="card-title text-center mb-4 fw-bold fs-28 fs-sm-24">
                    Create new account
                  </h5>
                  <form id="registration-form" onSubmit={(e) => submitForm(e)}>
                    <div className="row pb-4">
                      <div className="col-lg-12">
                        <label htmlFor="username" className="form-label">
                          Username
                        </label>
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="text"
                            className={`form-control py-md-3 py-2 rounded-4 ${
                              isUsernameAvailable === null ? "bg-light" : ""
                            } ${
                              isUsernameAvailable
                                ? "bg-success-subtle border-success"
                                : ""
                            } ${
                              isUsernameAvailable === false
                                ? "bg-danger-subtle border-danger"
                                : ""
                            } fs-sm-14`}
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={(e) =>
                              setFormData((prev) => {
                                return { ...prev, username: e.target.value };
                              })
                            }
                            placeholder="Enter your username"
                            required
                          />
                          <button
                            className="form-control w-25 py-md-3 py-2 h-100 fs-sm-14 rounded-4 theme-bg border-0 fw-semibold"
                            onClick={(e) => checkUsername(e)}
                          >
                            Check
                          </button>
                        </div>
                        <p
                          id="username_validation_message"
                          className={`${
                            isUsernameAvailable === null ? "d-none" : ""
                          } ${
                            isUsernameAvailable === true
                              ? "text-success"
                              : "text-danger"
                          } fs-14 ps-2 py-1 mb-0`}
                        >
                          {isUsernameAvailable === true
                            ? "Username Available"
                            : "Username not available"}
                        </p>
                      </div>
                      <div className="col-lg-6 px-3 pt-3">
                        <label htmlFor="full_name" className="form-label">
                          Full Name
                        </label>
                        <input
                          type="text"
                          className="form-control py-md-3 py-2 rounded-4 bg-light fs-sm-14"
                          id="fullname"
                          name="fullname"
                          value={formData.fullname}
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(
                              /[^a-zA-Z\s]/g,
                              ""
                            );
                          }}
                          onChange={(e) => {
                            setFormData((prev) => {
                              return { ...prev, fullname: e.target.value };
                            });
                          }}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div className="col-lg-6 px-3 pt-3">
                        <label htmlFor="email" className="form-label">
                          Email Address
                        </label>
                        <input
                          type="email"
                          className="form-control py-md-3 py-2 rounded-4 bg-light fs-sm-14"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData((prev) => {
                              return { ...prev, email: e.target.value };
                            })
                          }
                          placeholder="Enter your email address"
                          required
                        />
                      </div>
                      <div className="col-lg-6 px-3 pt-3">
                        <label htmlFor="password" className="form-label">
                          Password
                        </label>
                        <input
                          type="password"
                          className="form-control py-md-3 py-2 rounded-4 bg-light fs-sm-14"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={(e) => {
                            setFormData((prev) => {
                              return { ...prev, password: e.target.value };
                            });
                          }}
                          placeholder="Create a password"
                          required
                        />
                        <p
                          id="password_message"
                          className={`${
                            formData.password === formData.confirmPassword ||
                            (formData.password !== formData.confirmPassword &&
                              formData.confirmPassword == "")
                              ? "d-none"
                              : ""
                          } text-danger fs-14 ps-2 py-1`}
                        >
                          Passwords Mismatched !
                        </p>
                      </div>
                      <div className="col-lg-6 px-3 pt-3">
                        <label
                          htmlFor="confirm_password"
                          className="form-label"
                        >
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          className="form-control py-md-3 py-2 rounded-4 bg-light fs-sm-14"
                          id="confirm_password"
                          name="confirm_password"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            setFormData((prev) => {
                              return {
                                ...prev,
                                confirmPassword: e.target.value,
                              };
                            })
                          }
                          placeholder="Re-enter password"
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <button
                        className={`btn submitBtn ${
                          isUsernameAvailable ? "" : "disabled"
                        } border-0 theme-bg w-100 py-2 rounded-pill fw-semibold fs-sm-14`}
                        type="submit"
                      >
                        Register
                      </button>
                      <p className="form-control-text-color text-center mt-3 fs-sm-14">
                        Already have an account?
                        <button
                          onClick={() => navigate(routeSet.auth.login)}
                          className="btn px-1 form-control-text-color"
                        >
                          Login
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
      {/* Register Section Ends */}
    </main>
  );
}
