import React from 'react';

/**
 * TeamCollaborationIllustration
 * Clean, high-fidelity SVG illustration matching the modern SaaS HR collaboration scene:
 * - 3 teammates seated around a modern meeting desk with a laptop, notebooks, and pens
 * - Left: Speaker in purple polo shirt gesturing with open hands
 * - Center: Teammate in light blue patterned knit sweater and yellow trousers listening
 * - Right: Note-taker in purple dungarees with hair bun writing with a pen
 * - Soft lilac wavy background shapes and sleek cobalt blue chairs
 */
export default function TeamCollaborationIllustration({ className = "w-full h-auto max-h-[380px]" }) {
  return (
    <svg
      viewBox="0 0 680 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Soft Ambient Shadow */}
        <filter id="tableShadow" x="-10%" y="-10%" width="120%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#7c3aed" floodOpacity="0.08" />
        </filter>
        <filter id="cardGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="40" result="blur" />
        </filter>
        {/* Gradients */}
        <linearGradient id="wavyBackdrop" x1="0" y1="0" x2="680" y2="440" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ede7fa" stopOpacity="0.75" />
          <stop offset="50%" stopColor="#e4dbf7" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#eedff9" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="purpleShirtGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6d28d9" />
          <stop offset="100%" stopColor="#581c87" />
        </linearGradient>
        <linearGradient id="overallGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6b21a8" />
          <stop offset="100%" stopColor="#581c87" />
        </linearGradient>
        <linearGradient id="chairGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="yellowPantsGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="navyPantsGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* 1. SCALLOPED WAVY BACKGROUND SHAPE (Matches the lilac wave behind the characters) */}
      <path
        d="M-20 280 C 40 230, 90 240, 150 260 C 210 280, 270 230, 340 250 C 410 270, 470 230, 540 255 C 600 275, 650 240, 700 270 L 700 440 L -20 440 Z"
        fill="url(#wavyBackdrop)"
      />

      {/* 2. CHAIRS */}
      {/* Left Chair (Colleague 1) */}
      <g id="chair-left">
        <path
          d="M105 210 Q 115 160 145 160 Q 170 160 168 215 L 160 275 Q 130 285 105 270 Z"
          fill="url(#chairGrad)"
          rx="12"
        />
        {/* Chair Legs */}
        <path d="M120 275 L 110 395" stroke="#475569" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M155 275 L 165 395" stroke="#475569" strokeWidth="4.5" strokeLinecap="round" />
      </g>

      {/* Right Chair (Colleague 3) */}
      <g id="chair-right">
        <path
          d="M575 210 Q 565 160 535 160 Q 510 160 512 215 L 520 275 Q 550 285 575 270 Z"
          fill="url(#chairGrad)"
        />
        {/* Chair Legs */}
        <path d="M560 275 L 570 395" stroke="#475569" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M525 275 L 515 395" stroke="#475569" strokeWidth="4.5" strokeLinecap="round" />
      </g>

      {/* 3. CHARACTERS LEGS & LOWER BODIES (Rendered behind table) */}
      {/* Left Character Legs */}
      <g id="left-legs">
        {/* Far Leg */}
        <path d="M140 270 L 165 315 L 210 325 L 215 390" stroke="#1e1b4b" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" />
        {/* Near Leg */}
        <path d="M155 275 L 195 320 L 250 330 L 255 395" stroke="url(#navyPantsGrad)" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" />
        {/* Shoes */}
        <ellipse cx="225" cy="396" rx="18" ry="8" fill="#0f172a" />
        <ellipse cx="265" cy="402" rx="20" ry="9" fill="#0f172a" />
      </g>

      {/* Center Character Legs (Yellow Pants) */}
      <g id="center-legs">
        {/* Left Leg */}
        <path d="M315 285 L 315 385" stroke="url(#yellowPantsGrad)" strokeWidth="28" strokeLinecap="round" />
        {/* Right Leg */}
        <path d="M365 285 L 365 385" stroke="url(#yellowPantsGrad)" strokeWidth="28" strokeLinecap="round" />
        {/* Shoes */}
        <ellipse cx="315" cy="395" rx="16" ry="8" fill="#0f172a" />
        <ellipse cx="365" cy="395" rx="16" ry="8" fill="#0f172a" />
      </g>

      {/* Right Character Legs (Purple Overall Pants) */}
      <g id="right-legs">
        {/* Near Leg */}
        <path d="M530 275 L 490 320 L 440 330 L 435 390" stroke="url(#overallGrad)" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" />
        {/* Shoes */}
        <ellipse cx="425" cy="396" rx="18" ry="8" fill="#581c87" />
        <ellipse cx="425" cy="398" rx="16" ry="3" fill="#facc15" />
      </g>

      {/* 4. MEETING TABLE LEGS (Behind tabletop) */}
      <g id="table-legs">
        <path d="M210 270 L 190 415" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
        <path d="M225 270 L 240 415" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />
        <path d="M470 270 L 450 415" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />
        <path d="M485 270 L 505 415" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
      </g>

      {/* 5. TORSO, ARMS & HEADS */}
      {/* ----------------- LEFT CHARACTER (Speaker in Purple Polo) ----------------- */}
      <g id="speaker-left">
        {/* Torso in Purple Polo */}
        <path
          d="M130 220 C 130 185, 150 170, 185 170 C 215 170, 225 185, 230 225 L 225 285 C 195 290, 150 290, 130 280 Z"
          fill="url(#purpleShirtGrad)"
        />
        {/* Collar & Buttons */}
        <path d="M185 170 L 195 195 L 210 180" stroke="#f5d0fe" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <line x1="195" y1="195" x2="195" y2="215" stroke="#4c1d95" strokeWidth="2" />

        {/* Neck */}
        <rect x="182" y="150" width="16" height="22" rx="4" fill="#fbcfe8" />

        {/* Head */}
        <circle cx="190" cy="130" r="24" fill="#fcd34d" opacity="0.15" />
        <circle cx="190" cy="130" r="22" fill="#fed7aa" />

        {/* Friendly Profile Face */}
        {/* Nose & Smile */}
        <path d="M198 130 Q 206 133 199 138" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M192 142 Q 198 146 203 141" stroke="#ea580c" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Eye */}
        <circle cx="196" cy="126" r="2.5" fill="#1e293b" />
        {/* Eyebrow */}
        <path d="M193 121 Q 197 119 201 122" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />

        {/* Dark Hair */}
        <path
          d="M172 130 C 168 115, 175 102, 195 102 C 212 102, 216 112, 214 122 C 208 122, 204 116, 194 116 C 184 116, 178 122, 174 132 Z"
          fill="#1e1b4b"
        />

        {/* Left Arm gesturing forward */}
        <path
          d="M170 195 Q 205 205 240 220 Q 255 220 270 215"
          stroke="url(#purpleShirtGrad)"
          strokeWidth="18"
          strokeLinecap="round"
        />
        {/* Left Hand open speaking gesture */}
        <path
          d="M265 213 Q 280 205 292 212 Q 285 222 268 222 Z"
          fill="#fed7aa"
        />
        <path d="M285 208 L 298 214" stroke="#fed7aa" strokeWidth="3" strokeLinecap="round" />
        <path d="M282 216 L 296 222" stroke="#fed7aa" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* ----------------- CENTER CHARACTER (Sky Blue Argyle Sweater) ----------------- */}
      <g id="center-listener">
        {/* Torso in light sky blue sweater */}
        <path
          d="M295 210 C 295 180, 315 168, 340 168 C 365 168, 385 180, 385 210 L 388 285 L 292 285 Z"
          fill="#bae6fd"
        />
        {/* Subtle Diamond Argyle Pattern */}
        <g stroke="#ffffff" strokeWidth="1.5" opacity="0.8">
          <path d="M340 175 L 320 200 L 340 225 L 360 200 Z" fill="none" />
          <path d="M340 225 L 320 250 L 340 275 L 360 250 Z" fill="none" />
          <path d="M300 200 L 320 225 L 300 250" fill="none" />
          <path d="M380 200 L 360 225 L 380 250" fill="none" />
          {/* Thin dotted diagonals */}
          <line x1="320" y1="175" x2="360" y2="225" strokeDasharray="3 3" opacity="0.6" />
          <line x1="360" y1="175" x2="320" y2="225" strokeDasharray="3 3" opacity="0.6" />
        </g>
        {/* Collar */}
        <path d="M330 168 Q 340 178 350 168" stroke="#7dd3fc" strokeWidth="3" fill="#e0f2fe" />

        {/* Neck */}
        <rect x="333" y="148" width="14" height="22" rx="4" fill="#fed7aa" />

        {/* Head */}
        <circle cx="340" cy="128" r="22" fill="#fed7aa" />
        {/* Face Features */}
        <path d="M334 138 Q 340 143 346 138" stroke="#ea580c" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="333" cy="125" r="2.5" fill="#1e293b" />
        <circle cx="347" cy="125" r="2.5" fill="#1e293b" />
        <path d="M329 120 Q 333 118 337 120" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M343 120 Q 347 118 351 120" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round" />

        {/* Hair */}
        <path
          d="M320 128 C 316 112, 326 100, 340 100 C 356 100, 364 110, 360 126 C 354 120, 348 116, 340 116 C 330 116, 324 122, 320 128 Z"
          fill="#1e1b4b"
        />

        {/* Arms resting toward desk */}
        <path d="M300 205 Q 310 240 330 255" stroke="#bae6fd" strokeWidth="16" strokeLinecap="round" />
        <path d="M380 205 Q 370 240 350 255" stroke="#bae6fd" strokeWidth="16" strokeLinecap="round" />
        {/* Hands */}
        <ellipse cx="330" cy="256" rx="9" ry="7" fill="#fed7aa" />
        <ellipse cx="350" cy="256" rx="9" ry="7" fill="#fed7aa" />
      </g>

      {/* ----------------- RIGHT CHARACTER (Note-taker in Purple Overalls) ----------------- */}
      <g id="notetaker-right">
        {/* White Inner Shirt */}
        <path d="M465 210 Q 480 180 500 175 Q 520 180 535 210 Z" fill="#ffffff" />

        {/* Overalls Dungarees in Violet */}
        <path
          d="M472 215 L 485 285 L 530 285 L 535 215 C 520 205, 490 205, 472 215 Z"
          fill="url(#overallGrad)"
        />
        {/* Straps & Buckles */}
        <path d="M485 178 L 488 225" stroke="url(#overallGrad)" strokeWidth="8" strokeLinecap="round" />
        <path d="M515 178 L 512 225" stroke="url(#overallGrad)" strokeWidth="8" strokeLinecap="round" />
        <rect x="484" y="210" width="8" height="5" rx="1.5" fill="#e2e8f0" />
        <rect x="508" y="210" width="8" height="5" rx="1.5" fill="#e2e8f0" />
        {/* Front bib pocket */}
        <path d="M492 235 L 508 235 L 505 250 L 495 250 Z" stroke="#c084fc" strokeWidth="1.5" fill="none" />

        {/* Neck */}
        <rect x="492" y="152" width="14" height="22" rx="4" fill="#fed7aa" />

        {/* Head */}
        <circle cx="496" cy="130" r="22" fill="#fed7aa" />

        {/* Hair Top Bun */}
        <ellipse cx="508" cy="98" rx="12" ry="11" fill="#0f172a" />
        <path
          d="M480 130 C 475 110, 485 104, 502 104 C 516 104, 520 116, 514 132 C 506 126, 498 122, 488 124 Z"
          fill="#0f172a"
        />

        {/* Face Features (Profile facing left) */}
        <circle cx="488" cy="126" r="2.5" fill="#1e293b" />
        <path d="M485 120 Q 489 118 493 121" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
        <path d="M483 133 Q 476 136 483 140" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M486 142 Q 492 145 496 141" stroke="#ea580c" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Right Arm holding pen & writing on table */}
        <path
          d="M518 200 Q 490 220 460 250"
          stroke="#ffffff"
          strokeWidth="16"
          strokeLinecap="round"
        />
        {/* Hand with Pen */}
        <ellipse cx="456" cy="252" rx="7" ry="6" fill="#fed7aa" />
        {/* Dark pen / stylus tilted */}
        <line x1="462" y1="240" x2="450" y2="260" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* 6. WHITE CONFERENCE TABLE TOP (Sleek Modern White Desk) */}
      <g id="tabletop">
        {/* Table Top with Shadow */}
        <rect
          x="195"
          y="256"
          width="370"
          height="14"
          rx="7"
          fill="#ffffff"
          filter="url(#tableShadow)"
        />
        {/* Table Bevel Edge */}
        <rect
          x="198"
          y="266"
          width="364"
          height="5"
          rx="2"
          fill="#e2e8f0"
        />

        {/* 7. ITEMS ON THE TABLE */}
        {/* Left Item: Open Modern Laptop */}
        <g id="laptop">
          {/* Laptop Base */}
          <rect x="250" y="250" width="56" height="6" rx="2" fill="#334155" />
          {/* Laptop Screen Tilted */}
          <path
            d="M255 252 L 272 208 L 314 208 L 302 252 Z"
            fill="#1e293b"
          />
          {/* Screen Display Glow (Soft Cyan/Purple) */}
          <path
            d="M258 250 L 273 212 L 310 212 L 299 250 Z"
            fill="#38bdf8"
            opacity="0.9"
          />
          {/* Code/Chart Lines on Laptop Screen */}
          <line x1="274" y1="220" x2="295" y2="220" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="272" y1="226" x2="298" y2="226" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="270" y1="232" x2="288" y2="232" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
        </g>

        {/* Right Item: White Notepad / Paper with Meeting Notes */}
        <g id="notepad">
          <polygon
            points="435,252 470,252 465,264 430,264"
            fill="#f8fafc"
            stroke="#cbd5e1"
            strokeWidth="1.2"
          />
          {/* Subtle text notes */}
          <line x1="437" y1="256" x2="455" y2="256" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="435" y1="260" x2="452" y2="260" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}

