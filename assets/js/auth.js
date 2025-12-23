import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const loginBtn = document.getElementById("loginBtn");
const msg = document.getElementById("msg");

function basePath() {
  return location.pathname.split("/admin")[0];
}

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

onAuthStateChanged(auth, user => {
  if (!user && location.pathname.includes("/admin/dashboard.html")) {
    window.location.href = basePath() + "/admin/login.html";
  }
});

window.logout = async () => {
  await signOut(auth);
  window.location.href = basePath() + "/admin/login.html";
};
