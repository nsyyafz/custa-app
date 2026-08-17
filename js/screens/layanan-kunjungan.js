// js/screens/layanan-kunjungan.js
// Step 1: form informasi pasien + detail kunjungan.
// Data disimpan ke LayananState (memori), belum ada tabel Supabase untuk ini.

const JENIS_KELUHAN_OPTIONS = [
  "Pemeriksaan Awal",
  "Verifikasi Hasil Skrining",
  "Perawatan Luka",
  "Home Visit MDT",
  "Konsultasi Kader",
];

function layananKeluhanRadioHTML(label) {
  const checked = LayananState.jenisKeluhan === label;
  return `
    <label class="lk-radio-item ${checked ? "lk-radio-item-checked" : ""}">
      <input type="radio" name="lk-keluhan" value="${label}" ${checked ? "checked" : ""} />
      <span>${label}</span>
    </label>
  `;
}

function renderLayananKunjunganScreen(container) {
  container.innerHTML = `
    ${headerHTML({ variant: "back", title: "Pendaftaran Layanan" })}
    <main class="lk-main">
      <div class="lk-intro">
        <div class="lk-intro-tag">
          <img src="assets/icons/icon-nav-riwayat.svg" alt="" aria-hidden="true" />
          <span>LAYANAN KUNJUNGAN</span>
        </div>
        <h1 class="lk-title">Pendaftaran Baru</h1>
        <p class="lk-subtitle">Lengkapi informasi di bawah untuk menjadwalkan kunjungan tenaga medis ke rumah Anda.</p>
      </div>

      <div class="lk-progress">
        <div class="lk-progress-track"><div class="lk-progress-fill" style="width: 50%;"></div></div>
        <span class="lk-progress-label">Langkah 1 dari 2</span>
      </div>

      <form id="lk-form" class="lk-form">
        <section class="lk-section">
          <h2 class="lk-section-title">Informasi Pasien</h2>

          <div class="lk-field">
            <label class="lk-label" for="lk-nama">Nama Lengkap</label>
            <input type="text" id="lk-nama" class="lk-input" placeholder="Nama lengkap pasien" value="${LayananState.namaLengkap || ""}" />
          </div>

          <div class="lk-field">
            <label class="lk-label" for="lk-alamat">Alamat Kunjungan</label>
            <textarea id="lk-alamat" class="lk-textarea" placeholder="Masukkan alamat lengkap dengan nomor rumah/RT/RW">${LayananState.alamat || ""}</textarea>
            <button type="button" class="lk-location-btn" id="lk-use-location">
              <img src="assets/icons/icon-arrow-right.svg" alt="" aria-hidden="true" />
              <span>Gunakan Lokasi Saat Ini</span>
            </button>
          </div>

          <div class="lk-field">
            <label class="lk-label" for="lk-telepon">Nomor Telepon</label>
            <input type="tel" id="lk-telepon" class="lk-input" placeholder="08xx xxxx xxxx" value="${LayananState.telepon || ""}" />
          </div>
        </section>

        <section class="lk-section">
          <h2 class="lk-section-title">Detail Kunjungan</h2>

          <div class="lk-grid-2">
            <div class="lk-field">
              <label class="lk-label" for="lk-tanggal">Tanggal</label>
              <input type="date" id="lk-tanggal" class="lk-input" value="${LayananState.tanggal || ""}" />
            </div>
            <div class="lk-field">
              <label class="lk-label" for="lk-waktu">Waktu</label>
              <input type="time" id="lk-waktu" class="lk-input" value="${LayananState.waktu || ""}" />
            </div>
          </div>
          <p class="lk-note">* Waktu kedatangan tim medis mungkin bervariasi ±30 menit dari jadwal yang dipilih.</p>

          <div class="lk-field">
            <label class="lk-label">Pilih Jenis Layanan / Keluhan</label>
            <div class="lk-radio-list" id="lk-keluhan-list">
              ${JENIS_KELUHAN_OPTIONS.map(layananKeluhanRadioHTML).join("")}
            </div>
          </div>

          <div class="lk-field">
            <label class="lk-label" for="lk-keluhan-lain">Keluhan Lainnya (Opsional)</label>
            <textarea id="lk-keluhan-lain" class="lk-textarea" placeholder="Tulis keluhan lainnya di sini...">${LayananState.keluhanLainnya || ""}</textarea>
          </div>

          <div class="lk-warning-card">
            <img src="assets/icons/icon-bell.svg" alt="" aria-hidden="true" />
            <p>Layanan kunjungan rumah tidak diperuntukkan bagi kondisi gawat darurat yang mengancam nyawa. Segera hubungi IGD terdekat untuk kondisi darurat.</p>
          </div>
        </section>
      </form>

      <div class="lk-sticky-cta">
        <button type="submit" form="lk-form" class="lk-submit-btn" id="lk-submit-btn">
          <span>Pilih Jenis Layanan</span>
          <img src="assets/icons/icon-arrow-right.svg" alt="" aria-hidden="true" />
        </button>
      </div>
    </main>
  `;

  attachLayananKunjunganEvents();
}

function attachLayananKunjunganEvents() {
  document.getElementById("lk-keluhan-list")?.addEventListener("change", (e) => {
    if (e.target.name !== "lk-keluhan") return;
    document.querySelectorAll(".lk-radio-item").forEach((el) => el.classList.remove("lk-radio-item-checked"));
    e.target.closest(".lk-radio-item").classList.add("lk-radio-item-checked");
  });

  document.getElementById("lk-use-location")?.addEventListener("click", () => {
    if (!navigator.geolocation) {
      alert("Perangkat tidak mendukung deteksi lokasi.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        document.getElementById("lk-alamat").value = `Lokasi terdeteksi: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
      },
      () => alert("Gagal mendapatkan lokasi. Pastikan izin lokasi diaktifkan.")
    );
  });

  document.getElementById("lk-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const nama = document.getElementById("lk-nama").value.trim();
    const alamat = document.getElementById("lk-alamat").value.trim();
    const telepon = document.getElementById("lk-telepon").value.trim();
    const tanggal = document.getElementById("lk-tanggal").value;
    const waktu = document.getElementById("lk-waktu").value;
    const keluhan = document.querySelector('input[name="lk-keluhan"]:checked')?.value;

    if (!nama || !alamat || !telepon || !tanggal || !waktu || !keluhan) {
      alert("Mohon lengkapi semua kolom wajib sebelum melanjutkan.");
      return;
    }

    LayananState.namaLengkap = nama;
    LayananState.alamat = alamat;
    LayananState.telepon = telepon;
    LayananState.tanggal = tanggal;
    LayananState.waktu = waktu;
    LayananState.jenisKeluhan = keluhan;
    LayananState.keluhanLainnya = document.getElementById("lk-keluhan-lain").value.trim();

    navigateTo("jenisLayanan");
  });
}