let currentUser = localStorage.getItem("currentUser") || "";
let friends = JSON.parse(localStorage.getItem("friends") || "[]");
let requests = JSON.parse(localStorage.getItem("requests") || "[]");

let selectedFriend = "";
let selectedEffect = localStorage.getItem("messageEffect") || "";
let microOn = true;
let holdTimer;

const screens = [
  "welcome",
  "home",
  "search",
  "requests",
  "profile",
  "effects",
  "call"
];

function show(id) {
  screens.forEach(screen => {
    document.getElementById(screen).classList.add("hidden");
  });

  document.getElementById(id).classList.remove("hidden");
}

function save() {
  localStorage.setItem("currentUser", currentUser);
  localStorage.setItem("friends", JSON.stringify(friends));
  localStorage.setItem("requests", JSON.stringify(requests));
}

function toast(text) {
  const box = document.getElementById("toast");

  box.textContent = text;
  box.classList.add("show");

  setTimeout(() => {
    box.classList.remove("show");
  }, 2000);
}

/* SIGN IN */

function signIn() {
  const name = document.getElementById("nameInput").value.trim();

  if (!name) {
    toast("Hãy nhập tên người dùng");
    return;
  }

  currentUser = name;
  save();

  show("home");
  renderFriends();

  toast("Đăng nhập thành công");
}

/*
  Sau F5 vẫn giữ đăng nhập.
*/

if (currentUser) {
  show("home");
  renderFriends();
}

/* SEARCH */

function openSearch() {
  show("search");

  document.getElementById("loading").classList.remove("hidden");
  document.getElementById("searchArea").classList.add("hidden");

  setTimeout(() => {
    document.getElementById("loading").classList.add("hidden");
    document.getElementById("searchArea").classList.remove("hidden");
  }, 1000);
}

function searchUser() {
  const name = document.getElementById("searchInput").value.trim();

  if (!name) {
    toast("Nhập tên người dùng");
    return;
  }

  if (name === currentUser) {
    toast("Không thể kết bạn với chính mình");
    return;
  }

  document.getElementById("searchResult").innerHTML = `
    <div class="result">
      <span>${safe(name)}</span>
      <button onclick="sendRequest('${safe(name)}', this)">
        Kết bạn
      </button>
    </div>
  `;
}

function sendRequest(name, button) {
  const outgoing = JSON.parse(
    localStorage.getItem("outgoingRequests") || "[]"
  );

  outgoing.push({
    from: currentUser,
    to: name,
    status: "pending"
  });

  localStorage.setItem(
    "outgoingRequests",
    JSON.stringify(outgoing)
  );

  button.textContent = "Đang kết bạn";
  button.disabled = true;

  toast("Đã gửi lời mời");
}

/* REQUESTS */

function openRequests() {
  show("requests");
  renderRequests();
}

function renderRequests() {
  const box = document.getElementById("requestList");

  if (!requests.length) {
    box.innerHTML = `
      <div class="card">
        Không có người kết bạn
      </div>
    `;
    return;
  }

  box.innerHTML = requests.map((request, index) => `
    <div class="request">
      <strong>${safe(request.name)}</strong>

      <br>

      <button class="accept"
        onclick="acceptRequest(${index})">
        Chấp nhận
      </button>

      <button class="reject"
        onclick="rejectRequest(${index})">
        Từ chối
      </button>
    </div>
  `).join("");
}

function acceptRequest(index) {
  const request = requests[index];

  friends.push(request.name);
  requests.splice(index, 1);

  save();

  renderRequests();
  renderFriends();

  toast("Đã trở thành Bạn bè");
}

function rejectRequest(index) {
  requests.splice(index, 1);

  save();
  renderRequests();

  toast("Đã từ chối");
}

/* FRIENDS */

function renderFriends() {
  const noFriends = document.getElementById("noFriends");
  const friendsBox = document.getElementById("friends");

  if (!friends.length) {
    noFriends.classList.remove("hidden");
    friendsBox.classList.add("hidden");
    return;
  }

  noFriends.classList.add("hidden");
  friendsBox.classList.remove("hidden");

  document.getElementById("friendList").innerHTML =
    friends.map(name => `
      <div
        class="friend"
        onclick="openFriend('${safe(name)}')">
        ${safe(name)}
      </div>
    `).join("");
}

function openFriend(name) {
  selectedFriend = name;

  document.getElementById("friendName").textContent = name;

  show("profile");
}

function openProfile() {
  show("profile");
}

/* EFFECT */

function openEffects() {
  show("effects");
}

function selectEffect(effect) {
  selectedEffect = effect;
}

function applyEffect() {
  localStorage.setItem(
    "messageEffect",
    selectedEffect
  );

  const button = document.getElementById("effectButton");

  button.className = "effectButton";

  if (selectedEffect) {
    button.classList.add("effect-" + selectedEffect);
  }

  toast("Effect đã được lưu");

  openProfile();
}

/* MESSAGE */

function sendMessage() {
  const input = document.getElementById("messageInput");
  const message = input.value.trim();

  if (!message) return;

  const messages = JSON.parse(
    localStorage.getItem("messages") || "[]"
  );

  messages.push({
    from: currentUser,
    to: selectedFriend,
    message,
    time: Date.now()
  });

  localStorage.setItem(
    "messages",
    JSON.stringify(messages)
  );

  input.value = "";

  toast("Đã gửi tin nhắn");
}

/* CALL */

function startCall(camera) {
  show("call");

  if (camera) {
    toast("Gọi camera");
  } else {
    toast("Đang gọi");
  }
}

function cameraCall() {
  toast("Camera đang được bật");
}

function toggleMicro() {
  microOn = !microOn;

  document.getElementById("micro").textContent =
    microOn ? "Micro: Bật" : "Micro: Tắt";
}

function endCall() {
  show("profile");
  toast("Tắt Gọi");
}

/* HEART */

function createHeart() {
  const heart = document.createElement("div");

  heart.className = "floatingHeart";
  heart.textContent = "❤️";

  heart.style.left =
    `${50 + Math.random() * 20 - 10}%`;

  heart.style.bottom = "100px";

  document.body.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 1200);
}

document.getElementById("heart").addEventListener(
  "click",
  createHeart
);

/* GIỮ ❤️ */

function startHold() {
  holdTimer = setTimeout(() => {
    document
      .getElementById("emojiPicker")
      .classList.remove("hidden");
  }, 550);
}

function stopHold() {
  clearTimeout(holdTimer);
}

/* EMOJI */

function chooseEmoji(emoji) {
  document.getElementById("heart").textContent = emoji;

  localStorage.setItem(
    "selectedEmoji",
    emoji
  );

  document
    .getElementById("emojiPicker")
    .classList.add("hidden");
}

/* HOME */

function goHome() {
  show("home");
  renderFriends();
}

function safe(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
