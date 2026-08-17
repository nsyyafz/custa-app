// js/screens/result.js -- Hasil Skrining
// Desain Figma yang dikirim cuma varian "Risiko Rendah". Sedang/Tinggi di
// bawah masih versi sederhana (placeholder warna + copy generik) -- tinggal
// disesuaikan begitu kamu kirim desain buat 2 varian itu.

const RISK_CONTENT = {
  rendah: {
    badge: "RISIKO RENDAH",
    cardColor: "#00655d",
    icon: "✓",
    description:
      "Berdasarkan analisis sistem, kondisi kulit Anda saat ini termasuk dalam kategori Risiko Rendah. Belum ditemukan indikasi kuat yang mengarah pada penyakit kusta. Tetap lakukan pemantauan terhadap perubahan pada lesi dan jaga kesehatan kulit Anda.",
    careTitle: "Perawatan Mandiri",
    careItems: [
      "Bersihkan area lesi menggunakan air bersih dan sabun yang lembut.",
      "Hindari menggaruk atau menggosok area lesi agar tidak mengalami iritasi.",
      "Gunakan pelembap apabila kulit terasa kering.",
      "Hindari penggunaan obat atau salep tanpa anjuran tenaga kesehatan.",
      "Perhatikan apabila ukuran, warna, atau jumlah lesi mengalami perubahan.",
    ],
    nextSteps: [
      "Tetap lakukan pemantauan kondisi kulit secara mandiri.",
      "Lakukan skrining ulang apabila terdapat perubahan pada lesi.",
      "Segera kunjungi Puskesmas apabila muncul gejala seperti mati rasa, bercak bertambah luas, atau keluhan lainnya.",
      "Simpan hasil skrining sebagai riwayat kesehatan Anda.",
    ],
  },
  sedang: {
    badge: "RISIKO SEDANG",
    cardColor: "#d97706",
    icon: "!",
    description:
      "Berdasarkan analisis sistem, kondisi kulit Anda termasuk dalam kategori Risiko Sedang. Terdapat beberapa indikasi yang perlu diperiksa lebih lanjut oleh tenaga kesehatan.",
    careTitle: "Yang Perlu Dilakukan",
    careItems: [
      "Jangan menunda pemeriksaan ke Puskesmas terdekat.",
      "Catat sejak kapan gejala muncul dan perubahannya.",
      "Hindari kontak kulit langsung yang terlalu erat sementara waktu.",
    ],
    nextSteps: [
      "Periksakan diri ke Puskesmas dalam 7 hari ke depan.",
      "Bawa hasil skrining ini saat pemeriksaan.",
      "Simpan hasil skrining sebagai riwayat kesehatan Anda.",
    ],
  },
  tinggi: {
    badge: "RISIKO TINGGI",
    cardColor: "#ba1a1a",
    icon: "!",
    description:
      "Berdasarkan analisis sistem, ditemukan indikasi kuat yang memerlukan evaluasi medis segera oleh dokter spesialis kulit. Deteksi dini sangat krusial untuk diagnosis yang tepat.",
    careTitle: "Perawatan Mandiri",
    careItems: [
      "Bersihkan area lesi menggunakan air bersih dan sabun yang lembut.",
      "Hindari menggaruk atau menggosok area lesi agar tidak mengalami iritasi.",
      "Gunakan pelembap apabila kulit terasa kering.",
      "Hindari penggunaan obat atau salep tanpa anjuran tenaga kesehatan.",
      "Perhatikan apabila ukuran, warna, atau jumlah lesi mengalami perubahan.",
    ],
    nextSteps: [
      "Segera kunjungi dokter spesialis kulit atau fasilitas kesehatan terdekat dalam 1-2 hari.",
      "Siapkan riwayat keluhan dan hasil skrining ini untuk ditunjukkan kepada dokter spesialis.",
      "Tetap lakukan pemantauan mandiri namun jangan menunda konsultasi medis.",
      "Simpan hasil skrining ini sebagai referensi medis awal Anda.",
    ],
  },
};

