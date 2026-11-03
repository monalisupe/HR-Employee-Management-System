import React from 'react';

/**
 * HireFlowLogo
 * Matches the uploaded brand style:
 * - Left icon: Stylized ribbon geometric 'H' lettermark with vibrant Electric Blue -> Indigo -> Purple -> Fuchsia gradient
 * - Wordmark: "HireFlow" with the 'H' in the vibrant gradient and 'ireFlow' in crisp slate-900 typography
 */
export default function HireFlowLogo({ size = "default", className = "" }) {
  const isLarge = size === "lg";
  const isSmall = size === "sm";

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Stylized Ribbon 'H' Glyph with Blue-to-Fuchsia Gradient */}
      <div className={`relative flex items-center justify-center shrink-0 ${
        isLarge ? 'h-9 w-9' : isSmall ? 'h-6 w-6' : 'h-8 w-8'
      }`}>
        <svg
          viewBox="0 0 38 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            {/* Primary Blue to Fuchsia Flow Gradient */}
            <linearGradient id="hfMainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="35%" stopColor="#4f46e5" />
              <stop offset="70%" stopColor="#9333ea" />
              <stop offset="100%" stopColor="#db2777" />
            </linearGradient>

            {/* Left Stem (Electric Blue -> Royal Indigo) */}
            <linearGradient id="hfLeftStem" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>

            {/* Right Stem (Royal Violet -> Fuchsia) */}
            <linearGradient id="hfRightStem" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#d946ef" />
            </linearGradient>

            {/* Flow Bridge Gradient */}
            <linearGradient id="hfBridgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="50%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#c026d3" />
            </linearGradient>

            {/* Subtle Drop Shadow on the bridge fold */}
            <filter id="hfFoldShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1" dy="1" stdDeviation="1.5" floodColor="#1e1b4b" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Left Vertical Pillar */}
          <rect x="5.5" y="6" width="6.5" height="26" rx="3.25" fill="url(#hfLeftStem)" />

          {/* Right Vertical Pillar */}
          <rect x="26" y="6" width="6.5" height="26" rx="3.25" fill="url(#hfRightStem)" />

          {/* Dynamic Ribbon Flow Crossbar / Bridge (Connecting the two pillars with a subtle wave fold) */}
          <path
            d="M8.5 20.5 C 13.5 16, 24.5 22, 29.5 17.5"
            stroke="url(#hfBridgeGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            filter="url(#hfFoldShadow)"
          />

          {/* Glossy highlight accent dot */}
          <circle cx="8.75" cy="9.25" r="1.5" fill="#ffffff" opacity="0.6" />
        </svg>
      </div>

      {/* Brand Wordmark: "HireFlow" */}
      <span className={`font-bold tracking-tight text-slate-900 leading-none ${
        isLarge ? 'text-2xl' : isSmall ? 'text-lg' : 'text-xl'
      }`}>
        <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 bg-clip-text text-transparent font-extrabold">H</span>
        <span className="text-slate-900 font-bold">ire</span>
        <span className="text-slate-900 font-bold">Flow</span>
      </span>
    </div>
  );
}

