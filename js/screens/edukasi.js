// js/screens/edukasi.js
// Satu screen dengan 2 tab: "Edukasi" (artikel) dan "Komunitas" (forum/grup/mentor).
// Cuma ada satu entry di footer nav ("edukasi"), tab switcher di dalamnya.
// DATA STATIS - belum ada tabel articles/forums/groups di skema Supabase.

let edukasiActiveTab = "artikel"; // "artikel" | "komunitas"
let edukasiActiveCategory = "semua";
let komunitasInitialized = false;

const EDUKASI_CATEGORIES = [
  { value: "semua", label: "Semua" },
  { value: "lepra", label: "Lepra" },
  { value: "kesehatan_kulit", label: "Kesehatan Kulit" },
  { value: "pencegahan", label: "Pencegahan" },
  { value: "perawatan", label: "Perawatan" },
];

const EDUKASI_ARTICLES = [
  { id: "e1", category: "lepra", categoryLabel: "LEPRA", title: "Mengenal Gejala Awal Lepra yang Perlu Diwaspadai", readMinutes: 5 },
  { id: "e2", category: "pencegahan", categoryLabel: "PENCEGAHAN", title: "Tips Menjaga Kebersihan Kulit Sehari-hari", readMinutes: 3 },
  { id: "e3", category: "perawatan", categoryLabel: "PERAWATAN", title: "Cara Merawat Luka Sensitif Pasca Skrining", readMinutes: 6 },
];

const KOMUNITAS_FORUMS = [
  { id: "f1", title: "Tanya Dokter", desc: "Tanya jawab langsung dengan tenaga medis.", activeCount: "1.2k", newCount: 45, variant: "primary" },
  { id: "f2", title: "Penyembuhan Lepra", desc: "Berbagi pengalaman dan dukungan.", activeCount: "850", newCount: 12, variant: "accent" },
  { id: "f3", title: "Kesehatan Umum", desc: "Diskusi seputar tips gaya hidup sehat.", activeCount: "2.5k", newCount: 89, variant: "teal-light" },
];

const KOMUNITAS_GROUPS = [
  { id: "g1", name: "Pejuang Kulit Sehat", desc: "Ruang aman untuk berbagi cerita perjalanan menuju kulit sehat.", memberBadge: "+42", theme: "dark" },
  { id: "g2", name: "Keluarga ZYTRAVA", desc: "Grup publik untuk informasi umum dan pengumuman komunitas.", memberBadge: "99+", theme: "light" },
];

const KOMUNITAS_MENTORS = [
  { id: "km1", name: "dr. Ilham Irzi, Sp.DVE", specialty: "Spesialis Kulit & Kelamin" },
  { id: "km2", name: "Ns. Hafidza, S.Kep., Sp.Kep.Kom", specialty: "Konselor Kesehatan" },
];

// ===== ARTIKEL TAB =====

function edukasiChipHTML(cat) {
  const active = cat.value === edukasiActiveCategory;
  return `<button class="edukasi-chip ${active ? "edukasi-chip-active" : ""}" data-cat="${cat.value}">${cat.label}</button>`;
}

function edukasiCardHTML(a) {
  return `
    <button class="edukasi-article-card" data-article-id="${a.id}">
      <div class="edukasi-article-thumb"></div>
      <div class="edukasi-article-body">
        <div class="edukasi-article-meta">
          <span class="edukasi-article-tag">${a.categoryLabel}</span>
          <span class="edukasi-article-time">${a.readMinutes} min baca</span>
        </div>
        <h3 class="edukasi-article-title">${a.title}</h3>
      </div>
      <div class="edukasi-article-chevron">
        <img src="assets/icons/icon-arrow-right.svg" alt="" aria-hidden="true" />
      </div>
    </button>
  `;
}

function artikelTabContentHTML() {
  return `
    <div class="edukasi-chip-row" id="edukasi-chip-row">
      ${EDUKASI_CATEGORIES.map(edukasiChipHTML).join("")}
    </div>

    <div class="edukasi-hero">
      <div class="edukasi-hero-overlay">
        <h1 class="edukasi-hero-title">Pusat Edukasi Kulit</h1>
        <p class="edukasi-hero-desc">Temukan informasi terpercaya mengenai kesehatan kulit, pencegahan, dan penanganannya.</p>
      </div>
    </div>

    <div class="edukasi-article-list" id="edukasi-article-list">
      ${EDUKASI_ARTICLES.map(edukasiCardHTML).join("")}
    </div>

    <button class="edukasi-load-more-btn" id="edukasi-load-more">
      <span>Muat Lebih Banyak</span>
      <img src="assets/icons/icon-arrow-right.svg" alt="" aria-hidden="true" />
    </button>
  `;
}

