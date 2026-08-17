// js/screens/tentang.js
// Halaman info aplikasi: logo, deskripsi, link ke Kebijakan Privasi & Beri Nilai.

function renderAboutScreen(container) {
  const version = "1.0.0";
  const year = new Date().getFullYear();

  container.innerHTML = `
    ${headerHTML({ variant: "back", title: "Tentang Zytrava" })}
    <main class="tentang-main">
      <div class="tentang-hero">
        <div class="tentang-logo-wrap">
          <img src="assets/zytrava-logo.png" alt="ZYTRAVA" class="tentang-logo" />
        </div>
        <h1 class="tentang-app-name">ZYTRAVA</h1>
        <span class="tentang-app-version">Versi ${version}</span>
      </div>

      <div class="tentang-desc-card">
        <p class="tentang-desc-text">
          Memberdayakan kesehatan Anda melalui skrining bertenaga AI yang presisi dan dukungan komunitas yang empatik. Masa depan perawatan, di ujung jari Anda.
        </p>
      </div>

      <section class="tentang-list-section">
        <h2 class="tentang-list-title">Informasi</h2>
        <div class="tentang-list-card">
          <button class="tentang-list-item" id="link-kebijakan-privasi">
            <div class="tentang-list-left">
              <div class="tentang-list-icon">
                <img src="assets/icons/icon-lock.svg" alt="" aria-hidden="true" />
              </div>
              <span class="tentang-list-text">Kebijakan Privasi</span>
            </div>
            <img src="assets/icons/icon-arrow-right.svg" alt="" aria-hidden="true" class="tentang-list-chevron" />
          </button>
          <div class="tentang-list-divider"></div>
          <button class="tentang-list-item" id="link-beri-nilai">
            <div class="tentang-list-left">
              <div class="tentang-list-icon">
                <img src="assets/icons/icon-badge.svg" alt="" aria-hidden="true" />
              </div>
              <span class="tentang-list-text">Beri Nilai Aplikasi</span>
            </div>
            <img src="assets/icons/icon-arrow-right.svg" alt="" aria-hidden="true" class="tentang-list-chevron" />
          </button>
        </div>
      </section>

      <p class="tentang-copyright">ZYTRAVA © ${year} Hak Cipta Dilindungi.</p>
    </main>
  `;
    setupHeaderEvents({ onBack: () => navigateTo("profil") });
  attachTentangEvents();
}

function attachTentangEvents() {
  document.getElementById("link-kebijakan-privasi")?.addEventListener("click", () => navigateTo("kebijakanPrivasi"));
  document.getElementById("link-beri-nilai")?.addEventListener("click", () => navigateTo("beriPenilaian"));
}