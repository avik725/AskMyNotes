import React from "react";
import logo from "@/assets/images/logo_icon.png";
import cardImage1 from "@/assets/images/card-image-1.png";
import cardImage2 from "@/assets/images/card-image-2.png";
import cardImage3 from "@/assets/images/card-image-3.png";
import ThemeButton from "@/components/themeButton";
import { useNavigate } from "react-router";
import { routeSet } from "@/routes/routeSet";

export default function Home() {
  const navigate = useNavigate()
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
              onClick={()=>navigate(routeSet.authenticated.notesGallery)}
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
            <div className="col-12">
              <h3 className="fw-bold my-4 ps-2">Medical Engineering</h3>
              <div className="owl-carousel owl-theme">
                <div className="px-lg-3 px-md-2 px-3 h-100">
                  <div className="card rounded-4 overflow-hidden border-0 shadow-sm h-100">
                    <div className="card-img w-100 rounded-3">
                      <img
                        src={cardImage1}
                        alt="card-image"
                        className="img-fluid"
                      />
                    </div>
                    <div className="card-text px-4 py-3">
                      <h5>Calculus I - Chapter 3</h5>
                      <p className="text-black-50 fs-14">
                        <span className="border-end border-1 pe-2 me-2 text-black-50">
                          Mathematics
                        </span>
                        Semester 1
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
                <div className="px-lg-3 px-md-2 px-3">
                  <div className="card rounded-4 overflow-hidden border-0 shadow-sm h-100">
                    <div className="card-img w-100 rounded-3">
                      <img
                        src={cardImage2}
                        alt="card-image"
                        className="img-fluid"
                      />
                    </div>
                    <div className="card-text px-4 py-3">
                      <h5>Introduction to Psychology</h5>
                      <p className="text-black-50 fs-14">
                        <span className="border-end border-1 pe-2 me-2 text-black-50">
                          Psychology
                        </span>
                        Semester 3
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
                <div className="px-lg-3 px-md-2 px-3">
                  <div className="card rounded-4 overflow-hidden border-0 shadow-sm h-100">
                    <div className="card-img w-100 rounded-3">
                      <img
                        src={cardImage3}
                        alt="card-image"
                        className="img-fluid"
                      />
                    </div>
                    <div className="card-text px-4 py-3">
                      <h5>Organic Chemistry - Reactions</h5>
                      <p className="text-black-50 fs-14">
                        <span className="border-end border-1 pe-2 me-2 text-black-50">
                          Chemistry
                        </span>
                        Semester 3
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
                <div className="px-lg-3 px-md-2 px-3">
                  <div className="card rounded-4 overflow-hidden border-0 shadow-sm h-100">
                    <div className="card-img w-100 rounded-3">
                      <img
                        src={cardImage3}
                        alt="card-image"
                        className="img-fluid"
                      />
                    </div>
                    <div className="card-text px-4 py-3">
                      <h5>Organic Chemistry - Reactions</h5>
                      <p className="text-black-50 fs-14">
                        <span className="border-end border-1 pe-2 me-2 text-black-50">
                          Chemistry
                        </span>
                        Semester 3
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
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Notes Section Ends */}

      {/* Modal Box Starts */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Modal title
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">...</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal Box Ends */}
    </main>
  );
}
