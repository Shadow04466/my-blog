import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const postsBox = document.getElementById("posts");
const postBox = document.getElementById("post");

/* ======================
   HOME PAGE POSTS
====================== */
async function loadPosts() {
  const snap = await getDocs(collection(db, "posts"));
  postsBox.innerHTML = "";

  snap.forEach(d => {
    const p = d.data();
    if (p.status !== "publish") return;

    postsBox.innerHTML += `
      <div class="col-md-4">
        <div class="card h-100 blog-card">
          ${p.image ? `<img src="${p.image}" class="card-img-top">` : ""}
          <div class="card-body">
            <h5>${p.title}</h5>
            <p>${stripHtml(p.content).substring(0,120)}...</p>
            <a href="post.html?id=${d.id}">Read</a>
          </div>
        </div>
      </div>
    `;
  });
}

/* ======================
   SINGLE POST PAGE
====================== */
async function loadSinglePost(id) {
  const ref = doc(db, "posts", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    postBox.innerHTML = "Post not found";
    return;
  }

  const p = snap.data();

  document.getElementById("pageTitle").innerText = p.title;
  document.getElementById("metaDesc").content =
    stripHtml(p.content).substring(0,150);

  postBox.innerHTML = `
    <article class="blog-post">
      <h1 class="blog-title">${p.title}</h1>

      ${
        p.image
          ? `<img src="${p.image}" class="blog-featured-img">`
          : ""
      }

      <div class="blog-content">
        ${p.content}
      </div>
    </article>
  `;

  document.getElementById("likeCount").innerText = p.likes || 0;

  document.getElementById("likeBtn").onclick = async () => {
    await updateDoc(ref, { likes: increment(1) });
    document.getElementById("likeCount").innerText++;
  };
}

/* ======================
   HELPERS
====================== */
function stripHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

/* ======================
   INIT
====================== */
if (postsBox) loadPosts();

if (postBox) {
  const id = new URLSearchParams(location.search).get("id");
  if (id) loadSinglePost(id);
}
