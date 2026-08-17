// js/screens/metode-pembayaran.js
// Hanya untuk jalur "spesialis" (berbayar). Pilih metode pembayaran + kode promo.

const PAYMENT_METHODS = [
  { id: "mandiri_va", name: "Mandiri Virtual Account", desc: "Otomatis dicek" },
  { id: "bca_va", name: "BCA Virtual Account", desc: "Otomatis dicek" },
  { id: "qris", name: "QRIS", desc: "Gopay, OVO, Dana, & lainnya" },
  { id: "gopay", name: "GoPay", desc: "Hubungkan akun" },
];

let mpSelectedMethod = "mandiri_va";

function paymentMethodItemHTML(m) {
  const selected = m.id === mpSelectedMethod;
  return `
    <label class="mp-method-item ${selected ? "mp-method-item-selected" : ""}">
      <input type="radio" name="mp-method" value="${m.id}" ${selected ? "checked" : ""} hidden />
      <div class="mp-method-icon"></div>
      <div class="mp-method-info">
        <span class="mp-method-name">${m.name}</span>
        <span class="mp-method-desc">${m.desc}</span>
      </div>
      <div class="mp-radio-circle"></div>
    </label>
  `;
}

function renderMetodePembayaranScreen(container) {
  mpSelectedMethod = LayananState.metodePembayaran || "mandiri_va";

  container.innerHTML = `
    ${headerHTML({ variant: "back", title: "Metode Pembayaran" })}
    <main class="mp-main">
      <div class="mp-summary-card">
        <div class="mp-summary-top">
          <div class="mp-summary-icon"><img src="assets/icons/icon-badge.svg" alt="" aria-hidden="true" /></div>
          <div>
            <h2 class="mp-summary-title">Kunjungan Dokter Spesialis</h2>
            <span class="mp-summary-sub">Layanan Berbayar</span>
          </div>
        </div>
        <div class="mp-summary-cost">
          <span>Biaya Konsultasi</span>
          <span>Rp 275.000</span>
        </div>
      </div>

      <section class="mp-promo-section">
        <h3 class="mp-section-label">KODE PROMO</h3>
        <div class="mp-promo-row">
          <input type="text" id="mp-promo-input" class="mp-promo-input" placeholder="Masukkan kode promo" />
          <button class="mp-promo-btn" id="mp-promo-btn">Terapkan</button>
        </div>
      </section>

      <section class="mp-methods-section">
        <h3 class="mp-section-label">METODE PEMBAYARAN</h3>
        <div class="mp-method-list" id="mp-method-list">
          ${PAYMENT_METHODS.map(paymentMethodItemHTML).join("")}
        </div>
        <div class="mp-trust-badge">
          <img src="assets/icons/icon-lock.svg" alt="" aria-hidden="true" />
          <span>PEMBAYARAN 100% AMAN & TERENKRIPSI</span>
        </div>
      </section>
    </main>

    <div class="mp-bottom-bar">
      <div class="mp-bottom-total">
        <span>Total Bayar</span>
        <span>Rp 275.000</span>
      </div>
      <button class="mp-pay-btn" id="mp-pay-btn">
        <span>Bayar Sekarang</span>
        <img src="assets/icons/icon-arrow-right.svg" alt="" aria-hidden="true" />
      </button>
    </div>
  `;

  attachMetodePembayaranEvents();
}

function attachMetodePembayaranEvents() {
  document.getElementById("mp-method-list")?.addEventListener("change", (e) => {
    if (e.target.name !== "mp-method") return;
    mpSelectedMethod = e.target.value;
    document.querySelectorAll(".mp-method-item").forEach((el) => el.classList.remove("mp-method-item-selected"));
    e.target.closest(".mp-method-item").classList.add("mp-method-item-selected");
  });

  document.getElementById("mp-promo-btn")?.addEventListener("click", () => {
    const code = document.getElementById("mp-promo-input").value.trim();
    if (!code) {
      alert("Masukkan kode promo terlebih dahulu.");
      return;
    }
    alert("Fitur kode promo belum tersedia (belum terhubung ke sistem promo).");
  });

  document.getElementById("mp-pay-btn")?.addEventListener("click", async () => {
  LayananState.metodePembayaran = mpSelectedMethod;
  await submitServiceRequest(); // insert dengan payment_status = 'pending'
  navigateTo("layananBerhasil");
});
}