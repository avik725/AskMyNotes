import { Modal, ReactSelect } from "@/components";
import { Tiptap } from "@/components";
import useDebounce from "@/hooks/useDebounce";
import {
  createPrivateNotesHandler,
  deletePrivateNotesHandler,
  getPrivateNotesHandler,
  updatePrivateNotesHandler,
} from "@/services/apiHandlers";
import fireSweetAlert from "@/utils/fireSweetAlert";
import { NOTE_TYPE_LABELS, truncateText } from "@/utils/helpers";
import { Funnel, Plus, Search, SquarePen, Trash2, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function PrivateNotes() {
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    type: "",
    contentText: "",
    contentJson: null,
  });
  const [viewModalData, setViewModalData] = useState({
    _id: "",
    title: "",
    type: "",
    contentText: "",
  });

  const viewModalStruct = {
    _id: "",
    title: "",
    type: "",
    contentText: "",
  };

  const editorRef = useRef();
  const [notes, setNotes] = useState([]);

  async function fetchPrivateNotes(search) {
    const response = await getPrivateNotesHandler(search);
    if (response.success) setNotes(response.data);
  }
  useEffect(() => {
    fetchPrivateNotes(debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  const formDataStruct = {
    _id: "",
    title: "",
    type: "",
    contentText: "",
    contentJson: null,
  };

  async function submitForm() {
    if (
      !formData.title ||
      !formData.type ||
      !formData.contentText ||
      !formData.contentJson
    ) {
      fireSweetAlert({
        success: false,
        message: "All Fields are Required !!",
      });
      return;
    }
    if (formData._id === "") {
      setLoading(true);
      try {
        const response = await createPrivateNotesHandler({
          title: formData.title,
          type: formData.type,
          contentText: formData.contentText,
          contentJson: formData.contentJson,
        });
        setLoading(false);
        fireSweetAlert({
          success: response.success,
          message:
            response.message ||
            (response.success
              ? "Note Created Successfully"
              : "Failed to Create Note"),
        });
        if (response.success) {
          setFormData(formDataStruct);
          fetchPrivateNotes();
          setModalOpen(false);
        }
      } catch (error) {
        fireSweetAlert({
          success: false,
          message: "An error occurred while creating notes. Please try again.",
        });
        console.error("Creation error:", error);
      }
    } else {
      setLoading(true);
      if (!formData._id) {
        fireSweetAlert({ success: false, message: "Id is Required !!" });
        return;
      }
      try {
        const response = await updatePrivateNotesHandler(formData);
        setLoading(false);
        fireSweetAlert({
          success: response.success,
          message:
            response.message ||
            (response.success
              ? "Note Updated Successfully"
              : "Failed to update Note"),
        });
        if (response.success) {
          setFormData(formDataStruct);
          fetchPrivateNotes();
          setModalOpen(false);
        }
      } catch (error) {
        fireSweetAlert({
          success: false,
          message: "An error occurred while updating note. Please try again.",
        });
        console.error("update error:", error);
      }
    }
  }

  async function deleteNote(id) {
    try {
      const response = await deletePrivateNotesHandler(id);

      fireSweetAlert({
        success: response.success,
        message:
          response.message ||
          (response.success
            ? "Note Deleted Successfully !!"
            : "Failed while deleting notes !!"),
      });

      fetchPrivateNotes();
    } catch (error) {
      fireSweetAlert({
        success: false,
        message: error.message || "Something Went Wrong While Deleting Note !!",
      });
    }
  }

  return (
    <main id="private-notes-page">
      {/* My Uploads Section Starts */}
      <section id="private-notes-section" className="py-5">
        <div className="container px-5">
          <div className="row">
            <div className="col-12">
              <div className="section-title mb-4">
                <h2 className="fw-bold">Private Notes</h2>
                <p className="form-control-text-color fs-14">
                  Manage your private notes and resources
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-9 col-md-8 col-12 px-2">
              <div className="position-relative w-100 h-100">
                <span className="d-inline-block position-absolute top-0 start-0 bottom-0 align-content-center px-3">
                  <Search className="form-control-text-color" />
                </span>
                <input
                  type="text"
                  id="search_notes_input"
                  name="search_notes_input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search private notes..."
                  className="form-control border-0 py-3 ps-5 rounded-3 bg-body-secondary fs-sm-14 w-100 py-3 h-100"
                />
                <span className="d-inline-block position-absolute top-0 end-0 bottom-0 align-content-center px-3 cursor-pointer">
                  <XIcon
                    className="form-control-text-color"
                    onClick={() => {
                      setSearchQuery("");
                    }}
                  />
                </span>
              </div>
            </div>
            <div className="col-md-1 col-3 px-2 px-md-0 pt-3 pt-md-0">
              <div className="btn-group w-100">
                <button
                  type="button"
                  className="btn bg-body-secondary w-100 py-2 py-md-3 px-3 h-100 dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <Funnel />
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="#">
                      Action
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Another action
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Something else here
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Separated link
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2 col-md-3 col-9 px-2 pt-3 pt-md-0">
              <button
                onClick={() => setModalOpen(true)}
                className="btn bg-body-secondary w-100 py-2 py-md-3"
              >
                Create New
                <Plus />
              </button>
            </div>
          </div>
          <div
            className="overflow-y-scroll border rounded-3 p-3 overflow-x-hidden mt-4"
            style={{ height: "60vh" }}
          >
            {notes.length > 0 ? (
              <div className="row">
                {notes?.map((note) => {
                  return (
                    <div key={note?._id} className="col-lg-4 col-md-6 mb-3">
                      <div
                        className="card position-relative cursor-pointer rounded-3 py-5 px-3"
                        style={{ backgroundColor: "#f4f4f4" }}
                        onClick={() => {
                          setViewModalData(note);
                          setViewModalOpen(true);
                        }}
                      >
                        <div className="d-inline-block position-absolute top-0 end-0 p-2">
                          <span
                            className="me-3"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setModalOpen(true);
                              setFormData({
                                _id: note?._id,
                                title: note?.title,
                                contentJson: note?.contentJson,
                                contentText: note?.contentText,
                                type: note?.type,
                              });
                            }}
                          >
                            <SquarePen size={18} className="text-primary" />
                          </span>
                          <span
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              deleteNote(note?._id);
                            }}
                          >
                            <Trash2 size={18} className="text-danger" />
                          </span>
                        </div>

                        <h3 className="fw-bold">
                          {note?.title ? truncateText(note?.title, 20) : ""}
                        </h3>
                        <p className="form-control-text-color fs-14 m-0">
                          Manage your private notes and resources
                        </p>
                        <p className="form-control-text-color fs-14 m-0">
                          {note?.createdAt
                            ? new Date(note?.createdAt)
                                .toLocaleString()
                                .split(",")[0]
                            : ""}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                className="align-content-center text-center h-100 rounded-3"
                style={{ backgroundColor: "#f4f4f4" }}
              >
                <div className="d-inline-block p-4">
                  <h3 className="fw-bold">No Notes Found</h3>
                  <p className="form-control-text-color fs-14 mt-2">
                    Create your first private note to get started
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Modal
        open={modalOpen}
        setOpen={setModalOpen}
        title="Create New Private Note"
        size="modal-lg"
        onClose={() => {
          editorRef.current.clear();
          setFormData(formDataStruct);
        }}
        footerContent={
          <>
            <button
              onClick={() => {
                setFormData(formDataStruct);
                // editorRef.current.clear();
              }}
              className="btn theme-btn rounded-pill py-2 px-3"
            >
              Clear
            </button>
            <button
              onClick={() => {
                submitForm();
              }}
              className="btn theme-btn rounded-pill py-2 px-3 align-content-center"
            >
              {loading ? (
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                <>
                  {formData._id === "" ? (
                    <>
                      Create <Plus size={18} />
                    </>
                  ) : (
                    "Update"
                  )}
                </>
              )}
            </button>
          </>
        }
        closeBtn={false}
        isScrollable={true}
      >
        <div>
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
                setFormData((prev) => {
                  return { ...prev, title: e.target.value };
                });
              }}
              placeholder="Enter note title"
              required
            />
          </div>
          <div className="mb-3">
            <ReactSelect
              className="form-control py-md-3 py-2 rounded-4 bg-light fs-sm-14"
              id="noteType"
              name="noteType"
              label="Note Type"
              value={formData.type}
              onChangeFn={(e) => {
                setFormData((prev) => {
                  return { ...prev, type: e.value };
                });
              }}
              options={NOTE_TYPE_LABELS}
              placeholder="Enter note title"
            />
          </div>
          <div className="mb-3">
            <Tiptap
              label={"Content"}
              content={formData.contentJson}
              getTextData={(text) => {
                setFormData((prev) => {
                  return { ...prev, contentText: text };
                });
              }}
              getJsonData={(json) => {
                setFormData((prev) => {
                  return { ...prev, contentJson: json };
                });
              }}
              ref={editorRef}
            />
          </div>
        </div>
      </Modal>
      <Modal
        open={viewModalOpen}
        setOpen={setViewModalOpen}
        title={
          viewModalData.title ? truncateText(viewModalData.title, 20) : "..."
        }
        isScrollable={true}
        size="modal-lg"
        onClose={() => {
          setViewModalData(formDataStruct);
        }}
        closeBtn={false}
        showFooter={false}
      >
        <div>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Note Title
            </label>
            <input
              type="text"
              className="form-control py-md-3 py-2 rounded-4 bg-light fs-sm-14"
              value={viewModalData.title}
              disabled
            />
          </div>
          <div className="mb-3">
            <label htmlFor="type" className="form-label">
              Note Type
            </label>
            <input
              type="text"
              className="form-control py-md-3 py-2 rounded-4 bg-light fs-sm-14"
              value={viewModalData.type}
              disabled
            />
          </div>
          <div className="mb-3">
            <Tiptap
              label={"Content"}
              content={viewModalData.contentJson}
              isDisabled={true}
            />
          </div>
        </div>
      </Modal>
    </main>
  );
}
