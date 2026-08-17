// js/screens/profil.js
// Hub utama Profil. "Profil" di sini = data pasien (tabel patients),
// dihubungkan ke akun login lewat patients.registered_by = auth user id.
// Kalau ternyata "Profil" seharusnya nampilin data akun (tabel profiles),
// query di loadProfilData() perlu diganti.

const RISK_LEVEL_LABEL = {
  // TODO: sesuaikan key ini dengan value asli enum risk_level.
  // Cek dengan: select unnest(enum_range(NULL::risk_level));
  rendah: "Rendah",
  sedang: "Sedang",
  tinggi: "Tinggi",
  low: "Rendah",
  medium: "Sedang",
  high: "Tinggi",
};

function renderProfilScreen(container) {
  container.innerHTML = `
    ${headerHTML({ variant: "brand" })}
    <main class="profil-main">
      <section class="profil-header-section">
        <div class="profil-avatar-wrap">
          <div class="profil-avatar" id="profil-avatar"></div>
          <div class="profil-avatar-badge">
            <img src="assets/icons/icon-badge.svg" alt="" aria-hidden="true" />
          </div>
        </div>
        <div class="profil-name-wrap">
          <span class="profil-name" id="profil-name">Memuat...</span>
          <span class="profil-role">Pasien Terdaftar</span>
        </div>
        <button class="btn-edit-profil" id="profil-edit-btn">
          <img src="assets/icons/icon-profil.svg" alt="" aria-hidden="true" />
          <span>Edit Profil</span>
        </button>
      </section>

      <section class="profil-card">
        <div class="profil-card-header">
          <div class="profil-card-icon">
            <img src="assets/icons/icon-badge.svg" alt="" aria-hidden="true" />
          </div>
          <h2 class="profil-card-title">Riwayat Kesehatan</h2>
        </div>
        <div class="profil-summary-grid">
          <div class="profil-summary-box">
            <span class="profil-summary-label">Total Skrining</span>
            <span class="profil-summary-value" id="profil-total-skrining">-</span>
          </div>
          <div class="profil-summary-box">
            <span class="profil-summary-label">Status Risiko</span>
            <span class="profil-summary-value profil-summary-risk" id="profil-status-risiko">-</span>
          </div>
          <div class="profil-summary-box profil-summary-box-wide">
            <span class="profil-summary-label">Skrining Terakhir</span>
            <span class="profil-summary-value profil-summary-value-sm" id="profil-skrining-terakhir">-</span>
          </div>
        </div>
      </section>

      <section class="profil-card">
        <div class="profil-card-header">
          <div class="profil-card-icon">
            <img src="assets/icons/icon-id-card.svg" alt="" aria-hidden="true" />
          </div>
          <h2 class="profil-card-title">Informasi Pribadi</h2>
        </div>
        <div class="profil-info-list">
          <div class="profil-info-row">
            <span class="profil-info-label">Nama Lengkap</span>
            <span class="profil-info-value" id="profil-info-nama">-</span>
          </div>
          <div class="profil-info-row">
            <span class="profil-info-label">Tanggal Lahir</span>
            <span class="profil-info-value" id="profil-info-tgl-lahir">-</span>
          </div>
          <div class="profil-info-row">
            <span class="profil-info-label">Jenis Kelamin</span>
            <span class="profil-info-value" id="profil-info-gender">-</span>
          </div>
          <div class="profil-info-row">
            <span class="profil-info-label">Nomor Induk Kependudukan (NIK)</span>
            <span class="profil-info-value" id="profil-info-nik">-</span>
          </div>
          <div class="profil-info-row">
            <span class="profil-info-label">Golongan Darah</span>
            <span class="profil-info-value" id="profil-info-goldar">-</span>
          </div>
        </div>
      </section>

      <section class="profil-menu-card">
        <button class="profil-menu-item" id="menu-keamanan-akun">
          <img src="assets/icons/icon-lock.svg" alt="" aria-hidden="true" class="profil-menu-icon" />
          <span class="profil-menu-text">Keamanan Akun</span>
          <img src="assets/icons/icon-arrow-right.svg" alt="" aria-hidden="true" class="profil-menu-chevron" />
        </button>
        <button class="profil-menu-item" id="menu-notifikasi">
          <img src="assets/icons/icon-bell.svg" alt="" aria-hidden="true" class="profil-menu-icon" />
          <span class="profil-menu-text">Notifikasi Kesehatan</span>
          <img src="assets/icons/icon-arrow-right.svg" alt="" aria-hidden="true" class="profil-menu-chevron" />
        </button>
        <button class="profil-menu-item" id="menu-pusat-bantuan">
          <img src="assets/icons/icon-email.svg" alt="" aria-hidden="true" class="profil-menu-icon" />
          <span class="profil-menu-text">Pusat Bantuan</span>
          <img src="assets/icons/icon-arrow-right.svg" alt="" aria-hidden="true" class="profil-menu-chevron" />
        </button>
        <button class="profil-menu-item" id="menu-tentang">
          <img src="assets/icons/icon-nav-profil.svg" alt="" aria-hidden="true" class="profil-menu-icon" />
          <span class="profil-menu-text">Tentang ZYTRAVA</span>
          <img src="assets/icons/icon-arrow-right.svg" alt="" aria-hidden="true" class="profil-menu-chevron" />
        </button>
        <div class="profil-menu-divider"></div>
        <button class="profil-menu-item profil-menu-logout" id="menu-keluar">
          <span class="profil-menu-text-logout">Keluar</span>
        </button>
      </section>

      <div class="profil-version">ZYTRAVA v1.0.0</div>
    </main>
    ${footerHTML("profil")}
  `;

  // Panggil setup event untuk Header (wajib biar tombol header nyala)
  setupHeaderEvents(); 
  
  // Panggil setup event untuk navigasi Footer
  setupFooterNav();    

  attachProfilEvents();
  loadProfilData();
}

