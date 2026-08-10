// js/components/header.js
// Header dipakai berulang di beberapa screen (Beranda, Scan, Kuesioner, Hasil).
// Dua varian: "brand" (logo ZYTRAVA + tombol profil) dan "back" (tombol
// kembali + judul halaman).

function headerHTML({ variant = "brand", title = "" } = {}) {
  if (variant === "back") {
    return `
      <header class="app-header">
        <div class="row back-row">
          <button class="btn-icon-plain" id="header-back-btn" aria-label="Kembali">
            <img src="assets/icons/icon-back.svg" alt="" aria-hidden="true" />
          </button>
          <h1 class="header-title">${title}</h1>
        </div>
      </header>
    `;
  }

  return `
    <header class="app-header">
      <div class="row">
        <div class="brand">
          <div class="brand-logo"></div>
          <span class="brand-name">ZYTRAVA</span>
        </div>
        <button class="notif-btn" id="header-notif-btn" aria-label="Profil">
          <img src="assets/icons/icon-profil.svg" alt="" aria-hidden="true" />
        </button>
      </div>
    </header>
  `;
}

// Panggil ini SETELAH innerHTML di-set, biar tombol back/notif berfungsi.
function setupHeaderEvents({ onBack } = {}) {
  const backBtn = document.getElementById("header-back-btn");
  if (backBtn) {
    backBtn.addEventListener("click", onBack || (() => navigateTo("home")));
  }
  const notifBtn = document.getElementById("header-notif-btn");
  if (notifBtn) {
    notifBtn.addEventListener("click", () => {
      alert("Notifikasi belum tersedia, masih dalam pengerjaan.");
    });
  }
}
