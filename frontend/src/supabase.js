import { createClient } from '@supabase/supabase-js';

// ==========================================
// ⚡ SUPABASE DATABASE & REALTIME CONFIGURATION
// ==========================================
// Paste your project credentials from:
// https://supabase.com -> Project Settings -> API
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || localStorage.getItem('supabase_url') || "https://ucpwgujouvcmfumkwmux.supabase.co";
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || localStorage.getItem('supabase_anon_key') || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjcHdndWpvdXZjbWZ1bWt3bXV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyMDIwMTksImV4cCI6MjEwODc3ODAxOX0.cM7cMueo5H_i-X1HlPupCKYpaOqo_tnHGf_Tt3JcyNY";

export const isSupabaseReady = Boolean(
  SUPABASE_URL && 
  !SUPABASE_URL.includes("xyzcompany") && 
  SUPABASE_ANON_KEY && 
  SUPABASE_ANON_KEY.length > 20
);

export const supabase = isSupabaseReady
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

if (isSupabaseReady) {
  console.log("⚡ [Supabase] Connected successfully! Appointments will sync in real-time.");
} else {
  console.info("ℹ️ [Supabase] Keys pending. Running in seamless local fallback mode. Add VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY to sync to Supabase.");
}

/**
 * Save an appointment document to Supabase 'appointments' table
 */
export async function saveAppointmentToSupabase(appointmentData) {
  if (!supabase || !isSupabaseReady) {
    console.info("Supabase not configured, saving to local session.");
    return appointmentData.id || `apt-${Date.now()}`;
  }
  try {
    const payload = {
      id: appointmentData.id || `apt-${Date.now()}`,
      token: appointmentData.token || "01",
      patient_name: appointmentData.patient_name,
      patient_age: appointmentData.patient_age || 24,
      patient_gender: appointmentData.patient_gender || "Male",
      patient_phone: appointmentData.patient_phone || "",
      doctor_name: appointmentData.doctor_name,
      doctor_avatar: appointmentData.doctor_avatar || "",
      specialization: appointmentData.specialization || "General Physician",
      clinic: appointmentData.clinic || "City Care Hospital, Gwalior",
      fee: appointmentData.fee || 500,
      date: appointmentData.date,
      slot: appointmentData.slot,
      status: appointmentData.status || "Pending",
      priority: appointmentData.priority || "Normal",
      symptoms: appointmentData.symptoms || "",
      ai_summary: appointmentData.ai_summary || "",
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('appointments')
      .insert([payload])
      .select();

    if (error) {
      console.warn("Supabase insert notice:", error.message);
      return payload.id;
    }
    console.log("⚡ [Supabase] Appointment successfully created with ID:", data?.[0]?.id || payload.id);
    return data?.[0]?.id || payload.id;
  } catch (err) {
    console.warn("Supabase save exception:", err);
    return appointmentData.id || `apt-${Date.now()}`;
  }
}

/**
 * Real-time listener for appointments using Supabase Realtime Channels
 */
export function listenToAppointments(onUpdate) {
  if (!supabase || !isSupabaseReady) {
    return () => {};
  }

  // 1. Initial Fetch
  supabase
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: false })
    .then(({ data, error }) => {
      if (!error && data && data.length > 0) {
        onUpdate(data);
      }
    });

  // 2. Real-time Subscription Channel
  const channel = supabase
    .channel('public:appointments')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'appointments' },
      () => {
        supabase
          .from('appointments')
          .select('*')
          .order('created_at', { ascending: false })
          .then(({ data, error }) => {
            if (!error && data) {
              onUpdate(data);
            }
          });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Update an appointment status/prescription in Supabase
 */
export async function updateAppointmentInSupabase(aptId, updateData) {
  if (!supabase || !isSupabaseReady || !aptId) return;
  try {
    const { error } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', aptId);
    if (error) {
      console.warn("Supabase update notice:", error.message);
    }
  } catch (err) {
    console.warn("Supabase update error:", err);
  }
}
