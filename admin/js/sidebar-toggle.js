// admin/js/sidebar-toggle.js
// Shared mobile hamburger toggle for the admin sidebar. Include on every
// admin page that has the .admin-sidebar / .admin-topbar markup.

const sidebar = document.querySelector(".admin-sidebar");
const toggleBtn = document.getElementById("sidebar-toggle");
const overlay = document.getElementById("sidebar-overlay");

function openSidebar() {
  sidebar.classList.add("open");
  overlay.classList.add("open");
}

function closeSidebar() {
  sidebar.classList.remove("open");
  overlay.classList.remove("open");
}

if (toggleBtn && sidebar && overlay) {
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.contains("open") ? closeSidebar() : openSidebar();
  });
  overlay.addEventListener("click", closeSidebar);
}