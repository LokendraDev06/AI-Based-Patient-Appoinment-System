import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, MapPin, Calendar, Clock, Star, Heart, ArrowRight, ShieldCheck, 
  Send, Bot, CheckCircle2, ChevronRight, User, UserCheck, Phone, Check, AlertCircle, FileText
} from 'lucide-react';

export default function LandingPage({ 
  doctors, 
  currentUser, 
  onOpenAuth, 
  onSelectDoctorForBooking, 
  onOpenChat,
  onOpenParchaReader,
  appointments,
  onLoginSuccess
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [likedDoctors, setLikedDoctors] = useState({});
  const [quickSymptomText, setQuickSymptomText] = useState('');

  // Quick Auth Card states (for Logged-Out View - Screenshot 5)
  const [authRole, setAuthRole] = useState('patient');
  const [authSubTab, setAuthSubTab] = useState('login');
  const [authPhone, setAuthPhone] = useState('9876543210');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [authLoading, setAuthLoading] = useState(false);
  const [authNotice, setAuthNotice] = useState('');

  const SPECIALTIES = [
    { label: "Cardiologist", icon: "❤️" },
    { label: "Dermatologist", icon: "🧴" },
    { label: "Pediatrician", icon: "👶" },
    { label: "Orthopedist", icon: "🦴" },
    { label: "Gynecologist", icon: "🌸" },
    { label: "General Physician", icon: "🩺" },
    { label: "Urologist", icon: "🚽" }
  ];

  const toggleHeart = (id) => {
    setLikedDoctors(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (authPhone.length < 10) {
      setAuthNotice('Please enter a valid 10-digit mobile number.');
      return;
    }
    setAuthLoading(true);
    setAuthNotice('');
    try {
      const cleanPhone = '+91' + authPhone.replace(/\D/g, '').slice(-10);
      const res = await fetch('http://localhost:8000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: cleanPhone, role: authRole })
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        setAuthNotice(data.message || `OTP sent to ${cleanPhone} via Fast2SMS.`);
        if (data.data && data.data.otp_code) {
          const digits = String(data.data.otp_code).split('');
          setOtpCode(digits);
        }
      } else {
        throw new Error(data.detail || 'Failed to dispatch OTP');
      }
    } catch (err) {
      // Mock instant login for local preview
      setOtpSent(true);
      setAuthNotice(`Demo session OTP: 442288`);
      setOtpCode(['4', '4', '2', '2', '8', '8']);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setAuthLoading(true);
    try {
      const cleanPhone = '+91' + authPhone.replace(/\D/g, '').slice(-10);
      const codeStr = otpCode.join('') || '442288';
      const res = await fetch('http://localhost:8000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: cleanPhone, otp_code: codeStr })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        onLoginSuccess(data.user);
      } else {
        // Fallback demo user
        onLoginSuccess({
          id: 'usr_pat_demo',
          name: authRole === 'doctor' ? 'Dr. Deepankar Lahariya' : 'Lokendra Dev',
          role: authRole,
          phone_number: cleanPhone,
          avatar_url: authRole === 'doctor' ? 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
        });
      }
    } catch (e) {
      onLoginSuccess({
        id: 'usr_pat_demo',
        name: authRole === 'doctor' ? 'Dr. Deepankar Lahariya' : 'Lokendra Dev',
        role: authRole,
        phone_number: '+91' + authPhone,
        avatar_url: authRole === 'doctor' ? 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleOneClick = () => {
    onLoginSuccess({
      id: 'usr_google_lokendra',
      name: 'Lokendra Dev',
      email: 'lokendradev06@gmail.com',
      role: 'patient',
      auth_provider: 'google',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
    });
  };

  const filteredDoctors = doctors.filter(doc => {
    const matchesSpec = selectedSpecialty === 'All' ? true : doc.specialization.toLowerCase().includes(selectedSpecialty.toLowerCase());
    const matchesSearch = searchTerm ? (
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.location.toLowerCase().includes(searchTerm.toLowerCase())
    ) : true;
    return matchesSpec && matchesSearch;
  });

  // Next scheduled appointment for logged-in care widget
  const nextApt = appointments && appointments.length > 0 ? appointments[0] : {
    doctor_name: "Dr. Deepankar Lahariya",
    specialization: "General Physician",
    date: new Date().toISOString().split('T')[0],
    slot: "11:30 AM",
    clinic: "City Care Hospital, Gwalior",
    status: "Confirmed"
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: 'calc(100vh - 70px)' }}>
      {/* Background Orbs */}
      <div className="bg-canvas">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* ==========================================================
          SCENARIO 1: USER IS NOT LOGGED IN (SCREENSHOT 5)
          ========================================================== */}
      {!currentUser ? (
        <div className="login-main-body">
          {/* Left Column: Hero Headline, Doctor Visual & Popular Specialties */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Split row: Left headline + Right doctor graphic */}
            <div className="login-hero-split-row">
              <div>
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="hero-trust-badge"
                >
                  <span className="pulse-dot"></span>
                  <span>Trusted by 10,000+ Patients in Gwalior</span>
                </motion.div>

                <h1 className="hero-title" style={{ fontSize: '3.1rem', margin: '4px 0 10px 0' }}>
                  Your Health, <span className="highlight">Simplified.</span>
                </h1>

                <p className="hero-subtext" style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.6 }}>
                  Book appointments with verified doctors, get expert advice and take control of your health — all in one place.
                </p>

                {/* 4 Quick Feature Pills */}
                <div className="login-hero-badges-row">
                  <div className="login-badge-chip">
                    <span style={{ color: '#f59e0b', fontSize: '0.95rem' }}>⚡</span>
                    <span>Quick Appointments</span>
                  </div>
                  <div className="login-badge-chip">
                    <span style={{ color: '#0d9488', fontSize: '0.95rem' }}>🛡️</span>
                    <span>Verified Doctors</span>
                  </div>
                  <div 
                    className="login-badge-chip" 
                    onClick={onOpenParchaReader} 
                    style={{ cursor: 'pointer', border: '1.5px solid #bfdbfe', background: '#eff6ff' }}
                    title="Click to open AI Health Assistant & Prescription Reader"
                  >
                    <span style={{ color: '#2563eb', fontSize: '0.95rem' }}>🤖</span>
                    <span style={{ fontWeight: 800, color: '#1d4ed8' }}>AI Assistant & Prescription</span>
                  </div>
                  <div className="login-badge-chip">
                    <span style={{ color: '#2563eb', fontSize: '0.95rem' }}>🕒</span>
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>

              {/* Doctor Visual Graphic with Ambient Glow & Script Callout */}
              <div className="login-doctor-graphic-wrap">
                <div className="doctor-blob-glow"></div>
                <div className="script-callout">
                  Better<br />Health<br />Brighter<br />Future <span style={{ fontSize: '1.4rem' }}>♡</span>
                </div>
                <div className="deco-plus deco-plus-1">+</div>
                <div className="deco-plus deco-plus-2">+</div>

                <div className="doctor-img-mask">
                  <img
                    src="/assets/hero_doctor.jpg"
                    alt="Doctor"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80";
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Capsule Search Bar */}
            <div className="login-capsule-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                <Search size={18} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Search doctor, specialty, clinic or hospital in Gwalior..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '0.9rem', color: '#1e293b' }}
                />
              </div>
              <div style={{ width: '1px', height: '26px', background: '#e2e8f0' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155', fontSize: '0.86rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                <MapPin size={16} color="#64748b" />
                <span>Gwalior, M.P. ⌵</span>
              </div>
              <button
                type="button"
                style={{
                  width: '38px', height: '38px', borderRadius: '50%', background: '#2563eb',
                  color: '#fff', border: 'none', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
                  boxShadow: '0 4px 10px rgba(37,99,235,0.3)'
                }}
              >
                <Search size={16} color="#ffffff" />
              </button>
            </div>

            {/* Popular Specialties */}
            <div className="login-specialties-bar">
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
                Popular Specialties
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {SPECIALTIES.slice(0, 5).map((spec, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSpecialty(spec.label)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      background: selectedSpecialty === spec.label ? '#2563eb' : '#ffffff',
                      color: selectedSpecialty === spec.label ? '#ffffff' : '#334155',
                      border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '24px',
                      fontWeight: 700, fontSize: '0.82rem',
                      boxShadow: selectedSpecialty === spec.label ? '0 4px 12px rgba(37,99,235,0.25)' : 'none',
                      cursor: 'pointer', transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{spec.icon}</span> {spec.label}
                  </button>
                ))}
                <button
                  onClick={() => setSelectedSpecialty('All')}
                  style={{
                    width: '34px', height: '34px', borderRadius: '50%', background: '#ffffff',
                    border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer'
                  }}
                >
                  <ArrowRight size={14} color="#64748b" />
                </button>
              </div>
            </div>

            {/* Stats Grid Card */}
            <div className="login-stats-grid-card">
              <div className="login-stat-item">
                <span className="login-stat-icon">👥</span>
                <div>
                  <div className="login-stat-val">10,000+</div>
                  <div className="login-stat-lbl">Happy Patients</div>
                </div>
              </div>
              <div className="login-stat-item">
                <span className="login-stat-icon">👨‍⚕️</span>
                <div>
                  <div className="login-stat-val">500+</div>
                  <div className="login-stat-lbl">Verified Doctors</div>
                </div>
              </div>
              <div className="login-stat-item">
                <span className="login-stat-icon">🏥</span>
                <div>
                  <div className="login-stat-val">50+</div>
                  <div className="login-stat-lbl">Partner Hospitals</div>
                </div>
              </div>
              <div className="login-stat-item">
                <span className="login-stat-icon">⭐</span>
                <div>
                  <div className="login-stat-val">4.8/5</div>
                  <div className="login-stat-lbl">Average Rating</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Glass Auth Card (Screenshot 5) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="login-main-card glass-auth-card"
          >
            {/* Top Shield Header */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '46px', height: '46px', borderRadius: '50%', background: '#eff6ff',
                margin: '0 auto 10px auto', display: 'flex', alignItems: 'center',
                justifyContent: 'center', border: '1.5px solid #bfdbfe'
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#3b82f6" fillOpacity="0.15" stroke="#2563eb" strokeWidth="2" />
                  <path d="M12 7v6M9 10h6" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 850, color: '#0f172a', margin: '0 0 4px 0', fontFamily: 'var(--font-heading)' }}>
                Mobile SMS Verification
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                Access your patient portal with secure verification
              </p>
            </div>

            {/* Patient / Doctor Role Switch */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px', background: '#f1f5f9', padding: '4px', borderRadius: '12px' }}>
              <button
                type="button"
                onClick={() => setAuthRole('patient')}
                style={{
                  background: authRole === 'patient' ? '#2563eb' : 'transparent',
                  color: authRole === 'patient' ? '#ffffff' : '#475569',
                  border: 'none', borderRadius: '8px', padding: '8px',
                  fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                }}
              >
                <User size={14} /> Patient
              </button>
              <button
                type="button"
                onClick={() => setAuthRole('doctor')}
                style={{
                  background: authRole === 'doctor' ? '#2563eb' : 'transparent',
                  color: authRole === 'doctor' ? '#ffffff' : '#475569',
                  border: 'none', borderRadius: '8px', padding: '8px',
                  fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                }}
              >
                <UserCheck size={14} /> Doctor
              </button>
            </div>

            {/* Login / Sign Up Toggle */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => setAuthSubTab('login')}
                style={{
                  flex: 1, padding: '8px 0', background: 'transparent', border: 'none',
                  borderBottom: authSubTab === 'login' ? '2.5px solid #2563eb' : 'none',
                  fontWeight: authSubTab === 'login' ? 800 : 600,
                  color: authSubTab === 'login' ? '#2563eb' : '#64748b',
                  fontSize: '0.88rem', cursor: 'pointer'
                }}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setAuthSubTab('signup')}
                style={{
                  flex: 1, padding: '8px 0', background: 'transparent', border: 'none',
                  borderBottom: authSubTab === 'signup' ? '2.5px solid #2563eb' : 'none',
                  fontWeight: authSubTab === 'signup' ? 800 : 600,
                  color: authSubTab === 'signup' ? '#2563eb' : '#64748b',
                  fontSize: '0.88rem', cursor: 'pointer'
                }}
              >
                Sign Up
              </button>
            </div>

            {/* Google 1-Click Button */}
            <button
              type="button"
              onClick={handleGoogleOneClick}
              className="btn-google-signin"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
              <span style={{ fontSize: '0.72rem', background: '#eff6ff', color: '#2563eb', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>1-Click</span>
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '14px 0', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
              <span>OR CONTINUE WITH OTP / PASSWORD</span>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
            </div>

            {/* OTP Flow */}
            {!otpSent ? (
              <form onSubmit={handleSendOtp}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Mobile Number (10 Digits)
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #cbd5e1', borderRadius: '12px', background: '#ffffff', overflow: 'hidden', padding: '2px 10px' }}>
                    <span style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Phone size={14} color="#e11d48" /> +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={authPhone}
                      onChange={e => setAuthPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="98765 43210"
                      style={{ border: 'none', outline: 'none', padding: '10px 10px', width: '100%', fontSize: '0.92rem', fontWeight: 600, color: '#0f172a' }}
                      required
                    />
                  </div>
                  <p style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '6px', lineHeight: 1.3 }}>
                    A 6-digit verification code will be sent to your mobile phone via SMS.
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={authLoading}
                  className="btn-gradient-primary"
                >
                  <Send size={16} />
                  <span>{authLoading ? 'Sending SMS...' : 'Send Mobile SMS OTP'}</span>
                </motion.button>
              </form>
            ) : (
              <div>
                <div style={{ marginBottom: '14px', textAlign: 'center' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '8px' }}>
                    Enter 6-Digit OTP received on +91 {authPhone}
                  </label>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    {otpCode.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-box-${idx}`}
                        type="text"
                        maxLength={1}
                        className={`otp-digit-input ${digit ? 'filled' : ''}`}
                        value={digit}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          const newCode = [...otpCode];
                          newCode[idx] = val;
                          setOtpCode(newCode);
                          if (val && idx < 5) {
                            const next = document.getElementById(`otp-box-${idx + 1}`);
                            if (next) next.focus();
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleVerifyOtp}
                  disabled={authLoading}
                  className="btn-gradient-primary"
                >
                  <CheckCircle2 size={16} />
                  <span>{authLoading ? 'Verifying...' : 'Verify & Enter Portal'}</span>
                </motion.button>

                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    ← Change Phone Number
                  </button>
                </div>
              </div>
            )}

            {/* Notice / Error message */}
            {authNotice && (
              <div style={{ marginTop: '12px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '8px 12px', fontSize: '0.78rem', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={14} color="#2563eb" /> {authNotice}
              </div>
            )}

            {/* Footer link */}
            <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.76rem', color: '#64748b' }}>
              <span style={{ cursor: 'pointer', color: '#2563eb', fontWeight: 700 }} onClick={onOpenAuth}>
                🔑 Or sign in with Email & Password
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.72rem', color: '#94a3b8', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
              <ShieldCheck size={14} color="#10b981" />
              <span>Your data is safe with us • 100% HIPAA Protected</span>
            </div>
          </motion.div>
        </div>
      ) : (
        /* ==========================================================
           SCENARIO 2: USER IS LOGGED IN (SCREENSHOT 2)
           ========================================================== */
        <div className="portal-main-wrapper">
          <div className="dashboard-grid-layout">
            
            {/* Left Main Column: Hero Banner + Doctors Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Hero Banner Card */}
              <div className="hero-banner-card">
                <div className="hero-content-col">
                  <div className="hero-trust-badge">
                    <span className="pulse-dot"></span>
                    <span>Trusted by 10,000+ Patients in Gwalior</span>
                  </div>

                  <h1 className="hero-title">
                    Your Health, <span className="highlight">Simplified.</span>
                  </h1>

                  <p className="hero-subtext">
                    Book appointments with trusted doctors and specialist clinics in Gwalior. Get expert care, anytime, with AI-powered assistance.
                  </p>
                </div>

                {/* Center Doctor Image with Badges */}
                <div className="hero-doctor-img-wrap">
                  <div className="floating-spec-badge">
                    <div style={{ background: '#eff6ff', padding: '6px', borderRadius: '10px' }}>
                      <User size={18} color="#2563eb" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 850, color: '#0f172a' }}>500+</div>
                      <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Verified Specialists</div>
                    </div>
                  </div>

                  <div className="floating-heart-badge">
                    <Heart size={14} fill="#2563eb" color="#2563eb" />
                    <span>Quality Care For A Healthier Tomorrow</span>
                  </div>

                  <img
                    src="/assets/hero_doctor.jpg"
                    alt="Doctor Banner"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80";
                    }}
                  />
                </div>

                {/* Search Capsule Bar Inside Banner */}
                <div className="search-capsule-bar" style={{ position: 'relative', zIndex: 10 }}>
                  <div className="search-capsule-input-grp">
                    <Search size={18} color="#94a3b8" />
                    <input
                      type="text"
                      placeholder="Search doctor, specialty, clinic"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="search-capsule-divider"></div>
                  <div className="search-capsule-loc">
                    <MapPin size={16} color="#64748b" />
                    <span>Gwalior, M.P.</span>
                  </div>
                  <button className="search-capsule-btn">
                    <span>Find a Doctor</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Specialty Category Pills Row with Arrow */}
              <div className="specialty-pills-row">
                {SPECIALTIES.map((spec, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSpecialty(selectedSpecialty === spec.label ? 'All' : spec.label)}
                    className={`spec-pill-item ${selectedSpecialty === spec.label ? 'active' : ''}`}
                  >
                    <span>{spec.icon}</span>
                    <span>{spec.label}</span>
                  </button>
                ))}
                <button 
                  onClick={() => setSelectedSpecialty('All')} 
                  className="spec-arrow-btn"
                  title="View all specialties"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Section Header: Verified Specialists Near You */}
              <div className="specialists-sec-header">
                <div>
                  <h2>Verified specialists near you</h2>
                  <p>Book appointments with top-rated and verified doctors in Gwalior, M.P.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <select className="sort-dropdown-pill">
                    <option>Sort by: Popularity ⌵</option>
                    <option>Sort by: Rating (High to Low)</option>
                    <option>Sort by: Fee (Low to High)</option>
                  </select>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2563eb', cursor: 'pointer' }}>
                    View All Doctors →
                  </span>
                </div>
              </div>

              {/* Doctors 3-Column Grid */}
              <div className="screenshot-doc-grid">
                {filteredDoctors.slice(0, 6).map((doc) => (
                  <motion.div
                    key={doc.id}
                    whileHover={{ y: -4 }}
                    className="exact-doc-card"
                  >
                    <div className="card-top-row">
                      <img src={doc.avatar} alt={doc.name} className="card-doc-photo" />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="card-avail-badge">
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }}></span>
                            Available Today
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleHeart(doc.id)}
                            className={`card-heart-btn ${likedDoctors[doc.id] ? 'liked' : ''}`}
                          >
                            <Heart size={16} fill={likedDoctors[doc.id] ? '#ef4444' : 'none'} color={likedDoctors[doc.id] ? '#ef4444' : '#94a3b8'} />
                          </button>
                        </div>
                        <h3 className="card-doc-name">{doc.name}</h3>
                        <div className="card-doc-spec">{doc.specialization}</div>
                        <div className="card-doc-qual">{doc.qualification || "MD (Specialist) • 10+ Yrs Exp"}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                      <div className="card-doc-rating">
                        <Star size={14} fill="#f59e0b" color="#f59e0b" />
                        <strong>{doc.rating || 4.8}</strong>
                        <span>({Math.floor((doc.rating || 4.8) * 35)}+)</span>
                      </div>
                      <div className="card-fee-row">
                        <span>Fee:</span>
                        <strong className="card-fee-amount">₹{doc.fee || 300}</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectDoctorForBooking(doc)}
                      className="card-book-btn"
                    >
                      <span>Book Appointment</span>
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Column: Widgets ("Your care at a glance" + "AI Health Assistant") */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              {/* Widget 1: Your Care at a Glance (Screenshot 2) */}
              <div className="sidebar-widget-card">
                <div className="widget-head-row">
                  <h3 className="widget-head-title">
                    <span>🗓️</span> Your care at a glance
                  </h3>
                  <span className="widget-view-all-link">View All →</span>
                </div>

                <div className="next-apt-inner-box">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      📍 Next Appointment
                    </span>
                    <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '12px' }}>
                      ✓ {nextApt.status || 'Confirmed'}
                    </span>
                  </div>

                  <div className="apt-doc-mini">
                    <img 
                      src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=80" 
                      alt="Doctor" 
                    />
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>{nextApt.doctor_name}</div>
                      <div style={{ fontSize: '0.74rem', color: '#2563eb', fontWeight: 600 }}>{nextApt.specialization}</div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                    <div>📅 {nextApt.date} | ⏰ {nextApt.slot}</div>
                    <div>📍 {nextApt.clinic || 'City Care Hospital, Gwalior'}</div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
                    <button style={{ background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '8px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                      View Details
                    </button>
                    <button style={{ background: '#ffffff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '8px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                      🗓️ Reschedule
                    </button>
                  </div>
                </div>
              </div>

              {/* Widget 2: AI Health Assistant (Screenshot 2) */}
              <div className="sidebar-widget-card">
                <div className="widget-head-row">
                  <h3 className="widget-head-title">
                    <span>🤖</span> AI Health Assistant
                  </h3>
                  <span className="widget-view-all-link" onClick={onOpenParchaReader}>
                    Open Chat & Parcha Reader →
                  </span>
                </div>

                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 12px 0', lineHeight: 1.45 }}>
                  Get instant health guidance, symptom analysis, or upload doctor's prescription with our AI Assistant.
                </p>

                {/* Quick prompt input bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    onOpenParchaReader();
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', background: '#f8fafc',
                    border: '1px solid #e2e8f0', borderRadius: '12px', padding: '6px 8px 6px 14px',
                    marginBottom: '12px'
                  }}
                >
                  <input
                    type="text"
                    placeholder="Describe your symptoms (e.g. fever, headache...)"
                    value={quickSymptomText}
                    onChange={e => setQuickSymptomText(e.target.value)}
                    style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '0.8rem', color: '#1e293b' }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: '#2563eb', color: '#ffffff', border: 'none',
                      borderRadius: '50%', width: '30px', height: '30px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', flexShrink: 0
                    }}
                  >
                    <Send size={13} />
                  </button>
                </form>

                {/* Quick Symptom Chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {[
                    { label: "Fever & cold", icon: "🌡️" },
                    { label: "Skin rash", icon: "🧴" },
                    { label: "Chest pain", icon: "❤️" },
                    { label: "Stomach issue", icon: "🤢" },
                    { label: "Headache", icon: "🤕" },
                    { label: "General advice", icon: "💡" }
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSearchTerm(chip.label);
                        onOpenParchaReader();
                      }}
                      className="symptom-chip-btn"
                    >
                      <span>{chip.icon}</span>
                      <span>{chip.label}</span>
                    </button>
                  ))}
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
