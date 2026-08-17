// js/screens/detail-edukasi.js
// Detail satu artikel edukasi. Karena data masih statis, isi artikel di-hardcode
// mengikuti konten contoh (Lepra). Kalau nanti dari DB, ganti dengan
// parameter artikel yang diklik dari edukasi.js / artikel.js.

function renderDetailEdukasiScreen(container) {
  container.innerHTML = `
    ${headerHTML({ variant: "back", title: "Detail Edukasi" })}
    <main class="detail-edukasi-main">
      <div class="detail-edukasi-hero"></div>

      <div class="detail-edukasi-content">
        <div class="detail-edukasi-info-card">
          <div class="detail-edukasi-info-top">
            <span class="detail-edukasi-tag">EDUKASI</span>
            <span class="detail-edukasi-date">12 Okt 2023</span>
          </div>
          <h1 class="detail-edukasi-title">Memahami Gejala dan Penanganan Dini Lepra</h1>
          <div class="detail-edukasi-author">
            <div class="detail-edukasi-author-avatar"></div>
            <span class="detail-edukasi-author-name">Tim Medis ZYTRAVA</span>
          </div>
        </div>

        <div class="detail-edukasi-body">
          <p class="detail-edukasi-paragraph">
            Lepra, atau kusta, seringkali disalahpahami oleh masyarakat luas. Penyakit yang disebabkan oleh infeksi bakteri <em>Mycobacterium leprae</em> ini sejatinya sangat bisa disembuhkan, terutama jika dideteksi dan ditangani sejak dini. Edukasi yang tepat adalah kunci untuk menghapus stigma dan mempercepat proses penyembuhan.
          </p>

          <blockquote class="detail-edukasi-quote">
            "Deteksi dini mencegah kecacatan. Pengobatan lepra tersedia secara gratis di puskesmas seluruh Indonesia."
          </blockquote>

          <h2 class="detail-edukasi-heading">Gejala Awal yang Perlu Diwaspadai</h2>
          <p class="detail-edukasi-paragraph">
            Gejala awal lepra seringkali muncul pada kulit dan sistem saraf tepi. Mengenali tanda-tanda ini sejak awal sangat penting:
          </p>
          <ul class="detail-edukasi-list">
            <li>Bercak pada kulit yang berwarna lebih terang (hipopigmentasi) atau kemerahan.</li>
            <li>Mati rasa atau berkurangnya sensitivitas pada bercak tersebut terhadap sentuhan, panas, atau nyeri.</li>
            <li>Penebalan saraf tepi, sering terasa di area siku atau lutut.</li>
          </ul>

          <div class="detail-edukasi-illustration"></div>

          <h2 class="detail-edukasi-heading">Langkah Penanganan</h2>
          <p class="detail-edukasi-paragraph">
            Jika Anda atau orang terdekat mengalami gejala di atas, segera konsultasikan ke fasilitas kesehatan terdekat. Pengobatan standar untuk lepra adalah MDT (Multi Drug Therapy) yang terbukti efektif memutus rantai penularan dan menyembuhkan pasien.
          </p>
        </div>

        <div class="detail-edukasi-actions">
          <button class="detail-edukasi-action-btn detail-edukasi-action-secondary" id="btn-simpan-artikel">
            <img src="assets/icons/icon-badge.svg" alt="" aria-hidden="true" />
            <span>Simpan</span>
          </button>
          <button class="detail-edukasi-action-btn detail-edukasi-action-primary" id="btn-bagikan-artikel">
            <img src="assets/icons/icon-arrow-right.svg" alt="" aria-hidden="true" />
            <span>Bagikan</span>
          </button>
        </div>

        <div class="detail-edukasi-related">
          <h2 class="detail-edukasi-related-title">Artikel Terkait</h2>
          <div class="detail-edukasi-related-list">
            <button class="detail-edukasi-related-card" data-article-id="e2">
              <div class="detail-edukasi-related-thumb"></div>
              <div class="detail-edukasi-related-info">
                <span class="detail-edukasi-related-tag">Pencegahan</span>
                <h3 class="detail-edukasi-related-name">Pentingnya Kebersihan Diri</h3>
                <span class="detail-edukasi-related-author">Oleh Dr. Anisa</span>
              </div>
            </button>
            <button class="detail-edukasi-related-card" data-article-id="e3">
              <div class="detail-edukasi-related-thumb"></div>
              <div class="detail-edukasi-related-info">
                <span class="detail-edukasi-related-tag">Kesehatan Kulit</span>
                <h3 class="detail-edukasi-related-name">Merawat Kulit Sensitif</h3>
                <span class="detail-edukasi-related-author">Oleh Tim Medis</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </main>
  `;

  attachDetailEdukasiEvents();
}

function attachDetailEdukasiEvents() {
  document.getElementById("btn-simpan-artikel")?.addEventListener("click", () => {
    // Placeholder - belum ada tabel saved_articles di skema.
    alert("Artikel disimpan (fitur penyimpanan permanen menyusul).");
  });

  document.getElementById("btn-bagikan-artikel")?.addEventListener("click", async () => {
    const shareData = {
      title: "Memahami Gejala dan Penanganan Dini Lepra",
      text: "Artikel edukasi dari ZYTRAVA",
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Gagal membagikan:", err);
      }
    } else {
      alert("Fitur berbagi tidak didukung di perangkat ini.");
    }
  });

  document.querySelectorAll(".detail-edukasi-related-card").forEach((card) => {
    card.addEventListener("click", () => {
      navigateTo("detailEdukasi");
      window.scrollTo(0, 0);
    });
  });
}