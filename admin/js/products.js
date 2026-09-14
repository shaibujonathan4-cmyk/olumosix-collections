// admin/js/products.js
import { requireAdmin, logout } from "./auth.js";
import { db } from "../../js/firebase-config.js";
import { uploadToCloudinary } from "../../js/cloudinary-config.js";
import {
  collection, addDoc, updateDoc, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.getElementById("logout-btn").addEventListener("click", logout);

const tbody = document.getElementById("products-tbody");
const modal = document.getElementById("product-modal");
const form = document.getElementById("product-form");
const modalTitle = document.getElementById("modal-title");
const statusEl = document.getElementById("product-form-status");
const saveBtn = document.getElementById("save-product-btn");
const currentImageHint = document.getElementById("current-image-hint");

let editingId = null;

requireAdmin(() => {
  loadProducts();
});

async function loadProducts() {
  tbody.innerHTML = `<tr><td colspan="5">Loading products...</td></tr>`;
  try {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      tbody.innerHTML = `<tr><td colspan="5">No products yet. Click "Add Product" to create the first one.</td></tr>`;
      return;
    }

    tbody.innerHTML = "";
    snapshot.forEach((docSnap) => {
      const p = docSnap.data();
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><img src="${p.imageUrl || ''}" alt="${p.name}" style="width:50px;height:50px;object-fit:cover;border-radius:4px;"></td>
        <td>${p.name}</td>
        <td>₦${Number(p.price).toLocaleString()}</td>
        <td>${p.visible ? "Yes" : "No"}</td>
        <td>
          <button class="admin-btn edit" data-id="${docSnap.id}">Edit</button>
          <button class="admin-btn delete" data-id="${docSnap.id}">Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });

    attachRowListeners(snapshot);
  } catch (err) {
    console.error("Error loading products:", err);
    tbody.innerHTML = `<tr><td colspan="5">Error loading products.</td></tr>`;
  }
}

function attachRowListeners(snapshot) {
  const docsById = {};
  snapshot.forEach((d) => (docsById[d.id] = d.data()));

  tbody.querySelectorAll(".admin-btn.edit").forEach((btn) => {
    btn.addEventListener("click", () => openModal(btn.dataset.id, docsById[btn.dataset.id]));
  });

  tbody.querySelectorAll(".admin-btn.delete").forEach((btn) => {
    btn.addEventListener("click", () => deleteProduct(btn.dataset.id));
  });
}

document.getElementById("add-product-btn").addEventListener("click", () => openModal(null, null));
document.getElementById("cancel-modal-btn").addEventListener("click", closeModal);

function openModal(id, data) {
  editingId = id;
  modalTitle.textContent = id ? "Edit Product" : "Add Product";
  document.getElementById("p-name").value = data?.name || "";
  document.getElementById("p-price").value = data?.price || "";
  document.getElementById("p-visible").checked = data ? data.visible : true;
  document.getElementById("p-image").value = "";
  currentImageHint.textContent = data?.imageUrl ? "Leave blank to keep the current photo." : "";
  statusEl.textContent = "";
  modal.classList.add("open");
}

function closeModal() {
  modal.classList.remove("open");
  form.reset();
  editingId = null;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  saveBtn.disabled = true;
  saveBtn.textContent = "Saving...";
  statusEl.textContent = "";

  const name = document.getElementById("p-name").value.trim();
  const price = Number(document.getElementById("p-price").value);
  const visible = document.getElementById("p-visible").checked;
  const imageFile = document.getElementById("p-image").files[0];

  try {
    let imageUrl;

    if (imageFile) {
      saveBtn.textContent = "Uploading photo...";
      imageUrl = await uploadToCloudinary(imageFile);
      saveBtn.textContent = "Saving...";
    }

    if (editingId) {
      const updateData = { name, price, visible };
      if (imageUrl) updateData.imageUrl = imageUrl;
      await updateDoc(doc(db, "products", editingId), updateData);
    } else {
      await addDoc(collection(db, "products"), {
        name,
        price,
        visible,
        imageUrl: imageUrl || "",
        createdAt: serverTimestamp()
      });
    }

    closeModal();
    loadProducts();
  } catch (err) {
    console.error("Error saving product:", err);
    statusEl.textContent = "Something went wrong saving this product. Please try again.";
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = "Save Product";
  }
});

async function deleteProduct(id) {
  if (!confirm("Delete this product? This can't be undone.")) return;
  try {
    await deleteDoc(doc(db, "products", id));
    loadProducts();
  } catch (err) {
    console.error("Error deleting product:", err);
    alert("Something went wrong deleting this product.");
  }
}