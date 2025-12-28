import React, { useEffect, useState } from "react";
import user_default_logo from "@/assets/images/user_default_logo.png";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentUserHandler,
  getStreamsHandler,
  userProfileUpdateHandler,
} from "@/services/apiHandlers";
import fireSweetAlert from "@/utils/fireSweetAlert";
import { login } from "@/store/authSlice";
import { ReactSelect } from "@/components";

export default function MyProfile() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state?.auth?.userData);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [formData, setFormData] = useState({
    fullname: userInfo?.fullname || "",
    email: userInfo?.email || "",
    dob: userInfo?.dob || "",
    gender: userInfo?.gender || "",
    mobile: userInfo?.mobile || "",
    address: userInfo?.address || "",
    prefered_stream: userInfo?.prefered_stream || "",
    prefered_language: userInfo?.prefered_language || "",
  });
  const [streams, setStreams] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // Update formData when userInfo changes as getCurrentUser needs Time to Fetch Data from server
  useEffect(() => {
    if (userInfo) {
      setFormData({
        fullname: userInfo?.fullname || "",
        email: userInfo?.email || "",
        dob: userInfo?.dob || "",
        gender: userInfo?.gender || "",
        mobile: userInfo?.mobile || "",
        address: userInfo?.address || "",
        prefered_stream: userInfo?.prefered_stream || "",
        prefered_language: userInfo?.prefered_language || "",
      });
    }
  }, [userInfo]);

  // Create preview URL when profilePic changes
  useEffect(() => {
    if (profilePic) {
      const objectUrl = URL.createObjectURL(profilePic);
      setProfilePicPreview(objectUrl);

      // Cleanup function to revoke the object URL
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else {
      setProfilePicPreview(null);
    }
  }, [profilePic]);

  useEffect(() => {
    async function getStreams() {
      const response = await getStreamsHandler();
      const option = { name: "Select Stream", _id: "" };
      setStreams([option, ...response.data]);
    }
    getStreams();
  }, []);

  function initializeSelectpickers(identifier) {
    if (
      $(identifier).length &&
      typeof $(identifier).selectpicker === "function"
    ) {
      if ($(identifier).data("selectpicker")) {
        $(identifier).selectpicker("destroy");
      }
      $(identifier).selectpicker();
    }
  }

  function refreshSelectpickers(identifier) {
    if (
      $(identifier).length &&
      typeof $(identifier).selectpicker === "function"
    ) {
      $(identifier).selectpicker("refresh");
    }
  }

  // Initialize selectpickers on Load
  useEffect(() => {
    const timer = setTimeout(() => {
      initializeSelectpickers("#gender");
      initializeSelectpickers("#prefered_stream");
      initializeSelectpickers("#prefered_language");
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Refresh selectpickers when streams data changes
  // useEffect(() => {
  //   if (streams.length > 0) {
  //     const timer = setTimeout(() => {
  //       refreshSelectpickers("#prefered_stream");
  //     }, 100);
  //     return () => clearTimeout(timer);
  //   }
  // }, [streams]);

  // Refresh selectpickers when formData values change
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     refreshSelectpickers("#gender");
  //     refreshSelectpickers("#prefered_language");
  //   }, 100);
  //   return () => clearTimeout(timer);
  // }, [formData.gender, formData.prefered_language]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.fullname.trim()) {
      fireSweetAlert({
        success: false,
        message: "Please Enter Full Name",
      });
      return;
    }

    if (!formData.email) {
      fireSweetAlert({
        success: false,
        message: "Please Enter Email Address",
      });
      return;
    }

    if (!formData.mobile) {
      fireSweetAlert({
        success: false,
        message: "Please Enter Phone Number",
      });
      return;
    }

    if (!formData.gender) {
      fireSweetAlert({
        success: false,
        message: "Please Select Gender",
      });
      return;
    }

    if (!formData.prefered_stream) {
      fireSweetAlert({
        success: false,
        message: "Please Select Stream",
      });
      return;
    }

    if (!formData.prefered_language) {
      fireSweetAlert({
        success: false,
        message: "Please Select Language",
      });
      return;
    }

    if (!formData.dob) {
      fireSweetAlert({
        success: false,
        message: "Please Enter Date Of Birth",
      });
      return;
    }

    try {
      const formDataObj = new FormData();
      formDataObj.append("fullname", formData.fullname);
      formDataObj.append("email", formData.email);
      formDataObj.append("dob", formData.dob);
      formDataObj.append("address", formData.address);
      formDataObj.append("gender", formData.gender);
      formDataObj.append("mobile", formData.mobile);
      formDataObj.append("prefered_language", formData.prefered_language);
      formDataObj.append("prefered_stream", formData.prefered_stream);

      if (!!profilePic) {
        formDataObj.append("profile_pic", profilePic);
      }

      setIsUpdating(true);

      const result = await userProfileUpdateHandler(formDataObj);

      setIsUpdating(false);
      fireSweetAlert({
        success: result.success,
        message:
          result.message ||
          (result.success
            ? "User Profile Updated"
            : "Failed To Update Profile"),
      });

      if (result.success) {
        setProfilePic(null);
        setProfilePicPreview(null);
        updateUserReduxState();
      }
    } catch (error) {
      fireSweetAlert({
        success: false,
        message: "An error occurred while updating profile. Please try again.",
      });
      console.error("Update error:", error);
    }
  }

  async function updateUserReduxState() {
    const response = await getCurrentUserHandler();
    if (response.success) {
      dispatch(login(response.data));
    }
  }

  return (
    <section id="profile-section" className="pt-5 pb-5">
      <div className="container px-4">
        {/* Section Header */}
        <div className="section-title mb-4 text-center">
          <h2 className="fw-bold fs-32">My Profile</h2>
          <p className="form-control-text-color fs-14">
            Manage your account information, update preferences, and personalize
            your experience.
          </p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="profile-card p-4 bg-white rounded-4">
              <form id="profileForm" onSubmit={(e) => handleSubmit(e)}>
                <div className="row">
                  <div className="col-12">
                    <div className="d-flex justify-content-center">
                      <div className="d-flex shadow-sm rounded-4 px-4 py-3 mb-4">
                        <div className="row">
                          <div className="col-md-4 text-center align-content-center">
                            <img
                              src={
                                profilePicPreview
                                  ? profilePicPreview
                                  : userInfo?.profile_pic
                                  ? userInfo?.profile_pic
                                  : user_default_logo
                              }
                              alt="Profile Photo"
                              className="rounded-circle mb-2 cursor-pointer"
                              style={{
                                width: 120,
                                height: 120,
                                objectFit: "cover",
                              }}
                              id="profilePreview"
                              onClick={() => {
                                document.querySelector("#profile_pic").click();
                              }}
                            />
                            <input
                              type="file"
                              id="profile_pic"
                              name="profile_pic"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  if (
                                    e.target.files[0] &&
                                    e.target.files[0].type.startsWith("image/")
                                  ) {
                                    setProfilePic(e.target.files[0]);
                                  }
                                }
                              }}
                              accept="image/*"
                              className="form-control mt-2 w-auto mx-auto"
                              hidden
                            />
                          </div>
                          <div className="col-md-8 ps-md-4 text-center text-md-start align-content-center">
                            <h4 className="fw-bold fs-26 fs-sm-22 d-none d-md-block profile_card_name">
                              {userInfo?.fullname}
                            </h4>
                            <p className="form-control-text-color d-none d-md-block profile_card_email fs-14">
                              {userInfo?.email}
                            </p>
                            <a
                              className="btn d-md-none theme-btn rounded-4 fw-bold"
                              onClick={() => {
                                document.querySelector("#profile_pic").click();
                              }}
                            >
                              Change Avatar
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      id="fullname"
                      name="fullname"
                      type="text"
                      className="form-control py-3 px-2 bg-light rounded-4"
                      placeholder="Enter Full Name"
                      value={formData?.fullname}
                      onChange={(e) =>
                        setFormData((prev) => {
                          return { ...prev, fullname: e.target.value };
                        })
                      }
                      onInput={(e) =>
                        (e.target.value = e.target.value.replace(
                          /[^a-zA-Z\s]/g,
                          ""
                        ))
                      }
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Date of Birth</label>
                    <input
                      id="dob"
                      name="dob"
                      type="date"
                      value={formData?.dob ? formData.dob.split("T")[0] : ""}
                      onChange={(e) =>
                        setFormData((prev) => {
                          return { ...prev, dob: e.target.value };
                        })
                      }
                      className="form-control py-3 px-2 bg-light rounded-4"
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Gender</label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData?.gender || ""}
                      onChange={(e) =>
                        setFormData((prev) => {
                          return { ...prev, gender: e.target.value };
                        })
                      }
                      className="form-control selectpicker bg-light rounded-4"
                      required
                    >
                      <option value="" disabled>
                        Select Gender
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      id="mobile"
                      name="mobile"
                      type="text"
                      className="form-control py-3 px-2 bg-light rounded-4"
                      maxLength="10"
                      placeholder="Enter Phone Number"
                      value={formData?.mobile || ""}
                      onChange={(e) =>
                        setFormData((prev) => {
                          return {
                            ...prev,
                            mobile: e.target.value.replace(/[^0-9]/g, ""),
                          };
                        })
                      }
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email Address</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="form-control py-3 px-2 bg-light rounded-4"
                      placeholder="Enter Email"
                      value={formData?.email || ""}
                      onChange={(e) =>
                        setFormData((prev) => {
                          return { ...prev, email: e.target.value };
                        })
                      }
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Address</label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      className="form-control py-3 px-2 bg-light rounded-4"
                      placeholder="Enter Address"
                      value={formData?.address || ""}
                      onChange={(e) =>
                        setFormData((prev) => {
                          return { ...prev, address: e.target.value };
                        })
                      }
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <ReactSelect
                      id={"prefered_stream"}
                      name={"prefered_stream"}
                      label={"Stream"}
                      value={formData?.prefered_stream || ""}
                      onChangeFn={(e) => {
                        setFormData((prev) => {
                          return { ...prev, prefered_stream: e.value };
                        });
                      }}
                      options={streams?.map((stream) => {
                        return { value: stream._id, label: stream.name };
                      })}
                      required
                    />
                  </div>

                  {/* Language */}
                  <div className="col-md-6 mb-3">
                    <ReactSelect
                      id={"prefered_language"}
                      name={"prefered_language"}
                      label={"Language"}
                      value={formData?.prefered_language || ""}
                      onChangeFn={(e) => {
                        setFormData((prev) => {
                          return { ...prev, prefered_language: e.value };
                        });
                      }}
                      options={[
                        { value: "", label: "Select Language" },
                        { value: "english", label: "English" },
                        { value: "hindi", label: "Hindi" },
                        { value: "marathi", label: "Marathi" },
                      ]}
                    />
                  </div>

                  <div className="col-12 text-end mt-4">
                    <div className="row">
                      <div className="col-lg-3 offset-lg-9">
                        <button
                          type="submit"
                          className="btn w-100 submitBtn border-0 theme-btn rounded-pill px-4 py-2 fs-16 fw-bold"
                        >
                          {!isUpdating ? (
                            "Save Changes"
                          ) : (
                            <span
                              class="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
