import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Pause, Play, Repeat } from 'lucide-react';
import VideoTemplate, { SCENE_DURATIONS } from './VideoTemplate';
import { useSceneControls } from './useSceneControls';

const SCENE_DETAILS = [
  { title: 'The prompt arrives', filePath: 'src/components/video/video_scenes/Scene1.tsx' },
  { title: 'Hear the word', filePath: 'src/components/video/video_scenes/Scene2.tsx' },
  { title: 'Say it your way', filePath: 'src/components/video/video_scenes/Scene3.tsx' },
  { title: 'Get a clear signal', filePath: 'src/components/video/video_scenes/Scene4.tsx' },
  { title: 'Build the habit', filePath: 'src/components/video/video_scenes/Scene5.tsx' },
];

function formatTime(durationMs: number) {
  const seconds = Math.max(0, Math.floor(durationMs / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

function PlaybackStatus({
  sceneKeys,
  activeIndex,
  activeDuration,
  activeStartTime,
  totalDuration,
  tick,
  paused,
  onJumpTo,
}: {
  sceneKeys: string[];
  activeIndex: number;
  activeDuration: number;
  activeStartTime: number;
  totalDuration: number;
  tick: number;
  paused: boolean;
  onJumpTo: (index: number) => void;
}) {
  const [elapsed, setElapsed] = useState(0);
  const baseRef = useRef(0);

  useEffect(() => {
    setElapsed(0);
    baseRef.current = 0;
  }, [tick]);

  useEffect(() => {
    if (paused) return;
    const startedAt = performance.now();
    const interval = window.setInterval(() => {
      setElapsed(baseRef.current + performance.now() - startedAt);
    }, 60);
    return () => {
      window.clearInterval(interval);
      baseRef.current += performance.now() - startedAt;
    };
  }, [paused, tick]);

  const progress = activeDuration ? Math.min(1, elapsed / activeDuration) : 0;
  const totalElapsed = Math.min(totalDuration, activeStartTime + Math.min(elapsed, activeDuration));

  return (
    <>
      <div className="video-progress">
        {sceneKeys.map((key, index) => (
          <button key={key} type="button" onClick={() => onJumpTo(index)} aria-label={`Jump to scene ${index + 1}`} className="video-progress-segment">
            <span style={{ width: `${index === activeIndex ? progress * 100 : index < activeIndex ? 100 : 0}%` }} />
          </button>
        ))}
      </div>
      <div className="video-counter">{activeIndex + 1}/{sceneKeys.length}</div>
      <div className="video-timer">{formatTime(totalElapsed)} / {formatTime(totalDuration)}</div>
    </>
  );
}

export default function VideoWithControls() {
  const isIframed = typeof window !== 'undefined' && window.self !== window.top;
  const {
    sceneKeys, activeIndex, locked, paused, mountKey, tick, durations,
    activeDuration, activeStartTime, totalDuration, onSceneChange, jumpTo,
    toggleLock, togglePause,
  } = useSceneControls(SCENE_DURATIONS);
  const [collapsed, setCollapsed] = useState(false);
  const [hovering, setHovering] = useState(false);
  const sensorRef = useRef<HTMLDivElement>(null);

  const handleJumpTo = useCallback((index: number) => {
    jumpTo(index);
    const detail = SCENE_DETAILS[index];
    if (detail && isIframed) {
      window.parent.postMessage({
        type: 'REPLIT_VIDEO_SCENE_SELECTED',
        payload: { sceneIndex: index, sceneCount: sceneKeys.length, sceneTitle: detail.title, filePath: detail.filePath, lineNumber: 1 },
      }, '*');
    }
  }, [isIframed, jumpTo, sceneKeys.length]);

  useEffect(() => {
    if (!collapsed) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' && sensorRef.current && !sensorRef.current.contains(event.target as Node)) {
        setHovering(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [collapsed]);

  if (!isIframed) return <VideoTemplate />;

  const visible = !collapsed || hovering;
  return (
    <div className="video-shell">
      <VideoTemplate
        key={mountKey}
        durations={durations}
        paused={paused}
        onSceneChange={onSceneChange}
      />
      <div
        ref={sensorRef}
        className="video-control-sensor"
        onPointerEnter={(event) => event.pointerType === 'mouse' && setHovering(true)}
        onPointerLeave={(event) => event.pointerType === 'mouse' && setHovering(false)}
      >
        <div className={`video-control-bar ${visible ? 'is-visible' : 'is-hidden'}`}>
          <button type="button" className="video-control-button" onClick={togglePause} aria-label={paused ? 'Play' : 'Pause'}>
            {paused ? <Play size={19} /> : <Pause size={19} />}
          </button>
          <button type="button" className={`video-control-button ${locked ? 'is-active' : ''}`} onClick={toggleLock} aria-label={locked ? 'Unlock scene loop' : 'Loop current scene'}>
            <Repeat size={19} />
          </button>
          <div className="video-control-divider" />
          <PlaybackStatus
            sceneKeys={sceneKeys}
            activeIndex={activeIndex}
            activeDuration={activeDuration}
            activeStartTime={activeStartTime}
            totalDuration={totalDuration}
            tick={tick}
            paused={paused}
            onJumpTo={handleJumpTo}
          />
          <button type="button" className="video-control-button" onClick={() => setCollapsed((value) => !value)} aria-label={collapsed ? 'Show controls' : 'Hide controls'}>
            {collapsed ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}