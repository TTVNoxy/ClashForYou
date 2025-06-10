const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImVmNmI0NGViLTM0MzQtNDMyNy04NzMyLWZkYzM4ZjZkMzY5NiIsImlhdCI6MTc0OTU2MzAyMSwic3ViIjoiZGV2ZWxvcGVyL2RkNzY5YjQ5LWMxZDUtYjA2YS0yNzVkLTFjNDM3OGE5YjVjOCIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI1MS44OS4xOTQuODEiXSwidHlwZSI6ImNsaWVudCJ9XX0.jCZbR7Kw2xVzyLpzTI93T1S-PfQVPF0I-EV7U1NJJCL2bqQ58pbQZk5FdPjj2kAVhkboYJkycfrDpomiRqrrug'; // Your full token

const headers = {
  Authorization: `Bearer ${token}`,
};

document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// Fetch system status
async function getGameStatus() {
  try {
    document.getElementById('status').innerHTML = `<div class="crown"></div>`;
    const res = await fetch('https://proxy.royaleapi.dev/v1/globaltournaments', { headers });
    const data = await res.json();
    document.getElementById('status').textContent = "Online";
    document.getElementById('next-update').textContent = "Next Global Tournament: " + data.items[0].title;
    document.getElementById('player-count').textContent = "Player count estimated: ~1M online";
  } catch (e) {
    document.getElementById('status-box').classList.add('glow');
    document.getElementById('status').textContent = "Offline or API Unreachable";
    document.getElementById('status').style.color = "red";
  }
}
getGameStatus();

document.getElementById('player-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const tag = document.getElementById('player-tag').value.replace("#", "").toUpperCase();
  const stats = document.getElementById('stats');
  const log = document.getElementById('battlelog');
  stats.innerHTML = `<div class="crown"></div>`;
  log.innerHTML = `<div class="crown"></div>`;

  const playerRes = await fetch(`https://proxy.royaleapi.dev/v1/players/%23${tag}`, { headers });
  const playerData = await playerRes.json();

  stats.innerHTML = `
    <p><strong>Name:</strong> ${playerData.name}</p>
    <p><strong>Trophies:</strong> ${playerData.trophies}</p>
    <p><strong>Arena:</strong> ${playerData.arena.name}</p>
    <img src="${playerData.arena.badgeUrl}" alt="Arena" width="80" />
    <p><strong>Clan:</strong> ${playerData.clan?.name || "No Clan"}</p>
  `;

  document.getElementById('arena-bar').innerHTML = `
    <div style="background:#333; border-radius:8px; height:15px; margin-top:10px;">
      <div style="background:var(--glow); width:${(playerData.trophies / 8000) * 100}%; height:100%; border-radius:8px;"></div>
    </div>
  `;

  if (playerData.clan) {
    document.getElementById('clan-info').innerHTML = `
      <p><strong>Clan:</strong> ${playerData.clan.name}</p>
      <p><strong>Required Trophies:</strong> ${playerData.clan.requiredTrophies}</p>
      <p><strong>Members:</strong> ${playerData.clan.members}/50</p>
    `;
  }

  const battleRes = await fetch(`https://proxy.royaleapi.dev/v1/players/%23${tag}/battlelog`, { headers });
  const battles = await battleRes.json();
  log.innerHTML = battles.slice(0, 5).map(b => `
    <div style="border-bottom:1px solid #444;padding:0.5rem 0;">
      <p><strong>${b.battleType}</strong>: ${b.team[0].crowns} vs ${b.opponent[0].crowns}</p>
      <p>Deck: ${b.team[0].cards.map(c => `<img src="${c.iconUrls.medium}" width="30" />`).join('')}</p>
    </div>
  `).join('');
});

// Season countdown
function updateSeasonCountdown() {
  const seasonEnd = new Date("2025-06-24T12:00:00Z"); // Example season end
  const now = new Date();
  const diff = seasonEnd - now;
  if (diff < 0) return document.getElementById("season-timer").textContent = "Season ended.";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  document.getElementById("season-timer").textContent = `${days}d ${hrs}h ${mins}m left`;
}
setInterval(updateSeasonCountdown, 60000);
updateSeasonCountdown();
