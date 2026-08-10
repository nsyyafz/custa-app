// js/screens/scan.js -- Ambil foto lesi kulit (kamera langsung ATAU upload dari galeri)
// Hasil foto disimpan di window.__screeningPhoto buat dipakai screen berikutnya (kuesioner -> analisis).

let scanCameraStream = null;

function renderScanScreen(container) {
  container.innerHTML = `
    ${headerHTML()}
    <main class="scan-screen">
      <div class="scan-viewport" id="scanViewport">
        <video id="scanVideo" autoplay playsinline muted></video>
        <img id="scanPhotoPreview" alt="" style="display:none;" />

        <div class="scan-top-controls">
          <button class="scan-round-btn" id="btnScanBack" aria-label="Kembali">
            <img src="assets/icons/icon-back-white.svg" alt="" aria-hidden="true" />
          </button>
          <div class="scan-ai-badge">
            <img src="assets/icons/icon-ai-badge.svg" alt="" aria-hidden="true" />
            <span>AI ACTIVE</span>
          </div>
          <button class="scan-round-btn" id="btnScanFlash" aria-label="Flash">
            <img src="assets/icons/icon-flash.svg" alt="" aria-hidden="true" />
          </button>
        </div>

        <div class="scan-guide" id="scanGuide">
          <div class="scan-guide-frame">
            <span class="corner corner-tl"></span>
            <span class="corner corner-tr"></span>
            <span class="corner corner-bl"></span>
            <span class="corner corner-br"></span>
            <div class="scan-laser"></div>
          </div>
          <div class="scan-guide-text">
            <p>Posisi lesi di tengah area panduan.</p>
            <p class="dim">Pencahayaan terlihat baik.</p>
          </div>
        </div>

        <div class="scan-bottom-controls">
          <button class="scan-side-btn" id="btnScanHelp">
            <img src="assets/icons/icon-help.svg" alt="" aria-hidden="true" />
            <span>Bantuan</span>
          </button>

          <button class="scan-capture-btn" id="btnScanCapture" aria-label="Ambil Gambar">
            <span class="scan-capture-inner"></span>
          </button>

          <button class="scan-side-btn scan-gallery-btn" id="btnScanGallery" aria-label="Pilih dari galeri">
            <div class="scan-gallery-thumb"></div>
          </button>
          <input type="file" id="scanFileInput" accept="image/*" style="display:none;" />
        </div>

        <button class="scan-confirm-btn" id="btnScanConfirm" style="display:none;">
          Gunakan Foto Ini
        </button>
        <button class="scan-retake-btn" id="btnScanRetake" style="display:none;">
          Ambil Ulang
        </button>
      </div>
    </main>
  `;

  setupHeaderEvents({ onBack: () => navigateTo("home") });

  document.getElementById("btnScanBack").addEventListener("click", () => {
    stopScanCamera();
    navigateTo("home");
  });

  document.getElementById("btnScanHelp").addEventListener("click", () => {
    alert("Posisikan lesi kulit di tengah area panduan, lalu tekan tombol putih besar untuk mengambil foto.");
  });

  document.getElementById("btnScanFlash").addEventListener("click", (e) => {
    e.currentTarget.classList.toggle("active");
    // Catatan: kontrol flash asli butuh MediaStreamTrack torch capability,
    // yang dukungannya terbatas di browser. Ini baru toggle visual dulu.
  });

  document.getElementById("btnScanCapture").addEventListener("click", capturePhoto);
  document.getElementById("btnScanGallery").addEventListener("click", () => {
    document.getElementById("scanFileInput").click();
  });
  document.getElementById("scanFileInput").addEventListener("change", handleGalleryUpload);

  document.getElementById("btnScanRetake").addEventListener("click", retakePhoto);
  document.getElementById("btnScanConfirm").addEventListener("click", () => {
    stopScanCamera();
    navigateTo("kuesioner");
  });

  startScanCamera();
}

async function startScanCamera() {
  try {
    scanCameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });
    document.getElementById("scanVideo").srcObject = scanCameraStream;
  } catch (err) {
    document.querySelector(".scan-guide-text p").textContent =
      "Kamera tidak dapat diakses. Gunakan tombol galeri di bawah untuk upload foto.";
  }
}

function stopScanCamera() {
  if (scanCameraStream) {
    scanCameraStream.getTracks().forEach((t) => t.stop());
    scanCameraStream = null;
  }
}

function capturePhoto() {
  const video = document.getElementById("scanVideo");
  if (!video.videoWidth) return;

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);

  window.__screeningPhoto = canvas;
  showPreview(canvas.toDataURL("image/jpeg"));
}

function handleGalleryUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const img = new Image();
  img.onload = () => {
    window.__screeningPhoto = img;
    showPreview(img.src);
  };
  img.src = URL.createObjectURL(file);
}

function showPreview(dataUrl) {
  stopScanCamera();
  const video = document.getElementById("scanVideo");
  const preview = document.getElementById("scanPhotoPreview");
  video.style.display = "none";
  preview.src = dataUrl;
  preview.style.display = "block";

  document.getElementById("scanGuide").style.display = "none";
  document.querySelector(".scan-bottom-controls").style.display = "none";
  document.getElementById("btnScanConfirm").style.display = "block";
  document.getElementById("btnScanRetake").style.display = "block";
}

function retakePhoto() {
  window.__screeningPhoto = null;
  const video = document.getElementById("scanVideo");
  const preview = document.getElementById("scanPhotoPreview");
  preview.style.display = "none";
  video.style.display = "block";

  document.getElementById("scanGuide").style.display = "flex";
  document.querySelector(".scan-bottom-controls").style.display = "flex";
  document.getElementById("btnScanConfirm").style.display = "none";
  document.getElementById("btnScanRetake").style.display = "none";

  startScanCamera();
}
