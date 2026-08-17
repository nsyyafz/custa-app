// js/screens/edit-profil.js
// Form edit data pasien: nama, tanggal lahir, jenis kelamin (kode L/P sesuai
// CHECK constraint di tabel patients), golongan darah. NIK read-only.

const GENDER_OPTIONS_EDIT = [
  { value: "L", label: "Laki-laki" },
  { value: "P", label: "Perempuan" },
];

const BLOOD_TYPE_OPTIONS_EDIT = ["A", "B", "AB", "O", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function editGenderOptionsHTML(list) {
  return (
    `<option value="">Pilih</option>` +
    list.map((v) => `<option value="${v.value}">${v.label}</option>`).join("")
  );
}

function editSimpleOptionsHTML(list) {
  return (
    `<option value="">Pilih</option>` +
    list.map((v) => `<option value="${v}">${v}</option>`).join("")
  );
}

function renderEditProfilScreen(container) {
  container.innerHTML = `
    ${headerHTML({ variant: "back", title: "Edit Profil" })}
    <main class="edit-profil-main">
      <div class="edit-avatar-section">
        <div class="edit-avatar-wrap">
          <div class="edit-avatar" id="edit-avatar"></div>
          <button class="edit-avatar-btn" id="edit-avatar-btn" aria-label="Ubah foto profil">
            <img src="assets/icons/icon-profil.svg" alt="" aria-hidden="true" />
          </button>
          <input type="file" id="edit-avatar-input" accept="image/*" hidden />
        </div>
        <span class="edit-avatar-label">Ubah Foto Profil</span>
      </div>

      <form id="form-edit-profil" class="edit-form">
        <div class="edit-field">
          <label class="edit-label" for="edit-nama">Nama Lengkap</label>
          <input type="text" id="edit-nama" class="edit-input" placeholder="Nama lengkap Anda" />
        </div>

        <div class="edit-field">
          <div class="edit-field-header">
            <label class="edit-label" for="edit-nik">Nomor Induk Kependudukan (NIK)</label>
            <span class="edit-badge-verified">Terverifikasi</span>
          </div>
          <input type="text" id="edit-nik" class="edit-input edit-input-readonly" readonly />
        </div>

        <div class="edit-field">
          <label class="edit-label" for="edit-tgl-lahir">Tanggal Lahir</label>
          <input type="date" id="edit-tgl-lahir" class="edit-input" />
        </div>

        <div class="edit-split-row">
          <div class="edit-field edit-field-half">
            <label class="edit-label" for="edit-gender">Jenis Kelamin</label>
            <select id="edit-gender" class="edit-select">${editGenderOptionsHTML(GENDER_OPTIONS_EDIT)}</select>
          </div>
          <div class="edit-field edit-field-half">
            <label class="edit-label" for="edit-goldar">Gol. Darah</label>
            <select id="edit-goldar" class="edit-select">${editSimpleOptionsHTML(BLOOD_TYPE_OPTIONS_EDIT)}</select>
          </div>
        </div>
      </form>

      <div class="edit-cta-wrap">
        <button type="submit" form="form-edit-profil" class="btn-primary edit-submit" id="btn-simpan-profil">
          <img src="assets/icons/icon-badge.svg" alt="" aria-hidden="true" />
          <span>Simpan Perubahan</span>
        </button>
      </div>
    </main>
  `;
    setupHeaderEvents({ onBack: () => navigateTo("profil") });
  loadEditProfilData();
}

let editProfilPatientId = null;
let editProfilAvatarUrl = null;
let editProfilNewAvatarFile = null;

async function loadEditProfilData() {
  const user = await getCurrentUser();
  if (!user) return;

  const { data: patient, error } = await supabase
    .from("patients")
    .select("id, full_name, nik, gender, date_of_birth, blood_type, avatar_url")
    .eq("registered_by", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !patient) {
    console.error("Gagal ambil data pasien:", error);
    return;
  }

  editProfilPatientId = patient.id;
  editProfilAvatarUrl = patient.avatar_url;

  document.getElementById("edit-nama").value = patient.full_name ?? "";
  document.getElementById("edit-nik").value = patient.nik ?? "";
  document.getElementById("edit-tgl-lahir").value = patient.date_of_birth ?? "";
  document.getElementById("edit-gender").value = patient.gender ?? "";
  document.getElementById("edit-goldar").value = patient.blood_type ?? "";
  if (patient.avatar_url) {
    document.getElementById("edit-avatar").style.backgroundImage = `url("${patient.avatar_url}")`;
  }

  attachEditProfilEvents();
}

function attachEditProfilEvents() {
  const avatarInput = document.getElementById("edit-avatar-input");
  document.getElementById("edit-avatar-btn")?.addEventListener("click", () => avatarInput.click());

  avatarInput.addEventListener("change", () => {
    const file = avatarInput.files?.[0];
    if (!file) return;
    editProfilNewAvatarFile = file;
    document.getElementById("edit-avatar").style.backgroundImage = `url("${URL.createObjectURL(file)}")`;
  });

  document.getElementById("form-edit-profil").addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById("btn-simpan-profil");
    submitBtn.disabled = true;
    submitBtn.querySelector("span").textContent = "Menyimpan...";

    let avatarUrl = editProfilAvatarUrl;

    if (editProfilNewAvatarFile) {
      const ext = editProfilNewAvatarFile.name.split(".").pop();
      const filePath = `${editProfilPatientId}/avatar-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, editProfilNewAvatarFile, { upsert: true });

      if (uploadError) {
        console.error("Gagal upload foto profil:", uploadError);
      } else {
        const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(filePath);
        avatarUrl = publicUrlData?.publicUrl ?? avatarUrl;
      }
    }

    const { error } = await supabase
      .from("patients")
      .update({
        full_name: document.getElementById("edit-nama").value.trim(),
        date_of_birth: document.getElementById("edit-tgl-lahir").value || null,
        gender: document.getElementById("edit-gender").value || null,
        blood_type: document.getElementById("edit-goldar").value || null,
        avatar_url: avatarUrl,
      })
      .eq("id", editProfilPatientId);

    submitBtn.disabled = false;
    submitBtn.querySelector("span").textContent = "Simpan Perubahan";

    if (error) {
      alert("Gagal menyimpan perubahan: " + error.message);
      return;
    }

    navigateTo("profil");
  });
}