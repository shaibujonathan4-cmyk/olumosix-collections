// admin/js/dashboard.js
import { requireAdmin, logout } from "./auth.js";
import { db } from "../../js/firebase-config.js";
import { collection, getCountFromServer, query, where } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.getElementById("logout-btn").addEventListener("click", logout);

requireAdmin(async (user, userData) => {
  document.getElementById("admin-name").textContent = userData.name ? `, ${userData.name}` : "";

  try {
    const productsSnap = await getCountFromServer(collection(db, "products"));
    document.getElementById("stat-products").textContent = productsSnap.data().count;
  } catch (err) {
    console.error("Error loading product count:", err);
  }

  try {
    const newInquiriesQuery = query(collection(db, "inquiries"), where("status", "==", "new"));
    const inquiriesSnap = await getCountFromServer(newInquiriesQuery);
    document.getElementById("stat-inquiries").textContent = inquiriesSnap.data().count;
  } catch (err) {
    console.error("Error loading inquiry count:", err);
  }
});