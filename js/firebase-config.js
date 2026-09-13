// js/firebase-config.js
// Uses the Firebase v10 modular SDK via CDN — no npm/build step needed.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyApMsn6HXCZSHhYiyISF-lFBo_aJU1-R2o",
  authDomain: "olumo6.firebaseapp.com",
  projectId: "olumo6",
  storageBucket: "olumo6.firebasestorage.app",
  messagingSenderId: "344226026188",
  appId: "1:344226026188:web:983cc0ea35870f74a72869"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);