// Use a singleton pattern for the AudioContext to avoid creating multiple instances.
let audioContext: AudioContext;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!audioContext) {
    try {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
        console.error("Web Audio API is not supported in this browser.", e);
        return null;
    }
  }
  return audioContext;
};

const playTone = (frequency: number, duration: number, startTime: number = 0) => {
  const ctx = getAudioContext();
  if (!ctx) return;

  // If the context is suspended, resume it. This is often required due to browser autoplay policies.
  if (ctx.state === 'suspended') {
      ctx.resume();
  }

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  
  // Fade in to prevent clicking sound
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + startTime + 0.01);

  oscillator.start(ctx.currentTime + startTime);
  
  // Fade out
  gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + startTime + duration);
  oscillator.stop(ctx.currentTime + startTime + duration);
};

export const playCorrectSound = () => {
  playTone(660, 0.1, 0);
  playTone(880, 0.1, 0.1);
};

export const playIncorrectSound = () => {
  playTone(220, 0.3);
};

export const playTimeoutSound = () => {
  playTone(440, 0.15);
};
