
import { auth, db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const titleEl = document.getElementById("title");
const imageEl = document.getElementById("image");
const contentEl = document.getElementById("content");
const statusEl = document.getElementById("status");
const saveBtn = document.getElementById("saveBtn");
const postList = document.getElementById("postList");

let editId = null;

// 🔐 Protect admin
onAuthStateChanged(auth, user => {
  if (!user) location.href = "login.html";
  else loadPosts();
});

// ➕ Add / ✏️ Update post
saveBtn.addEventListener("click", async () => {
  if (!titleEl.value || !contentEl.value) {
    alert("Title & content required");
    return;
  }

  if (editId) {
    await updateDoc(doc(db, "posts", editId), {
      title: titleEl.value,
      image: imageEl.value,
      content: contentEl.value,
      status: statusEl.value
    });
    editId = null;
  } else {
    await addDoc(collection(db, "posts"), {
      title: titleEl.value,
      image: imageEl.value,
      content: contentEl.value,
      status: statusEl.value,
      likes: 0,
      createdAt: serverTimestamp()
    });
  }

  clearForm();
  loadPosts();
});

// 📥 Load posts
async function loadPosts() {
  postList.innerHTML = "";
  const snap = await getDocs(collection(db, "posts"));

  snap.forEach(docSnap => {
    const p = docSnap.data();
    postList.innerHTML += `
      <div class="post-item">
        <b>${p.title}</b> (${p.status})
        <button onclick="editPost('${docSnap.id}','${p.title}','${p.image}','${p.content}','${p.status}')">Edit</button>
        <button onclick="deletePost('${docSnap.id}')">Delete</button>
      </div>
    `;
  });
}

// ✏️ Edit
window.editPost = (id, t, i, c, s) => {
  editId = id;
  titleEl.value = t;
  imageEl.value = i;
  contentEl.value = c;
  statusEl.value = s;
};

// 🗑 Delete
window.deletePost = async (id) => {
  if (!confirm("Delete this post?")) return;
  await deleteDoc(doc(db, "posts", id));
  loadPosts();
};

// 🧹 Clear
function clearForm() {
  titleEl.value = "";
  imageEl.value = "";
  contentEl.value = "";
  statusEl.value = "publish";
}

// 🚪 Logout
window.logout = function () {
  signOut(auth).then(() => location.href = "login.html");
};
