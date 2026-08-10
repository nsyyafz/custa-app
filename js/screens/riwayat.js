// js/screens/riwayat.js -- daftar semua riwayat skrining user, bisa cari & filter
// Nama kolom di sini disesuaikan sama tabel `screenings` asli kamu:
// risk_level (bukan risk_category), screened_at (bukan created_at),
// ai_confidence_score, recommendation (teks rekomendasi udah kesimpen langsung).

let riwayatAllData = [];
let riwayatActiveFilter = "semua";

function renderRiwayatScreen(container) {
  container.innerHTML = `
    ${headerHTML()}
    <main class="riwayat-screen">
      <section class="riwayat-intro">
        <h1>Riwayat Skrining</h1>
        <p>Pantau perkembangan kesehatan kulit Anda dari waktu ke waktu.</p>
      </section>

      <div class="riwayat-search-wrap">
        <div class="riwayat-search-box">
          <span class="riwayat-search-icon">🔍</span>
          <input type="text" id="riwayatSearchInput" placeholder="Cari hasil skrining..." />
        </div>
        <div class="riwayat-filter-row">
          <button class="riwayat-chip active" data-filter="semua">Semua</button>
          <button class="riwayat-chip" data-filter="rendah">Risiko Rendah</button>
          <button class="riwayat-chip" data-filter="sedang">Risiko Sedang</button>
          <button class="riwayat-chip" data-filter="tinggi">Risiko Tinggi</button>
        </div>
      </div>

      <div class="riwayat-list" id="riwayatList">
        <p class="text-muted" style="padding:0 16px;">Memuat riwayat...</p>
      </div>
    </main>
    ${footerHTML("riwayat")}
  `;

  setupFooterNav();

  document.querySelectorAll(".riwayat-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".riwayat-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      riwayatActiveFilter = chip.dataset.filter;
      renderRiwayatList();
    });
  });

  document.getElementById("riwayatSearchInput").addEventListener("input", renderRiwayatList);

  loadRiwayatData();
}

async function loadRiwayatData() {
  const listEl = document.getElementById("riwayatList");
  try {
    const user = await getCurrentUser();
    const patientRecordId = await getPatientRecordId(user.id);

    const { data, error } = await supabase
      .from("screenings")
      .select("*")
      .eq("patient_id", patientRecordId)
      .order("screened_at", { ascending: false });

    if (error) throw error;
    riwayatAllData = data || [];
    renderRiwayatList();
  } catch (err) {
    console.warn("Gagal memuat riwayat:", err);
    listEl.innerHTML = `<p class="text-muted" style="padding:0 16px;">Belum bisa memuat riwayat (offline atau belum login).</p>`;
  }
}

function renderRiwayatList() {
  const listEl = document.getElementById("riwayatList");
  const searchTerm = (document.getElementById("riwayatSearchInput").value || "").toLowerCase();

  let filtered = riwayatAllData;
  if (riwayatActiveFilter !== "semua") {
    filtered = filtered.filter((r) => r.risk_level === riwayatActiveFilter);
  }
  if (searchTerm) {
    filtered = filtered.filter((r) => riwayatCardTitle(r).toLowerCase().includes(searchTerm));
  }

  if (filtered.length === 0) {
    listEl.innerHTML = `
      <div class="riwayat-empty">
        <div class="riwayat-empty-icon">🕒</div>
        <p>Belum ada riwayat skrining yang cocok.</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = filtered.map(riwayatCardHTML).join("");

  document.querySelectorAll(".riwayat-card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      const item = riwayatAllData.find((r) => String(r.id) === id);
      if (!item) return;
      // Rekonstruksi bentuk hasil biar bisa dipakai ulang di result.js
      window.__lastScreeningResult = {
        score: null, // tabel gak nyimpen skor numerik, cuma kategori akhirnya
        kategori: item.risk_level,
        aiConfidence: item.ai_confidence_score,
        answers: null, // detail jawaban kuesioner gak kesimpen full, cuma sebagian
        rekomendasi: item.recommendation || "",
        batasWaktu: "",
      };
      navigateTo("result");
    });
  });
}

function riwayatCardTitle(item) {
  return `Skrining ${new Date(item.screened_at).toLocaleDateString("id-ID")}`;
}

function riwayatCardDesc(item) {
  if (item.recommendation) return item.recommendation;
  const desc = {
    rendah: "Hasil evaluasi AI & Kuesioner menunjukkan tidak ada tanda-tanda signifikan.",
    sedang: "Ditemukan beberapa indikasi yang perlu diperiksa lebih lanjut.",
    tinggi: "Ditemukan indikasi kuat, disarankan segera periksa ke tenaga medis.",
  };
  return desc[item.risk_level] || "";
}

function riwayatCardHTML(item) {
  const date = new Date(item.screened_at).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `
    <div class="riwayat-card" data-id="${item.id}">
      <div class="riwayat-card-top">
        <span class="riwayat-card-date">${date}</span>
        <span class="risk-badge ${item.risk_level}">${(item.risk_level || "").toUpperCase()}</span>
      </div>
      <div class="riwayat-card-body">
        <div class="riwayat-card-thumb"></div>
        <div class="riwayat-card-text">
          <p class="riwayat-card-title">${riwayatCardTitle(item)}</p>
          <p class="riwayat-card-desc">${riwayatCardDesc(item)}</p>
        </div>
      </div>
      <div class="riwayat-card-footer">
        <span>Lihat Detail</span>
        <span>→</span>
      </div>
    </div>
  `;
}