function attachArtikelTabEvents() {
  document.getElementById("edukasi-chip-row")?.addEventListener("click", (e) => {
    const btn = e.target.closest(".edukasi-chip");
    if (!btn) return;
    edukasiActiveCategory = btn.dataset.cat;
    document.querySelectorAll(".edukasi-chip").forEach((c) => c.classList.remove("edukasi-chip-active"));
    btn.classList.add("edukasi-chip-active");
    renderEdukasiArticleList();
  });

  attachEdukasiCardClicks();

  document.getElementById("edukasi-load-more")?.addEventListener("click", () => {
    alert("Semua artikel yang tersedia sudah ditampilkan.");
  });
}

function renderEdukasiArticleList() {
  const filtered = EDUKASI_ARTICLES.filter(
    (a) => edukasiActiveCategory === "semua" || a.category === edukasiActiveCategory
  );
  document.getElementById("edukasi-article-list").innerHTML = filtered.length
    ? filtered.map(edukasiCardHTML).join("")
    : `<p class="edukasi-empty">Belum ada artikel di kategori ini.</p>`;
  attachEdukasiCardClicks();
}

function attachEdukasiCardClicks() {
  document.querySelectorAll(".edukasi-article-card").forEach((card) => {
    card.addEventListener("click", () => navigateTo("detailEdukasi"));
  });
}

// ===== KOMUNITAS TAB =====

function komunitasForumHTML(f) {
  return `
    <button class="komunitas-forum-item" data-forum-id="${f.id}">
      <div class="komunitas-forum-icon komunitas-forum-icon-${f.variant}">
        <img src="assets/icons/icon-nav-edukasi.svg" alt="" aria-hidden="true" />
      </div>
      <div class="komunitas-forum-info">
        <h3 class="komunitas-forum-title">${f.title}</h3>
        <p class="komunitas-forum-desc">${f.desc}</p>
        <div class="komunitas-forum-stats">
          <span>${f.activeCount} Aktif</span>
          <span>${f.newCount} Baru</span>
        </div>
      </div>
    </button>
  `;
}

function komunitasGroupHTML(g) {
  return `
    <div class="komunitas-group-card komunitas-group-card-${g.theme}">
      <h3 class="komunitas-group-name">${g.name}</h3>
      <p class="komunitas-group-desc">${g.desc}</p>
      <div class="komunitas-group-footer">
        <div class="komunitas-group-avatars">
          <div class="komunitas-group-avatar"></div>
          <div class="komunitas-group-avatar"></div>
          <div class="komunitas-group-avatar-badge">${g.memberBadge}</div>
        </div>
        <button class="komunitas-group-join-btn" data-group-id="${g.id}">Gabung</button>
      </div>
    </div>
  `;
}

function komunitasMentorHTML(m) {
  return `
    <div class="komunitas-mentor-card">
      <div class="komunitas-mentor-avatar"></div>
      <div class="komunitas-mentor-info">
        <h3 class="komunitas-mentor-name">${m.name}</h3>
        <p class="komunitas-mentor-specialty">${m.specialty}</p>
      </div>
      <button class="komunitas-mentor-chat-btn" data-mentor-id="${m.id}" aria-label="Chat dengan ${m.name}">
        <img src="assets/icons/icon-nav-profil.svg" alt="" aria-hidden="true" />
      </button>
    </div>
  `;
}

