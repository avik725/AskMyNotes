import { routeSet } from "@/routes/routeSet";
import { Funnel, Plus, Search, XIcon } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function AskAI() {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

  return (
    <main id="ask-ai-page">
      {/* AskAI Section Starts */}
      <section id="ask-ai-section" className="py-5">
        <div className="container px-5">
          <div className="row">
            <div className="col-12">
              <div className="section-title mb-4">
                <h2 className="fw-bold">Ask AI</h2>
                <p className="form-control-text-color fs-14">
                  Manage AI Powered Conversation Notebook
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
                onClick={() => navigate(`${routeSet.authenticated.askAI}/123`)}
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
            {/* {notes.length > 0 ? (
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
            ) : ( */}
              <div
                className="align-content-center text-center h-100 rounded-3"
                style={{ backgroundColor: "#f4f4f4" }}
              >
                <div className="d-inline-block p-4">
                  <h3 className="fw-bold">No Conversations Found</h3>
                  <p className="form-control-text-color fs-14 mt-2">
                    Create your first conversation notebook to get started
                  </p>
                </div>
              </div>
            {/* )} */}
          </div>
        </div>
      </section>
    </main>
  );
}
