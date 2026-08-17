// js/screens/artikel.js
// Daftar artikel dengan search + featured card + list "Terbaru".
// DATA STATIS, sama seperti edukasi.js - idealnya nanti dua screen ini
// (edukasi & artikel) berbagi sumber data yang sama dari tabel articles.

const ARTIKEL_CATEGORIES = [
  { value: "semua", label: "Semua" },
  { value: "edukasi", label: "Edukasi" },
  { value: "tips", label: "Tips" },
  { value: "berita", label: "Berita" },
  { value: "perawatan", label: "Perawatan" },
];

const ARTIKEL_FEATURED = {
  id: "a-featured",
  tag: "EDUKASI UTAMA",
  title: "Memahami Lepra: Fakta, Gejala, dan Harapan",
  excerpt: "Penyakit kusta masih dikelilingi mitos. Mari pelajari fakta medis terkini dan cara penanganannya.",
  readMinutes: 5,
};

const ARTIKEL_LIST = [
  {
    id: "a1",
    category: "tips",
    categoryLabel: "TIPS",
    title: "7 Langkah Menjaga Kesehatan Kulit di Iklim Tropis",
    readMinutes: 3,
  },
  {
    id: "a2",
    category: "edukasi",
    categoryLabel: "PENCEGAHAN",
    title: "Pentingnya Kebersihan Diri Mencegah Infeksi",
    readMinutes: 4,
  },
  {
    id: "a3",
    category: "berita",
    categoryLabel: "BERITA",
    title: "Layanan Telemedisin Baru ZYTRAVA",
    readMinutes: 2,
  },
];

let artikelActiveCategory = "semua";
let artikelSearchQuery = "";

function artikelChipHTML(cat) {
  const active = cat.value === artikelActiveCategory;
  return `<button class="artikel-chip ${active ? "artikel-chip-active" : ""}" data-cat="${cat.value}">${cat.label}</button>`;
}

function artikelListItemHTML(a) {
  return `
    <button class="artikel-list-item" data-article-id="${a.id}">
      <div class="artikel-list-thumb"></div>
      <div class="artikel-list-info">
        <div>
          <span class="artikel-list-tag">${a.categoryLabel}</span>
          <h3 class="artikel-list-title">${a.title}</h3>
        </div>
        <div class="artikel-list-meta">
          <img src="assets/icons/icon-badge.svg" alt="" aria-hidden="true" />
          <span>${a.readMinutes} min baca</span>
        </div>
      </div>
    </button>
  `;
}

function renderArtikelScreen(container) {
  container.innerHTML = `
    <div class="artikel-search-header">
      <div class="artikel-search-wrap">
        <img src="assets/icons/icon-search.svg" alt="" aria-hidden="true" class="artikel-search-icon" />
        <input type="text" id="artikel-search-input" class="artikel-search-input" placeholder="Cari artikel kesehatan..." />
      </div>
    </div>

    <main class="artikel-main">
      <div class="artikel-chip-row" id="artikel-chip-row">
        ${ARTIKEL_CATEGORIES.map(artikelChipHTML).join("")}
      </div>

      <button class="artikel-featured-card" id="artikel-featured-card">
        <div class="artikel-featured-image">
          <span class="artikel-featured-tag">${ARTIKEL_FEATURED.tag}</span>
        </div>
        <div class="artikel-featured-body">
          <h2 class="artikel-featured-title">${ARTIKEL_FEATURED.title}</h2>
          <p class="artikel-featured-excerpt">${ARTIKEL_FEATURED.excerpt}</p>
          <div class="artikel-featured-meta">
            <img src="assets/icons/icon-badge.svg" alt="" aria-hidden="true" />
            <span>${ARTIKEL_FEATURED.readMinutes} min baca</span>
          </div>
        </div>
      </button>

      <section class="artikel-list-section">
        <h2 class="artikel-list-heading">Terbaru</h2>
        <div class="artikel-list" id="artikel-list">
          ${ARTIKEL_LIST.map(artikelListItemHTML).join("")}
        </div>
      </section>
    </main>
  `;

  attachArtikelEvents();
}

function renderArtikelList() {
  const filtered = ARTIKEL_LIST.filter((a) => {
    const matchCategory = artikelActiveCategory === "semua" || a.category === artikelActiveCategory;
    const q = artikelSearchQuery.trim().toLowerCase();
    const matchSearch = !q || a.title.toLowerCase().includes(q);
    return matchCategory && matchSearch;
  });

  document.getElementById("artikel-list").innerHTML = filtered.length
    ? filtered.map(artikelListItemHTML).join("")
    : `<p class="artikel-empty">Tidak ada artikel yang cocok.</p>`;

  attachArtikelListClicks();
}

function attachArtikelEvents() {
  document.getElementById("artikel-search-input")?.addEventListener("input", (e) => {
    artikelSearchQuery = e.target.value;
    renderArtikelList();
  });

  document.getElementById("artikel-chip-row")?.addEventListener("click", (e) => {
    const btn = e.target.closest(".artikel-chip");
    if (!btn) return;
    artikelActiveCategory = btn.dataset.cat;
    document.querySelectorAll(".artikel-chip").forEach((c) => c.classList.remove("artikel-chip-active"));
    btn.classList.add("artikel-chip-active");
    renderArtikelList();
  });

  document.getElementById("artikel-featured-card")?.addEventListener("click", () => {
    navigateTo("detailEdukasi");
  });

  attachArtikelListClicks();
}

function attachArtikelListClicks() {
  document.querySelectorAll(".artikel-list-item").forEach((item) => {
    item.addEventListener("click", () => {
      navigateTo("detailEdukasi");
    });
  });
}