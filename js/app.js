// js/app.js — entry point, dijalankan pertama kali saat halaman dibuka

async function initApp() {
  // 1. Register service worker (syarat wajib PWA + offline)
  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register("/service-worker.js");
      console.log("Service worker terdaftar.");
    } catch (err) {
      console.warn("Gagal register service worker:", err);
    }
  }

  // 2. Coba sinkron data yang mungkin tertunda dari sesi offline sebelumnya
  trySyncPendingScreenings();

  // 3. Mulai dari splash screen. splash.js sendiri yang nanti mutusin
  //    lanjut ke "home" atau "login" berdasarkan status login user.
  navigateTo("splash");
}

document.addEventListener("DOMContentLoaded", initApp);
