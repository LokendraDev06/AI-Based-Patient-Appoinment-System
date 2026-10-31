// Compatibility redirect: Firebase has been migrated to Supabase
export * from './supabase';
export const isFirebaseReady = false;
export const db = null;
export async function saveAppointmentToFirestore(data) {
  const { saveAppointmentToSupabase } = await import('./supabase');
  return saveAppointmentToSupabase(data);
}
export async function updateAppointmentInFirestore(aptId, data) {
  const { updateAppointmentInSupabase } = await import('./supabase');
  return updateAppointmentInSupabase(aptId, data);
}
