// js/screens/register.js
// Diadaptasi dari export Figma. Field yang dikumpulin form ini SENGAJA
// tidak sama persis dengan semua kolom tabel `patients` di Supabase --
// lihat catatan di bawah kode ini soal apa yang perlu disesuaikan.

function renderRegisterScreen(container) {
  container.innerHTML = `
    <div class="register-screen">
      <header class="header">
        <div class="badge">
          <img src="assets/icons/icon-badge.svg" alt="" aria-hidden="true" />
        </div>
        <h1 class="title">Buat Akun Anda</h1>
        <p class="subtitle">Mulai pantau kesehatan kulit Anda sejak dini hari ini.</p>
      </header>

      <form class="form" id="register-form">
        <div class="field-group">
          <label class="field-label" for="reg-fullname">Nama Lengkap</label>
          <div class="input-wrap">
            <input class="field-input" id="reg-fullname" type="text" placeholder="Jane Doe" autocomplete="name" required />
            <img class="field-icon-left" src="assets/icons/icon-user.svg" alt="" aria-hidden="true" />
          </div>
        </div>

        <div class="field-group">
          <label class="field-label" for="reg-nik">NIK <span class="optional">(Opsional)</span></label>
          <div class="input-wrap">
            <input class="field-input" id="reg-nik" type="text" placeholder="ID Number" autocomplete="off" />
            <img class="field-icon-left" src="assets/icons/icon-id-card.svg" alt="" aria-hidden="true" />
          </div>
        </div>

        <div class="field-group">
          <label class="field-label" for="reg-email">Alamat Email</label>
          <div class="input-wrap">
            <input class="field-input" id="reg-email" type="email" placeholder="jane@example.com" autocomplete="email" required />
            <img class="field-icon-left" src="assets/icons/icon-email.svg" alt="" aria-hidden="true" />
          </div>
        </div>

        <div class="field-group">
          <label class="field-label" for="reg-phone">Nomor Telepon</label>
          <div class="input-wrap">
            <input class="field-input" id="reg-phone" type="tel" placeholder="+62 812-0000-0000" autocomplete="tel" required />
            <img class="field-icon-left" src="assets/icons/icon-phone.svg" alt="" aria-hidden="true" />
          </div>
        </div>

        <div class="field-group">
          <label class="field-label" for="reg-password">Kata Sandi</label>
          <div class="input-wrap">
            <input class="field-input has-toggle" id="reg-password" type="password" placeholder="••••••••" autocomplete="new-password" required minlength="6" />
            <img class="field-icon-left" src="assets/icons/icon-lock.svg" alt="" aria-hidden="true" />
            <button class="toggle-password" type="button" id="btn-toggle-password" aria-label="Tampilkan kata sandi" aria-controls="reg-password" aria-pressed="false">
              <img src="assets/icons/icon-eye.svg" alt="" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div class="field-group">
          <label class="field-label" for="reg-confirm-password">Konfirmasi Kata Sandi</label>
          <div class="input-wrap">
            <input class="field-input has-toggle" id="reg-confirm-password" type="password" placeholder="••••••••" autocomplete="new-password" required minlength="6" />
            <img class="field-icon-left" src="assets/icons/icon-lock.svg" alt="" aria-hidden="true" />
            <button class="toggle-password" type="button" id="btn-toggle-confirm-password" aria-label="Tampilkan konfirmasi kata sandi" aria-controls="reg-confirm-password" aria-pressed="false">
              <img src="assets/icons/icon-eye.svg" alt="" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div class="terms-row">
          <input class="terms-checkbox" type="checkbox" id="reg-terms" required />
          <label class="terms-text" for="reg-terms">
            Saya setuju dengan <a href="#">Syarat &amp; Ketentuan</a> dan
            <a href="#">Kebijakan Privasi</a>.
          </label>
        </div>

        <button class="btn-submit" type="submit">
          Daftar
          <img src="assets/icons/icon-arrow-right.svg" alt="" aria-hidden="true" width="14" height="14" />
        </button>
      </form>

      <p class="register-error" id="registerError"></p>

      <p class="signin-row">
        Sudah punya akun? <a href="#" id="link-signin">Masuk</a>
      </p>

      <div class="register-success-overlay" id="successOverlay" role="dialog" aria-modal="true" aria-labelledby="success-heading" hidden>
        <div class="register-success-card">
          <h2 id="success-heading">Selamat Datang di ZYTRAVA</h2>
          <p>Akun Anda berhasil dibuat. Mari mulai pantau kesehatan kulit Anda.</p>
          <button type="button" id="btn-success-continue">Lanjutkan</button>
        </div>
      </div>
    </div>
  `;

  setupPasswordToggle("reg-password", "btn-toggle-password");
  setupPasswordToggle("reg-confirm-password", "btn-toggle-confirm-password");

  document.getElementById("link-signin").addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo("login");
  });

  document.getElementById("register-form").addEventListener("submit", handleRegisterSubmit);

  document.getElementById("btn-success-continue").addEventListener("click", () => {
    navigateTo("login"); // sementara ke login (nanti diganti ke screen verifikasi OTP)
  });
}

function setupPasswordToggle(inputId, buttonId) {
  const input = document.getElementById(inputId);
  const btn = document.getElementById(buttonId);
  btn.addEventListener("click", () => {
    const isVisible = input.type === "text";
    input.type = isVisible ? "password" : "text";
    btn.setAttribute("aria-pressed", String(!isVisible));
  });
}

async function handleRegisterSubmit(e) {
  e.preventDefault();
  const errorEl = document.getElementById("registerError");
  errorEl.textContent = "";

  const fullName = document.getElementById("reg-fullname").value.trim();
  const nik = document.getElementById("reg-nik").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const phone = document.getElementById("reg-phone").value.trim();
  const password = document.getElementById("reg-password").value;
  const confirmPassword = document.getElementById("reg-confirm-password").value;

  if (password !== confirmPassword) {
    errorEl.textContent = "Konfirmasi kata sandi tidak cocok.";
    return;
  }

  try {
    // 1. Buat akun di Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signUpError) throw signUpError;

    const newUserId = signUpData.user?.id;

    // 2. Buat baris di `profiles` -- ini yang nyimpen role & full_name
    //    tiap akun. Default role selalu "masyarakat" dari form register publik ini.
    const { error: profileError } = await supabase.from("profiles").insert({
      id: newUserId,
      role: "masyarakat",
      full_name: fullName,
    });
    if (profileError) throw profileError;

    // 3. Simpan data tambahan ke tabel `patients`
    //    (lihat catatan di bawah file ini soal kolom apa yang perlu disesuaikan di Supabase)
    const { error: insertError } = await supabase.from("patients").insert({
      full_name: fullName,
      phone_number: phone,
      nik: nik || null,
      registered_by: newUserId,
    });
    if (insertError) throw insertError;

    // 4. Tampilkan modal sukses
    document.getElementById("successOverlay").hidden = false;
  } catch (err) {
    errorEl.textContent = "Registrasi gagal: " + err.message;
  }
}
