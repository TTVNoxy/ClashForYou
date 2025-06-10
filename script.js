document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");

  tabs.forEach(tab => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      const target = tab.getAttribute("data-tab");

      tabContents.forEach(tc => tc.classList.remove("active"));
      document.getElementById(target).classList.add("active");
    });
  });

  // Load default player stats in home tab
  fetchGameStats("#2PP");
});

function fetchGameStats(tag) {
  const sanitizedTag = tag.replace("#", "%23");
  const statsBox = document.getElementById("stats-box");
  const trophies = document.getElementById("player-trophies");
  const server = document.getElementById("server-status");
  const nextUpdate = document.getElementById("next-update");

  fetch(`https://proxy.royaleapi.dev/v1/players/${sanitizedTag}`, {
    headers: {
      Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImVmNmI0NGViLTM0MzQtNDMyNy04NzMyLWZkYzM4ZjZkMzY5NiIsImlhdCI6MTc0OTU2MzAyMSwic3ViIjoiZGV2ZWxvcGVyL2RkNzY5YjQ5LWMxZDUtYjA2YS0yNzVkLTFjNDM3OGE5YjVjOCIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI1MS44OS4xOTQuODEiXSwidHlwZSI6ImNsaWVudCJ9XX0.jCZbR7Kw2xVzyLpzTI93T1S-PfQVPF0I-EV7U1NJJCL2bqQ58pbQZk5FdPjj2kAVhkboYJkycfrDpomiRqrrug"
    }
  })
  .then(res => res.json())
  .then(data => {
    trophies.textContent = data.trophies || "N/A";
    server.textContent = data.clan?.name || "No Clan";
    nextUpdate.textContent = new Date(data.lastSeen).toLocaleString();

    statsBox.classList.remove("neutral", "online", "offline");
    statsBox.classList.add(data.clan ? "online" : "offline");
  })
  .catch(err => {
    console.error(err);
    trophies.textContent = "Error";
    server.textContent = "Error";
    nextUpdate.textContent = "Error";
    statsBox.classList.remove("online", "neutral");
    statsBox.classList.add("offline");
  });
}

function loadPlayerStats() {
  const input = document.getElementById("playerTagInput").value.trim();
  const container = document.getElementById("player-stats");

  if (!input) return;

  container.innerHTML = "Loading...";

  const tag = input.replace("#", "%23");

  fetch(`https://proxy.royaleapi.dev/v1/players/${tag}`, {
    headers: {
      Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImVmNmI0NGViLTM0MzQtNDMyNy04NzMyLWZkYzM4ZjZkMzY5NiIsImlhdCI6MTc0OTU2MzAyMSwic3ViIjoiZGV2ZWxvcGVyL2RkNzY5YjQ5LWMxZDUtYjA2YS0yNzVkLTFjNDM3OGE5YjVjOCIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI1MS44OS4xOTQuODEiXSwidHlwZSI6ImNsaWVudCJ9XX0.jCZbR7Kw2xVzyLpzTI93T1S-PfQVPF0I-EV7U1NJJCL2bqQ58pbQZk5FdPjj2kAVhkboYJkycfrDpomiRqrrug"
    }
  })
  .then(res => res.json())
  .then(data => {
    container.innerHTML = `
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Trophies:</strong> ${data.trophies}</p>
      <p><strong>Arena:</strong> ${data.arena?.name}</p>
      <p><strong>Wins:</strong> ${data.wins}</p>
      <p><strong>Clan:</strong> ${data.clan?.name || 'No Clan'}</p>
    `;
  })
  .catch(err => {
    console.error(err);
    container.innerHTML = "Failed to fetch stats.";
  });
}
