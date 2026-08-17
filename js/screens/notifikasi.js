// js/screens/notifikasi.js
// Pengaturan notifikasi: master toggle, jenis notifikasi (4), metode peringatan (3).
// Disimpan di localStorage (bukan tabel Supabase - belum ada tabel settings di skema).

const NOTIF_STORAGE_KEY = "zytrava_notif_settings";

const NOTIF_DEFAULTS = {
  master: true,
  hasilSkrining: true,
  jadwalKunjungan: true,
  edukasiArtikel: true,
  pesanKomunitas: false,
  bunyi: true,
  getar: true,
  lencanaIkon: true,
};

function loadNotifSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(NOTIF_STORAGE_KEY));
    return { ...NOTIF_DEFAULTS, ...saved };
  } catch {
    return { ...NOTIF_DEFAULTS };
  }
}

function saveNotifSettings(settings) {
  localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(settings));
}

function notifSwitchHTML(id, checked) {
  return `
    <button class="switch ${checked ? "switch-on" : "switch-off"}" id="${id}" role="switch" aria-checked="${checked}">
      <div class="switch-thumb"></div>
    </button>
  `;
}

function notifItemHTML({ id, icon, title, desc, checked }) {
  return `
    <div class="notif-item">
      <div class="notif-item-left">
        <div class="notif-item-icon">
          <img src="assets/icons/${icon}" alt="" aria-hidden="true" />
        </div>
        <div class="notif-item-text">
          <span class="notif-item-title">${title}</span>
          <span class="notif-item-desc">${desc}</span>
        </div>
      </div>
      ${notifSwitchHTML(id, checked)}
    </div>
  `;
}

function renderNotifikasiScreen(container) {
  const s = loadNotifSettings();

  container.innerHTML = `
    ${headerHTML({ variant: "back", title: "Notifikasi Kesehatan" })}
    <main class="notif-main">
      <div class="notif-master-card">
        <div class="notif-master-row">
          <div class="notif-master-text">
            <span class="notif-master-title">Notifikasi Utama</span>
            <span class="notif-master-desc">Aktifkan atau nonaktifkan semua notifikasi dari ZYTRAVA.</span>
          </div>
          ${notifSwitchHTML("notif-master", s.master)}
        </div>
      </div>

      <h2 class="notif-section-title">Jenis Notifikasi</h2>
      <div class="notif-group-card">
        ${notifItemHTML({
          id: "notif-hasil-skrining",
          icon: "icon-badge.svg",
          title: "Hasil Skrining",
          desc: "Peringatan saat hasil pemeriksaan tersedia.",
          checked: s.hasilSkrining,
        })}
        ${notifItemHTML({
          id: "notif-jadwal-kunjungan",
          icon: "icon-bell.svg",
          title: "Jadwal Kunjungan Rumah",
          desc: "Pengingat untuk jadwal petugas kesehatan.",
          checked: s.jadwalKunjungan,
        })}
        ${notifItemHTML({
          id: "notif-edukasi-artikel",
          icon: "icon-nav-edukasi.svg",
          title: "Edukasi & Artikel",
          desc: "Pembaruan materi kesehatan terbaru.",
          checked: s.edukasiArtikel,
        })}
        ${notifItemHTML({
          id: "notif-pesan-komunitas",
          icon: "icon-nav-profil.svg",
          title: "Pesan Komunitas",
          desc: "Pesan dari grup dukungan pasien.",
          checked: s.pesanKomunitas,
        })}
      </div>

      <h2 class="notif-section-title">Metode Peringatan</h2>
      <div class="notif-group-card">
        <div class="notif-item">
          <div class="notif-item-text">
            <span class="notif-item-title">Bunyi</span>
            <span class="notif-item-desc">Mainkan suara saat notifikasi masuk.</span>
          </div>
          ${notifSwitchHTML("notif-bunyi", s.bunyi)}
        </div>
        <div class="notif-item">
          <div class="notif-item-text">
            <span class="notif-item-title">Getar</span>
            <span class="notif-item-desc">Perangkat bergetar saat notifikasi masuk.</span>
          </div>
          ${notifSwitchHTML("notif-getar", s.getar)}
        </div>
        <div class="notif-item notif-item-last">
          <div class="notif-item-text">
            <span class="notif-item-title">Lencana Ikon Aplikasi</span>
            <span class="notif-item-desc">Tampilkan titik merah pada ikon ZYTRAVA.</span>
          </div>
          ${notifSwitchHTML("notif-lencana", s.lencanaIkon)}
        </div>
      </div>
    </main>
  `;
        setupHeaderEvents({ onBack: () => navigateTo("profil") });
  attachNotifikasiEvents();
}

function attachNotifikasiEvents() {
  const settings = loadNotifSettings();

  const idMap = {
    "notif-master": "master",
    "notif-hasil-skrining": "hasilSkrining",
    "notif-jadwal-kunjungan": "jadwalKunjungan",
    "notif-edukasi-artikel": "edukasiArtikel",
    "notif-pesan-komunitas": "pesanKomunitas",
    "notif-bunyi": "bunyi",
    "notif-getar": "getar",
    "notif-lencana": "lencanaIkon",
  };

  Object.keys(idMap).forEach((id) => {
    const btn = document.getElementById(id);
    if (!btn) return;

    btn.addEventListener("click", () => {
      const key = idMap[id];
      settings[key] = !settings[key];
      btn.classList.toggle("switch-on", settings[key]);
      btn.classList.toggle("switch-off", !settings[key]);
      btn.setAttribute("aria-checked", String(settings[key]));

      if (id === "notif-master") {
        Object.keys(idMap).forEach((otherId) => {
          if (otherId === "notif-master") return;
          const otherBtn = document.getElementById(otherId);
          const otherKey = idMap[otherId];
          settings[otherKey] = settings.master;
          if (otherBtn) {
            otherBtn.classList.toggle("switch-on", settings.master);
            otherBtn.classList.toggle("switch-off", !settings.master);
            otherBtn.setAttribute("aria-checked", String(settings.master));
          }
        });
      }

      saveNotifSettings(settings);
    });
  });
}