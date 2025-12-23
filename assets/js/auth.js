import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

/* ======================
   DOM ELEMENTS (SAFE)
====================== */
const loginBtn = document.getElementById("loginBtn");
const msg = document.getElementById("msg");

/* ======================
   LOGIN
====================== */
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      msg.innerText = "Email and password required";
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "/admin/dashboard.html";
    } catch (err) {
      msg.innerText = err.message;
    }
  });
}

/* ======================
   AUTH PROTECTION
====================== */
onAuthStateChanged(auth, user => {
  const path = window.location.pathname;

  if (!user && path.includes("/admin/dashboard.html")) {
    window.location.href = "/admin/login.html";
  }
});

/* ======================
   LOGOUT
====================== */
window.logout = async () => {
  await signOut(auth);
  window.location.href = "/admin/login.html";
};
