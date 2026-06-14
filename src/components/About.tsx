import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Code2, Palette, Video, BookOpen } from 'lucide-react'

const TRAITS = [
  {
    icon: Code2,
    title: 'Développeur Full-Stack',
    desc: "De la maquette à la mise en production — React, Node.js, TypeScript. Une approche méthodique avec un œil sur l'expérience utilisateur.",
    color: '#c9a54e',
  },
  {
    icon: Palette,
    title: 'Designer Polyvalent',
    desc: "Logos, chartes graphiques, flyers — j'ai travaillé l'identité visuelle d'entreprises de A à Z avec Illustrator et Figma.",
    color: '#a78bfa',
  },
  {
    icon: Video,
    title: 'Créateur de Contenu',
    desc: 'Je monte des vidéos — parfois en écrivant les scénarios moi-même. Du début à la fin sous Premiere Pro et After Effects.',
    color: '#f43f5e',
  },
  {
    icon: BookOpen,
    title: 'Curieux du Monde',
    desc: "Jeux vidéo, fantasy, voyages, musique — autant de façons de garder la curiosité en éveil. Et c'est cette même curiosité que j'essaie d'apporter dans le code.",
    color: '#34d399',
  },
]

function FloatingRune({ char, style, delay }: { char: string; style: React.CSSProperties; delay: number }) {
  return (
    <motion.span
      className="absolute font-['Cinzel'] text-[#c9a54e] pointer-events-none select-none"
      style={{ fontSize: '0.9rem', ...style }}
      animate={{ opacity: [0.04, 0.18, 0.04], y: [0, -8, 0] }}
      transition={{ duration: 5, repeat: Infinity, delay }}
    >
      {char}
    </motion.span>
  )
}

