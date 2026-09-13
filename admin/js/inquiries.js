// admin/js/inquiries.js
import { requireAdmin, logout } from "./auth.js";
import { db } from "../../js/firebase-config.js";
import { collection, getDocs, doc, updateDoc, deleteDoc, orderBy, query } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.getElementById("logout-btn").addEventListener("click", logout);

const tbody = document.getElementById("inquiries-tbody");
let allInquiries = [];
let currentFilter = "all";

requireAdmin(() => {
  loadInquiries();
});

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderInquiries();
  });
});

async function loadInquiries() {
  tbody.innerHTML = `<tr><td colspan="6">Loading inquiries...</td></tr>`;
  try {
    const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    allInquiries = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    renderInquiries();
  } catch (err) {
    console.error("Error loading inquiries:", err);
    tbody.innerHTML = `<tr><td colspan="6">Error loading inquiries.</td></tr>`;
  }
}

function renderInquiries() {
  const filtered = currentFilter === "all"
    ? allInquiries
    : allInquiries.filter((i) => i.status === currentFilter);

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6">No inquiries here yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = "";
  filtered.forEach((inq) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${inq.name || "—"}</td>
      <td>${inq.phone || ""}${inq.email ? `<br>${inq.email}` : ""}</td>
      <td>${inq.product || "—"}</td>
      <td style="max-width:220px;">${inq.message || ""}</td>
      <td>
        <select class="status-select" data-id="${inq.id}">
          <option value="new" ${inq.status === "new" ? "selected" : ""}>New</option>
          <option value="contacted" ${inq.status === "contacted" ? "selected" : ""}>Contacted</option>
          <option value="closed" ${inq.status === "closed" ? "selected" : ""}>Closed</option>
        </select>
      </td>
      <td><button class="admin-btn delete" data-id="${inq.id}">Delete</button></td>
    `;
    tbody.appendChild(row);
  });

  tbody.querySelectorAll(".status-select").forEach((sel) => {
    sel.addEventListener("change", () => updateStatus(sel.dataset.id, sel.value));
  });

  tbody.querySelectorAll(".admin-btn.delete").forEach((btn) => {
    btn.addEventListener("click", () => deleteInquiry(btn.dataset.id));
  });
}

async function updateStatus(id, status) {
  try {
    await updateDoc(doc(db, "inquiries", id), { status });
    const item = allInquiries.find((i) => i.id === id);
    if (item) item.status = status;
  } catch (err) {
    console.error("Error updating status:", err);
    alert("Something went wrong updating this inquiry.");
  }
}

async function deleteInquiry(id) {
  if (!confirm("Delete this inquiry? This can't be undone.")) return;
  try {
    await deleteDoc(doc(db, "inquiries", id));
    allInquiries = allInquiries.filter((i) => i.id !== id);
    renderInquiries();
  } catch (err) {
    console.error("Error deleting inquiry:", err);
    alert("Something went wrong deleting this inquiry.");
  }
}