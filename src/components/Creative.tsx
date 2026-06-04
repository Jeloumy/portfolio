import { useRef, useState, useEffect } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import { getScrollDir } from '../hooks/useScrollDirection'
import { Play, type LucideIcon } from 'lucide-react'
import {
  TAB_CONFIG,
  LOGO_META,
  DESIGN_META,
  FALLBACK_LOGOS,
  FALLBACK_DESIGNS,
  VIDEOS,
  type CreativeTab,
  type CreativeItem,
} from '../data/creative'

// ── Dynamic asset loading ─────────────────────────────────────────────────────
// Dépose tes PNG dans src/assets/logos/ ou src/assets/designs/ à la racine
// et ils apparaissent automatiquement. Les sous-dossiers sont ignorés.

const logoGlob = import.meta.glob<{ default: string }>(
  '../assets/logos/*.{png,jpg,jpeg,svg,webp,gif}',
  { eager: true }
)
const designGlob = import.meta.glob<{ default: string }>(
  '../assets/designs/*.{png,jpg,jpeg,svg,webp,gif}',
  { eager: true }
)

function formatFileName(path: string): string {
  return path
    .split('/').pop()!
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

function globToItems(
  glob: Record<string, { default: string }>,
  fallback: CreativeItem[],
  meta: Record<string, Partial<CreativeItem>>,
): CreativeItem[] {
  const entries = Object.entries(glob)
  if (entries.length === 0) return fallback
  return entries.map(([path, mod]) => {
    const key = path.split('/').pop()!.replace(/\.[^.]+$/, '').toLowerCase()
    const override = meta[key] ?? {}
    return {
      title:        override.title        ?? formatFileName(path),
      desc:         override.desc         ?? '',
      tags:         override.tags         ?? [],
      badge:        override.badge        ?? '',
      thumbnailBg:  override.thumbnailBg,
      image:        mod.default,
    }
  })
}

// Variante pour les designs : regroupe automatiquement les paires -recto/-verso
// en un seul CreativeItem avec image (recto) + imageBack (verso).
function globToDesignItems(
  glob: Record<string, { default: string }>,
  fallback: CreativeItem[],
  meta: Record<string, Partial<CreativeItem>>,
): CreativeItem[] {
  const entries = Object.entries(glob)
  if (entries.length === 0) return fallback

  const rectos = new Map<string, string>()
  const versos = new Map<string, string>()
  const singles: Array<{ key: string; url: string }> = []

  for (const [path, mod] of entries) {
    const filename = path.split('/').pop()!.replace(/\.[^.]+$/, '').toLowerCase()
    if (filename.endsWith('-recto')) {
      rectos.set(filename.slice(0, -6), mod.default)
    } else if (filename.endsWith('-verso')) {
      versos.set(filename.slice(0, -6), mod.default)
    } else {
      singles.push({ key: filename, url: mod.default })
    }
  }

  const items: CreativeItem[] = []

  // Paires recto/verso
  for (const [base, frontUrl] of rectos) {
    const override = meta[base] ?? {}
    items.push({
      title:       override.title       ?? formatFileName(base),
      desc:        override.desc        ?? '',
      tags:        override.tags        ?? [],
      badge:       override.badge       ?? 'Recto / Verso',
      thumbnailBg: override.thumbnailBg,
      image:       frontUrl,
      imageBack:   versos.get(base),
    })
  }

  // Versos orphelins (sans recto correspondant)
  for (const [base, backUrl] of versos) {
    if (!rectos.has(base)) {
      const key = base + '-verso'
      const override = meta[key] ?? {}
      items.push({
        title:       override.title       ?? formatFileName(base),
        desc:        override.desc        ?? '',
        tags:        override.tags        ?? [],
        badge:       override.badge       ?? '',
        thumbnailBg: override.thumbnailBg,
        image:       backUrl,
      })
    }
  }

  // Fichiers simples
  for (const { key, url } of singles) {
    const override = meta[key] ?? {}
    items.push({
      title:       override.title       ?? formatFileName(key),
      desc:        override.desc        ?? '',
      tags:        override.tags        ?? [],
      badge:       override.badge       ?? '',
      thumbnailBg: override.thumbnailBg,
      image:       url,
    })
  }

  return items
}

const LOGO_ITEMS   = globToItems(logoGlob,         FALLBACK_LOGOS,   LOGO_META)
const DESIGN_ITEMS = globToDesignItems(designGlob, FALLBACK_DESIGNS, DESIGN_META)

const ITEMS: Record<CreativeTab, CreativeItem[]> = {
  logos:   LOGO_ITEMS,
  videos:  VIDEOS,
  designs: DESIGN_ITEMS,
}

// ── Animation variants ────────────────────────────────────────────────────────

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
  }),
}

