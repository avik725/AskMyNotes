import React, { useCallback, useEffect, useState } from "react";
import logo from "@/assets/images/logo_icon.png";
import cardImage1 from "@/assets/images/card-image-1.png";
import cardImage2 from "@/assets/images/card-image-2.png";
import cardImage3 from "@/assets/images/card-image-3.png";
import ThemeButton from "@/components/themeButton";
import { useNavigate } from "react-router";
import { routeSet } from "@/routes/routeSet";
import { Carousel, Modal } from "@/components";
import { getStreamWiseNotesHandler } from "@/services/apiHandlers";
import { truncateFileName, truncateText } from "@/utils/helpers";
import {
  Upload,
  Search,
  MessageCircle,
  BrainCircuit,
  FileUp,
  Download,
  MessageSquare,
} from "lucide-react";

export default function Home() {
  const [carouselItems, setCarouselItems] = useState([]);
  const navigate = useNavigate();
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

  useEffect(() => {
    window.buildModal = (title, file_url) => {
      openNoteModal(title, file_url);
    };

    return () => {
      delete window.buildModal;
    };
  }, [openNoteModal]);

  useEffect(() => {
    async function getStreamWiseData() {
      const response = await getStreamWiseNotesHandler();
      setCarouselItems(response.data);
    }
    getStreamWiseData();
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show-pop");
        } else {
          entry.target.classList.remove("show-pop");
        }
      });
    }, observerOptions);

    const cards = document.querySelectorAll(".scroll-card");
    cards.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <main id="home-page">
      <style dangerouslySetInnerHTML={{ __html: `
        .scroll-card {
          opacity: 0;
          transform: scale(0.85) translateY(40px);
          transition: all 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 10px 30px rgba(0,0,0,0.08) !important;
          border: 1px solid rgba(0,0,0,0.05) !important;
        }
        .scroll-card.show-pop {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
        .delay-1 { transition-delay: 0.1s; }
        .delay-2 { transition-delay: 0.3s; }
        .delay-3 { transition-delay: 0.5s; }
      `}} />

      <section
        id="hero-section"
        className="d-flex justify-content-center align-items-center pt-5 mt-4"
      >
        <div className="container">
          <div className="hero-text text-center">
            <h1 className="fs-48 fs-md-40 fs-sm-27 text-white fw-bold">
              Your Smart Companion for
            </h1>
            <h1 className="text-white fw-bold fs-sm-27 fs-md-36">
              Study Notes & Learning
            </h1>
            <p className="text-white fs-16 fs-sm-14">
              Upload, share and learn from PDF notes with the power of AI.{" "}
              <br />
              Get instant answer to your questions and ace your exams
              effortlessly.
            </p>
            <ThemeButton
              onClick={() => navigate(routeSet.public.notesGallery)}
              className="px-3 py-md-3 py-2 mt-1"
              fontSize={16}
            >
              Explore Notes
            </ThemeButton>
          </div>
        </div>
      </section>

      <section id="how-it-works-section" className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold fs-36 fs-md-30 fs-sm-24">How It Works</h2>
            <p className="text-black-50 fs-18 mt-2">
              Get started in three simple steps
            </p>
          </div>
          <div className="row g-4">
            <div className="col-md-4 text-center">
              <div className="card scroll-card delay-1 rounded-4 p-4 h-100">
                <div className="d-flex justify-content-center align-items-center mb-3">
                  <div className="p-3 theme-bg rounded-circle d-inline-flex position-relative">
                    <FileUp size={36} />
                    <span className="position-absolute translate-middle badge rounded-circle bg-primary" style={{top: '10%', left: '90%'}}>
                      1
                    </span>
                  </div>
                </div>
                <h4 className="fw-bold mb-3">Upload Your Notes</h4>
                <p className="text-black-50 fs-16 px-md-2">
                  Easily upload your study materials in PDF format. Our secure
                  platform ensures your notes are safe while making them
                  accessible for AI-powered learning.
                </p>
              </div>
            </div>

            <div className="col-md-4 text-center">
              <div className="card scroll-card delay-2 rounded-4 p-4 h-100">
                <div className="d-flex justify-content-center align-items-center mb-3">
                  <div className="p-3 theme-bg rounded-circle d-inline-flex position-relative">
                    <Search size={36} />
                    <span className="position-absolute translate-middle badge rounded-circle bg-primary" style={{top: '10%', left: '90%'}}>
                      2
                    </span>
                  </div>
                </div>
                <h4 className="fw-bold mb-3">Browse & Download</h4>
                <p className="text-black-50 fs-16 px-md-2">
                  Explore a vast library of notes shared by students. Find
                  exactly what you need, preview the content, and download files
                  instantly for offline study.
                </p>
              </div>
            </div>

            <div className="col-md-4 text-center">
              <div className="card scroll-card delay-3 rounded-4 p-4 h-100">
                <div className="d-flex justify-content-center align-items-center mb-3">
                  <div className="p-3 theme-bg rounded-circle d-inline-flex position-relative">
                    <BrainCircuit size={36} />
                    <span className="position-absolute translate-middle badge rounded-circle bg-primary" style={{top: '10%', left: '90%'}}>
                      3
                    </span>
                  </div>
                </div>
                <h4 className="fw-bold mb-3">Ask AI Questions</h4>
                <p className="text-black-50 fs-16 px-md-2">
                  Interact with your notes using our advanced AI. Ask questions,
                  get summaries, and clarify doubts instantly to enhance your
                  understanding and retention of the material.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="everything-you-need-to-excel-section" className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold fs-36 fs-md-30 fs-sm-24">
              Everything You Need to Excel
            </h2>
            <p className="text-black-50 fs-18 mt-2">
              Powerful features designed specifically for students
            </p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card scroll-card delay-1 rounded-4 p-4 h-100">
                <div className="d-flex justify-content-start align-items-center mb-3 px-md-2">
                  <div className="p-3 theme-bg rounded-circle d-inline-flex">
                    <Upload size={36} />
                  </div>
                </div>
                <h4 className="fw-bold mb-3 text-start px-md-2">
                  Upload Notes
                </h4>
                <p className="text-black-50 text-start fs-16 px-md-2">
                  Easily upload your PDF notes and share them with fellow
                  students. Help others while building your repository.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card scroll-card delay-2 rounded-4 p-4 h-100">
                <div className="d-flex justify-content-start align-items-center mb-3 px-md-2">
                  <div className="p-3 theme-bg rounded-circle d-inline-flex">
                    <Download size={36} />
                  </div>
                </div>
                <h4 className="fw-bold mb-3 text-start px-md-2">
                  Download Notes
                </h4>
                <p className="text-black-50 text-start fs-16 px-md-2">
                  Access thousands of quality notes uploaded by students. Find
                  exactly what you need for your subjects.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card scroll-card delay-3 rounded-4 p-4 h-100">
                <div className="d-flex justify-content-start align-items-center mb-3 px-md-2">
                  <div className="p-3 theme-bg rounded-circle d-inline-flex">
                    <MessageSquare size={36} />
                  </div>
                </div>
                <h4 className="fw-bold mb-3 text-start px-md-2">
                  Ask AI from PDF
                </h4>
                <p className="text-black-50 text-start fs-16 px-md-2">
                  Get instant answers from your PDFs using AI. Ask questions and
                  understand concepts faster than ever before.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

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