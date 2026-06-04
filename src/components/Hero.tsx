import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Mail, User, Code2, FolderOpen, Palette, Phone } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './SocialIcons'
import portraitImg from '../assets/portrait.png'

// ── Décoration magique côté gauche ───────────────────────────────────────────
const LEFT_RUNES = [
  { char: '✦', top: '6%',  left: '1%',  size: '0.85rem', delay: 0,   dur: 4.5 },
  { char: '◈', top: '14%', left: '91%', size: '0.75rem', delay: 1.8, dur: 5.2 },
  { char: '⊕', top: '38%', left: '3%',  size: '0.9rem',  delay: 3.0, dur: 4.8 },
  { char: '◇', top: '62%', left: '88%', size: '0.8rem',  delay: 0.7, dur: 6.0 },
  { char: '✧', top: '80%', left: '5%',  size: '0.7rem',  delay: 2.5, dur: 5.5 },
  { char: '◉', top: '22%', left: '78%', size: '0.65rem', delay: 1.2, dur: 4.2 },
  { char: '✶', top: '50%', left: '94%', size: '0.7rem',  delay: 4.0, dur: 5.8 },
  { char: '◈', top: '90%', left: '72%', size: '0.75rem', delay: 0.4, dur: 4.6 },
  { char: '✦', top: '70%', left: '0%',  size: '0.6rem',  delay: 3.5, dur: 5.0 },
]

// Lignes de constellation côté gauche
const CONST_LEFT_LINES = [
  { x1: '4%', y1: '12%',  x2: '28%', y2: '20%' },
  { x1: '28%', y1: '20%', x2: '48%', y2: '14%' },
  { x1: '6%', y1: '72%',  x2: '22%', y2: '62%' },
  { x1: '22%', y1: '62%', x2: '38%', y2: '68%' },
]
const CONST_LEFT_DOTS: [string, string][] = [
  ['4%','12%'],['28%','20%'],['48%','14%'],
  ['6%','72%'],['22%','62%'],['38%','68%'],['18%','38%'],
]

function LeftMagicDecor() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>

      {/* Constellation SVG */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {CONST_LEFT_LINES.map((l, i) => (
          <motion.line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke="#c9a54e" strokeWidth="0.6"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: 0.25, pathLength: 1 }}
            transition={{ delay: 1 + i * 0.3, duration: 1.5 }}
          />
        ))}
        {CONST_LEFT_DOTS.map(([x, y], i) => (
          <motion.circle key={i} cx={x} cy={y} r="2.5"
            fill="#c9a54e"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.45 }}
            transition={{ delay: 1.5 + i * 0.15, duration: 0.6 }}
          />
        ))}
      </svg>


      {/* Halo pulsant derrière le titre */}
      <motion.div
        animate={{ opacity: [0.04, 0.09, 0.04], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '20%', left: '5%',
          width: '70%', height: '55%',
          background: 'radial-gradient(ellipse, #c9a54e 0%, #7c3aed 50%, transparent 75%)',
          filter: 'blur(50px)',
          borderRadius: '50%',
        }}
      />

      {/* Runes flottantes */}
      {LEFT_RUNES.map((r, i) => (
        <motion.span key={i}
          style={{
            position: 'absolute', top: r.top, left: r.left,
            fontFamily: "'Cinzel', serif", fontSize: r.size,
            color: '#c9a54e', userSelect: 'none', lineHeight: 1,
          }}
          animate={{ opacity: [0.05, 0.22, 0.05], y: [0, -8, 0] }}
          transition={{ duration: r.dur, repeat: Infinity, delay: r.delay, ease: 'easeInOut' }}
        >
          {r.char}
        </motion.span>
      ))}
    </div>
  )
}

const TITLE_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}
const LETTER_VARIANTS = {
  hidden: { opacity: 0, y: 50 },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as any } },
}

function AnimatedName({ text, className = '' }: { text: string; className?: string }) {
  return (
    <motion.span variants={TITLE_VARIANTS} initial="hidden" animate="visible" className={className} style={{ display: 'inline-block' }}>
      {text.split('').map((char, i) => (
        <motion.span key={i} variants={LETTER_VARIANTS} style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : undefined }}>
          {char}
        </motion.span>
      ))}
    </motion.span>
  )
}


