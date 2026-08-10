// js/screens/login.js
// Diadaptasi dari export Figma (Anima). Class name aku sederhanain
// (container-2, div-wrapper, dst diganti nama yang jelas) tapi semua nilai
// warna/ukuran/spacing tetap sama persis kayak desain.

function renderLoginScreen(container) {
  container.innerHTML = `
    <div class="login-screen">
      <main class="main">
        <section class="background" aria-labelledby="login-heading">

          <header class="heading-block">
            <h1 class="heading" id="login-heading">SELAMAT<br>DATANG</h1>
            <p class="subheading">Masuk untuk melanjutkan<br>pemantauan kesehatan Anda.</p>
          </header>

          <form class="form" id="login-form">
            <div class="field-group">
              <label class="field-label-fg" for="input-email">Alamat Email</label>
              <div class="input-wrap">
                <input
                  class="field-input"
                  id="input-email"
                  name="email"
                  type="email"
                  placeholder="nama@contoh.com"
                  autocomplete="email"
                  inputmode="email"
                  required
                />
                <img class="field-icon-left" src="assets/icons/icon-email.svg" alt="" aria-hidden="true" />
              </div>
            </div>

            <div class="field-group">
              <label class="field-label-fg" for="input-password">Kata Sandi</label>
              <div class="input-wrap">
                <input
                  class="field-input has-toggle"
                  id="input-password"
                  name="password"
                  type="password"
                  placeholder="********"
                  autocomplete="current-password"
                  required
                />
                <img class="field-icon-left" src="assets/icons/icon-lock.svg" alt="" aria-hidden="true" />
                <button
                  class="toggle-password"
                  type="button"
                  id="btn-toggle-password"
                  aria-label="Tampilkan kata sandi"
                  aria-controls="input-password"
                  aria-pressed="false"
                >
                  <img src="assets/icons/icon-eye.svg" alt="" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div class="row-between">
              <label class="remember-label" for="remember-me">
                <input type="checkbox" id="remember-me" name="remember-me" />
                Ingat saya
              </label>
              <a class="link-teal" href="#" id="link-forgot-password">Lupa Kata Sandi?</a>
            </div>

            <button class="btn-submit" type="submit">
              Masuk
              <img src="assets/icons/icon-arrow-right.svg" alt="" aria-hidden="true" width="16" height="16" />
            </button>
          </form>

          <p class="login-error" id="loginError"></p>

          <div class="divider-row">
            <div class="divider-line"></div>
            <span class="divider-text">ATAU</span>
            <div class="divider-line"></div>
          </div>

          <button class="btn-google" type="button" id="btn-google">
            <img src="assets/icons/icon-google.svg" alt="" aria-hidden="true" />
            Lanjutkan dengan Google
          </button>

          <p class="signup-row">
            Belum punya akun?
            <a href="#" id="link-register">Daftar Sekarang</a>
          </p>

        </section>
      </main>
    </div>
  `;

  setupLoginPasswordToggle();
  setupLoginFormSubmit();

  document.getElementById("link-register").addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo("register");
  });

  document.getElementById("link-forgot-password").addEventListener("click", (e) => {
    e.preventDefault();
    alert("Halaman Lupa Kata Sandi belum tersedia, masih dalam pengerjaan.");
  });

  document.getElementById("btn-google").addEventListener("click", async () => {
    try {
      await supabase.auth.signInWithOAuth({ provider: "google" });
    } catch (err) {
      alert("Login Google gagal: " + err.message);
    }
  });
}

function setupLoginPasswordToggle() {
  const passwordInput = document.getElementById("input-password");
  const toggleBtn = document.getElementById("btn-toggle-password");

  toggleBtn.addEventListener("click", () => {
    const isVisible = passwordInput.type === "text";
    passwordInput.type = isVisible ? "password" : "text";
    toggleBtn.setAttribute("aria-pressed", String(!isVisible));
    toggleBtn.setAttribute(
      "aria-label",
      isVisible ? "Tampilkan kata sandi" : "Sembunyikan kata sandi"
    );
  });
}

function setupLoginFormSubmit() {
  const form = document.getElementById("login-form");
  const errorEl = document.getElementById("loginError");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.textContent = "";

    const email = document.getElementById("input-email").value;
    const password = document.getElementById("input-password").value;

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigateTo("home");
    } catch (err) {
      errorEl.textContent = "Login gagal: " + err.message;
    }
  });
}
