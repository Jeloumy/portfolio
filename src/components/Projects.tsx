import { useRef, useState } from 'react'
import { getScrollDir } from '../hooks/useScrollDirection'
import { motion, AnimatePresence, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ExternalLink, ChevronRight, Info } from 'lucide-react'
import { GithubIcon } from './SocialIcons'
import { PROJECTS } from '../data/projects'
import ProjectModal from './ProjectModal'

// Charge toutes les captures d'écran depuis src/assets/screenshots/
// Convention : nomme le fichier avec le screenshotFile du projet (ex: lsa.png)
const screenshotGlob = import.meta.glob<{ default: string }>(
  '../assets/screenshots/*.{png,jpg,jpeg,webp}',
  { eager: true }
)
const SCREENSHOTS: Record<string, string> = Object.fromEntries(
  Object.entries(screenshotGlob).map(([path, mod]) => [
    path.split('/').pop()!.replace(/\.[^.]+$/, ''),
    mod.default,
  ])
)

// ── Fantasy frame SVG ─────────────────────────────────────────────────────────
// ── Corner ornament SVG (placed outside the card) ────────────────────────────
function FrameCorner({ color, position }: { color: string; position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const transforms: Record<string, string> = {
    tl: 'none', tr: 'scaleX(-1)', bl: 'scaleY(-1)', br: 'scale(-1,-1)',
  }
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none"
      style={{ position: 'absolute', zIndex: 3, transform: transforms[position],
        ...(position === 'tl' ? { top: -3, left: -3 } :
           position === 'tr' ? { top: -3, right: -3 } :
           position === 'bl' ? { bottom: -3, left: -3 } :
                               { bottom: -3, right: -3 }) }}>
      {/* Outer L lines */}
      <line x1="1" y1="36" x2="1" y2="10" stroke={color} strokeWidth="1.5" />
      <line x1="10" y1="1" x2="36" y2="1" stroke={color} strokeWidth="1.5" />
      {/* Corner miter */}
      <line x1="1" y1="10" x2="10" y2="1" stroke={color} strokeWidth="1.5" />
      {/* Inner accent lines */}
      <line x1="5" y1="28" x2="5" y2="14" stroke={color} strokeWidth="0.8" opacity="0.5" />
      <line x1="14" y1="5" x2="28" y2="5" stroke={color} strokeWidth="0.8" opacity="0.5" />
      {/* Center diamond ornament */}
      <path d="M 12 1 L 18 7 L 12 13 L 6 7 Z" stroke={color} strokeWidth="1" opacity="0.7" />
      {/* End dots */}
      <circle cx="1" cy="36" r="2.5" fill={color} />
      <circle cx="36" cy="1" r="2.5" fill={color} />
    </svg>
  )
}

