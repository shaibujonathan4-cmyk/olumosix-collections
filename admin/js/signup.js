// admin/js/signup.js
import { auth, db } from "../../js/firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const form = document.getElementById("signup-form");
const errorEl = document.getElementById("signup-error");
const btn = document.getElementById("signup-btn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorEl.textContent = "";
  btn.disabled = true;
  btn.textContent = "Creating account...";

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", cred.user.uid), {
      name,
      email,
      role: "pending",
      createdAt: serverTimestamp()
    });

    errorEl.className = "form-success-inline";
    errorEl.textContent = "Account created. An admin needs to approve your access before you can log in.";
    form.reset();
  } catch (err) {
    console.error("Signup error:", err);
    if (err.code === "auth/email-already-in-use") {
      errorEl.textContent = "That email is already registered — try logging in instead.";
    } else if (err.code === "auth/weak-password") {
      errorEl.textContent = "Password should be at least 6 characters.";
    } else {
      errorEl.textContent = "Something went wrong creating your account.";
    }
  } finally {
    btn.disabled = false;
    btn.textContent = "Create Account";
  }
});