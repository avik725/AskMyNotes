import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
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
  Pencil,
} from "lucide-react";
import { Modal } from "@/components";
import {
  chatToRAGHandler,
  checkConversationConnectionHandler,
  connectConversationHandler,
  disconnectConversationHandler,
  getConversationByIdHandler,
  getConversationMessagesHandler,
  getNonPaginatedNotesHandler,
  updateConversationSourcesHandler,
  updateConversationTitleHandler,
} from "@/services/apiHandlers";
import useDebounce from "@/hooks/useDebounce";
import { truncateText } from "@/utils/helpers";
import { routeSet } from "@/routes/routeSet";
import fireSweetAlert from "@/utils/fireSweetAlert";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

function preprocessLatex(content) {
  // Convert block-level LaTeX delimiters: \[...\] → $$...$$
  const blockProcessed = content.replace(
    /\\\[([\s\S]*?)\\\]/g,
    (_, equation) => `$$${equation}$$`,
  );
  // Convert inline LaTeX delimiters: \(...\) → $...$
  const inlineProcessed = blockProcessed.replace(
    /\\\(([\s\S]*?)\\\)/g,
    (_, equation) => `$${equation}$`,
  );
  return inlineProcessed;
}

export default function AINotebook() {
  const params = useParams();
  const navigate = useNavigate();
  const [isConversationConnected, setIsConversationConnected] = useState(false);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [publicNoteModalOpen, setPublicNoteModalOpen] = useState(false);
  const [publicNotes, setPublicNotes] = useState([]);
  const [publicNoteSearchQuery, setPublicNotesSearchQuery] = useState("");
  const debouncedPublicNoteSearchQuery = useDebounce(publicNoteSearchQuery);
  const [selectedPublicNotes, setSelectedPublicNotes] = useState([]);
  const [tempSelectedPublicNotes, setTempSelectedPublicNotes] = useState([]);
  const [conversationInfo, setConversationInfo] = useState(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [user_query, setUserQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [isGettingResponse, setIsGettingResponse] = useState(false);
  const firstLoad = useRef(true);

  function closeCurrentConversation() {
    if (isConversationConnected) {
      fireSweetAlert({
        success: false,
        message: "Disconnect Conversation to Close !!",
      });
      return;
    }
    navigate(routeSet.authenticated.askAI);
  }

  async function connectConversation() {
    try {
      const response = await connectConversationHandler(params.id);

      fireSweetAlert({
        success: response.success,
        message:
          response.message ||
          (response.success
            ? "Connected Successfully !!"
            : "Unable to Connect !!"),
      });

      if (response.success) {
        setIsConversationConnected(true);
      }
    } catch (error) {
      fireSweetAlert({
        success: false,
        message: error.message || "Unable to Connect !!",
      });
      console.error("Conversation Connection Error : ", error);
    }
  }

  async function checkConversationConnection() {
    try {
      const response = await checkConversationConnectionHandler(params.id);

      if (response.data?.connected) {
        fireSweetAlert({
          success: response.success,
          message:
            response.message ||
            (response.success
              ? "Connected Successfully !!"
              : "Unable to Connect !!"),
        });

        setIsConversationConnected(true);
      }
    } catch (error) {
      fireSweetAlert({
        success: false,
        message: error.message || "Unable to Disconnect !!",
      });
      console.error("Conversation Connection Error: ", error);
    }
  }

  async function disconnectConversation() {
    if (isConversationConnected) {
      try {
        const response = await disconnectConversationHandler(params.id);

        if (response.success) {
          fireSweetAlert({
            success: response.success,
            message:
              response.message ||
              (response.success
                ? "Disconnected Successfully !!"
                : "Unable to Connect !!"),
          });

          setIsConversationConnected(false);
        }
      } catch (error) {
        console.error("Conversation Connection Error: ", error);
      }
    }
  }

  async function fetchPublicNotes(search = "") {
    const response = await getNonPaginatedNotesHandler(search);

    if (response.success) {
      setPublicNotes([...response.data]);
      return response.data;
    }
    return [];
  }

  async function fetchCoversationInfo(id) {
    const response = await getConversationByIdHandler(id);

    if (response.success) {
      setConversationInfo(response?.data);
      return response?.data;
    } else {
      fireSweetAlert({
        success: response.success || false,
        message:
          response.message ||
          "Something Went Wrong While Fetching Conversation Info !!",
      });
      return null;
    }
  }

  async function updateSources(notes) {
    let selectedSources = notes?.map((n) => {
      return n._id;
    });
    const response = await updateConversationSourcesHandler(
      params?.id,
      selectedSources,
    );

    if (!response.success) {
      fireSweetAlert({
        success: response.success || false,
        message:
          response.message || "Something went wrong while updating sources !!",
      });
    }
  }

  async function updateTitle() {
    if (!editedTitle.trim() || editedTitle.trim() === conversationInfo?.title) {
      setIsEditingTitle(false);
      return;
    }

    const response = await updateConversationTitleHandler(
      params?.id,
      editedTitle.trim(),
    );

    fireSweetAlert({
      success: response.success || false,
      message:
        response.message ||
        (response.success
          ? "Conversation Title Updated Successfully !!"
          : "Something went wrong while updating title !!"),
    });
    if (response.success) {
      setConversationInfo((prev) => ({
        ...prev,
        title: editedTitle.trim(),
      }));
    }
    setIsEditingTitle(false);
  }

  function handleTitleEditStart() {
    setEditedTitle(conversationInfo?.title || "Untitled Notebook");
    setIsEditingTitle(true);
  }

  function handleTitleKeyDown(e) {
    if (e.key === "Enter") {
      updateTitle();
    } else if (e.key === "Escape") {
      setIsEditingTitle(false);
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

  async function chatToRAG(e) {
    if (!user_query || user_query.trim === "") {
      return;
    }

    setIsGettingResponse(true);
    const query = user_query;
    setUserQuery("");
    setMessages((prev) => {
      return [...prev, { role: "user", content: user_query }];
    });

    const response = await chatToRAGHandler({
      conversation_id: params?.id,
      user_query: query,
    });

    setMessages((prev) => {
      return [...prev, { role: "assistant", content: response.data.response }];
    });

    setIsGettingResponse(false);
  }

  async function getMessages() {
    try {
      const response = await getConversationMessagesHandler(params?.id);

      if (response.data && Array.isArray(response.data)) {
        setMessages([...response.data]);
      }

      if (!response.success) {
        fireSweetAlert({
          success: response.success || false,
          message:
            response.message ||
            "Something went wrong while fetching messages !!",
        });
      }
    } catch (error) {
      console.error("Failed to Fetch Messages : ", error.message);
    }
  }

  useEffect(() => {
    if (publicNoteModalOpen) {
      setTempSelectedPublicNotes(selectedPublicNotes);
    }
  }, [publicNoteModalOpen]);

  useEffect(() => {
      fetchPublicNotes(debouncedPublicNoteSearchQuery);
  }, [debouncedPublicNoteSearchQuery]);

  useEffect(() => {
    async function initializeData() {
      const [notes, conversation] = await Promise.all([
        fetchPublicNotes(),
        fetchCoversationInfo(params.id),
      ]);

      if (
        conversation?.allowed_sources &&
        Array.isArray(conversation.allowed_sources) &&
        notes.length > 0
      ) {
        const preSelectedNotes = notes.filter((note) =>
          conversation.allowed_sources.includes(note._id),
        );
        setSelectedPublicNotes(preSelectedNotes);
      }
    }

    initializeData();
  }, [params.id]);

  useEffect(() => {
    checkConversationConnection();
    getMessages();
  }, []);

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    if (
      isConversationConnected &&
      messages.length > 0 &&
      document.getElementById("bottomAnchor")
    ) {
      document
        .getElementById("bottomAnchor")
        .scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, isConversationConnected]);

  // Styles for transitions
  const sidebarTransition = "all 0.3s ease-in-out";

  return (
    <div
      className="d-flex flex-column"
      style={{ height: "100vh", overflow: "hidden" }}
    >
      {/* Notebook Header */}
      <div className="bg-white py-3 px-3 d-md-flex d-block align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <img src={logo} alt="AMN Logo" style={{ maxWidth: 40 }} />
          {isEditingTitle ? (
            <input
              type="text"
              className="form-control fw-bold fs-5 ps-2"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={updateTitle}
              onKeyDown={handleTitleKeyDown}
              autoFocus
              style={{ maxWidth: "400px" }}
            />
          ) : (
            <div
              className="d-flex align-items-center gap-2 cursor-pointer"
              onClick={handleTitleEditStart}
              title="Click to edit title"
            >
              <h3 className="mb-0 fw-bold text-black ps-2">
                {truncateText(conversationInfo?.title, 30) ||
                  "Untitled Notebook"}
              </h3>
              <Pencil size={16} className="text-muted" />
            </div>
          )}
        </div>
        <div className="d-block d-md-flex justify-content-between text-center text-md-start gap-3 mt-2 mt-md-0">
          <button
            className={`btn ${isConversationConnected ? "bg-danger-subtle" : "bg-success-subtle"} rounded-4`}
            onClick={
              isConversationConnected
                ? disconnectConversation
                : connectConversation
            }
          >
            {!isConversationConnected ? "Connect" : "Disconnect"}
          </button>
          <button
            onClick={closeCurrentConversation}
            className="btn bg-danger-subtle rounded-4 ms-4 ms-md-0"
          >
            Close Conversation
          </button>
        </div>
      </div>

      <div
        className="d-flex flex-grow-1 position-relative pb-3"
        style={{ overflow: "hidden" }}
      >
        {/* Left Sidebar - Public Notes */}
        <div
          className={`border shadow rounded-4 bg-light d-flex flex-column ${!isLeftSidebarOpen ? "collapsed" : ""} mx-3 mt-0`}
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
                            updateSources([...n]);
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
          className="flex-grow-1 d-flex flex-column bg-light rounded-4 border me-3 overflow-hidden shadow"
          style={{ minWidth: "0" }}
        >
          <div className="d-flex flex-column flex-grow-1 overflow-auto">
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-white">
              <div className="d-flex align-items-end gap-2">
                <Bot size={22} />
                <h6 className="mb-0 fw-semibold">Chat</h6>
              </div>
              <div className="">
                <SlidersHorizontal size={20} />
              </div>
            </div>
            <div
              className={`flex-grow-1 text-center text-muted mt-5 ${messages.length > 0 && isConversationConnected && "d-flex justify-content-end flex-column"}`}
            >
              {messages.length > 0 ? (
                <>
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={`d-flex ${message.role === "user" ? "justify-content-end" : "justify-content-start"} px-3 py-2`}
                    >
                      <div
                        className={`d-inline-block ${message.role === "user" ? "bg-white border px-3 py-2 rounded-top-4 rounded-start-4 shadow text-end max-w-75" : "text-justify pe-5"}`}
                      >
                        <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                        >
                          {preprocessLatex(message.content)}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))}
                  {isGettingResponse && (
                    <div className="d-flex justify-content-start px-3 py-2 gap-2">
                      <div
                        className="rounded-circle bg-black animate-pulse"
                        style={{ width: 3, height: 3 }}
                      ></div>
                      <div
                        className="rounded-circle bg-black animate-pulse"
                        style={{ width: 3, height: 3, animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="rounded-circle bg-black animate-pulse"
                        style={{ width: 3, height: 3, animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  )}
                  <div id="bottomAnchor"></div>
                </>
              ) : (
                <>
                  <div className="mb-3">
                    <div className="bg-light rounded-circle d-inline-flex p-3">
                      <MessageSquare
                        size={32}
                        className="text-primary opacity-75"
                      />
                    </div>
                  </div>
                  {isConversationConnected && selectedPublicNotes.length > 0 ? (
                    <>
                      <h5>Start chatting with your notes</h5>
                      <p className="small">
                        Ask questions about your selected notes.
                      </p>
                    </>
                  ) : (
                    <>
                      <h5>Connect and Add Notes to Start chatting</h5>
                      <p className="small">
                        Select a note from the left and connect chat to begin
                        context-aware conversations.
                      </p>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Chat Input Area */}
          <div className="p-3 border-top bg-white">
            <div className="input-group">
              <textarea
                id="chat-input"
                name="chat-input"
                type="text"
                value={user_query}
                onChange={(e) => setUserQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.shiftKey && e.key === "Enter") {
                    e.preventDefault();
                    chatToRAG();
                  }
                }}
                className="form-control text-wrap"
                placeholder={
                  (isConversationConnected &&
                  selectedPublicNotes.length > 0) ?
                  "Ask a question..." : "Connect and Add Notes to Chat..."
                }
                disabled={
                  !(isConversationConnected && selectedPublicNotes.length > 0)
                }
                style={{
                  resize: "none",
                  maxHeight: "20vh",
                }}
              />
              <button onClick={chatToRAG} className="btn theme-btn">
                Shift + Enter <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Resources */}
        {/* <div
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
        </div> */}
      </div>
      <footer className="mb-2">
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
                updateSources(tempSelectedPublicNotes);
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
