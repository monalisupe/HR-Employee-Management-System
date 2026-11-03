import React from 'react';

/**
 * NexoraLogo
 * Accurate reproduction of the Nexora brand typography & vibrant gradient glyph:
 * - Geometric modern 'N' glyph with vivid gradient (Electric Blue -> Royal Purple -> Fuchsia)
 * - Modern sans-serif 'exora' in crisp slate-900 typography
 */
export default function NexoraLogo({ size = "default", className = "" }) {
  const isLarge = size === "lg";
  const isSmall = size === "sm";

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {/* Stylized Modern 'N' Mark with Gradient */}
      <div className={`relative flex items-center justify-center ${isLarge ? 'h-9 w-9' : isSmall ? 'h-6 w-6' : 'h-8 w-8'}`}>
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="nexoraNGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="35%" stopColor="#4f46e5" />
              <stop offset="70%" stopColor="#9333ea" />
              <stop offset="100%" stopColor="#db2777" />
            </linearGradient>
            <linearGradient id="nexoraStemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          {/* Stylized geometric N matching screenshot */}
          {/* Left Vertical Pillar */}
          <rect x="5" y="6" width="6.5" height="24" rx="3.25" fill="url(#nexoraStemGrad)" />
          {/* Diagonal connecting stroke */}
          <path
            d="M8.5 7.5 L 26.5 28"
            stroke="url(#nexoraNGradient)"
            strokeWidth="6.5"
            strokeLinecap="round"
          />
          {/* Right Vertical Pillar */}
          <rect x="24.5" y="6" width="6.5" height="24" rx="3.25" fill="url(#nexoraNGradient)" />
        </svg>
      </div>

      {/* Brand Text */}
      <span className={`font-bold tracking-tight text-slate-900 leading-none ${
        isLarge ? 'text-2xl' : isSmall ? 'text-lg' : 'text-xl'
      }`}>
        <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 bg-clip-text text-transparent font-extrabold">N</span>
        <span className="text-slate-900 font-bold">exora</span>
      </span>
    </div>
  );
}

