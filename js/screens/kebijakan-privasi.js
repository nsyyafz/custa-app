// js/screens/kebijakan-privasi.js
// Konten statis kebijakan privasi. Diakses dari menu "Pusat Bantuan" di Profil
// dan tombol "Kebijakan Privasi" di halaman Tentang.

function renderKebijakanPrivasiScreen(container) {
  container.innerHTML = `
    ${headerHTML({ variant: "back", title: "Kebijakan Privasi" })}
    <main class="kp-main">
      <div class="kp-intro">
        <h1 class="kp-title">Kebijakan Privasi</h1>
        <p class="kp-updated">Terakhir Diperbarui: 28 Mei 2026</p>
      </div>

      <section class="kp-card">
        <h2 class="kp-section-title">Pengumpulan Data</h2>
        <p class="kp-text">
          Kami mengumpulkan informasi yang Anda berikan secara langsung saat menggunakan aplikasi ini, termasuk namun tidak terbatas pada informasi profil, riwayat medis, dan foto medis yang diunggah.
        </p>
        <h3 class="kp-subsection-title">Data Medis Sensitif</h3>
        <p class="kp-text">
          Khusus untuk foto medis dan rekam jejak kesehatan, data dienkripsi end-to-end sebelum disimpan di server kami.
        </p>
      </section>

      <section class="kp-card kp-card-highlight">
        <h2 class="kp-section-title">Penggunaan Data</h2>
        <p class="kp-text">
          Data Anda digunakan secara eksklusif untuk memberikan layanan kesehatan yang dipersonalisasi. Kami tidak menjual data pribadi atau medis Anda kepada pihak ketiga.
        </p>
        <ul class="kp-list">
          <li>Analisis kondisi kesehatan untuk rekomendasi medis.</li>
          <li>Komunikasi antara Anda dan tenaga medis terdaftar.</li>
          <li>Peningkatan kualitas sistem AI kami (hanya menggunakan data yang telah dianonimkan).</li>
        </ul>
      </section>

      <section class="kp-card">
        <h2 class="kp-section-title">Hak Pengguna</h2>
        <p class="kp-text">
          Anda memegang kendali penuh atas data Anda. Sesuai dengan regulasi perlindungan data yang berlaku, Anda memiliki hak untuk:
        </p>
        <div class="kp-right-list">
          <div class="kp-right-item">
            <img src="assets/icons/icon-arrow-right.svg" alt="" aria-hidden="true" class="kp-right-icon" />
            <div class="kp-right-text">
              <h4 class="kp-right-title">Unduh Data</h4>
              <p class="kp-right-desc">Meminta salinan seluruh data medis Anda dalam format standar.</p>
            </div>
          </div>
          <div class="kp-right-item">
            <img src="assets/icons/icon-arrow-right.svg" alt="" aria-hidden="true" class="kp-right-icon" />
            <div class="kp-right-text">
              <h4 class="kp-right-title">Hapus Data</h4>
              <p class="kp-right-desc">Meminta penghapusan permanen akun dan seluruh rekam medis Anda dari server kami.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="kp-cta-card">
        <span class="kp-cta-icon material-symbols-rounded">health_and_safety</span>
        <h3 class="kp-cta-title">Keamanan Terjamin</h3>
        <p class="kp-cta-desc">
          Sistem kami menggunakan standar enkripsi medis tingkat lanjut untuk memastikan foto dan data kesehatan Anda tetap rahasia.
        </p>
        <button class="kp-cta-btn" id="btn-hubungi-dpo">Hubungi Data Protection Officer</button>
      </section>
    </main>
  `;
    setupHeaderEvents({ onBack: () => navigateTo("profil") });
  attachKebijakanPrivasiEvents();
}

function attachKebijakanPrivasiEvents() {
  document.getElementById("btn-hubungi-dpo")?.addEventListener("click", () => {
    window.location.href = "mailto:dpo@zytrava.app?subject=Pertanyaan%20Privasi%20Data";
  });
}