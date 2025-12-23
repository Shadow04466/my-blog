import { auth } from "./firebase.js";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

loginBtn?.onclick = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
  .then(()=>location.href="dashboard.html")
  .catch(e=>msg.innerText=e.message);
};

window.logout = ()=>signOut(auth).then(()=>location.href="login.html");

onAuthStateChanged(auth,user=>{
  if(!user && location.pathname.includes("dashboard"))
    location.href="login.html";
});
