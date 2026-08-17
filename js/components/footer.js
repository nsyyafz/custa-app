// js/components/footer.js
// Bottom nav (dipakai di Beranda). Ada 4 tab + 1 tombol tengah melayang
// (FAB) buat langsung mulai skrining.

function footerHTML(active = "beranda") {
  const navItem = (key, label) => `
    <button class="nav-item ${active === key ? "active" : ""}" data-nav="${key}">
      <img src="assets/icons/icon-nav-${key}.svg" alt="" aria-hidden="true" />
      <span>${label}</span>
    </button>
  `;

  return `
    <footer class="app-footer">
      <div class="nav-row">
        ${navItem("beranda", "Beranda")}
        ${navItem("edukasi", "Edukasi")}
        <div class="nav-fab-spacer"></div>
        ${navItem("riwayat", "Riwayat")}
        ${navItem("profil", "Profil")}
        <button class="nav-fab" id="footer-fab-scan" aria-label="Mulai Skrining">
          <img src="assets/icons/icon-scan-fab.svg" alt="" aria-hidden="true" />
        </button>
      </div>
    </footer>
  `;
}

// Panggil SETELAH innerHTML di-set.
function setupFooterNav() {
  document.querySelectorAll(".app-footer .nav-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.nav;
      if (key === "beranda") navigateTo("home");
      else if (key === "riwayat") navigateTo("riwayat");
      else if (key === "profil") navigateTo("profil");
      else if (key === "edukasi") navigateTo("edukasi");
      else alert("Halaman ini belum tersedia, masih dalam pengerjaan.");
    });
  });

  const fab = document.getElementById("footer-fab-scan");
  if (fab) fab.addEventListener("click", () => navigateTo("scan"));
}
