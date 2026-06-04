import { useEffect, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { X, Copy, Check, ExternalLink } from 'lucide-react'
import type { Project } from '../data/projects'
import { GithubIcon } from './SocialIcons'

export default function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const d = project.detail
  if (!d) return null

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-8"
      style={{ background: 'rgba(4,4,12,0.96)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-xl max-h-[88vh] overflow-y-auto"
        style={{
          background: '#0b0b18',
          borderRadius: '8px',
          boxShadow: `0 0 0 1px ${project.color}30, 0 40px 100px #000000aa`,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top accent bar */}
        <div style={{ height: '3px', background: `linear-gradient(90deg, ${project.color}, transparent)`, borderRadius: '8px 8px 0 0' }} />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center cursor-none z-10 transition-all"
          style={{ background: '#111122', border: '1px solid #252538', color: '#5a5070' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = project.color + '66'; e.currentTarget.style.color = project.color }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#252538'; e.currentTarget.style.color = '#5a5070' }}
        >
          <X size={15} />
        </button>

        <div style={{ padding: '2.5rem 2.75rem' }}>

          {/* ── Header ── */}
          <div style={{ marginBottom: '2rem', paddingRight: '3rem' }}>
            <span className="inline-block font-['Cinzel'] tracking-widest uppercase"
              style={{ fontSize: '0.55rem', color: project.color, background: project.color + '18', border: `1px solid ${project.color}30`, padding: '0.25rem 0.7rem', borderRadius: '3px', marginBottom: '1rem', display: 'inline-block' }}>
              Détails du projet
            </span>
            <h2 className="font-['Cinzel'] font-bold" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', color: '#f0e8dc', lineHeight: 1.15, marginBottom: '0.5rem' }}>
              {project.title}
            </h2>
            <p style={{ fontSize: '0.82rem', color: project.color + 'cc' }}>{project.subtitle}</p>
          </div>

          {/* ── Separator ── */}
          <div style={{ height: '1px', background: 'linear-gradient(90deg, #1c1c2e, transparent)', marginBottom: '2rem' }} />

          {/* ── Description ── */}
          <p style={{ fontSize: '0.88rem', color: '#7a6a5a', lineHeight: 1.85, marginBottom: '2.5rem' }}>
            {project.desc}
          </p>

          {/* ── Points clés ── */}
          {d.highlights.length > 0 && (
            <Section>
              <SectionLabel color={project.color}>Points clés</SectionLabel>
              <div style={{ marginTop: '1.25rem' }}>
                {d.highlights.map((h, i) => (
                  <div key={i} className="flex items-start"
                    style={{
                      gap: '1rem',
                      padding: '0.875rem 0',
                      borderBottom: i < d.highlights.length - 1 ? '1px solid #13131f' : 'none',
                    }}>
                    <span className="shrink-0 rounded-full" style={{ width: '7px', height: '7px', background: project.color, opacity: 0.85, marginTop: '0.45rem' }} />
                    <span style={{ fontSize: '0.84rem', color: '#908070', lineHeight: 1.6 }}>{h}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* ── Stack technique ── */}
          {d.stackTable && d.stackTable.length > 0 && (
            <Section>
              <SectionLabel color={project.color}>Stack technique</SectionLabel>
              <div style={{ marginTop: '1.25rem', borderRadius: '6px', overflow: 'hidden', border: '1px solid #1e1e30' }}>
                {d.stackTable.map((row, i) => (
                  <div key={i} className="flex items-center"
                    style={{
                      padding: '0.875rem 1.25rem',
                      gap: '1.5rem',
                      background: i % 2 === 0 ? '#0e0e1c' : '#0b0b18',
                      borderBottom: i < d.stackTable!.length - 1 ? '1px solid #181828' : 'none',
                    }}>
                    <span className="font-['Cinzel'] shrink-0 uppercase"
                      style={{ width: '7.5rem', fontSize: '0.6rem', letterSpacing: '0.12em', color: project.color + 'bb' }}>
                      {row.layer}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#706050', lineHeight: 1.4 }}>{row.tech}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* ── Identifiants ── */}
          {d.credentials && (
            <Section>
              <SectionLabel color={project.color}>Identifiants de test</SectionLabel>
              {d.credentials.note && (
                <div className="flex items-center gap-3"
                  style={{ marginTop: '1rem', padding: '0.875rem 1.25rem', borderRadius: '6px', background: '#18120a', border: '1px solid #3a2510', fontSize: '0.75rem', color: '#907040' }}>
                  <span style={{ flexShrink: 0 }}>⚠</span>
                  <span>{d.credentials.note}</span>
                </div>
              )}
              <div style={{ marginTop: '1rem', borderRadius: '6px', overflow: 'hidden', border: '1px solid #1e1e30' }}>
                <CredRow label="Login" value={d.credentials.login} color={project.color} />
                <CredRow label="Mot de passe" value={d.credentials.password} color={project.color} last />
              </div>
            </Section>
          )}

          {/* ── Liens ── */}
          <div className="flex items-center gap-3 flex-wrap"
            style={{ paddingTop: '2rem', borderTop: '1px solid #1c1c2e' }}>
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 cursor-none font-['Cinzel'] tracking-wide transition-opacity hover:opacity-80"
                style={{ padding: '0.6rem 1.1rem', borderRadius: '5px', background: project.color + '1a', border: `1px solid ${project.color}44`, color: project.color, fontSize: '0.68rem' }}>
                <ExternalLink size={12} /> Voir la démo
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 cursor-none font-['Cinzel'] tracking-wide transition-opacity hover:opacity-80"
                style={{ padding: '0.6rem 1.1rem', borderRadius: '5px', background: '#141420', border: '1px solid #252535', color: '#706050', fontSize: '0.68rem' }}>
                <GithubIcon size={12} /> Code source
              </a>
            )}
          </div>

        </div>
      </motion.div>
    </div>
  )
}

function Section({ children }: { children: ReactNode }) {
  return (
    <div style={{ marginBottom: '2.75rem' }}>
      {children}
    </div>
  )
}

function SectionLabel({ color, children }: { color: string; children: ReactNode }) {
  return (
    <div className="flex items-center" style={{ gap: '0.75rem' }}>
      <div style={{ width: '3px', height: '16px', background: color, borderRadius: '2px', flexShrink: 0 }} />
      <h3 className="font-['Cinzel'] uppercase tracking-widest" style={{ fontSize: '0.7rem', color: '#ddd0b8', letterSpacing: '0.2em' }}>
        {children}
      </h3>
    </div>
  )
}

function CredRow({ label, value, color, last }: { label: string; value: string; color: string; last?: boolean }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className="flex items-center"
      style={{
        padding: '0.875rem 1.25rem',
        gap: '1.5rem',
        background: last ? '#0e0e1c' : '#0b0b18',
        borderBottom: last ? 'none' : '1px solid #181828',
      }}>
      <span className="font-['Cinzel'] uppercase shrink-0"
        style={{ width: '7.5rem', fontSize: '0.6rem', letterSpacing: '0.12em', color: color + 'bb' }}>
        {label}
      </span>
      <span style={{ flex: 1, fontSize: '0.87rem', color: '#c8a870', fontFamily: 'monospace' }}>
        {value}
      </span>
      <button onClick={copy} className="cursor-none w-8 h-8 rounded flex items-center justify-center transition-all shrink-0"
        style={{ background: copied ? color + '22' : '#111122', border: `1px solid ${copied ? color + '44' : '#252538'}`, color: copied ? color : '#5a5070' }}>
        {copied ? <Check size={12} /> : <Copy size={12} />}
      </button>
    </div>
  )
}
