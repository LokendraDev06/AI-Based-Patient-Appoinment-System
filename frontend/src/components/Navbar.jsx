import React from 'react';
import { motion } from 'motion/react';
import { Home, User, UserCheck, Bot, Bell, LogOut, LogIn, PhoneCall, Sun, Moon } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenAuth, onLogout, currentUser }) {
  return (
    <nav className="medicare-navbar">
      {/* Brand Logo & Tagline */}
      <div className="brand-box" onClick={() => setActiveTab('home')}>
        <div style={{
          width: '42px', height: '42px', borderRadius: '12px',
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(37,99,235,0.15)', border: '1.5px solid #bfdbfe'
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="#2563eb" strokeWidth="2.2" fill="none" />
            <path d="M12 7v6M9 10h6" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <h1 className="brand-title">MediCare</h1>
          <p className="brand-subtitle">Your Health, Our Priority</p>
        </div>
      </div>

      {/* Nav Center Tabs */}
      <div className="nav-center-pills">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`nav-pill-btn ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <Home size={16} />
          <span>Find Doctors</span>
          {activeTab === 'home' && (
            <motion.div
              layoutId="activeNavBadge"
              style={{
                position: 'absolute', inset: 0, borderRadius: '30px',
                background: '#eff6ff', zIndex: -1, border: '1px solid #bfdbfe'
              }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
        </motion.button>

        {currentUser?.role !== 'doctor' && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`nav-pill-btn ${activeTab === 'patient' ? 'active' : ''}`}
            onClick={() => {
              if (!currentUser) onOpenAuth();
              else setActiveTab('patient');
            }}
          >
            <User size={16} />
            <span>Patient Portal</span>
            {activeTab === 'patient' && (
              <motion.div
                layoutId="activeNavBadge"
                style={{
                  position: 'absolute', inset: 0, borderRadius: '30px',
                  background: '#eff6ff', zIndex: -1, border: '1px solid #bfdbfe'
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </motion.button>
        )}

        {currentUser?.role === 'doctor' && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`nav-pill-btn ${activeTab === 'doctor' ? 'active' : ''}`}
            onClick={() => {
              if (!currentUser) onOpenAuth();
              else setActiveTab('doctor');
            }}
          >
            <UserCheck size={16} />
            <span>Doctor Dashboard</span>
            {activeTab === 'doctor' && (
              <motion.div
                layoutId="activeNavBadge"
                style={{
                  position: 'absolute', inset: 0, borderRadius: '30px',
                  background: '#eff6ff', zIndex: -1, border: '1px solid #bfdbfe'
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`nav-pill-btn ${activeTab === 'ai_parcha' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai_parcha')}
          style={{
            background: activeTab === 'ai_parcha' ? '#eff6ff' : 'transparent',
            border: activeTab === 'ai_parcha' ? '1.5px solid #2563eb' : '1px solid #e2e8f0'
          }}
        >
          <Bot size={16} color="#2563eb" />
          <span style={{ fontWeight: 700, color: '#2563eb' }}>AI Assistant & Parcha Reader</span>
        </motion.button>
      </div>

      {/* Nav Right Actions */}
      <div className="nav-right-actions">
        {/* Support phone badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#475569' }}>
          <PhoneCall size={14} color="#e11d48" />
          <span>Need Help? <strong style={{ color: '#0f172a' }}>+91 98765 43210</strong></span>
        </div>

        {/* Bell Notification */}
        <motion.button 
          whileHover={{ scale: 1.06 }} 
          whileTap={{ scale: 0.94 }} 
          className="notif-bell-btn" 
          title="Notifications"
        >
          <Bell size={18} />
          <span className="red-dot"></span>
        </motion.button>

        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* User Profile Chip (Screenshot 1 & 2) */}
            <div className="user-profile-chip" onClick={() => setActiveTab(currentUser.role === 'doctor' ? 'doctor' : 'patient')}>
              <img
                src={currentUser.avatar_url || (currentUser.role === 'doctor' ? "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=80" : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80")}
                alt="Avatar"
              />
              <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a' }}>
                  {currentUser.name || 'Lokendra Dev'}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'capitalize' }}>
                  {currentUser.role || 'Patient'}
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.04, backgroundColor: '#fee2e2', color: '#ef4444' }}
              whileTap={{ scale: 0.96 }}
              onClick={onLogout}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '8px 14px',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <LogOut size={14} />
              <span>Logout</span>
            </motion.button>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenAuth}
            className="search-capsule-btn"
            style={{ padding: '8px 20px', borderRadius: '24px', fontSize: '0.86rem' }}
          >
            <LogIn size={15} />
            <span>Login / Sign Up</span>
          </motion.button>
        )}
      </div>
    </nav>
  );
}
