import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

/* ======================
   HELPERS
====================== */
function basePath() {
  // Works for GitHub Pages project sites
  const parts = window.location.pathname.split("/");
  // /repo-name/admin/login.html  ->  /repo-name
  return parts.length > 2 ? `/${parts[1]}` : "";
}

/* ======================
   DOM
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

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = basePath() + "/admin/dashboard.html";
    } catch (e) {
      msg.innerText = e.message;
    }
  });
}

/* ======================
   PROTECT DASHBOARD
====================== */
onAuthStateChanged(auth, user => {
  if (!user && window.location.pathname.includes("/admin/dashboard.html")) {
    window.location.href = basePath() + "/admin/login.html";
  }
});

/* ======================
   LOGOUT
====================== */
window.logout = async () => {
  await signOut(auth);
  window.location.href = basePath() + "/admin/login.html";
};
