// js/screens/kuesioner.js
// Step 3 dari 4 di alur skrining. Kumpulin 8 jawaban, lalu lanjut ke Analisis.
// Catatan: judul header di desain aslinya tertulis "Notifikasi Kesehatan" --
// sepertinya kepakai gak sengaja dari komponen lain, di sini aku pakai
// "Kuesioner Skrining" (kasih tau kalau itu ternyata disengaja).

const KUESIONER_QUESTIONS = [
  {
    id: "durasi",
    text: "Sudah berapa lama bercak muncul?",
    type: "radio",
    options: [
      { value: "kurang_1_bulan", label: "< 1 bulan" },
      { value: "1_6_bulan", label: "1–6 bulan" },
      { value: "lebih_6_bulan", label: "> 6 bulan" },
    ],
  },
  { id: "matiRasa", text: "Apakah bercak terasa mati rasa?", type: "toggle" },
  { id: "gatal", text: "Apakah bercak terasa gatal?", type: "toggle" },
  { id: "nyeri", text: "Apakah bercak terasa nyeri?", type: "toggle" },
  { id: "membesar", text: "Apakah ukuran bercak bertambah besar?", type: "toggle" },
  {
    id: "riwayatKeluarga",
    text: "Apakah ada anggota keluarga atau orang serumah yang pernah menderita kusta?",
    type: "radio",
    options: [
      { value: "ya", label: "Ya" },
      { value: "tidak", label: "Tidak" },
      { value: "tidak_tahu", label: "Tidak Tahu" },
    ],
  },
  {
    id: "riwayatPengobatan",
    text: "Apakah Anda pernah menjalani pengobatan untuk bercak ini?",
    type: "radio",
    options: [
      { value: "belum_pernah", label: "Belum Pernah" },
      { value: "sedang_berobat", label: "Sedang Berobat" },
      { value: "sudah_pernah", label: "Sudah Pernah" },
    ],
  },
  {
    id: "jumlahBercak",
    text: "Apakah terdapat lebih dari satu bercak?",
    type: "radio",
    options: [
      { value: "satu", label: "Satu" },
      { value: "2_5", label: "2–5" },
      { value: "lebih_5", label: "Lebih dari 5" },
    ],
  },
];

function renderKuesionerScreen(container) {
  if (!window.__screeningPhoto) {
    // Jaga-jaga kalau user nyasar ke sini tanpa foto dulu
    navigateTo("scan");
    return;
  }

  container.innerHTML = `
    ${headerHTML({ variant: "back", title: "Kuesioner Skrining" })}
    <main class="kuesioner-screen">

      <section class="kuesioner-intro">
        <p class="kuesioner-desc">Mohon isi beberapa pertanyaan berikut untuk membantu analisis kondisi kulit Anda.</p>
        <div class="kuesioner-progress-row">
          <span>LANGKAH 3 DARI 4</span>
          <span class="progress-percent">75%</span>
        </div>
        <div class="progress-track"><div class="progress-fill" style="width:75%"></div></div>
      </section>

      <div class="kuesioner-info-card">
        <span class="kuesioner-info-icon">ℹ️</span>
        <p>Jawaban Anda membantu meningkatkan ketepatan rekomendasi skrining.</p>
      </div>

      <form id="kuesionerForm" class="kuesioner-form">
        ${KUESIONER_QUESTIONS.map(renderQuestionCard).join("")}
      </form>

      <div class="kuesioner-summary-card">
        <div class="summary-thumb" id="summaryThumb"></div>
        <div class="summary-info">
          <p class="summary-label">FOTO TARGET</p>
          <p class="summary-title">Lesi Kulit</p>
          <p class="summary-status">✓ Siap Diproses</p>
        </div>
      </div>

    </main>

    <div class="sticky-bottom-cta">
      <button class="btn-block-primary" id="btnLanjutAnalisis">Lanjutkan Analisis</button>
    </div>
  `;

  setupHeaderEvents({ onBack: () => navigateTo("scan") });

  // Preview thumbnail foto yang udah diambil di screen sebelumnya
  const thumb = document.getElementById("summaryThumb");
  const photo = window.__screeningPhoto;
  const src = photo.toDataURL ? photo.toDataURL("image/jpeg") : photo.src;
  thumb.style.backgroundImage = `url(${src})`;

  document.getElementById("btnLanjutAnalisis").addEventListener("click", handleKuesionerSubmit);
}

function renderQuestionCard(q) {
  if (q.type === "toggle") {
    return `
      <div class="q-card q-toggle-card">
        <p class="q-text">${q.text}</p>
        <label class="q-switch">
          <input type="checkbox" name="${q.id}" />
          <span class="q-switch-track"><span class="q-switch-thumb"></span></span>
        </label>
      </div>
    `;
  }

  return `
    <div class="q-card">
      <p class="q-text">${q.text}</p>
      <div class="q-options">
        ${q.options
          .map(
            (opt, i) => `
          <label class="q-option">
            <input type="radio" name="${q.id}" value="${opt.value}" ${i === 0 ? "" : ""} />
            <span class="q-radio-dot"></span>
            <span>${opt.label}</span>
          </label>
        `
          )
          .join("")}
      </div>
    </div>
  `;
}

function collectKuesionerAnswers() {
  const form = document.getElementById("kuesionerForm");
  const answers = {};
  KUESIONER_QUESTIONS.forEach((q) => {
    if (q.type === "toggle") {
      answers[q.id] = form.elements[q.id].checked;
    } else {
      const checked = form.querySelector(`input[name="${q.id}"]:checked`);
      answers[q.id] = checked ? checked.value : null;
    }
  });
  return answers;
}

function handleKuesionerSubmit() {
  const answers = collectKuesionerAnswers();
  window.__screeningAnswers = answers;
  navigateTo("analisis");
}
