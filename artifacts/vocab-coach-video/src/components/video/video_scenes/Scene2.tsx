import { motion } from 'framer-motion';

export function Scene2() {
  return (
    <motion.div className="scene-layer" initial={{ clipPath: 'circle(0% at 86% 50%)', opacity: 0 }} animate={{ clipPath: 'circle(150% at 86% 50%)', opacity: 1 }} exit={{ clipPath: 'circle(0% at 14% 50%)', opacity: 0 }} transition={{ duration: .85, ease: [0.16, 1, 0.3, 1] }}>
      <motion.img
        className="texture-image"
        src={`${import.meta.env.BASE_URL}assets/voice-wave-texture.png`}
        alt=""
        style={{ opacity: .1, mixBlendMode: 'multiply' }}
        initial={{ scale: 1.18, rotate: -3 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 5, ease: 'easeOut' }}
      />
      <motion.div className="scene-copy" initial={{ opacity: 0, x: -38 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .18, duration: .65 }}>
        <div className="scene-kicker">01 / Hear the prompt</div>
        <h2 className="scene-title">Let the word<br /><em>arrive.</em></h2>
        <p className="scene-subtitle">A clear, spoken prompt gives your brain a starting point — before you have to perform.</p>
      </motion.div>
      <motion.div className="paper-card voice-card" initial={{ opacity: 0, x: 70, rotate: 5 }} animate={{ opacity: 1, x: 0, rotate: 2 }} transition={{ delay: .22, duration: .9, ease: [0.16, 1, 0.3, 1] }}>
        <div className="voice-card-header"><span><span className="status-dot" />spoken prompt</span><span>playback / 00:04</span></div>
        <div className="prompt-label">use “nuance” in a sentence about a conversation</div>
        <div className="prompt-word" style={{ fontSize: '5.4vw', marginTop: '3vh' }}>listen</div>
        <motion.div className="waveform" style={{ marginTop: '5vh', height: '12vh' }}>
          {[21, 32, 48, 72, 58, 88, 46, 68, 95, 55, 75, 38, 61, 28, 50, 79, 42, 67, 31, 48, 26, 56, 35, 72, 44, 62].map((height, index) => (
            <motion.span key={`prompt-wave-${index}`} style={{ height: `${height}%`, width: '.38vw' }} animate={{ scaleY: [1, .38, 1.2, .82, 1] }} transition={{ delay: index * .045, duration: 1.45, repeat: Infinity, ease: 'easeInOut' }} />
          ))}
        </motion.div>
        <div className="audio-row" style={{ marginTop: '3vh' }}><span className="audio-label">voice prompt playing</span><motion.span className="status-dot" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 1, repeat: Infinity }} /></div>
      </motion.div>
      <motion.div style={{ position: 'absolute', left: '77vw', top: '72vh', zIndex: 5, color: 'var(--color-secondary)', font: '.95vw var(--font-mono)', letterSpacing: '.08em' }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .85 }}>
        YOUR TURN FOLLOWS
      </motion.div>
    </motion.div>
  );
}