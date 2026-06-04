import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { getScrollDir } from '../hooks/useScrollDirection'

// ── Skill tree data ────────────────────────────────────────────────────────────
// Positions are in SVG units (viewBox 1300 × 560)
// Root → 4 branches → skill leaves

const ROOT = { id: 'root', label: 'Développeur\nFull-Stack', x: 650, y: 50, r: 36, color: '#e8ddd0', ring: '#c9a54e' }

const BRANCHES = [
  { id: 'frontend', label: 'Frontend', x: 162, y: 185, r: 28, color: '#c9a54e' },
  { id: 'backend',  label: 'Backend',  x: 487, y: 185, r: 28, color: '#a78bfa' },
  { id: 'outils',   label: 'Outils',   x: 812, y: 185, r: 28, color: '#f43f5e' },
  { id: 'creation', label: 'Création', x: 1137, y: 185, r: 28, color: '#34d399' },
]

// level: 0-100 (0 = locked/not yet)
const SKILLS = [
  // Frontend
  { branch: 0, label: 'React',        x: 62,  y: 335, r: 22, level: 85 },
  { branch: 0, label: 'TypeScript',   x: 162, y: 335, r: 22, level: 80 },
  { branch: 0, label: 'Next.js',      x: 262, y: 335, r: 22, level: 75 },
  { branch: 0, label: 'Tailwind',     x: 62,  y: 460, r: 22, level: 90 },
  { branch: 0, label: 'HTML/CSS',     x: 162, y: 460, r: 22, level: 95 },
  { branch: 0, label: 'Framer',       x: 262, y: 460, r: 22, level: 70 },
  // Backend
  { branch: 1, label: 'Node.js',      x: 387, y: 335, r: 22, level: 80 },
  { branch: 1, label: 'Express',      x: 487, y: 335, r: 22, level: 78 },
  { branch: 1, label: 'MySQL',        x: 587, y: 335, r: 22, level: 72 },
  { branch: 1, label: 'MongoDB',      x: 387, y: 460, r: 22, level: 65 },
  { branch: 1, label: 'REST API',     x: 487, y: 460, r: 22, level: 82 },
  { branch: 1, label: 'PHP',          x: 587, y: 460, r: 22, level: 60 },
  // Outils
  { branch: 2, label: 'Git/GitHub',   x: 712, y: 335, r: 22, level: 88 },
  { branch: 2, label: 'Figma',        x: 812, y: 335, r: 22, level: 85 },
  { branch: 2, label: 'VS Code',      x: 912, y: 335, r: 22, level: 92 },
  { branch: 2, label: 'Vite',         x: 712, y: 460, r: 22, level: 82 },
  { branch: 2, label: 'Vercel',       x: 812, y: 460, r: 22, level: 80 },
  { branch: 2, label: 'Docker',       x: 912, y: 460, r: 22, level: 42 },
  // Création
  { branch: 3, label: 'After FX',     x: 1037, y: 335, r: 22, level: 78 },
  { branch: 3, label: 'Premiere',     x: 1137, y: 335, r: 22, level: 82 },
  { branch: 3, label: 'Illustrator',  x: 1237, y: 335, r: 22, level: 75 },
  { branch: 3, label: 'Photoshop',    x: 1037, y: 460, r: 22, level: 70 },
  { branch: 3, label: 'Branding',     x: 1137, y: 460, r: 22, level: 80 },
  { branch: 3, label: 'Montage',      x: 1237, y: 460, r: 22, level: 85 },
]

