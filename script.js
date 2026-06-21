let posts = JSON.parse(localStorage.getItem("posts")) || [];
let stories = JSON.parse(localStorage.getItem("stories")) || [];
let messages = JSON.parse(localStorage.getItem("messages")) || [];
let currentUser = localStorage.getItem("currentUser") || "Guest User";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("profileName").innerText = currentUser;
  document.getElementById("profilePageName").innerText = currentUser;
  loadPosts();
  loadStories();
  loadMessages();
});

function openPage(pageId) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  document.getElementById(pageId).classList.add("active");

  if (pageId === "profilePage") {
    loadProfilePosts();
  }
}

function loginUser() {
  const username = document.getElementById("username").value.trim();

  if (username === "") {
    alert("Please enter username");
    return;
  }

  currentUser = username;
  localStorage.setItem("currentUser", currentUser);

  document.getElementById("profileName").innerText = currentUser;
  document.getElementById("profilePageName").innerText = currentUser;
  document.getElementById("loginStatus").innerText = "Logged in as " + currentUser;

  openPage("homePage");
}

function addPost() {
  const text = document.getElementById("postText").value.trim();
  const imageInput = document.getElementById("postImage");

  if (text === "" && imageInput.files.length === 0) {
    alert("Write caption or upload photo");
    return;
  }

  if (imageInput.files.length > 0) {
    const reader = new FileReader();

    reader.onload = function(e) {
      savePost(text, e.target.result);
    };

    reader.readAsDataURL(imageInput.files[0]);
  } else {
    savePost(text, "https://picsum.photos/600/400?random=" + Math.floor(Math.random() * 9999));
  }
}

function savePost(text, image) {
  const post = {
    id: Date.now(),
    user: currentUser,
    text: text,
    image: image,
    likes: 0,
    liked: false,
    comments: []
  };

  posts.unshift(post);
  localStorage.setItem("posts", JSON.stringify(posts));

  document.getElementById("postText").value = "";
  document.getElementById("postImage").value = "";

  loadPosts();
}

function loadPosts() {
  const feed = document.getElementById("feed");
  feed.innerHTML = "";

  if (posts.length === 0) {
    posts = [
      {
        id: Date.now() + 1,
        user: "Shalini",
        text: "Learning AI and building the future 🚀",
        image: "https://picsum.photos/600/400?random=1",
        likes: 12,
        liked: false,
        comments: ["Amazing post!"]
      },
      {
        id: Date.now() + 2,
        user: "Phoenix",
        text: "Rise again with power and purpose 🔥",
        image: "https://picsum.photos/600/400?random=2",
        likes: 25,
        liked: false,
        comments: ["Powerful vibe!"]
      }
    ];

    localStorage.setItem("posts", JSON.stringify(posts));
  }

  posts.forEach(post => {
    feed.innerHTML += createPostHTML(post);
  });

  updateCounts();
}

function createPostHTML(post) {
  return `
    <div class="post" data-text="${post.text.toLowerCase()} ${post.user.toLowerCase()}">
      <div class="post-head">
        <div class="avatar">${post.user.charAt(0).toUpperCase()}</div>
        <h3>${post.user}</h3>
      </div>

      <img src="${post.image}" alt="Post Image">

      <div class="actions">
        <button onclick="likePost(${post.id})">
          ${post.liked ? "❤️ Liked" : "♡ Like"} (${post.likes})
        </button>
        <button onclick="saveImage('${post.image}')">🔖 Save</button>
        <button>↗ Share</button>
      </div>

      <p><b>${post.user}</b> ${post.text}</p>

      <div class="comments">
        ${post.comments.map(comment => `<div>💬 ${comment}</div>`).join("")}
      </div>

      <div class="comment-box">
        <input type="text" id="comment-${post.id}" placeholder="Add a comment..." />
        <button onclick="addComment(${post.id})">Post</button>
      </div>
    </div>
  `;
}

function likePost(id) {
  posts = posts.map(post => {
    if (post.id === id) {
      post.liked = !post.liked;
      post.likes += post.liked ? 1 : -1;
    }
    return post;
  });

  localStorage.setItem("posts", JSON.stringify(posts));
  loadPosts();
}

function addComment(id) {
  const input = document.getElementById("comment-" + id);
  const comment = input.value.trim();

  if (comment === "") return;

  posts = posts.map(post => {
    if (post.id === id) {
      post.comments.push(comment);
    }
    return post;
  });

  localStorage.setItem("posts", JSON.stringify(posts));
  loadPosts();
}

function uploadStory(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function(e) {
    stories.unshift(e.target.result);
    localStorage.setItem("stories", JSON.stringify(stories));
    loadStories();
  };

  reader.readAsDataURL(file);
}

function loadStories() {
  const storiesBox = document.getElementById("storiesBox");

  storiesBox.innerHTML = `
    <div class="story add-story">
      <input type="file" id="storyUpload" accept="image/*" onchange="uploadStory(event)" />
      <label for="storyUpload">+ Story</label>
    </div>
  `;

  stories.forEach(story => {
    storiesBox.innerHTML += `<div class="story"><img src="${story}" alt="Story"></div>`;
  });
}

function loadProfilePosts() {
  const profilePosts = document.getElementById("profilePosts");
  profilePosts.innerHTML = "";

  const myPosts = posts.filter(post => post.user === currentUser);

  if (myPosts.length === 0) {
    profilePosts.innerHTML = "<p>No posts yet.</p>";
    return;
  }

  myPosts.forEach(post => {
    profilePosts.innerHTML += `<img src="${post.image}" alt="My Post">`;
  });

  updateCounts();
}

function updateCounts() {
  const myPosts = posts.filter(post => post.user === currentUser).length;

  document.getElementById("postCount").innerText = myPosts;
  document.getElementById("profilePostCount").innerText = myPosts;
}

function saveImage(imageUrl) {
  alert("Post saved in your browser!");
}

function searchPosts() {
  const searchValue = document.getElementById("searchInput").value.toLowerCase();
  const postElements = document.querySelectorAll(".post");

  postElements.forEach(post => {
    const text = post.getAttribute("data-text");
    post.style.display = text.includes(searchValue) ? "block" : "none";
  });
}

function sendMessage() {
  const input = document.getElementById("chatInput");
  const text = input.value.trim();

  if (text === "") return;

  messages.push({
    user: currentUser,
    text: text
  });

  localStorage.setItem("messages", JSON.stringify(messages));
  input.value = "";
  loadMessages();
}

function loadMessages() {
  const messageBox = document.getElementById("messages");

  if (!messageBox) return;

  messageBox.innerHTML = "";

  messages.forEach(msg => {
    messageBox.innerHTML += `
      <div class="message">
        <b>${msg.user}:</b> ${msg.text}
      </div>
    `;
  });
    }
