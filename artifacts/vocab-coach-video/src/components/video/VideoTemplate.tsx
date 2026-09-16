// Video Template - Replace ReplitLoadingScene with your scenes

import { AnimatePresence, motion } from 'framer-motion';
import { useVideoPlayer, VideoCanvas, type VideoAspectRatio } from '@/lib/video';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';

const SCENE_DURATIONS = {
  opening: 4300,
  prompt: 4700,
  answer: 4800,
  feedback: 4100,
  progress: 5200,
};

const VIDEO_ASPECT_RATIO: VideoAspectRatio = '16:9';

const ringPositions = [
  { left: '67vw', top: '39vh', scale: 1, rotate: 0 },
  { left: '72vw', top: '27vh', scale: 1.25, rotate: 18 },
  { left: '59vw', top: '66vh', scale: .78, rotate: 42 },
  { left: '16vw', top: '8vh', scale: 1.48, rotate: -22 },
  { left: '67vw', top: '39vh', scale: 1.05, rotate: 0 },
];

export default function VideoTemplate() {
  const { currentScene } = useVideoPlayer({
    durations: SCENE_DURATIONS,
  });

  return (
    <VideoCanvas aspectRatio={VIDEO_ASPECT_RATIO} className="video-root">
      <motion.div className="persistent-ring" animate={ringPositions[currentScene]} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} />
      <motion.div className="persistent-orb" animate={{ x: currentScene * 5, y: currentScene % 2 === 0 ? -10 : 18, scale: currentScene === 4 ? 1.3 : 1 }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }} />
      <motion.div className="persistent-grid" animate={{ opacity: currentScene === 2 ? .22 : .13, rotate: currentScene * 2 }} transition={{ duration: 1.1 }} />
      <div className="product-stamp"><span className="stamp-orbit" />Saywell</div>
      <motion.div className="chapter-index" key={currentScene} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }}>{String(currentScene + 1).padStart(2, '0')} / 05</motion.div>
      <div className="corner-rule" />
      <AnimatePresence mode="sync" initial={false}>
        {currentScene === 0 && <Scene1 key="opening" />}
        {currentScene === 1 && <Scene2 key="prompt" />}
        {currentScene === 2 && <Scene3 key="answer" />}
        {currentScene === 3 && <Scene4 key="feedback" />}
        {currentScene === 4 && <Scene5 key="progress" />}
      </AnimatePresence>
    </VideoCanvas>
  );
}
