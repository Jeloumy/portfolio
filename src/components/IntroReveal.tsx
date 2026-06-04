import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

type Phase = 'loading' | 'unlocking' | 'opening' | 'done'

const EASE_DOOR = [0.76, 0, 0.24, 1] as const

export default function IntroReveal() {
  const [phase, setPhase] = useState<Phase>('loading')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('unlocking'), 2000) // trait atteint le milieu → quart de tour
    const t2 = setTimeout(() => setPhase('opening'),   2900) // quart de tour terminé → portes
    const t3 = setTimeout(() => setPhase('done'),      4200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  if (phase === 'done') return null
  const opening = phase === 'opening'

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, pointerEvents: opening ? 'none' : 'all' }}>

      {/* ── Panneau gauche ─────────────────────────────── */}
      <motion.div
        animate={opening ? { x: '-120%' } : { x: 0 }}
        transition={{ duration: 1.1, ease: EASE_DOOR, delay: 0.05 }}
        style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: '50%', background: '#06060f' }}
      >
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: '1px',
          background: 'linear-gradient(180deg, transparent, #c9a54e55 30%, #c9a54e88 50%, #c9a54e55 70%, transparent)',
        }} />
      </motion.div>

      {/* ── Verrou — élément indépendant au-dessus de tout ─ */}
      <motion.div
        animate={opening ? { x: '-60vw' } : { x: 0 }}
        transition={{ duration: 1.1, ease: EASE_DOOR, delay: 0.05 }}
        style={{
          position: 'absolute',
          top: 'calc(50% - 58px)',
          left: 'calc(50% - 58px)',
          width: 116, height: 116,
          zIndex: 99998,
        }}
      >
        {/* Quart de tour anti-horaire → reste bloqué à -90° */}
        <motion.div
          animate={phase !== 'loading' ? { rotate: -90 } : { rotate: 0 }}
          transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
          style={{
            width: 116, height: 116, borderRadius: '50%',
            position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div style={{
            position: 'absolute', inset: '-4px', borderRadius: '50%',
            boxShadow: '0 8px 32px #00000088, 0 2px 8px #00000066, 0 0 60px #c9a54e44, 0 0 120px #c9a54e22',
          }} />
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: 'linear-gradient(145deg, #f0d870 0%, #c9a54e 30%, #8a6020 65%, #c9a54e 85%, #e8c060 100%)',
            boxShadow: 'inset 0 -3px 8px #00000066, inset 0 3px 6px #fff3',
          }} />
          <div style={{
            position: 'absolute', inset: '7px', borderRadius: '50%',
            background: 'linear-gradient(160deg, #d4a840 0%, #a07828 40%, #c9a54e 70%, #9a7030 100%)',
            boxShadow: 'inset 0 4px 12px #00000077, inset 0 -2px 6px #f0d06033, 0 2px 4px #c9a54e55',
          }} />
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute', top: '50%', left: '50%',
              width: i % 9 === 0 ? '11px' : i % 3 === 0 ? '7px' : '4px',
              height: i % 9 === 0 ? '2px' : '1.2px',
              background: i % 9 === 0 ? '#00000077' : '#00000044',
              transformOrigin: 'left center',
              transform: `rotate(${i * 10}deg) translateX(48px) translateY(-50%)`,
              borderRadius: '1px',
            }} />
          ))}
          <div style={{
            position: 'absolute', inset: '22px', borderRadius: '50%',
            background: 'linear-gradient(145deg, #c9a54e 0%, #e8c870 35%, #a07828 65%, #c9a54e 100%)',
            boxShadow: '0 3px 10px #00000066, 0 -1px 4px #f0d06044, inset 0 1px 3px #fff2, inset 0 -2px 4px #00000044',
          }} />
          <span style={{
            position: 'relative', zIndex: 2,
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: '2.4rem', fontWeight: 900,
            color: '#06060f',
            textShadow: '0 2px 4px #00000099, 0 -1px 0px #c9a54e66',
            letterSpacing: '-0.02em', lineHeight: 1,
          }}>J</span>
        </motion.div>

        {phase === 'loading' && (
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              position: 'absolute', inset: '-12px', borderRadius: '50%',
              border: '1px solid #c9a54e55', pointerEvents: 'none',
            }}
          />
        )}
        {phase === 'unlocking' && (
          <motion.div
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              position: 'absolute', inset: '-8px', borderRadius: '50%',
              background: 'radial-gradient(circle, #c9a54e44 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
        )}
      </motion.div>

      {/* ── Panneau droit ──────────────────────────────── */}
      <motion.div
        animate={opening ? { x: '100%' } : { x: 0 }}
        transition={{ duration: 1.1, ease: EASE_DOOR, delay: 0.05 }}
        style={{ position: 'absolute', top: 0, left: '50%', bottom: 0, right: 0, background: '#06060f' }}
      >
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0, width: '1px',
          background: 'linear-gradient(180deg, transparent, #c9a54e55 30%, #c9a54e88 50%, #c9a54e55 70%, transparent)',
        }} />
      </motion.div>

      {/* ── Trait central ──────────────────────────────── */}
      <motion.div
        animate={opening ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute', top: 0, bottom: 0,
          left: '50%', transform: 'translateX(-50%)',
          width: '1px', background: '#c9a54e12', zIndex: 5,
        }}
      >
        {/* Montée bas → haut */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.9, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(0deg, #a78bfa, #c9a54e 60%, #f43f5e)',
            transformOrigin: 'bottom',
            boxShadow: '0 0 8px #c9a54e77',
          }}
        />
        {/* Descente haut → bas */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.9, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, #f43f5e, #c9a54e 60%, #a78bfa)',
            transformOrigin: 'top',
            boxShadow: '0 0 8px #c9a54e77',
          }}
        />
      </motion.div>

      {/* ── Nom ────────────────────────────────────────── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={
          phase === 'loading'   ? { opacity: 0.35 } :
          phase === 'unlocking' ? { opacity: 0.35 } :
                                  { opacity: 0 }
        }
        transition={{ duration: 0.8, delay: phase === 'loading' ? 0.5 : 0 }}
        style={{
          position: 'absolute', top: 'calc(50% + 76px)', left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Cinzel', serif", fontSize: '0.65rem',
          letterSpacing: '0.5em', color: '#c9a54e',
          textTransform: 'uppercase', whiteSpace: 'nowrap',
          zIndex: 10,
        }}
      >
        Jérémy Duflot
      </motion.p>

    </div>
  )
}
