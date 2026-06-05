import { useRef, useEffect, useState } from 'react'
import { motion, useInView, useScroll, useTransform, MotionValue, AnimatePresence } from 'framer-motion'
import { getScrollDir } from '../hooks/useScrollDirection'
import { MapPin } from 'lucide-react'

// ── SVG coordinates ───────────────────────────────────────────────────────────
// ViewBox 1200 × 320. Milestones:
//   MS1 (BUT MMI)    → (80, 252)
//   MS2 (Mastère)    → (640, 165)
//   MS3 (Persan ★)   → (1090, 70)
// ─────────────────────────────────────────────────────────────────────────────

const PATH_D = 'M 80 252 C 180 255 290 135 440 110 C 580 85 580 188 700 170 C 820 152 870 60 1020 60 C 1050 60 1070 68 1090 70'

const MILESTONES = [
  {
    id: 'mmi',
    cx: 80, cy: 252,
    period: '2021 — 2024',
    chapter: 'Chapitre I',
    title: 'BUT MMI',
    subtitle: "IUT de Béziers — Métiers du Multimédia",
    location: 'Béziers',
    color: '#a78bfa',
    skills: ['HTML/CSS', 'JS', 'PHP', 'Illustrator', 'After Effects', 'Premiere Pro'],
    desc: "Formation pluridisciplinaire — design, web, audiovisuel. L'origine de tout.",
    isCurrent: false,
  },
  {
    id: 'mastere',
    cx: 640, cy: 165,
    period: 'Depuis 2025',
    chapter: 'Chapitre II',
    title: 'Mastère Dev. Full-Stack',
    subtitle: 'Livecampus · Paris · Alternance 1ère Année',
    location: 'Paris',
    color: '#c9a54e',
    skills: ['React', 'TypeScript', 'Node.js', 'Express', 'Docker', 'SQLite'],
    desc: "Mastère en alternance, spécialisation full-stack — architecture d'apps, méthodes agiles et projets réels en entreprise.",
    isCurrent: false,
  },
  {
    id: 'now',
    cx: 1090, cy: 70,
    period: 'Oct. 2026',
    chapter: 'Chapitre III',
    title: 'Mastère Dev. Full-Stack',
    subtitle: 'Livecampus · Paris · Alternance 2ème Année',
    location: 'Île-de-France',
    color: '#f43f5e',
    skills: [],
    desc: 'Le prochain chapitre s\'écrit. À la recherche du contrat qui fera la différence.',
    isCurrent: false,
  },
]

// ── Building constellation line-art ──────────────────────────────────────────

function TowerBuilding({ x, y, color }: { x: number; y: number; color: string }) {
  // Medieval tower centered above milestone
  const tx = x - 38, ty = y - 95
  return (
    <g stroke={color} strokeWidth="1" fill="none" opacity="0.35">
      {/* Main tower body */}
      <rect x={tx + 14} y={ty + 30} width="48" height="65" />
      {/* Battlements */}
      <polyline points={`${tx+14},${ty+30} ${tx+14},${ty+20} ${tx+22},${ty+20} ${tx+22},${ty+30} ${tx+27},${ty+30} ${tx+27},${ty+20} ${tx+35},${ty+20} ${tx+35},${ty+30} ${tx+40},${ty+30} ${tx+40},${ty+20} ${tx+48},${ty+20} ${tx+48},${ty+30} ${tx+53},${ty+30} ${tx+53},${ty+20} ${tx+62},${ty+20} ${tx+62},${ty+30}`} />
      {/* Arrow-slit window */}
      <line x1={tx+33} y1={ty+45} x2={tx+33} y2={ty+60} />
      <line x1={tx+27} y1={ty+52} x2={tx+39} y2={ty+52} />
      {/* Arch door */}
      <line x1={tx+22} y1={ty+95} x2={tx+22} y2={ty+78} />
      <path d={`M ${tx+22} ${ty+78} Q ${tx+30} ${ty+70} ${tx+38} ${ty+78}`} />
      <line x1={tx+38} y1={ty+78} x2={tx+38} y2={ty+95} />
      {/* Side turrets */}
      <rect x={tx} y={ty+48} width="14" height="47" />
      <polyline points={`${tx},${ty+48} ${tx},${ty+38} ${tx+5},${ty+38} ${tx+5},${ty+48} ${tx+9},${ty+48} ${tx+9},${ty+38} ${tx+14},${ty+38} ${tx+14},${ty+48}`} />
      <rect x={tx+62} y={ty+48} width="14" height="47" />
      <polyline points={`${tx+62},${ty+48} ${tx+62},${ty+38} ${tx+67},${ty+38} ${tx+67},${ty+48} ${tx+71},${ty+48} ${tx+71},${ty+38} ${tx+76},${ty+38} ${tx+76},${ty+48}`} />
      {/* Constellation dots at vertices */}
      {[
        [tx+14, ty+30], [tx+62, ty+30], [tx+14, ty+20], [tx+62, ty+20],
        [tx, ty+48], [tx+76, ty+48], [tx+35, ty+20],
      ].map(([cx2, cy2], i) => (
        <circle key={i} cx={cx2} cy={cy2} r="2.5" fill={color} opacity="0.7" />
      ))}
    </g>
  )
}

