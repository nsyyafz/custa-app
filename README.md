# Zytrava — Starter PWA

Struktur project ini:

```
zytrava-app/
├── index.html              ← shell utama, semua screen di-render ke sini
├── manifest.json           ← identitas PWA (nama, warna, icon)
├── service-worker.js       ← cache offline
├── css/
│   └── style.css           ← tema warna & komponen (sesuaikan ke Figma kamu)
├── js/
│   ├── app.js               ← entry point, jalan pertama kali
│   ├── router.js             ← pindah antar screen
│   ├── supabaseClient.js     ← koneksi ke Supabase (isi API key kamu di sini)
│   ├── db/offlineStore.js    ← IndexedDB, buat mode offline
│   ├── ai/dermaai.js         ← load & jalankan model Edge AI di browser
│   ├── cdss/cdssEngine.js    ← rule-based scoring risiko
│   └── screens/
│       ├── login.js
│       ├── home.js
│       ├── screening.js      ← kuesioner + kamera + trigger AI
│       └── result.js
├── assets/icons/            ← taruh icon-192.png & icon-512.png di sini
└── model/                    ← taruh hasil konversi TensorFlow.js di sini
```

## 1. Cara Jalankan di VS Code

1. Install extension **Live Server** (by Ritwick Dey).
2. Klik kanan `index.html` → **Open with Live Server**.
3. Buka Chrome DevTools (`F12`) → tab **Console**, buat lihat log/error.

## 2. Isi Kredensial Supabase

Buka `js/supabaseClient.js`, ganti:

```js
const SUPABASE_URL = "https://xxxxxxxxxxxx.supabase.co";
const SUPABASE_ANON_KEY = "paste-anon-key-di-sini";
```

Ambil dari **Supabase Dashboard → Project Settings → API** (pakai `anon public` key, JANGAN `service_role`).

## 3. Struktur Tabel yang Diasumsikan

Kode ini asumsi tabel Supabase kamu kira-kira begini (sesuaikan nama kolom kalau beda):

- `screenings`: `id, patient_id, risk_category, risk_score, ai_confidence, questionnaire (jsonb), lesion_photo_url, created_at`
- `health_facilities`: `id, name, lat, lng, address`
- `profiles`: mengikuti `auth.users` Supabase

Kalau nama kolom kamu beda, tinggal sesuaikan di `js/supabaseClient.js` dan `js/screens/home.js`.

## 4. Konversi Model AI (dari app.py kamu ke browser)

Model kamu sekarang format `.keras` — browser tidak bisa baca ini langsung.
Jalankan di komputer kamu (bukan di VS Code project ini), di environment Python yang sama tempat kamu training:

```bash
pip install tensorflowjs
tensorflowjs_converter --input_format=keras \
    model_kusta_final.keras \
    ./model
```

Ini menghasilkan folder `model/` isi `model.json` + beberapa file `.bin`.
Copy folder itu ke `zytrava-app/model/`.

**Kalau belum sempat konversi**, jangan panik — `js/ai/dermaai.js` otomatis fallback ke
**mode mock** (confidence acak) supaya alur screening → CDSS → hasil tetap bisa didemokan.
Nanti tinggal ganti begitu model sudah dikonversi, tidak perlu ubah kode lain.

## 5. Icon PWA

Taruh 2 file PNG di `assets/icons/`:
- `icon-192.png` (192x192)
- `icon-512.png` (512x512)

Bisa generate cepat dari logo Figma kamu lewat situs seperti realfavicongenerator.net.

## 6. Urutan Ngetes yang Disarankan

1. Buka app → harus otomatis ke halaman **Login**.
2. Coba **Daftar** akun baru → cek juga di Supabase Dashboard → Authentication.
3. Login → harus masuk ke **Home**.
4. Klik **Mulai Skrining** → isi kuesioner → buka kamera / upload foto → **Analisis**.
5. Harus pindah ke halaman **Hasil** dengan kategori risiko + rekomendasi.
6. Buka DevTools → tab **Application** → cek **Manifest** & **Service Workers** kedeteksi.
7. Tes offline: DevTools → tab **Network** → centang **Offline** → ulangi langkah 4,
   hasil skrining harus tetap tersimpan (cek IndexedDB di tab **Application**), lalu
   uncheck offline → cek otomatis kesinkron ke Supabase.

## 7. Yang Masih Perlu Kamu Bangun Lanjut

- Body location selection (peta tubuh) sebelum ambil foto — sekarang masih langsung ke kamera
- Halaman fasilitas terdekat pakai Leaflet.js (sekarang masih `alert()` sederhana)
- Dashboard Puskesmas (versi web terpisah, biasanya project HTML lain / route lain)
- Preprocessing foto (crop/normalisasi cahaya) sebelum masuk ke `dermaai.js`
- Notifikasi/reminder (Web Notification API)
# custa-app
