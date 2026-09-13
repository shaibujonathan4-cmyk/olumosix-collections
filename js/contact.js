// js/contact.js
import { db } from "./firebase-config.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const form = document.getElementById("inquiry-form");
const statusEl = document.getElementById("form-status");
const submitBtn = document.getElementById("submit-btn");
const productField = document.getElementById("product");

// Pre-fill the product field if arriving from a shop "Inquire" link
const params = new URLSearchParams(window.location.search);
const productParam = params.get("product");
if (productParam) {
  productField.value = decodeURIComponent(productParam);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";
  statusEl.textContent = "";

  const data = {
    name: form.name.value.trim(),
    phone: form.phone.value.trim(),
    email: form.email.value.trim(),
    product: form.product.value.trim(),
    message: form.message.value.trim(),
    status: "new",
    createdAt: serverTimestamp()
  };

  try {
    await addDoc(collection(db, "inquiries"), data);
    statusEl.textContent = "Thanks — your inquiry has been sent. We'll be in touch soon.";
    statusEl.className = "form-success";
    form.reset();
  } catch (err) {
    console.error("Error sending inquiry:", err);
    statusEl.textContent = "Something went wrong sending your inquiry. Please try again or reach out directly.";
    statusEl.className = "form-error";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Send Inquiry";
  }
});