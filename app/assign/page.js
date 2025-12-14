'use client';
import { useState, useEffect } from 'react';

export default function AssignPage() {
  const [activeRel, setActiveRel] = useState('GUIDES');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Dropdown data
  const [faculty, setFaculty] = useState([]);
  const [students, setStudents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [areas, setAreas] = useState([]);

  // Form selection
  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState('');

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fRes, sRes, pRes, aRes] = await Promise.all([
          fetch('/api/nodes?type=faculty').then(r => r.json()),
          fetch('/api/nodes?type=student').then(r => r.json()),
          fetch('/api/nodes?type=project').then(r => r.json()),
          fetch('/api/nodes?type=research_area').then(r => r.json())
        ]);
        setFaculty(fRes.data || []);
        setStudents(sRes.data || []);
        setProjects(pRes.data || []);
        setAreas(aRes.data || []);
      } catch (e) {
        console.error("Failed to load options", e);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fromId || !toId) {
      setMessage('Please select both entities.');
      return;
    }
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/relationships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromId, toId, type: activeRel }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to link');
      setMessage('Success! Relationship created.');
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const TabButton = ({ type, label }) => (
    <button 
      onClick={() => { setActiveRel(type); setMessage(''); setFromId(''); setToId(''); }}
      className="nb-button"
      style={{ 
        marginRight: '10px', 
        background: activeRel === type ? 'var(--primary-gradient)' : 'var(--glass-bg)', 
        color: activeRel === type ? 'white' : 'var(--text-main)',
        opacity: activeRel === type ? 1 : 0.8,
        border: activeRel === type ? 'none' : '1px solid var(--glass-border)'
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="nb-title">Assign Relationships</h1>
      
      <div className="nb-box">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <TabButton type="GUIDES" label="Faculty → Student" />
          <TabButton type="EXPERT_IN" label="Faculty → Research" />
          <TabButton type="WORKS_ON" label="Student → Project" />
          <TabButton type="BELONGS_TO" label="Project → Research" />
        </div>
      </div>

      <div className="nb-box">
        <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: 'var(--primary)' }}>Create Connection: {activeRel}</h2>
        <form onSubmit={handleSubmit}>
          
          {/* FROM SELECTOR */}
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-muted)' }}>From:</label>
          <select className="nb-input" value={fromId} onChange={(e) => setFromId(e.target.value)} required>
            <option value="">Select...</option>
            {activeRel === 'GUIDES' && faculty.map(f => <option key={f.facultyId} value={f.facultyId}>{f.name} ({f.department})</option>)}
            {activeRel === 'EXPERT_IN' && faculty.map(f => <option key={f.facultyId} value={f.facultyId}>{f.name}</option>)}
            {activeRel === 'WORKS_ON' && students.map(s => <option key={s.studentId} value={s.studentId}>{s.name}</option>)}
            {activeRel === 'BELONGS_TO' && projects.map(p => <option key={p.projectId} value={p.projectId}>{p.title}</option>)}
          </select>

          {/* TO SELECTOR */}
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-muted)' }}>To:</label>
          <select className="nb-input" value={toId} onChange={(e) => setToId(e.target.value)} required>
            <option value="">Select...</option>
            {activeRel === 'GUIDES' && students.map(s => <option key={s.studentId} value={s.studentId}>{s.name}</option>)}
            {activeRel === 'EXPERT_IN' && areas.map(a => <option key={a.areaId} value={a.areaId}>{a.name}</option>)}
            {activeRel === 'WORKS_ON' && projects.map(p => <option key={p.projectId} value={p.projectId}>{p.title}</option>)}
            {activeRel === 'BELONGS_TO' && areas.map(a => <option key={a.areaId} value={a.areaId}>{a.name}</option>)}
          </select>

          <button type="submit" className="nb-button" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
            {loading ? 'Linking...' : 'Create Link'}
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