// ── Skill node — solid filled orb, no arc, no percentage ─────────────────────
function SkillNode({
  node, color, inView, delay,
}: {
  node: typeof SKILLS[0]; color: string; inView: boolean; delay: number
}) {
  const [hovered, setHovered] = useState(false)
  const locked = node.level < 30

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
      transition={{ delay: delay * 0.4, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'none' }}
    >
      {/* Outer glow halo */}
      {!locked && (
        <circle cx={node.x} cy={node.y} r={node.r + 10}
          fill={color} opacity={hovered ? 0.15 : 0.05} />
      )}

      {/* Outer ring */}
      <circle cx={node.x} cy={node.y} r={node.r}
        fill={locked ? '#08080f' : color + '0f'}
        stroke={locked ? '#1e1e30' : color + '55'}
        strokeWidth="1.5"
      />

      {/* Mid ring — creates depth */}
      {!locked && (
        <circle cx={node.x} cy={node.y} r={node.r * 0.68}
          fill="none"
          stroke={color + '30'}
          strokeWidth="1"
        />
      )}

      {/* Filled inner orb */}
      <circle cx={node.x} cy={node.y} r={node.r * 0.42}
        fill={locked ? '#1a1a28' : color}
        opacity={locked ? 0.3 : hovered ? 1 : 0.82}
        style={{ filter: locked ? 'none' : `drop-shadow(0 0 5px ${color})` }}
      />

      {/* Label below */}
      <text
        x={node.x} y={node.y + node.r + 13}
        textAnchor="middle"
        fill={locked ? '#2e2e48' : color + 'dd'}
        fontSize="8.5"
        fontFamily="'JetBrains Mono', monospace"
        fontWeight="500"
      >
        {node.label}
      </text>
    </motion.g>
  )
}

