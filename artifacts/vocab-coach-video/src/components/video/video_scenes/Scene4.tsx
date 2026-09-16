import { motion } from 'framer-motion';

export function Scene4() {
  return (
    <motion.div className="scene-layer" initial={{ clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)', opacity: 0 }} animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', opacity: 1 }} exit={{ clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)', opacity: 0 }} transition={{ duration: .9, ease: [0.16, 1, 0.3, 1] }}>
      <motion.div className="feedback-word" initial={{ opacity: 0, scale: .7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .35, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}>nuance</motion.div>
      <motion.div className="paper-card feedback-card" initial={{ opacity: 0, x: -55, rotate: -5 }} animate={{ opacity: 1, x: 0, rotate: -2 }} transition={{ delay: .25, duration: .95, ease: [0.16, 1, 0.3, 1] }}>
        <div className="mini-header"><span><span className="status-dot" />instant feedback</span><span>checked / 01</span></div>
        <motion.div className="feedback-mark" initial={{ scale: 0, rotate: -25 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: .65, type: 'spring', stiffness: 260, damping: 18 }}>✓</motion.div>
        <motion.h2 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .78, duration: .6 }}>That<br /><em>landed.</em></motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: .5 }}>The word is doing real work in that sentence. Immediate feedback keeps the meaning attached to your voice.</motion.p>
        <motion.div style={{ marginTop: '5vh', color: 'var(--color-secondary)', font: '500 .9vw var(--font-mono)', letterSpacing: '.08em' }} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.48, duration: .4 }}>NEXT WORD → LINGER</motion.div>
      </motion.div>
      <motion.div style={{ position: 'absolute', right: '8vw', bottom: '15vh', zIndex: 5, width: '22vw', color: 'var(--color-muted-ink)', font: '1vw var(--font-mono)', lineHeight: 1.45 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
        <span style={{ color: 'var(--color-accent)' }}>01</span> / a loop that listens for meaning, not perfection.
      </motion.div>
    </motion.div>
  );
}