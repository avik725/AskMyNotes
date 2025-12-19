export default function MyUploads() {
  return (
    <main id="myuploads-page">
      {/* My Uploads Section Starts */}
      <section id="myuploads-section" className="py-5">
        <div className="container px-5">
          <div className="section-title mb-4">
            <h2 className="fw-bold">My Uploads</h2>
            <p className="form-control-text-color fs-14">
              Manage your shared notes and resources
            </p>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="card rounded-4 border-secondary-subtle p-4">
                <p className="">Total Uploads</p>
                <h4 className="fw-bold fs-26 total_uploads">0</h4>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card rounded-4 border-secondary-subtle p-4 mt-4 mt-md-0">
                <p className="">Total Downloads</p>
                <h4 className="fw-bold fs-26 total_downloads">0</h4>
              </div>
            </div>
          </div>
          <div className="uploaded-notes mt-5">
            <h5 className="fw-bold fs-22 mb-4 ps-2">Uploaded Notes</h5>
            <div id="table-wrapper"></div>
          </div>
        </div>
      </section>
      {/* My Uploads Section Starts */}

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
