import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UserCheck, AlertTriangle, Clock, DollarSign, Star, 
  Search, Plus, CheckCircle2, XCircle, ChevronRight, Stethoscope, ShieldCheck,
  FileText, Phone, Calendar, RefreshCw
} from 'lucide-react';
import { updateAppointmentInSupabase } from '../supabase';

export default function DoctorDashboard({ appointments, currentUser, setAppointments, doctors }) {
  const [opdStatus, setOpdStatus] = useState('active'); // 'active' | 'break'
  const [activeQueueTab, setActiveQueueTab] = useState('all'); // 'all' | 'pending' | 'waiting' | 'urgent' | 'completed' | 'rejected'
  const [searchPatient, setSearchPatient] = useState('');
  const [consultingApt, setConsultingApt] = useState(null);
  const [viewRxApt, setViewRxApt] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Doctor Profile
  const doctorName = currentUser?.name || "Dr. Deepankar Lahariya";
  const doctorSpecialty = currentUser?.specialization || "General Physician & Senior Consultant";

  // Patient queue derived dynamically from appointments prop
  const queue = useMemo(() => {
    if (!appointments || appointments.length === 0) return [];
    return appointments.map((apt, idx) => ({
      ...apt,
      id: apt.id || `apt-${idx}`,
      token: apt.token || String(idx + 1).padStart(2, '0'),
      patient_name: apt.patient_name || 'Patient',
      age_gender: `${apt.patient_age || 25} Yrs / ${apt.patient_gender || 'Male'}`,
      phone: apt.patient_phone || '+91 98765 43210',
      slot: apt.slot || '11:00 AM',
      date: apt.date || new Date().toISOString().split('T')[0],
      fee: parseInt(apt.fee) || 500,
      status: apt.status || 'Pending',
      priority: apt.priority || (apt.symptoms && (apt.symptoms.toLowerCase().includes('chest') || apt.symptoms.toLowerCase().includes('breath')) ? 'Urgent' : 'Normal'),
      complaints: apt.symptoms || 'General Checkup',
      ai_summary: apt.ai_summary || 'Preliminary clinical triage complete.',
      doctor_name: apt.doctor_name || 'Dr. Deepankar Lahariya'
    }));
  }, [appointments]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4500);
  };

  // Real-time Accept Appointment
  const handleAcceptAppointment = async (aptId) => {
    if (setAppointments) {
      setAppointments(prev => prev.map(a => a.id === aptId ? { ...a, status: 'Accepted' } : a));
    }
    await updateAppointmentInSupabase(aptId, {
      status: 'Accepted',
      acceptedAt: new Date().toISOString()
    });
    showToast("✓ Appointment Accepted! Real-time notification sent to patient screen.");
  };

  // Real-time Reject Appointment
  const handleRejectAppointment = async (aptId, reason = "Doctor unavailable in this slot / Emergency duty") => {
    const customReason = prompt("Enter reason for rejecting appointment (will be shown to patient):", reason);
    const finalReason = customReason !== null && customReason.trim() ? customReason.trim() : reason;
    if (setAppointments) {
      setAppointments(prev => prev.map(a => a.id === aptId ? { ...a, status: 'Rejected', rejectionReason: finalReason } : a));
    }
    await updateAppointmentInSupabase(aptId, {
      status: 'Rejected',
      rejectionReason: finalReason,
      rejectedAt: new Date().toISOString()
    });
    showToast("✕ Appointment Rejected. Real-time update sent to patient.");
  };

  // Mark Completed
  const handleMarkCompleted = async (aptId) => {
    if (setAppointments) {
      setAppointments(prev => prev.map(a => a.id === aptId ? { ...a, status: 'Completed' } : a));
    }
    await updateAppointmentInSupabase(aptId, {
      status: 'Completed',
      completedAt: new Date().toISOString()
    });
    showToast("✓ Consultation marked completed.");
  };

  // KPI Calculations
  const totalCount = queue.length;
  const pendingRequests = queue.filter(a => a.status === 'Pending');
  const pendingCount = pendingRequests.length;
  const waitingCount = queue.filter(a => a.status === 'Accepted' || a.status === 'Waiting').length;
  const urgentCount = queue.filter(a => a.priority === 'Urgent' && a.status !== 'Rejected' && a.status !== 'Completed').length;
  const completedCount = queue.filter(a => a.status === 'Completed').length;
  const rejectedCount = queue.filter(a => a.status === 'Rejected').length;
  const todayEarnings = queue.filter(a => a.status !== 'Rejected').reduce((sum, a) => sum + (parseInt(a.fee) || 500), 0);

  // Filtered queue
  const filteredQueue = queue.filter(item => {
    const matchesSearch = searchPatient ? (
      item.patient_name.toLowerCase().includes(searchPatient.toLowerCase()) ||
      item.token.includes(searchPatient) ||
      item.phone.includes(searchPatient) ||
      (item.complaints && item.complaints.toLowerCase().includes(searchPatient.toLowerCase()))
    ) : true;

    if (!matchesSearch) return false;
    if (activeQueueTab === 'pending') return item.status === 'Pending';
    if (activeQueueTab === 'waiting') return item.status === 'Accepted' || item.status === 'Waiting';
    if (activeQueueTab === 'urgent') return item.priority === 'Urgent' && item.status !== 'Rejected';
    if (activeQueueTab === 'completed') return item.status === 'Completed';
    if (activeQueueTab === 'rejected') return item.status === 'Rejected';
    return true;
  });

  // Track today's booked slots for the slot manager
  const todayDateStr = new Date().toISOString().split('T')[0];
  const allDaySlots = [
    "09:30 AM", "10:15 AM", "11:00 AM", "11:45 AM", "12:30 PM", "01:15 PM",
    "04:30 PM", "05:15 PM", "06:00 PM", "06:45 PM", "07:30 PM", "08:15 PM"
  ];
  const bookedSlotMap = useMemo(() => {
    const map = {};
    queue.forEach(a => {
      if (a.date === todayDateStr && a.status !== 'Rejected') {
        map[a.slot] = a;
      }
    });
    return map;
  }, [queue, todayDateStr]);

  return (
    <div className="doctor-dashboard-wrap" style={{ maxWidth: '1360px', margin: '0 auto', padding: '24px 20px' }}>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
              background: '#0f172a', color: '#ffffff', padding: '14px 22px',
              borderRadius: '14px', boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
              fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px'
            }}
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Doctor Hero Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #0284c7 100%)',
          borderRadius: '24px', padding: '28px 32px', color: '#ffffff',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '20px', marginBottom: '24px',
          boxShadow: '0 12px 36px rgba(37,99,235,0.25)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '76px', height: '76px', borderRadius: '22px',
            border: '3px solid rgba(255,255,255,0.4)', background: '#ffffff',
            overflow: 'hidden', flexShrink: 0, boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
          }}>
            <img
              src="/assets/hero_doctor.jpg"
              alt="Doctor Avatar"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { e.target.src = "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=80"; }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0, letterSpacing: '-0.4px', fontFamily: 'var(--font-heading)' }}>
                {doctorName}
              </h1>
              <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.76rem', fontWeight: 700 }}>
                {doctorSpecialty}
              </span>
            </div>
            <p style={{ margin: '6px 0 0 0', fontSize: '0.85rem', color: '#dbeafe', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <span>🏥 City Care Hospital & OPD Centre, Gwalior</span>
              <span>•</span>
              <span>🚪 OPD Room No. 204 (1st Floor)</span>
              <span>•</span>
              <span>🆔 Reg: MP-MC-48921</span>
            </p>
          </div>
        </div>

        {/* Status & Quick Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', zIndex: 2 }}>
          <button
            type="button"
            onClick={() => setOpdStatus(opdStatus === 'active' ? 'break' : 'active')}
            style={{
              background: opdStatus === 'active' ? '#ecfdf5' : '#fffbeb',
              color: opdStatus === 'active' ? '#047857' : '#b45309',
              border: `1.5px solid ${opdStatus === 'active' ? '#a7f3d0' : '#fde68a'}`,
              borderRadius: '24px', padding: '9px 18px', fontSize: '0.82rem', fontWeight: 800,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: opdStatus === 'active' ? '#10b981' : '#f59e0b' }}></span>
            <span>{opdStatus === 'active' ? 'OPD Active: Accepting Patients' : 'OPD on Break'}</span>
          </button>
        </div>
      </motion.div>

      {/* 2. 4-KPI Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#ffffff', borderRadius: '18px', padding: '18px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
            👥
          </div>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a' }}>{totalCount} Patients</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Today's Total OPD Queue</div>
            <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, marginTop: '2px' }}>
              {waitingCount} Confirmed • {pendingCount} Pending
            </div>
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '18px', padding: '18px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
            🚨
          </div>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#dc2626' }}>{urgentCount} Urgent</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Triage Red Flag Cases</div>
            <div style={{ fontSize: '0.72rem', color: '#dc2626', fontWeight: 700, marginTop: '2px' }}>
              Immediate attention required
            </div>
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '18px', padding: '18px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
            🔔
          </div>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#d97706' }}>{pendingCount} Requests</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Awaiting Approval</div>
            <div style={{ fontSize: '0.72rem', color: '#b45309', fontWeight: 700, marginTop: '2px' }}>
              Click Accept or Reject
            </div>
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '18px', padding: '18px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
            💳
          </div>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#15803d' }}>₹{todayEarnings}</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Today's OPD Collections</div>
            <div style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 700, marginTop: '2px' }}>
              Direct Clinic Consultations
            </div>
          </div>
        </div>
      </div>

      {/* 3. DEDICATED INCOMING APPOINTMENT REQUESTS DESK (IF PENDING > 0) */}
      {pendingRequests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: '#fffbeb', border: '2px solid #fde68a', borderRadius: '22px',
            padding: '24px', marginBottom: '28px', boxShadow: '0 6px 24px rgba(245, 158, 11, 0.12)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>🔔</span>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#92400e', margin: 0 }}>
                  New Appointment Requests ({pendingCount} Action Required)
                </h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#b45309' }}>
                  Patients are awaiting your confirmation. Accept to lock slot or Reject with a message.
                </p>
              </div>
            </div>
            <span style={{ background: '#f59e0b', color: '#ffffff', padding: '4px 12px', borderRadius: '20px', fontSize: '0.76rem', fontWeight: 800 }}>
              Live Cloud Sync
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                style={{
                  background: '#ffffff', borderRadius: '16px', padding: '18px',
                  border: '1.5px solid #fed7aa', boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 850, color: '#0f172a', margin: 0 }}>
                      {req.patient_name}
                    </h4>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                      {req.age_gender} • 📞 {req.phone}
                    </div>
                  </div>
                  <span style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '3px 10px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 800 }}>
                    Requested: {req.slot}
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', color: '#334155', background: '#f8fafc', padding: '10px', borderRadius: '10px', marginBottom: '14px', lineHeight: 1.45 }}>
                  <div><strong>Complaints:</strong> {req.complaints}</div>
                  <div style={{ color: '#1e40af', marginTop: '4px' }}><strong>AI Note:</strong> {req.ai_summary}</div>
                </div>

                {/* Big Action Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => handleAcceptAppointment(req.id)}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#ffffff', border: 'none', borderRadius: '10px',
                      padding: '10px', fontSize: '0.84rem', fontWeight: 800,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
                    }}
                  >
                    <CheckCircle2 size={16} />
                    <span>✓ Accept & Confirm</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRejectAppointment(req.id)}
                    style={{
                      background: '#ffffff', color: '#dc2626',
                      border: '1.5px solid #fca5a5', borderRadius: '10px',
                      padding: '10px', fontSize: '0.84rem', fontWeight: 800,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                    }}
                  >
                    <XCircle size={16} />
                    <span>✕ Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 4. Main Dashboard Layout: Left Queue + Right OPD Slots Manager */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '28px', alignItems: 'start' }}>
        
        {/* Left Section: Live Patient OPD Queue */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 850, color: '#0f172a', margin: 0, fontFamily: 'var(--font-heading)' }}>
                Live Patient OPD Queue
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>
                Real-time queue tracking, accept/reject status, AI triage diagnostics, and prescription generator
              </p>
            </div>

            {/* Queue Search Bar */}
            <div style={{ position: 'relative', width: '240px' }}>
              <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search by name, token #, phone..."
                value={searchPatient}
                onChange={e => setSearchPatient(e.target.value)}
                style={{
                  width: '100%', padding: '7px 10px 7px 30px', fontSize: '0.78rem',
                  border: '1px solid #cbd5e1', borderRadius: '10px', outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
            <button
              onClick={() => setActiveQueueTab('all')}
              style={{
                padding: '7px 14px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 700,
                border: '1px solid', cursor: 'pointer',
                background: activeQueueTab === 'all' ? '#2563eb' : '#ffffff',
                color: activeQueueTab === 'all' ? '#ffffff' : '#475569',
                borderColor: activeQueueTab === 'all' ? '#2563eb' : '#e2e8f0'
              }}
            >
              All Patients ({queue.length})
            </button>
            <button
              onClick={() => setActiveQueueTab('pending')}
              style={{
                padding: '7px 14px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 700,
                border: '1px solid', cursor: 'pointer',
                background: activeQueueTab === 'pending' ? '#f59e0b' : '#ffffff',
                color: activeQueueTab === 'pending' ? '#ffffff' : '#d97706',
                borderColor: activeQueueTab === 'pending' ? '#f59e0b' : '#fde68a'
              }}
            >
              🔔 Requests ({pendingCount})
            </button>
            <button
              onClick={() => setActiveQueueTab('waiting')}
              style={{
                padding: '7px 14px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 700,
                border: '1px solid', cursor: 'pointer',
                background: activeQueueTab === 'waiting' ? '#10b981' : '#ffffff',
                color: activeQueueTab === 'waiting' ? '#ffffff' : '#059669',
                borderColor: activeQueueTab === 'waiting' ? '#10b981' : '#a7f3d0'
              }}
            >
              🧑‍⚕️ Confirmed OPD ({waitingCount})
            </button>
            <button
              onClick={() => setActiveQueueTab('urgent')}
              style={{
                padding: '7px 14px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 700,
                border: '1px solid', cursor: 'pointer',
                background: activeQueueTab === 'urgent' ? '#ef4444' : '#ffffff',
                color: activeQueueTab === 'urgent' ? '#ffffff' : '#dc2626',
                borderColor: activeQueueTab === 'urgent' ? '#ef4444' : '#fecaca'
              }}
            >
              🚨 High Risk ({urgentCount})
            </button>
            <button
              onClick={() => setActiveQueueTab('completed')}
              style={{
                padding: '7px 14px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 700,
                border: '1px solid', cursor: 'pointer',
                background: activeQueueTab === 'completed' ? '#0ea5e9' : '#ffffff',
                color: activeQueueTab === 'completed' ? '#ffffff' : '#0284c7',
                borderColor: activeQueueTab === 'completed' ? '#0ea5e9' : '#bae6fd'
              }}
            >
              ✓ Completed ({completedCount})
            </button>
            {rejectedCount > 0 && (
              <button
                onClick={() => setActiveQueueTab('rejected')}
                style={{
                  padding: '7px 14px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 700,
                  border: '1px solid', cursor: 'pointer',
                  background: activeQueueTab === 'rejected' ? '#dc2626' : '#ffffff',
                  color: activeQueueTab === 'rejected' ? '#ffffff' : '#991b1b',
                  borderColor: activeQueueTab === 'rejected' ? '#dc2626' : '#fecaca'
                }}
              >
                ❌ Rejected ({rejectedCount})
              </button>
            )}
          </div>

          {/* Patient Cards in Queue */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredQueue.length === 0 ? (
              <div style={{ background: '#ffffff', borderRadius: '16px', padding: '36px', textAlign: 'center', color: '#64748b', border: '1px solid #e2e8f0' }}>
                No patients found in this queue tab.
              </div>
            ) : (
              filteredQueue.map((item) => {
                const isPending = item.status === 'Pending';
                const isWaiting = item.status === 'Accepted' || item.status === 'Waiting';
                const isCompleted = item.status === 'Completed';
                const isRejected = item.status === 'Rejected';

                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.005 }}
                    style={{
                      background: '#ffffff', borderRadius: '18px', padding: '18px',
                      border: '1.5px solid',
                      borderColor: isPending ? '#fde68a' : isWaiting ? '#bfdbfe' : isCompleted ? '#bbf7d0' : '#fecaca',
                      borderLeft: `5px solid ${isPending ? '#f59e0b' : isWaiting ? '#2563eb' : isCompleted ? '#10b981' : '#ef4444'}`,
                      boxShadow: '0 2px 12px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          background: item.priority === 'Urgent' ? '#fee2e2' : isPending ? '#fef3c7' : '#eff6ff',
                          color: item.priority === 'Urgent' ? '#dc2626' : isPending ? '#b45309' : '#2563eb',
                          borderRadius: '12px', padding: '6px 12px', textAlign: 'center',
                          fontWeight: 900, fontSize: '0.72rem', border: '1px solid #cbd5e1'
                        }}>
                          TOKEN<br /><span style={{ fontSize: '1.2rem' }}>{item.token}</span>
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 850, color: '#0f172a', margin: 0 }}>
                              {item.patient_name}
                            </h3>
                            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>({item.age_gender})</span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '2px' }}>
                            <span>📞 {item.phone}</span> • <span>⏰ Slot: <strong>{item.slot}</strong></span> • <span>Fee: ₹{item.fee}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Action Buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        {isPending && (
                          <>
                            <button
                              onClick={() => handleAcceptAppointment(item.id)}
                              style={{
                                background: '#10b981', color: '#ffffff', border: 'none',
                                padding: '6px 14px', borderRadius: '8px', fontSize: '0.76rem',
                                fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                              }}
                            >
                              ✓ Accept
                            </button>
                            <button
                              onClick={() => handleRejectAppointment(item.id)}
                              style={{
                                background: '#fff', color: '#dc2626', border: '1px solid #fca5a5',
                                padding: '6px 12px', borderRadius: '8px', fontSize: '0.76rem',
                                fontWeight: 800, cursor: 'pointer'
                              }}
                            >
                              ✕ Reject
                            </button>
                          </>
                        )}

                        {isWaiting && (
                          <button
                            onClick={() => handleMarkCompleted(item.id)}
                            style={{
                              background: '#16a34a', color: '#ffffff', border: 'none',
                              padding: '6px 14px', borderRadius: '8px', fontSize: '0.76rem',
                              fontWeight: 700, cursor: 'pointer'
                            }}
                          >
                            ✓ Mark Done
                          </button>
                        )}

                        {isCompleted && (
                          <span style={{ background: '#dcfce7', color: '#16a34a', border: '1px solid #bbf7d0', padding: '4px 10px', borderRadius: '12px', fontSize: '0.74rem', fontWeight: 700 }}>
                            ✓ Consultation Completed
                          </span>
                        )}

                        {isRejected && (
                          <button
                            onClick={() => handleAcceptAppointment(item.id)}
                            style={{
                              background: '#f8fafc', color: '#2563eb', border: '1px solid #bfdbfe',
                              padding: '5px 10px', borderRadius: '8px', fontSize: '0.74rem',
                              fontWeight: 700, cursor: 'pointer'
                            }}
                          >
                            ↺ Re-Accept
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Complaints & AI Summary Box */}
                    <div style={{ marginTop: '12px', background: '#f8fafc', padding: '12px 14px', borderRadius: '12px', fontSize: '0.8rem', lineHeight: 1.5 }}>
                      <div style={{ color: '#0f172a', marginBottom: '4px' }}>
                        <strong>Chief Complaints:</strong> {item.complaints}
                      </div>
                      <div style={{ color: item.priority === 'Urgent' ? '#991b1b' : '#1e40af' }}>
                        <strong>AI Clinical Summary:</strong> {item.ai_summary}
                      </div>
                      {item.rejectionReason && (
                        <div style={{ color: '#dc2626', marginTop: '4px' }}>
                          <strong>Rejection Reason:</strong> {item.rejectionReason}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Section: OPD Slots Manager */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '22px', border: '1px solid #e2e8f0', padding: '22px', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 850, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>⏰</span> OPD Slots Manager
              </h3>
              <span style={{ fontSize: '0.72rem', background: '#eff6ff', color: '#2563eb', padding: '3px 8px', borderRadius: '10px', fontWeight: 700 }}>
                Live OPD
              </span>
            </div>

            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 14px 0' }}>
              Real-time tracker of today's booked vs free appointment slots for {doctorName}.
            </p>

            <div style={{ fontSize: '0.78rem', color: '#475569', marginBottom: '12px' }}>
              <div>🌅 <strong>Morning:</strong> 09:30 AM – 01:15 PM</div>
              <div>🌆 <strong>Evening:</strong> 04:30 PM – 08:15 PM</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
              {allDaySlots.map((time, sIdx) => {
                const bookedPatient = bookedSlotMap[time];
                const isBooked = Boolean(bookedPatient);

                return (
                  <div
                    key={sIdx}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '8px 12px', borderRadius: '10px', fontSize: '0.78rem',
                      background: isBooked ? '#fef2f2' : '#f0fdf4',
                      border: `1px solid ${isBooked ? '#fecaca' : '#bbf7d0'}`,
                      color: isBooked ? '#991b1b' : '#166534'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isBooked ? '#ef4444' : '#10b981' }}></span>
                      <span>{time}</span>
                    </div>

                    <span style={{ fontSize: '0.72rem', fontWeight: 800 }}>
                      {isBooked ? `🔴 Booked (${bookedPatient.patient_name})` : '🟢 Free'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
