// ================= FIREBASE (INIT ONLY – ABHI USE NAHI) =================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyA-qYLlMKvKNiWpnI8MJopb66upMJXsi4Q",
  authDomain: "my-blog-b2e82.firebaseapp.com",
  projectId: "my-blog-b2e82",
  storageBucket: "my-blog-b2e82.appspot.com",
  messagingSenderId: "1036391165706",
  appId: "1:1036391165706:web:c745462a77876afa0dd4f3",
  measurementId: "G-CLCK96ZMLR"
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);

// ================= BLOG DATA (LOCAL STORAGE) =================
let posts = JSON.parse(localStorage.getItem("posts")) || [];

// ================= LOGIN (DISABLED) =================
function login() {
  // login system disabled for now
}

// ================= ADD POST =================
function addPost() {
  if (!title.value || !content.value) {
    alert("Title aur content likho");
    return;
  }

  posts.push({
    title: title.value,
    image: image.value,
    category: category.value,
    content: content.value,
    comments: []
  });

  localStorage.setItem("posts", JSON.stringify(posts));

  title.value = "";
  image.value = "";
  content.value = "";

  alert("Post Published!");
  showPosts();
}

// ================= SHOW POSTS =================
function showPosts() {
  let box = document.getElementById("posts");
  if (!box) return;

  box.innerHTML = "";
  posts.forEach((p, i) => {
    box.innerHTML += `
      <div class="post" data-category="${p.category}">
        <h2>${p.title}</h2>
        ${p.image ? `<img src="${p.image}">` : ""}
        <p>${p.content}</p>

        <input placeholder="Write comment..."
               onkeypress="addComment(event, ${i})">
        <div>${p.comments.join("<br>")}</div>
      </div>
    `;
  });
}

// ================= COMMENTS =================
function addComment(e, i) {
  if (e.key === "Enter") {
    posts[i].comments.push(e.target.value);
    localStorage.setItem("posts", JSON.stringify(posts));
    showPosts();
  }
}

// ================= FILTER =================
function filterPosts(cat) {
  document.querySelectorAll(".post").forEach(p => {
    p.style.display =
      cat === "all" || p.dataset.category === cat ? "block" : "none";
  });
}

// ================= SEARCH =================
document.getElementById("search")?.addEventListener("keyup", function () {
  let v = this.value.toLowerCase();
  document.querySelectorAll(".post").forEach(p => {
    p.style.display = p.innerText.toLowerCase().includes(v)
      ? "block"
      : "none";
  });
});

// ================= DARK MODE =================
function toggleDark() {
  document.body.classList.toggle("dark");
}

// ================= EXPOSE FUNCTIONS (VERY IMPORTANT) =================
window.addPost = addPost;
window.addComment = addComment;
window.filterPosts = filterPosts;
window.toggleDark = toggleDark;
window.login = login;

// ================= INIT =================
showPosts();
