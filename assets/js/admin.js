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
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const titleEl = document.getElementById("title");
const imageEl = document.getElementById("image");
const contentEl = document.getElementById("content");
const statusEl = document.getElementById("status");
const saveBtn = document.getElementById("saveBtn");
const postList = document.getElementById("postList");

let editId = null;

/* ======================
   AUTH PROTECTION
====================== */
onAuthStateChanged(auth, user => {
  if (!user) {
    location.href = "login.html";
  } else {
    loadPosts();
  }
});

/* ======================
   ADD / UPDATE POST
====================== */
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

/* ======================
   LOAD POSTS
====================== */
async function loadPosts() {
  postList.innerHTML = "";
  const snap = await getDocs(collection(db, "posts"));

  snap.forEach(docSnap => {
    const p = docSnap.data();

    postList.innerHTML += `
      <div class="post-item">
        <div>
          <b>${p.title}</b>
          <small class="text-muted">(${p.status})</small>
        </div>
        <div>
          <button class="btn btn-sm btn-warning"
            onclick="editPost('${docSnap.id}', 
              \`${p.title}\`,
              \`${p.image || ""}\`,
              \`${p.content}\`,
              '${p.status}'
            )">
            Edit
          </button>

          <button class="btn btn-sm btn-danger"
            onclick="deletePost('${docSnap.id}')">
            Delete
          </button>
        </div>
      </div>
    `;
  });
}

/* ======================
   EDIT POST
====================== */
window.editPost = function (id, title, image, content, status) {
  editId = id;
  titleEl.value = title;
  imageEl.value = image;
  contentEl.value = content;
  statusEl.value = status;
};

/* ======================
   DELETE POST
====================== */
window.deletePost = async function (id) {
  if (!confirm("Delete this post?")) return;
  await deleteDoc(doc(db, "posts", id));
  loadPosts();
};

/* ======================
   LOGOUT
====================== */
window.logout = function () {
  signOut(auth).then(() => {
    location.href = "login.html";
  });
};

/* ======================
   CLEAR FORM
====================== */
function clearForm() {
  titleEl.value = "";
  imageEl.value = "";
  contentEl.value = "";
  statusEl.value = "publish";
}
