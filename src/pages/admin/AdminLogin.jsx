import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:6002' : 'https://api.wasmetahir.com');

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [viewState, setViewState] = useState('login'); // 'login' | 'forgot_email' | 'forgot_reset'
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaToken, setMfaToken] = useState('');
  const [mfaMethods, setMfaMethods] = useState([]);
  const [selectedMfaMethod, setSelectedMfaMethod] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const emailRef = useRef(null);
  const navigate = useNavigate();

  // Mocked tenantMeta since we don't have useAuth
  const tenantMeta = { name: 'WT Admin' };

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!locked) return;
    let t = 30; setLockTimer(t);
    const iv = setInterval(() => {
      t--; setLockTimer(t);
      if (t <= 0) { setLocked(false); setAttempts(0); clearInterval(iv); }
    }, 1000);
    return () => clearInterval(iv);
  }, [locked]);

  const handleMfaSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/mfa/verify-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempToken: mfaToken, mfaCode }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || 'Invalid code.');
        setLoading(false);
        return;
      }
      
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setIsExiting(true), 120);
      setTimeout(() => navigate('/admin/dashboard', { replace: true }), 370);
    } catch {
      setError('Connection error.');
      setLoading(false);
    }
  };

  const handleMfaSend = async (method) => {
    // Mocked MFA send
  };

  const handleForgotRequest = async (e) => {
    e.preventDefault();
    // Mocked forgot request since backend doesn't support it yet
    if (loading) return;
    setLoading(true); setError('');
    setTimeout(() => {
      setViewState('forgot_reset');
      setLoading(false);
    }, 1000);
  };

  const handleForgotReset = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (newPassword.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true); setError('');
    setTimeout(() => {
      setSuccess(true);
      setTimeout(() => {
          setViewState('login');
          setSuccess(false);
          setResetEmail('');
          setResetCode('');
          setNewPassword('');
          setEmail(resetEmail); // pre-fill login
      }, 1500);
      setLoading(false);
    }, 1000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError(''); 
    setLoading(true);
    
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || 'Invalid email or password. Please try again.');
        setAttempts(prev => {
          const newAttempts = prev + 1;
          if (newAttempts >= 5) setLocked(true);
          return newAttempts;
        });
        setLoading(false);
        return;
      }
      
      if (data.mfaRequired) {
        setMfaRequired(true);
        setMfaToken(data.tempToken);
        setMfaMethods(data.methods || ['app']);
        setSelectedMfaMethod(data.methods ? data.methods[0] : 'app');
        setLoading(false);
        return;
      }

      // Store token in localStorage for cross-domain auth
      if (data.token) {
        localStorage.setItem('adminToken', data.token);
      }

      setLoading(false);
      setSuccess(true);

      setTimeout(() => setIsExiting(true), 120);
      setTimeout(() => {
        navigate('/admin/dashboard', { replace: true });
      }, 370);
    } catch {
      setError('Unable to connect to the server. Please check your network connection.');
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .auth-container {
          font-family: 'Inter', -apple-system, sans-serif;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #F8FAFC;
          color: #1E293B;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }
        .auth-container::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.4);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.5s ease;
        }
        .auth-container.is-success::before {
          opacity: 1;
        }

        .auth-card-wrapper {
          width: 100%;
          max-width: 420px;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: cardSpringEntrance 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transition: all 0.45s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes cardSpringEntrance {
          0% { opacity: 0; transform: translateY(20px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .auth-card-wrapper.is-exiting {
          opacity: 0;
          transform: translateY(-8px) scale(0.992);
          pointer-events: none;
        }
        .auth-logo {
          display: flex;
          align-items: baseline;
          justify-content: center;
          margin-bottom: 32px;
        }
        .auth-logo-text {
          font-family: 'Inter', sans-serif;
          font-size: 1.85rem;
          font-weight: 800;
          color: #000000;
          letter-spacing: -0.05em;
          text-transform: uppercase;
        }
        .auth-logo-dot {
          font-size: 2rem;
          font-weight: 900;
          color: #000000;
          line-height: 0;
          position: relative;
          top: 2px;
          margin-left: 1px;
        }

        .auth-card {
          width: 100%;
          background: #FFFFFF;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 
            0 4px 6px -1px rgba(15, 23, 42, 0.02), 
            0 10px 15px -3px rgba(15, 23, 42, 0.03),
            0 0 0 1px rgba(15, 23, 42, 0.04);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
        }
        .auth-card.is-success {
          transform: translateY(-2px);
        }
        .auth-card.is-success * {
          cursor: default !important;
        }

        /* ─── Form Elements ─── */
        .form-group {
          margin-bottom: 20px;
          transition: opacity 0.4s ease;
        }
        .is-success .form-group {
          opacity: 0.7;
          pointer-events: none;
        }
        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #334155;
          margin-bottom: 8px;
        }
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          color: #94A3B8;
          pointer-events: none;
          transition: color 0.2s ease;
        }
        .form-control {
          width: 100%;
          height: 44px;
          padding: 0 16px 0 42px;
          font-size: 0.95rem;
          font-family: inherit;
          color: #0F172A;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          outline: none;
        }
        .form-control::placeholder {
          color: #94A3B8;
        }
        .form-control:focus {
          border-color: #10B981;
          box-shadow: 0 0 0 3.5px rgba(16, 185, 129, 0.12);
        }
        .is-success .form-control {
          border-color: #E2E8F0 !important;
          box-shadow: none !important;
        }
        .form-control:disabled {
          background: #F8FAFC;
          color: #94A3B8;
          cursor: not-allowed;
        }
        .form-control:focus + .input-icon,
        .input-wrapper:focus-within .input-icon {
          color: #10B981;
        }
        .is-success .input-icon {
          color: #94A3B8 !important;
        }
        
        .btn-toggle {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #94A3B8;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          transition: color 0.15s ease, background 0.15s ease;
        }
        .btn-toggle:hover {
          color: #475569;
          background: #F1F5F9;
        }

        .btn-primary {
          width: 100%;
          height: 46px;
          background: #0F172A;
          color: #FFFFFF;
          border: none;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: width 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                      border-radius 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                      background 0.3s ease,
                      transform 0.12s cubic-bezier(0.4, 0, 0.2, 1),
                      box-shadow 0.3s ease;
          margin: 8px auto 0;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
          position: relative;
        }
        .btn-primary:hover:not(:disabled) {
          background: #1E293B;
        }
        .btn-primary:active:not(:disabled) {
          transform: scale(0.98);
        }
        .btn-primary:disabled {
          background: #CBD5E1;
          color: #F8FAFC;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }
        .btn-primary.is-success {
          width: 46px;
          border-radius: 50%;
          background: #1E293B;
          transform: scale(1);
          cursor: default;
        }

        .auth-footer {
          margin-top: 32px;
          text-align: center;
          font-size: 0.85rem;
          color: #64748B;
        }
        .auth-link {
          color: #475569;
          text-decoration: underline;
          text-decoration-color: #CBD5E1;
          text-underline-offset: 4px;
          font-weight: 500;
          transition: text-decoration-color 0.15s ease;
        }
        .auth-link:hover {
          text-decoration-color: #475569;
        }

        /* Alert Box */
        .alert {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 10px;
          font-size: 0.88rem;
          margin-bottom: 20px;
          line-height: 1.4;
          background: #FEF2F2;
          border: 1px solid #FECACA;
          color: #991B1B;
        }

        .dynamic-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .dynamic-icon.is-loading svg {
          animation: spin 0.55s linear infinite;
        }
        .dynamic-icon.is-loading .spinner-circle {
          stroke-dasharray: 40;
          stroke-dashoffset: 10;
        }
        .dynamic-icon.is-loading .check-path {
          stroke-dasharray: 24;
          stroke-dashoffset: 24;
        }

        .dynamic-icon.is-success svg {
          transform: rotate(0deg);
          transition: transform 0.2s ease-out;
        }
        .dynamic-icon.is-success .spinner-circle {
          stroke-dasharray: 60; 
          stroke-dashoffset: 60;
          transition: stroke-dashoffset 0.25s ease-out;
        }
        .dynamic-icon.is-success .check-path {
          stroke-dasharray: 24;
          stroke-dashoffset: 0;
          transition: stroke-dashoffset 0.25s ease-out 0.05s;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>

      <div className={`auth-container ${success ? 'is-success' : ''}`}>
        <div className={`auth-card-wrapper ${isExiting ? 'is-exiting' : ''}`}>
          
          <div className="auth-logo">
            {tenantMeta?.logo_url ? (
              <img src={tenantMeta.logo_url} alt={tenantMeta.name} style={{ height: 48, objectFit: 'contain' }} />
            ) : (
              <>
                <div className="auth-logo-text">{tenantMeta?.name || 'SYVROX'}</div>
                {!tenantMeta?.name && <div className="auth-logo-dot">.</div>}
              </>
            )}
          </div>

          <div className={`auth-card ${success ? 'is-success' : ''}`}>

            {error && (
              <div className="alert">
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{error}</span>
              </div>
            )}

            {viewState === 'forgot_email' ? (
              <form onSubmit={handleForgotRequest} autoComplete="off">
                <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                  <h3 style={{ margin: '0 0 8px', fontSize: '1.25rem', color: '#0F172A' }}>Reset Password</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>
                    Enter your email to receive a verification code.
                  </p>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Email address</label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" size={18} />
                    <input type="email" className="form-control" value={resetEmail} onChange={e => setResetEmail(e.target.value)} required disabled={loading} />
                  </div>
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? (
                    <div className="dynamic-icon is-loading">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle className="spinner-circle" cx="12" cy="12" r="9" /><polyline className="check-path" points="7 13 10 16 17 9" /></svg>
                    </div>
                  ) : <>Send Code <ArrowRight size={16} /></>}
                </button>
                <button type="button" onClick={() => { setViewState('login'); setError(''); }} style={{ marginTop: '16px', fontSize: '0.85rem', color: '#64748B', background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}>Back to Login</button>
              </form>
            ) : viewState === 'forgot_reset' ? (
              <form onSubmit={handleForgotReset} autoComplete="off">
                <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                  <h3 style={{ margin: '0 0 8px', fontSize: '1.25rem', color: '#0F172A' }}>Create New Password</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>
                    Enter the 6-digit code sent to your email.
                  </p>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Verification Code</label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" size={18} />
                    <input type="text" className="form-control" value={resetCode} onChange={e => setResetCode(e.target.value.replace(/\D/g, '').slice(0,6))} placeholder="6-digit code" required disabled={loading || success} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" size={18} />
                    <input type="password" className="form-control" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="At least 8 characters" required disabled={loading || success} />
                  </div>
                </div>

                <button type="submit" className={`btn-primary ${success ? 'is-success' : ''}`} disabled={loading}>
                  {success || loading ? (
                    <div className={`dynamic-icon ${success ? 'is-success' : 'is-loading'}`}>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle className="spinner-circle" cx="12" cy="12" r="9" /><polyline className="check-path" points="7 13 10 16 17 9" /></svg>
                    </div>
                  ) : <>Reset Password <ArrowRight size={16} /></>}
                </button>
                <button type="button" onClick={() => { setViewState('login'); setError(''); }} style={{ marginTop: '16px', fontSize: '0.85rem', color: '#64748B', background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}>Cancel</button>
              </form>
            ) : mfaRequired ? (
              <form onSubmit={handleMfaSubmit} autoComplete="off">
                <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                  <h3 style={{ margin: '0 0 8px', fontSize: '1.25rem', color: '#0F172A' }}>Verify Identity</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>
                    Select an authentication method and enter the code.
                  </p>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Authentication Method</label>
                  <select 
                    className="form-control" 
                    value={selectedMfaMethod} 
                    onChange={e => setSelectedMfaMethod(e.target.value)}
                    style={{ marginBottom: '16px' }}
                  >
                    {mfaMethods.includes('app') && <option value="app">Authenticator App</option>}
                    {mfaMethods.includes('email') && <option value="email">Email Authentication</option>}
                    {mfaMethods.includes('sms') && <option value="sms">SMS Passcode</option>}
                    {mfaMethods.includes('recovery') && <option value="recovery">Recovery Code</option>}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Verification Code</label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" size={18} />
                    <input
                      type="text"
                      className="form-control"
                      value={mfaCode}
                      onChange={e => setMfaCode(e.target.value)}
                      placeholder={selectedMfaMethod === 'recovery' ? "XXXXX-XXXXX" : "6-digit code"}
                      required
                      disabled={loading || success}
                    />
                  </div>
                </div>
                
                {(selectedMfaMethod === 'email' || selectedMfaMethod === 'sms') && (
                    <button type="button" onClick={() => handleMfaSend(selectedMfaMethod)} style={{ marginBottom: '24px', fontSize: '0.8rem', color: '#0F172A', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>
                        Send Code via {selectedMfaMethod === 'email' ? 'Email' : 'SMS'}
                    </button>
                )}

                <button
                  type="submit"
                  className={`btn-primary ${success ? 'is-success' : ''}`}
                  disabled={loading}
                >
                  {success || loading ? (
                    <div className={`dynamic-icon ${success ? 'is-success' : 'is-loading'}`}>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                         <circle className="spinner-circle" cx="12" cy="12" r="9" />
                         <polyline className="check-path" points="7 13 10 16 17 9" />
                      </svg>
                    </div>
                  ) : (
                    <>Verify <ArrowRight size={16} /></>
                  )}
                </button>
                
                <button type="button" onClick={() => { setMfaRequired(false); setMfaCode(''); }} style={{ marginTop: '16px', fontSize: '0.85rem', color: '#64748B', background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}>
                  Back to Login
                </button>
              </form>
            ) : (
            <form onSubmit={handleLogin} autoComplete="on">
              
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email address / Username</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input
                    ref={emailRef}
                    id="email"
                    type="text"
                    className="form-control"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your username"
                    autoComplete="username"
                    required
                    disabled={loading || success}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <label className="form-label" htmlFor="password" style={{ marginBottom: 0 }}>Password</label>
                  <button type="button" onClick={() => { setViewState('forgot_email'); setError(''); }} className="auth-link" style={{ fontSize: '0.85rem', color: '#64748B', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>Forgot password?</button>
                </div>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input
                    id="password"
                    type={showPw ? 'text' : 'password'}
                    className="form-control"
                    style={{ paddingRight: 44 }}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    disabled={loading || success}
                  />
                  <button
                    type="button"
                    className="btn-toggle"
                    onClick={() => setShowPw(!showPw)}
                    tabIndex={-1}
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={`btn-primary ${success ? 'is-success' : ''}`}
                disabled={loading}
              >
                {success || loading ? (
                  <div className={`dynamic-icon ${success ? 'is-success' : 'is-loading'}`}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                       <circle className="spinner-circle" cx="12" cy="12" r="9" />
                       <polyline className="check-path" points="7 13 10 16 17 9" />
                    </svg>
                  </div>
                ) : locked ? (
                  <><Lock size={16} /> Locked for {lockTimer}s</>
                ) : (
                  <>Sign in <ArrowRight size={16} /></>
                )}
              </button>

            </form>
            )}

            <div className="auth-footer">
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <span title="Secured with Enterprise-grade encryption by Syvrox" style={{ display: 'flex', alignItems: 'center', cursor: 'help' }}>
                  <HelpCircle size={14} />
                </span> 
                Need help? <a href="mailto:support@syvrox.com" className="auth-link">Contact Support</a>
              </span>
            </div>

          </div>
          
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
