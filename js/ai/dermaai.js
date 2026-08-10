// js/ai/dermaai.js
// Edge AI classifier: menjalankan model kusta LANGSUNG di browser (offline, client-side).
//
// PENTING: model kamu sekarang masih format Keras (model_kusta_final.keras) dari app.py.
// Browser TIDAK BISA baca file .keras langsung — harus dikonversi dulu ke TensorFlow.js.
// Caranya (jalankan di komputer/environment Python kamu, BUKAN di sini):
//
//   pip install tensorflowjs
//   tensorflowjs_converter --input_format=keras \
//       model_kusta_final.keras \
//       ./model
//
// Itu bakal menghasilkan folder "model/" berisi model.json + file .bin.
// Taruh folder itu di dalam zytrava-app/model/ (sudah disiapkan foldernya).
// Kalau folder itu kosong, fungsi di bawah otomatis pakai MODE MOCK biar demo tetap jalan.

const IMG_SIZE = 224; // sama kayak app.py
const CLASS_NAMES = ["leprosy", "non_leprosy"]; // urutan alfabetis, sama kayak app.py

let tfModel = null;
let modelReady = false;

async function loadDermaAIModel() {
  try {
    tfModel = await tf.loadLayersModel("model/model.json");
    modelReady = true;
    console.log("DermaAI model (TensorFlow.js) berhasil dimuat.");
  } catch (err) {
    modelReady = false;
    console.warn(
      "Model TF.js belum ada di /model. Pakai MODE MOCK sementara. " +
      "Lihat komentar di js/ai/dermaai.js untuk cara konversi.",
      err
    );
  }
}

// Panggil ini sekali saat app pertama kali dibuka
loadDermaAIModel();

/**
 * Jalankan prediksi dari elemen <img> atau <canvas> hasil foto lesi.
 * Return: { leprosy: number, non_leprosy: number }  -- total = 1
 */
async function predictLesionImage(imageElementOrCanvas) {
  if (modelReady) {
    return tf.tidy(() => {
      let img = tf.browser.fromPixels(imageElementOrCanvas)
        .resizeBilinear([IMG_SIZE, IMG_SIZE])
        .toFloat()
        .expandDims(0); // shape (1, 224, 224, 3), nilai 0-255 mentah
        // (rescaling sudah jadi layer di dalam model, sama kayak di app.py — JANGAN dibagi 255 di sini)

      const preds = tfModel.predict(img);
      const values = preds.dataSync();

      if (values.length === 1) {
        const probClass1 = values[0]; // index 1 = non_leprosy
        return {
          [CLASS_NAMES[0]]: 1 - probClass1,
          [CLASS_NAMES[1]]: probClass1,
        };
      }
      return {
        [CLASS_NAMES[0]]: values[0],
        [CLASS_NAMES[1]]: values[1],
      };
    });
  }

  // ---- MODE MOCK (sebelum model dikonversi) ----
  // Biar alur screening -> CDSS -> hasil tetap bisa didemokan.
  // Confidence acak tapi condong "non_leprosy" biar realistis buat testing UI.
  await new Promise((r) => setTimeout(r, 600)); // simulasi waktu inferensi
  const mockLeprosy = Math.random() * 0.5; // 0 - 0.5
  return {
    leprosy: mockLeprosy,
    non_leprosy: 1 - mockLeprosy,
  };
}
