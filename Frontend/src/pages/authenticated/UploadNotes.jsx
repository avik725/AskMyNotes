import {
  getCoursesHandler,
  getStreamsHandler,
  uploadNotesHandler,
} from "@/services/apiHandlers";
import React, { useEffect, useState, useRef } from "react";
import { truncateFileName } from "@/utils/helpers";
import fireSweetAlert from "@/utils/fireSweetAlert";

export default function UploadNotes() {
  const [formData, setFormData] = useState({
    title: "",
    stream: "",
    course: "",
    semester: "",
    description: "",
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [notesFile, setNotesFile] = useState(null);

  const [streams, setStreams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);

  const [isUploading, setIsUploading] = useState(false);

  function refreshSelectpickers(identifier) {
    $(identifier).selectpicker("refresh");
  }

  function destroySelectpickers(identifier) {
    $(identifier).selectpicker("destroy");
  }

  function renderSelectpickers(identifier) {
    $(identifier).selectpicker("render");
  }

  useEffect(() => {
    destroySelectpickers("#stream");
    renderSelectpickers("#stream");
  }, [streams]);

  useEffect(() => {
    destroySelectpickers("#course");
    renderSelectpickers("#course");
  }, [courses]);

  useEffect(() => {
    destroySelectpickers("#semester");
    renderSelectpickers("#semester");
  }, [semesters]);

  async function getCourses(stream_id) {
    const response = await getCoursesHandler(stream_id);
    const option = { name: "Select Course", _id: "" };
    setCourses([option, ...response.data]);
  }

  function setSemester(course_id) {
    const selectedCourse = courses.find((course) => course_id == course._id);

    if (!selectedCourse) return;

    if (selectedCourse.semesters) {
      let semestersArray = [];
      for (let i = 1; i <= selectedCourse.semesters; i++) {
        if (i === 1) {
          semestersArray.push({ value: 1, key: "1st semester" });
        } else if (i === 2) {
          semestersArray.push({ value: 2, key: "2nd semester" });
        } else if (i === 3) {
          semestersArray.push({ value: 3, key: "3rd semester" });
        } else {
          semestersArray.push({ value: i, key: `${i}th semester` });
        }
      }
      setSemesters([{ value: "", key: "Select Semester" }, ...semestersArray]);
    } else {
      let yearsArray = [];
      for (let i = 1; i <= selectedCourse.years; i++) {
        if (i === 1) {
          yearsArray.push({ value: 1, key: "1st year" });
        } else if (i === 2) {
          yearsArray.push({ value: 2, key: "2nd year" });
        } else if (i === 3) {
          yearsArray.push({ value: 3, key: "3rd year" });
        } else {
          yearsArray.push({ value: i, key: `${i}th year` });
        }
      }
      setSemesters([{ value: "", key: "Select Year" }, ...yearsArray]);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setIsUploading(true)

    // Validation
    if (!formData.title.trim()) {
      fireSweetAlert({
        success: false,
        message: "Please enter a note title",
      });
      return;
    }

    if (!formData.stream) {
      fireSweetAlert({
        success: false,
        message: "Please select a stream",
      });
      return;
    }

    if (!formData.course) {
      fireSweetAlert({
        success: false,
        message: "Please select a course",
      });
      return;
    }

    if (!formData.semester) {
      fireSweetAlert({
        success: false,
        message: "Please select a semester/year",
      });
      return;
    }

    if (!thumbnailFile) {
      fireSweetAlert({
        success: false,
        message: "Please select a thumbnail image",
      });
      return;
    }

    if (!notesFile) {
      fireSweetAlert({
        success: false,
        message: "Please select a notes file (PDF)",
      });
      return;
    }

    try {
      const formDataObj = new FormData();
      formDataObj.append("title", formData.title);
      formDataObj.append("stream", formData.stream);
      formDataObj.append("course", formData.course);
      formDataObj.append("semester", formData.semester);
      formDataObj.append("description", formData.description || "");
      formDataObj.append("thumbnail", thumbnailFile);
      formDataObj.append("notes_file", notesFile);

      const result = await uploadNotesHandler(formDataObj);

    setIsUploading(false)
      fireSweetAlert({
        success: result.success,
        message:
          result.message ||
          (result.success
            ? "Notes uploaded successfully!"
            : "Failed to upload notes"),
      });

      if (result.success) {
        // Reset form
        // setFormData({
        //   title: "",
        //   stream: "",
        //   course: "",
        //   semester: "",
        //   description: "",
        // });
        // setThumbnailFile(null);
        // setNotesFile(null);
        // setCourses([]);
        // setSemesters([]);

        // // Reset file inputs
        // const thumbnailInput = document.querySelector("#thumbnail");
        // const notesInput = document.querySelector("#notes_file");
        // if (thumbnailInput) thumbnailInput.value = "";
        // if (notesInput) notesInput.value = "";

        // // Refresh selectpickers
        // if (window.$ && typeof window.$.fn.selectpicker === "function") {
        //   window.$("#stream").selectpicker("refresh");
        //   window.$("#course").selectpicker("refresh");
        //   window.$("#semester").selectpicker("refresh");
        // }
        window.location.reload();
      }
    } catch (error) {
      fireSweetAlert({
        success: false,
        message: "An error occurred while uploading notes. Please try again.",
      });
      console.error("Upload error:", error);
    }
  }

  useEffect(() => {
    async function getStreams() {
      const response = await getStreamsHandler();
      const option = { name: "Select Stream", _id: "" };
      setStreams([option, ...response.data]);
    }
    getStreams();
  }, []);

  return (
    <main id="upload-notes-page">
      {/* main section starts */}
      <section id="upload-section" className="py-5">
        <div className="container-fluid px-5">
          <div className="row">
            <div className="col-lg-5">
              <form action="#" onSubmit={handleSubmit}>
                <h2 className="fw-bold fs-32 text-center mb-4 pb-2">
                  Upload Notes
                </h2>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">
                        Note Title
                      </label>
                      <input
                        type="text"
                        className="form-control py-md-3 py-2 rounded-4 bg-light fs-sm-14"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={(e) => {
                          setFormData({ ...formData, title: e.target.value });
                        }}
                        placeholder="Enter note title"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label htmlFor="stream" className="form-label">
                        Stream
                      </label>
                      <select
                        name="stream"
                        id="stream"
                        value={formData.stream}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            stream: e.target.value,
                            course: "",
                            semester: "",
                          });
                          setCourses([]);
                          setSemesters([]);
                          if (e.target.value) {
                            getCourses(e.target.value);
                          }
                          destroySelectpickers("#course");
                          $("#course").val("");
                        }}
                        className="form-control selectpicker bg-light rounded-4 fs-sm-14"
                        data-live-search="true"
                      >
                        {streams?.map((stream) => {
                          return (
                            <option key={stream._id} value={stream._id}>
                              {stream.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-6">
                    <div className="mb-3">
                      <label htmlFor="course" className="form-label">
                        Course
                      </label>
                      <select
                        name="course"
                        id="course"
                        value={formData.course}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            course: e.target.value,
                            semester: "",
                          });
                          setSemesters([]);
                          destroySelectpickers("#semester");
                          $("#semester").val("");
                          if (e.target.value) {
                            setSemester(e.target.value);
                          }
                        }}
                        className="form-control selectpicker bg-light rounded-4 fs-sm-14"
                        data-live-search="true"
                      >
                        {courses?.map((course) => {
                          return (
                            <option key={course._id} value={course._id}>
                              {course.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-6">
                    <div className="mb-3">
                      <label htmlFor="semester" className="form-label">
                        Semester / Year
                      </label>
                      <select
                        name="semester"
                        id="semester"
                        value={formData.semester}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            semester: e.target.value,
                          });
                        }}
                        className="form-control selectpicker bg-light rounded-4 fs-sm-14"
                        data-live-search="true"
                      >
                        {semesters?.map((semester) => {
                          return (
                            <option key={semester.value} value={semester.value}>
                              {semester.key}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="mb-4 pb-2">
                      <label htmlFor="description" className="form-label">
                        Description
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        value={formData.description}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          });
                        }}
                        className="form-control py-md-3 py-2 rounded-4 bg-light fs-sm-14"
                        placeholder="Enter description"
                        style={{ height: 150, resize: "none" }}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="mb-5">
                    <div className="row">
                      <div className="col-md-6">
                        {/* <label htmlFor="thumbnail" className="form-label">Thumbnail</label> */}
                        <div
                          id="thumbnail-drop-zone"
                          className="drop_zone h-100 w-100 border-2 border-dashed p-4 rounded-4 text-center"
                        >
                          <h5 className="fw-bold text-center mb-4">
                            Select Thumbnail
                          </h5>
                          <a
                            className="btn theme-btn rounded-pill fw-bold px-3 py-2"
                            onClick={() => {
                              document.querySelector("#thumbnail").click();
                            }}
                          >
                            Click Here
                          </a>
                          <p
                            id="selected-img"
                            className="mt-3"
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: "100%",
                            }}
                            title={thumbnailFile ? thumbnailFile.name : ""}
                          >
                            {thumbnailFile
                              ? truncateFileName(thumbnailFile.name)
                              : "No Image Selected"}
                          </p>
                          <input
                            type="file"
                            name="thumbnail"
                            id="thumbnail"
                            accept="image/*"
                            hidden
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                if (
                                  e.target.files[0] &&
                                  e.target.files[0].type.startsWith("image/")
                                ) {
                                  setThumbnailFile(e.target.files[0]);
                                }
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        {/* <label htmlFor="notes_file" className="form-label">Notes File</label> */}
                        <div
                          id="notes-drop-zone"
                          className="drop-zone h-100 mt-3 mt-md-0 w-100 border-2 border-dashed p-4 rounded-4 text-center"
                        >
                          <h5 className="fw-bold text-center mb-4">
                            Select Notes File
                          </h5>
                          <a
                            className="btn theme-btn rounded-pill fw-bold px-3 py-2"
                            onClick={() => {
                              document.querySelector("#notes_file").click();
                            }}
                          >
                            Click Here
                          </a>
                          <p
                            id="selected-notes_file"
                            className="mt-3"
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: "100%",
                            }}
                            title={notesFile ? notesFile.name : ""}
                          >
                            {notesFile
                              ? truncateFileName(notesFile.name)
                              : "File Not Selected"}
                          </p>
                          <input
                            type="file"
                            name="notes_file"
                            id="notes_file"
                            accept="application/pdf"
                            hidden
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                if (
                                  e.target.files[0] &&
                                  e.target.files[0].type === "application/pdf"
                                ) {
                                  setNotesFile(e.target.files[0]);
                                }
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-5">
                  <button
                    type="submit"
                    className="btn uploadBtn border-0 fs-18 fs-sm-16 theme-btn w-100 rounded-pill fw-bold py-2"
                  >
                    {!isUploading ? "Upload" : <span
                      class="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                      ></span>} 
                  </button>
                </div>
              </form>
            </div>
            <div className="col-lg-7 bg-light rounded-4 p-4 mt-5 mt-lg-0">
              <div className="h-100 w-100 overflow-scroll">
                <div
                  id="pdfContainer"
                  className="h-100 w-100 text-center align-content-center"
                >
                  <h3 className="fw-bold form-control-text-color">
                    Select Notes File
                  </h3>
                  <p className="form-control-text-color">
                    Pdf File will be Previewed here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* main section ends */}
    </main>
  );
}
