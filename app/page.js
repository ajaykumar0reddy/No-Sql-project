import Link from 'next/link';
import { Network, PlusCircle, Link2, Search } from 'lucide-react';
import EyesButton from './components/EyesButton';

export default function Home() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header className="nb-box" style={{ textAlign: 'center' }}>
        <h1 className="nb-title">Faculty Research Guidance System</h1>
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Graph Database Management powered by Neo4j</p>
      </header>

      <div className="nb-grid">
        <div className="nb-box">
          <h2><PlusCircle size={32} /> Add Data</h2>
          <p>Register new Faculty, Students, Research Areas, or Projects into the graph.</p>
          <Link href="/add" className="nb-button">Go to Add</Link>
        </div>

        <div className="nb-box">
          <h2><Link2 size={32} /> Assign Relationships</h2>
          <p>Connect entities: Assign students to faculty, projects to areas, etc.</p>
          <Link href="/assign" className="nb-button">Go to Assign</Link>
        </div>

        <div className="nb-box">
          <h2><Search size={32} /> Explore Graph</h2>
          <p>View the relationships and data insights from the Neo4j database.</p>
          <div style={{ marginTop: '10px' }}>
            <EyesButton />
          </div>
        </div>
        
        <div className="nb-box">
            <h2><Network size={32} /> System Status</h2>
            <p><strong>Database:</strong> Neo4j Graph DB</p>
            <p><strong>Backend:</strong> Next.js API Routes</p>
            <p><strong>Status:</strong> Active</p>
        </div>
      </div>
    </div>
  );
}
