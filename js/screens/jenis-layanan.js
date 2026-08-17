// js/screens/jenis-layanan.js
// Step 2: pilih Kunjungan Kader (gratis) atau Dokter Spesialis (berbayar).

// 👇 PERBAIKAN 1: Cukup deklarasikan variabelnya di sini tanpa memanggil LayananState
let jenisLayananSelected = null;

function renderJenisLayananScreen(container) {
  // 👇 PERBAIKAN 2: Baru ambil nilainya dari LayananState di dalam fungsi ini
  jenisLayananSelected = LayananState.jenisLayanan || "kader";

  container.innerHTML = `
    ${headerHTML({ variant: "back", title: "Pilih Jenis Layanan" })}
    <main class="jl-main">
      <p class="jl-intro">Silakan pilih jenis layanan kunjungan yang sesuai dengan kebutuhan Anda.</p>

      <div class="jl-options">
        <label class="jl-option ${jenisLayananSelected === "kader" ? "jl-option-selected" : ""}" id="jl-option-kader">
          <input type="radio" name="jl-jenis" value="kader" ${jenisLayananSelected === "kader" ? "checked" : ""} hidden />
          <div class="jl-option-top">
            <div class="jl-option-icon">
              <img src="assets/icons/icon-nav-profil.svg" alt="" aria-hidden="true" />
            </div>
            <div class="jl-option-heading">
              <span class="jl-option-title">Kunjungan Kader</span>
              <span class="jl-badge jl-badge-free">Gratis</span>
            </div>
            <div class="jl-check-circle"></div>
          </div>
          <p class="jl-option-desc">Layanan kunjungan standar oleh kader kesehatan untuk pemeriksaan awal dan edukasi. Tanpa biaya.</p>
        </label>

        <label class="jl-option jl-option-premium ${jenisLayananSelected === "spesialis" ? "jl-option-selected" : ""}" id="jl-option-spesialis">
          <input type="radio" name="jl-jenis" value="spesialis" ${jenisLayananSelected === "spesialis" ? "checked" : ""} hidden />
          <div class="jl-option-top">
            <div class="jl-option-icon">
              <img src="assets/icons/icon-badge.svg" alt="" aria-hidden="true" />
            </div>
            <div class="jl-option-heading">
              <span class="jl-option-title">Dokter Spesialis</span>
              <span class="jl-badge jl-badge-paid">Berbayar</span>
            </div>
            <div class="jl-check-circle"></div>
          </div>
          <p class="jl-option-desc">Layanan kunjungan oleh dokter spesialis kulit untuk diagnosis mendalam dan tindakan medis langsung.</p>
          <div class="jl-cost-row">
            <span class="jl-cost-label">ESTIMASI BIAYA</span>
            <span class="jl-cost-value">Rp 250.000</span>
          </div>
        </label>
      </div>

      <div class="jl-sticky-cta">
        <button class="jl-submit-btn" id="jl-submit-btn">
          <span>Lanjutkan ke Detail</span>
          <img src="assets/icons/icon-arrow-right.svg" alt="" aria-hidden="true" />
        </button>
      </div>
    </main>
  `;

  // 👇 PERBAIKAN 3: Jangan lupa setup event header agar tombol back bisa kembali ke form awal
  setupHeaderEvents({ onBack: () => navigateTo("layananKunjungan") });

  attachJenisLayananEvents();
}

function attachJenisLayananEvents() {
  document.querySelectorAll('input[name="jl-jenis"]').forEach((input) => {
    input.addEventListener("change", () => {
      jenisLayananSelected = input.value;
      document.querySelectorAll(".jl-option").forEach((el) => el.classList.remove("jl-option-selected"));
      input.closest(".jl-option").classList.add("jl-option-selected");
    });
  });

  document.getElementById("jl-submit-btn")?.addEventListener("click", () => {
    LayananState.jenisLayanan = jenisLayananSelected;
    navigateTo("detailLayanan");
  });
}