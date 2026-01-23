import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import logo from "@/assets/images/amn_logo.png";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  MessageSquare,
  Files,
  Upload,
  Search,
  PanelLeft,
  PanelRight,
  Plus,
  SlidersHorizontal,
  Bot,
  XIcon,
} from "lucide-react";
import { Modal, ReactSelect } from "@/components";
import { getNonPaginatedNotesHandler } from "@/services/apiHandlers";
import useDebounce from "@/hooks/useDebounce";
import { truncateText } from "@/utils/helpers";

export default function AINotebook() {
  const params = useParams();
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [publicNoteModalOpen, setPublicNoteModalOpen] = useState(false);
  const [publicNotes, setPublicNotes] = useState([]);
  const [publicNoteSearchQuery, setPublicNotesSearchQuery] = useState("");
  const debouncedPublicNoteSearchQuery = useDebounce(publicNoteSearchQuery);
  const [selectedPublicNotes, setSelectedPublicNotes] = useState([]);
  const [tempSelectedPublicNotes, setTempSelectedPublicNotes] = useState([]);

  async function fetchPublicNotes(search = "") {
    const response = await getNonPaginatedNotesHandler(search);

    if (response.success) {
      setPublicNotes([...response.data]);
    }
  }

  const handleNoteSelection = (note) => {
    setTempSelectedPublicNotes((prev) => {
      const exists = prev.find((n) => n._id === note._id);
      if (exists) {
        return prev.filter((n) => n._id !== note._id);
      } else {
        return [...prev, note];
      }
    });
  };

  useEffect(() => {
    if (publicNoteModalOpen) {
      setTempSelectedPublicNotes(selectedPublicNotes);
    }
  }, [publicNoteModalOpen]);

  useEffect(() => {
    fetchPublicNotes(debouncedPublicNoteSearchQuery);
  }, [debouncedPublicNoteSearchQuery]);

  // Placeholder data - replace with actual state/props later
  const notebookTitle = "Untitled Notebook";

  // Styles for transitions
  const sidebarTransition = "all 0.3s ease-in-out";

  return (
    <div
      className="d-flex flex-column"
      style={{ height: "100vh", overflow: "hidden" }}
    >
      {/* Notebook Header */}
      <div className="bg-white py-3 px-3 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <img src={logo} alt="AMN Logo" style={{ maxWidth: 40 }} />
          <h3 className="mb-0 fw-bold text-black ps-2">{notebookTitle}</h3>
        </div>
        <div>{/* Additional header actions can go here */}</div>
      </div>

      <div
        className="d-flex flex-grow-1 position-relative"
        style={{ overflow: "hidden" }}
      >
        {/* Left Sidebar - Public Notes */}
        <div
          className={`border rounded-4 bg-light d-flex flex-column ${!isLeftSidebarOpen ? "collapsed" : ""} mx-3 mt-0`}
          style={{
            width: isLeftSidebarOpen ? "300px" : "50px",
            minWidth: isLeftSidebarOpen ? "300px" : "50px",
            transition: sidebarTransition,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            className={`py-3 ${isLeftSidebarOpen ? "px-3" : "px-2"} border-bottom d-flex ${isLeftSidebarOpen ? "justify-content-between" : "justify-content-center"} align-items-center bg-white`}
            style={{ minWidth: isLeftSidebarOpen ? "300px" : "50px" }}
          >
            {isLeftSidebarOpen && (
              <div className="d-flex align-items-center gap-2">
                <BookOpen size={20} />
                <h6 className="mb-0 fw-semibold">Public Notes</h6>
              </div>
            )}
            <button
              className="btn btn-sm btn-light p-1"
              onClick={() => setIsLeftSidebarOpen((prev) => !prev)}
            >
              <PanelLeft size={20} />
            </button>
          </div>

          <div className={`${isLeftSidebarOpen ? "p-3" : "p-2"}`}>
            {isLeftSidebarOpen ? (
              <>
                <button
                  className="btn theme-border theme-btn w-100 mb-3 d-flex align-items-center justify-content-center gap-2"
                  onClick={() => setPublicNoteModalOpen(true)}
                >
                  <Plus size={16} />
                  <span>Add Notes</span>
                </button>
                <div
                  className="d-flex flex-column gap-2 overflow-y-scroll"
                  style={{ maxHeight: "calc(100vh - 250px)" }}
                >
                  {selectedPublicNotes.length > 0 ? (
                    selectedPublicNotes.map((note, index) => (
                      <div
                        key={note && note._id}
                        className="card border d-flex flex-row justify-content-between shadow-sm p-2 cursor-pointer hover-bg-light"
                      >
                        <div>
                          <p className="fw-medium d-block text-truncate text-capitalize m-0">
                            {note && truncateText(note.title, 25)}
                          </p>
                          <p
                            className="text-muted m-0"
                            style={{ fontSize: "0.75rem" }}
                          >
                            {note && note.course?.name}
                          </p>
                        </div>
                        <button
                          className="btn px-0"
                          onClick={() => {
                            let n = [...selectedPublicNotes];
                            n.splice(index, 1);
                            setSelectedPublicNotes([...n]);
                          }}
                        >
                          <XIcon size={20} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted py-4">
                      <small>No notes selected</small>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  className="btn px-2 theme-btn"
                  onClick={() => setPublicNoteModalOpen(true)}
                >
                  <Plus size={16} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Middle Section - Chat Interface */}
        <div
          className="flex-grow-1 d-flex flex-column bg-white rounded-4 border"
          style={{ minWidth: "0" }}
        >
          <div className="flex-grow-1 overflow-auto">
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-end gap-2">
                <Bot size={22} />
                <h6 className="mb-0 fw-semibold">Chat</h6>
              </div>
              <div className="">
                <SlidersHorizontal size={20} />
              </div>
            </div>
            <div className="text-center text-muted mt-5">
              <div className="mb-3">
                <div className="bg-light rounded-circle d-inline-flex p-3">
                  <MessageSquare
                    size={32}
                    className="text-primary opacity-75"
                  />
                </div>
              </div>
              <h5>Start chatting with your notes</h5>
              <p className="small">
                Select a note from the left to begin context-aware
                conversations.
              </p>
            </div>
          </div>

          {/* Chat Input Area */}
          <div className="p-3 border-top">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Ask a question..."
              />
              <button className="btn theme-btn">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Resources */}
        <div
          className={`border rounded-4 bg-light d-flex flex-column ${!isRightSidebarOpen ? "collapsed" : ""} mx-3 mt-0`}
          style={{
            width: isRightSidebarOpen ? "300px" : "50px",
            minWidth: isRightSidebarOpen ? "300px" : "50px",
            transition: sidebarTransition,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            className={`${isRightSidebarOpen ? "p-3" : "px-2 py-3"} border-bottom d-flex ${isRightSidebarOpen ? "justify-content-between" : "justify-content-center"} align-items-center bg-white`}
            style={{ minWidth: isRightSidebarOpen ? "300px" : "50px" }}
          >
            {isRightSidebarOpen && (
              <div className="d-flex align-items-center gap-2">
                <Files size={18} className="text-secondary" />
                <h6 className="mb-0 fw-semibold">Resources</h6>
              </div>
            )}
            <button
              className="btn btn-sm btn-light p-1"
              onClick={() => setIsRightSidebarOpen((prev) => !prev)}
            >
              <PanelRight size={20} />
            </button>
          </div>

          <div className={`${isRightSidebarOpen ? "p-3" : "p-2"}`}>
            {isRightSidebarOpen ? (
              <>
                <button className="btn theme-border theme-btn w-100 mb-3 d-flex align-items-center justify-content-center gap-2">
                  <Upload size={16} />
                  <span>Upload Resource</span>
                </button>

                <h6
                  className="text-muted text-uppercase small fw-bold mb-3"
                  style={{ fontSize: "0.7rem" }}
                >
                  Attached Sources
                </h6>
                <div className="text-center text-muted py-4 border rounded border-dashed bg-white">
                  <small>No resources added yet</small>
                </div>
              </>
            ) : (
              <>
                <button className="btn px-2 theme-btn">
                  <Plus size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <footer className="my-2">
        <p className="m-0 text-center form-control-text-color fs-14">
          AskMyNotes AI can be inaccurate; please double-check its responses.
        </p>
      </footer>

      {/* Public Notes Modal */}
      <Modal
        open={publicNoteModalOpen}
        setOpen={setPublicNoteModalOpen}
        title="Add Public Notes"
        showFooter={true}
        footerContent={
          <>
            <button
              className="btn theme-btn rounded-pill px-3 py-2"
              onClick={() => {
                setSelectedPublicNotes(tempSelectedPublicNotes);
                setPublicNoteModalOpen(false);
              }}
            >
              Done
            </button>
          </>
        }
        children={
          <div>
            <div className="mb-3">
              <input
                id="public_notes_search"
                type="text"
                className="form-control bg-light"
                placeholder="Search public notes..."
                onChange={(e) => setPublicNotesSearchQuery(e.target.value)}
              />
            </div>
            <div
              className="d-flex flex-column gap-2 overflow-auto"
              style={{ height: "400px" }}
            >
              {publicNotes.length > 0 ? (
                publicNotes.map((note) => (
                  <div
                    key={note._id}
                    className={`card border shadow-sm p-3 cursor-pointer ${tempSelectedPublicNotes.some((n) => n._id === note._id) ? "border-primary bg-light" : ""}`}
                    onClick={() => handleNoteSelection(note)}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1 fw-semibold text-capitalize">
                          {note.title}
                        </h6>
                        <small className="text-muted">
                          {note.stream?.name} • {note.course?.name} •{" "}
                          {note.semester}
                          {note.semester === 1
                            ? "st"
                            : note.semester === 2
                              ? "nd"
                              : note.semester === 3
                                ? "rd"
                                : "th"}{" "}
                          Semester
                        </small>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={tempSelectedPublicNotes.some(
                            (n) => n._id === note._id,
                          )}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted py-5">
                  <Search size={32} className="mb-2 opacity-50" />
                  <p className="mb-0">No public notes found</p>
                </div>
              )}
            </div>
          </div>
        }
      />
    </div>
  );
}
