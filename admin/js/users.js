// admin/js/users.js
import { requireAdmin, logout } from "./auth.js";
import { db } from "../../js/firebase-config.js";
import { collection, getDocs, doc, updateDoc, orderBy, query } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.getElementById("logout-btn").addEventListener("click", logout);

const tbody = document.getElementById("users-tbody");
let currentUserId = null;

requireAdmin((user) => {
  currentUserId = user.uid;
  loadUsers();
});

async function loadUsers() {
  tbody.innerHTML = `<tr><td colspan="4">Loading users...</td></tr>`;
  try {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      tbody.innerHTML = `<tr><td colspan="4">No users found.</td></tr>`;
      return;
    }

    tbody.innerHTML = "";
    snapshot.forEach((docSnap) => {
      const u = docSnap.data();
      const isSelf = docSnap.id === currentUserId;
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${u.name || "—"}</td>
        <td>${u.email || "—"}</td>
        <td>${u.role}</td>
        <td>
          ${u.role !== "admin"
            ? `<button class="admin-btn primary" data-id="${docSnap.id}" data-action="promote">Make Admin</button>`
            : `<button class="admin-btn delete" data-id="${docSnap.id}" data-action="revoke" ${isSelf ? "disabled title='You can\\'t revoke yourself'" : ""}>Revoke</button>`
          }
        </td>
      `;
      tbody.appendChild(row);
    });

    tbody.querySelectorAll("button[data-action]").forEach((btn) => {
      btn.addEventListener("click", () => handleRoleChange(btn.dataset.id, btn.dataset.action));
    });
  } catch (err) {
    console.error("Error loading users:", err);
    tbody.innerHTML = `<tr><td colspan="4">Error loading users.</td></tr>`;
  }
}

async function handleRoleChange(userId, action) {
  const newRole = action === "promote" ? "admin" : "viewer";
  const confirmMsg = action === "promote"
    ? "Give this person full admin access?"
    : "Revoke this person's admin access?";
  if (!confirm(confirmMsg)) return;

  try {
    await updateDoc(doc(db, "users", userId), { role: newRole });
    loadUsers();
  } catch (err) {
    console.error("Error updating role:", err);
    alert("Something went wrong updating this user's role.");
  }
}