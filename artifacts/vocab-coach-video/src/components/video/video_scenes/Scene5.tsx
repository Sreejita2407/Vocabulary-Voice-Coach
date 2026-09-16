import { motion } from 'framer-motion';

export function Scene5() {
  const words = ['nuance', 'linger', 'pragmatic', 'foster', 'deliberate'];
  return (
    <motion.div className="scene-layer" initial={{ clipPath: 'circle(0% at 50% 50%)', opacity: 0 }} animate={{ clipPath: 'circle(150% at 50% 50%)', opacity: 1 }} exit={{ clipPath: 'circle(0% at 50% 50%)', opacity: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
      <motion.div className="scene-copy" style={{ left: '8.5vw', top: '23vh' }} initial={{ opacity: 0, x: -26 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .3, duration: .65 }}>
        <div className="scene-kicker">03 / Watch it build</div>
        <h2 className="scene-title">A little more<br /><em>fluent each time.</em></h2>
        <p className="scene-subtitle">One prompt at a time, practice becomes a speaking rhythm you can feel.</p>
      </motion.div>
      <motion.div className="paper-card progress-panel" initial={{ opacity: 0, scale: .84, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: .22, duration: 1, ease: [0.16, 1, 0.3, 1] }}>
        <div className="mini-header"><span><span className="status-dot" />your progress</span><span>today / 04 of 05</span></div>
        <h2>Keep the<br /><em>thread.</em></h2>
        <div className="progress-body">
          <motion.div className="progress-ring" initial={{ rotate: -90, background: 'conic-gradient(var(--color-accent) 0 8%, rgba(18,63,66,.12) 8% 100%)' }} animate={{ rotate: 0, background: 'conic-gradient(var(--color-accent) 0 78%, rgba(18,63,66,.12) 78% 100%)' }} transition={{ delay: .65, duration: 1.4, ease: 'easeOut' }}>
            <div className="progress-ring-content"><motion.span className="progress-number" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>78%</motion.span><span className="progress-caption">this week</span></div>
          </motion.div>
          <div className="word-stack">
            {words.map((word, index) => (
              <motion.div className="word-line" key={word} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .7 + index * .13, duration: .4 }}>
                <div className="word-check">{index < 4 ? '✓' : '·'}</div><strong>{word}</strong><span>{index < 4 ? 'settling in' : 'up next'}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      <motion.div style={{ position: 'absolute', left: '8.5vw', bottom: '14vh', zIndex: 5, color: 'var(--color-secondary)', font: '500 1vw var(--font-mono)', letterSpacing: '.08em' }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.25 }}>
        HEAR → ANSWER → FEEDBACK → REPEAT
      </motion.div>
      <motion.div style={{ position: 'absolute', right: '7vw', bottom: '14vh', zIndex: 5, color: 'var(--color-muted-ink)', font: '.86vw var(--font-mono)', letterSpacing: '.08em' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.45 }}>
        VOCAB VOICE COACH
      </motion.div>
    </motion.div>
  );
}