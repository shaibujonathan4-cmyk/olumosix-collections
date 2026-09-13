// admin/js/branding.js
import { requireAdmin, logout } from "./auth.js";
import { db, storage } from "../../js/firebase-config.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

document.getElementById("logout-btn").addEventListener("click", logout);

const preview = document.getElementById("current-logo-preview");
const form = document.getElementById("branding-form");
const statusEl = document.getElementById("branding-status");
const saveBtn = document.getElementById("save-logo-btn");

requireAdmin(async () => {
  try {
    const settingsDoc = await getDoc(doc(db, "settings", "site"));
    if (settingsDoc.exists() && settingsDoc.data().logoUrl) {
      preview.src = settingsDoc.data().logoUrl;
    }
  } catch (err) {
    console.error("Error loading current logo:", err);
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const file = document.getElementById("logo-file").files[0];
  if (!file) {
    statusEl.textContent = "Choose an image file first.";
    return;
  }

  saveBtn.disabled = true;
  saveBtn.textContent = "Uploading...";
  statusEl.textContent = "";

  try {
    const logoPath = `branding/logo-${Date.now()}-${file.name}`;
    const storageRef = ref(storage, logoPath);
    await uploadBytes(storageRef, file);
    const logoUrl = await getDownloadURL(storageRef);

    await setDoc(doc(db, "settings", "site"), { logoUrl, logoPath }, { merge: true });

    preview.src = logoUrl;
    statusEl.textContent = "Logo updated across the site.";
    statusEl.className = "form-success";
    form.reset();
  } catch (err) {
    console.error("Error updating logo:", err);
    statusEl.textContent = "Something went wrong uploading the logo.";
    statusEl.className = "form-error";
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = "Update Logo";
  }
});