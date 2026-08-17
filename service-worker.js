// service-worker.js
// Tugas: (1) cache file statis biar app tetap kebuka pas offline
//        (2) jadi syarat wajib biar browser anggap ini PWA yang "installable"

const CACHE_NAME = "zytrava-cache-v2";

// Daftar file yang WAJIB ada biar shell aplikasi tetap jalan tanpa internet.
// Tambahin path lain (screen baru, gambar, dll) di sini kalau kamu bikin file baru.
const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
  "/css/style.css",
  "/css/profil.css",
  "/css/keamanan-akun.css",
  "/css/edit-profil.css",
  "/css/tentang.css",
  "/css/kebijakan-privasi.css",
  "/css/notifikasi.css",
  "/css/beri-penilaian.css",
  "/js/app.js",
  "/js/router.js",
  "/js/supabaseClient.js",
  "/js/db/offlineStore.js",
  "/js/ai/dermaai.js",
  "/js/cdss/cdssEngine.js",
  "/js/components/header.js",
  "/js/components/footer.js",
  "/js/screens/login.js",
  "/js/screens/register.js",
  "/js/screens/splash.js",
  "/js/screens/home.js",
  "/js/screens/scan.js",
  "/js/screens/kuesioner.js",
  "/js/screens/analisis.js",
  "/js/screens/result.js",
  "/js/screens/riwayat.js",
  "/js/screens/puskesmas.js",
  "/js/screens/profil.js",
  "/js/screens/keamanan-akun.js",
  "/js/screens/edit-profil.js",
  "/js/screens/tentang.js",
  "/js/screens/kebijakan-privasi.js",
  "/js/screens/notifikasi.js",
  "/js/screens/beri-penilaian.js",
  "/js/screens/mentor-medis.js",
  "/js/screens/edukasi.js",
  "/js/screens/detail-edukasi.js",
  "/js/screens/artikel.js",
];

// Saat SW pertama kali diinstall -> simpan semua file app shell ke cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Saat SW versi baru aktif -> hapus cache versi lama
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Strategi fetch: coba jaringan dulu (biar data selalu fresh kalau online),
// kalau gagal (offline) -> ambil dari cache.
self.addEventListener("fetch", (event) => {
  // Jangan intercept request ke Supabase / API luar, biarkan itu gagal wajar
  // dan ditangani oleh offlineStore.js (disimpan ke IndexedDB dulu).
  if (event.request.url.includes("supabase.co")) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(event.request);
        return cached || new Response("", { status: 504, statusText: "Offline dan tidak ada di cache" });
      })
  );
});
