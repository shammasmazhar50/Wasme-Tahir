import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleMdeReact from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import './Admin.css';

const API = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:6002' : 'https://api.wasmetahir.com');

/* ─── Toast ──────────────────────────────── */
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [onClose]);
  const icon = type === 'success' ? '✓' : '✕';
  return <div className={`admin-toast ${type}`}><span>{icon}</span>{message}</div>;
};

/* ─── Spinner ────────────────────────────── */
const Spinner = () => (
  <div className="admin-loading">
    <div className="admin-spinner" /> Loading…
  </div>
);

/* ─── Slug helper ────────────────────────── */
const toSlug = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/* ══════════════════════════════════════════
   ADMIN DASHBOARD
══════════════════════════════════════════ */
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  /* data */
  const [stats, setStats] = useState([]);
  const [posts, setPosts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [demographics, setDemographics] = useState([]);
  const [caseStudies, setCaseStudies] = useState([]);
  const [inbox, setInbox] = useState([]);
  const [users, setUsers] = useState([]);

  /* user role from api */
  const [userPayload, setUserPayload] = useState({ username: 'User', role: 'admin' });
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) { setAuthLoading(false); return; }
    fetch(`${API}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        if (data.role) setUserPayload(data);
      })
      .finally(() => setAuthLoading(false));
  }, []);

  const userRole = userPayload.role;

  /* blog editor */
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState('EDITORIAL');
  const [published, setPublished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [slugLocked, setSlugLocked] = useState(false);

  const navigate = useNavigate();

  const authH = useMemo(() => {
    const token = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  }, []);

  const showToast = useCallback((message, type = 'success') =>
    setToast({ message, type }), []);

  /* ─── Fetch All ─── */
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const isAuthor = userRole === 'author';
      const token = localStorage.getItem('adminToken');
      const bearerH = token ? { 'Authorization': `Bearer ${token}` } : {};
      const promises = [fetch(`${API}/api/posts`)];
      
      if (!isAuthor) {
        promises.push(fetch(`${API}/api/stats`));
        promises.push(fetch(`${API}/api/collab/brands`));
        promises.push(fetch(`${API}/api/collab/demographics`));
        promises.push(fetch(`${API}/api/collab/cases`));
        promises.push(fetch(`${API}/api/contact`, { headers: bearerH }));
        promises.push(fetch(`${API}/api/users`, { headers: bearerH }));
      }

      const res = await Promise.all(promises);
      const data = await Promise.all(res.map(r => r.json()));

      setPosts(Array.isArray(data[0]) ? data[0] : []);

      if (!isAuthor) {
        setStats(Array.isArray(data[1]) ? data[1] : []);
        setBrands(Array.isArray(data[2]) ? data[2] : []);
        setDemographics(Array.isArray(data[3]) ? data[3] : []);
        setCaseStudies(Array.isArray(data[4]) ? data[4] : []);
        setInbox(Array.isArray(data[5]) ? data[5] : []);
        setUsers(Array.isArray(data[6]) ? data[6] : []);
      }
    } catch {
      showToast('Failed to load data. Is the backend running?', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast, userRole]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const logout = async () => {
    const token = localStorage.getItem('adminToken');
    await fetch(`${API}/api/auth/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    }).catch(() => {});
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  /* ─── Generic helpers ─── */
  const updateLocal = (list, setter, id, field, value) =>
    setter(list.map(item => item.id === id ? { ...item, [field]: value } : item));

  const saveGeneric = async (endpoint, item, list, setter) => {
    const isNew = String(item.id).startsWith('new-');
    const method = isNew ? 'POST' : 'PUT';
    const url = isNew ? `${API}/api/${endpoint}` : `${API}/api/${endpoint}/${item.id}`;
    
    // Create payload without the 'new-' temp ID
    const payload = { ...item };
    if (isNew) delete payload.id;

    try {
      const r = await fetch(url, { method, headers: authH, credentials: 'include', body: JSON.stringify(payload) });
      if (r.ok) {
        const savedItem = await r.json();
        setter(list.map(i => (i.id === item.id ? savedItem : i)));
        showToast('Saved successfully!');
      } else {
        showToast('Save failed.', 'error');
      }
    } catch {
      showToast('Network error.', 'error');
    }
  };

  const deleteGeneric = async (endpoint, id, list, setter) => {
    if (String(id).startsWith('new-')) {
      setter(list.filter(i => i.id !== id));
      return;
    }
    if (!window.confirm('Permanently delete this item?')) return;
    try {
      const r = await fetch(`${API}/api/${endpoint}/${id}`, {
        method: 'DELETE', credentials: 'include'
      });
      if (r.ok) {
        setter(list.filter(i => i.id !== id));
        showToast('Deleted successfully.');
      } else {
        showToast('Delete failed.', 'error');
      }
    } catch {
      showToast('Network error.', 'error');
    }
  };

  const addNewItem = (list, setter, defaultState) => {
    const newItem = { id: `new-${Date.now()}`, ...defaultState };
    setter([...list, newItem]);
  };

  /* ─── Blog helpers ─── */
  const resetEditor = () => {
    setEditingId(null); setTitle(''); setSlug(''); setContent('');
    setExcerpt(''); setCoverImage(''); setCategory('EDITORIAL');
    setPublished(false); setSlugLocked(false);
  };

  const loadPost = (p) => {
    setEditingId(p.id); setTitle(p.title); setSlug(p.slug);
    setContent(p.content || ''); setExcerpt(p.excerpt || '');
    setCoverImage(p.coverImage || ''); setCategory(p.category || 'EDITORIAL');
    setPublished(!!p.published); setSlugLocked(true);
  };

  const handleTitleChange = (val) => {
    setTitle(val);
    if (!slugLocked) setSlug(toSlug(val));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    try {
      const r = await fetch(`${API}/api/upload`, {
        method: 'POST',
        credentials: 'include',
        body: fd,
      });
      const data = await r.json();
      if (data.url) { setCoverImage(data.url); showToast('Image uploaded!'); }
      else showToast(data.error || 'Upload failed.', 'error');
    } catch {
      showToast('Upload failed.', 'error');
    }
    setIsUploading(false);
  };

  const savePost = async (e) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim() || !content.trim()) {
      showToast('Title, slug, and content are required.', 'error');
      return;
    }
    setIsSaving(true);
    const payload = { title, slug, content, excerpt, coverImage, category, published };
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API}/api/posts/${editingId}` : `${API}/api/posts`;
    try {
      const r = await fetch(url, { method, headers: authH, credentials: 'include', body: JSON.stringify(payload) });
      if (r.ok) {
        showToast(editingId ? 'Post updated!' : 'Post published!');
        resetEditor();
        const fresh = await fetch(`${API}/api/posts`).then(x => x.json());
        setPosts(Array.isArray(fresh) ? fresh : []);
      } else {
        const err = await r.json();
        showToast(err.message || 'Failed to save.', 'error');
      }
    } catch {
      showToast('Network error.', 'error');
    }
    setIsSaving(false);
  };

  const deletePost = async (id) => {
    if (!window.confirm('Permanently delete this post?')) return;
    const r = await fetch(`${API}/api/posts/${id}`, {
      method: 'DELETE', credentials: 'include',
    }).catch(() => null);
    if (r && r.ok) {
      setPosts(posts.filter(p => p.id !== id));
      if (editingId === id) resetEditor();
      showToast('Post deleted.');
    } else {
      showToast('Delete failed.', 'error');
    }
  };

  const markRead = async (id) => {
    await fetch(`${API}/api/contact/${id}/read`, {
      method: 'PUT', credentials: 'include',
    }).catch(() => null);
    setInbox(inbox.map(i => i.id === id ? { ...i, isRead: true } : i));
  };

  const deleteMsg = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    const r = await fetch(`${API}/api/contact/${id}`, {
      method: 'DELETE', credentials: 'include',
    }).catch(() => null);
    if (r && r.ok) {
      setInbox(inbox.filter(i => i.id !== id));
      showToast('Message deleted.');
    }
  };

  /* Memoize editor options */
  const editorOptions = useMemo(() => ({
    spellChecker: false,
    placeholder: 'Write your article here using Markdown…',
    toolbar: [
      'bold', 'italic', 'heading', '|',
      'quote', 'unordered-list', 'ordered-list', '|',
      'link', 'image', '|',
      'preview', 'side-by-side', 'fullscreen', '|',
      'guide',
    ],
    minHeight: '320px',
    status: ['lines', 'words'],
  }), []);

  const unreadCount = inbox.filter(m => !m.isRead).length;
  const fmtDate = (d) => new Date(d).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  /* ─── Tabs config ─── */
  const ALL_TABS = [
    { key: 'stats',  label: 'Global Stats' },
    { key: 'blogs',  label: 'Blog CMS' },
    { key: 'media',  label: 'Media Kit' },
    { key: 'collab', label: 'Brands & Cases' },
    { key: 'inbox',  label: 'Inbox', badge: unreadCount },
    { key: 'users',  label: 'Users' }
  ];

  const TABS = userRole === 'author' 
    ? ALL_TABS.filter(t => t.key === 'blogs') 
    : ALL_TABS;

  useEffect(() => {
    if (userRole === 'author' && activeTab !== 'blogs') {
      setActiveTab('blogs');
    }
  }, [userRole, activeTab]);

  if (loading || authLoading) {
    return (
      <div className="admin-page-wrapper">
        <div className="admin-dashboard"><Spinner /></div>
      </div>
    );
  }

  return (
    <div className="admin-page-wrapper">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="admin-dashboard">

        {/* ── Top Nav ── */}
        <nav className="admin-topnav">
          <span className="topnav-brand">WT · Admin</span>
          <div className="topnav-right">
            <span className="topnav-user">{userPayload?.username || 'User'}</span>
            <span className="status-pill status-live" style={{marginRight: 12, padding: '2px 8px'}}>{userRole}</span>
            <button className="btn-ghost" onClick={logout}>Logout</button>
          </div>
        </nav>

        {/* ── Tab Bar ── */}
        <div className="admin-tabbar">
          {TABS.map(t => (
            <button
              key={t.key}
              className={`tab-btn ${activeTab === t.key ? 'active' : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
              {t.badge > 0 && <span className="tab-badge">{t.badge}</span>}
            </button>
          ))}
        </div>

        {/* ══ STATS ══ */}
        {activeTab === 'stats' && (
          <div className="admin-content">
            <div className="section-head">
              <div>
                <div className="section-title">Global Stats</div>
                <div className="section-sub">Numbers displayed on the Home page and Media Kit.</div>
              </div>
              <button className="btn-save" onClick={() => addNewItem(stats, setStats, { platform: '', value: '', label: '', order: 0 })}>+ Add Stat</button>
            </div>
            
            {stats.length === 0 && <div className="inbox-empty-sub" style={{marginBottom: 20}}>No stats configured yet.</div>}
            
            {stats.map(stat => (
              <div key={stat.id} className="data-card">
                <div className="card-row">
                  <div className="field-group" style={{ flex: 1 }}>
                    <label className="field-label">Platform</label>
                    <input className="field-input" value={stat.platform || ''}
                      onChange={e => updateLocal(stats, setStats, stat.id, 'platform', e.target.value)} />
                  </div>
                  <div className="field-group" style={{ flex: 1 }}>
                    <label className="field-label">Value (e.g. 75M+)</label>
                    <input className="field-input" value={stat.value || ''}
                      onChange={e => updateLocal(stats, setStats, stat.id, 'value', e.target.value)} />
                  </div>
                  <div className="field-group" style={{ flex: 2 }}>
                    <label className="field-label">Label</label>
                    <input className="field-input" value={stat.label || ''}
                      onChange={e => updateLocal(stats, setStats, stat.id, 'label', e.target.value)} />
                  </div>
                </div>
                <div className="card-actions">
                  <button className="btn-danger" onClick={() => deleteGeneric('stats', stat.id, stats, setStats)}>Delete</button>
                  <button className="btn-save" onClick={() => saveGeneric('stats', stat, stats, setStats)}>Save</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ MEDIA KIT ══ */}
        {activeTab === 'media' && (
          <div className="admin-content">
            <div className="section-head">
              <div>
                <div className="section-title">Media Kit Demographics</div>
                <div className="section-sub">Audience breakdown shown on your Media Kit page.</div>
              </div>
              <button className="btn-save" onClick={() => addNewItem(demographics, setDemographics, { category: '', data: '', order: 0 })}>+ Add Demographic</button>
            </div>
            
            {demographics.length === 0 && <div className="inbox-empty-sub" style={{marginBottom: 20}}>No demographics configured yet.</div>}
            
            {demographics.map(d => (
              <div key={d.id} className="data-card">
                <div className="card-row">
                  <div className="field-group" style={{ flex: 1 }}>
                    <label className="field-label">Category</label>
                    <input className="field-input" value={d.category || ''}
                      onChange={e => updateLocal(demographics, setDemographics, d.id, 'category', e.target.value)} />
                  </div>
                  <div className="field-group" style={{ flex: 3 }}>
                    <label className="field-label">Data</label>
                    <textarea className="field-textarea" rows={3} value={d.data || ''}
                      onChange={e => updateLocal(demographics, setDemographics, d.id, 'data', e.target.value)} />
                  </div>
                </div>
                <div className="card-actions">
                  <button className="btn-danger" onClick={() => deleteGeneric('collab/demographics', d.id, demographics, setDemographics)}>Delete</button>
                  <button className="btn-save" onClick={() => saveGeneric('collab/demographics', d, demographics, setDemographics)}>Save</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ BRANDS & CASES ══ */}
        {activeTab === 'collab' && (
          <div className="admin-content">
            <div className="section-head">
              <div>
                <div className="section-title">Brands & Partnerships</div>
                <div className="section-sub">Manage brand partners and campaign case studies.</div>
              </div>
            </div>

            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
              <p className="field-label" style={{ margin: 0 }}>Brand Partners</p>
              <button className="btn-secondary" style={{padding: '5px 12px'}} onClick={() => addNewItem(brands, setBrands, { name: '', link: '', logoUrl: '', order: 0 })}>+ Add Brand</button>
            </div>
            
            {brands.length === 0 && <div className="inbox-empty-sub" style={{marginBottom: 20}}>No brands configured yet.</div>}
            
            {brands.map(b => (
              <div key={b.id} className="data-card">
                <div className="card-row">
                  <div className="field-group" style={{ flex: 1 }}>
                    <label className="field-label">Brand Name</label>
                    <input className="field-input" value={b.name || ''}
                      onChange={e => updateLocal(brands, setBrands, b.id, 'name', e.target.value)} />
                  </div>
                  <div className="field-group" style={{ flex: 1 }}>
                    <label className="field-label">Brand Link</label>
                    <input className="field-input" placeholder="https://" value={b.link || ''}
                      onChange={e => updateLocal(brands, setBrands, b.id, 'link', e.target.value)} />
                  </div>
                </div>
                <div className="card-actions">
                  <button className="btn-danger" onClick={() => deleteGeneric('collab/brands', b.id, brands, setBrands)}>Delete</button>
                  <button className="btn-save" onClick={() => saveGeneric('collab/brands', b, brands, setBrands)}>Save</button>
                </div>
              </div>
            ))}

            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '36px 0 12px'}}>
              <p className="field-label" style={{ margin: 0 }}>Case Studies</p>
              <button className="btn-secondary" style={{padding: '5px 12px'}} onClick={() => addNewItem(caseStudies, setCaseStudies, { brandName: '', campaignTitle: '', theBrief: '', theConcept: '', stat1Value: '', stat1Label: '', stat2Value: '', stat2Label: '', order: 0 })}>+ Add Case Study</button>
            </div>
            
            {caseStudies.length === 0 && <div className="inbox-empty-sub" style={{marginBottom: 20}}>No case studies configured yet.</div>}

            {caseStudies.map(cs => (
              <div key={cs.id} className="data-card">
                <div className="form-row-2" style={{ marginBottom: 14 }}>
                  <div className="field-group">
                    <label className="field-label">Brand Name</label>
                    <input className="field-input" value={cs.brandName || ''}
                      onChange={e => updateLocal(caseStudies, setCaseStudies, cs.id, 'brandName', e.target.value)} />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Campaign Title</label>
                    <input className="field-input" value={cs.campaignTitle || ''}
                      onChange={e => updateLocal(caseStudies, setCaseStudies, cs.id, 'campaignTitle', e.target.value)} />
                  </div>
                </div>
                <div className="form-row-2" style={{ marginBottom: 14 }}>
                  <div className="field-group">
                    <label className="field-label">The Brief</label>
                    <textarea className="field-textarea" rows={4} value={cs.theBrief || ''}
                      onChange={e => updateLocal(caseStudies, setCaseStudies, cs.id, 'theBrief', e.target.value)} />
                  </div>
                  <div className="field-group">
                    <label className="field-label">The Concept</label>
                    <textarea className="field-textarea" rows={4} value={cs.theConcept || ''}
                      onChange={e => updateLocal(caseStudies, setCaseStudies, cs.id, 'theConcept', e.target.value)} />
                  </div>
                </div>
                <div className="form-row-2" style={{ marginBottom: 0 }}>
                  <div className="field-group">
                    <label className="field-label">Stat 1 Value</label>
                    <input className="field-input" value={cs.stat1Value || ''}
                      onChange={e => updateLocal(caseStudies, setCaseStudies, cs.id, 'stat1Value', e.target.value)} />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Stat 1 Label</label>
                    <input className="field-input" value={cs.stat1Label || ''}
                      onChange={e => updateLocal(caseStudies, setCaseStudies, cs.id, 'stat1Label', e.target.value)} />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Stat 2 Value</label>
                    <input className="field-input" value={cs.stat2Value || ''}
                      onChange={e => updateLocal(caseStudies, setCaseStudies, cs.id, 'stat2Value', e.target.value)} />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Stat 2 Label</label>
                    <input className="field-input" value={cs.stat2Label || ''}
                      onChange={e => updateLocal(caseStudies, setCaseStudies, cs.id, 'stat2Label', e.target.value)} />
                  </div>
                </div>
                <div className="card-actions">
                  <button className="btn-danger" onClick={() => deleteGeneric('collab/cases', cs.id, caseStudies, setCaseStudies)}>Delete</button>
                  <button className="btn-save" onClick={() => saveGeneric('collab/cases', cs, caseStudies, setCaseStudies)}>Save Case Study</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ INBOX ══ */}
        {activeTab === 'inbox' && (
          <div className="admin-content">
            <div className="section-head">
              <div>
                <div className="section-title">Inbox</div>
                <div className="section-sub">
                  {unreadCount > 0
                    ? `${unreadCount} unread message${unreadCount !== 1 ? 's' : ''}`
                    : 'All messages read.'}
                </div>
              </div>
            </div>
            {inbox.length === 0 ? (
              <div className="inbox-empty">
                <div className="inbox-empty-icon">✉️</div>
                <div className="inbox-empty-title">No messages yet</div>
                <div className="inbox-empty-sub">When someone submits the contact form, it will appear here.</div>
              </div>
            ) : (
              <div className="inbox-list">
                {inbox.map(msg => (
                  <div key={msg.id} className={`inbox-item ${!msg.isRead ? 'unread' : ''}`}>
                    <div className="inbox-top">
                      <div>
                        <div className="inbox-name">{msg.name}</div>
                        <div className="inbox-email">{msg.email}</div>
                      </div>
                      <div className="inbox-date">{fmtDate(msg.createdAt)}</div>
                    </div>
                    <div className="inbox-chips">
                      {msg.inquiry && <span className="inbox-chip">{msg.inquiry}</span>}
                      {msg.company && <span className="inbox-chip">{msg.company}</span>}
                      {!msg.isRead && <span className="inbox-chip unread-chip">● New</span>}
                    </div>
                    <div className="inbox-body">{msg.message}</div>
                    <div className="inbox-actions">
                      {!msg.isRead && (
                        <button className="btn-secondary" onClick={() => markRead(msg.id)}>
                          Mark as Read
                        </button>
                      )}
                      <button className="btn-danger" onClick={() => deleteMsg(msg.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ BLOG CMS ══ */}
        {activeTab === 'blogs' && (
          <div className="admin-content">
            <div className="section-head">
              <div>
                <div className="section-title">Blog / Editorial CMS</div>
                <div className="section-sub">{posts.length} article{posts.length !== 1 ? 's' : ''} total</div>
              </div>
            </div>

            <div className="blog-layout">
              {/* ── Sidebar ── */}
              <div className="blog-sidebar">
                <div className="sidebar-header">
                  <span className="sidebar-title">Articles</span>
                  <span className="sidebar-count">{posts.length}</span>
                </div>
                <button className="sidebar-new-btn" onClick={resetEditor}>
                  + New Article
                </button>
                <div className="sidebar-list">
                  {posts.map(p => (
                    <div
                      key={p.id}
                      className={`sidebar-post-item ${editingId === p.id ? 'active' : ''}`}
                      onClick={() => loadPost(p)}
                    >
                      <div>
                        <div className="sidebar-post-title">{p.title}</div>
                        <div className="sidebar-post-meta">{p.category}</div>
                      </div>
                      <span className={`status-pill ${p.published ? 'status-live' : 'status-draft'}`}>
                        {p.published ? 'Live' : 'Draft'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Editor Panel ── */}
              <div className="blog-editor-panel">
                <div className="editor-panel-title">
                  <span>{editingId ? 'Editing Article' : 'New Article'}</span>
                  {editingId && (
                    <button className="btn-secondary" onClick={resetEditor}>
                      ✕ Cancel
                    </button>
                  )}
                </div>

                <form className="blog-form" onSubmit={savePost}>
                  {/* Title */}
                  <div className="field-group">
                    <label className="field-label">Title *</label>
                    <input
                      className="field-input"
                      required
                      placeholder="Your article headline…"
                      value={title}
                      onChange={e => handleTitleChange(e.target.value)}
                      style={{ fontSize: '1rem', fontWeight: 500 }}
                    />
                  </div>

                  {/* Slug + Category */}
                  <div className="form-row-2">
                    <div className="field-group">
                      <label className="field-label">URL Slug *</label>
                      <input
                        className="field-input"
                        required
                        placeholder="auto-generated-from-title"
                        value={slug}
                        onChange={e => { setSlug(e.target.value); setSlugLocked(true); }}
                      />
                    </div>
                    <div className="field-group">
                      <label className="field-label">Category</label>
                      <select className="field-select" value={category}
                        onChange={e => setCategory(e.target.value)}>
                        <option value="EDITORIAL">Editorial</option>
                        <option value="LIFESTYLE">Lifestyle</option>
                        <option value="FASHION">Fashion</option>
                        <option value="BEAUTY">Beauty</option>
                        <option value="TRAVEL">Travel</option>
                      </select>
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div className="field-group">
                    <label className="field-label">Excerpt</label>
                    <textarea
                      className="field-textarea"
                      rows={2}
                      placeholder="A short description shown on the blog listing page…"
                      value={excerpt}
                      onChange={e => setExcerpt(e.target.value)}
                    />
                  </div>

                  {/* Cover image */}
                  <div className="field-group">
                    <label className="field-label">Cover Image</label>
                    {coverImage ? (
                      <div className="cover-preview-box">
                        <img src={coverImage} alt="Cover" className="cover-preview-img" />
                        <button type="button" className="cover-remove-btn"
                          onClick={() => setCoverImage('')}>✕</button>
                      </div>
                    ) : (
                      <div className="image-upload-area">
                        <input
                          className="field-input upload-url-input"
                          placeholder="Paste an image URL…"
                          value={coverImage}
                          onChange={e => setCoverImage(e.target.value)}
                        />
                        <span style={{ color: 'var(--a-text-dim)', fontSize: '0.8rem' }}>or</span>
                        <label className="upload-btn-label">
                          {isUploading ? 'Uploading…' : '⬆ Upload'}
                          <input type="file" accept="image/*" disabled={isUploading}
                            onChange={handleImageUpload} />
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Markdown Editor */}
                  <div className="field-group">
                    <label className="field-label">Content (Markdown) *</label>
                    <div className="blog-mde-wrapper">
                      <SimpleMdeReact
                        value={content}
                        onChange={setContent}
                        options={editorOptions}
                      />
                    </div>
                  </div>

                  {/* Publish toggle */}
                  <label className="publish-toggle-row">
                    <input type="checkbox" checked={published}
                      onChange={e => setPublished(e.target.checked)} />
                    <div className="publish-toggle-text">
                      <span className="publish-toggle-label">Publish Immediately</span>
                      <span className="publish-toggle-sub">
                        {published
                          ? 'This article is visible to the public.'
                          : 'This article is saved as a draft only.'}
                      </span>
                    </div>
                  </label>

                  {/* Actions */}
                  <div className="editor-actions">
                    {editingId && (
                      <button type="button" className="btn-danger"
                        onClick={() => deletePost(editingId)}>
                        Delete Post
                      </button>
                    )}
                    <button type="submit" className="btn-save" disabled={isSaving}>
                      {isSaving
                        ? 'Saving…'
                        : editingId ? 'Update Post' : 'Publish Post'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ══ USERS ══ */}
        {activeTab === 'users' && userRole === 'admin' && (
          <div className="admin-content">
            <div className="section-head">
              <div>
                <div className="section-title">User Management</div>
                <div className="section-sub">Add authors or admins to access this dashboard.</div>
              </div>
              <button className="btn-save" onClick={() => addNewItem(users, setUsers, { username: '', password: '', role: 'author' })}>+ Add User</button>
            </div>
            
            {users.length === 0 && <div className="inbox-empty-sub" style={{marginBottom: 20}}>No users found.</div>}
            
            {users.map(u => (
              <div key={u.id} className="data-card">
                <div className="card-row">
                  <div className="field-group" style={{ flex: 1 }}>
                    <label className="field-label">Username</label>
                    <input className="field-input" value={u.username || ''}
                      disabled={u.username === 'admin'}
                      onChange={e => updateLocal(users, setUsers, u.id, 'username', e.target.value)} />
                  </div>
                  <div className="field-group" style={{ flex: 1 }}>
                    <label className="field-label">New Password</label>
                    <input className="field-input" type="password" placeholder={String(u.id).startsWith('new-') ? 'Required' : 'Leave blank to keep same'}
                      onChange={e => updateLocal(users, setUsers, u.id, 'password', e.target.value)} />
                  </div>
                  <div className="field-group" style={{ flex: 1 }}>
                    <label className="field-label">Role</label>
                    <select className="field-select" value={u.role || 'author'}
                      disabled={u.username === 'admin'}
                      onChange={e => updateLocal(users, setUsers, u.id, 'role', e.target.value)}>
                      <option value="admin">Admin (Full Access)</option>
                      <option value="author">Author (Blogs Only)</option>
                    </select>
                  </div>
                </div>
                <div className="card-actions">
                  {u.username !== 'admin' ? (
                    <button className="btn-danger" onClick={() => deleteGeneric('users', u.id, users, setUsers)}>Delete</button>
                  ) : (
                    <div style={{width: 60}}></div>
                  )}
                  <button className="btn-save" onClick={() => saveGeneric('users', u, users, setUsers)}>Save</button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