function ArcDeTriomphe({ x, y, color }: { x: number; y: number; color: string }) {
  const tx = x - 44, ty = y - 78
  return (
    <g stroke={color} strokeWidth="1" fill="none" opacity="0.35">
      {/* Attic (top) */}
      <rect x={tx+8} y={ty} width="72" height="13" />
      {/* Entablature */}
      <rect x={tx} y={ty+13} width="88" height="11" />
      {/* Main body with two piers */}
      <rect x={tx} y={ty+24} width="88" height="54" />
      {/* Left pier */}
      <rect x={tx} y={ty+24} width="22" height="54" />
      {/* Right pier */}
      <rect x={tx+66} y={ty+24} width="22" height="54" />
      {/* Central arch */}
      <line x1={tx+22} y1={ty+78} x2={tx+22} y2={ty+50} />
      <path d={`M ${tx+22} ${ty+50} Q ${tx+44} ${ty+34} ${tx+66} ${ty+50}`} />
      <line x1={tx+66} y1={ty+50} x2={tx+66} y2={ty+78} />
      {/* Smaller relief arch left */}
      <path d={`M ${tx+4} ${ty+48} Q ${tx+11} ${ty+42} ${tx+18} ${ty+48}`} />
      {/* Smaller relief arch right */}
      <path d={`M ${tx+70} ${ty+48} Q ${tx+77} ${ty+42} ${tx+84} ${ty+48}`} />
      {/* Attic detail lines */}
      <line x1={tx+20} y1={ty} x2={tx+20} y2={ty+13} />
      <line x1={tx+44} y1={ty} x2={tx+44} y2={ty+13} />
      <line x1={tx+68} y1={ty} x2={tx+68} y2={ty+13} />
      {/* Constellation dots */}
      {[[tx, ty+13],[tx+88,ty+13],[tx+44,ty],[tx,ty+78],[tx+88,ty+78],[tx+22,ty+50],[tx+66,ty+50]].map(([cx2,cy2],i)=>(
        <circle key={i} cx={cx2} cy={cy2} r="2" fill={color} opacity="0.7" />
      ))}
    </g>
  )
}

function TourEiffel({ x, y, color }: { x: number; y: number; color: string }) {
  const tx = x - 26, ty = y - 88
  return (
    <g stroke={color} strokeWidth="1" fill="none" opacity="0.35">
      {/* Base */}
      <line x1={tx} y1={ty+88} x2={tx+52} y2={ty+88} />
      {/* Four legs */}
      <line x1={tx} y1={ty+88} x2={tx+20} y2={ty+56} />
      <line x1={tx+52} y1={ty+88} x2={tx+32} y2={ty+56} />
      {/* First floor */}
      <line x1={tx+5} y1={ty+74} x2={tx+47} y2={ty+74} />
      {/* Cross bracing base */}
      <line x1={tx+3} y1={ty+86} x2={tx+18} y2={ty+60} />
      <line x1={tx+49} y1={ty+86} x2={tx+34} y2={ty+60} />
      {/* Second section */}
      <line x1={tx+20} y1={ty+56} x2={tx+32} y2={ty+56} />
      <line x1={tx+20} y1={ty+56} x2={tx+24} y2={ty+32} />
      <line x1={tx+32} y1={ty+56} x2={tx+28} y2={ty+32} />
      {/* Second floor */}
      <line x1={tx+17} y1={ty+44} x2={tx+35} y2={ty+44} />
      {/* Cross bracing mid */}
      <line x1={tx+21} y1={ty+54} x2={tx+27} y2={ty+34} />
      <line x1={tx+31} y1={ty+54} x2={tx+25} y2={ty+34} />
      {/* Top section */}
      <line x1={tx+24} y1={ty+32} x2={tx+28} y2={ty+32} />
      <line x1={tx+24} y1={ty+32} x2={tx+25} y2={ty+18} />
      <line x1={tx+28} y1={ty+32} x2={tx+27} y2={ty+18} />
      <line x1={tx+22} y1={ty+25} x2={tx+30} y2={ty+25} />
      {/* Spire */}
      <line x1={tx+26} y1={ty+18} x2={tx+26} y2={ty+2} />
      <line x1={tx+24} y1={ty+8} x2={tx+28} y2={ty+8} />
      {/* Constellation dots */}
      {[[tx,ty+88],[tx+52,ty+88],[tx+26,ty+2],[tx+26,ty+32],[tx+20,ty+56],[tx+32,ty+56]].map(([cx2,cy2],i)=>(
        <circle key={i} cx={cx2} cy={cy2} r="2" fill={color} opacity="0.8" />
      ))}
    </g>
  )
}

function CompassTown({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g stroke={color} strokeWidth="1" fill="none" opacity="0.4">
      {/* Compass rose */}
      <line x1={x} y1={y-32} x2={x} y2={y+32} />
      <line x1={x-32} y1={y} x2={x+32} y2={y} />
      <line x1={x-22} y1={y-22} x2={x+22} y2={y+22} />
      <line x1={x+22} y1={y-22} x2={x-22} y2={y+22} />
      <circle cx={x} cy={y} r="10" />
      <circle cx={x} cy={y} r="4" fill={color} opacity="0.8" />
      {/* N tip */}
      <polyline points={`${x-4},${y-14} ${x},${y-32} ${x+4},${y-14}`} />
      {/* S tip */}
      <polyline points={`${x-4},${y+14} ${x},${y+32} ${x+4},${y+14}`} />
      {/* E tip */}
      <polyline points={`${x+14},${y-4} ${x+32},${y} ${x+14},${y+4}`} />
      {/* W tip */}
      <polyline points={`${x-14},${y-4} ${x-32},${y} ${x-14},${y+4}`} />
      {/* Small town buildings to the left */}
      <rect x={x-85} y={y+5} width="18" height="25" />
      <polyline points={`${x-85},${y+5} ${x-76},${y-7} ${x-67},${y+5}`} />
      <rect x={x-62} y={y+8} width="14" height="22" />
      <polyline points={`${x-62},${y+8} ${x-55},${y-2} ${x-48},${y+8}`} />
      {/* Constellation dots */}
      {[
        [x, y-32], [x, y+32], [x-32, y], [x+32, y],
        [x-22, y-22], [x+22, y-22], [x-22, y+22], [x+22, y+22],
      ].map(([cx2, cy2], i) => (
        <circle key={i} cx={cx2} cy={cy2} r="2" fill={color} opacity="0.9" />
      ))}
    </g>
  )
}