function komunitasTabContentHTML() {
  return `
    <div class="komunitas-main">
      <section class="komunitas-intro">
        <h1 class="komunitas-intro-title">Komunitas ZYTRAVA</h1>
        <p class="komunitas-intro-desc">Belajar bersama, saling mendukung, dan temukan jawaban dari para ahli serta sesama pejuang kesehatan kulit.</p>
      </section>

      <!-- Menggunakan warna placeholder sementara untuk card Sesi Live -->
      <section class="komunitas-live-card" style="background: linear-gradient(180deg, rgba(0, 101, 93, 0.6) 0%, rgba(0, 65, 70, 0.9) 100%), url('assets/images/bg-live.jpg') no-repeat center center / cover;">
        <div class="komunitas-live-overlay">
          <span class="komunitas-live-badge">Sesi Live Mendatang</span>
          <h2 class="komunitas-live-title">Menjaga Kesehatan Kulit di Daerah Tropis</h2>
          <div class="komunitas-live-meta">
            <img src="assets/icons/icon-badge.svg" alt="" aria-hidden="true" />
            <span>Besok, 14:00 WIB &bull; Dr. Andi Sp.KK</span>
          </div>
        </div>
      </section>

      <section class="komunitas-section">
        <div class="komunitas-section-header">
          <h2 class="komunitas-section-title">Forum Diskusi</h2>
          <button class="komunitas-see-all-btn" id="komunitas-forum-see-all">Lihat Semua</button>
        </div>
        <div class="komunitas-forum-list" id="komunitas-forum-list">
          ${KOMUNITAS_FORUMS.map(komunitasForumHTML).join("")}
        </div>
      </section>

      <section class="komunitas-section">
        <h2 class="komunitas-section-title">Grup Dukungan</h2>
        <div class="komunitas-group-list" id="komunitas-group-list">
          ${KOMUNITAS_GROUPS.map(komunitasGroupHTML).join("")}
        </div>
      </section>

      <section class="komunitas-section">
        <h2 class="komunitas-section-title">Mentor Komunitas</h2>
        <div class="komunitas-mentor-list" id="komunitas-mentor-list">
          ${KOMUNITAS_MENTORS.map(komunitasMentorHTML).join("")}
        </div>
      </section>

      <button class="komunitas-join-btn" id="komunitas-join-btn">
        <img src="assets/icons/icon-badge.svg" alt="" aria-hidden="true" />
        <span>Gabung Komunitas ZYTRAVA</span>
      </button>
    </div>
  `;
}

function attachKomunitasTabEvents() {
  document.querySelectorAll(".komunitas-forum-item").forEach((btn) => {
    btn.addEventListener("click", () => alert("Fitur forum diskusi akan segera hadir."));
  });

  document.getElementById("komunitas-forum-see-all")?.addEventListener("click", () => {
    alert("Halaman semua forum akan segera hadir.");
  });

  document.querySelectorAll(".komunitas-group-join-btn").forEach((btn) => {
    btn.addEventListener("click", () => alert("Fitur gabung grup akan segera hadir."));
  });

  document.querySelectorAll(".komunitas-mentor-chat-btn").forEach((btn) => {
    btn.addEventListener("click", () => navigateTo("mentorMedis"));
  });

  document.getElementById("komunitas-join-btn")?.addEventListener("click", () => {
    alert("Fitur gabung komunitas akan segera hadir.");
  });
}

// ===== SCREEN UTAMA (tab switcher) =====

function renderEdukasiScreen(container) {
  container.innerHTML = `
    ${headerHTML({ variant: "brand" })}
    <div class="edukasi-tab-switcher">
      <button class="edukasi-tab ${edukasiActiveTab === "artikel" ? "edukasi-tab-active" : ""}" data-tab="artikel">
        Edukasi
      </button>
      <button class="edukasi-tab ${edukasiActiveTab === "komunitas" ? "edukasi-tab-active" : ""}" data-tab="komunitas">
        Komunitas
      </button>
    </div>
    <main class="edukasi-main" id="edukasi-tab-content">
      ${edukasiActiveTab === "artikel" ? artikelTabContentHTML() : komunitasTabContentHTML()}
    </main>
    ${footerHTML("edukasi")}
  `;

  attachEdukasiTabSwitcherEvents();

  if (edukasiActiveTab === "artikel") {
    attachArtikelTabEvents();
  } else {
    attachKomunitasTabEvents();
  }

  // Penting agar ikon header (profil) berfungsi
  setupHeaderEvents(); 
  // Penting agar menu di bawah (home, edukasi, dll) berfungsi
  setupFooterNav(); 
}

function attachEdukasiTabSwitcherEvents() {
  document.querySelectorAll(".edukasi-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      edukasiActiveTab = btn.dataset.tab;
      renderEdukasiScreen(document.getElementById("app"));
      window.scrollTo(0, 0);
    });
  });
}