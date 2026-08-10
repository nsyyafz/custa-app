// js/db/offlineStore.js
// Nyimpen hasil skrining ke IndexedDB dulu (biar tetap jalan tanpa internet),
// baru disinkron ke Supabase begitu koneksi kembali online.

const DB_NAME = "zytrava-offline";
const STORE_NAME = "pending_screenings";

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "localId", autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// Simpan hasil screening secara lokal dulu
async function queueScreeningLocally(screeningData) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).add(screeningData);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

// Ambil semua data yang masih nunggu buat disinkron
async function getPendingScreenings() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function clearPendingScreening(localId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(localId);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

// Dipanggil setiap kali app dibuka / setiap event "online"
async function trySyncPendingScreenings() {
  if (!navigator.onLine) return;

  const pending = await getPendingScreenings();
  for (const item of pending) {
    try {
      const { localId, ...payload } = item;
      await saveScreeningResult(payload); // fungsi dari supabaseClient.js
      await clearPendingScreening(localId);
      console.log("Sinkron sukses:", localId);
    } catch (err) {
      console.warn("Gagal sinkron, coba lagi nanti:", err);
      break; // stop, coba lagi di kesempatan berikutnya
    }
  }
}

window.addEventListener("online", trySyncPendingScreenings);
