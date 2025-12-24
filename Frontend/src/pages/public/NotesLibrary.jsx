import React, { useEffect, useState } from "react";
import { DataTable, Carousel, Card, SelectPicker } from "@/components";
import { getNotes } from "@/services/apiEndPoints";
import {
  getCoursesHandler,
  getFeaturedNotesHandler,
  getStreamsHandler,
} from "@/services/apiHandlers";
import fireSweetAlert from "@/utils/fireSweetAlert";
import { html } from "gridjs";
import { CircleCheck } from "lucide-react";
import {
  destroySelectpickers,
  renderSelectpickers,
} from "@/utils/selectPicker";

export default function NotesLibrary() {
  const [streams, setStreams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);

  const [featuredNotes, setFeaturedNotes] = useState([]);

  async function getFeaturedNotes() {
    try {
      const response = await getFeaturedNotesHandler();
      setFeaturedNotes(response.data);
    } catch (error) {
      fireSweetAlert({
        success: false,
        message: "An error occurred while Fetching Featured Notes.",
      });
      console.error("Fetching error:", error);
    }
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

  useEffect(() => {
    async function getStreams() {
      const response = await getStreamsHandler();
      const option = { name: "Select Stream", _id: "" };
      setStreams([option, ...response.data]);
    }
    getStreams();
  }, []);

  useEffect(() => {
    getFeaturedNotes();
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    [...tooltipTriggerList].forEach((el) => new bootstrap.Tooltip(el));
    renderSelectpickers("#sort")
  }, []);
  return (
    <section id="library-section" className="py-5">
      <div className="container-fluid px-5">
        <div className="row">
          <div className="col-lg-3 col-12 filters-col transition">
            <h4 className="fw-bold mb-0 mb-lg-2 d-flex d-lg-block justify-content-between align-items-center fs-22">
              Filters
              <span className="filter_trigger d-lg-none">
                <i className="fa-solid fa-chevron-down"></i>
              </span>
            </h4>
            <form action="#" className="mb-3 mb-lg-0">
              <div className="row">
                <div className="col-lg-12 col-md-6">
                  <SelectPicker
                    name={"stream"}
                    id={"stream"}
                    label={"Stream"}
                    onChangeFn={(e) => {
                      setCourses([]);
                      setSemesters([]);
                      if (e.target.value) {
                        getCourses(e.target.value);
                      }
                      destroySelectpickers("#course");
                      $("#course").val("");
                    }}
                    divSpacing={"mb-3 mt-4"}
                  >
                    {streams?.map((stream) => {
                      return (
                        <option key={stream._id} value={stream._id}>
                          {stream.name}
                        </option>
                      );
                    })}
                  </SelectPicker>
                </div>
                <div className="col-lg-12 col-md-6">
                  <SelectPicker
                    id={"course"}
                    name={"course"}
                    label={"Course"}
                    onChangeFn={(e) => {
                      setSemesters([]);
                      destroySelectpickers("#semester");
                      $("#semester").val("");
                      if (e.target.value) {
                        setSemester(e.target.value);
                      }
                    }}
                    divSpacing={"mb-3 mt-md-4 mt-lg-0"}
                  >
                    {courses?.map((course) => {
                      return (
                        <option key={course._id} value={course._id}>
                          {course.name}
                        </option>
                      );
                    })}
                  </SelectPicker>
                </div>
                <div className="col-lg-12 col-md-6">
                  <SelectPicker
                    id={"semester"}
                    name={"semester"}
                    label={"Semester"}
                    onChangeFn={() => {}}
                  >
                    {semesters?.map((semester) => {
                      return (
                        <option key={semester.value} value={semester.value}>
                          {semester.key}
                        </option>
                      );
                    })}
                  </SelectPicker>
                </div>
                <div className="col-lg-12 col-md-6">
                    <SelectPicker
                      name={"sort"}
                      id={"sort"}
                      label={"Sort"}
                      onChangeFn={() => {}}
                    >
                      <option value="1">Newest To Oldest</option>
                      <option value="2">Oldest to Newest</option>
                      <option value="3">Alphabetically (Title)</option>
                    </SelectPicker>
                </div>
                <div className="col-lg-12 col-md-6">
                  <button className="btn apply-filters theme-btn rounded-pill fw-bold fs-14 py-2 px-3">
                    Apply Filters
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="col-lg-9 col-12">
            <div className="section-title">
              <h2 className="fw-bold mt-5 mt-lg-0">Notes Library</h2>
              <p className="form-control-text-color fs-14">
                Explore notes from various courses and contributors.
              </p>
            </div>
            <form action="#" className="position-relative">
              <span className="d-inline-block position-absolute top-0 left-0 bottom-0 align-content-center px-2">
                <i className="fa-solid fa-magnifying-glass fs-22 form-control-text-color px-2 pt-1"></i>
              </span>
              <input
                type="text"
                id="search_notes_input"
                name="search_notes_input"
                placeholder="Search  for notes by title, course, or subject"
                className="form-control border-0 py-3 ps-5 rounded-3 bg-body-secondary fs-sm-14"
              />
            </form>
            <div className="featured-notes">
              <h5 className="fw-bold fs-18 my-4 ps-2">Featured Notes</h5>
              <div className="slider-container">
                <Carousel
                  dots={false}
                  slidesToShow={4}
                  slidesToScroll={1}
                  speed={2000}
                  autoplay={true}
                  autoplaySpeed={6000}
                  lazyLoad={true}
                >
                  {featuredNotes.map((note) => (
                    <Card
                      onClick={() =>
                        buildModal(note.title, note.file_url, true)
                      }
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      cardImg={note.thumbnail}
                      title={
                        <>
                          {note.title}
                          {note.is_verified ? (
                            <button
                              type="button"
                              data-bs-custom-class="custom-tooltip"
                              className="btn p-0 border-0 bg-transparent ms-2 pe-2 text-success"
                              data-bs-toggle="tooltip"
                              data-bs-placement="right"
                              data-bs-title="Verified"
                            >
                              <CircleCheck size={20} />
                            </button>
                          ) : null}
                        </>
                      }
                      description={
                        <>
                          <span className="text-capitalize">
                            {note.course.name.toLowerCase()}
                          </span>
                          , {note.semester ? note.semester : note.year}
                          {(note.semester || note.year) === 1
                            ? "st"
                            : (note.semester || note.year) === 2
                            ? "nd"
                            : (note.semester || note.year) === 3
                            ? "rd"
                            : "th"}{" "}
                          {note.semester ? "semester" : "year"}
                        </>
                      }
                    />
                  ))}
                </Carousel>
              </div>
            </div>
            <div className="all-notes">
              <h5 className="fw-bold fs-18 my-4 ps-2">All Notes</h5>

              <div id="table-wrapper" className="overflow-hidden">
                <DataTable
                  columns={[
                    { name: "Title", sort: true },
                    { name: "Course", sort: true },
                    { name: "Semester / Year", sort: false },
                    { name: "Action", sort: false },
                  ]}
                  url={getNotes}
                  thenFn={(data) =>
                    data.data.docs.map((note) => [
                      html(
                        `<span class="text-capitalize">${note.title}</span>`
                      ),
                      note.course.name,
                      `${note.semester ? note.semester : note.year}${
                        (note.semester || note.year) === 1
                          ? "st"
                          : (note.semester || note.year) === 2
                          ? "nd"
                          : (note.semester || note.year) === 3
                          ? "rd"
                          : "th"
                      } ${note.semester ? "semester" : "year"}`,
                      html(
                        `<div>
                            <div class="row">
                                <div class="col-lg-auto p-0 ps-3 ps-lg-0 col-12 ">
                                    <a href="#" onclick="buildModal('${note.title}','${note.file_url}')" data-bs-toggle="modal" data-bs-target="#exampleModal"
                                    class="view-btn text-decoration-none form-control-text-color fw-semibold pe-lg-2 m-0">
                                    View
                                    </a>
                                    <span class="d-none d-lg-inline-block">|</span>
                                </div>
                                <div class="col-lg-auto p-0 col-12">
                                    <a href="#" onclick="downloadNote('${note.title}','${note.file_url}')" class="text-decoration-none form-control-text-color fw-semibold ps-lg-3 m-0" >
                                    Download
                                    </a>
                                </div>
                            </div>
                        </div>`
                      ),
                    ])
                  }
                  totalFn={(data) => data.data.totalDocs}
                  paginationLimit={5}
                  paginationUrlFn={(prev, page, limit) => {
                    const separator = prev.includes("?") ? "&" : "?";
                    return `${prev}${separator}limit=${limit}&page=${page + 1}`;
                  }}
                  isSearchEnabled={true}
                  searchConfig={{
                    debounceTimeout: 1000,
                    server: {
                      url: (prevUrl, keyword) => {
                        const separator = prevUrl.includes("?") ? "&" : "?";
                        return `${prevUrl}${separator}search=${keyword}`;
                      },
                    },
                  }}
                  isSortEnabled={true}
                  sortConfig={{
                    server: {
                      url: (prevUrl, columns) => {
                        if (!columns.length) return prevUrl;
                        const col = columns[0];
                        if (col?.index > 1) return null;
                        const separator = prevUrl.includes("?") ? "&" : "?";

                        let colName = ["title", "course"][col.index];
                        const dir = col.direction === 1 ? "asc" : "desc";
                        return `${prevUrl}${separator}column=${colName}&dir=${dir}`;
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