function MountainRange({ points, color, opacity = 0.18, inView = false, delay = 0 }: {
  points: string; color: string; opacity?: number; inView?: boolean; delay?: number
}) {
  return (
    <g>
      <motion.polyline
        points={points}
        stroke={color} strokeWidth="1.2" fill="none" strokeLinejoin="round"
        opacity={opacity}
        initial={{ strokeDasharray: '0 3000' }}
        animate={inView ? { strokeDasharray: '3000 0' } : { strokeDasharray: '0 3000' }}
        transition={{ duration: 3.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
      {points.split(' ').map((p, i) => {
        const [px, py] = p.split(',').map(Number)
        if (i % 2 === 1) return (
          <motion.circle key={i} cx={px} cy={py} r="1.5" fill={color}
            initial={{ scale: 0, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: opacity * 1.8 } : {}}
            transition={{ delay: delay + 2.8, duration: 0.5 }}
          />
        )
        return null
      })}
    </g>
  )
}

// ── Small trees ───────────────────────────────────────────────────────────────
function Trees({ positions, color }: { positions: [number, number][]; color: string }) {
  return (
    <g stroke={color} strokeWidth="0.8" fill="none" opacity="0.2">
      {positions.map(([x, y], i) => (
        <g key={i}>
          <line x1={x} y1={y + 16} x2={x} y2={y} />
          <polyline points={`${x - 8},${y + 8} ${x},${y - 4} ${x + 8},${y + 8}`} />
          <polyline points={`${x - 6},${y + 3} ${x},${y - 10} ${x + 6},${y + 3}`} />
        </g>
      ))}
    </g>
  )
}

// ── Constellation dots scattered along path ───────────────────────────────────
const PATH_DOTS: [number, number][] = [
  [155, 248], [235, 210], [305, 165], [385, 118], [455, 100],
  [520, 102], [575, 135], [625, 168], [680, 166], [730, 158],
  [785, 130], [840, 92], [905, 68], [950, 63], [1010, 63],
]

// ── Map component ─────────────────────────────────────────────────────────────
function JourneyMap({ inView, mapProgress }: { inView: boolean; mapProgress: MotionValue<number> }) {
  const pathRef = useRef<SVGPathElement>(null)
  const [pathLen, setPathLen] = useState(0)

  useEffect(() => {
    if (pathRef.current) setPathLen(pathRef.current.getTotalLength())
  }, [])

  // Scroll-driven strokeDashoffset : chemin se trace/défait avec le scroll
  const strokeDashoffset = useTransform(mapProgress, (p) =>
    pathLen > 0 ? pathLen * (1 - Math.max(0, Math.min(1, p))) : pathLen
  )

  return (
    <svg
      viewBox="0 0 1200 320"
      preserveAspectRatio="xMidYMid meet"
      style={{ width: '100%', height: 'auto', overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="journeyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="45%" stopColor="#c9a54e" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>
        <filter id="nodeGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── Background dot grid ── */}
      {[...Array(12)].map((_, row) =>
        [...Array(20)].map((__, col) => (
          <circle key={`${row}-${col}`} cx={col * 63 + 12} cy={row * 28 + 10}
            r="0.8" fill="#c9a54e" opacity="0.04" />
        ))
      )}

      {/* ── Terrain: montagnes — dessin + flottement ── */}
      <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}>
        <MountainRange color="#a78bfa"
          points="170,260 205,218 235,238 268,190 302,220 335,182 368,215 410,258"
          opacity={0.22} inView={inView} delay={0.3}
        />
      </motion.g>
      <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}>
        <MountainRange color="#c9a54e"
          points="460,258 490,220 515,238 548,195 578,225 610,200 640,258"
          opacity={0.18} inView={inView} delay={0.6}
        />
      </motion.g>
      <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}>
        <MountainRange color="#c9a54e"
          points="750,175 785,138 812,158 850,108 888,145 925,112 960,148 1000,168"
          opacity={0.2} inView={inView} delay={0.9}
        />
      </motion.g>

      {/* ── Terrain: trees ── */}
      <Trees color="#a78bfa" positions={[[28, 220], [44, 228], [16, 232]]} />
      <Trees color="#c9a54e" positions={[[596, 148], [612, 155], [660, 148], [674, 155]]} />
      <Trees color="#f43f5e" positions={[[1110, 52], [1126, 60]]} />

      {/* ── Constellation dots along path ── */}
      {PATH_DOTS.map(([px, py], i) => (
        <motion.circle key={i} cx={px} cy={py} r="2"
          fill={i < 5 ? '#a78bfa' : i < 10 ? '#c9a54e' : '#f43f5e'}
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 0.45, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut', delay: 0.03 * i + 0.1 }}
        />
      ))}

      {/* ── Buildings at milestones ── */}
      {inView && (
        <>
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1.6 }}>
            <TowerBuilding x={80} y={252} color="#a78bfa" />
          </motion.g>
          {/* Paris — Tour Eiffel + Arc de Triomphe */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 1.6 }}>
            <TourEiffel x={608} y={165} color="#c9a54e" />
            <ArcDeTriomphe x={672} y={165} color="#c9a54e" />
          </motion.g>
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8, duration: 1.6 }}>
            <CompassTown x={1090} y={70} color="#f43f5e" />
          </motion.g>
        </>
      )}

      {/* ── Main journey path — scroll-driven ── */}
      <path ref={pathRef} d={PATH_D} stroke="none" fill="none" />
      {pathLen > 0 && (
        <motion.path
          d={PATH_D}
          stroke="url(#journeyGrad)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={pathLen}
          style={{
            strokeDashoffset,
            filter: 'drop-shadow(0 0 4px rgba(201,165,78,0.6))',
          }}
        />
      )}

      {/* ── Stage markers — positions exactes sur la courbe ── */}
      {/* 2023 : t=0.78 sur seg1 → (347, 138) */}
      {/* 2024 : t=0.18 sur seg2 (P0=440,110 C580,85 580,188 700,170) → (504, 107) */}
      {[
        { cx: 347, cy: 138, year: '2023', label: 'La Valrassienne', color: '#c9a54e', delay: 1.6 },
        { cx: 504, cy: 107, year: '2024', label: 'Pass Piscines',   color: '#34d399', delay: 2.0 },
      ].map((s) => (
        <motion.g key={s.year}
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: s.delay * 0.2, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Dotted line going up to label */}
          <line
            x1={s.cx} y1={s.cy - 8}
            x2={s.cx} y2={s.cy - 30}
            stroke={s.color} strokeWidth="0.8" strokeDasharray="2 2" opacity="0.55"
          />
          {/* Year label */}
          <text x={s.cx} y={s.cy - 38}
            textAnchor="middle" fill={s.color} fontSize="7" fontFamily="Cinzel"
            letterSpacing="1" opacity="0.8">
            {s.year}
          </text>
          {/* Company label */}
          <text x={s.cx} y={s.cy - 28}
            textAnchor="middle" fill={s.color} fontSize="6" fontFamily="Cinzel" opacity="0.55">
            {s.label}
          </text>
          {/* Small diamond */}
          <rect
            x={s.cx - 5} y={s.cy - 5} width="10" height="10"
            transform={`rotate(45, ${s.cx}, ${s.cy})`}
            fill={s.color + '18'} stroke={s.color} strokeWidth="1"
            filter="url(#softGlow)"
          />
          <circle cx={s.cx} cy={s.cy} r="2" fill={s.color} opacity="0.85" />
        </motion.g>
      ))}

      {/* ── Milestone markers ── */}
      {MILESTONES.map((ms, i) => (
        <motion.g key={ms.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: i * 0.12, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Outer glow ring (pulsing for current) */}
          {ms.isCurrent && (
            <motion.circle cx={ms.cx} cy={ms.cy} r="20"
              fill="none" stroke={ms.color} strokeWidth="1" opacity="0.4"
              animate={{ r: [18, 24, 18], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          )}
          {/* Diamond marker */}
          <rect x={ms.cx - 9} y={ms.cy - 9} width="18" height="18"
            transform={`rotate(45, ${ms.cx}, ${ms.cy})`}
            fill={ms.color + '22'} stroke={ms.color} strokeWidth="1.5"
            filter="url(#nodeGlow)"
          />
          <circle cx={ms.cx} cy={ms.cy} r="3.5" fill={ms.color} filter="url(#nodeGlow)" />
          {/* Location label */}
          <text x={ms.cx} y={ms.isCurrent ? ms.cy - 28 : ms.cy + 24}
            textAnchor="middle" fill={ms.color} fontSize="9" fontFamily="Cinzel" letterSpacing="2" opacity="0.85">
            {ms.location.toUpperCase()}
          </text>
        </motion.g>
      ))}
    </svg>
  )
}

