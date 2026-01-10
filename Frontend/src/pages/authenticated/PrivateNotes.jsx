import { Modal, ReactSelect } from "@/components";
import { Tiptap } from "@/components";
import {
  createPrivateNotesHandler,
  getPrivateNotesHandler,
  updatePrivateNotesHandler,
} from "@/services/apiHandlers";
import fireSweetAlert from "@/utils/fireSweetAlert";
import { NOTE_TYPE_LABELS } from "@/utils/helpers";
import { Funnel, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function PrivateNotes() {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    type: "",
    contentText: "",
    contentJson: null,
  });

  const [notes, setNotes] = useState([]);

  async function fetchPrivateNotes() {
    const response = await getPrivateNotesHandler();
    setNotes(response.data);
  }
  useEffect(() => {
    fetchPrivateNotes();
  }, []);

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

  return (
    <main id="myuploads-page">
      {/* My Uploads Section Starts */}
      <section id="myuploads-section" className="py-5">
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
                <span className="d-inline-block position-absolute top-0 left-0 bottom-0 align-content-center px-3">
                  <Search className="form-control-text-color" />
                </span>
                <input
                  type="text"
                  id="search_notes_input"
                  name="search_notes_input"
                  placeholder="Search private notes..."
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
            <div className="row">
              {notes?.map((note) => {
                return (
                  <div className="col-lg-4 col-md-6 mb-3">
                    <div
                      className="card cursor-pointer rounded-3 py-5 px-3"
                      style={{ backgroundColor: "#f4f4f4" }}
                      onClick={() => {
                        setModalOpen(true);
                        setFormData({
                          _id: note._id,
                          title: note.title,
                          contentJson: note.contentJson,
                          contentText: note.contentText,
                          type: note.type,
                        });
                      }}
                    >
                      <h3 className="fw-bold">{note.title}</h3>
                      <p className="form-control-text-color fs-14 m-0">
                        Manage your private notes and resources
                      </p>
                      <p className="form-control-text-color fs-14 m-0">
                        {note.createdAt
                          ? new Date(note.createdAt)
                              .toLocaleString()
                              .split(",")[0]
                          : ""}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <Modal
        open={modalOpen}
        setOpen={setModalOpen}
        title="Create New Private Note"
        size="modal-lg"
        onClose={() => {
          setFormData(formDataStruct);
        }}
        footerContent={
          <>
            <button
              onClick={() => {}}
              className="btn theme-btn rounded-pill py-2 px-3"
            >
              Save Draft
            </button>
            <button
              onClick={() => {
                console.log(formData);
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
      >
        <form action="#">
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
              getTextData={(content) => {
                setFormData((prev) => {
                  return { ...prev, contentText: content };
                });
              }}
              getJsonData={(content) => {
                setFormData((prev) => {
                  return { ...prev, contentJson: content };
                });
              }}
            />
          </div>
        </form>
      </Modal>
    </main>
  );
}
