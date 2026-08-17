// js/router.js
// Router paling sederhana: satu fungsi buat tiap "halaman", di-switch manual.
// Kalau nanti app makin besar, boleh upgrade ke hash routing (#/home, #/screening, dst).

const routes = {
  splash: renderSplashScreen,
  login: renderLoginScreen,
  register: renderRegisterScreen,
  home: renderHomeScreen,
  scan: renderScanScreen,
  kuesioner: renderKuesionerScreen,
  analisis: renderAnalisisScreen,
  result: renderResultScreen,
  riwayat: renderRiwayatScreen,
  puskesmas: renderPuskesmasScreen,
  profil: renderProfilScreen,
  beriPenilaian: renderBeriPenilaianScreen,
  editProfil: renderEditProfilScreen,
  keamananAkun: renderKeamananAkunScreen,
  notifikasi: renderNotifikasiScreen,
  tentang: renderAboutScreen,
  kebijakanPrivasi: renderKebijakanPrivasiScreen,
  mentorMedis: renderMentorMedisScreen,
  edukasi: renderEdukasiScreen,       // ganti placeholder lama jika ada
  detailEdukasi: renderDetailEdukasiScreen,
  artikel: renderArtikelScreen,
  layananKunjungan: renderLayananKunjunganScreen,
  jenisLayanan: renderJenisLayananScreen,
  detailLayanan: renderDetailLayananScreen,
  metodePembayaran: renderMetodePembayaranScreen,
  layananBerhasil: renderLayananBerhasilScreen,
};

function navigateTo(routeName) {
  const container = document.getElementById("app");
  const renderFn = routes[routeName];

  if (!renderFn) {
    console.error("Route tidak ditemukan:", routeName);
    return;
  }

  renderFn(container);
  window.scrollTo(0, 0);
}