// ── Mobile vertical journey path — full visual treatment ─────────────────────
function MobileJourneyPath({ inView, mapProgress, selectedIndex, onSelect }: {
  inView: boolean; mapProgress: MotionValue<number>;
  selectedIndex: number; onSelect: (i: number) => void
}) {
  const pathRef = useRef<SVGPathElement>(null)
  const [pathLen, setPathLen] = useState(0)
  const MOBILE_PATH_D = 'M 200 130 C 172 285 228 395 200 510 C 172 625 228 735 200 860'

  useEffect(() => {
    if (pathRef.current) setPathLen(pathRef.current.getTotalLength())
  }, [])

  // Scroll-driven strokeDashoffset — identique au desktop
  const strokeDashoffset = useTransform(mapProgress, (p) =>
    pathLen > 0 ? pathLen * (1 - Math.max(0, Math.min(1, p))) : pathLen
  )

  const SIDES: ('left' | 'right')[] = ['left', 'right', 'left']
  const CX = 200
  const GAP = 40

  const mobileDots: [number, number, string][] = [
    [195, 195, '#a78bfa'], [205, 245, '#a78bfa'], [194, 300, '#a78bfa'],
    [206, 355, '#a78bfa'], [195, 415, '#c9a54e'], [205, 460, '#c9a54e'],
    [195, 565, '#c9a54e'], [205, 615, '#c9a54e'], [194, 665, '#c9a54e'],
    [206, 720, '#f43f5e'], [195, 775, '#f43f5e'], [205, 820, '#f43f5e'],
  ]

  const mobileMs = [
    { ...MILESTONES[0], cx: CX, cy: 130 },
    { ...MILESTONES[1], cx: CX, cy: 510 },
    { ...MILESTONES[2], cx: CX, cy: 860 },
  ]

  return (
    <svg
      viewBox="0 0 400 960"
      preserveAspectRatio="xMidYMid meet"
      style={{ width: '100%', height: 'auto', overflow: 'visible', display: 'block' }}
    >
      <defs>
        <linearGradient id="mobileJourneyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="50%" stopColor="#c9a54e" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>
        <filter id="mobileNodeGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="mobileSoftGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Grille de points de fond */}
      {[...Array(11)].map((_, row) =>
        [...Array(5)].map((__, col) => (
          <circle key={`${row}-${col}`} cx={col * 90 + 20} cy={row * 90 + 20} r="1" fill="#c9a54e" opacity="0.04" />
        ))
      )}

      {/* Montagnes — même style que desktop */}
      <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}>
        <MountainRange color="#a78bfa"
          points="10,220 42,178 68,196 102,152 136,186 165,165 192,220"
          opacity={0.2} inView={inView} delay={0.3} />
      </motion.g>
      <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}>
        <MountainRange color="#c9a54e"
          points="218,420 250,375 278,395 312,348 345,382 375,362 398,420"
          opacity={0.16} inView={inView} delay={0.5} />
      </motion.g>
      <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}>
        <MountainRange color="#c9a54e"
          points="10,630 44,585 74,605 110,558 144,592 172,572 198,630"
          opacity={0.17} inView={inView} delay={0.7} />
      </motion.g>
      <motion.g animate={{ y: [0, -5, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}>
        <MountainRange color="#f43f5e"
          points="220,800 252,754 282,774 315,726 348,762 378,744 398,800"
          opacity={0.14} inView={inView} delay={0.9} />
      </motion.g>

      {/* Arbres */}
      <Trees color="#a78bfa" positions={[[14, 118], [28, 126], [6, 133]]} />
      <Trees color="#c9a54e" positions={[[358, 532], [372, 540], [350, 547]]} />
      <Trees color="#f43f5e" positions={[[14, 875], [28, 883]]} />

      {/* Bâtiments — mêmes composants que desktop */}
      {inView && (
        <>
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1.6 }}>
            <TowerBuilding x={328} y={258} color="#a78bfa" />
          </motion.g>
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 1.6 }}>
            <TourEiffel   x={68}  y={588} color="#c9a54e" />
            <ArcDeTriomphe x={136} y={588} color="#c9a54e" />
          </motion.g>
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8, duration: 1.6 }}>
            <CompassTown x={348} y={860} color="#f43f5e" />
          </motion.g>
        </>
      )}

      {/* Marqueurs de stage — même style que desktop */}
      {[
        { cx: 195, cy: 348, year: '2023', label: 'La Valrassienne', color: '#c9a54e', side: 'left'  as const },
        { cx: 205, cy: 456, year: '2024', label: 'Pass Piscines',   color: '#34d399', side: 'right' as const },
      ].map((s) => {
        const lineEndX = s.side === 'left' ? s.cx - 40 : s.cx + 40
        const textX    = s.side === 'left' ? s.cx - 46 : s.cx + 46
        const anchor   = s.side === 'left' ? 'end' : 'start'
        return (
          <motion.g key={s.year}
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.35, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <line x1={s.cx} y1={s.cy} x2={lineEndX} y2={s.cy}
              stroke={s.color} strokeWidth="1.2" strokeDasharray="3 3" opacity="0.55" />
            <text x={textX} y={s.cy - 8} textAnchor={anchor}
              fill={s.color} fontSize="13" fontFamily="Cinzel" letterSpacing="1" opacity="0.85">
              {s.year}
            </text>
            <text x={textX} y={s.cy + 8} textAnchor={anchor}
              fill={s.color} fontSize="11" fontFamily="Cinzel" opacity="0.6">
              {s.label}
            </text>
            <rect x={s.cx - 7} y={s.cy - 7} width="14" height="14"
              transform={`rotate(45, ${s.cx}, ${s.cy})`}
              fill={s.color + '18'} stroke={s.color} strokeWidth="1.2"
              filter="url(#mobileSoftGlow)" />
            <circle cx={s.cx} cy={s.cy} r="3.5" fill={s.color} opacity="0.85" />
          </motion.g>
        )
      })}

      {/* Points de constellation le long du chemin */}
      {mobileDots.map(([px, py, fill], i) => (
        <motion.circle key={i} cx={px} cy={py} r="5"
          fill={fill}
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 0.5, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.25, delay: 0.04 * i + 0.4 }}
        />
      ))}

      {/* Chemin de référence (mesure de longueur) */}
      <path ref={pathRef} d={MOBILE_PATH_D} stroke="none" fill="none" />

      {/* Chemin scroll-driven — se dessine/efface avec le scroll */}
      {pathLen > 0 && (
        <motion.path
          d={MOBILE_PATH_D}
          stroke="url(#mobileJourneyGrad)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={pathLen}
          style={{
            strokeDashoffset,
            filter: 'drop-shadow(0 0 8px rgba(201,165,78,0.65))',
          }}
        />
      )}

      {/* Nœuds cliquables */}
      {mobileMs.map((ms, i) => {
        const active = selectedIndex === i
        const side   = SIDES[i]
        const labelX = side === 'left' ? ms.cx - GAP : ms.cx + GAP
        const anchor = side === 'left' ? 'end' : 'start'
        const hitX   = side === 'left' ? 0 : ms.cx - GAP
        const hitW   = side === 'left' ? ms.cx + GAP : 400 - (ms.cx - GAP)

        // Titre sur 2 lignes si > 12 chars
        const words = ms.title.split(' ')
        const cut   = words.findIndex((_, idx) => words.slice(0, idx + 1).join(' ').length > 12)
        const t1    = cut > 0 ? words.slice(0, cut).join(' ') : ms.title
        const t2    = cut > 0 ? words.slice(cut).join(' ')    : ''

        return (
          <g key={ms.id} onClick={() => onSelect(i)} style={{ cursor: 'pointer' }}>
            {/* Zone de tap pleine largeur */}
            <rect x={hitX} y={ms.cy - 60} width={hitW} height={120} fill="transparent" />

            {/* Doubles anneaux pulsants — actif */}
            {active && (
              <>
                <motion.circle cx={ms.cx} cy={ms.cy} r="36"
                  fill="none" stroke={ms.color} strokeWidth="1.5" opacity="0.18"
                  animate={{ r: [32, 42, 32], opacity: [0.18, 0.4, 0.18] }}
                  transition={{ duration: 3, repeat: Infinity }} />
                <motion.circle cx={ms.cx} cy={ms.cy} r="24"
                  fill="none" stroke={ms.color} strokeWidth="2" opacity="0.45"
                  animate={{ r: [21, 30, 21], opacity: [0.45, 0.85, 0.45] }}
                  transition={{ duration: 2.4, repeat: Infinity, delay: 0.4 }} />
              </>
            )}

            {/* Halo de fond */}
            <circle cx={ms.cx} cy={ms.cy} r={active ? 28 : 20}
              fill={ms.color} opacity={active ? 0.15 : 0.06} />

            {/* Diamant */}
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: active ? 1 : 0.55, scale: active ? 1.35 : 1 } : { opacity: 0, scale: 0 }}
              transition={{ delay: 0.5 + i * 0.4, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <rect x={ms.cx - 16} y={ms.cy - 16} width="32" height="32"
                transform={`rotate(45, ${ms.cx}, ${ms.cy})`}
                fill={active ? ms.color + '44' : ms.color + '18'}
                stroke={ms.color} strokeWidth={active ? 3 : 2}
                filter="url(#mobileNodeGlow)" />
              <circle cx={ms.cx} cy={ms.cy} r={active ? 8 : 5}
                fill={ms.color} filter="url(#mobileNodeGlow)" />
            </motion.g>

            {/* Étiquettes */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.7 + i * 0.4 }}
            >
              {/* Chapitre · Période */}
              <text x={labelX} y={ms.cy - (t2 ? 32 : 26)}
                textAnchor={anchor} fill={ms.color}
                fontSize="14" fontFamily="Cinzel" letterSpacing="0.5"
                opacity={active ? 1 : 0.65}>
                {ms.chapter} · {ms.period}
              </text>

              {/* Titre — ligne 1 */}
              <text x={labelX} y={ms.cy + (t2 ? -10 : 2)}
                textAnchor={anchor}
                fill={active ? '#e8ddd0' : '#9a8a7a'}
                fontSize="18" fontFamily="Cinzel"
                fontWeight={active ? 'bold' : 'normal'}
                opacity={active ? 1 : 0.8}>
                {t1}
              </text>

              {/* Titre — ligne 2 (si nécessaire) */}
              {t2 && (
                <text x={labelX} y={ms.cy + 14}
                  textAnchor={anchor}
                  fill={active ? '#e8ddd0' : '#9a8a7a'}
                  fontSize="18" fontFamily="Cinzel"
                  fontWeight={active ? 'bold' : 'normal'}
                  opacity={active ? 1 : 0.8}>
                  {t2}
                </text>
              )}

              {/* Indicateur bas */}
              {active ? (
                <text x={labelX} y={ms.cy + (t2 ? 38 : 24)}
                  textAnchor={anchor} fill={ms.color}
                  fontSize="14" fontFamily="Cinzel" opacity="0.88">
                  ◆ {ms.location}
                </text>
              ) : (
                <text x={labelX} y={ms.cy + (t2 ? 38 : 24)}
                  textAnchor={anchor} fill={ms.color}
                  fontSize="14" fontFamily="Cinzel" opacity="0.65">
                  ◈ Appuyer pour voir
                </text>
              )}
            </motion.g>
          </g>
        )
      })}
    </svg>
  )
}

