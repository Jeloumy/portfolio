import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '#about', label: 'Actes I' },
  { href: '#skills', label: 'Actes II' },
  { href: '#projects', label: 'Actes III' },
  { href: '#creative', label: 'Actes IV' },
  { href: '#contact', label: 'Épilogue' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setActive('#' + e.target.id)
        })
      },
      { threshold: 0, rootMargin: '-40% 0px -40% 0px' }
    )
    document.querySelectorAll('section[id]').forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-[#06060f]/90 backdrop-blur-md' : ''
        }`}
        style={{ position: 'fixed' }}
      >
        {/* Bordure basse statique */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: scrolled ? '#1c1c35' : 'transparent', transition: 'background 0.5s' }} />
        {/* Barre de progression — par-dessus la bordure */}
        <motion.div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '2px', transformOrigin: 'left', scaleX,
          background: 'linear-gradient(90deg, #a78bfa, #c9a54e, #f43f5e)',
          boxShadow: '0 0 6px #c9a54e66',
        }} />
        <div className="container-arcane flex items-center justify-between" style={{ paddingTop: '0.875rem', paddingBottom: '0.875rem' }}>
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group cursor-none">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 border border-[#c9a54e66] rotate-45 group-hover:border-[#c9a54e] transition-colors duration-300" />
              <div className="absolute inset-1 border border-[#c9a54e33] rotate-12 group-hover:border-[#c9a54e66] transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[#c9a54e] font-['Cinzel'] text-xs font-bold">J</span>
              </div>
            </div>
            <span className="font-['Cinzel'] text-xs tracking-[0.3em] text-[#a89880] group-hover:text-[#c9a54e] transition-colors duration-300 uppercase">
              Jérémy Duflot
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(link => (
              <a
                key={link.href}
                href={link.href}
                className={`nav-link ${active === link.href ? 'active' : ''}`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <a href="#contact" className="btn-arcane text-xs py-2 px-4">
              Me Contacter
            </a>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
            className="md:hidden text-[#c9a54e] cursor-none"
            onClick={() => setMenuOpen(v => !v)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-40 bg-[#06060f]/98 backdrop-blur-md border-b border-[#1c1c35] md:hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {links.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="nav-link text-base"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a href="#contact" className="btn-arcane justify-center mt-2">
                Me Contacter
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