// ── CreativeCard ──────────────────────────────────────────────────────────────

interface CreativeCardProps {
  item: CreativeItem
  color: string
  CenterIcon: LucideIcon
  isVideo: boolean
  delay: number
  inView: boolean
  exitY: number
}

function CreativeCard({ item, color, CenterIcon, isVideo, delay, inView, exitY }: CreativeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: exitY }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: exitY }}
      transition={inView ? { type: 'spring', stiffness: 380, damping: 32, delay } : { duration: 0.15, ease: 'easeIn' }}
      className="group cursor-none rounded-xl overflow-hidden"
      style={{ background: '#0d0d1a', border: '1px solid #1a1a2e', transition: 'all 0.35s ease' }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = color + '33'
        el.style.transform = 'translateY(-5px)'
        el.style.boxShadow = `0 20px 50px #00000055, 0 0 30px ${color}18`
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = '#1a1a2e'
        el.style.transform = 'none'
        el.style.boxShadow = 'none'
      }}
    >
      {/* ── Thumbnail ── */}
      <div
        className="relative overflow-hidden"
        style={{
          height: 'clamp(150px, 16vw, 200px)',
          background: item.thumbnailBg ?? `linear-gradient(145deg, ${color}0a, #080810)`,
        }}
      >
        {item.youtube ? (
          // ── Vidéo YouTube : thumbnail + bouton play ───────────────────────
          <a
            href={`https://www.youtube.com/watch?v=${item.youtube}`}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 block group/yt"
          >
            <img
              src={`https://img.youtube.com/vi/${item.youtube}/maxresdefault.jpg`}
              alt={item.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
            {/* Overlay sombre au survol */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/yt:opacity-100 transition-opacity duration-300" />
            {/* Bouton play */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/yt:opacity-100 transition-opacity duration-300">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-200 group-hover/yt:scale-110"
                style={{ background: '#ff0000dd', boxShadow: '0 0 30px #ff000055' }}
              >
                <Play size={22} className="text-white" style={{ marginLeft: '3px' }} />
              </div>
            </div>
          </a>
        ) : item.image && item.imageBack ? (
          // ── Recto / Verso : côte à côte, fond de chaque demi-card ─────────
          <div className="absolute inset-0 flex gap-0">
            <div className="flex-1 overflow-hidden flex items-center justify-center relative"
              style={{ background: item.thumbnailBg ?? `linear-gradient(145deg, ${color}0a, #080810)` }}>
              <img src={item.image} alt={`${item.title} — Recto`}
                loading="lazy" decoding="async" className="w-full h-full object-contain" />
              <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 font-['Cinzel'] tracking-widest uppercase"
                style={{ fontSize: '0.42rem', color: '#ffffff66', letterSpacing: '0.2em' }}>Recto</span>
            </div>
            <div className="w-px" style={{ background: `${color}22` }} />
            <div className="flex-1 overflow-hidden flex items-center justify-center relative"
              style={{ background: item.thumbnailBg ?? `linear-gradient(145deg, ${color}0a, #080810)` }}>
              <img src={item.imageBack} alt={`${item.title} — Verso`}
                loading="lazy" decoding="async" className="w-full h-full object-contain" />
              <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 font-['Cinzel'] tracking-widest uppercase"
                style={{ fontSize: '0.42rem', color: '#ffffff66', letterSpacing: '0.2em' }}>Verso</span>
            </div>
          </div>
        ) : item.image ? (
          // ── Image simple : fond coloré + logo en object-contain ───────────
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-contain"
            style={{ padding: '10%' }}
          />
        ) : (
          <>
            {/* Dot grid texture */}
            <div
              className="absolute inset-0 opacity-20"
              style={{ backgroundImage: `radial-gradient(${color}18 1px, transparent 1px)`, backgroundSize: '22px 22px' }}
            />
            {/* Badge */}
            {item.badge && (
              <div
                className="absolute top-4 right-4 font-['JetBrains_Mono'] px-2.5 py-1 rounded-full"
                style={{ fontSize: '0.63rem', color: color + 'dd', background: color + '14', border: `1px solid ${color}33` }}
              >
                {item.badge}
              </div>
            )}
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{ background: color + '14', border: `1.5px solid ${color}55`, boxShadow: `0 0 0 8px ${color}08` }}
              >
                {isVideo
                  ? <CenterIcon size={22} style={{ color, marginLeft: '2px' }} />
                  : <CenterIcon size={20} style={{ color }} />
                }
              </div>
            </div>
          </>
        )}

        {/* Hover overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ background: `linear-gradient(145deg, ${color}10, transparent)` }}
        />
      </div>

      {/* ── Content ── */}
      <div style={{ padding: 'clamp(1.1rem, 1.8vw, 1.5rem)' }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${color}33, transparent)` }} />
          <span style={{ color: color + '44', fontSize: '0.55rem' }}>◆</span>
        </div>

        <h3
          className="font-['Cinzel'] font-semibold text-[#e8ddd0] mb-2.5"
          style={{ fontSize: 'clamp(0.82rem, 1.05vw, 0.98rem)' }}
        >
          {item.title}
        </h3>

        {item.desc && (
          <p className="leading-relaxed mb-4" style={{ fontSize: '0.78rem', color: '#5a5065' }}>
            {item.desc}
          </p>
        )}

        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map(tag => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full font-['JetBrains_Mono']"
                style={{ fontSize: '0.63rem', background: color + '0e', border: `1px solid ${color}22`, color: color + 'aa' }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Creative() {
  const [activeTab, setActiveTab] = useState<CreativeTab>('logos')
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-80px' })
  const exitYRef = useRef(30)
  const prevInViewRef = useRef<boolean | null>(null)
  if (prevInViewRef.current !== inView) {
    prevInViewRef.current = inView
    if (!inView) exitYRef.current = getScrollDir() === 'down' ? -30 : 30
  }

  const currentConfig = TAB_CONFIG.find(t => t.id === activeTab)!
  const items = ITEMS[activeTab]

  return (
    <section
      id="creative"
      className="relative bg-[#080812]"
      style={{ paddingTop: 'clamp(3.5rem, 6vw, 7rem)', paddingBottom: 'clamp(3.5rem, 6vw, 7rem)' }}
    >
      {/* Background glow */}
      <div
        className="absolute right-0 top-1/3 pointer-events-none rounded-full"
        style={{ width: 'min(400px, 35vw)', height: 'min(600px, 50vw)', background: 'radial-gradient(circle, #a78bfa 0%, transparent 70%)', filter: 'blur(100px)', opacity: 0.04 }}
      />

      <div className="container-arcane">
        {/* ── Section header ── */}
        <motion.div
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: exitYRef.current }}
          transition={inView ? { type: 'spring', stiffness: 380, damping: 32 } : { duration: 0.15, ease: 'easeIn' }}
          className="text-center"
          style={{ marginBottom: 'clamp(3rem, 5vw, 6rem)' }}
        >
          <div className="ornament mx-auto" style={{ marginBottom: '5rem' }}>Actes IV</div>
          <h2
            className="font-['Cinzel'] font-bold text-gradient-violet h2-glow-violet"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 6rem)', lineHeight: 1.05, marginBottom: '2.5rem' }}
          >
            L'Atelier
          </h2>
          <p className="label-glow-gold font-['Cinzel'] tracking-[0.4em] uppercase" style={{ fontSize: '0.7rem' }}>
            ◈ &nbsp; Design · Vidéo · Création &nbsp; ◈
          </p>
        </motion.div>

        {/* ── Tabs ── */}
        <motion.div
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: exitYRef.current }}
          transition={inView ? { type: 'spring', stiffness: 380, damping: 32, delay: 0.06 } : { duration: 0.15, ease: 'easeIn' }}
          className="flex justify-center gap-3 flex-wrap"
          style={{ marginBottom: 'clamp(2.5rem, 4vw, 4rem)' }}
        >
          {TAB_CONFIG.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2.5 rounded-lg font-['Cinzel'] tracking-wider transition-all duration-300 cursor-none border"
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.72rem',
                  letterSpacing: '0.12em',
                  ...(isActive
                    ? { background: tab.color + '1a', borderColor: tab.color + '77', color: tab.color, textShadow: `0 0 12px ${tab.color}55`, boxShadow: `0 0 20px ${tab.color}18` }
                    : { background: 'transparent', borderColor: '#1e1e35', color: '#6b5e4e' })
                }}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            )
          })}
        </motion.div>

        {/* ── Grid ── */}
        <motion.div
          key={activeTab}
          ref={ref}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${currentConfig.columns}, 1fr)`,
            gap: 'clamp(1rem, 2vw, 1.75rem)',
          }}
        >
          {items.map((item, i) => (
            <CreativeCard
              key={item.image ?? item.title}
              item={item}
              color={currentConfig.color}
              CenterIcon={currentConfig.centerIcon}
              isVideo={activeTab === 'videos'}
              delay={i * 0.08}
              inView={inView}
              exitY={exitYRef.current}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
