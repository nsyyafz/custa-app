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

let LayananState = {
  namaLengkap: "",
  alamat: "",
  telepon: "",
  tanggal: "",
  waktu: "",
  jenisKeluhan: "",
  keluhanLainnya: "",
  jenisLayanan: null, // "kader" | "spesialis"
  metodePembayaran: null,
  requestId: null,
};

// Insert LayananState ke tabel service_requests.
// Dipanggil sekali di akhir flow (baik jalur gratis maupun berbayar).
async function submitServiceRequest() {
  const user = await getCurrentUser();
  if (!user) {
    alert("Sesi login tidak ditemukan. Silakan login ulang.");
    return null;
  }

  let patientId;
  try {
    patientId = await getPatientRecordId(user.id);
  } catch (err) {
    console.error("Gagal ambil data pasien:", err);
    alert("Data pasien tidak ditemukan.");
    return null;
  }

  const isPaid = LayananState.jenisLayanan === "spesialis";

  const { data, error } = await supabase
    .from("service_requests")
    .insert({
      patient_id: patientId,
      requested_by: user.id,
      visit_address: LayananState.alamat,
      phone_number: LayananState.telepon,
      visit_date: LayananState.tanggal,
      visit_time: LayananState.waktu,
      complaint_type: LayananState.jenisKeluhan,
      additional_notes: LayananState.keluhanLainnya || null,
      service_type: LayananState.jenisLayanan,
      consultation_fee: LayananState.consultationFee || 0,
      service_fee: LayananState.serviceFee || 0,
      payment_method: isPaid ? LayananState.metodePembayaran : null,
      payment_status: isPaid ? "pending" : "unpaid",
      promo_code: LayananState.promoCode || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Gagal menyimpan permintaan layanan:", error);
    alert("Gagal mengirim permintaan. Coba lagi ya.");
    return null;
  }

  LayananState.requestId = data.request_code;
  LayananState.requestDbId = data.id;
  return data;
}

document.addEventListener("DOMContentLoaded", initApp);
