
const VERCEL_URL = "{YOUR_VERCEL_URL_HERE}"; // e.g. https://geometry-demon-backend.vercel.app
if(VERCEL_URL.includes("YOUR_VERCEL_URL_HERE")) console.warn("Set VERCEL_URL in app.js to your deployed Vercel backend URL.");

async function fetchJSON(path) {
  const res = await fetch(VERCEL_URL + path);
  return res.json();
}

async function render() {
  try {
    const levels = await fetchJSON('/api/levels');
    const players = await fetchJSON('/api/players');
    const levelList = document.getElementById('level-list');
    levelList.innerHTML = '';
    levels.forEach(l => {
      const li = document.createElement('li');
      li.textContent = `${l.list_position}. ${l.name} — ${l.difficulty} (by ${l.publisher})`;
      levelList.appendChild(li);
    });

    const playerList = document.getElementById('player-list');
    playerList.innerHTML = '';
    players.forEach(p => {
      const li = document.createElement('li');
      li.textContent = `${p.name} — ${p.points} pts (${
        p.nationality
      })`;
      playerList.appendChild(li);
    });
  } catch (e) {
    console.error(e);
  }
}

document.getElementById('submit-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    player: document.getElementById('pname').value,
    level: document.getElementById('lname').value,
    percent: Number(document.getElementById('percent').value),
    video: document.getElementById('video').value,
    platform: document.getElementById('platform').value
  };
  const res = await fetch(VERCEL_URL + '/api/submit', {
    method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)
  });
  const j = await res.json();
  document.getElementById('submit-result').textContent = j.message || JSON.stringify(j);
});

document.getElementById('admin-login').addEventListener('click', async () => {
  const pass = document.getElementById('admin-pass').value;
  const res = await fetch(VERCEL_URL + '/api/admin/login', {
    method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({password:pass})
  });
  const j = await res.json();
  if(j.token) {
    localStorage.setItem('admintoken', j.token);
    document.getElementById('admin-area').style.display = 'block';
    loadPending();
  } else {
    alert(j.message || 'Login failed');
  }
});

async function loadPending() {
  const token = localStorage.getItem('admintoken');
  const res = await fetch(VERCEL_URL + '/api/admin/pending', {
    headers: {'Authorization': token || ''}
  });
  const j = await res.json();
  const el = document.getElementById('pending-list');
  el.innerHTML = '';
  (j.pending || []).forEach((p,idx) => {
    const li = document.createElement('li');
    li.innerHTML = `<b>${p.player}</b> — ${p.level} ${p.percent}% <a href="${p.video}" target="_blank">video</a>
    <button data-idx="${idx}" class="approve">Approve</button>
    <button data-idx="${idx}" class="reject">Reject</button>`;
    el.appendChild(li);
  });
  document.querySelectorAll('.approve').forEach(btn => btn.addEventListener('click', async (e) => {
    const i = e.target.dataset.idx;
    await fetch(VERCEL_URL + '/api/admin/approve', {method:'POST', headers:{'Content-Type':'application/json','Authorization':localStorage.getItem('admintoken')}, body:JSON.stringify({index: i})});
    loadPending();
  }));
  document.querySelectorAll('.reject').forEach(btn => btn.addEventListener('click', async (e) => {
    const i = e.target.dataset.idx;
    await fetch(VERCEL_URL + '/api/admin/reject', {method:'POST', headers:{'Content-Type':'application/json','Authorization':localStorage.getItem('admintoken')}, body:JSON.stringify({index: i})});
    loadPending();
  }));
}

render();
