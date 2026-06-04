import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { getScrollDir } from '../hooks/useScrollDirection'
import { Mail, Send, MapPin, CheckCircle2, ArrowRight } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './SocialIcons'

const CONTACT_LINKS = [
  { icon: Mail, label: 'jeremy.duflot1@gmail.com', href: 'mailto:jeremy.duflot1@gmail.com', color: '#c9a54e' },
  { icon: GithubIcon, label: 'github.com/jeremy-duflot', href: 'https://github.com', color: '#a78bfa' },
  { icon: LinkedinIcon, label: 'linkedin.com/in/jérémy-duflot', href: 'https://www.linkedin.com/in/j%C3%A9r%C3%A9my-duflot', color: '#34d399' },
  { icon: MapPin, label: 'Persan, Île-de-France', href: '#', color: '#f43f5e' },
]

// ── Modern underline input ────────────────────────────────────────────────────
const MAX_LENGTHS = { name: 100, email: 254, message: 2000 } as const

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function ArcaneInput({
  label, name, type = 'text', value, onChange, placeholder, multiline = false, color = '#c9a54e', maxLength,
}: {
  label: string; name: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder: string; multiline?: boolean; color?: string; maxLength?: number
}) {
  const [focused, setFocused] = useState(false)
  const Tag = multiline ? 'textarea' : 'input'
  return (
    <div className="relative" style={{ paddingTop: '1.25rem' }}>
      <label className="absolute top-0 left-0 font-['Cinzel'] tracking-[0.25em] uppercase transition-all duration-200"
        style={{ fontSize: '0.6rem', color: focused ? color : '#4a3f32' }}>
        {label}
      </label>
      <Tag
        name={name}
        type={type}
        value={value}
        placeholder={focused ? '' : placeholder}
        rows={multiline ? 5 : undefined}
        maxLength={maxLength}
        autoComplete={type === 'email' ? 'email' : name === 'name' ? 'name' : 'off'}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={e => onChange((e.target as HTMLInputElement | HTMLTextAreaElement).value)}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          borderBottom: `1px solid ${focused ? color + 'cc' : '#2a2a44'}`,
          borderRadius: 0,
          paddingTop: '0.6rem',
          paddingBottom: '0.6rem',
          paddingLeft: 0,
          paddingRight: 0,
          color: '#e8ddd0',
          fontSize: '0.9rem',
          fontFamily: "'Inter', sans-serif",
          resize: multiline ? 'none' : undefined,
          outline: 'none',
          caretColor: color,
          transition: 'border-color 0.2s',
        }}
      />
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0, height: '1px',
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        opacity: focused ? 0.6 : 0,
        transition: 'opacity 0.3s',
        pointerEvents: 'none',
      }} />
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-80px' })
  const exitYRef = useRef(40)
  const prevInViewRef = useRef<boolean | null>(null)
  if (prevInViewRef.current !== inView) {
    prevInViewRef.current = inView
    if (!inView) exitYRef.current = getScrollDir() === 'down' ? -40 : 40
  }

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault()
    const { name, email, message } = form
    if (!name.trim() || !email.trim() || !message.trim()) return
    if (!isValidEmail(email)) return
    const subject = `Portfolio — ${encodeURIComponent(name.trim().slice(0, MAX_LENGTHS.name))}`
    const body = encodeURIComponent(`${message.trim().slice(0, MAX_LENGTHS.message)}\n\nDe: ${email.trim()}`)
    window.location.href = `mailto:jeremy.duflot1@gmail.com?subject=${subject}&body=${body}`
    setSent(true)
    setTimeout(() => setSent(false), 5000)
  }

  const set = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <section id="contact" className="relative" style={{ paddingTop: 'clamp(3.5rem, 6vw, 7rem)', paddingBottom: 'clamp(3.5rem, 6vw, 7rem)' }}>

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
          style={{ width: 'min(700px, 60vw)', height: 'min(300px, 25vw)', background: 'radial-gradient(ellipse, #c9a54e 0%, transparent 70%)', filter: 'blur(120px)', opacity: 0.04 }} />
      </div>

      <div className="container-arcane relative" ref={ref}>

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: exitYRef.current }}
          transition={inView
            ? { type: 'spring', stiffness: 380, damping: 32 }
            : { duration: 0.15, ease: 'easeIn' }}
          className="text-center"
          style={{ marginBottom: 'clamp(3rem, 5vw, 5rem)' }}
        >
          <div className="ornament mx-auto" style={{ marginBottom: '5rem' }}>Épilogue</div>
          <h2 className="font-['Cinzel'] font-bold text-gradient-gold h2-glow-gold"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 6rem)', lineHeight: 1.05, marginBottom: '2.5rem' }}>
            Écrire l'Auteur
          </h2>
          <p className="label-glow-gold font-['Cinzel'] tracking-[0.4em] uppercase mb-5" style={{ fontSize: '0.7rem' }}>
            ◈ &nbsp; Une alternance · un projet · une idée &nbsp; ◈
          </p>
          <p className="container-prose mx-auto text-center text-[#8a7a6a]"
            style={{ fontSize: 'clamp(0.9rem, 1.1vw, 1rem)', lineHeight: 1.8 }}>
            Disponible pour une alternance de 2ème année. Construisons quelque chose ensemble.
          </p>
        </motion.div>

        {/* ── Main content grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'clamp(2.5rem, 5vw, 6rem)', alignItems: 'start' }}>

          {/* ── Left panel ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={inView ? { type: 'spring', stiffness: 380, damping: 32, delay: 0.06 } : { duration: 0.15, ease: 'easeIn' }}
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
          >
            {/* Availability badge */}
            <div className="rounded-xl p-5"
              style={{ background: '#0d0d1a', border: '1px solid #1a1a2e' }}>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse-glow" />
                <span className="font-['Cinzel'] tracking-[0.25em] uppercase text-[#34d399]" style={{ fontSize: '0.65rem' }}>
                  Disponible
                </span>
              </div>
              <p className="text-[#5a5065]" style={{ fontSize: '0.82rem', lineHeight: 1.7 }}>
                Alternance full-stack — 2ème année de Mastère à partir de{' '}
                <span className="text-[#c9a54e]">septembre 2025</span>.
              </p>
            </div>

            {/* Contact links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {CONTACT_LINKS.map(({ icon: Icon, label, href, color }) => (
                <a key={label} href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-lg cursor-none"
                  style={{
                    padding: '0.75rem 1rem',
                    background: 'transparent',
                    border: '1px solid transparent',
                    transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = color + '0a'
                    el.style.borderColor = color + '22'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'transparent'
                    el.style.borderColor = 'transparent'
                  }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                    style={{ background: color + '14', border: `1px solid ${color}22` }}>
                    <Icon size={14} style={{ color }} />
                  </div>
                  <span className="font-['JetBrains_Mono'] truncate" style={{ fontSize: '0.72rem', color: '#6b5e4e', transition: 'color 0.2s' }}
                    onMouseEnter={e => ((e.target as HTMLElement).style.color = color)}
                    onMouseLeave={e => ((e.target as HTMLElement).style.color = '#6b5e4e')}>
                    {label}
                  </span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* ── Right: Form ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={inView ? { type: 'spring', stiffness: 380, damping: 32, delay: 0.1 } : { duration: 0.15, ease: 'easeIn' }}
          >
            <form onSubmit={handleSubmit}>
              {/* Name + Email row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                <ArcaneInput label="Nom" name="name" value={form.name} onChange={set('name')} placeholder="Votre nom" maxLength={MAX_LENGTHS.name} />
                <ArcaneInput label="Email" name="email" type="email" value={form.email} onChange={set('email')} placeholder="votre@email.com" color="#a78bfa" maxLength={MAX_LENGTHS.email} />
              </div>

              {/* Message */}
              <div style={{ marginBottom: '2.5rem' }}>
                <ArcaneInput label="Message" name="message" value={form.message} onChange={set('message')}
                  placeholder="Votre projet, alternance, proposition..." multiline color="#c9a54e" maxLength={MAX_LENGTHS.message} />
              </div>

              {/* Submit */}
              <button type="submit" className="cursor-none w-full group"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                  padding: '1rem 2rem',
                  background: sent ? 'linear-gradient(135deg, #34d399, #059669)' : 'linear-gradient(135deg, #c9a54e, #8a6f32)',
                  border: 'none', borderRadius: '8px',
                  color: '#06060f',
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.8rem', fontWeight: 700,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  cursor: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 20px #c9a54e33',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 8px 40px #c9a54e55, 0 0 0 1px #c9a54e44')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px #c9a54e33')}
              >
                {sent ? (
                  <><CheckCircle2 size={16} /> Message envoyé !</>
                ) : (
                  <>
                    <Send size={15} />
                    Envoyer le message
                    <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                      <ArrowRight size={14} />
                    </motion.div>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        {/* ── Footer ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={inView ? { type: 'spring', stiffness: 380, damping: 32, delay: 0.15 } : { duration: 0.12, ease: 'easeIn' }}
          style={{ marginTop: 'clamp(3rem, 5vw, 5rem)', paddingTop: '1.5rem', borderTop: '1px solid #14142a' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <span className="font-['Cinzel'] tracking-[0.3em] text-[#2a2435] uppercase" style={{ fontSize: '0.6rem' }}>
              © 2025 Jérémy Duflot
            </span>
            <div className="ornament" style={{ maxWidth: '200px', flex: 1 }}>Forgé avec passion</div>
            <span className="font-['JetBrains_Mono'] text-[#2a2435]" style={{ fontSize: '0.6rem' }}>
              React · Vite · Tailwind
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