// ── Connecting lines ──────────────────────────────────────────────────────────
function TreeLines({ inView }: { inView: boolean }) {
  const lineData: { x1: number; y1: number; x2: number; y2: number; color: string; delay: number }[] = []

  // Root → branches
  BRANCHES.forEach((b, i) => {
    lineData.push({ x1: ROOT.x, y1: ROOT.y + ROOT.r, x2: b.x, y2: b.y - b.r, color: b.color, delay: 0.1 + i * 0.08 })
  })
  // Branches → skills (upper row)
  SKILLS.forEach((s, i) => {
    const b = BRANCHES[s.branch]
    if (s.y === 335) {
      lineData.push({ x1: b.x, y1: b.y + b.r, x2: s.x, y2: s.y - s.r, color: b.color, delay: 0.5 + i * 0.05 })
    }
    // Upper row → lower row (same branch+column)
    if (s.y === 460) {
      const upper = SKILLS.find(u => u.branch === s.branch && u.y === 335 && u.x === s.x)
      if (upper) {
        lineData.push({ x1: upper.x, y1: upper.y + upper.r, x2: s.x, y2: s.y - s.r, color: b.color, delay: 0.7 + i * 0.04 })
      }
    }
  })

  return (
    <>
      {lineData.map((l, i) => {
        const [pathLen, setPathLen] = useState(0)
        const ref = useRef<SVGLineElement>(null)
        useEffect(() => {
          if (ref.current) {
            const len = Math.hypot(l.x2 - l.x1, l.y2 - l.y1)
            setPathLen(len)
          }
        }, [l.x1, l.y1, l.x2, l.y2])
        return (
          <motion.line key={i} ref={ref}
            x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke={l.color} strokeWidth="1" opacity="0.3"
            strokeDasharray={pathLen}
            initial={{ strokeDashoffset: pathLen, opacity: 0 }}
            animate={inView ? { strokeDashoffset: 0, opacity: 0.3 } : { strokeDashoffset: pathLen, opacity: 0 }}
            transition={{ delay: l.delay * 0.3, duration: 0.5, ease: 'easeOut' }}
          />
        )
      })}
    </>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function Skills() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-80px' })
  const exitYRef = useRef(40)
  const prevInViewRef = useRef<boolean | null>(null)
  if (prevInViewRef.current !== inView) {
    prevInViewRef.current = inView
    if (!inView) exitYRef.current = getScrollDir() === 'down' ? -40 : 40
  }

  return (
    <section id="skills" className="relative" style={{ paddingTop: 'clamp(3.5rem, 6vw, 7rem)', paddingBottom: 'clamp(3.5rem, 6vw, 7rem)' }}>
      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{ backgroundImage: 'linear-gradient(#c9a54e 1px, transparent 1px), linear-gradient(90deg, #c9a54e 1px, transparent 1px)', backgroundSize: '70px 70px' }} />

      <div className="container-arcane" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: exitYRef.current }}
          transition={inView
            ? { type: 'spring', stiffness: 380, damping: 32 }
            : { duration: 0.15, ease: 'easeIn' }}
          className="text-center"
          style={{ marginBottom: 'clamp(3rem, 5vw, 6rem)' }}
        >
          <div className="ornament mx-auto" style={{ marginBottom: '5rem' }}>Actes II</div>
          <h2 className="font-['Cinzel'] font-bold text-gradient-gold h2-glow-gold"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 6rem)', lineHeight: 1.05, marginBottom: '2.5rem' }}>
            L'Arbre de Compétences
          </h2>
          <p className="label-glow-gold font-['Cinzel'] tracking-[0.4em] uppercase" style={{ fontSize: '0.7rem' }}>
            ◈ &nbsp; Arbre de compétences &nbsp; ◈
          </p>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.2 }}
          className="flex items-center justify-center gap-8 mb-10 flex-wrap"
        >
          {BRANCHES.map(b => (
            <div key={b.id} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: b.color, boxShadow: `0 0 8px ${b.color}` }} />
              <span className="font-['Cinzel'] text-[0.65rem] tracking-widest uppercase" style={{ color: b.color + 'cc' }}>
                {b.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Mobile — branches par section */}
        <motion.div
          className="md:hidden"
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
        >
          {BRANCHES.map(branch => {
            const branchSkills = SKILLS.filter(s => s.branch === BRANCHES.indexOf(branch))
            return (
              <div key={branch.id} style={{ borderLeft: `2px solid ${branch.color}44`, paddingLeft: '1.25rem' }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: branch.color, boxShadow: `0 0 8px ${branch.color}` }} />
                  <span className="font-['Cinzel'] tracking-widest uppercase" style={{ fontSize: '0.7rem', color: branch.color }}>
                    {branch.label}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {branchSkills.map(skill => (
                    <span key={skill.label}
                      className="font-['JetBrains_Mono',monospace]"
                      style={{
                        fontSize: '0.72rem', padding: '0.3rem 0.75rem', borderRadius: '4px',
                        background: branch.color + '12', border: `1px solid ${branch.color}33`,
                        color: skill.level >= 70 ? branch.color + 'dd' : branch.color + '66',
                      }}>
                      {skill.label}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </motion.div>

        {/* Desktop — SVG complet */}
        <motion.div
          className="hidden md:block"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        >
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <svg
            viewBox="0 0 1300 600"
            preserveAspectRatio="xMidYMid meet"
            style={{ width: '100%', minWidth: '600px', height: 'auto' }}
          >
            <defs>
              <filter id="skillGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Connecting lines */}
            <TreeLines inView={inView} />

            {/* Root node */}
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <circle cx={ROOT.x} cy={ROOT.y} r={ROOT.r + 8} fill="#c9a54e08" />
              <circle cx={ROOT.x} cy={ROOT.y} r={ROOT.r}
                fill="#12121e" stroke="#c9a54e88" strokeWidth="2"
                filter="url(#skillGlow)" />
              <motion.circle cx={ROOT.x} cy={ROOT.y} r={ROOT.r + 4}
                fill="none" stroke="#c9a54e44" strokeWidth="1"
                animate={{ r: [ROOT.r + 4, ROOT.r + 10, ROOT.r + 4] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <text x={ROOT.x} y={ROOT.y - 5} textAnchor="middle" fill="#e8ddd0" fontSize="9.5" fontFamily="Cinzel" fontWeight="700">
                Développeur
              </text>
              <text x={ROOT.x} y={ROOT.y + 8} textAnchor="middle" fill="#e8ddd0" fontSize="9.5" fontFamily="Cinzel" fontWeight="700">
                Full-Stack
              </text>
            </motion.g>

            {/* Branch nodes */}
            {BRANCHES.map((b, i) => (
              <motion.g key={b.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                transition={{ delay: 0.1 + i * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <circle cx={b.x} cy={b.y} r={b.r + 6} fill={b.color} opacity="0.1" />
                <circle cx={b.x} cy={b.y} r={b.r}
                  fill="#0d0d1a" stroke={b.color} strokeWidth="1.5"
                  filter="url(#skillGlow)" />
                <text x={b.x} y={b.y + 4} textAnchor="middle" fill={b.color} fontSize="9" fontFamily="Cinzel" fontWeight="600">
                  {b.label}
                </text>
              </motion.g>
            ))}

            {/* Skill nodes */}
            {SKILLS.map((s, i) => (
              <SkillNode
                key={s.label}
                node={s}
                color={BRANCHES[s.branch].color}
                inView={inView}
                delay={0.6 + i * 0.04}
              />
            ))}
          </svg>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
