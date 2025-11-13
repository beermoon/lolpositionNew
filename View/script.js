// 기본 포지션
const roles = ["탑", "정글", "미드", "원딜", "서폿"];

// 현재 배정된 친구들
let currentPlayers = ["김상", "아상", "라라", "키키", "호호"];

// 대기 친구들
const friendPool = ["민수", "재민", "도도", "수아"];

const playerContainer = document.getElementById("playerContainer");
const friendsBox = document.getElementById("friendsBox");
const newFriendInput = document.getElementById("newFriendInput");

// 선택된 카드 index
let selectedIndex = 0;

function renderPlayers() {
  playerContainer.innerHTML = "";
  currentPlayers.forEach((name, idx) => {
    const card = document.createElement("div");
    card.className = "player-card" + (idx === selectedIndex ? " selected" : "");
    card.onclick = () => {
      selectedIndex = idx;
      renderPlayers();
    };

    const nameEl = document.createElement("div");
    nameEl.className = "player-name";
    nameEl.textContent = name;

    const roleEl = document.createElement("div");
    roleEl.className = "player-role";
    roleEl.textContent = roles[idx];

    card.appendChild(nameEl);
    card.appendChild(roleEl);
    playerContainer.appendChild(card);
  });
}

function renderFriends() {
  // h3 + 입력영역을 제외하고 나머지 제거
  while (friendsBox.children.length > 2) {
    friendsBox.removeChild(friendsBox.lastChild);
  }

  friendPool.forEach((friend) => {
    const item = document.createElement("div");
    item.className = "friend-item";
    item.textContent = friend;
    item.onclick = () => {
      currentPlayers[selectedIndex] = friend;
      renderPlayers();
    };
    friendsBox.appendChild(item);
  });
}

// 새 친구 추가
function addFriend() {
  const name = newFriendInput.value.trim();
  if (!name) return;

  // 중복 방지 (대기나 현재에 이미 있으면 추가 안 함)
  if (friendPool.includes(name) || currentPlayers.includes(name)) {
    alert("이미 있는 이름이에요.");
    newFriendInput.value = "";
    return;
  }

  friendPool.push(name);
  newFriendInput.value = "";
  renderFriends();
}

// 포지션 섞기
function shuffleRoles() {
  const shuffled = shuffle(roles);
  for (let i = 0; i < roles.length; i++) {
    roles[i] = shuffled[i];
  }
  renderPlayers();
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 초기 렌더
renderPlayers();
renderFriends();
