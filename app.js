const owner = "SriVishnu230707";
const projects = [
  { repo:"ticker-room", title:"Ticker Room", category:"web", label:"REAL-TIME WEB APP", icon:"↗", description:"A market dashboard with streaming prices, alerts, watchlists, and paper trading.", tags:["React","Node.js","Socket.IO"] },
  { repo:"AgriSense-Smart-Irrigation", title:"AgriSense", category:"iot", label:"CONNECTED HARDWARE", icon:"◈", description:"An ESP32 irrigation system that reads soil and climate sensors and controls a pump.", tags:["C++","ESP32","Arduino"] },
  { repo:"spam-sms-detection", title:"Spam SMS Detection", category:"ai", label:"APPLIED MACHINE LEARNING", icon:"✳", description:"A text-classification pipeline and web interface for identifying unwanted SMS messages.", tags:["Python","scikit-learn","Streamlit"] },
  { repo:"nexus-contact-space", title:"Nexus Contact Space", category:"web", label:"PRODUCT INTERFACE", icon:"◎", description:"A responsive contact manager designed for a clear, simple everyday workflow.", tags:["HTML","CSS","JavaScript"], live:"https://nexus-contact-space.vercel.app" },
  { repo:"smart-college-asset-maintenacne", title:"Smart College Assets", category:"web", label:"DATA / OPERATIONS", icon:"▦", description:"A college asset maintenance project built around Python, SQLAlchemy, and PostgreSQL.", tags:["Python","SQLAlchemy","PostgreSQL"] },
  { repo:"depthboard", title:"Depthboard", category:"web", label:"INTERACTIVE PRODUCTIVITY", icon:"▤", description:"A spatial Kanban board with three work stages and browser-persisted tasks.", tags:["HTML","CSS","JavaScript"] },
  { repo:"dream-music", title:"Dream Music", category:"concept", label:"MUSIC / PRODUCT CONCEPT", icon:"♫", description:"A design-stage concept for mood-aware playlists that adapt to a listener's target mood.", tags:["Go","PostgreSQL","ML concept"] },
  { repo:"orbit-os", title:"Orbit OS", category:"web", label:"INTERFACE EXPERIMENT", icon:"◌", description:"A focus dashboard experiment with an orb, timer, and responsive layout.", tags:["HTML","CSS","JavaScript"] }
];

const grid = document.querySelector("#project-grid");
const search = document.querySelector("#project-search");
const empty = document.querySelector("#no-results");
const filters = [...document.querySelectorAll(".filter")];
let category = "all";
let repoData = new Map();
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));

function card(project, index) {
  const live = project.live ? `<a href="${project.live}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escapeHtml(project.title)} live demo">Live ↗</a>` : "";
  const stars = repoData.get(project.repo)?.stargazers_count;
  return `<article class="project-card">
    <div class="card-top"><span class="card-number">PROJECT / ${String(index + 1).padStart(2,"0")}</span><span class="card-icon" aria-hidden="true">${project.icon}</span></div>
    <div class="card-category">${project.label}</div>
    <h3>${escapeHtml(project.title)}</h3>
    <p>${escapeHtml(project.description)}</p>
    <div class="card-tags">${project.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
    <div class="card-bottom"><a href="https://github.com/${owner}/${encodeURIComponent(project.repo)}" target="_blank" rel="noopener noreferrer" aria-label="View ${escapeHtml(project.title)} source on GitHub">View code ↗</a><span>${live}${stars === undefined ? "" : ` ★ ${stars}`}</span></div>
  </article>`;
}

function render() {
  const query = search.value.trim().toLowerCase();
  const visible = projects.filter((project) => {
    const matchesCategory = category === "all" || project.category === category;
    const matchesSearch = !query || [project.title, project.description, ...project.tags].join(" ").toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });
  grid.innerHTML = visible.map(card).join("");
  empty.hidden = visible.length !== 0;
}

filters.forEach((button) => button.addEventListener("click", () => {
  category = button.dataset.filter;
  filters.forEach((filter) => {
    const selected = filter === button;
    filter.classList.toggle("active", selected);
    filter.setAttribute("aria-pressed", String(selected));
  });
  render();
}));
search.addEventListener("input", render);
render();

async function syncGitHub() {
  const status = document.querySelector("#sync-status");
  try {
    const response = await fetch(`https://api.github.com/users/${owner}/repos?type=owner&per_page=100`, { headers: { Accept:"application/vnd.github+json" } });
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
    const repositories = await response.json();
    const original = repositories.filter((repo) => !repo.fork && !repo.archived && repo.name !== owner && repo.size > 0);
    repoData = new Map(repositories.map((repo) => [repo.name, repo]));
    document.querySelector("#repo-count").textContent = String(original.length);
    document.querySelector("#star-count").textContent = String(original.reduce((sum, repo) => sum + repo.stargazers_count, 0));
    status.textContent = "LIVE GITHUB DATA";
    render();
  } catch {
    status.textContent = "GITHUB DATA UNAVAILABLE";
  }
}
syncGitHub();

const words = ["intelligent systems", "real-time experiences", "connected devices"];
const rotating = document.querySelector("#rotating-word");
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let current = 0;
  setInterval(() => {
    rotating.style.opacity = "0";
    setTimeout(() => {
      current = (current + 1) % words.length;
      rotating.textContent = words[current];
      rotating.style.opacity = "1";
    }, 260);
  }, 3600);
}
document.querySelector("#year").textContent = String(new Date().getFullYear());
