// js/screens/splash.js
// Tampil sebentar (logo + loading indicator), lalu otomatis pindah ke
// "home" (kalau user sudah login) atau "login" (kalau belum).

const SPLASH_DURATION_MS = 1800;

function renderSplashScreen(container) {
  container.innerHTML = `
    <main class="splash-main" aria-label="Zytrava is loading" aria-busy="true">
      <section class="splash-background">
        <div class="splash-container">
          <figure class="splash-logo-container">
            <div class="splash-logo-wrap">
              <div class="splash-glow" aria-hidden="true"></div>
              <div class="splash-logo" role="img" aria-label="Zytrava logo"></div>
            </div>
          </figure>
          <div class="splash-loading-indicator" aria-hidden="true"></div>
        </div>
        <footer class="splash-tagline">
          <p class="splash-tagline-text">copyright2026</p>
        </footer>
      </section>
    </main>
  `;

  handleSplashRedirect();
}

async function handleSplashRedirect() {
  await new Promise((resolve) => setTimeout(resolve, SPLASH_DURATION_MS));
  navigateTo("login");
}
