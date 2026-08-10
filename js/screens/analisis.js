// js/screens/analisis.js -- sesuai desain Figma "Analisis Sedang Berlangsung"
// 4 tahap ditampilin berurutan, disinkronkan sama proses AI+CDSS beneran di baliknya.

const ANALISIS_STEPS = [
  { key: "foto", label: "Menganalisis Foto Lesi" },
  { key: "kuesioner", label: "Memproses Jawaban Kuesioner" },
  { key: "gabung", label: "Menggabungkan Analisis AI dan Data Klinis" },
  { key: "rekomendasi", label: "Menyusun Rekomendasi" },
];

function renderAnalisisScreen(container) {
  if (!window.__screeningPhoto || !window.__screeningAnswers) {
    navigateTo("scan");
    return;
  }

  container.innerHTML = `
    ${headerHTML({ variant: "back", title: "Proses Analisis" })}
    <main class="analisis-screen">
      <div class="analisis-hero">
        <h1>Analisis Sedang Berlangsung</h1>
        <p>Mohon tunggu beberapa saat. Sistem sedang menganalisis foto lesi dan jawaban kuesioner Anda.</p>
      </div>

      <div class="analisis-ring-wrap">
        <div class="analisis-ring">
          <svg viewBox="0 0 100 100" class="analisis-ring-svg">
            <circle cx="50" cy="50" r="45" class="analisis-ring-track" />
            <circle cx="50" cy="50" r="45" class="analisis-ring-progress" id="ringProgress" />
          </svg>
          <div class="analisis-ring-center">🩺</div>
        </div>
      </div>

      <div class="analisis-disclaimer">
        <span>ℹ️</span>
        <p>Hasil ini merupakan skrining awal dan bukan diagnosis akhir. Selalu konsultasikan dengan tenaga medis profesional.</p>
      </div>

      <div class="analisis-steps-card">
        <ul class="analisis-steps-list" id="analisisStepsList">
          ${ANALISIS_STEPS.map(
            (s) => `<li class="analisis-step" data-step="${s.key}">
              <span class="analisis-step-icon">○</span>
              <span class="analisis-step-label">${s.label}</span>
            </li>`
          ).join("")}
        </ul>
        <div class="analisis-progress-track">
          <div class="analisis-progress-fill" id="analisisProgressFill"></div>
        </div>
      </div>
    </main>
  `;

  setupHeaderEvents({ onBack: () => navigateTo("kuesioner") });
  runAnalysis();
}

function setStepState(stepKey, state) {
  // state: "active" | "done"
  const li = document.querySelector(`.analisis-step[data-step="${stepKey}"]`);
  if (!li) return;
  const icon = li.querySelector(".analisis-step-icon");
  li.classList.remove("is-active", "is-done");
  if (state === "active") {
    li.classList.add("is-active");
    icon.textContent = "●";
  } else if (state === "done") {
    li.classList.add("is-done");
    icon.textContent = "✓";
  }
}

function setProgress(percent) {
  const fill = document.getElementById("analisisProgressFill");
  if (fill) fill.style.width = percent + "%";
  const ring = document.getElementById("ringProgress");
  if (ring) {
    const circumference = 2 * Math.PI * 45;
    ring.style.strokeDasharray = circumference;
    ring.style.strokeDashoffset = circumference - (percent / 100) * circumference;
  }
}

async function runAnalysis() {
  try {
    // Tahap 1: analisis foto (Edge AI beneran jalan di sini)
    setStepState("foto", "active");
    setProgress(10);
    const aiResultPromise = predictLesionImage(window.__screeningPhoto);
    await new Promise((r) => setTimeout(r, 900));
    setStepState("foto", "done");
    setProgress(30);

    // Tahap 2: proses kuesioner
    setStepState("kuesioner", "active");
    await new Promise((r) => setTimeout(r, 700));
    setStepState("kuesioner", "done");
    setProgress(55);

    // Tahap 3: gabungkan AI + CDSS
    setStepState("gabung", "active");
    const aiResult = await aiResultPromise;
    const cdssResult = runCDSS(aiResult.leprosy, window.__screeningAnswers);
    await new Promise((r) => setTimeout(r, 700));
    setStepState("gabung", "done");
    setProgress(80);

    // Tahap 4: susun rekomendasi + simpan
    setStepState("rekomendasi", "active");

    const user = await getCurrentUser().catch(() => null);
    let patientRecordId = null;
    try {
      patientRecordId = user ? await getPatientRecordId(user.id) : null;
    } catch (err) {
      console.warn("Gagal ambil data pasien:", err);
    }

    // PENTING: nama kolom di sini disesuaikan sama tabel `screenings` kamu yang
    // sebenarnya (bukan asumsi lama aku). Kolom kuesioner yang gak ada tempatnya
    // di tabel (gatal, nyeri, membesar, riwayatPengobatan, jumlahBercak) tetap
    // dipakai buat hitung CDSS di atas, tapi gak ikut disimpan -- kalau kamu mau
    // semuanya kesimpen, tabelnya perlu ditambah kolom lagi (bilang aja).
    const answers = window.__screeningAnswers;
    const basePayload = {
      patient_id: patientRecordId,
      performed_by: user?.id ?? null,
      photo_url: null, // TODO: upload ke Supabase Storage, belum diimplementasi
      ai_confidence_score: aiResult.leprosy,
      ai_predicted_class: aiResult.leprosy > 0.5 ? "leprosy" : "non_leprosy",
      lesion_duration_days: mapDurasiToDays(answers.durasi),
      has_numbness: !!answers.matiRasa,
      has_close_contact_history: answers.riwayatKeluarga === "ya",
      lives_in_endemic_area: null, // belum ditanyain di kuesioner sekarang
      risk_level: cdssResult.kategori,
      recommendation: cdssResult.rekomendasi,
      location: null,
      location_consent: false,
    };

    try {
      await saveScreeningResult({
        ...basePayload,
        sync_status: "synced",
        screened_at: new Date().toISOString(),
        synced_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn("Offline, simpan lokal dulu:", err);
      await queueScreeningLocally({
        ...basePayload,
        sync_status: "local_only",
        screened_at: new Date().toISOString(),
        synced_at: null,
      });
    }

    await new Promise((r) => setTimeout(r, 500));
    setStepState("rekomendasi", "done");
    setProgress(100);

    window.__lastScreeningResult = cdssResult;
    window.__screeningPhoto = null;
    window.__screeningAnswers = null;

    await new Promise((r) => setTimeout(r, 400));
    navigateTo("result");
  } catch (err) {
    alert("Gagal menganalisis: " + err.message);
    navigateTo("kuesioner");
  }
}

// Kuesioner nanya rentang waktu (kategori), bukan jumlah hari persis --
// ini konversi kasar biar bisa masuk ke kolom lesion_duration_days (integer).
function mapDurasiToDays(durasi) {
  const map = { kurang_1_bulan: 15, "1_6_bulan": 90, lebih_6_bulan: 200 };
  return map[durasi] ?? null;
}
