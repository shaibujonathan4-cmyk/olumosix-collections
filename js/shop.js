// js/shop.js
import { db } from "./firebase-config.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const grid = document.getElementById("product-grid");
const loadingMsg = document.getElementById("loading-msg");

async function loadProducts() {
  try {
    const q = query(collection(db, "products"), where("visible", "==", true));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      grid.innerHTML = "<p>No pairs are listed right now — check back soon.</p>";
      return;
    }

    grid.innerHTML = "";

    snapshot.forEach((doc) => {
      const product = doc.data();
      const card = document.createElement("article");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.name}">
        <div class="info">
          <h3>${product.name}</h3>
          <p class="price">₦${Number(product.price).toLocaleString()}</p>
          <a href="contact.html?product=${encodeURIComponent(product.name)}" class="btn-small">Inquire</a>
        </div>
      `;
      grid.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading products:", err);
    grid.innerHTML = "<p>Something went wrong loading the collection. Please try again shortly.</p>";
  }
}

loadProducts();