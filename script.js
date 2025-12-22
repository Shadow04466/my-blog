let posts = JSON.parse(localStorage.getItem("posts")) || [];

// ADD POST
function addPost() {
  const title = document.getElementById("title").value;
  const image = document.getElementById("image").value;
  const category = document.getElementById("category").value;
  const content = document.getElementById("content").value;

  if (!title || !content) {
    alert("Title aur content zaroori hai");
    return;
  }

  posts.unshift({
    title,
    image,
    category,
    content
  });

  localStorage.setItem("posts", JSON.stringify(posts));
  alert("Post Published!");
  document.getElementById("title").value = "";
  document.getElementById("image").value = "";
  document.getElementById("content").value = "";
  showPosts();
}

// SHOW POSTS
function showPosts() {
  const box = document.getElementById("posts");
  if (!box) return;

  box.innerHTML = "";
  posts.forEach((p, i) => {
    box.innerHTML += `
      <div class="post" data-category="${p.category}">
        <button class="delete-btn" onclick="deletePost(${i})">Delete</button>
        <h2>${p.title}</h2>
        ${p.image ? `<img src="${p.image}">` : ""}
        <p>${p.content}</p>
      </div>
    `;
  });
}

// DELETE POST
function deletePost(index) {
  if (!confirm("Post delete karna chahte ho?")) return;
  posts.splice(index, 1);
  localStorage.setItem("posts", JSON.stringify(posts));
  showPosts();
}

// FILTER
function filterPosts(cat) {
  document.querySelectorAll(".post").forEach(p => {
    p.style.display =
      cat === "all" || p.dataset.category === cat ? "block" : "none";
  });
}

// SEARCH
document.getElementById("search")?.addEventListener("keyup", function () {
  let v = this.value.toLowerCase();
  document.querySelectorAll(".post").forEach(p => {
    p.style.display = p.innerText.toLowerCase().includes(v)
      ? "block"
      : "none";
  });
});

// DARK MODE
function toggleDark() {
  document.body.classList.toggle("dark");
}

// EXPOSE FUNCTIONS
window.addPost = addPost;
window.deletePost = deletePost;
window.filterPosts = filterPosts;
window.toggleDark = toggleDark;

// INIT
showPosts();
