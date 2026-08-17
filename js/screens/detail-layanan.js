// js/screens/detail-layanan.js
// Detail sebelum konfirmasi: tampilan beda untuk "kader" (gratis) dan "spesialis" (berbayar).

function detailInfoRowHTML(icon, label, value) {
  return `
    <div class="dl-info-row">
      <div class="dl-info-icon"><img src="assets/icons/${icon}" alt="" aria-hidden="true" /></div>
      <div class="dl-info-text">
        <span class="dl-info-label">${label}</span>
        <span class="dl-info-value">${value}</span>
      </div>
    </div>
  `;
}

function renderDetailLayananScreen(container) {
  const isPaid = LayananState.jenisLayanan === "spesialis";

  container.innerHTML = `
    ${headerHTML({ variant: "back", title: "Detail Layanan" })}
    <main class="dl-main">
      <div class="dl-status-banner ${isPaid ? "dl-status-paid" : "dl-status-free"}">
        <span class="dl-status-tag">STATUS LAYANAN</span>
        <h1 class="dl-status-title">${isPaid ? "Berbayar" : "Gratis"}</h1>
      </div>

      <div class="dl-info-card">
        ${detailInfoRowHTML("icon-profil.svg", "Nama Pasien", LayananState.namaLengkap || "-")}
        <div class="dl-divider"></div>
        <div class="dl-info-row">
          <div class="dl-info-icon"><img src="assets/icons/icon-badge.svg" alt="" aria-hidden="true" /></div>
          <div class="dl-info-text">
            <span class="dl-info-label">Jadwal Kunjungan</span>
            <span class="dl-info-value">${LayananState.tanggal || "-"}</span>
            <span class="dl-info-value-sub">${LayananState.waktu || "-"}</span>
          </div>
        </div>
        <div class="dl-divider"></div>
        ${detailInfoRowHTML("icon-phone.svg", "Alamat Kunjungan", LayananState.alamat || "-")}
      </div>

      ${isPaid ? `
        <div class="dl-premium-box">
          <img src="assets/icons/icon-bell.svg" alt="" aria-hidden="true" />
          <p>Layanan berbayar ini mencakup diagnosis langsung oleh dokter spesialis kulit dan tindakan medis darurat jika diperlukan di lokasi.</p>
        </div>

        <div class="dl-cost-card">
          <h2 class="dl-cost-title">
            <img src="assets/icons/icon-badge.svg" alt="" aria-hidden="true" />
            <span>Rincian Biaya</span>
          </h2>
          <div class="dl-cost-row"><span>Biaya Konsultasi</span><span>Rp 250.000</span></div>
          <div class="dl-cost-row"><span>Biaya Layanan</span><span>Rp 25.000</span></div>
          <div class="dl-divider"></div>
          <div class="dl-cost-row dl-cost-total"><span>Total Pembayaran</span><span>Rp 275.000</span></div>
        </div>

        <button class="dl-primary-btn" id="dl-continue-btn">Lanjut ke Pembayaran</button>
        <button class="dl-secondary-btn" id="dl-edit-btn">Ubah Detail</button>
      ` : `
        <div class="dl-cost-card">
          <h2 class="dl-cost-title">
            <img src="assets/icons/icon-badge.svg" alt="" aria-hidden="true" />
            <span>Rincian Biaya</span>
          </h2>
          <div class="dl-cost-row"><span>Biaya Kunjungan</span><span>Rp 0</span></div>
          <div class="dl-cost-row"><span>Biaya Layanan</span><span>Rp 0</span></div>
          <div class="dl-divider"></div>
          <div class="dl-cost-row dl-cost-total"><span>Total Pembayaran</span><span>Rp 0</span></div>
        </div>

        <button class="dl-primary-btn" id="dl-continue-btn">Konfirmasi Kunjungan</button>
        <button class="dl-secondary-btn" id="dl-edit-btn">Ubah Detail</button>
      `}
    </main>
  `;

  attachDetailLayananEvents(isPaid);
}

function attachDetailLayananEvents(isPaid) {
  document.getElementById("dl-edit-btn")?.addEventListener("click", () => {
    navigateTo("jenisLayanan");
  });

  document.getElementById("dl-continue-btn")?.addEventListener("click", async () => {
    if (isPaid) {
      LayananState.consultationFee = 250000;
      LayananState.serviceFee = 25000;
      navigateTo("metodePembayaran");
    } else {
      LayananState.consultationFee = 0;
      LayananState.serviceFee = 0;
      await submitServiceRequest(); // langsung insert untuk layanan gratis
      navigateTo("layananBerhasil");
    }
  });
}

function generateLayananRequestId() {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 900 + 100);
  return `ZTR-${year}-${rand}`;
}