export default function About() {
  const cardsRef = useRef(null)
  const cardsInView = useInView(cardsRef, { once: true, margin: '-80px' })

  return (
    <section id="about" className="relative overflow-hidden" style={{ paddingTop: 'clamp(3.5rem, 6vw, 7rem)', paddingBottom: 'clamp(3.5rem, 6vw, 7rem)' }}>

      {/* ── Atmospheric background ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 rounded-full"
          style={{ width: 'min(600px, 50vw)', height: 'min(600px, 50vw)', background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)', filter: 'blur(120px)', opacity: 0.04, transform: 'translate(20%, -20%)' }} />
        <div className="absolute bottom-0 left-0 rounded-full"
          style={{ width: 'min(500px, 40vw)', height: 'min(500px, 40vw)', background: 'radial-gradient(circle, #c9a54e 0%, transparent 70%)', filter: 'blur(100px)', opacity: 0.035, transform: 'translate(-20%, 20%)' }} />
      </div>

      {/* ── Floating rune glyphs ── */}
      <FloatingRune char="✦" style={{ top: '8%', left: '4%' }} delay={0} />
      <FloatingRune char="◈" style={{ top: '12%', right: '5%' }} delay={1.2} />
      <FloatingRune char="⊕" style={{ bottom: '10%', left: '6%' }} delay={2.4} />
      <FloatingRune char="◇" style={{ bottom: '8%', right: '4%' }} delay={0.8} />
      <FloatingRune char="✦" style={{ top: '45%', left: '2%' }} delay={3} />
      <FloatingRune char="◇" style={{ top: '50%', right: '2%' }} delay={1.8} />

      <div className="container-arcane relative z-10">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
          style={{ marginBottom: 'clamp(3.5rem, 6vw, 7rem)' }}
        >
          <div className="ornament mx-auto" style={{ marginBottom: '5rem' }}>Actes I</div>

          <h2 className="font-['Cinzel'] font-bold text-gradient-gold h2-glow-gold"
            style={{ fontSize: 'clamp(3rem, 6vw, 7rem)', lineHeight: 1.05, letterSpacing: '-0.01em', marginBottom: '2.5rem' }}>
            L'Auteur
          </h2>

          <p className="label-glow-gold font-['Cinzel'] tracking-[0.4em] uppercase" style={{ fontSize: '0.7rem' }}>
            ◈ &nbsp; Qui se cache derrière le code&nbsp;? &nbsp; ◈
          </p>
        </motion.div>

        {/* ── Centered intro — prose ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="container-prose text-center"
          style={{ marginBottom: 'clamp(4rem, 6vw, 8rem)' }}
        >
          {/* Decorative top rule */}
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, #c9a54e66)' }} />
            <span className="label-glow-gold font-['Cinzel'] text-xs tracking-widest">◆</span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #c9a54e66, transparent)' }} />
          </div>

          <p className="text-[#b8a898]" style={{ fontSize: 'clamp(1rem, 1.4vw, 1.2rem)', lineHeight: '2', letterSpacing: '0.02em' }}>
            Je m'appelle <span className="text-[#e8ddd0] font-semibold">Jérémy Duflot</span> et je veux devenir développeur web.
            Tout a commencé avec trois ans de <span className="text-[#c9a54e]">BUT MMI</span> à Béziers —
            une formation touche-à-tout qui m'a autant appris à coder qu'à créer des logos ou monter des vidéos.
            Aujourd'hui en <span className="text-[#c9a54e]">Mastère Dev Full-Stack</span> à Livecampus,
            j'approfondis ce qui me passionne vraiment : construire des applications, comprendre les architectures,
            aller chercher ce qui se cache derrière la première de couverture.
          </p>

          <p className="text-[#8a7a6a]" style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)', lineHeight: '2', marginTop: '1.5rem' }}>
            Ce qui me caractérise avant tout, c'est la <span className="text-[#a78bfa]">curiosité</span>.
            J'ai toujours eu envie de comprendre comment les choses fonctionnent — pas seulement en code, mais dans tous les domaines.
            Avec le <span className="text-[#c9a54e]">code</span>, ma curiosité ne trouve pas vraiment de dénouement.
          </p>

          {/* Decorative bottom rule */}
          <div className="flex items-center gap-4 mt-10">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, #c9a54e22)' }} />
            <span className="text-[#c9a54e33] font-['Cinzel'] text-xs tracking-widest">◆</span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #c9a54e22, transparent)' }} />
          </div>
        </motion.div>

        {/* ── Two-column section ── */}
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 'clamp(2rem, 5vw, 8rem)', alignItems: 'start' }}>

          {/* Left — extended bio + tags */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Decorative left border */}
            <div className="relative pl-8" style={{ borderLeft: '1px solid #c9a54e22' }}>
              <div className="absolute top-0 left-0 w-px h-12" style={{ background: 'linear-gradient(180deg, #c9a54e88, transparent)' }} />
              <div className="absolute bottom-0 left-0 w-px h-12" style={{ background: 'linear-gradient(0deg, #c9a54e88, transparent)' }} />

              <p className="text-[#a89880]" style={{ fontSize: 'clamp(0.9rem, 1.1vw, 1rem)', lineHeight: '2', marginBottom: '1.8rem' }}>
                En dehors du code, je crée des{' '}
                <span className="text-[#c9a54e]">logos et identités visuelles</span>{' '}
                pour des entreprises et je monte des <span className="text-[#f43f5e]">vidéos</span>,
                parfois en écrivant les scénarios. Ça m'aide à ne pas oublier l'aspect visuel quand je code,
                et à garder une certaine rigueur dans l'organisation — c'est aussi ce qui m'a conduit
                à apprendre et utiliser des méthodes comme <span className="text-[#a78bfa]">Scrum</span> ou <span className="text-[#a78bfa]">Agile</span>.
              </p>

              <p className="text-[#a89880]" style={{ fontSize: 'clamp(0.9rem, 1.1vw, 1rem)', lineHeight: '2', marginBottom: '2.5rem' }}>
                Je suis passionné par plein de choses assez différentes : les{' '}
                <span className="text-[#34d399]">jeux vidéo</span>,
                la <span className="text-[#a78bfa]">fantasy</span>,
                la <span className="text-[#f43f5e]">musique</span>,
                les <span className="text-[#c9a54e]">voyages en sac à dos</span>...
                Des univers qui n'ont pas grand-chose en commun en apparence,
                mais qui m'ont tous appris la même chose : s'investir dans ce qui nous intéresse vraiment.
              </p>
            </div>

          </motion.div>

          {/* Right — trait cards */}
          <div ref={cardsRef} className="grid grid-cols-2" style={{ gap: 'clamp(0.75rem, 1.5vw, 1.25rem)' }}>
            {TRAITS.map((trait, i) => (
              <motion.div
                key={trait.title}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={cardsInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 1.2, delay: 0.15 * i, ease: [0.16, 1, 0.3, 1] }}
                className="arcane-card group"
                style={{ padding: 'clamp(1.2rem, 2vw, 1.75rem)' }}
              >
                {/* Colored top accent */}
                <div className="absolute top-0 left-0 right-0 h-px rounded-t-xl transition-all duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, ${trait.color}88, transparent)`, opacity: 0.6 }} />

                <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ background: trait.color + '15', border: `1px solid ${trait.color}30`, marginBottom: '1.25rem' }}>
                  <trait.icon size={18} style={{ color: trait.color }} />
                </div>

                <h3 className="font-['Cinzel'] font-semibold text-[#e8ddd0] leading-snug mb-2"
                  style={{ fontSize: 'clamp(0.65rem, 0.9vw, 0.85rem)' }}>
                  {trait.title}
                </h3>

                <p className="text-[#6b5e4e] leading-relaxed"
                  style={{ fontSize: 'clamp(0.65rem, 0.75vw, 0.78rem)' }}>
                  {trait.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
