'use client';
import { useState } from 'react';

export default function AddPage() {
  const [activeTab, setActiveTab] = useState('faculty');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Form states
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/nodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: activeTab, data: formData }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create');
      
      setMessage(`Success! Created ${activeTab} node.`);
      e.target.reset();
      setFormData({});
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const TabButton = ({ name, label }) => (
    <button 
      onClick={() => { setActiveTab(name); setMessage(''); setFormData({}); }}
      className="nb-button"
      style={{ 
        marginRight: '10px', 
        background: activeTab === name ? 'var(--primary-gradient)' : 'var(--glass-bg)', 
        color: activeTab === name ? 'white' : 'var(--text-main)',
        opacity: activeTab === name ? 1 : 0.8,
        border: activeTab === name ? 'none' : '1px solid var(--glass-border)'
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="nb-title">Add New Entity</h1>
      
      <div className="nb-box">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <TabButton name="faculty" label="Faculty" />
          <TabButton name="student" label="Student" />
          <TabButton name="research_area" label="Research Area" />
          <TabButton name="project" label="Project" />
        </div>
      </div>

      <div className="nb-box">
        <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: 'var(--primary)' }}>Add {activeTab.replace('_', ' ').toUpperCase()}</h2>
        
        <form onSubmit={handleSubmit}>
          {activeTab === 'faculty' && (
            <>
              <input name="name" placeholder="Faculty Name" className="nb-input" onChange={handleChange} required />
              <input name="department" placeholder="Department" className="nb-input" onChange={handleChange} required />
              <input name="designation" placeholder="Designation" className="nb-input" onChange={handleChange} required />
            </>
          )}

          {activeTab === 'student' && (
            <>
              <input name="name" placeholder="Student Name" className="nb-input" onChange={handleChange} required />
              <input name="program" placeholder="Program (e.g. PhD, MS)" className="nb-input" onChange={handleChange} required />
            </>
          )}

          {activeTab === 'research_area' && (
            <>
              <input name="name" placeholder="Area Name (e.g. AI, IoT)" className="nb-input" onChange={handleChange} required />
            </>
          )}

          {activeTab === 'project' && (
            <>
              <input name="title" placeholder="Project Title" className="nb-input" onChange={handleChange} required />
              <select name="status" className="nb-input" onChange={handleChange} required>
                <option value="">Select Status</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Proposed">Proposed</option>
              </select>
            </>
          )}

          <button type="submit" className="nb-button" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
            {loading ? 'Processing...' : 'Add to Graph'}
          </button>
        </form>

        {message && (
          <div className="nb-box" style={{ 
            marginTop: '1rem', 
            padding: '1rem',
            background: message.includes('Error') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
            color: message.includes('Error') ? '#ef4444' : '#10b981',
            textAlign: 'center',
            border: `1px solid ${message.includes('Error') ? '#ef4444' : '#10b981'}`
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
