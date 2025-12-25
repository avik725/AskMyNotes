import { useEffect, useCallback } from "react";

export default function Modal({
  open,
  setOpen,
  title = "Modal title",
  children,
  onClose,
  showFooter = true,
  footerContent,
  size = "", // "modal-sm", "modal-lg", "modal-xl"
  backdrop = true,
  keyboard = true,
  closeBtn
}) {
  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
    setOpen(false);
  }, [onClose, setOpen]);

  // Handle body scroll lock when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {backdrop && (
        <div className="modal-backdrop fade show" onClick={handleClose}></div>
      )}

      <div
        className="modal fade show"
        style={{ display: "block" }}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="false"
      >
        <div
          className={`modal-dialog modal-dialog-centered modal-dialog-scrollable ${size}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5 text-capitalize" id="exampleModalLabel">
                {title}
              </h1>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleClose}
              ></button>
            </div>
            <div className="modal-body">{children || "..."}</div>
            {showFooter && (
              <div className="modal-footer">
                {footerContent}
                {closeBtn && (
                  <button
                    type="button"
                    className="btn btn-secondary rounded-pill py-2 px-3"
                    onClick={handleClose}
                  >
                    Close
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
