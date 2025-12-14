import './globals.css';
import Link from 'next/link';
import ThemeToggle from './components/ThemeToggle';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="nb-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" className="nb-title" style={{ fontSize: '1.5rem', margin: 0 }}>ResearchGraph</Link>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link href="/" className="nb-button">Home</Link>
            <Link href="/add" className="nb-button">Add Data</Link>
            <Link href="/assign" className="nb-button">Assign</Link>
            <Link href="/explore" className="nb-button">Explore</Link>
            <ThemeToggle />
          </div>
        </nav>
        <main style={{ padding: '20px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
