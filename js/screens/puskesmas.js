// js/screens/puskesmas.js -- daftar fasilitas kesehatan, sesuai desain "Puskemas"
// Jarak dihitung dari lokasi user (geolocation browser) ke lat/lng tiap fasilitas
// pakai rumus Haversine -- gak butuh PostGIS buat ini, cukup query biasa.

let puskesmasAllData = [];
let puskesmasActiveCategory = "semua";
let puskesmasUserLocation = null;

const CATEGORY_LABEL = {
  rumah_sakit: "Rumah Sakit",
  puskesmas: "Puskesmas",
  klinik: "Klinik",
  apotek: "Apotek",
};
const CATEGORY_BADGE = {
  rumah_sakit: "RS",
  puskesmas: "Puskesmas",
  klinik: "Klinik",
  apotek: "Apotek",
};

function renderPuskesmasScreen(container) {
  container.innerHTML = `
    ${headerHTML({ variant: "back", title: "Fasilitas Kesehatan" })}
    <main class="puskesmas-screen">
      <div class="puskesmas-search-wrap">
        <div class="puskesmas-search-box">
          <span class="puskesmas-search-icon">🔍</span>
          <input type="text" id="puskesmasSearchInput" placeholder="Cari fasilitas kesehatan..." />
        </div>
        <div class="puskesmas-filter-row">
          <button class="riwayat-chip active" data-cat="semua">Semua</button>
          <button class="riwayat-chip" data-cat="rumah_sakit">Rumah Sakit</button>
          <button class="riwayat-chip" data-cat="puskesmas">Puskesmas</button>
          <button class="riwayat-chip" data-cat="klinik">Klinik</button>
          <button class="riwayat-chip" data-cat="apotek">Apotek</button>
        </div>
      </div>

      <div class="puskesmas-list" id="puskesmasList">
        <p class="text-muted" style="padding:0 16px;">Memuat fasilitas kesehatan...</p>
      </div>
    </main>

    <button class="puskesmas-fab" id="btnLihatPeta">📍 Lihat Peta</button>
  `;

  setupHeaderEvents({ onBack: () => navigateTo("home") });

  document.querySelectorAll(".puskesmas-filter-row .riwayat-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".puskesmas-filter-row .riwayat-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      puskesmasActiveCategory = chip.dataset.cat;
      renderPuskesmasList();
    });
  });

  document.getElementById("puskesmasSearchInput").addEventListener("input", renderPuskesmasList);

  document.getElementById("btnLihatPeta").addEventListener("click", () => {
    const q = puskesmasUserLocation
      ? `puskesmas+terdekat/@${puskesmasUserLocation.lat},${puskesmasUserLocation.lng},14z`
      : `puskesmas+terdekat`;
    window.open(`https://www.google.com/maps/search/${q}`, "_blank");
  });

  loadPuskesmasData();
}

function loadPuskesmasData() {
  // Coba ambil lokasi user dulu (buat hitung jarak), tapi tetap lanjut
  // load data faskes walau user nolak izin lokasi.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        puskesmasUserLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        fetchPuskesmasData();
      },
      () => fetchPuskesmasData(),
      { timeout: 5000 }
    );
  } else {
    fetchPuskesmasData();
  }
}

async function fetchPuskesmasData() {
  const listEl = document.getElementById("puskesmasList");
  try {
    const { data, error } = await supabase.from("health_facilities").select("*");
    if (error) throw error;

    puskesmasAllData = (data || []).map((f) => ({
      ...f,
      distanceKm: puskesmasUserLocation && f.lat && f.lng
        ? haversineDistanceKm(puskesmasUserLocation.lat, puskesmasUserLocation.lng, f.lat, f.lng)
        : null,
    }));
    puskesmasAllData.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));

    renderPuskesmasList();
  } catch (err) {
    listEl.innerHTML = `<p class="text-muted" style="padding:0 16px;">Belum bisa memuat data fasilitas kesehatan.</p>`;
  }
}

function haversineDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function renderPuskesmasList() {
  const listEl = document.getElementById("puskesmasList");
  const searchTerm = (document.getElementById("puskesmasSearchInput").value || "").toLowerCase();

  let filtered = puskesmasAllData;
  if (puskesmasActiveCategory !== "semua") {
    filtered = filtered.filter((f) => f.category === puskesmasActiveCategory);
  }
  if (searchTerm) {
    filtered = filtered.filter((f) => (f.name || "").toLowerCase().includes(searchTerm));
  }

  if (filtered.length === 0) {
    listEl.innerHTML = `<div class="riwayat-empty"><div class="riwayat-empty-icon">📍</div><p>Belum ada fasilitas kesehatan yang cocok.</p></div>`;
    return;
  }

  listEl.innerHTML = filtered.map(puskesmasCardHTML).join("");

  document.querySelectorAll(".puskesmas-direction-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const { lat, lng } = btn.dataset;
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
    });
  });
}

function puskesmasCardHTML(f) {
  const catKey = f.category || "puskesmas";
  const distanceText = f.distanceKm != null ? `${f.distanceKm.toFixed(1)} km` : "-- km";
  const statusText = f.is_24_hours ? "24 Jam" : "Cek Jam Operasional";

  return `
    <div class="puskesmas-card">
      <div class="puskesmas-card-thumb"></div>
      <div class="puskesmas-card-info">
        <div class="puskesmas-card-top">
          <p class="puskesmas-card-name">${f.name}</p>
          <span class="puskesmas-cat-badge cat-${catKey}">${CATEGORY_BADGE[catKey] || catKey}</span>
        </div>
        <p class="puskesmas-card-address">${f.address || ""}</p>
        <div class="puskesmas-card-meta">
          <span class="puskesmas-meta-pill">${statusText}</span>
          <span class="puskesmas-meta-distance">${distanceText}</span>
        </div>
        <button class="puskesmas-direction-btn" data-lat="${f.lat}" data-lng="${f.lng}">
          🧭 Petunjuk Arah
        </button>
      </div>
    </div>
  `;
}
