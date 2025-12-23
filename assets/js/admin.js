import { db, auth } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import {
  signOut
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

/* ======================
   DOM ELEMENTS
====================== */
const titleInput = document.getElementById("title");
const imageInput = document.getElementById("image");
const statusSelect = document.getElementById("status");
const saveBtn = document.getElementById("saveBtn");
const postList = document.getElementById("postList");

let editId = null;

/* ======================
   TinyMCE INIT
====================== */
tinymce.init({
  selector: '#content',
  height: 420,
  menubar: false,
  plugins: 'lists link image code preview',
  toolbar:
    'undo redo | bold italic underline | h2 h3 | bullist numlist | link image | code preview',
  branding: false
});

/* ======================
   SAVE / UPDATE POST
====================== */
saveBtn.addEventListener("click", async () => {
  const title = titleInput.value.trim();
  const image = imageInput.value.trim();
  const content = tinymce.get('content').getContent();
  const status = statusSelect.value;

  if (!title || !content) {
    alert("Title and content required");
    return;
  }

  if (editId) {
    await updateDoc(doc(db, "posts", editId), {
      title,
      image,
      content,
      status
    });
    editId = null;
    saveBtn.innerText = "Save Post";
  } else {
    await addDoc(collection(db, "posts"), {
      title,
      image,
      content,
      status,
      category: "testing",
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

  snap.forEach(d => {
    const p = d.data();

    postList.innerHTML += `
      <div class="border rounded p-3 mb-3">
        <strong>${p.title}</strong>
        <small class="text-muted">(${p.status})</small>

        <div class="mt-2">
          <button class="btn btn-sm btn-outline-primary me-2"
            onclick="editPost('${d.id}')">
            Edit
          </button>

          <button class="btn btn-sm btn-danger"
            onclick="deletePost('${d.id}')">
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
window.editPost = async (id) => {
  const snap = await getDocs(collection(db, "posts"));
  snap.forEach(d => {
    if (d.id === id) {
      const p = d.data();
      titleInput.value = p.title || "";
      imageInput.value = p.image || "";
      tinymce.get('content').setContent(p.content || "");
      statusSelect.value = p.status || "publish";

      editId = id;
      saveBtn.innerText = "Update Post";
    }
  });
};

/* ======================
   DELETE POST
====================== */
window.deletePost = async (id) => {
  if (confirm("Delete this post?")) {
    await deleteDoc(doc(db, "posts", id));
    loadPosts();
  }
};

/* ======================
   LOGOUT
====================== */
window.logout = async () => {
  await signOut(auth);
  window.location.href = "login.html";
};

/* ======================
   HELPERS
====================== */
function clearForm() {
  titleInput.value = "";
  imageInput.value = "";
  tinymce.get('content').setContent("");
  statusSelect.value = "publish";
}

/* ======================
   INIT
====================== */
loadPosts();