const CHAPTER_NUMERALS = ['I', 'II', 'III']

// ── Internship stages ─────────────────────────────────────────────────────────

interface Stage {
  id: string
  period: string
  company: string
  context: string
  duration: string
  location: string
  color: string
  skills: string[]
  desc: string
}

const STAGES: Stage[] = [
  {
    id: 'valrassienne',
    period: '2023',
    company: 'La Valrassienne',
    context: 'Stage BUT MMI — 2ème année',
    duration: '6 semaines',
    location: 'Hérault',
    color: '#c9a54e',
    skills: ['Illustrator', 'Identité visuelle', 'Carte de visite'],
    desc: 'Création du logo et de la carte de visite pour La Valrassienne.',
  },
  {
    id: 'pass-piscines',
    period: '2024',
    company: 'Pass Piscines et Spas',
    context: 'Stage BUT MMI — 3ème année',
    duration: '8 semaines',
    location: 'Hérault',
    color: '#34d399',
    skills: ['Illustrator', 'WordPress', 'Print', 'Banderole', 'Dépliant'],
    desc: 'Supports print (banderole, dépliant) et réalisation du site Benestar avec WordPress, déployé en production.',
  },
]

// ── Alternance data ───────────────────────────────────────────────────────────

interface Alternance {
  id: string
  period: string
  company: string
  duration: string
  location: string
  color: string
  skills: string[]
  desc: string
  isCurrent: boolean
}

