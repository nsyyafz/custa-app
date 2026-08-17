// js/screens/layanan-berhasil.js
// Konfirmasi akhir flow, menampilkan ID request + timeline status.

function timelineStepHTML({ title, subtitle, state }) {
  // state: "done" | "pending" | "waiting"
  const iconClass = state === "done" ? "lb-step-icon-done" : "lb-step-icon-empty";
  return `
    <div class="lb-timeline-step">
      <div class="lb-timeline-icon-col">
        <div class="lb-timeline-icon ${iconClass}"></div>
        <div class="lb-timeline-line"></div>
      </div>
      <div class="lb-timeline-text">
        <span class="lb-timeline-title">${title}</span>
        <span class="lb-timeline-subtitle">${subtitle}</span>
      </div>
    </div>
  `;
}

// 👇 1. Ini fungsi yang tadinya error, sekarang sudah dibuat untuk mencetak HTML
function buildLayananBerhasilHTML(requestData) {
  // Gunakan data dari Database jika ada, jika tidak ada gunakan data dari LayananState
  const isPaid = requestData ? requestData.service_type === "spesialis" : LayananState.jenisLayanan === "spesialis";
  
  // Asumsi generateLayananRequestId() ada di file lain. Jika error, ganti jadi "REQ-" + Math.floor(Math.random() * 1000)
  const requestId = requestData ? requestData.id : (LayananState.requestId || typeof generateLayananRequestId === 'function' ? generateLayananRequestId() : "REQ-12345");
  
  const tanggal = requestData ? requestData.preferred_date : (LayananState.tanggal || "-");
  const waktu = requestData ? requestData.preferred_time : (LayananState.waktu || "-");
  const statusText = requestData ? requestData.status.toUpperCase() : "PERMINTAAN TERKIRIM";

  return `
    <div class="lb-hero">
      <div class="lb-hero-icon">
        <img src="assets/icons/icon-badge.svg" alt="" aria-hidden="true" />
      </div>
      <h1 class="lb-hero-title">Permintaan Terkirim</h1>
      <span class="lb-hero-id">ID: ${requestId}</span>
      <p class="lb-hero-desc">Tenaga kesehatan atau kader akan segera menghubungi Anda untuk konfirmasi jadwal kunjungan.</p>
    </div>

    <div class="lb-info-card">
      <div class="lb-info-row">
        <div class="lb-info-icon"><img src="assets/icons/icon-nav-riwayat.svg" alt="" aria-hidden="true" /></div>
        <div class="lb-info-text">
          <span class="lb-info-label">Layanan</span>
          <span class="lb-info-value">${isPaid ? "Kunjungan Dokter Spesialis" : "Kunjungan Rumah"}</span>
        </div>
      </div>
      <div class="lb-divider"></div>
      <div class="lb-info-cols">
        <div class="lb-info-col">
          <span class="lb-info-label">Tanggal</span>
          <span class="lb-info-value">${tanggal}</span>
        </div>
        <div class="lb-info-col">
          <span class="lb-info-label">Waktu</span>
          <span class="lb-info-value">${waktu}</span>
        </div>
      </div>
    </div>

    <div class="lb-status-card">
      <div class="lb-status-row">
        <span class="lb-info-label">Status</span>
        <span class="lb-status-badge">${statusText}</span>
      </div>
      <div class="lb-status-row">
        <span class="lb-info-label">Petugas</span>
        <span class="lb-info-value">Belum ditentukan</span>
      </div>
      <div class="lb-status-row">
        <span class="lb-info-label">Estimasi</span>
        <span class="lb-info-value">1–3 Hari Kerja</span>
      </div>

      <div class="lb-divider"></div>

      <h2 class="lb-timeline-heading">RIWAYAT PERMINTAAN</h2>
      <div class="lb-timeline">
        ${timelineStepHTML({ title: "Permintaan dikirim", subtitle: new Date().toLocaleString("id-ID"), state: "done" })}
        ${timelineStepHTML({ title: "Diverifikasi", subtitle: "Selesai", state: "done" })}
        ${timelineStepHTML({ title: "Dijadwalkan", subtitle: "Menunggu", state: "waiting" })}
        ${timelineStepHTML({ title: "Kunjungan selesai", subtitle: "", state: "waiting" })}
      </div>
    </div>

    <div class="lb-actions">
      <button class="lb-primary-btn" id="lb-confirm-btn">Konfirmasi Kunjungan</button>
      <button class="lb-secondary-btn" id="lb-detail-btn">Lihat Detail Permintaan</button>
    </div>
  `;
}

// 👇 2. Ini fungsi Render Utama yang menyatukan semuanya
async function renderLayananBerhasilScreen(container) {
  // Tampilkan loading screen dan header terlebih dahulu
  container.innerHTML = `
    ${headerHTML({ variant: "back", title: "Layanan Berhasil" })}
    <main class="lb-main" id="lb-content">
      <p style="text-align:center; padding: 32px 0; color:#3e4947;">Memuat data...</p>
    </main>
  `;
  
  // Aktifkan tombol back di header supaya bisa kembali ke Beranda
  setupHeaderEvents({ onBack: () => navigateTo("home") });

  // Ambil data dari Supabase (jika ada requestDbId)
  const requestData = LayananState.requestDbId
    ? await fetchServiceRequestDetail(LayananState.requestDbId)
    : null;

  // Cetak HTML yang sudah digabung ke dalam <main id="lb-content">
  document.getElementById("lb-content").innerHTML = buildLayananBerhasilHTML(requestData);
  
  // Aktifkan event pada tombol-tombol
  attachLayananBerhasilEvents();
}

function attachLayananBerhasilEvents() {
  document.getElementById("lb-confirm-btn")?.addEventListener("click", () => {
    alert("Konfirmasi kunjungan tersimpan. Kami akan menghubungi Anda segera.");
  });

  document.getElementById("lb-detail-btn")?.addEventListener("click", () => {
    navigateTo("riwayat");
  });
}

async function fetchServiceRequestDetail(requestId) {
  const { data: request, error } = await supabase
    .from("service_requests")
    .select("*")
    .eq("id", requestId)
    .single();

  if (error) {
    console.error("Gagal ambil detail permintaan:", error);
    return null;
  }

  const { data: logs } = await supabase
    .from("service_request_status_log")
    .select("status, changed_at")
    .eq("service_request_id", requestId)
    .order("changed_at", { ascending: true });

  return { ...request, logs: logs || [] };
}