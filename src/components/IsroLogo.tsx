import React from 'react';

interface IsroLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const IsroLogo: React.FC<IsroLogoProps> = ({ 
  className = "w-8 h-8", 
  size = 32,
  showText = false 
}) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`} 
      title="Indian Space Research Organisation (ISRO)"
    >
      <svg
        viewBox="0 0 120 120"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md select-none"
      >
        {/* Outer Circular Glow / Space Badge Background */}
        <circle cx="60" cy="60" r="56" fill="#0b1329" stroke="#1e293b" strokeWidth="2" />
        <circle cx="60" cy="60" r="54" fill="url(#isro-bg-grad)" opacity="0.95" />

        {/* Gradients */}
        <defs>
          <linearGradient id="isro-bg-grad" x1="60" y1="6" x2="60" y2="114" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0f172a" />
            <stop offset="1" stopColor="#020617" />
          </linearGradient>
          <linearGradient id="isro-orange-grad" x1="60" y1="18" x2="60" y2="88" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF9933" />
            <stop offset="0.5" stopColor="#FF671F" />
            <stop offset="1" stopColor="#D9381E" />
          </linearGradient>
          <linearGradient id="isro-blue-panel" x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#38bdf8" />
            <stop offset="1" stopColor="#0284c7" />
          </linearGradient>
        </defs>

        {/* ISRO Blue Satellite Solar Panel Arrays (Left and Right) */}
        {/* Left Solar Panel Bars */}
        <g fill="url(#isro-blue-panel)" opacity="0.95">
          <rect x="22" y="46" width="16" height="3.5" rx="0.8" />
          <rect x="22" y="52.5" width="16" height="3.5" rx="0.8" />
          <rect x="22" y="59" width="16" height="3.5" rx="0.8" />
          <rect x="22" y="65.5" width="16" height="3.5" rx="0.8" />
        </g>
        
        {/* Right Solar Panel Bars */}
        <g fill="url(#isro-blue-panel)" opacity="0.95">
          <rect x="82" y="46" width="16" height="3.5" rx="0.8" />
          <rect x="82" y="52.5" width="16" height="3.5" rx="0.8" />
          <rect x="82" y="59" width="16" height="3.5" rx="0.8" />
          <rect x="82" y="65.5" width="16" height="3.5" rx="0.8" />
        </g>

        {/* Solar Panel Connector Rods */}
        <line x1="38" y1="57" x2="48" y2="57" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="72" y1="57" x2="82" y2="57" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />

        {/* Official ISRO Ascending Rocket & Dynamic Plume (Saffron/Orange) */}
        {/* Central Upward Rocket Vector */}
        <path
          d="M60 17L66 48L64 74L60 71L56 74L54 48L60 17Z"
          fill="url(#isro-orange-grad)"
        />
        
        {/* Left Curved Dynamic Vector Wing */}
        <path
          d="M60 21C60 21 51 39 47 61C44.5 74.5 48 86 51 90C51 90 48 78 52 64C55.5 51 60 21 60 21Z"
          fill="#FF7722"
        />

        {/* Right Curved Dynamic Vector Wing */}
        <path
          d="M60 21C60 21 69 39 73 61C75.5 74.5 72 86 69 90C69 90 72 78 68 64C64.5 51 60 21 60 21Z"
          fill="#FF5500"
        />

        {/* Central Rocket Nosecone highlight & payload */}
        <polygon points="60,15 63,26 60,24 57,26" fill="#FFFFFF" />
        <circle cx="60" cy="36" r="1.8" fill="#FFFFFF" opacity="0.95" />

        {/* Lower Thrust Exhaust Glow */}
        <ellipse cx="60" cy="82" rx="3" ry="6" fill="#FDE047" opacity="0.8" />
        <circle cx="60" cy="78" r="1.8" fill="#FFFFFF" />

        {/* Satellite/Station Orbit Arc */}
        <path
          d="M26 84C42 98 78 98 94 84"
          stroke="#38bdf8"
          strokeWidth="1.2"
          strokeDasharray="3 2"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* ISRO Typography Text at Bottom */}
        <text
          x="60"
          y="107"
          textAnchor="middle"
          fill="#FFFFFF"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="11"
          letterSpacing="2.5"
        >
          ISRO
        </text>
      </svg>

      {showText && (
        <div className="flex flex-col ml-2.5 leading-none">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black tracking-widest text-orange-400 font-mono">ISRO</span>
            <span className="text-[10px] text-slate-400 font-hindi">इसरो</span>
          </div>
          <span className="text-[9px] text-slate-400 tracking-tight font-mono">Indian Space Research Org</span>
        </div>
      )}
    </div>
  );
};
