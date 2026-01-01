import React, { useCallback, useEffect, useMemo, useState } from "react";
import { html } from "gridjs";
import { DataTable, Modal } from "@/components";
import { getMyUploads } from "@/services/apiEndPoints";
import { downloadNote } from "@/utils/helpers";
import { Funnel, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router";
import { routeSet } from "@/routes/routeSet";

export default function PublishedNotes() {
  const navigate = useNavigate();
  const [totalUploads, setTotalUploads] = useState(0);
  const [totalDownloads, setTotalDownloads] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState({
    title: "",
    file_url: "",
    downloadEnable: false,
  });

  const openNoteModal = useCallback((title, file_url, downloadBtn = false) => {
    setCurrentNote({ title, file_url, downloadEnable: downloadBtn });
    setModalOpen(true);
  }, []);

  // Expose function to window for use in DataTable HTML strings
  useEffect(() => {
    window.buildModal = (title, file_url) => {
      openNoteModal(title, file_url);
    };

    window.downloadNote = (title, file_url) => {
      downloadNote(title, file_url);
    };
    return () => {
      delete window.buildModal;
      delete window.downloadNote;
    };
  }, [openNoteModal]);

  return (
    <main id="myuploads-page">
      {/* My Uploads Section Starts */}
      <section id="myuploads-section" className="py-5">
        <div className="container px-5">
          <div className="row">
            <div className="col-12">
              <div className="section-title mb-4">
                <h2 className="fw-bold">My Publications</h2>
                <p className="form-control-text-color fs-14">
                  Manage your shared notes and resources
                </p>
              </div>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-lg-9 col-md-8 col-12 px-2">
              <div className="position-relative w-100 h-100">
                <span className="d-inline-block position-absolute top-0 left-0 bottom-0 align-content-center px-3">
                  <Search className="form-control-text-color" />
                </span>
                <input
                  type="text"
                  id="search_notes_input"
                  name="search_notes_input"
                  placeholder="Search public notes..."
                  onInput={(e) => {
                      const searchBox = document.querySelector(".gridjs-input");
                      searchBox.value = e.target.value;

                      const event = new Event("input", { bubbles: true });
                      searchBox.dispatchEvent(event);
                  }}
                  className="form-control border-0 py-3 ps-5 rounded-3 bg-body-secondary fs-sm-14 w-100 py-3 h-100"
                />
              </div>
            </div>
            <div className="col-md-1 col-3 px-2 px-md-0 pt-3 pt-md-0">
              <button className="btn bg-body-secondary w-100 py-2 py-md-3 px-3 h-100">
                <Funnel />
              </button>
            </div>
            <div className="col-lg-2 col-md-3 col-9 px-2 pt-3 pt-md-0">
              <button
              onClick={()=>navigate(routeSet.authenticated.uploadNotes)}
              className="btn bg-body-secondary w-100 py-2 py-md-3">
                Upload New
                <Plus />
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div
                style={{ backgroundColor: "#f4f4f4" }}
                className="card rounded-4 border-secondary-subtle p-4 mb-3 mb-md-0"
              >
                <p className="">Total Publications</p>
                <h4 className="fw-bold fs-26 total_uploads">{totalUploads}</h4>
              </div>
            </div>
            <div className="col-md-4">
              <div
                style={{ backgroundColor: "#f4f4f4" }}
                className="card rounded-4 border-secondary-subtle p-4"
              >
                <p className="">Total Drafts</p>
                <h4 className="fw-bold fs-26 total_uploads">0</h4>
              </div>
            </div>
            <div className="col-md-4">
              <div
                style={{ backgroundColor: "#f4f4f4" }}
                className="card rounded-4 border-secondary-subtle p-4 mt-4 mt-md-0"
              >
                <p className="">Total Downloads</p>
                <h4 className="fw-bold fs-26 total_downloads">
                  {totalDownloads}
                </h4>
              </div>
            </div>
          </div>
          <div className="uploaded-notes mt-5">
            <h5 className="fw-bold fs-22 mb-4 ps-2">Uploaded Notes</h5>
            <div id="table-wrapper">
              <DataTable
                columns={useMemo(
                  () => [
                    { name: "Title", sort: true },
                    { name: "Course", sort: true },
                    { name: "Semester / Year", sort: false },
                    { name: "Action", sort: false },
                  ],
                  []
                )}
                url={getMyUploads}
                thenFn={useCallback(
                  (data) =>
                    data.data.uploads.docs.map((note) => [
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
                                  <a href="#" onclick="buildModal('${note.title}','${note.file_url}'); return false;"
                                  class="view-btn text-decoration-none form-control-text-color fw-semibold pe-lg-2 m-0">
                                  View
                                  </a>
                                  <span class="d-none d-lg-inline-block">|</span>
                                </div>
                                <div class="col-lg-auto p-0 col-12">
                                  <a href="#" onclick="downloadNote('${note.title}','${note.file_url}'); return false;" class="text-decoration-none form-control-text-color fw-semibold ps-lg-3 m-0" >
                                    Download
                                  </a>
                                </div>
                              </div>
                            </div>`
                      ),
                    ]),
                  []
                )}
                handleFn={useCallback(async (res) => {
                  let resJson = await res.json();
                  if (resJson.success) {
                    setTotalUploads(resJson.data.total_uploads);
                    setTotalDownloads(resJson.data.total_downloads);
                    return resJson;
                  } else {
                    return { data: [] };
                  }
                }, [])}
                totalFn={useCallback((data) => data.data.uploads.totalDocs, [])}
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
                  []
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
                  []
                )}
              />
            </div>
          </div>
        </div>
      </section>
      {/* My Uploads Section Ends */}

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
    </main>
  );
}
