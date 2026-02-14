import { routeSet } from "@/routes/routeSet";
import { forgotUserPasswordHandler } from "@/services/apiHandlers.js";
import fireSweetAlert from "@/utils/fireSweetAlert";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function ForgotPassword() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    dob: "",
    newPassword: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  async function submit() {
    try {
      if (formData.newPassword !== formData.confirmPassword) {
        fireSweetAlert({
          success: false,
          message: "Password and Confirm Password do not match",
        });
        return;
      }

      const response = await forgotUserPasswordHandler({
        username: formData.username,
        email: formData.email,
        dob: formData.dob,
        password: formData.confirmPassword,
      });

      if (response.success) {
        fireSweetAlert({
          success: response.success,
          message: response.message || "Password Changed Successfully !!",
        });
        navigate(routeSet.auth.login);
      }
    } catch (error) {
      fireSweetAlert({
        success: false,
        message:
          error.message || "Something went wrong while updating password",
      });
      console.error("Forgot Password error : ", error);
    }
  }
  return (
    <main id="forgot-password-page">
      {/* Login Section Starts  */}
      <section id="forgot-password-section" class="py-5">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-md-8 col-lg-5 px-4">
              <div class="card rounded-4 border-0 p-4">
                <div class="card-body">
                  <h5 class="card-title text-center mb-4 fw-bold fs-28 fs-sm-24">
                    Verify YourSelf !
                  </h5>
                  <div class="registered-msg border border-warning bg-warning-subtle rounded-3 px-4 py-2 mb-3">
                    <p class="m-0 p-0" style={{ color: "#e0870b" }}>
                      <span style={{ color: "#a36918" }}>Note: </span>Your Date
                      of Birth should be in your Profile
                    </p>
                  </div>
                  <div id="forgot-password-form">
                    <div class="mb-3">
                      <label for="username" class="form-label">
                        Username
                      </label>
                      <input
                        type="text"
                        class="form-control py-md-3 py-2 rounded-4 bg-light fs-sm-14"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={(e) => {
                          setFormData((prev) => {
                            return { ...prev, username: e.target.value };
                          });
                        }}
                        placeholder="Enter your username"
                        required
                      />
                    </div>
                    <div class="mb-3">
                      <label for="email" class="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        class="form-control py-md-3 py-2 rounded-4 bg-light fs-sm-14"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData((prev) => {
                            return { ...prev, email: e.target.value };
                          });
                        }}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div class="mb-3">
                      <label for="dob" class="form-label">
                        Date Of Birth
                      </label>
                      <input
                        type="date"
                        class="form-control py-md-3 py-2 rounded-4 bg-light fs-sm-14"
                        id="dob"
                        name="dob"
                        value={formData.dob}
                        onChange={(e) => {
                          setFormData((prev) => {
                            return { ...prev, dob: e.target.value };
                          });
                        }}
                        placeholder="Enter your date of birth"
                        required
                      />
                    </div>
                    <div class="mb-4">
                      <label for="password" class="form-label">
                        New Password
                      </label>
                      <input
                        type="password"
                        class="form-control py-md-3 py-2 rounded-4 bg-light fs-sm-14"
                        id="password"
                        name="password"
                        value={formData.newPassword}
                        onChange={(e) => {
                          setFormData((prev) => {
                            return { ...prev, newPassword: e.target.value };
                          });
                        }}
                        placeholder="Enter your password"
                        required
                      />
                    </div>

                    <div class="mb-4">
                      <label for="password" class="form-label">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        class="form-control py-md-3 py-2 rounded-4 bg-light fs-sm-14"
                        id="confirm_password"
                        name="confirm_password"
                        value={formData.confirmPassword}
                        onChange={(e) => {
                          setFormData((prev) => {
                            return { ...prev, confirmPassword: e.target.value };
                          });
                        }}
                        placeholder="Confirm password"
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

                    <div class="mb-2">
                      <button
                        class="btn submitBtn theme-bg w-100 py-2 rounded-pill fw-semibold fs-sm-14"
                        onClick={submit}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Login Section Ends  */}
    </main>
  );
}
