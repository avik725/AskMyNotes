import { Modal, ReactSelect } from "@/components";
import { Tiptap } from "@/components";
import { Funnel, Plus, Search } from "lucide-react";
import { useState } from "react";

export default function PrivateNotes() {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    content: "",
  });

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
            className="overflow-y-scroll overflow-x-hidden mt-4"
            style={{ maxHeight: "60vh" }}
          >
            <div className="row">
              <div className="col-lg-4 col-md-6 mb-3">
                <div
                  className="card cursor-pointer rounded-3 py-5 px-3"
                  style={{ backgroundColor: "#f4f4f4" }}
                >
                  <h3 className="fw-bold">Title</h3>
                  <p className="form-control-text-color fs-14 m-0">
                    Manage your private notes and resources
                  </p>
                  <p className="form-control-text-color fs-14 m-0">
                    20/12/2025
                  </p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 mb-3">
                <div
                  className="card cursor-pointer rounded-3 py-5 px-3"
                  style={{ backgroundColor: "#f4f4f4" }}
                >
                  <h3 className="fw-bold">Title</h3>
                  <p className="form-control-text-color fs-14 m-0">
                    Manage your private notes and resources
                  </p>
                  <p className="form-control-text-color fs-14 m-0">
                    20/12/2025
                  </p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 mb-3">
                <div
                  className="card cursor-pointer rounded-3 py-5 px-3"
                  style={{ backgroundColor: "#f4f4f4" }}
                >
                  <h3 className="fw-bold">Title</h3>
                  <p className="form-control-text-color fs-14 m-0">
                    Manage your private notes and resources
                  </p>
                  <p className="form-control-text-color fs-14 m-0">
                    20/12/2025
                  </p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 mb-3">
                <div
                  className="card cursor-pointer rounded-3 py-5 px-3"
                  style={{ backgroundColor: "#f4f4f4" }}
                >
                  <h3 className="fw-bold">Title</h3>
                  <p className="form-control-text-color fs-14 m-0">
                    Manage your private notes and resources
                  </p>
                  <p className="form-control-text-color fs-14 m-0">
                    20/12/2025
                  </p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 mb-3">
                <div
                  className="card cursor-pointer rounded-3 py-5 px-3"
                  style={{ backgroundColor: "#f4f4f4" }}
                >
                  <h3 className="fw-bold">Title</h3>
                  <p className="form-control-text-color fs-14 m-0">
                    Manage your private notes and resources
                  </p>
                  <p className="form-control-text-color fs-14 m-0">
                    20/12/2025
                  </p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 mb-3">
                <div
                  className="card cursor-pointer rounded-3 py-5 px-3"
                  style={{ backgroundColor: "#f4f4f4" }}
                >
                  <h3 className="fw-bold">Title</h3>
                  <p className="form-control-text-color fs-14 m-0">
                    Manage your private notes and resources
                  </p>
                  <p className="form-control-text-color fs-14 m-0">
                    20/12/2025
                  </p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 mb-3">
                <div
                  className="card cursor-pointer rounded-3 py-5 px-3"
                  style={{ backgroundColor: "#f4f4f4" }}
                >
                  <h3 className="fw-bold">Title</h3>
                  <p className="form-control-text-color fs-14 m-0">
                    Manage your private notes and resources
                  </p>
                  <p className="form-control-text-color fs-14 m-0">
                    20/12/2025
                  </p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 mb-3">
                <div
                  className="card cursor-pointer rounded-3 py-5 px-3"
                  style={{ backgroundColor: "#f4f4f4" }}
                >
                  <h3 className="fw-bold">Title</h3>
                  <p className="form-control-text-color fs-14 m-0">
                    Manage your private notes and resources
                  </p>
                  <p className="form-control-text-color fs-14 m-0">
                    20/12/2025
                  </p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 mb-3">
                <div
                  className="card cursor-pointer rounded-3 py-5 px-3"
                  style={{ backgroundColor: "#f4f4f4" }}
                >
                  <h3 className="fw-bold">Title</h3>
                  <p className="form-control-text-color fs-14 m-0">
                    Manage your private notes and resources
                  </p>
                  <p className="form-control-text-color fs-14 m-0">
                    20/12/2025
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Modal
        open={modalOpen}
        setOpen={setModalOpen}
        title="Create New Private Note"
        size="modal-lg"
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
              }}
              className="btn theme-btn rounded-pill py-2 px-3 align-content-center"
            >
              Create <Plus size={18} />
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
              value={""}
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
              value={""}
              onChangeFn={(e) => {
                setFormData((prev) => {
                  return { ...prev, type: e.value };
                });
              }}
              placeholder="Enter note title"
            />
          </div>
          <div className="mb-3">
            <Tiptap
              label={"Content"}
              getData={(content) => {
                setFormData((prev) => {
                  return { ...prev, content: content };
                });
              }}
            />
          </div>
        </form>
      </Modal>
    </main>
  );
}
