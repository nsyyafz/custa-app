// js/supabaseClient.js
// Ambil dari Supabase Dashboard -> Project Settings -> API
// JANGAN pakai service_role key di sini, pakai anon/public key aja (aman buat frontend)

const SUPABASE_URL = "https://ihrjuqijibxbfbjfaymh.supabase.co"; // ganti dengan project kamu
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlocmp1cWlqaWJ4YmZiamZheW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5MDAyNTIsImV4cCI6MjEwMTQ3NjI1Mn0.UtbECqz-9Lm6b3NBDdrm0vi6MZot4kCh5-04ag9yNYs";       // ganti dengan punya kamu

var supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---- Helper query yang bakal dipanggil dari screen lain ----

async function saveScreeningResult(payload) {
  // payload: { patient_id, risk_category, ai_confidence, questionnaire, lesion_photo_url, ... }
  const { data, error } = await supabase.from("screenings").insert(payload).select();
  if (error) throw error;
  return data;
}

async function getNearestFacilities(lat, lng) {
  // Asumsi kamu punya RPC/PostGIS function di Supabase bernama "nearest_facilities"
  // Kalau belum ada, sementara pakai select biasa dulu:
  const { data, error } = await supabase.from("health_facilities").select("*").limit(5);
  if (error) throw error;
  return data;
}

async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user ?? null;
}

// PENTING: screenings.patient_id itu nunjuk ke patients.id (bukan auth user id!).
// patients.id ID-nya sendiri, dihubungin ke akun lewat kolom registered_by.
// Jadi tiap mau insert/query screenings, ambil dulu patients.id yang benar lewat ini.
async function getPatientRecordId(userId) {
  const { data, error } = await supabase
    .from("patients")
    .select("id")
    .eq("registered_by", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  if (error) throw error;
  return data.id;
}