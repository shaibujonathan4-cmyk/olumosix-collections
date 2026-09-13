// admin/js/auth.js
import { auth, db } from "../../js/firebase-config.js";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const loginForm = document.getElementById("login-form");
const errorEl = document.getElementById("login-error");
const loginBtn = document.getElementById("login-btn");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.textContent = "";
    loginBtn.disabled = true;
    loginBtn.textContent = "Signing in...";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", cred.user.uid));

      if (!userDoc.exists() || userDoc.data().role !== "admin") {
        errorEl.textContent = "This account doesn't have admin access.";
        await signOut(auth);
        loginBtn.disabled = false;
        loginBtn.textContent = "Sign In";
        return;
      }

      window.location.href = "dashboard.html";
    } catch (err) {
      console.error("Login error:", err);
      errorEl.textContent = "Incorrect email or password.";
      loginBtn.disabled = false;
      loginBtn.textContent = "Sign In";
    }
  });
}

// Call this at the top of every protected admin page (dashboard, products, branding, users)
export function requireAdmin(callback) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists() || userDoc.data().role !== "admin") {
      await signOut(auth);
      window.location.href = "login.html";
      return;
    }
    callback(user, userDoc.data());
  });
}

export async function logout() {
  await signOut(auth);
  window.location.href = "login.html";
}