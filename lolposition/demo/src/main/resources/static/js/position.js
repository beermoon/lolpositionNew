document.addEventListener("DOMContentLoaded", () => {
    // --- 기본 데이터 ---
    const roles = ["탑", "정글", "미드", "원딜", "서폿"];
    let currentPlayers = ["김상", "아상", "라라", "키키", "호호"];

    // 서버에서 받아올 예정
    let friendPool = [];

    // --- DOM 요소 ---
    const playerContainer = document.getElementById("playerContainer");
    const friendsList = document.getElementById("friendsList"); // 실제 목록 들어갈 곳
    const newFriendInput = document.getElementById("newFriendInput");
    const addFriendBtn = document.getElementById("addFriendBtn");
    const shuffleBtn = document.getElementById("shuffleBtn");

    let selectedIndex = 0;

    // --- 렌더: 플레이어 카드 ---
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

    // --- 렌더: 대기 친구 목록 ---
    function renderFriends() {
        friendsList.innerHTML = "";
        friendPool.forEach(friend => {
            // 한 친구를 감싸는 박스
            const item = document.createElement("div");
            item.className = "friend-item";

            // 이름 표시
            const nameSpan = document.createElement("span");
            nameSpan.textContent = friend.name;

            // 수정 버튼
            const editBtn = document.createElement("button");
            editBtn.textContent = "수정";
            editBtn.style.marginLeft = "6px";
            editBtn.onclick = async (e) => {
                e.stopPropagation(); // 부모 클릭 막기
                const newName = prompt("새 이름을 입력하세요", friend.name);
                if (!newName) return;
                await fetch(`/api/friends/${friend.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ name: newName })
                });
                await loadFriends();
            };

            // 삭제 버튼
            const delBtn = document.createElement("button");
            delBtn.textContent = "삭제";
            delBtn.style.marginLeft = "4px";
            delBtn.onclick = async (e) => {
                e.stopPropagation(); // 부모 클릭 막기
                if (!confirm("삭제할까요?")) return;
                await fetch(`/api/friends/${friend.id}`, {
                    method: "DELETE"
                });
                await loadFriends();
            };

            item.appendChild(nameSpan);
            item.appendChild(editBtn);
            item.appendChild(delBtn);

            // 대기 친구 클릭하면 선택된 카드에 넣기
            item.onclick = () => {
                currentPlayers[selectedIndex] = friend.name;
                renderPlayers();
            };

            friendsList.appendChild(item);
        });
    }

    // --- 서버에서 목록 불러오기 ---
    async function loadFriends() {
        const res = await fetch("/api/friends");
        const data = await res.json();
        friendPool = data; // [{id, name}, ...]
        renderFriends();
    }

    // --- 새 친구 추가 ---
    async function addFriend() {
        const name = newFriendInput.value.trim();
        if (!name) return;

        await fetch("/api/friends", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: name })
        });

        newFriendInput.value = "";
        await loadFriends();
    }

    // --- 포지션 섞기 (서버 버전) ---
    async function shuffleRoles() {
        try {
            const res = await fetch("/api/assign", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    players: currentPlayers
                })
            });

            const data = await res.json();

            currentPlayers = data.map(item => item.name);
            const rolesFromServer = data.map(item => item.role);

            for (let i = 0; i < rolesFromServer.length; i++) {
                roles[i] = rolesFromServer[i];
            }

            renderPlayers();
        } catch (error) {
            console.error("섞기 실패: ", error);
        }
    }

    // --- 이벤트 연결 ---
    addFriendBtn.addEventListener("click", addFriend);
    shuffleBtn.addEventListener("click", shuffleRoles);

    // --- 처음 화면 그리기 ---
    renderPlayers();
    loadFriends();
});