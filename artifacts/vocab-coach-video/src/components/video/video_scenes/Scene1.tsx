import { motion } from 'framer-motion';

export function Scene1() {
  return (
    <motion.div
      className="scene-layer"
      initial={{ clipPath: 'inset(0 0 0 100%)', opacity: 0 }}
      animate={{ clipPath: 'inset(0 0 0 0%)', opacity: 1 }}
      exit={{ clipPath: 'inset(0 100% 0 0%)', opacity: 0.2 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.img
        className="texture-image"
        src={`${import.meta.env.BASE_URL}assets/coach-paper-texture.png`}
        alt=""
        initial={{ scale: 1.12, x: '4vw' }}
        animate={{ scale: 1, x: 0 }}
        transition={{ duration: 5, ease: 'easeOut' }}
      />
      <div className="scene-copy">
        <motion.div className="scene-kicker" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .25, duration: .45 }}>
          A spoken vocabulary loop
        </motion.div>
        <motion.h1 className="scene-title" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .5, duration: .75, ease: [0.16, 1, 0.3, 1] }}>
          Make the word<br />sound like <em>you.</em>
        </motion.h1>
        <motion.p className="scene-subtitle" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: .6 }}>
          Vocab Voice Coach turns a quiet study moment into a real conversation.
        </motion.p>
      </div>
      <motion.div className="paper-card voice-card" initial={{ opacity: 0, scale: .93, rotate: -3, x: 36 }} animate={{ opacity: 1, scale: 1, rotate: -2, x: 0 }} transition={{ delay: .4, duration: 1, ease: [0.16, 1, 0.3, 1] }}>
        <div className="voice-card-header"><span><span className="status-dot" />daily practice</span><span>01 / 05</span></div>
        <div className="prompt-label">today's word</div>
        <motion.div className="prompt-word" animate={{ y: [0, -4, 0] }} transition={{ delay: 1.5, duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}>nuance</motion.div>
        <div className="prompt-definition">a small difference in meaning, feeling, or tone</div>
        <div className="audio-row">
          <motion.div className="waveform" aria-hidden="true">
            {[24, 39, 58, 35, 70, 47, 28, 63, 46, 31, 54, 22, 42, 29, 49, 37, 61, 28].map((height, index) => (
              <motion.span key={height + index} style={{ height: `${height}%` }} animate={{ scaleY: [1, .55, 1.18, 1] }} transition={{ delay: index * .035, duration: 1.9, repeat: Infinity, ease: 'easeInOut' }} />
            ))}
          </motion.div>
          <span className="audio-label">listen first</span>
        </div>
      </motion.div>
    </motion.div>
  );
}