function ConstellationPortrait() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none', zIndex: 0,
    }}>
      <div style={{
        position: 'relative',
        width: 'min(560px, 49vw)',
        height: 'min(740px, 65vw)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 85% at 50% 42%, black 20%, transparent 72%)',
        maskImage: 'radial-gradient(ellipse 80% 85% at 50% 42%, black 20%, transparent 72%)',
      }}>
        <img
          src={portraitImg}
          alt=""
          draggable={false}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'top center',
            display: 'block',
            userSelect: 'none',
            opacity: 0.58,
            filter: 'brightness(0.55)',
          }}
        />
        {/* Quadrillage aligné sur le quadrillage global — fond transparent, juste les lignes */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(#c9a54e 1px, transparent 1px), linear-gradient(90deg, #c9a54e 1px, transparent 1px)',
          backgroundSize: '100px 100px',
          backgroundAttachment: 'fixed',
          opacity: 0.3,
          zIndex: 1,
        }} />

      </div>
    </div>
  )
}

function SigilDecoration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      <div className="absolute rounded-full border border-[#c9a54e12] animate-rotate-slow"
        style={{ width: 'min(420px, 38vw)', height: 'min(420px, 38vw)' }} />
      <div className="absolute rounded-full border border-[#7c3aed12] animate-rotate-counter"
        style={{ width: 'min(330px, 30vw)', height: 'min(330px, 30vw)' }} />
      <div className="absolute rounded-full border border-[#c9a54e22]"
        style={{ width: 'min(230px, 21vw)', height: 'min(230px, 21vw)', boxShadow: '0 0 60px #c9a54e08, inset 0 0 60px #c9a54e05' }} />

      {/* Tick marks on outer ring */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <div key={angle} className="absolute rounded-full border border-transparent animate-rotate-slow"
          style={{ width: 'min(420px, 38vw)', height: 'min(420px, 38vw)', transform: `rotate(${angle}deg)` }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: angle % 90 === 0 ? '7px' : '3px', height: angle % 90 === 0 ? '7px' : '3px',
              background: angle % 90 === 0 ? '#c9a54eaa' : '#c9a54e44',
              boxShadow: angle % 90 === 0 ? '0 0 10px #c9a54e' : 'none',
            }} />
        </div>
      ))}

      {/* Core */}
      <div className="relative" style={{ width: 'min(130px, 12vw)', height: 'min(130px, 12vw)' }}>
        <div className="absolute inset-0 rounded-full animate-pulse-glow"
          style={{ background: 'radial-gradient(circle at 35% 35%, #e8c87a33 0%, #c9a54e18 40%, transparent 70%)', boxShadow: '0 0 80px #c9a54e18, 0 0 160px #7c3aed0a' }} />
        <div className="absolute rounded-full" style={{ inset: '16%', background: 'radial-gradient(circle at 40% 40%, #c9a54e22 0%, transparent 60%)', border: '1px solid #c9a54e28' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-['Cinzel_Decorative'] font-black" style={{ fontSize: 'min(3rem, 4.5vw)', color: '#c9a54e', textShadow: '0 0 25px #c9a54e55' }}>J</span>
        </div>
      </div>

      {/* Floating glyphs */}
      {[
        { top: '12%', left: '10%', char: '✦', dur: 3.2 },
        { top: '7%', right: '16%', char: '◈', dur: 4.1 },
        { bottom: '14%', left: '8%', char: '⊕', dur: 3.8 },
        { bottom: '9%', right: '11%', char: '✦', dur: 2.9 },
        { top: '48%', left: '3%', char: '◇', dur: 5 },
        { top: '42%', right: '4%', char: '◇', dur: 4.5 },
      ].map((g, i) => (
        <motion.span key={i} className="absolute font-['Cinzel'] text-[#c9a54e] text-sm"
          style={{ top: g.top, left: g.left, right: g.right, bottom: g.bottom }}
          animate={{ opacity: [0.06, 0.3, 0.06], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: g.dur, repeat: Infinity, delay: i * 0.7 }}>
          {g.char}
        </motion.span>
      ))}

      {/* Particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div key={i} className="absolute rounded-full"
          style={{
            width: i % 3 === 0 ? '5px' : '3px', height: i % 3 === 0 ? '5px' : '3px',
            background: i % 2 === 0 ? '#c9a54e' : '#a78bfa',
            top: `${15 + i * 9}%`, left: `${9 + i * 11}%`,
            boxShadow: `0 0 6px ${i % 2 === 0 ? '#c9a54e' : '#a78bfa'}`,
          }}
          animate={{ y: [-10, 10, -10], x: [-4, 4, -4], opacity: [0.15, 0.6, 0.15] }}
          transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, delay: i * 0.25 }} />
      ))}

      {/* ── Orbiting navigation ── */}
      {(() => {
        const items = [
          { label: 'À propos',      href: '#about',    Icon: User,       color: '#c9a54e' },
          { label: 'Compétences',   href: '#skills',   Icon: Code2,      color: '#a78bfa' },
          { label: 'Projets web',   href: '#projects', Icon: FolderOpen, color: '#34d399' },
          { label: 'Créations',     href: '#creative', Icon: Palette,    color: '#f43f5e' },
          { label: 'Me contacter',  href: '#contact',  Icon: Phone,      color: '#c9a54e' },
        ]
        // Container carré centré (comme les anneaux du sigil) → orbite vraiment circulaire
        const R = 44 // % du carré
        return (
          <div
            className="absolute animate-orbit-nav"
            style={{ width: 'min(600px, 54vw)', height: 'min(600px, 54vw)', pointerEvents: 'none' }}
          >
            {items.map((item, i) => {
              const angleDeg = i * 72 - 90
              const angleRad = angleDeg * Math.PI / 180
              const cx = 50 + R * Math.cos(angleRad)
              const cy = 50 + R * Math.sin(angleRad)
              return (
                <div key={item.href} className="absolute" style={{ left: `${cx}%`, top: `${cy}%`, pointerEvents: 'none' }}>
                  <div style={{ transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
                    <a
                      href={item.href}
                      className="animate-orbit-nav-counter cursor-none"
                      style={{ textDecoration: 'none', pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                      {/* Planet orb */}
                      <div
                        style={{
                          width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0,
                          background: `radial-gradient(circle at 32% 32%, ${item.color}66, ${item.color}22 60%, transparent)`,
                          border: `1.5px solid ${item.color}99`,
                          boxShadow: `0 0 18px ${item.color}66, 0 0 36px ${item.color}2a, 0 0 60px ${item.color}12, inset 0 0 12px ${item.color}22`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.35s',
                        }}
                        onMouseEnter={e => {
                          const el = e.currentTarget as HTMLElement
                          el.style.boxShadow = `0 0 28px ${item.color}cc, 0 0 56px ${item.color}55, 0 0 90px ${item.color}22, inset 0 0 16px ${item.color}44`
                          el.style.borderColor = item.color
                          el.style.transform = 'scale(1.15)'
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget as HTMLElement
                          el.style.boxShadow = `0 0 18px ${item.color}66, 0 0 36px ${item.color}2a, 0 0 60px ${item.color}12, inset 0 0 12px ${item.color}22`
                          el.style.borderColor = `${item.color}99`
                          el.style.transform = 'scale(1)'
                        }}
                      >
                        <item.Icon size={17} style={{ color: item.color, filter: `drop-shadow(0 0 6px ${item.color})` }} />
                      </div>
                      {/* Label */}
                      <span
                        className="font-['Cinzel'] uppercase"
                        style={{
                          fontSize: '0.62rem', letterSpacing: '0.14em', whiteSpace: 'nowrap',
                          color: item.color, fontWeight: 600,
                          textShadow: `0 0 14px ${item.color}99, 0 0 28px ${item.color}44`,
                        }}
                      >
                        {item.label}
                      </span>
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )
      })()}
    </div>
  )
}

export default function Hero() {
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!bgRef.current) return
      bgRef.current.style.transform = `translate(${(e.clientX / window.innerWidth - 0.5) * 24}px, ${(e.clientY / window.innerHeight - 0.5) * 24}px)`
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <section className="relative min-h-screen w-full flex items-center overflow-hidden">
      {/* Atmospheric orbs */}
      <div ref={bgRef} className="absolute inset-0 pointer-events-none transition-transform duration-700 ease-out" style={{ willChange: 'transform' }}>
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)', filter: 'blur(120px)', opacity: 0.07 }} />
        <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, #c9a54e 0%, transparent 70%)', filter: 'blur(120px)', opacity: 0.05 }} />
        <div className="absolute top-2/3 left-1/2 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, #9f1239 0%, transparent 70%)', filter: 'blur(100px)', opacity: 0.04 }} />
      </div>

      {/* Grid texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{ backgroundImage: 'linear-gradient(#c9a54e 1px, transparent 1px), linear-gradient(90deg, #c9a54e 1px, transparent 1px)', backgroundSize: '100px 100px' }} />

      {/* Content — container-arcane (90% width, centered) */}
      <div className="container-arcane relative z-10" style={{ paddingTop: '80px', paddingBottom: '40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'clamp(2rem, 4vw, 6rem)', alignItems: 'center', minHeight: '82vh' }}>

          {/* LEFT — text */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
            <LeftMagicDecor />

            {/* Label — Développeur Full-Stack */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.9 }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2.8rem' }}
            >
              <div style={{ width: '2rem', height: '1px', background: 'linear-gradient(to right, transparent, #c9a54e88)' }} />
              <span style={{
                fontFamily: "'Cinzel', serif", fontSize: '0.72rem',
                letterSpacing: '0.38em', textTransform: 'uppercase',
                color: '#c9a54e', textShadow: '0 0 20px #c9a54e66, 0 0 40px #c9a54e22',
              }}>
                Développeur Full-Stack
              </span>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, #c9a54e55, transparent)' }} />
            </motion.div>

            {/* Nom */}
            <div style={{ marginBottom: '2.2rem' }}>
              <h1 className="font-['Cinzel_Decorative'] font-black" style={{ lineHeight: 1, margin: 0 }}>
                <div style={{ fontSize: 'clamp(2.8rem, 6.5vw, 8.5rem)', marginBottom: '0.05em' }}>
                  <AnimatedName text="Jérémy" className="text-gradient-gold" />
                </div>
                <motion.div
                  initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  style={{ fontSize: 'clamp(3.5rem, 8.5vw, 11rem)', color: '#e8ddd0', lineHeight: 1 }}
                >
                  Duflot
                </motion.div>
              </h1>
            </div>

            {/* Sous-titre école */}
            <motion.p
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.8 }}
              style={{
                fontFamily: "'Cinzel', serif", fontSize: 'clamp(0.65rem, 0.9vw, 0.82rem)',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: '#7a6e5e', marginBottom: '1.25rem',
              }}
            >
              Mastère Dev. Full-Stack &nbsp;·&nbsp; Livecampus · Paris
            </motion.p>

            {/* Tech stack badges */}
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.15, duration: 0.8 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '1.5rem' }}
            >
              {['React', 'Node.js', 'TypeScript', 'Docker', 'SQL'].map((tech, i) => (
                <motion.span key={tech}
                  initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + i * 0.07, duration: 0.5 }}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: '0.63rem',
                    padding: '0.28rem 0.7rem', borderRadius: '4px',
                    background: '#c9a54e0d', border: '1px solid #c9a54e2e',
                    color: '#c9a54e99', letterSpacing: '0.04em',
                  }}
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>

            {/* Tagline — dev en avant, design en retrait */}
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="label-glow-gold font-['Cinzel'] tracking-[0.4em] uppercase"
              style={{ fontSize: '0.65rem', marginBottom: '2.5rem' }}
            >
              ◈ &nbsp; Concevoir · Développer · Déployer &nbsp; ◈
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.7 }}
              style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
              <a href="#projects" className="btn-arcane-solid">Voir mes projets</a>
              <a href="#contact" className="btn-arcane">Me contacter</a>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7, duration: 0.8 }}
              style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              {[
                { icon: GithubIcon, href: 'https://github.com', label: 'GitHub' },
                { icon: LinkedinIcon, href: 'https://www.linkedin.com/in/j%C3%A9r%C3%A9my-duflot', label: 'LinkedIn' },
                { icon: Mail, href: '#contact', label: 'Email' },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                  className="group cursor-none" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#7a6e5e', transition: 'color 0.3s', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#c9a54e')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#7a6e5e')}>
                  <Icon size={15} />
                  <span className="font-['Cinzel'] tracking-widest uppercase" style={{ fontSize: '0.6rem' }}>{label}</span>
                </a>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — sigil + constellation portrait */}
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'min(520px, 50vw)' }}>
            <ConstellationPortrait />
            <SigilDecoration />
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#3a3028]">
        <span className="font-['Cinzel'] tracking-[0.5em] uppercase" style={{ fontSize: '0.5rem' }}>Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ChevronDown size={13} />
        </motion.div>
      </motion.div>
    </section>
  )
}
