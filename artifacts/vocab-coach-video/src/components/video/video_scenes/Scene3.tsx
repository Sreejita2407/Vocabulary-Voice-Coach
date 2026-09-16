import { motion } from 'framer-motion';

export function Scene3() {
  return (
    <motion.div className="scene-layer" initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }} animate={{ clipPath: 'inset(0 0 0% 0)', opacity: 1 }} exit={{ clipPath: 'inset(100% 0 0 0)', opacity: 0 }} transition={{ duration: .82, ease: [0.16, 1, 0.3, 1] }}>
      <motion.div className="scene-copy" initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2, duration: .65 }}>
        <div className="scene-kicker">02 / Answer naturally</div>
        <h2 className="scene-title">Say it.<br /><em>Or type it.</em></h2>
        <p className="scene-subtitle">The practice stays low-pressure. Your voice is the first choice; your keyboard is always there.</p>
      </motion.div>
      <motion.div className="paper-card answer-card" initial={{ opacity: 0, scale: .88, y: 45, rotate: 5 }} animate={{ opacity: 1, scale: 1, y: 0, rotate: 1 }} transition={{ delay: .25, duration: .95, ease: [0.16, 1, 0.3, 1] }}>
        <div className="mini-header"><span><span className="status-dot" />your turn</span><span>word 01 of 05</span></div>
        <h3 className="answer-title">Build a sentence<br />that feels lived-in.</h3>
        <div className="answer-split">
          <div className="answer-option primary">
            <div className="option-icon">◉</div>
            <div className="option-label">voice</div>
            <div className="option-copy">Answer with your microphone.</div>
            <motion.div className="waveform" style={{ marginTop: '2.5vh', height: '3.5vh' }}>
              {[50, 88, 34, 68, 45, 75, 30, 58, 83, 42, 62].map((height, index) => <motion.span key={height + index} style={{ height: `${height}%`, background: 'var(--color-accent)' }} animate={{ scaleY: [1, .5, 1] }} transition={{ delay: index * .06, duration: 1, repeat: Infinity }} />)}
            </motion.div>
          </div>
          <div className="answer-option">
            <div className="option-icon">⌨</div>
            <div className="option-label">typing</div>
            <div className="option-copy">Write instead when you need a beat.</div>
          </div>
        </div>
        <motion.div className="transcript" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.35, duration: .5 }}>
          “There was a lot of <strong>nuance</strong> in the way she answered.”
        </motion.div>
      </motion.div>
    </motion.div>
  );
}