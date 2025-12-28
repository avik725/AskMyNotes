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

  // Expose function to window for use in DataTable HTML strings
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
  return (
    <main id="home-page">
      {/* Hero Section Starts */}
      <section
        id="hero-section"
        className="d-flex justify-content-center align-items-center"
      >
        <div className="container">
          <div className="hero-text text-center">
            <h2 className="text-white fw-bold fs-1">
              Share and Download Study Notes Easily
            </h2>
            <p className="text-white fs-16 fs-sm-14">
              Access a vast library of study notes, collaborate with peers, and
              excel in your courses.
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
      {/* Hero Section Ends */}

      {/* Notes Section Starts */}
      <section id="notes-section" className="pb-lg-5 pb-md-3 pb-2">
        <div className="container notes-container">
          <div className="row">
            {carouselItems?.map((row) => {
              return (
                <div key={row?.stream._id} className="col-12">
                  <h3 className="fw-bold my-4 ps-2">{row?.stream?.name}</h3>
                  <Carousel
                    dots={false}
                    slidesToShow={3}
                    slidesToScroll={1}
                    speed={2000}
                    autoplay={true}
                    autoplaySpeed={6000}
                    lazyLoad={true}
                  >
                    {row?.notes.map((note) => {
                      return (
                        <div
                          key={note._id}
                          onClick={() =>
                            openNoteModal(note.title, note.file_url)
                          }
                          className="px-lg-3 px-md-2 px-3 h-100"
                        >
                          <div className="card rounded-4 overflow-hidden border-0 shadow-sm h-100">
                            <div className="card-img w-100 rounded-3">
                              <img
                                src={note.thumbnail}
                                alt="card-image"
                                className="img-fluid"
                                style={{ maxHeight: 250 }}
                              />
                            </div>
                            <div className="card-text px-4 py-3">
                              <h5
                              className="text-capitalize"
                                style={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  maxWidth: "100%",
                                }}
                              >
                                {note.title}
                              </h5>
                              <p className="text-black-50 fs-14">
                                <span className="border-end border-1 pe-2 me-2 text-black-50">
                                  {note?.course?.name}
                                </span>
                                {note?.semester
                                  ? `Semester ${note?.semester}`
                                  : `${note?.year} Year`}
                              </p>
                            </div>
                            <div className="card-button mt-4 text-center px-4 py-2">
                              <button
                                className="theme-btn fs-14 rounded-pill w-100 fw-bold py-2 border-0"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                              >
                                View
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </Carousel>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* Notes Section Ends */}

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
