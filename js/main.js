// js/main.js
// Shared behavior across public pages — highlights the current nav link.

const currentPage = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".navbar nav a").forEach((link) => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("active-link");
  }
});