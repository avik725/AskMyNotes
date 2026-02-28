import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { html } from "gridjs";
import { DataTable, Modal } from "@/components";
import { getMyUploads } from "@/services/apiEndPoints";
import { downloadNote } from "@/utils/helpers";
import { FileText, Funnel, Plus, Search, XIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { routeSet } from "@/routes/routeSet";
import { deleteNotesHandler } from "@/services/apiHandlers";
import fireSweetAlert, {
  fireSweetAlertWithButtons,
} from "@/utils/fireSweetAlert";

export default function PublishedNotes() {
  const navigate = useNavigate();
  const [totalUploads, setTotalUploads] = useState(0);
  const [totalDownloads, setTotalDownloads] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentNote, setCurrentNote] = useState({
    title: "",
    file_url: "",
    downloadEnable: false,
  });
  const firstLoad = useRef(true);

  const openNoteModal = useCallback((title, file_url, downloadBtn = false) => {
    setCurrentNote({ title, file_url, downloadEnable: downloadBtn });
    setModalOpen(true);
  }, []);

  async function deletePublicNote(id) {
    try {
      const response = await deleteNotesHandler(id);

      fireSweetAlert({
        success: response.success,
        message:
          response.message ||
          (response.success
            ? "Note Deleted Successfully !!"
            : "Failed while deleting notes !!"),
      }).then(() => {
        if (response.success) {
          window.location.reload();
        }
      });
    } catch (error) {
      fireSweetAlert({
        success: false,
        message: error.message || "Something Went Wrong While Deleting Note !!",
      });
    }
  }

  // Expose function to window for use in DataTable HTML strings
  useEffect(() => {
    window.buildModal = (title, file_url) => {
      openNoteModal(title, file_url);
    };

    window.downloadNote = (title, file_url) => {
      downloadNote(title, file_url);
    };

    window.deletePublicNote = (id, title) => {
      console.log(title)
      fireSweetAlertWithButtons({
        title: `Do you want to Delete \n "${title}"`,
        icon: "warning",
        cancelButtonText: "Cancel"
      }).then(({ isConfirmed }) => {
        if (isConfirmed) {
          deletePublicNote(id);
        }
      });
    };
    return () => {
      delete window.buildModal;
      delete window.downloadNote;
      delete window.deletePublicNote;
    };
  }, [openNoteModal, downloadNote, deletePublicNote]);

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    const searchBox = document.querySelector(".gridjs-input");
    searchBox.value = searchQuery;
    const event = new Event("input", { bubbles: true });
    searchBox.dispatchEvent(event);
  }, [searchQuery]);

  return (
    <main id="myuploads-page">
      {/* My Uploads Section Starts */}
      <section id="myuploads-section" className="py-5">
        <div className="container px-3 px-md-5">
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control border-0 py-3 ps-5 rounded-3 bg-body-secondary fs-sm-14 w-100 py-3 h-100"
                />
                {searchQuery && (
                  <span className="d-inline-block position-absolute top-0 end-0 bottom-0 align-content-center px-3 cursor-pointer">
                    <XIcon
                      className="form-control-text-color"
                      onClick={() => setSearchQuery("")}
                    />
                  </span>
                )}
              </div>
            </div>
            <div className="col-md-1 col-3 px-2 px-md-0 pt-3 pt-md-0">
              <button className="btn bg-body-secondary w-100 py-2 py-md-3 px-3 h-100">
                <Funnel />
              </button>
            </div>
            <div className="col-lg-2 col-md-3 col-9 px-2 pt-3 pt-md-0">
              <button
                onClick={() => navigate(routeSet.authenticated.uploadNotes)}
                className="btn bg-body-secondary w-100 py-2 py-md-3"
              >
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
                  [],
                )}
                url={getMyUploads}
                thenFn={useCallback(
                  (data) =>
                    data.data.uploads.docs.map((note) => [
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
                            <a href="#" onclick="downloadNote('${note.title}','${note.file_url}'); return false;" class="text-decoration-none form-control-text-color fw-semibold ps-lg-3 m-0" >
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download-icon lucide-download"><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg>
                            </a>
                            <a href="#" onclick="deletePublicNote('${note._id}','${note.title}'); return false;" class="text-decoration-none form-control-text-color fw-semibold ps-lg-3 m-0" >
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                            </a>
                          </div>`,
                      ),
                    ]),
                  [],
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