function renderResultScreen(container) {
  const result = window.__lastScreeningResult;

  if (!result) {
    container.innerHTML = `
      ${headerHTML()}
      <main class="hasil-screen">
        <p>Belum ada hasil skrining. Silakan mulai skrining dulu.</p>
        <button class="btn-block-primary" id="btnBackHome">Kembali ke Beranda</button>
      </main>
    `;
    document.getElementById("btnBackHome").addEventListener("click", () => navigateTo("home"));
    return;
  }

  const content = RISK_CONTENT[result.kategori] || RISK_CONTENT.rendah;
  const factors = buildFactorsList(result.answers);

  container.innerHTML = `
    ${headerHTML()}
    <main class="hasil-screen">

      <section class="hasil-header">
        <h1>Hasil Skrining</h1>
        <p>Berikut adalah hasil skrining berdasarkan foto lesi dan informasi yang telah Anda berikan.</p>
      </section>

      <section class="risk-level-card" style="background-color:${content.cardColor}">
        <div class="risk-check-circle">${content.icon}</div>
        <div class="risk-badge-pill">${content.badge}</div>
        <p>${content.description}</p>
      </section>

      <section class="info-card">
        <div class="info-card-header">
          <span class="info-icon">🩹</span>
          <h2>${content.careTitle}</h2>
        </div>
        <ul class="bullet-list">
          ${content.careItems.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </section>

      <section class="info-card">
        <div class="info-card-header">
          <span class="info-icon">📋</span>
          <div>
            <h2>Faktor Analisis</h2>
            <p class="info-subtitle">Sistem mempertimbangkan informasi berikut:</p>
          </div>
        </div>
        <ul class="dot-list">
          ${factors.map((f) => `<li>${f}</li>`).join("")}
        </ul>
        <p class="disclaimer-italic">*Hasil diperoleh dari kombinasi analisis foto lesi dan jawaban kuesioner.</p>
      </section>

      <section class="info-card">
        <div class="info-card-header">
          <span class="info-icon">🧭</span>
          <h2>Langkah Selanjutnya</h2>
        </div>
        <ol class="timeline-list">
          ${content.nextSteps.map((step) => `<li>${step}</li>`).join("")}
        </ol>
      </section>

      <section class="education-banner">
        <span class="education-banner-icon">💡</span>
        <div>
          <h3>Tahukah Anda?</h3>
          <p>Deteksi dini dapat mencegah perburukan kondisi kulit. Kenali gejalanya lebih awal.</p>
          <button class="btn-white-pill-small" id="btnBacaEdukasi">Baca Edukasi</button>
        </div>
      </section>

      <section class="disclaimer-box">
        <span>⚠️</span>
        <p>Hasil skrining ini merupakan alat bantu deteksi dini dan bukan diagnosis medis. Apabila keluhan tidak membaik atau semakin berat, segera lakukan pemeriksaan di Puskesmas atau fasilitas kesehatan terdekat.</p>
      </section>

    </main>

    <div class="hasil-sticky-actions">
      <button class="btn-block-primary" id="btnSimpanHasil">Simpan Hasil Skrining</button>
      <div class="hasil-action-row">
        <button class="btn-outline-action" id="btnKunjunganRumah">Kunjungan Rumah</button>
        <button class="btn-outline-action" id="btnFaskesTerdekat">Faskes Terdekat</button>
        <button class="btn-outline-icon" id="btnKembaliBeranda" aria-label="Kembali ke beranda">🏠</button>
      </div>
    </div>
  `;

  document.getElementById("btnSimpanHasil").addEventListener("click", () => {
    alert("Hasil skrining sudah tersimpan otomatis ke riwayat Anda.");
  });
  document.getElementById("btnKunjunganRumah").addEventListener("click", () => {
    navigateTo("layananKunjungan");
  });
  document.getElementById("btnFaskesTerdekat").addEventListener("click", () => navigateTo("puskesmas"));
  document.getElementById("btnKembaliBeranda").addEventListener("click", () => navigateTo("home"));
  document.getElementById("btnBacaEdukasi").addEventListener("click", () => {
    alert("Halaman Edukasi belum tersedia, masih dalam pengerjaan.");
  });
}

// Bikin daftar "Faktor Analisis" dinamis dari jawaban kuesioner beneran,
// bukan teks statis -- jadi selalu sesuai sama input user.
function buildFactorsList(answers) {
  if (!answers) return ["Data kuesioner tidak tersedia."];
  const list = [];

  const durasiLabel = {
    kurang_1_bulan: "Lesi muncul kurang dari 1 bulan.",
    "1_6_bulan": "Lesi sudah muncul 1–6 bulan.",
    lebih_6_bulan: "Lesi sudah muncul lebih dari 6 bulan.",
  };
  if (answers.durasi && durasiLabel[answers.durasi]) list.push(durasiLabel[answers.durasi]);

  list.push(answers.matiRasa ? "Terdapat gejala mati rasa pada bercak." : "Tidak terdapat gejala mati rasa.");

  const keluargaLabel = {
    ya: "Ada riwayat kontak dengan penderita kusta di keluarga/serumah.",
    tidak: "Tidak memiliki riwayat kontak penderita.",
    tidak_tahu: "Riwayat kontak dengan penderita tidak diketahui.",
  };
  if (answers.riwayatKeluarga && keluargaLabel[answers.riwayatKeluarga]) {
    list.push(keluargaLabel[answers.riwayatKeluarga]);
  }

  const jumlahLabel = {
    satu: "Hanya terdapat satu bercak.",
    "2_5": "Terdapat 2–5 bercak.",
    lebih_5: "Terdapat lebih dari 5 bercak.",
  };
  if (answers.jumlahBercak && jumlahLabel[answers.jumlahBercak]) list.push(jumlahLabel[answers.jumlahBercak]);

  return list;
}
