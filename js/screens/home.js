// js/screens/home.js -- Beranda/Dashboard sesuai export Figma.
// Sebagian besar konten statis (edukasi, artikel, dsb), yang dinamis:
// sapaan waktu, nama user, dan status skrining terakhir.

function renderHomeScreen(container) {
  container.innerHTML = `
    ${headerHTML()}
    <main class="beranda-screen">

      <section class="greeting">
        <p class="greeting-eyebrow" id="greetingText">Selamat Datang 👋</p>
        <p class="greeting-name" id="greetingName">Halo!</p>
      </section>

      <section class="health-status-card">
        <h2 id="statusHeading">Status Kesehatan Kulit:<br>Belum Melakukan Skrining</h2>
        <p>Yuk lakukan skrining untuk mengetahui kondisi kesehatan kulit Anda.</p>
        <button class="btn-start-screening" id="btnStartScreeningMain">Mulai Skrining</button>
      </section>

      <section class="quick-menu">
        <button class="quick-item" data-action="scan">
          <span class="quick-icon quick-icon-teal">🩺</span>
          <span>Mulai Skrining</span>
        </button>
        <button class="quick-item" data-action="facility">
          <span class="quick-icon quick-icon-blue">📍</span>
          <span>Fasilitas Kesehatan</span>
        </button>
        <button class="quick-item" data-action="edukasi">
          <span class="quick-icon quick-icon-green">📖</span>
          <span>Edukasi</span>
        </button>
        <button class="quick-item" data-action="artikel">
          <span class="quick-icon quick-icon-dark">📰</span>
          <span>Artikel</span>
        </button>
      </section>

      <section class="tahukah-card">
        <div class="tahukah-icon">💡</div>
        <div class="tahukah-body">
          <p>Kusta dapat disembuhkan apabila terdeteksi sejak dini.</p>
          <button class="link-btn" data-action="edukasi">Pelajari Selengkapnya</button>
        </div>
      </section>

      <section class="cara-skrining">
        <h3>Cara Melakukan Skrining</h3>
        <div class="cara-card">
          <div class="cara-steps">
            <div class="cara-step"><span class="cara-step-icon">📷</span><span>Foto Lesi</span></div>
            <div class="cara-step"><span class="cara-step-icon">📝</span><span>Isi Kuesioner</span></div>
            <div class="cara-step"><span class="cara-step-icon">🤖</span><span>Hasil AI</span></div>
            <div class="cara-step"><span class="cara-step-icon">✅</span><span>Rekomendasi</span></div>
          </div>
          <button class="btn-outline-block" data-action="panduan">Lihat Panduan</button>
        </div>
      </section>

      <section class="articles-section">
        <div class="section-header-row">
          <h3>Artikel Kesehatan</h3>
          <button class="link-btn" data-action="artikel">Lihat Semua</button>
        </div>
        <div class="articles-scroll">
          <article class="article-card">
            <div class="article-thumb"></div>
            <p class="article-tag">Edukasi • 3 min baca</p>
            <p class="article-title">Mengenal Gejala Awal Kusta</p>
          </article>
          <article class="article-card">
            <div class="article-thumb"></div>
            <p class="article-tag">Informasi • 5 min baca</p>
            <p class="article-title">Cara Membedakan Panu dan Kusta</p>
          </article>
        </div>
      </section>

      <section class="education-cta-card">
        <div>
          <h3>Belajar Bersama<br>Zytrava</h3>
          <button class="btn-white-pill" data-action="edukasi">Mulai Belajar</button>
        </div>
        <div class="education-emoji">👨‍⚕️</div>
      </section>

      <section class="facility-section">
        <h3>Fasilitas Kesehatan Terdekat</h3>
        <div class="facility-card">
          <div class="facility-thumb"></div>
          <div class="facility-info">
            <p class="facility-name">Puskesmas Terdekat</p>
            <p class="facility-meta">2.5 km • Buka hingga 16:00</p>
          </div>
          <button class="facility-arrow" data-action="facility">→</button>
        </div>
      </section>

      <section class="activity-section">
        <div class="section-header-row">
          <h3>Aktivitas Terakhir</h3>
          <button class="link-btn" data-action="riwayat">Lihat Semua</button>
        </div>
        <div id="activityContent" class="activity-empty">
          <div class="activity-empty-icon">🕒</div>
          <p>Belum ada riwayat skrining.</p>
        </div>
      </section>

    </main>
    ${footerHTML("beranda")}
  `;

  // 👇 Ini perbaikannya: panggil setupHeaderEvents agar tombol header nyala
  setupHeaderEvents(); 
  
  setupFooterNav();
  setGreeting();
  wireQuickActions();
  loadHomeData();

  document.getElementById("btnStartScreeningMain")?.addEventListener("click", () => navigateTo("scan"));
}

function setGreeting() {
  const hour = new Date().getHours();
  const eyebrow =
    hour < 11 ? "Selamat Pagi 👋" :
    hour < 15 ? "Selamat Siang 👋" :
    hour < 18 ? "Selamat Sore 👋" : "Selamat Malam 👋";
  document.getElementById("greetingText").textContent = eyebrow;
}

function wireQuickActions() {
  document.querySelectorAll("[data-action]").forEach((el) => {
    el.addEventListener("click", () => {
      const action = el.dataset.action;
      if (action === "scan") navigateTo("scan");
      else if (action === "facility") navigateTo("puskesmas");
      else if (action === "riwayat") navigateTo("riwayat");
      else alert("Fitur ini belum tersedia, masih dalam pengerjaan.");
    });
  });
}

async function loadHomeData() {
  try {
    const user = await getCurrentUser();
    if (user) {
      const { data } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
      if (data?.full_name) {
        document.getElementById("greetingName").textContent = `Halo, ${data.full_name.split(" ")[0]}`;
      }
    }
  } catch (e) { /* belum login / gagal fetch -- biarin default */ }

  try {
    const user = await getCurrentUser();
    const patientRecordId = await getPatientRecordId(user.id);
    const { data, error } = await supabase
      .from("screenings")
      .select("*")
      .eq("patient_id", patientRecordId)
      .order("screened_at", { ascending: false })
      .limit(1);

    if (!error && data && data.length > 0) {
      const last = data[0];
      document.getElementById("statusHeading").innerHTML =
        `Status Kesehatan Kulit:<br>Risiko ${last.risk_level}`;

      const activityEl = document.getElementById("activityContent");
      activityEl.classList.remove("activity-empty");
      activityEl.innerHTML = `
        <div class="activity-item">
          <span class="risk-badge ${last.risk_level}">${last.risk_level}</span>
          <span class="text-muted">${new Date(last.screened_at).toLocaleDateString("id-ID")}</span>
        </div>
      `;
    }
  } catch (e) { /* belum ada riwayat -- biarin empty state */ }
}