function attachProfilEvents() {
  document.getElementById("profil-edit-btn")?.addEventListener("click", () => navigateTo("editProfil"));
  document.getElementById("menu-keamanan-akun")?.addEventListener("click", () => navigateTo("keamananAkun"));
  document.getElementById("menu-notifikasi")?.addEventListener("click", () => navigateTo("notifikasi"));
  document.getElementById("menu-pusat-bantuan")?.addEventListener("click", () => navigateTo("kebijakanPrivasi"));
  document.getElementById("menu-tentang")?.addEventListener("click", () => navigateTo("tentang"));
  
  // Perbaikannya di sini: Baris `document.getElementById("header-notif-btn")` SUDAH DIHAPUS 
  // agar tombol ikon orang di pojok kanan atas tidak nyasar ke notifikasi lagi.

  document.getElementById("menu-keluar")?.addEventListener("click", async () => {
    if (!confirm("Yakin mau keluar dari akun?")) return;
    await supabase.auth.signOut();
    navigateTo("login");
  });
}

function formatTanggalProfil(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function maskNikProfil(nik) {
  if (!nik || nik.length < 8) return "-";
  return `${nik.slice(0, 4)} ${nik.slice(4, 8)} **** ****`;
}

function genderLabelProfil(code) {
  if (code === "L") return "Laki-laki";
  if (code === "P") return "Perempuan";
  return "-";
}

async function loadProfilData() {
  const user = await getCurrentUser();
  if (!user) return;

  const { data: patient, error: patientError } = await supabase
    .from("patients")
    .select("id, full_name, nik, gender, date_of_birth, blood_type, avatar_url")
    .eq("registered_by", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (patientError || !patient) {
    console.error("Gagal ambil data pasien:", patientError);
    return;
  }

  document.getElementById("profil-name").textContent = patient.full_name ?? "-";
  document.getElementById("profil-info-nama").textContent = patient.full_name ?? "-";
  document.getElementById("profil-info-tgl-lahir").textContent = formatTanggalProfil(patient.date_of_birth);
  document.getElementById("profil-info-gender").textContent = genderLabelProfil(patient.gender);
  document.getElementById("profil-info-nik").textContent = maskNikProfil(patient.nik);
  document.getElementById("profil-info-goldar").textContent = patient.blood_type ?? "-";
  if (patient.avatar_url) {
    document.getElementById("profil-avatar").style.backgroundImage = `url("${patient.avatar_url}")`;
  }

  const { data: screenings, error: screeningError } = await supabase
    .from("screenings")
    .select("risk_level, ai_predicted_class, screened_at")
    .eq("patient_id", patient.id)
    .order("screened_at", { ascending: false });

  if (screeningError) {
    console.error("Gagal ambil riwayat skrining:", screeningError);
    return;
  }

  document.getElementById("profil-total-skrining").textContent = `${screenings.length} Kali`;

  if (screenings.length > 0) {
    const latest = screenings[0];
    document.getElementById("profil-status-risiko").textContent =
      RISK_LEVEL_LABEL[latest.risk_level] ?? latest.risk_level ?? "-";
    document.getElementById("profil-skrining-terakhir").textContent = formatTanggalProfil(latest.screened_at);
  } else {
    document.getElementById("profil-status-risiko").textContent = "Belum ada data";
    document.getElementById("profil-skrining-terakhir").textContent = "-";
  }
}