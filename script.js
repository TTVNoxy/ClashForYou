document.addEventListener('DOMContentLoaded', () => {
  const playerCount = document.getElementById('player-count');
  const serverStatus = document.getElementById('server-status');
  const nextUpdate = document.getElementById('next-update');
  const statsBox = document.getElementById('stats-box');

  async function fetchGameStats() {
    try {
      const res = await fetch('https://proxy.royaleapi.dev/v1/players/%232PP', {
        headers: {
          Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImVmNmI0NGViLTM0MzQtNDMyNy04NzMyLWZkYzM4ZjZkMzY5NiIsImlhdCI6MTc0OTU2MzAyMSwic3ViIjoiZGV2ZWxvcGVyL2RkNzY5YjQ5LWMxZDUtYjA2YS0yNzVkLTFjNDM3OGE5YjVjOCIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI1MS44OS4xOTQuODEiXSwidHlwZSI6ImNsaWVudCJ9XX0.jCZbR7Kw2xVzyLpzTI93T1S-PfQVPF0I-EV7U1NJJCL2bqQ58pbQZk5FdPjj2kAVhkboYJkycfrDpomiRqrrug'
        }
      });

      if (!res.ok) throw new Error('API error');

      const data = await res.json();

      playerCount.textContent = data.trophies;
      serverStatus.textContent = data.clan?.name || 'No Clan';
      nextUpdate.textContent = new Date(data.lastSeen).toLocaleString();

      // Glow based on clan existence (mock server status logic)
      statsBox.classList.remove('neutral', 'online', 'offline');
      if (data.clan) {
        statsBox.classList.add('online');
      } else {
        statsBox.classList.add('offline');
      }

    } catch (err) {
      console.error(err);
      playerCount.textContent = 'Error';
      serverStatus.textContent = 'Error';
      nextUpdate.textContent = 'Error';

      statsBox.classList.remove('neutral', 'online');
      statsBox.classList.add('offline');
    }
  }

  fetchGameStats();
  setInterval(fetchGameStats, 60000);
});
