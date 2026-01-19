import React, { useEffect, useState, useCallback, useMemo } from "react";
import { DataTable, Carousel, Card, Modal } from "@/components";
import { getNotes } from "@/services/apiEndPoints";
import {
  getCoursesHandler,
  getFeaturedNotesHandler,
  getStreamsHandler,
} from "@/services/apiHandlers";
import fireSweetAlert from "@/utils/fireSweetAlert";
import { html } from "gridjs";
import { CircleCheck, Search, XIcon } from "lucide-react";
import { downloadNote } from "@/utils/helpers";
import ReactSelect from "@/components/ReactSelect";

export default function NotesLibrary() {
  const [streams, setStreams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState({
    title: "",
    file_url: "",
    downloadEnable: false,
  });

  const [selectedFilters, setSelectedFilters] = useState({
    stream: "",
    course: "",
    semesterOrYear: "",
    sortOrder: "",
  });

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

  const openNoteModal = useCallback((title, file_url, downloadBtn = false) => {
    setCurrentNote({ title, file_url, downloadEnable: downloadBtn });
    setModalOpen(true);
  }, []);

  // Expose function to window for use in DataTable HTML strings
  useEffect(() => {
    window.buildModal = (title, file_url) => {
      openNoteModal(title, file_url);
    };
    window.downloadNote = (title, file_url, id) => {
      downloadNote(title, file_url, id);
    };
    return () => {
      delete window.buildModal;
      delete window.downloadNote;
    };
  }, [openNoteModal]);

  useEffect(() => {
    getFeaturedNotes();
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]',
    );
    [...tooltipTriggerList].forEach((el) => new bootstrap.Tooltip(el));
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
            <div className="mb-3 mb-lg-0">
              <div className="row">
                <div className="col-lg-12 col-md-6">
                  <ReactSelect
                    name={"stream"}
                    id={"stream"}
                    label={"Stream"}
                    placeholder={"Select Stream"}
                    value={selectedFilters.stream}
                    onChangeFn={(e) => {
                      setSelectedFilters((prev) => {
                        return { ...prev, stream: e.value };
                      });
                      setCourses([]);
                      setSemesters([]);
                      if (e.value) {
                        getCourses(e.value);
                      }
                      $("#course").val("");
                    }}
                    divSpacing={"mb-3 mt-4"}
                    options={streams?.map((stream) => {
                      return { value: stream._id, label: stream.name };
                    })}
                  />
                </div>
                <div className="col-lg-12 col-md-6">
                  <ReactSelect
                    id={"course"}
                    name={"course"}
                    label={"Course"}
                    placeholder={"Select Course"}
                    value={selectedFilters.course}
                    onChangeFn={(e) => {
                      setSelectedFilters((prev) => {
                        return { ...prev, course: e.value };
                      });
                      setSemesters([]);
                      $("#semester").val("");
                      if (e.value) {
                        setSemester(e.value);
                      }
                    }}
                    divSpacing={"mb-3 mt-md-4 mt-lg-0"}
                    options={courses?.map((course) => {
                      return { value: course._id, label: course.name };
                    })}
                  />
                </div>
                <div className="col-lg-12 col-md-6">
                  <ReactSelect
                    id={"semester"}
                    name={"semester"}
                    label={"Semester"}
                    placeholder={"Select Semester"}
                    value={selectedFilters.semesterOrYear}
                    onChangeFn={(e) => {
                      setSelectedFilters((prev) => {
                        return { ...prev, semesterOrYear: e.value };
                      });
                    }}
                    options={semesters?.map((semester) => {
                      return { value: semester.value, label: semester.key };
                    })}
                  />
                </div>
                <div className="col-lg-12 col-md-6">
                  <ReactSelect
                    name={"sort"}
                    id={"sort"}
                    label={"Sort"}
                    placeholder={"Select Sort Order"}
                    value={selectedFilters.sortOrder}
                    onChangeFn={(e) => {
                      setSelectedFilters((prev) => {
                        return { ...prev, sortOrder: e.value };
                      });
                    }}
                    options={[
                      { value: -1, label: "Newest To Oldest" },
                      { value: 1, label: "Oldest to Newest" },
                    ]}
                  />
                </div>
                <div className="col-lg-12 col-md-6">
                  <button className="btn apply-filters theme-btn rounded-pill fw-bold fs-14 py-2 px-3">
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-9 col-12">
            <div className="section-title">
              <h2 className="fw-bold mt-5 mt-lg-0">Notes Library</h2>
              <p className="form-control-text-color fs-14">
                Explore notes from various courses and contributors.
              </p>
            </div>
            <div className="position-relative">
              <span className="d-inline-block position-absolute top-0 left-0 bottom-0 align-content-center px-3">
                <Search className="form-control-text-color" />
              </span>
              <input
                type="text"
                id="search_notes_input"
                name="search_notes_input"
                onInput={(e) => {
                  const searchBox = document.querySelector(".gridjs-input");
                  searchBox.value = e.target.value;

                  const event = new Event("input", { bubbles: true });
                  searchBox.dispatchEvent(event);
                }}
                placeholder="Search  for notes by title, course, or subject"
                className="form-control border-0 py-3 ps-5 rounded-3 bg-body-secondary fs-sm-14"
              />
              <span className="d-inline-block position-absolute top-0 end-0 bottom-0 align-content-center px-3 cursor-pointer">
                <XIcon
                  className="form-control-text-color"
                  onClick={() => {
                    const searchBox = document.querySelector(
                      "#search_notes_input",
                    );
                    searchBox.value = "";

                    const event = new Event("input", { bubbles: true });
                    searchBox.dispatchEvent(event);
                  }}
                />
              </span>
            </div>
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
                      key={note._id}
                      onClick={() =>
                        openNoteModal(note.title, note.file_url, true)
                      }
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
                  columns={useMemo(
                    () => [
                      { name: "Title", sort: true },
                      { name: "Course", sort: true },
                      { name: "Semester / Year", sort: false },
                      { name: "Action", sort: false },
                    ],
                    [],
                  )}
                  url={getNotes}
                  thenFn={useCallback(
                    (data) =>
                      data.data.docs.map((note) => [
                        html(
                          `<span class="text-capitalize">${note.title}</span>`,
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
                          `<div style="display: flex;">
                            <a href="#" onclick="buildModal('${note.title}','${note.file_url}'); return false;"
                            class="view-btn text-decoration-none form-control-text-color fw-semibold m-0">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text-icon lucide-file-text"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
                            </a>
                            <a href="#" onclick="downloadNote('${note.title}','${note.file_url}','${note._id}'); return false;" class="text-decoration-none form-control-text-color fw-semibold ps-lg-3 m-0" >
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download-icon lucide-download"><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg>
                            </a>
                            <a href="#" onclick="downloadNote('${note.title}','${note.file_url}','${note._id}'); return false;" class="text-decoration-none form-control-text-color fw-semibold ps-lg-3 m-0" >
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                            </a>
                          </div>`,
                        ),
                      ]),
                    [],
                  )}
                  totalFn={useCallback((data) => data.data.totalDocs, [])}
                  paginationLimit={5}
                  paginationUrlFn={useCallback((prev, page, limit) => {
                    const separator = prev.includes("?") ? "&" : "?";
                    return `${prev}${separator}limit=${limit}&page=${page + 1}`;
                  }, [])}
                  isSearchEnabled={true}
                  searchConfig={useMemo(
                    () => ({
                      debounceTimeout: 1000,
                      server: {
                        url: (prevUrl, keyword) => {
                          const separator = prevUrl.includes("?") ? "&" : "?";
                          return `${prevUrl}${separator}search=${keyword}`;
                        },
                      },
                    }),
                    [],
                  )}
                  isSortEnabled={true}
                  sortConfig={useMemo(
                    () => ({
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
                    }),
                    [],
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={modalOpen}
        setOpen={setModalOpen}
        title={currentNote.title || "View Note"}
        size="modal-xl"
        footerContent={
          currentNote.downloadEnable ? (
            <button
              type="button"
              onClick={() =>
                downloadNote(currentNote.title, currentNote.file_url)
              }
              className="btn theme-btn fw-bold rounded-pill py-2 px-3"
            >
              Download
            </button>
          ) : (
            ""
          )
        }
        closeBtn={false}
      >
        {currentNote.file_url && (
          <iframe
            src={currentNote.file_url}
            style={{
              width: "100%",
              height: "70vh",
              border: "none",
            }}
            title={currentNote.title}
          />
        )}
      </Modal>
    </section>
  );
}
