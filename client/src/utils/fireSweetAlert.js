import Swal from "sweetalert2";

function fireSweetAlert({ success, message, timer = 2000 }) {
  return Swal.fire({
    toast: true,
    position: "top-end",
    icon: success ? "success" : "error",
    title: message,
    showConfirmButton: false,
    timer: timer,
    customClass: {
      popup: success ? "success-toast" : "error-toast",
    },
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
}

function fireSweetAlertWithButtons({
  title,
  icon,
  showConfirmButton = true,
  showCancelButton = true,
  confirmButtonText = "Yes",
  cancelButtonText = "No",
}) {
  return Swal.fire({
    title,
    icon,
    showConfirmButton,
    confirmButtonText,
    cancelButtonText,
    showCancelButton,
  });
}

export { fireSweetAlert as default, fireSweetAlertWithButtons };
