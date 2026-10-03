// Video Template - Replace ReplitLoadingScene with your scenes

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useVideoPlayer, VideoCanvas, type VideoAspectRatio } from '@/lib/video';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';

export const SCENE_DURATIONS = {
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

const SCENE_COMPONENTS = {
  opening: Scene1,
  prompt: Scene2,
  answer: Scene3,
  feedback: Scene4,
  progress: Scene5,
} as const;

type VideoTemplateProps = {
  durations?: Record<string, number>;
  loop?: boolean;
  paused?: boolean;
  onSceneChange?: (sceneKey: string) => void;
};

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  paused = false,
  onSceneChange,
}: VideoTemplateProps = {}) {
  const { currentScene, currentSceneKey } = useVideoPlayer({
    durations,
    loop,
    paused,
  });
  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '') as keyof typeof SCENE_COMPONENTS;
  const sceneIndex = Object.keys(SCENE_DURATIONS).indexOf(baseSceneKey);
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  return (
    <VideoCanvas aspectRatio={VIDEO_ASPECT_RATIO} className="video-root">
      <motion.div className="persistent-ring" animate={ringPositions[Math.max(0, sceneIndex)]} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} />
      <motion.div className="persistent-orb" animate={{ x: sceneIndex * 5, y: sceneIndex % 2 === 0 ? -10 : 18, scale: sceneIndex === 4 ? 1.3 : 1 }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }} />
      <motion.div className="persistent-grid" animate={{ opacity: sceneIndex === 2 ? .22 : .13, rotate: sceneIndex * 2 }} transition={{ duration: 1.1 }} />
      <div className="product-stamp"><span className="stamp-orbit" />Saywell</div>
      <motion.div className="chapter-index" key={currentSceneKey} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }}>{String(Math.max(0, sceneIndex) + 1).padStart(2, '0')} / 05</motion.div>
      <div className="corner-rule" />
      <AnimatePresence mode="sync" initial={false}>
        {SceneComponent && <SceneComponent key={currentSceneKey} />}
      </AnimatePresence>
    </VideoCanvas>
  );
}