// ── Project painting card ─────────────────────────────────────────────────────
function ProjectCard({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, margin: '-60px' })
  const [hovered, setHovered] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const exitYRef = useRef(60)
  const prevInViewRef = useRef<boolean | null>(null)
  if (prevInViewRef.current !== inView) {
    prevInViewRef.current = inView
    if (!inView) exitYRef.current = getScrollDir() === 'down' ? -50 : 60
  }

  // 3D tilt
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 })
  const rotateX = useTransform(springY, [-0.5, 0.5], [5, -5])
  const rotateY = useTransform(springX, [-0.5, 0.5], [-5, 5])

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  function handleMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
    setHovered(false)
  }

  return (
    <>
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: exitYRef.current }}
      transition={inView
        ? { type: 'spring', stiffness: 380, damping: 32, delay: index * 0.08 }
        : { duration: 0.15, ease: 'easeIn' }}
      className="cursor-none"
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        padding: '20px', display: 'flex', flexDirection: 'column',
        perspective: '1000px',
        rotateX, rotateY,
      }}
    >
      {/* Wrapper flex qui s'étire avec le grid — les coins suivent le bas réel de la card */}
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
      <FrameCorner color={hovered ? project.color : project.color + '66'} position="tl" />
      <FrameCorner color={hovered ? project.color : project.color + '66'} position="tr" />
      <FrameCorner color={hovered ? project.color : project.color + '66'} position="bl" />
      <FrameCorner color={hovered ? project.color : project.color + '66'} position="br" />

      <div
        className="relative rounded-sm overflow-hidden"
        style={{
          flex: 1,
          background: '#0d0d1a',
          transition: 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: hovered ? 'translateY(-4px)' : 'none',
          boxShadow: hovered
            ? `0 0 0 1px ${project.color}bb,
               0 0 0 10px #0a0808,
               0 0 0 12px ${project.color}77,
               0 0 0 22px #0d0a05,
               0 0 0 24px ${project.color}44,
               0 40px 80px #00000099,
               0 0 60px ${project.color}22`
            : `0 0 0 1px ${project.color}44,
               0 0 0 10px #0a0808,
               0 0 0 12px ${project.color}33,
               0 0 0 22px #0d0a05,
               0 0 0 24px ${project.color}18,
               0 20px 50px #00000077`,
        }}
      >

        {/* ── Painting "canvas" area — project thumbnail ── */}
        <div
          className="relative overflow-hidden"
          style={{ height: 'clamp(140px, 18vw, 220px)', margin: '20px 20px 0' }}
        >
          {/* Canvas texture */}
          <div className="absolute inset-0 rounded-sm"
            style={{
              background: `
                linear-gradient(135deg, ${project.color}10 0%, transparent 40%, ${project.color}06 100%),
                repeating-linear-gradient(0deg, transparent, transparent 3px, ${project.color}04 3px, ${project.color}04 4px)
              `,
              border: `1px solid ${project.color}22`,
            }} />
          {/* Year watermark */}
          <div className="absolute bottom-3 right-4 font-['Cinzel'] opacity-20"
            style={{ fontSize: '3rem', color: project.color, lineHeight: 1, fontWeight: 900 }}>
            {project.year}
          </div>
          {/* Featured badge */}
          {project.featured && (
            <div className="absolute top-3 left-3 font-['Cinzel'] tracking-widest uppercase"
              style={{
                padding: '0.35rem 0.8rem', borderRadius: '4px',
                background: project.color + '22', border: `1px solid ${project.color}44`,
                color: project.color, fontSize: '0.6rem',
              }}>
              ✦ Featured
            </div>
          )}
          {/* Capture d'écran ou placeholder */}
          {project.screenshotFile && SCREENSHOTS[project.screenshotFile] ? (
            <img
              src={SCREENSHOTS[project.screenshotFile]}
              alt={`Capture ${project.title}`}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-['Cinzel'] tracking-widest uppercase opacity-20"
                style={{ fontSize: '0.65rem', color: project.color }}>
                Capture à venir
              </span>
            </div>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 transition-opacity duration-300"
            style={{ opacity: hovered ? 1 : 0, background: `${project.color}18` }}>
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center cursor-none"
                style={{ background: '#06060f', border: `1px solid ${project.color}66`, color: project.color }}>
                <GithubIcon size={14} />
              </a>
            )}
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center cursor-none"
                style={{ background: '#06060f', border: `1px solid ${project.color}66`, color: project.color }}>
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>

        {/* ── Card content ── */}
        <div style={{ padding: '1.25rem 1.5rem 1.5rem' }}>
          {/* Top divider with ornament */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${project.color}44, transparent)` }} />
            <span style={{ color: project.color + '66', fontSize: '0.6rem' }}>◆</span>
            <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${project.color}22)` }} />
          </div>

          <h3 className="font-['Cinzel'] font-bold text-[#e8ddd0] mb-1"
            style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)' }}>
            {project.title}
          </h3>
          <p className="mb-3" style={{ fontSize: '0.75rem', color: project.color + 'bb' }}>{project.subtitle}</p>

          <p className="text-[#6b5e4e] leading-relaxed mb-4" style={{ fontSize: '0.8rem' }}>{project.desc}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5" style={{ marginBottom: '1.5rem' }}>
            {project.tags.map(tag => (
              <span key={tag} className="skill-tag" style={{ fontSize: '0.65rem' }}>{tag}</span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between" style={{ paddingTop: '1.25rem', borderTop: '1px solid #1a1a2a' }}>
            <span className="font-['Cinzel'] tracking-widest" style={{ fontSize: '0.6rem', color: '#4a3f32' }}>
              {project.year}
            </span>
            <div className="flex items-center gap-3">
              {project.detail && (
                <button
                  onClick={e => { e.stopPropagation(); setShowModal(true) }}
                  className="flex items-center gap-1.5 cursor-none font-['Cinzel'] tracking-wide transition-all"
                  style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: '4px',
                    background: hovered ? project.color + '22' : project.color + '0e',
                    border: `1px solid ${hovered ? project.color + '77' : project.color + '33'}`,
                    color: hovered ? project.color : project.color + 'aa',
                    fontSize: '0.58rem',
                    letterSpacing: '0.08em',
                  }}
                >
                  <Info size={9} /> Détails
                </button>
              )}
              {project.live ? (
                <a href={project.live} target="_blank" rel="noopener noreferrer" className="cursor-none" style={{ textDecoration: 'none' }}>
                  <motion.div className="flex items-center gap-1 font-['Cinzel']"
                    animate={{ x: hovered ? 4 : 0 }} transition={{ duration: 0.2 }}
                    style={{ fontSize: '0.65rem', color: project.color + 'cc' }}>
                    Voir le site <ChevronRight size={11} />
                  </motion.div>
                </a>
              ) : (
                <motion.div className="flex items-center gap-1 font-['Cinzel']"
                  animate={{ x: hovered ? 4 : 0 }} transition={{ duration: 0.2 }}
                  style={{ fontSize: '0.65rem', color: project.color + '44' }}>
                  En cours <ChevronRight size={11} />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>{/* fin du corner-wrapper */}
    </motion.div>
    <AnimatePresence>
      {showModal && <ProjectModal project={project} onClose={() => setShowModal(false)} />}
    </AnimatePresence>
    </>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function Projects() {
  return (
    <section id="projects" className="relative"
      style={{ paddingTop: 'clamp(3.5rem, 6vw, 7rem)', paddingBottom: 'clamp(3.5rem, 6vw, 7rem)' }}>

      <div className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{ width: 'min(400px, 35vw)', height: 'min(400px, 35vw)', background: 'radial-gradient(circle, #c9a54e 0%, transparent 70%)', filter: 'blur(100px)', opacity: 0.04 }} />

      <div className="container-arcane">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="text-center"
          style={{ marginBottom: 'clamp(3.5rem, 6vw, 7rem)' }}
        >
          <div className="ornament mx-auto" style={{ marginBottom: '5rem' }}>Actes III</div>
          <h2 className="font-['Cinzel'] font-bold text-gradient-gold h2-glow-gold"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 6rem)', lineHeight: 1.05, marginBottom: '2.5rem' }}>
            Les Œuvres
          </h2>
          <p className="label-glow-gold font-['Cinzel'] tracking-[0.4em] uppercase" style={{ fontSize: '0.7rem', marginBottom: '2rem' }}>
            ◈ &nbsp; Projets web · GitHub &nbsp; ◈
          </p>
          <p className="container-prose mx-auto text-center text-[#a89880]"
            style={{ fontSize: 'clamp(0.9rem, 1.1vw, 1rem)', lineHeight: 1.8 }}>
            Chaque projet est un tableau. Voici les toiles que j'ai peintes — à explorer, à déployer.
          </p>
        </motion.div>

        {/* 2×2 grid of framed paintings */}
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 'clamp(1.5rem, 3vw, 3rem)', marginBottom: 'clamp(2rem, 4vw, 4rem)' }}>
          {PROJECTS.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
        </div>

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-3 px-7 py-4 rounded-lg"
            style={{ border: '1px solid #1c1c35', background: '#0d0d1a' }}>
            <GithubIcon size={15} className="text-[#c9a54e]" />
            <span className="text-[#6b5e4e] text-sm">D'autres projets sur</span>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"
              className="font-['Cinzel'] tracking-wide cursor-none hover:text-[#e8c87a] transition-colors"
              style={{ fontSize: '0.75rem', color: '#c9a54e' }}>
              GitHub →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
