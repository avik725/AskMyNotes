function fireSweetAlert({ success, message, timer = 3000 }) {
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

export default fireSweetAlert;