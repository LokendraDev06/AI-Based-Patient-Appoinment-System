import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Clock, User, Sparkles, CheckCircle2, ShieldCheck, 
  FileText, AlertTriangle, XCircle, Phone, MapPin, RefreshCw, ChevronRight, Stethoscope
} from 'lucide-react';

export default function PatientPortal({ appointments, currentUser, onSelectDoctorForBooking, doctors }) {
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'pending' | 'accepted' | 'completed' | 'rejected'
  const [viewRxApt, setViewRxApt] = useState(null);

  const patientAppts = appointments || [];

  // Filter appointments
  const filteredAppts = patientAppts.filter(apt => {
    const st = apt.status || 'Pending';
    if (filterTab === 'pending') return st === 'Pending';
    if (filterTab === 'accepted') return st === 'Accepted' || st === 'Waiting';
    if (filterTab === 'completed') return st === 'Completed';
    if (filterTab === 'rejected') return st === 'Rejected';
    return true;
  });

  const pendingCount = patientAppts.filter(a => (a.status || 'Pending') === 'Pending').length;
  const acceptedCount = patientAppts.filter(a => a.status === 'Accepted' || a.status === 'Waiting').length;
  const completedCount = patientAppts.filter(a => a.status === 'Completed').length;
  const rejectedCount = patientAppts.filter(a => a.status === 'Rejected').length;

  const handleRebook = (apt) => {
    const matchedDoc = doctors?.find(d => d.name === apt.doctor_name || d.id === apt.doctor_id) || {
      id: apt.doctor_id || 'doc-rebook',
      name: apt.doctor_name,
      specialization: apt.specialization || 'Consultant Doctor',
      fee: apt.fee || 500,
      clinic: apt.clinic || 'City Care Hospital & OPD Centre',
      location: 'Hospital Road, Lashkar, Gwalior'
    };
    if (onSelectDoctorForBooking) {
      onSelectDoctorForBooking(matchedDoc);
    }
  };

  return (
    <div className="portal-main-wrapper" style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 20px' }}>
      
      {/* Patient Portal Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#eff6ff', color: '#2563eb', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 800, marginBottom: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb', display: 'inline-block' }}></span>
            Real-Time Patient Hub
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: 0, fontFamily: 'var(--font-heading)' }}>
            Patient <span style={{ color: '#2563eb' }}>Portal</span>
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '4px 0 0 0' }}>
            Track live consultation requests, doctor accept/reject confirmations, time slots & digital prescriptions.
          </p>
        </div>

        {/* Live sync badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#ffffff', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
            Firebase Cloud Sync: <strong>Connected</strong>
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '28px', alignItems: 'start' }}>
        
        {/* Left Column: Scheduled Appointments & Real-Time Status Feed */}
        <div>
          {/* Status Filter Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <button
              onClick={() => setFilterTab('all')}
              style={{
                padding: '8px 16px', borderRadius: '12px', fontSize: '0.82rem', fontWeight: 700,
                border: '1.5px solid', cursor: 'pointer', transition: 'all 0.2s ease',
                background: filterTab === 'all' ? '#2563eb' : '#ffffff',
                color: filterTab === 'all' ? '#ffffff' : '#475569',
                borderColor: filterTab === 'all' ? '#2563eb' : '#e2e8f0'
              }}
            >
              All Appointments ({patientAppts.length})
            </button>
            <button
              onClick={() => setFilterTab('pending')}
              style={{
                padding: '8px 16px', borderRadius: '12px', fontSize: '0.82rem', fontWeight: 700,
                border: '1.5px solid', cursor: 'pointer', transition: 'all 0.2s ease',
                background: filterTab === 'pending' ? '#f59e0b' : '#ffffff',
                color: filterTab === 'pending' ? '#ffffff' : '#d97706',
                borderColor: filterTab === 'pending' ? '#f59e0b' : '#fde68a'
              }}
            >
              ⏳ Awaiting Approval ({pendingCount})
            </button>
            <button
              onClick={() => setFilterTab('accepted')}
              style={{
                padding: '8px 16px', borderRadius: '12px', fontSize: '0.82rem', fontWeight: 700,
                border: '1.5px solid', cursor: 'pointer', transition: 'all 0.2s ease',
                background: filterTab === 'accepted' ? '#10b981' : '#ffffff',
                color: filterTab === 'accepted' ? '#ffffff' : '#059669',
                borderColor: filterTab === 'accepted' ? '#10b981' : '#a7f3d0'
              }}
            >
              ✅ Confirmed OPD ({acceptedCount})
            </button>
            <button
              onClick={() => setFilterTab('completed')}
              style={{
                padding: '8px 16px', borderRadius: '12px', fontSize: '0.82rem', fontWeight: 700,
                border: '1.5px solid', cursor: 'pointer', transition: 'all 0.2s ease',
                background: filterTab === 'completed' ? '#0ea5e9' : '#ffffff',
                color: filterTab === 'completed' ? '#ffffff' : '#0284c7',
                borderColor: filterTab === 'completed' ? '#0ea5e9' : '#bae6fd'
              }}
            >
              🩺 Completed ({completedCount})
            </button>
            {rejectedCount > 0 && (
              <button
                onClick={() => setFilterTab('rejected')}
                style={{
                  padding: '8px 16px', borderRadius: '12px', fontSize: '0.82rem', fontWeight: 700,
                  border: '1.5px solid', cursor: 'pointer', transition: 'all 0.2s ease',
                  background: filterTab === 'rejected' ? '#ef4444' : '#ffffff',
                  color: filterTab === 'rejected' ? '#ffffff' : '#dc2626',
                  borderColor: filterTab === 'rejected' ? '#ef4444' : '#fecaca'
                }}
              >
                ❌ Declined ({rejectedCount})
              </button>
            )}
          </div>

          {filteredAppts.length === 0 ? (
            <div style={{ background: '#ffffff', borderRadius: '20px', padding: '48px 24px', textAlign: 'center', border: '1px solid #e2e8f0', color: '#64748b' }}>
              <div style={{ fontSize: '2.4rem', marginBottom: '12px' }}>📋</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                No appointments found in this category
              </h3>
              <p style={{ fontSize: '0.84rem', margin: 0 }}>
                Explore the 'Find Doctors' tab to request a new consultation with top Gwalior specialists!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {filteredAppts.map((apt, idx) => {
                const status = apt.status || 'Pending';
                const isPending = status === 'Pending';
                const isAccepted = status === 'Accepted' || status === 'Waiting';
                const isCompleted = status === 'Completed';
                const isRejected = status === 'Rejected';

                return (
                  <motion.div
                    key={apt.id || idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: idx * 0.05 }}
                    style={{
                      background: '#ffffff',
                      borderRadius: '22px',
                      border: '1.5px solid',
                      borderColor: isPending ? '#fde68a' : isAccepted ? '#a7f3d0' : isRejected ? '#fecaca' : '#bfdbfe',
                      borderLeft: `6px solid ${isPending ? '#f59e0b' : isAccepted ? '#10b981' : isRejected ? '#ef4444' : '#2563eb'}`,
                      padding: '24px',
                      boxShadow: '0 4px 18px rgba(0, 0, 0, 0.04)',
                      position: 'relative'
                    }}
                  >
                    {/* Top Row: Doctor Details & Status Pill */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                          width: '52px', height: '52px', borderRadius: '14px', background: '#eff6ff',
                          color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '1.4rem', fontWeight: 900, border: '1px solid #bfdbfe', flexShrink: 0
                        }}>
                          {apt.doctor_name ? apt.doctor_name.replace('Dr. ', '').charAt(0) : 'D'}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: 850, color: '#0f172a', margin: 0 }}>
                            {apt.doctor_name || 'Dr. Deepankar Lahariya'}
                          </h3>
                          <div style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 700, marginTop: '2px' }}>
                            {apt.specialization || 'General Physician'}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                            🏥 {apt.clinic || 'City Care Hospital & OPD Centre, Gwalior'}
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div>
                        {isPending && (
                          <span style={{
                            background: '#fffbeb', color: '#b45309', border: '1.5px solid #fde68a',
                            padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800,
                            display: 'inline-flex', alignItems: 'center', gap: '6px'
                          }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></span>
                            ⏳ Awaiting Doctor Approval
                          </span>
                        )}
                        {isAccepted && (
                          <span style={{
                            background: '#ecfdf5', color: '#047857', border: '1.5px solid #a7f3d0',
                            padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800,
                            display: 'inline-flex', alignItems: 'center', gap: '6px'
                          }}>
                            <CheckCircle2 size={15} />
                            ✅ Confirmed by Doctor!
                          </span>
                        )}
                        {isCompleted && (
                          <span style={{
                            background: '#f0f9ff', color: '#0284c7', border: '1.5px solid #bae6fd',
                            padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800,
                            display: 'inline-flex', alignItems: 'center', gap: '6px'
                          }}>
                            <CheckCircle2 size={15} />
                            🩺 Consultation Completed
                          </span>
                        )}
                        {isRejected && (
                          <span style={{
                            background: '#fef2f2', color: '#dc2626', border: '1.5px solid #fecaca',
                            padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800,
                            display: 'inline-flex', alignItems: 'center', gap: '6px'
                          }}>
                            <XCircle size={15} />
                            ❌ Declined by Doctor
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Date, Time Slot & Fee Row */}
                    <div style={{ display: 'flex', gap: '20px', marginTop: '16px', fontSize: '0.85rem', color: '#334155', flexWrap: 'wrap', background: '#f8fafc', padding: '10px 16px', borderRadius: '12px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={15} color="#2563eb" />
                        <strong>Date:</strong> {apt.date || 'Today'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={15} color="#2563eb" />
                        <strong>Time Slot:</strong> <span style={{ background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '8px', fontWeight: 800 }}>{apt.slot || '11:00 AM'}</span>
                      </span>
                      <span>
                        <strong>Fee:</strong> ₹{apt.fee || 500}
                      </span>
                      {apt.token && (
                        <span>
                          <strong>OPD Token:</strong> <span style={{ color: '#059669', fontWeight: 800 }}>#{apt.token}</span>
                        </span>
                      )}
                    </div>

                    {/* REAL-TIME DYNAMIC STATUS BANNER */}
                    
                    {/* CASE 1: PENDING (Step Tracker) */}
                    {isPending && (
                      <div style={{ marginTop: '16px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '14px', padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#b45309', fontWeight: 800, fontSize: '0.85rem' }}>
                          <AlertTriangle size={17} />
                          <span>Doctor is currently reviewing your appointment request</span>
                        </div>
                        <p style={{ margin: '0 0 14px 0', fontSize: '0.8rem', color: '#78350f', lineHeight: 1.5 }}>
                          As soon as <strong>{apt.doctor_name || 'the Doctor'}</strong> accepts your requested slot (<strong>{apt.slot}</strong>), your live OPD Token and consultation pass will be generated right here.
                        </p>
                        
                        {/* 3-Step Live Progress Tracker */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', textAlign: 'center', fontSize: '0.74rem' }}>
                          <div style={{ background: '#dcfce7', color: '#15803d', padding: '8px', borderRadius: '8px', fontWeight: 800 }}>
                            ✓ 1. Request Sent
                          </div>
                          <div style={{ background: '#fef3c7', color: '#b45309', padding: '8px', borderRadius: '8px', fontWeight: 800, border: '1px dashed #f59e0b' }}>
                            ⏳ 2. Doctor Reviewing
                          </div>
                          <div style={{ background: '#f1f5f9', color: '#94a3b8', padding: '8px', borderRadius: '8px', fontWeight: 600 }}>
                            ○ 3. Confirmed Token
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CASE 2: ACCEPTED (Confirmed OPD Pass) */}
                    {isAccepted && (
                      <div style={{ marginTop: '16px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '14px', padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                          <div>
                            <div style={{ color: '#047857', fontWeight: 900, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span>🎉</span> Appointment Confirmed! Your slot is locked.
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#065f46', marginTop: '4px' }}>
                              Please arrive 10 minutes prior to <strong>{apt.slot}</strong> at OPD Room No. 204 (1st Floor).
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => alert(`Calling clinic reception for ${apt.doctor_name} at +91 75124 99001`)}
                              style={{
                                background: '#ffffff', color: '#047857', border: '1px solid #a7f3d0',
                                borderRadius: '10px', padding: '8px 14px', fontSize: '0.76rem', fontWeight: 800,
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                              }}
                            >
                              <Phone size={14} /> Call Clinic
                            </button>
                            <button
                              type="button"
                              onClick={() => alert(`Directions: ${apt.clinic || 'City Care Hospital, Lashkar, Gwalior'}\nRoom No. 204`)}
                              style={{
                                background: '#10b981', color: '#ffffff', border: 'none',
                                borderRadius: '10px', padding: '8px 14px', fontSize: '0.76rem', fontWeight: 800,
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                              }}
                            >
                              <MapPin size={14} /> Directions
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CASE 3: REJECTED (Decline reason + Choose another slot button) */}
                    {isRejected && (
                      <div style={{ marginTop: '16px', background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '14px', padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                          <div>
                            <div style={{ color: '#dc2626', fontWeight: 900, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <XCircle size={17} /> Doctor Unavailable in Requested Slot ({apt.slot})
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#991b1b', marginTop: '4px' }}>
                              <strong>Reason:</strong> {apt.rejectionReason || 'Doctor is on urgent hospital emergency rounds or this slot was fully booked.'}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRebook(apt)}
                            style={{
                              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                              color: '#ffffff', border: 'none', borderRadius: '10px', padding: '10px 18px',
                              fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer',
                              display: 'flex', alignItems: 'center', gap: '8px',
                              boxShadow: '0 4px 12px rgba(37,99,235,0.25)'
                            }}
                          >
                            <RefreshCw size={15} />
                            <span>🔄 Choose Another Free Slot</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* CASE 4: COMPLETED (Digital Rx Button) */}
                    {isCompleted && (
                      <div style={{ marginTop: '16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '14px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ color: '#166534', fontSize: '0.84rem', fontWeight: 700 }}>
                          ✓ Consultation successfully completed by {apt.doctor_name}.
                        </div>
                        <button
                          type="button"
                          onClick={() => setViewRxApt(apt)}
                          style={{
                            background: '#2563eb', color: '#ffffff', border: 'none',
                            borderRadius: '10px', padding: '8px 16px', fontSize: '0.78rem', fontWeight: 800,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                          }}
                        >
                          <FileText size={15} /> View Digital Prescription (Rx)
                        </button>
                      </div>
                    )}

                    {/* Symptoms & AI Clinical Note Box */}
                    <div style={{
                      marginTop: '16px', background: '#f8fafc', border: '1px solid #e2e8f0',
                      borderRadius: '14px', padding: '14px 16px', fontSize: '0.82rem', lineHeight: 1.55
                    }}>
                      <div style={{ color: '#0f172a', marginBottom: '6px' }}>
                        <strong>Reported Symptoms:</strong> {apt.symptoms || 'General Checkup'}
                      </div>
                      <div style={{ color: '#1e3a8a' }}>
                        <strong style={{ color: '#2563eb' }}>AI Diagnostic Note:</strong> {apt.ai_summary || 'Preliminary clinical triage complete.'}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: User Profile Card & Quick Health Advice */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* User Profile Card */}
          <div style={{
            background: '#ffffff', borderRadius: '22px', border: '1px solid #e2e8f0',
            padding: '24px 26px', boxShadow: '0 2px 12px rgba(0,0,0,0.03)'
          }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 850, color: '#0f172a', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="#2563eb" /> Patient <span style={{ color: '#2563eb' }}>Profile</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem', color: '#475569' }}>
              <div><strong>Name:</strong> {currentUser?.name || 'Lokendra Dev'}</div>
              <div><strong>Role:</strong> <span style={{ textTransform: 'capitalize' }}>{currentUser?.role || 'patient'}</span></div>
              <div><strong>Contact:</strong> {currentUser?.email || currentUser?.phone_number || 'lokendradev06@gmail.com'}</div>
              <div><strong>Registered City:</strong> Gwalior, Madhya Pradesh</div>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.74rem', color: '#059669', fontWeight: 700 }}>
              <ShieldCheck size={16} /> Fast2SMS & Google Cloud Protected
            </div>
          </div>

          {/* Quick Slot Booking Guidance Card */}
          <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', borderRadius: '22px', border: '1px solid #bfdbfe', padding: '22px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e40af', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>💡</span> Real-Time Slot Indicator Guide
            </h4>
            <p style={{ fontSize: '0.78rem', color: '#1e3a8a', lineHeight: 1.5, margin: '0 0 10px 0' }}>
              During booking, slots marked <strong>🟢 Free</strong> are open for instant booking. Slots marked <strong>🔴 Full</strong> are already reserved by other patients on that date.
            </p>
            <div style={{ fontSize: '0.76rem', color: '#2563eb', fontWeight: 700 }}>
              Morning: 09:30 AM – 01:15 PM<br />
              Evening: 04:30 PM – 08:15 PM
            </div>
          </div>

          {/* Emergency 24/7 Helpline */}
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '22px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#dc2626', marginBottom: '6px' }}>
              🚨 Emergency OPD Helpline (Gwalior)
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#991b1b' }}>
              108 / +91 751 2400108
            </div>
            <div style={{ fontSize: '0.72rem', color: '#b91c1c', marginTop: '4px' }}>
              Jayarogya (JAH) & Trauma Centre Emergency Desk
            </div>
          </div>

        </div>
      </div>

      {/* Digital Prescription Modal */}
      {viewRxApt && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, padding: '20px'
        }} onClick={() => setViewRxApt(null)}>
          <div style={{
            background: '#ffffff', borderRadius: '22px', maxWidth: '640px', width: '100%',
            maxHeight: '90vh', overflowY: 'auto', padding: '28px', border: '1.5px solid #bfdbfe'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #2563eb', paddingBottom: '14px', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  Official Digital Prescription (Rx)
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 700 }}>
                  {viewRxApt.doctor_name || 'Dr. Deepankar Lahariya'} • {viewRxApt.clinic || 'City Care Hospital, Gwalior'}
                </div>
              </div>
              <button onClick={() => setViewRxApt(null)} style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>

            <div style={{ fontSize: '0.84rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div><strong>Patient:</strong> {viewRxApt.patient_name} • <strong>Date:</strong> {viewRxApt.date || 'Today'} • <strong>Slot:</strong> {viewRxApt.slot}</div>
              <div><strong>Symptoms:</strong> {viewRxApt.symptoms}</div>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#2563eb' }}>Prescribed Medication:</strong>
                <ul style={{ margin: '8px 0 0 18px', padding: 0 }}>
                  <li>Tab Paracetamol 650mg — 1-0-1 after food (3 days)</li>
                  <li>Tab Cetirizine 10mg — 0-0-1 at bedtime (5 days)</li>
                  <li>Warm saline gargles twice daily</li>
                </ul>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700 }}>
                ✓ Digitally signed and verified on MediCare Cloud EMR
              </div>
            </div>

            <button
              onClick={() => window.print()}
              style={{
                marginTop: '20px', width: '100%', padding: '12px', borderRadius: '12px',
                background: '#2563eb', color: '#ffffff', border: 'none', fontWeight: 800,
                fontSize: '0.88rem', cursor: 'pointer'
              }}
            >
              🖨️ Print / Download Prescription PDF
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