const ALTERNANCES_MASTERE: Alternance[] = [
  {
    id: 'lsa',
    period: '2025 — 2026',
    company: 'Littoral Sport Academy',
    duration: '1 an',
    location: 'Toulon',
    color: '#c9a54e',
    skills: ['React / Vite', 'Node.js / Express 5', 'SQLite', 'Docker', 'JWT', 'WordPress', 'Identité visuelle'],
    desc: 'Application de gestion de matériel (full-stack, déployée Docker), deux sites WordPress et refonte d\'identité visuelle.',
    isCurrent: true,
  },
]

// ── Milestone card ─────────────────────────────────────────────────────────────
function MilestoneCard({ ms, i, inView, exitY, stages, alternances }: {
  ms: typeof MILESTONES[0]; i: number; inView: boolean; exitY: number; stages?: Stage[]; alternances?: Alternance[]
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: exitY }}
      transition={inView
        ? { type: 'spring', stiffness: 380, damping: 32, delay: i * 0.08 }
        : { duration: 0.15, ease: 'easeIn' }}
      className="relative rounded-2xl overflow-hidden cursor-none group"
      style={{
        background: `linear-gradient(145deg, ${ms.color}08, #0d0d1a)`,
        border: `1px solid ${ms.isCurrent ? ms.color + '66' : ms.color + '55'}`,
        boxShadow: ms.isCurrent
          ? `0 0 50px ${ms.color}22, 0 0 100px ${ms.color}0d, 0 24px 64px #00000055`
          : `0 0 40px ${ms.color}22, 0 0 80px ${ms.color}0f, 0 8px 32px #00000044`,
      }}
    >
      {/* Left color accent bar */}
      <div className="absolute top-0 left-0 bottom-0 w-1 rounded-l-2xl"
        style={{ background: `linear-gradient(180deg, ${ms.color}ee, ${ms.color}33)` }} />

      {/* Giant background numeral */}
      <div
        className="absolute right-6 top-1/2 -translate-y-1/2 font-['Cinzel_Decorative'] font-black select-none pointer-events-none"
        style={{ fontSize: 'clamp(6rem, 10vw, 9rem)', color: ms.color, opacity: 0.06, lineHeight: 1 }}
      >
        {CHAPTER_NUMERALS[i]}
      </div>

      {/* Card content */}
      <div style={{ padding: 'clamp(1.5rem, 2.5vw, 2.25rem)', paddingLeft: 'clamp(2rem, 3vw, 2.75rem)' }}>

        {/* Top row: chapter + period */}
        <div className="flex items-center justify-between mb-6">
          <span className="font-['Cinzel'] tracking-[0.3em] uppercase label-glow"
            style={{ fontSize: '0.62rem', color: ms.color }}>
            {ms.chapter}
          </span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.68rem',
            padding: '0.35rem 0.8rem', borderRadius: '9999px',
            color: ms.color + 'ee', background: ms.color + '1a', border: `1px solid ${ms.color}44`,
          }}>
            {ms.period}
          </span>
        </div>

        {/* Title block */}
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 className="font-['Cinzel'] font-bold text-[#e8ddd0]"
            style={{ fontSize: 'clamp(1.1rem, 1.6vw, 1.5rem)', lineHeight: 1.2, marginBottom: '0.4rem' }}>
            {ms.title}
          </h3>
          <p style={{ fontSize: '0.8rem', color: ms.color + 'cc', lineHeight: 1.4 }}>{ms.subtitle}</p>
        </div>

        {/* Location pill */}
        <div className="flex items-center gap-2 mb-5">
          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: ms.color + '18', border: `1px solid ${ms.color}33` }}>
            <MapPin size={9} style={{ color: ms.color }} />
          </div>
          <span className="font-['JetBrains_Mono']" style={{ fontSize: '0.68rem', color: ms.color + '88' }}>
            {ms.location}
          </span>
          {ms.isCurrent && (
            <>
              <div className="w-1 h-1 rounded-full" style={{ background: '#3a3a55' }} />
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse-glow" style={{ background: ms.color }} />
                <span className="font-['Cinzel'] tracking-widest uppercase"
                  style={{ fontSize: '0.55rem', color: ms.color }}>En cours</span>
              </span>
            </>
          )}
        </div>

        {/* Description */}
        <p className="text-[#6b5e4e] leading-relaxed" style={{ fontSize: '0.82rem', marginBottom: '1.75rem' }}>{ms.desc}</p>

        {/* Divider + Skills — masqués si tableau vide */}
        {ms.skills.length > 0 && (
          <>
            <div style={{ height: '1px', background: `linear-gradient(90deg, ${ms.color}33, transparent)`, marginBottom: '1.75rem' }} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {ms.skills.map((skill, si) => (
                <motion.span key={skill}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: 0.04 + si * 0.02 }}
                  style={{
                    padding: '0.3rem 0.8rem', borderRadius: '4px',
                    fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem',
                    background: ms.color + '0e', border: `1px solid ${ms.color}20`, color: ms.color + 'bb',
                  }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </>
        )}

        {/* ── Stages intégrés (BUT MMI uniquement) ── */}
        {stages && stages.length > 0 && (
          <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: `1px solid ${ms.color}22` }}>
            <span className="font-['Cinzel'] tracking-[0.35em] uppercase"
              style={{ fontSize: '0.7rem', color: ms.color + 'cc', display: 'block', marginBottom: '1rem' }}>
              ◈ &nbsp; Stages
            </span>
            {stages.map((stage) => (
              <div key={stage.id} style={{ marginBottom: '1.25rem' }}>
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
                  <div>
                    <span className="font-['Cinzel'] font-semibold text-[#e8ddd0]"
                      style={{ fontSize: '0.82rem', display: 'block', lineHeight: 1.3 }}>
                      {stage.company}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: stage.color + 'aa', display: 'block', marginTop: '2px' }}>
                      {stage.desc}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.65rem', fontWeight: '500',
                      padding: '0.35rem 0.8rem', borderRadius: '9999px',
                      color: stage.color + 'bb', background: stage.color + '14', border: `1px solid ${stage.color}35`,
                    }}>
                      {stage.duration}
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: stage.color + '88' }}>
                      {stage.period}
                    </span>
                  </div>
                </div>
                {/* Space between duration row and skill bubbles */}
                {/* Skills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.6rem' }}>
                  {stage.skills.map(skill => (
                    <span key={skill}
                      style={{
                        padding: '0.25rem 0.65rem', borderRadius: '4px',
                        fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem',
                        background: stage.color + '0e', border: `1px solid ${stage.color}20`, color: stage.color + 'aa',
                      }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Alternance (Mastère uniquement) ── */}
        {alternances && alternances.length > 0 && (
          <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: `1px solid ${ms.color}22` }}>
            <span className="font-['Cinzel'] tracking-[0.35em] uppercase"
              style={{ fontSize: '0.7rem', color: ms.color + 'cc', display: 'block', marginBottom: '1rem' }}>
              ◈ &nbsp; Alternance
            </span>
            {alternances.map((alt) => (
              <div key={alt.id}>
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2px' }}>
                      <span className="font-['Cinzel'] font-semibold text-[#e8ddd0]"
                        style={{ fontSize: '0.82rem', lineHeight: 1.3 }}>
                        {alt.company}
                      </span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', color: alt.color + '88' }}>
                        · {alt.location}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: alt.color + 'aa', display: 'block', marginTop: '2px' }}>
                      {alt.desc}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.65rem', fontWeight: '500',
                      padding: '0.35rem 0.8rem', borderRadius: '9999px',
                      color: alt.color + 'bb', background: alt.color + '14', border: `1px solid ${alt.color}35`,
                    }}>
                      {alt.duration}
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: alt.color + '88' }}>
                      {alt.period}
                    </span>
                  </div>
                </div>
                {/* Skills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.6rem' }}>
                  {alt.skills.map(skill => (
                    <span key={skill}
                      style={{
                        padding: '0.25rem 0.65rem', borderRadius: '4px',
                        fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem',
                        background: alt.color + '0e', border: `1px solid ${alt.color}20`, color: alt.color + 'aa',
                      }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function Journey() {
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: false, margin: '-80px' })
  const exitYRef = useRef(40)
  const prevInViewRef = useRef<boolean | null>(null)
  if (prevInViewRef.current !== inView) {
    prevInViewRef.current = inView
    if (!inView) exitYRef.current = getScrollDir() === 'down' ? -40 : 40
  }

  // Scroll-driven path : [section entre dans le viewport → section centrée]
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const mapProgress = useTransform(scrollYProgress, [0.02, 0.32], [0, 1])
  const [selectedMobileMs, setSelectedMobileMs] = useState(0)

  return (
    <section className="relative overflow-hidden bg-[#080812]"
      style={{ paddingTop: 'clamp(3.5rem, 6vw, 7rem)', paddingBottom: 'clamp(3.5rem, 6vw, 7rem)' }}>

      {/* Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 opacity-[0.03] rounded-full"
          style={{ width: 'min(700px, 60vw)', height: 'min(700px, 60vw)', background: 'radial-gradient(circle, #c9a54e 0%, transparent 70%)', filter: 'blur(120px)', transform: 'translate(20%, -20%)' }} />
        <div className="absolute bottom-0 left-0 opacity-[0.03] rounded-full"
          style={{ width: 'min(600px, 50vw)', height: 'min(600px, 50vw)', background: 'radial-gradient(circle, #a78bfa 0%, transparent 70%)', filter: 'blur(100px)', transform: 'translate(-20%, 20%)' }} />
      </div>

      <div className="container-arcane relative" ref={sectionRef}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: exitYRef.current }}
          transition={inView
            ? { type: 'spring', stiffness: 380, damping: 32 }
            : { duration: 0.15, ease: 'easeIn' }}
          className="text-center"
          style={{ marginBottom: 'clamp(3rem, 5vw, 5rem)' }}
        >
          <div className="ornament mx-auto" style={{ marginBottom: '5rem' }}>Intermède</div>
          <h2 className="font-['Cinzel'] font-bold text-gradient-gold h2-glow-gold"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 6rem)', lineHeight: 1.05, marginBottom: '2.5rem' }}>
            La Quête
          </h2>
          <p className="label-glow-gold font-['Cinzel'] tracking-[0.4em] uppercase" style={{ fontSize: '0.7rem' }}>
            ◈ &nbsp; Parcours · Formations · Compétences &nbsp; ◈
          </p>
        </motion.div>

        {/* SVG Fantasy Map — masquée sur mobile */}
        <motion.div
          className="hidden md:block"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 'clamp(2.5rem, 4vw, 4rem)' }}
        >
          <JourneyMap inView={inView} mapProgress={mapProgress} />
        </motion.div>

        {/* ── Mobile : chemin interactif + carte sélectionnée ── */}
        <div className="block md:hidden" style={{ marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: '1.75rem' }}
          >
            <MobileJourneyPath
              inView={inView}
              mapProgress={mapProgress}
              selectedIndex={selectedMobileMs}
              onSelect={setSelectedMobileMs}
            />
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedMobileMs}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <MilestoneCard
                ms={MILESTONES[selectedMobileMs]}
                i={selectedMobileMs}
                inView={true}
                exitY={0}
                stages={MILESTONES[selectedMobileMs].id === 'mmi' ? STAGES : undefined}
                alternances={MILESTONES[selectedMobileMs].id === 'mastere' ? ALTERNANCES_MASTERE : undefined}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Desktop : 3 cartes côte à côte ── */}
        <div className="hidden md:grid md:grid-cols-3" style={{ gap: 'clamp(1.5rem, 2vw, 2rem)' }}>
          {MILESTONES.map((ms, i) => (
            <MilestoneCard
              key={ms.id}
              ms={ms}
              i={i}
              inView={inView}
              exitY={exitYRef.current}
              stages={ms.id === 'mmi' ? STAGES : undefined}
              alternances={ms.id === 'mastere' ? ALTERNANCES_MASTERE : undefined}
            />
          ))}
        </div>

        {/* ── Certification Opquast ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.8 }}
          style={{ marginTop: 'clamp(1.5rem, 3vw, 2.5rem)' }}
        >
          <div className="flex items-center gap-4" style={{ marginBottom: '2rem' }}>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, #a78bfa55)' }} />
            <span className="font-['Cinzel'] tracking-[0.4em] uppercase" style={{ fontSize: '0.65rem', color: '#a78bfa99', textShadow: '0 0 12px #a78bfa44' }}>
              ◈ &nbsp; Certification &nbsp; ◈
            </span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #a78bfa55, transparent)' }} />
          </div>

          <div
            className="relative rounded-xl overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #a78bfa06, #0a0a14)',
              border: '1px solid #a78bfa33',
              boxShadow: '0 0 24px #a78bfa12',
              padding: 'clamp(1rem, 2vw, 1.5rem)',
            }}
          >
            <div className="absolute top-0 left-0 bottom-0 w-0.5 rounded-l-xl"
              style={{ background: 'linear-gradient(180deg, #a78bfacc, #a78bfa22)' }} />

            <div className="flex items-center justify-between flex-wrap gap-3" style={{ paddingLeft: '1.5rem' }}>
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="font-['Cinzel'] font-semibold text-[#e8ddd0]" style={{ fontSize: 'clamp(0.85rem, 1.2vw, 1.1rem)' }}>
                    Certification Opquast
                  </span>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.65rem', fontWeight: '600',
                    padding: '0.35rem 0.8rem', borderRadius: '9999px',
                    color: '#a78bfa', background: '#a78bfa22', border: '1px solid #a78bfa55',
                  }}>
                    Valide jusqu'en déc. 2026
                  </span>
                </div>
                <p className="text-[#5a5065]" style={{ fontSize: '0.78rem', lineHeight: 1.5 }}>
                  Assurance qualité web · Règles et bonnes pratiques Opquast — Développement web
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="font-['Cinzel'] tracking-[0.25em] uppercase"
                  style={{ fontSize: '0.6rem', color: '#a78bfa' }}>Opquast</span>
                <span className="font-['JetBrains_Mono']"
                  style={{ fontSize: '0.6rem', color: '#a78bfa66' }}>Déc. 2023</span>
              </div>
            </div>

            <div style={{ marginTop: '1rem', paddingLeft: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {['Qualité Web', 'Accessibilité', 'Performance', 'SEO', 'Sécurité'].map(tag => (
                <span key={tag}
                  style={{
                    padding: '0.3rem 0.7rem', borderRadius: '4px',
                    fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem',
                    background: '#a78bfa0e', border: '1px solid #a78bfa20', color: '#a78bfaaa',
                  }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom ornament */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="text-center font-['Cinzel'] tracking-[0.5em] uppercase label-glow-gold"
          style={{ fontSize: '0.62rem', marginTop: 'clamp(2.5rem, 4vw, 4rem)' }}
        >
          ◈ &nbsp; La suite s'écrit avec vous &nbsp; ◈
        </motion.p>
      </div>
    </section>
  )
}
