// js/cdss/cdssEngine.js
// Rule-based scoring, disesuaikan dengan 8 pertanyaan kuesioner baru.
// Bobot ini masih heuristik kasar untuk prototipe -- sebaiknya direview
// bareng pembimbing/dokter sebelum dipakai sebagai acuan medis beneran.

function runCDSS(aiConfidence, answers) {
  let score = aiConfidence * 50; // AI berkontribusi maksimal 50 poin

  if (answers.matiRasa) score += 20; // gejala klasik kusta (anestesi lokal)

  if (answers.riwayatKeluarga === "ya") score += 15;
  else if (answers.riwayatKeluarga === "tidak_tahu") score += 5;

  if (answers.durasi === "lebih_6_bulan") score += 10;
  else if (answers.durasi === "1_6_bulan") score += 5;

  if (answers.jumlahBercak === "lebih_5") score += 10;
  else if (answers.jumlahBercak === "2_5") score += 5;

  if (answers.membesar) score += 10;

  score = Math.max(0, Math.min(100, Math.round(score)));

  let kategori, rekomendasi, batasWaktu;
  if (score >= 70) {
    kategori = "tinggi";
    rekomendasi = "Segera periksa ke Puskesmas dan hindari kontak erat sementara.";
    batasWaktu = "≤ 24 jam";
  } else if (score >= 35) {
    kategori = "sedang";
    rekomendasi = "Periksakan diri ke Puskesmas terdekat.";
    batasWaktu = "dalam 7 hari";
  } else {
    kategori = "rendah";
    rekomendasi = "Pantau mandiri, periksa ulang bila ada perubahan pada lesi.";
    batasWaktu = "kontrol jika ada perubahan gejala";
  }

  return { score, kategori, rekomendasi, batasWaktu, aiConfidence, answers };
}
