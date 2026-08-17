// js/screens/beri-penilaian.js
// Form rating aplikasi 1-5 bintang + feedback opsional, insert ke app_ratings.
// patient_id diambil lewat getPatientRecordId(user.id) dari supabaseClient.js.

let beriPenilaianSelectedRating = 0;

function starBtnHTML(value) {
  return `
    <button class="star-btn" data-value="${value}" aria-label="Beri ${value} bintang">
      <img src="assets/icons/icon-star-outline.svg" alt="" aria-hidden="true" class="star-icon" />
    </button>
  `;
}

function renderBeriPenilaianScreen(container) {
  beriPenilaianSelectedRating = 0;

  container.innerHTML = `
    ${headerHTML({ variant: "back", title: "Penilaian Aplikasi" })}
    <main class="rating-main">
      <div class="rating-card">
        <h2 class="rating-title">Beri Nilai Aplikasi</h2>
        <p class="rating-subtitle">
          Bantu kami untuk terus meningkatkan pengalaman Anda.
          Bagaimana penilaian Anda hari ini?
        </p>

        <div class="rating-avatar">
          <img src="assets/zytrava-logo.png" alt="ZYTRAVA" />
        </div>

        <div class="rating-stars" id="rating-stars">
          ${[1, 2, 3, 4, 5].map(starBtnHTML).join("")}
        </div>

        <div class="rating-feedback">
          <label class="rating-feedback-label" for="rating-feedback-text">
            Ada masukan tambahan? (Opsional)
          </label>
          <textarea
            id="rating-feedback-text"
            class="rating-feedback-textarea"
            placeholder="Ceritakan pengalaman Anda..."
          ></textarea>
        </div>

        <div class="rating-actions">
          <button class="btn-primary" id="rating-submit-btn" disabled>
            Kirim Penilaian
          </button>
          <button class="btn-text" id="rating-skip-btn">
            Nanti Saja
          </button>
        </div>
      </div>
    </main>
  `;
    setupHeaderEvents({ onBack: () => navigateTo("tentang") });
  attachBeriPenilaianEvents();
}

function attachBeriPenilaianEvents() {
  const stars = document.querySelectorAll(".star-btn");
  const submitBtn = document.getElementById("rating-submit-btn");

  function paintStars(upTo) {
    stars.forEach((btn) => {
      btn.classList.toggle("star-filled", Number(btn.dataset.value) <= upTo);
    });
  }

  stars.forEach((btn) => {
    btn.addEventListener("click", () => {
      beriPenilaianSelectedRating = Number(btn.dataset.value);
      paintStars(beriPenilaianSelectedRating);
      submitBtn.disabled = beriPenilaianSelectedRating === 0;
    });
    btn.addEventListener("mouseenter", () => paintStars(Number(btn.dataset.value)));
    btn.addEventListener("mouseleave", () => paintStars(beriPenilaianSelectedRating));
  });

  submitBtn.addEventListener("click", async () => {
    if (beriPenilaianSelectedRating === 0) return;
    const feedback = document.getElementById("rating-feedback-text").value.trim();

    submitBtn.disabled = true;
    submitBtn.textContent = "Mengirim...";

    const user = await getCurrentUser();
    let patientId = null;

    if (user) {
      try {
        patientId = await getPatientRecordId(user.id);
      } catch (err) {
        console.error("Gagal ambil patient id untuk rating:", err);
      }
    }

    const { error } = await supabase.from("app_ratings").insert({
      patient_id: patientId,
      rating: beriPenilaianSelectedRating,
      feedback: feedback || null,
    });

    if (error) {
      alert("Gagal mengirim penilaian. Coba lagi ya.");
      submitBtn.disabled = false;
      submitBtn.textContent = "Kirim Penilaian";
      return;
    }

    navigateTo("profil");
  });

  document.getElementById("rating-skip-btn")?.addEventListener("click", () => navigateTo("profil"));
}