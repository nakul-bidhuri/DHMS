import React from 'react';

interface ToolsLogoProps {
  className?: string;
  variant?: 'color' | 'monochrome';
}

/**
 * Tools & Equipment Inventory custom branded logo / emblem.
 * Features a modern technical equipment chest with cross-tools & security seal.
 */
export default function ToolsInventoryLogo({ className = 'w-6 h-6', variant = 'color' }: ToolsLogoProps) {
  if (variant === 'monochrome') {
    return (
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
      >
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        <path d="m3 21 3-3" />
        <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4" />
      </svg>
    );
  }

  return (
    <div className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}>
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="toolsBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e11d48" />
            <stop offset="50%" stopColor="#be123c" />
            <stop offset="100%" stopColor="#881337" />
          </linearGradient>
          <linearGradient id="toolsAccentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>
          <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <filter id="toolsShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#881337" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Outer Shield / Rounded Tech Chest */}
        <rect 
          x="3" 
          y="10" 
          width="34" 
          height="25" 
          rx="5" 
          fill="url(#toolsBgGrad)" 
          filter="url(#toolsShadow)"
        />

        {/* Top Chest Lid Bevel */}
        <path 
          d="M3 15C3 12.2386 5.23858 10 8 10H32C34.7614 10 37 12.2386 37 15V17H3V15Z" 
          fill="url(#toolsAccentGrad)" 
        />

        {/* Heavy Duty Handle */}
        <path 
          d="M14 10V5.5C14 4.11929 15.1193 3 16.5 3H23.5C24.8807 3 26 4.11929 26 5.5V10" 
          stroke="url(#toolsBgGrad)" 
          strokeWidth="3.2" 
          strokeLinecap="round" 
        />
        <path 
          d="M17 3H23" 
          stroke="#cbd5e1" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
        />

        {/* Horizontal Seam */}
        <line x1="3" y1="17" x2="37" y2="17" stroke="#4c0519" strokeWidth="1" strokeOpacity="0.4" />

        {/* Center Metal Latch / Lock */}
        <rect x="16.5" y="14" width="7" height="6.5" rx="1.5" fill="url(#metalGrad)" stroke="#475569" strokeWidth="0.8" />
        <circle cx="20" cy="17.2" r="1.2" fill="#0f172a" />

        {/* Left & Right Corner Rivets */}
        <circle cx="6.5" cy="13.5" r="1.1" fill="#cbd5e1" />
        <circle cx="33.5" cy="13.5" r="1.1" fill="#cbd5e1" />
        <circle cx="6.5" cy="31.5" r="1.1" fill="#cbd5e1" />
        <circle cx="33.5" cy="31.5" r="1.1" fill="#cbd5e1" />

        {/* Crossed Wrench & Screwdriver inside lower body */}
        {/* Screwdriver */}
        <line x1="12" y1="29" x2="28" y2="21" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.85" />
        {/* Wrench */}
        <path 
          d="M28 29L20 23" 
          stroke="#ffffff" 
          strokeWidth="2.2" 
          strokeLinecap="round" 
          strokeOpacity="0.9" 
        />
        <circle cx="14" cy="22" r="2.8" stroke="#ffffff" strokeWidth="1.8" strokeOpacity="0.9" fill="none" />
        <path d="M12.8 20.8L15.2 23.2" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.9" />
      </svg>
    </div>
  );
}
