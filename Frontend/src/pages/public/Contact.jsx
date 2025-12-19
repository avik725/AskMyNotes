import React from "react";
import supportImage from "@/assets/images/contact/support.png";

export default function Contact() {
  return (
    <main id="contact-page">
      {/* Contact Section Starts */}
      <section id="contact-section" className="pt-5 pb-4 pb-lg-2">
        <div className="container">
          <div className="row">
            <div className="col-lg-5 col-12 px-4 px-md-3">
              <div className="section-title mb-4">
                <h2 className="fw-bold mt-lg-0 fs-32">Contact Us</h2>
                <p className="form-control-text-color fs-14">
                  We're here to help! Reach out to us with any questions,
                  feedback, or concerns. We'll get back to you as soon as
                  possible.
                </p>
              </div>
              <form action="#">
                <div className="row">
                  <div className="col-12">
                    <div className="mb-3">
                      <label htmlFor="full_name" className="form-label">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="form-control py-md-3 py-2 rounded-4 bg-light fs-sm-14"
                        id="full_name"
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(
                            /[^a-zA-Z/s]/g,
                            ""
                          );
                        }}
                        name="full_name"
                        placeholder="Enter Your Full Name"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-6">
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control py-md-3 py-2 rounded-4 bg-light fs-sm-14"
                        id="email"
                        name="email"
                        placeholder="Enter Your Email"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-6">
                    <div className="mb-3">
                      <label htmlFor="mobile_number" className="form-label">
                        Mobile No.
                      </label>
                      <input
                        type="text"
                        className="form-control py-md-3 py-2 rounded-4 bg-light fs-sm-14"
                        id="mobile_number"
                        name="mobile_number"
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                        }}
                        placeholder="Enter Your Mobile No."
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="mb-4 pb-2">
                      <label htmlFor="message" className="form-label">
                        Message
                      </label>
                      <textarea
                        name="message"
                        id="message"
                        className="form-control py-md-3 py-2 rounded-4 bg-light fs-sm-14"
                        placeholder="Enter Your Message"
                        // style="height: 150px; resize: none"
                        style={{ height: 150, resize: "none" }}
                      ></textarea>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="">
                      <button
                        type="submit"
                        className="btn submitBtn border-0 fs-18 theme-btn w-100 rounded-pill fw-bold py-2"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="col-lg-6 col-12 offset-lg-1 px-4 px-md-3">
              <div className="img-container mt-4 mt-lg-0">
                <img
                  src={supportImage}
                  alt="Image"
                  className="img-fluid border border-1 rounded-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Contact Section Ends */}
    </main>
  );
}
