'use client';
import { useState, useEffect } from 'react';

export default function ExplorePage() {
  // Views: students-by-faculty, faculty-expertise, projects-area, student-projects
  const [view, setView] = useState('students-by-faculty');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/graph-data?view=${view}`);
        const json = await res.json();
        setData(json.data || []);
      } catch (e) {
        console.error("Failed to load view", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [view]);

  const viewOptions = [
    { id: 'students-by-faculty', label: 'Students guided by Faculty' },
    { id: 'faculty-expertise', label: 'Faculty Expertise' },
    { id: 'projects-area', label: 'Projects in Research Areas' },
    { id: 'student-projects', label: 'Who is working on what?' },
    { id: 'all-projects', label: 'Manage All Projects' },
  ];

  const handleEdit = async (id, currentStatus) => {
    const newStatus = window.prompt("Enter new status (e.g., 'In Progress', 'Completed'):", currentStatus);
    if (!newStatus || newStatus === currentStatus) return;

    try {
      const res = await fetch('/api/nodes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'project', id, data: { status: newStatus } })
      });
      if (res.ok) {
        alert("Status updated!");
        // Refresh data
        const refreshRes = await fetch(`/api/graph-data?view=${view}`);
        const json = await refreshRes.json();
        setData(json.data || []);
      } else {
        alert("Failed to update status");
      }
    } catch (e) {
      console.error(e);
      alert("Error updating status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;

    try {
      const res = await fetch(`/api/nodes?type=project&id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        alert("Project deleted!");
        // Refresh data
        const refreshRes = await fetch(`/api/graph-data?view=${view}`);
        const json = await refreshRes.json();
        setData(json.data || []);
      } else {
        alert("Failed to delete project");
      }
    } catch (e) {
      console.error(e);
      alert("Error deleting project");
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 className="nb-title">Explore Graph Data</h1>

      <div className="nb-box">
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {viewOptions.map(opt => (
            <button 
              key={opt.id}
              onClick={() => setView(opt.id)}
              className="nb-button"
              style={{ 
                background: view === opt.id ? 'var(--primary-gradient)' : 'var(--glass-bg)', 
                color: view === opt.id ? 'white' : 'var(--text-main)',
                opacity: view === opt.id ? 1 : 0.8,
                border: view === opt.id ? 'none' : '1px solid var(--glass-border)'
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="nb-box">
        {loading ? <p>Loading graph data...</p> : (
          <table>
            <thead>
              <tr>
                {data.length > 0 && Object.keys(data[0]).filter(k => k !== 'id').map(key => (
                  <th key={key} style={{ textTransform: 'capitalize' }}>{key}</th>
                ))}
                {(view === 'all-projects' || view === 'projects-area') && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? <tr><td colSpan="100%">No relationships found. Add some data!</td></tr> : (
                data.map((row, i) => (
                  <tr key={i}>
                    {Object.entries(row).filter(([k]) => k !== 'id').map(([key, val], j) => (
                      <td key={j}>{val}</td>
                    ))}
                    {(view === 'all-projects' || view === 'projects-area') && row.id && (
                      <td style={{ display: 'flex', gap: '1rem' }}>
                        <button 
                          onClick={() => handleEdit(row.id, row.status)}
                          className="nb-button"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', background: 'var(--secondary)', color: 'white' }}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(row.id)}
                          className="nb-button"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', background: '#ef4444' }}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
