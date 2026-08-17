// js/screens/mentor-medis.js
// Daftar mentor medis dengan filter kategori + search.
// DATA STATIS - belum ada tabel mentors di skema Supabase.
// Kalau mau dari DB, perlu tabel seperti:
//   mentors(id, full_name, title, specialty, category, years_experience,
//           rating, review_count, avatar_url, is_online, action_type)

const MENTOR_DATA = [
  {
    id: "m1",
    name: "dr. Budi Santoso, Sp.PD",
    specialty: "Spesialis Penyakit Dalam",
    category: "dokter_spesialis",
    years: 12,
    rating: 4.9,
    reviews: 1200,
    online: true,
    actionLabel: "Konsultasi",
  },
  {
    id: "m2",
    name: "Ns. Rina Melati, S.Kep",
    specialty: "Konselor Medis & Perawat",
    category: "perawat",
    years: 8,
    rating: 4.8,
    reviews: 850,
    online: false,
    actionLabel: "Jadwalkan Sesi",
  },
];

const MENTOR_CATEGORIES = [
  { value: "semua", label: "Semua" },
  { value: "dokter_spesialis", label: "Dokter Spesialis" },
  { value: "konselor", label: "Konselor" },
  { value: "perawat", label: "Perawat" },
];

let mentorActiveCategory = "semua";
let mentorSearchQuery = "";

function formatReviewCount(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function mentorCardHTML(m) {
  return `
    <div class="mentor-card">
      <div class="mentor-card-top">
        <div class="mentor-avatar-wrap">
          <div class="mentor-avatar"></div>
          <div class="mentor-status-dot ${m.online ? "mentor-status-online" : "mentor-status-offline"}"></div>
        </div>
        <div class="mentor-info">
          <h3 class="mentor-name">${m.name}</h3>
          <p class="mentor-specialty">${m.specialty}</p>
          <div class="mentor-stats">
            <span class="mentor-stat-chip">${m.years} Thn</span>
            <span class="mentor-stat-chip">${m.rating} (${formatReviewCount(m.reviews)})</span>
          </div>
        </div>
      </div>
      <button class="mentor-action-btn ${m.online ? "mentor-action-primary" : "mentor-action-secondary"}" data-mentor-id="${m.id}">
        ${m.actionLabel}
      </button>
    </div>
  `;
}

function mentorChipHTML(cat) {
  const active = cat.value === mentorActiveCategory;
  return `<button class="mentor-chip ${active ? "mentor-chip-active" : ""}" data-cat="${cat.value}">${cat.label}</button>`;
}

function renderMentorMedisScreen(container) {
  container.innerHTML = `
    ${headerHTML({ variant: "back", title: "Mentor Medis" })}
    <main class="mentor-main">
      <div class="mentor-search-section">
        <div class="mentor-search-wrap">
          <img src="assets/icons/icon-search.svg" alt="" aria-hidden="true" class="mentor-search-icon" />
          <input type="text" id="mentor-search-input" class="mentor-search-input" placeholder="Cari nama mentor atau spesialisasi..." />
        </div>
        <div class="mentor-chip-row" id="mentor-chip-row">
          ${MENTOR_CATEGORIES.map(mentorChipHTML).join("")}
        </div>
      </div>
      <div class="mentor-list" id="mentor-list">
        ${MENTOR_DATA.map(mentorCardHTML).join("")}
      </div>
    </main>
  `;

  attachMentorMedisEvents();
}

function renderMentorList() {
  const filtered = MENTOR_DATA.filter((m) => {
    const matchCategory = mentorActiveCategory === "semua" || m.category === mentorActiveCategory;
    const q = mentorSearchQuery.trim().toLowerCase();
    const matchSearch = !q || m.name.toLowerCase().includes(q) || m.specialty.toLowerCase().includes(q);
    return matchCategory && matchSearch;
  });

  const listEl = document.getElementById("mentor-list");
  listEl.innerHTML = filtered.length
    ? filtered.map(mentorCardHTML).join("")
    : `<p class="mentor-empty">Tidak ada mentor yang cocok.</p>`;

  attachMentorActionButtons();
}

function attachMentorMedisEvents() {
  document.getElementById("mentor-search-input")?.addEventListener("input", (e) => {
    mentorSearchQuery = e.target.value;
    renderMentorList();
  });

  document.getElementById("mentor-chip-row")?.addEventListener("click", (e) => {
    const btn = e.target.closest(".mentor-chip");
    if (!btn) return;
    mentorActiveCategory = btn.dataset.cat;
    document.querySelectorAll(".mentor-chip").forEach((c) => c.classList.remove("mentor-chip-active"));
    btn.classList.add("mentor-chip-active");
    renderMentorList();
  });

  attachMentorActionButtons();
}

function attachMentorActionButtons() {
  document.querySelectorAll(".mentor-action-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      // Placeholder - belum ada flow konsultasi/jadwal di skema.
      alert("Fitur konsultasi/jadwal sesi akan segera hadir.");
    });
  });
}