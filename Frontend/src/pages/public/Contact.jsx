import React, { useState } from "react";
import supportImage from "@/assets/images/contact/support.png";
import fireSweetAlert from "@/utils/fireSweetAlert";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const email = e.target.email.value;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      fireSweetAlert({
        success: false,
        message: "Invalid Email Address !"
      })
      setEmailInvalid(true);
      setLoading(false);
      return;
    }

    const scriptURL =
      "https://script.google.com/macros/s/AKfycbzJVm1qdsiWR-4SWOXeXjdd9CXWKjDo2rYzOuC5ttV8lo3ofg-2Wxouq9Wey_l0sOih/exec";

    try {
      const formData = new FormData(e.target);

      await fetch(scriptURL, {
        method: "POST",
        mode: "no-cors",
        body: formData,
      });

      fireSweetAlert({
        success: true,
        message: "Thank you! Your message has been successfully submitted.",
      });
      e.target.reset();
    } catch (error) {
      fireSweetAlert({
        success: false,
        message: "Something went wrong !!",
      });
      console.error("Error!", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="contact-page">
      <section id="contact-section" className="pt-5 pb-4 pb-lg-2">
        <div className="container">
          <div className="row">
            <div className="col-lg-5 col-12 px-4 px-md-3">
              <div className="section-title mb-4">
                <h2 className="fw-bold mt-lg-0 fs-32">Contact Us</h2>
                <p className="form-control-text-color fs-14">
                  Have questions or feedback? Reach out to our team, and we will
                  get back to you as soon as possible.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
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
                            /[^a-zA-Z\s]/g,
                            "",
                          );
                        }}
                        name="full_name"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-6">
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className={`form-control py-md-3 py-2 rounded-4 bg-light ${emailInvalid && "text-danger border border-danger"} fs-sm-14`}
                        id="email"
                        onInput={() => {
                          if (emailInvalid) setEmailInvalid(false);
                        }}
                        name="email"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-6">
                    <div className="mb-3">
                      <label htmlFor="mobile_number" className="form-label">
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        className="form-control py-md-3 py-2 rounded-4 bg-light fs-sm-14"
                        id="mobile_number"
                        name="mobile_number"
                        maxLength="10"
                        onInput={(e) => {
                          e.target.value = e.target.value
                            .replace(/[^0-9]/g, "")
                            .slice(0, 10);
                        }}
                        placeholder="Enter your mobile number"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="mb-4 pb-2">
                      <label htmlFor="message" className="form-label">
                        Your Message
                      </label>
                      <textarea
                        name="message"
                        id="message"
                        className="form-control py-md-3 py-2 rounded-4 bg-light fs-sm-14"
                        placeholder="How can we help you?"
                        style={{ height: 150, resize: "none" }}
                        required
                      ></textarea>
                    </div>
                  </div>
                  <div className="col-12">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn submitBtn border-0 fs-18 theme-btn w-100 rounded-pill fw-bold py-2"
                    >
                      {loading ? "Submitting..." : "Submit Inquiry"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="col-lg-6 col-12 offset-lg-1 px-4 px-md-3">
              <div className="img-container mt-4 mt-lg-0">
                <img
                  src={supportImage}
                  alt="Customer Support"
                  className="img-fluid border border-1 rounded-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
