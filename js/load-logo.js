// js/load-logo.js
// Include this on every page (public + admin) to swap in the admin-uploaded logo, if one exists.
// Falls back silently to the static assets/images/logo.png already in the <img> tag.

import { db } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

async function loadLogo() {
  try {
    const settingsDoc = await getDoc(doc(db, "settings", "site"));
    if (settingsDoc.exists() && settingsDoc.data().logoUrl) {
      document.querySelectorAll(".site-logo").forEach((img) => {
        img.src = settingsDoc.data().logoUrl;
      });
    }
  } catch (err) {
    console.error("Error loading site logo:", err);
    // Fails silently — the static fallback logo stays in place.
  }
}

loadLogo();