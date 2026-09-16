import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Bell,
  Check,
  ChevronRight,
  CircleHelp,
  Headphones,
  Keyboard,
  Lightbulb,
  Mic,
  MicOff,
  Play,
  RotateCcw,
  Volume2,
  Waves,
  X,
} from 'lucide-react';

type RecognitionEvent = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

type RecognitionInstance = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((event: RecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

type SpeechWindow = Window & {
  SpeechRecognition?: new () => RecognitionInstance;
  webkitSpeechRecognition?: new () => RecognitionInstance;
};

type VocabularyWord = {
  word: string;
  phonetic: string;
  definition: string;
  prompt: string;
  accepted: string[];
  hint: string;
};

const VOCABULARY: VocabularyWord[] = [
  {
    word: 'nuance',
    phonetic: '/ˈnuː.ɑːns/',
    definition: 'a small difference in meaning, feeling, or tone',
    prompt: 'Use “nuance” in a sentence about a conversation.',
    accepted: ['nuance', 'nuanced'],
    hint: 'Try: There was a lot of nuance in the way she answered.',
  },
  {
    word: 'linger',
    phonetic: '/ˈlɪŋ.ɡər/',
    definition: 'to stay somewhere longer than expected',
    prompt: 'Tell me what can linger after a memorable meal.',
    accepted: ['linger', 'lingers', 'lingered', 'lingering'],
    hint: 'Try: The taste of citrus lingered on my tongue.',
  },
  {
    word: 'pragmatic',
    phonetic: '/præɡˈmæt̬.ɪk/',
    definition: 'focused on practical results rather than theory',
    prompt: 'Describe one pragmatic choice you made this week.',
    accepted: ['pragmatic', 'pragmatically'],
    hint: 'Try: Taking the train was the most pragmatic choice.',
  },
  {
    word: 'foster',
    phonetic: '/ˈfɑː.stər/',
    definition: 'to help something develop or grow',
    prompt: 'What habit helps foster a good working relationship?',
    accepted: ['foster', 'fosters', 'fostered', 'fostering'],
    hint: 'Try: Honest questions foster trust.',
  },
  {
    word: 'deliberate',
    phonetic: '/dɪˈlɪb.ər.ət/',
    definition: 'done carefully and intentionally',
    prompt: 'Give an example of a deliberate decision.',
    accepted: ['deliberate', 'deliberately'],
    hint: 'Try: It was a deliberate pause before my answer.',
  },
];

function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.92;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

function normalize(text: string) {
  return text.toLowerCase().replace(/[.,!?;:]/g, ' ').replace(/\s+/g, ' ').trim();
}

function App() {
  const [started, setStarted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [typedOpen, setTypedOpen] = useState(false);
  const [recognizing, setRecognizing] = useState(false);
  const [feedback, setFeedback] = useState<'good' | 'try' | null>(null);
  const [results, setResults] = useState<(boolean | null)[]>(() => Array(VOCABULARY.length).fill(null));
  const [notice, setNotice] = useState('');
  const recognitionRef = useRef<RecognitionInstance | null>(null);

  const currentWord = VOCABULARY[activeIndex];
  const isSupported = Boolean(
    (window as SpeechWindow).SpeechRecognition || (window as SpeechWindow).webkitSpeechRecognition,
  );
  const sessionComplete = started && activeIndex === VOCABULARY.length - 1 && feedback !== null;
  const completedCount = results.filter((result) => result !== null).length;
  const masteredCount = 3 + results.filter(Boolean).length;
  const progressPercent = Math.min(100, Math.round((masteredCount / 7) * 100));

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
    };
  }, []);

  const announce = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3500);
  };

  const startSession = () => {
    setStarted(true);
    setAnswer('');
    setFeedback(null);
    setTypedOpen(false);
    window.setTimeout(() => speak(currentWord.prompt), 180);
  };

  const listenToPrompt = () => {
    speak(currentWord.prompt);
    announce('Playing the prompt aloud.');
  };

  const submitAnswer = (value = answer) => {
    const cleanAnswer = normalize(value);
    if (!cleanAnswer) {
      setTypedOpen(true);
      announce('Write or say a sentence first.');
      return;
    }
    const isGood = currentWord.accepted.some((accepted) => cleanAnswer.includes(accepted));
    setResults((previous) => previous.map((item, index) => (index === activeIndex ? isGood : item)));
    setFeedback(isGood ? 'good' : 'try');
    setRecognizing(false);
    recognitionRef.current?.stop();
    if (isGood) {
      speak('Nice work. That word sounds at home in your sentence.');
    } else {
      speak(`Good try. Listen once more, then try using ${currentWord.word}.`);
    }
  };

  const startListening = () => {
    const speechWindow = window as SpeechWindow;
    const Recognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setTypedOpen(true);
      announce('Microphone recognition is not available here, so typing is ready instead.');
      return;
    }
    if (recognizing) {
      recognitionRef.current?.stop();
      setRecognizing(false);
      return;
    }
    const recognition = new Recognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? '';
      setAnswer(transcript);
      setRecognizing(false);
      setTypedOpen(true);
      submitAnswer(transcript);
    };
    recognition.onerror = () => {
      setRecognizing(false);
      setTypedOpen(true);
      announce('I could not hear that clearly. Typing is ready as a fallback.');
    };
    recognition.onend = () => setRecognizing(false);
    recognitionRef.current = recognition;
    setRecognizing(true);
    setFeedback(null);
    recognition.start();
  };

  const goNext = () => {
    if (activeIndex >= VOCABULARY.length - 1) return;
    setActiveIndex((index) => index + 1);
    setAnswer('');
    setFeedback(null);
    setTypedOpen(false);
    window.setTimeout(() => speak(VOCABULARY[activeIndex + 1].prompt), 120);
  };

  const selectWord = (index: number) => {
    if (!started) {
      startSession();
    }
    setActiveIndex(index);
    setAnswer('');
    setFeedback(null);
    setTypedOpen(false);
  };

  const resetSession = () => {
    recognitionRef.current?.stop();
    setStarted(false);
    setActiveIndex(0);
    setAnswer('');
    setTypedOpen(false);
    setRecognizing(false);
    setFeedback(null);
    setResults(Array(VOCABULARY.length).fill(null));
  };

  const promptStatus = useMemo(() => {
    if (!started) return 'Ready when you are';
    if (recognizing) return 'Listening for your sentence';
    if (feedback) return 'Feedback is ready';
    return `Word ${activeIndex + 1} of ${VOCABULARY.length}`;
  }, [activeIndex, feedback, recognizing, started]);

  return (
    <div className="app-shell grain">
      <aside className="side-rail" aria-label="Primary navigation">
        <div className="brand-mark" data-testid="brand-vocab">
          <div className="brand-orbit" aria-hidden="true" />
          <span className="brand-name">Saywell</span>
        </div>
        <p className="rail-kicker">Your word studio</p>
        <nav className="rail-nav">
          <a className="rail-link" href="#practice" aria-current="page" data-testid="link-practice">
            <Waves size={16} strokeWidth={1.8} />
            <span>Practice</span>
          </a>
          <a className="rail-link" href="#words" data-testid="link-word-bank">
            <Keyboard size={16} strokeWidth={1.8} />
            <span>Word bank</span>
          </a>
        </nav>
        <div className="rail-footer">
          <div className="streak-card" data-testid="card-streak">
            <span className="streak-label">Your speaking rhythm</span>
            <div className="streak-value">
              <span className="streak-number">6</span>
              <span className="streak-unit">days in a row</span>
            </div>
            <div className="streak-dots" aria-label="Six day practice streak">
              <span className="active" /><span className="active" /><span className="active" />
              <span className="active" /><span className="active" /><span className="active" /><span />
            </div>
          </div>
        </div>
      </aside>

      <div className="content-wrap">
        <header className="topbar">
          <div className="topbar-context"><strong>Tuesday practice</strong><span> · 6 minutes</span></div>
          <div className="topbar-actions">
            <button
              className="quiet-button"
              type="button"
              onClick={() => announce('A short practice is enough. Show up, speak once, repeat.')}
              aria-label="Practice tip"
              data-testid="button-practice-tip"
            >
              <CircleHelp size={17} />
            </button>
            <button
              className="quiet-button"
              type="button"
              onClick={() => announce('You have one fresh practice waiting.')}
              aria-label="Notifications"
              data-testid="button-notifications"
            >
              <Bell size={17} />
            </button>
            <div className="profile-chip" data-testid="profile-chip">
              <div className="profile-avatar">AM</div>
              <div className="profile-copy"><strong>Alex Morgan</strong><span>steady learner</span></div>
            </div>
          </div>
        </header>

        <main className="main-content" id="practice">
          <div className="intro-row">
            <div>
              <div className="eyebrow"><span className="eyebrow-line" /> Speak it into place</div>
              <h1 className="headline">New words are waiting<br />to sound like <em>you.</em></h1>
            </div>
            <p className="intro-note">A private, low-pressure space to make vocabulary feel natural out loud.</p>
          </div>

          <div className="dashboard-grid">
            <section className="session-card" aria-label="Speaking practice session">
              <div className="session-head">
                <div className="session-title">
                  <span className="session-title-icon"><Headphones size={15} /></span>
                  <span>Everyday expression</span>
                </div>
                <span className="session-meta" data-testid="text-session-status">{promptStatus}</span>
              </div>

              {!started ? (
                <div className="session-complete" data-testid="empty-session-state">
                  <div className="complete-mark"><Play size={24} fill="currentColor" /></div>
                  <h2>A small practice, right now.</h2>
                  <p>Five useful words. One spoken prompt at a time. You can answer with your voice or type when that feels better.</p>
                  <button className="restart-button" type="button" onClick={startSession} data-testid="button-start-session">
                    Start a 5-word session <ArrowRight size={15} style={{ verticalAlign: 'middle', marginLeft: 5 }} />
                  </button>
                  <div className="availability-note">No account or setup required</div>
                </div>
              ) : sessionComplete ? (
                <div className="session-complete" data-testid="session-complete">
                  <div className="complete-mark"><Check size={27} strokeWidth={2.5} /></div>
                  <h2>That is a good day's work.</h2>
                  <p>You gave these words a place in your mouth. Come back tomorrow and they will feel a little closer.</p>
                  <button className="restart-button" type="button" onClick={resetSession} data-testid="button-restart-session">
                    <RotateCcw size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} /> Practice again
                  </button>
                </div>
              ) : (
                <>
                  <div className="prompt-area">
                    <div className="prompt-label">Say it in your own words</div>
                    <h2 className="prompt-word" data-testid="text-current-word">{currentWord.word}</h2>
                    <p className="prompt-definition"><strong>{currentWord.phonetic}</strong> &nbsp; {currentWord.definition}</p>
                    <button className="listen-button" type="button" onClick={listenToPrompt} data-testid="button-listen-prompt">
                      <Volume2 size={15} /> Listen to the prompt <ArrowRight size={14} />
                    </button>
                  </div>

                  {feedback && (
                    <div className={`feedback ${feedback === 'good' ? 'good' : ''}`} role="status" data-testid="status-feedback">
                      <div className="feedback-icon">
                        {feedback === 'good' ? <Check size={14} /> : <Lightbulb size={14} />}
                      </div>
                      <div>
                        <strong>{feedback === 'good' ? 'That landed.' : 'You are close.'}</strong>
                        <p>{feedback === 'good' ? 'The word is doing real work in that sentence.' : currentWord.hint}</p>
                        {feedback === 'try' && <button className="next-button" type="button" onClick={listenToPrompt} data-testid="button-replay-prompt">Hear it again</button>}
                        {feedback === 'good' && <button className="next-button" type="button" onClick={goNext} data-testid="button-next-word">Next word <ChevronRight size={12} style={{ verticalAlign: 'middle' }} /></button>}
                      </div>
                    </div>
                  )}

                  <div className={`answer-panel ${recognizing ? 'listening' : ''}`} data-testid="answer-panel">
                    <div className="answer-topline">
                      <span className="answer-label">Your turn</span>
                      <span className="answer-hint">{recognizing ? 'Listening…' : 'Say a full sentence'}</span>
                    </div>
                    <div className="answer-actions">
                      <button
                        className={`mic-button ${recognizing ? 'recording' : ''} ${!isSupported ? 'unavailable' : ''}`}
                        type="button"
                        onClick={startListening}
                        aria-pressed={recognizing}
                        data-testid="button-microphone"
                      >
                        {recognizing ? <MicOff className="mic-icon" size={17} /> : <Mic className="mic-icon" size={17} />}
                        {recognizing ? 'Stop listening' : isSupported ? 'Answer with microphone' : 'Microphone unavailable'}
                      </button>
                      <button className="type-button" type="button" onClick={() => setTypedOpen((open) => !open)} aria-expanded={typedOpen} data-testid="button-type-answer">
                        {typedOpen ? <X size={15} /> : <Keyboard size={15} />}
                        {typedOpen ? 'Close typing' : 'Type instead'}
                      </button>
                    </div>
                    {typedOpen && (
                      <form className="typed-form" onSubmit={(event) => { event.preventDefault(); submitAnswer(); }}>
                        <input
                          className="typed-input"
                          value={answer}
                          onChange={(event) => setAnswer(event.target.value)}
                          placeholder="Write your sentence here…"
                          aria-label="Type your answer"
                          autoFocus
                          data-testid="input-typed-answer"
                        />
                        <button className="submit-button" type="submit" aria-label="Submit typed answer" data-testid="button-submit-answer">
                          <ArrowRight size={16} />
                        </button>
                      </form>
                    )}
                  </div>
                </>
              )}
            </section>

            <aside className="side-stack">
              <section className="mini-card" aria-label="Your progress">
                <div className="mini-card-head">
                  <span className="mini-card-title">Your progress</span>
                  <span className="session-meta">{completedCount} / 5 today</span>
                </div>
                <div className="progress-layout">
                  <div className="progress-ring" style={{ background: `conic-gradient(hsl(var(--accent)) 0 ${progressPercent}%, hsl(var(--muted)) ${progressPercent}% 100%)` }} data-testid="progress-ring">
                    <div className="progress-ring-content"><span className="progress-ring-value">{progressPercent}%</span><span className="progress-ring-caption">this week</span></div>
                  </div>
                  <div className="progress-copy">
                    <strong>Keep the thread</strong>
                    <p>Three words are settling in. Two more today keeps your rhythm warm.</p>
                  </div>
                </div>
              </section>

              <section className="mini-card" id="words" aria-label="Today's vocabulary">
                <div className="mini-card-head">
                  <span className="mini-card-title">Today's words</span>
                  <button className="mini-card-link" type="button" onClick={() => announce('You are looking at this session’s five words.')} data-testid="button-view-words">VIEW ALL</button>
                </div>
                <div className="word-list">
                  {VOCABULARY.map((item, index) => (
                    <button
                      className={`word-row ${index === activeIndex ? 'active' : ''}`}
                      type="button"
                      key={item.word}
                      onClick={() => selectWord(index)}
                      data-testid={`button-word-${item.word}`}
                    >
                      <span className={`word-status ${results[index] === true ? 'done' : ''}`}>
                        {results[index] === true ? <Check size={12} /> : <span>{String(index + 1).padStart(2, '0')}</span>}
                      </span>
                      <span className="word-text">{item.word}</span>
                      <span className="word-phonetic">{item.phonetic}</span>
                    </button>
                  ))}
                </div>
              </section>

              <div className="tip-strip" role="note" data-testid="practice-tip">
                <Lightbulb className="tip-icon" size={18} />
                <div><strong>One useful trick</strong><p>Pause after the word. A little silence gives your brain time to find its natural shape.</p></div>
              </div>
            </aside>
          </div>
          <div aria-live="polite" className="sr-only" data-testid="status-notice">{notice}</div>
        </main>
      </div>
    </div>
  );
}

export default App;