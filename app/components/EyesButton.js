'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function EyesButton() {
  const [angle, setAngle] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      
      const rad = Math.atan2(deltaY, deltaX);
      const degree = rad * (180 / Math.PI);
      
      setAngle(degree);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <Link href="/explore" ref={containerRef} className="nb-button" style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: '12px',
      padding: '1rem 2rem',
      fontSize: '1.2rem',
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--primary-gradient)' // Ensure it picks up the gradient
    }}>
      <span>Start Exploring</span>
      
      {/* Eyes Container */}
      <div style={{ display: 'flex', gap: '4px' }}>
        {[1, 2].map(i => (
          <div key={i} style={{ 
            width: '20px', 
            height: '20px', 
            background: 'white', 
            borderRadius: '50%', 
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              background: 'black', 
              borderRadius: '50%', 
              transform: `rotate(${angle}deg) translate(4px)`,
              transition: 'transform 0.1s linear'
            }} />
          </div>
        ))}
      </div>
    </Link>
  );
}
