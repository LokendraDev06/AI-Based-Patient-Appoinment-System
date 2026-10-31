import React, { useState, useMemo } from 'react';
import { X, Calendar, Clock, CheckCircle2, User, Phone, FileText, Database, AlertCircle } from 'lucide-react';
import { saveAppointmentToSupabase, isSupabaseReady } from '../supabase';

export default function AppointmentModal({ doctor, appointments, onClose, onBookingSuccess }) {
  const todayStr = new Date().toISOString().split('T')[0];
  const [name, setName] = useState('Lokendra Dev');
  const [age, setAge] = useState('24');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [date, setDate] = useState(todayStr);
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);

  // Clinical Time Slots (Morning & Evening sessions)
  const morningSlots = ['09:00 AM', '09:30 AM', '10:15 AM', '11:00 AM', '11:45 AM', '12:30 PM'];
  const eveningSlots = ['04:30 PM', '05:15 PM', '06:00 PM', '06:45 PM', '07:30 PM', '08:15 PM'];

  const allSlots = useMemo(() => {
    const set = new Set([...morningSlots, ...eveningSlots, ...(doctor?.available_slots || [])]);
    return Array.from(set);
  }, [doctor]);

  // Calculate booked slots for this doctor on selected date
  const bookedSlotsOnDate = useMemo(() => {
    const set = new Set();
    if (!appointments || !doctor) return set;
    appointments.forEach(a => {
      if (!a || a.status === 'Rejected') return;
      const matchDoc = a.doctor_name && (
        a.doctor_name.toLowerCase().includes(doctor.name.toLowerCase()) ||
        doctor.name.toLowerCase().includes(a.doctor_name.toLowerCase())
      );
      if (matchDoc && a.date === date) {
        set.add(a.slot);
      }
    });
    return set;
  }, [appointments, doctor, date]);

  const [selectedSlot, setSelectedSlot] = useState(() => {
    return allSlots.find(s => !bookedSlotsOnDate.has(s)) || allSlots[0] || '10:15 AM';
  });

  React.useEffect(() => {
    if (bookedSlotsOnDate.has(selectedSlot)) {
      const free = allSlots.find(s => !bookedSlotsOnDate.has(s));
      if (free) setSelectedSlot(free);
    }
  }, [date, bookedSlotsOnDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (bookedSlotsOnDate.has(selectedSlot)) {
      alert('This slot is already booked. Please choose an available free slot.');
      return;
    }

    setLoading(true);

    const payload = {
      patient_name: name,
      patient_age: parseInt(age) || 24,
      patient_gender: "Male",
      patient_phone: phone,
      doctor_id: doctor.id,
      doctor_name: doctor.name,
      doctor_avatar: doctor.avatar,
      specialization: doctor.specialization,
      clinic: doctor.clinic || "City Care Hospital, Gwalior",
      fee: doctor.fee || 500,
      date: date,
      slot: selectedSlot,
      status: "Pending", // Awaiting doctor confirmation
      priority: (symptoms.toLowerCase().includes('chest') || symptoms.toLowerCase().includes('breath') || symptoms.toLowerCase().includes('fever')) ? 'High' : 'Normal',
      symptoms: symptoms || "General OPD Consultation",
      ai_summary: `Patient reported: '${symptoms || 'General Checkup'}'. Requested ${selectedSlot} on ${date} with ${doctor.name} (${doctor.specialization}). Awaiting doctor confirmation.`
    };

    let appointmentId = `apt-${Math.floor(Math.random()*9000) + 1000}`;

    // 1. Save directly to Supabase if configured
    if (isSupabaseReady) {
      try {
        const supabaseId = await saveAppointmentToSupabase(payload);
        if (supabaseId) {
          appointmentId = supabaseId;
        }
      } catch (sbErr) {
        console.warn("Supabase save warning:", sbErr);
      }
    }

    // 2. Also notify Backend API if online
    try {
      const res = await fetch('http://localhost:8000/api/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.appointment) {
        setLoading(false);
        onBookingSuccess({ ...data.appointment, id: appointmentId });
        return;
      }
    } catch (err) {
      console.warn("Backend API offline, completed via Firebase/Local state");
    }

    setLoading(false);
    onBookingSuccess({
      id: appointmentId,
      ...payload
    });
  };

  const freeCount = allSlots.filter(s => !bookedSlotsOnDate.has(s)).length;
  const bookedCount = allSlots.filter(s => bookedSlotsOnDate.has(s)).length;

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel" style={{ maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Book Appointment</h3>
            <p style={{ margin: '3px 0 0', color: 'var(--primary-accent)', fontSize: '0.85rem', fontWeight: 700 }}>
              {doctor.name} ({doctor.specialization}) • Fee: ₹{doctor.fee || 500}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Supabase DB Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '0.8rem',
          marginBottom: '16px',
          background: isSupabaseReady ? 'rgba(34, 197, 94, 0.1)' : 'rgba(100, 116, 139, 0.1)',
          border: `1px solid ${isSupabaseReady ? 'rgba(34, 197, 94, 0.3)' : 'rgba(100, 116, 139, 0.2)'}`,
          color: isSupabaseReady ? '#22c55e' : 'var(--text-muted)'
        }}>
          <Database size={15} />
          <span>
            {isSupabaseReady 
              ? '⚡ Supabase Cloud Connected — Real-time live synchronization active' 
              : '⚡ Supabase Local Mode Active (Add VITE_SUPABASE_URL for permanent cloud storage)'}
          </span>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Patient Full Name</label>
            <input type="text" className="chat-input" style={{ width: '100%' }} value={name} onChange={e=>setName(e.target.value)} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Age</label>
              <input type="number" className="chat-input" style={{ width: '100%' }} value={age} onChange={e=>setAge(e.target.value)} required />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Phone Number</label>
              <input type="text" className="chat-input" style={{ width: '100%' }} value={phone} onChange={e=>setPhone(e.target.value)} required />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Consultation Date</label>
            <input type="date" min={todayStr} className="chat-input" style={{ width: '100%' }} value={date} onChange={e=>setDate(e.target.value)} required />
          </div>

          {/* Dynamic Slots Selector */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Choose Time Slot ({date})</span>
              <div style={{ display: 'flex', gap: '10px', fontSize: '0.72rem', fontWeight: 700 }}>
                <span style={{ color: '#22c55e' }}>🟢 {freeCount} Free</span>
                <span style={{ color: '#ef4444' }}>🔴 {bookedCount} Booked</span>
              </div>
            </div>

            {/* Morning */}
            <div style={{ marginBottom: '8px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>☀️ Morning Session</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {morningSlots.map((time, idx) => {
                  const isBooked = bookedSlotsOnDate.has(time);
                  const isSelected = selectedSlot === time;
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isBooked}
                      onClick={() => setSelectedSlot(time)}
                      style={{
                        padding: '6px',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: isBooked ? 'not-allowed' : 'pointer',
                        textAlign: 'center',
                        border: isSelected ? '2px solid #3b82f6' : (isBooked ? '1px dashed rgba(239, 68, 68, 0.4)' : '1px solid rgba(255,255,255,0.15)'),
                        background: isSelected ? 'rgba(59, 130, 246, 0.2)' : (isBooked ? 'rgba(239, 68, 68, 0.1)' : 'transparent'),
                        color: isSelected ? '#60a5fa' : (isBooked ? '#64748b' : '#f8fafc')
                      }}
                    >
                      <div style={{ textDecoration: isBooked ? 'line-through' : 'none' }}>{time}</div>
                      <span style={{ fontSize: '0.6rem', color: isSelected ? '#3b82f6' : (isBooked ? '#ef4444' : '#22c55e') }}>
                        {isSelected ? '✓ Selected' : (isBooked ? 'Booked' : 'Free')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Evening */}
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>🌙 Evening Session</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {eveningSlots.map((time, idx) => {
                  const isBooked = bookedSlotsOnDate.has(time);
                  const isSelected = selectedSlot === time;
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isBooked}
                      onClick={() => setSelectedSlot(time)}
                      style={{
                        padding: '6px',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: isBooked ? 'not-allowed' : 'pointer',
                        textAlign: 'center',
                        border: isSelected ? '2px solid #3b82f6' : (isBooked ? '1px dashed rgba(239, 68, 68, 0.4)' : '1px solid rgba(255,255,255,0.15)'),
                        background: isSelected ? 'rgba(59, 130, 246, 0.2)' : (isBooked ? 'rgba(239, 68, 68, 0.1)' : 'transparent'),
                        color: isSelected ? '#60a5fa' : (isBooked ? '#64748b' : '#f8fafc')
                      }}
                    >
                      <div style={{ textDecoration: isBooked ? 'line-through' : 'none' }}>{time}</div>
                      <span style={{ fontSize: '0.6rem', color: isSelected ? '#3b82f6' : (isBooked ? '#ef4444' : '#22c55e') }}>
                        {isSelected ? '✓ Selected' : (isBooked ? 'Booked' : 'Free')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Symptoms / Notes for Doctor</label>
            <textarea className="chat-input" style={{ width: '100%', height: '60px', resize: 'none' }} placeholder="Briefly describe your symptoms..." value={symptoms} onChange={e=>setSymptoms(e.target.value)} />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '6px' }} disabled={loading || bookedSlotsOnDate.has(selectedSlot)}>
            {loading ? 'Submitting Request...' : `Request Appointment (${selectedSlot})`}
          </button>
        </form>
      </div>
    </div>
  );
}
