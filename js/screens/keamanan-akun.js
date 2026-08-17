// js/screens/keamanan-akun.js
// Ubah kata sandi (Supabase auth.updateUser) + hapus akun (danger zone).
// Tabel patients/screenings/dll tidak disentuh langsung di sini -
// penghapusan akun diasumsikan lewat RPC "delete_account" (server-side,
// karena butuh service role untuk hapus dari auth.users).

function renderKeamananAkunScreen(container) {
  container.innerHTML = `
    ${headerHTML({ variant: "back", title: "Keamanan Akun" })}
    <main class="keamanan-main">
      <div class="keamanan-intro">
        <h1 class="keamanan-title">Keamanan Akun</h1>
        <p class="keamanan-subtitle">Kelola kata sandi dan hapus akun Anda jika diperlukan.</p>
      </div>

      <section class="keamanan-card">
        <div class="keamanan-card-header">
          <div class="keamanan-card-icon">
            <img src="assets/icons/icon-lock.svg" alt="" aria-hidden="true" />
          </div>
          <div class="keamanan-card-heading">
            <h2 class="keamanan-card-title">Ubah Kata Sandi</h2>
            <p class="keamanan-card-desc">Perbarui kata sandi Anda secara berkala untuk menjaga keamanan akun.</p>
          </div>
        </div>

        <form id="form-ubah-sandi" class="keamanan-form">
          <div class="keamanan-field">
            <label class="keamanan-label" for="password-lama">Kata Sandi Saat Ini</label>
            <div class="keamanan-input-wrap">
              <input type="password" id="password-lama" class="keamanan-input" placeholder="Masukkan kata sandi saat ini" autocomplete="current-password" />
              <button type="button" class="keamanan-toggle-eye" data-target="password-lama" aria-label="Tampilkan kata sandi">
                <img src="assets/icons/icon-eye.svg" alt="" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div class="keamanan-field">
            <label class="keamanan-label" for="password-baru">Kata Sandi Baru</label>
            <div class="keamanan-input-wrap">
              <input type="password" id="password-baru" class="keamanan-input" placeholder="Masukkan kata sandi baru" autocomplete="new-password" />
              <button type="button" class="keamanan-toggle-eye" data-target="password-baru" aria-label="Tampilkan kata sandi">
                <img src="assets/icons/icon-eye.svg" alt="" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div class="keamanan-field">
            <label class="keamanan-label" for="password-konfirmasi">Konfirmasi Kata Sandi Baru</label>
            <div class="keamanan-input-wrap">
              <input type="password" id="password-konfirmasi" class="keamanan-input" placeholder="Ulangi kata sandi baru" autocomplete="new-password" />
              <button type="button" class="keamanan-toggle-eye" data-target="password-konfirmasi" aria-label="Tampilkan kata sandi">
                <img src="assets/icons/icon-eye.svg" alt="" aria-hidden="true" />
              </button>
            </div>
          </div>

          <p class="keamanan-error" id="keamanan-error" hidden></p>

          <button type="submit" class="btn-primary keamanan-submit" id="btn-simpan-sandi">
            Simpan Perubahan
          </button>
        </form>
      </section>

      <section class="keamanan-danger-card">
        <div class="keamanan-card-header">
          <div class="keamanan-danger-icon">
            <img src="assets/icons/icon-lock.svg" alt="" aria-hidden="true" />
          </div>
          <div class="keamanan-card-heading">
            <h2 class="keamanan-danger-title">Hapus Akun</h2>
            <p class="keamanan-card-desc">
              Menghapus akun akan menghapus seluruh data kesehatan dan riwayat skrining Anda secara permanen. Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
        </div>
        <button class="btn-danger-outline" id="btn-hapus-akun">Hapus Akun Saya</button>
      </section>
    </main>
  `;

  // Ini bagian yang ditambahkan agar tombol back berfungsi
  setupHeaderEvents({
    onBack: () => navigateTo("profil")
  });

  attachKeamananAkunEvents();
}

function attachKeamananAkunEvents() {
  document.querySelectorAll(".keamanan-toggle-eye").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = document.getElementById(btn.dataset.target);
      if (input) input.type = input.type === "password" ? "text" : "password";
    });
  });

  const form = document.getElementById("form-ubah-sandi");
  const errorEl = document.getElementById("keamanan-error");
  const submitBtn = document.getElementById("btn-simpan-sandi");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.hidden = true;

    const sandiLama = document.getElementById("password-lama").value;
    const sandiBaru = document.getElementById("password-baru").value;
    const sandiKonfirmasi = document.getElementById("password-konfirmasi").value;

    if (!sandiLama || !sandiBaru || !sandiKonfirmasi) {
      errorEl.textContent = "Semua kolom wajib diisi.";
      errorEl.hidden = false;
      return;
    }
    if (sandiBaru.length < 8) {
      errorEl.textContent = "Kata sandi baru minimal 8 karakter.";
      errorEl.hidden = false;
      return;
    }
    if (sandiBaru !== sandiKonfirmasi) {
      errorEl.textContent = "Konfirmasi kata sandi tidak cocok.";
      errorEl.hidden = false;
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Menyimpan...";

    const { error } = await supabase.auth.updateUser({ password: sandiBaru });

    submitBtn.disabled = false;
    submitBtn.textContent = "Simpan Perubahan";

    if (error) {
      errorEl.textContent = "Gagal mengubah kata sandi: " + error.message;
      errorEl.hidden = false;
      return;
    }

    alert("Kata sandi berhasil diubah.");
    form.reset();
  });

  document.getElementById("btn-hapus-akun")?.addEventListener("click", async () => {
    const konfirmasi = confirm(
      "Yakin ingin menghapus akun? Seluruh data kesehatan dan riwayat skrining Anda akan dihapus permanen dan tidak bisa dikembalikan."
    );
    if (!konfirmasi) return;

    const { error } = await supabase.rpc("delete_account");

    if (error) {
      alert("Gagal menghapus akun: " + error.message);
      return;
    }

    await supabase.auth.signOut();
    navigateTo("login");
  });
}