// Web Audio API Synthesizer for Fried Chicken Brand Sound Interaction System

let audioCtx: AudioContext | null = null;
let lastSoundTime: number = 0;
const MIN_SOUND_INTERVAL_MS = 60; // Throttles rapid button mashing

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function shouldPlay(): boolean {
  const now = Date.now();
  if (now - lastSoundTime < MIN_SOUND_INTERVAL_MS) {
    return false;
  }
  lastSoundTime = now;
  return true;
}

/**
 * 1. Order Placed — Signature Sound
 * Sequence:
 * - Cute/stylized chicken "bok-bok!" / cluck (0.0s - 0.32s)
 * - Very short crispy fryer sizzle (0.32s - 0.72s)
 * - Soft confirmation ding (0.72s - 1.25s)
 * Total duration: ~1.2s
 */
export function playOrderPlacedSignatureSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // --- Part 1: Stylized Chicken "bok-bok!" (0.0s - 0.3s) ---
    // Chirp 1 ("bok")
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    const filter1 = ctx.createBiquadFilter();

    osc1.type = 'triangle';
    filter1.type = 'bandpass';
    filter1.frequency.setValueAtTime(1350, now);
    filter1.Q.setValueAtTime(3.2, now);

    osc1.frequency.setValueAtTime(310, now);
    osc1.frequency.exponentialRampToValueAtTime(560, now + 0.04);
    osc1.frequency.exponentialRampToValueAtTime(250, now + 0.1);

    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.linearRampToValueAtTime(0.32, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

    osc1.connect(filter1);
    filter1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.12);

    // Chirp 2 ("bok!") - slightly higher pitch after 110ms
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    const filter2 = ctx.createBiquadFilter();

    osc2.type = 'triangle';
    filter2.type = 'bandpass';
    filter2.frequency.setValueAtTime(1550, now + 0.11);
    filter2.Q.setValueAtTime(3.5, now + 0.11);

    osc2.frequency.setValueAtTime(350, now + 0.11);
    osc2.frequency.exponentialRampToValueAtTime(650, now + 0.15);
    osc2.frequency.exponentialRampToValueAtTime(290, now + 0.23);

    gain2.gain.setValueAtTime(0.001, now + 0.11);
    gain2.gain.linearRampToValueAtTime(0.35, now + 0.13);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

    osc2.connect(filter2);
    filter2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.start(now + 0.11);
    osc2.stop(now + 0.25);

    // --- Part 2: Short Crispy Fryer Sizzle (0.32s - 0.72s) ---
    const sizzleDuration = 0.38;
    const bufferSize = Math.floor(ctx.sampleRate * sizzleDuration);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const sizzleFilter = ctx.createBiquadFilter();
    sizzleFilter.type = 'bandpass';
    sizzleFilter.frequency.setValueAtTime(4000, now + 0.3);
    sizzleFilter.Q.setValueAtTime(2.2, now + 0.3);

    const sizzleGain = ctx.createGain();
    sizzleGain.gain.setValueAtTime(0.001, now + 0.3);
    sizzleGain.gain.linearRampToValueAtTime(0.22, now + 0.33);
    sizzleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3 + sizzleDuration);

    noiseSource.connect(sizzleFilter);
    sizzleFilter.connect(sizzleGain);
    sizzleGain.connect(ctx.destination);

    noiseSource.start(now + 0.3);

    // --- Part 3: Soft Confirmation Ding (0.72s - 1.25s) ---
    const dingStart = now + 0.7;
    const oscDing = ctx.createOscillator();
    const oscHarmonic = ctx.createOscillator();
    const gainDing = ctx.createGain();

    oscDing.type = 'sine';
    oscDing.frequency.setValueAtTime(1046.5, dingStart); // C6

    oscHarmonic.type = 'sine';
    oscHarmonic.frequency.setValueAtTime(2093.0, dingStart); // C7 harmonic

    gainDing.gain.setValueAtTime(0.001, dingStart);
    gainDing.gain.linearRampToValueAtTime(0.28, dingStart + 0.02);
    gainDing.gain.exponentialRampToValueAtTime(0.001, dingStart + 0.52);

    const dingHarmonicGain = ctx.createGain();
    dingHarmonicGain.gain.value = 0.18;

    oscDing.connect(gainDing);
    oscHarmonic.connect(dingHarmonicGain);
    dingHarmonicGain.connect(gainDing);
    gainDing.connect(ctx.destination);

    oscDing.start(dingStart);
    oscHarmonic.start(dingStart);

    oscDing.stop(dingStart + 0.55);
    oscHarmonic.stop(dingStart + 0.55);

  } catch {
    // Web Audio blocked or unsupported
  }
}

/**
 * 2. Add to Cart Sound
 * Short pop/click + subtle crispy texture (< 0.4s)
 */
export function playAddToCartSound() {
  try {
    if (!shouldPlay()) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Pop Pitch sweep
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(750, now + 0.04);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);

    // Micro Crispy Texture
    const bufferSize = Math.floor(ctx.sampleRate * 0.07);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(3500, now + 0.02);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.12, now + 0.02);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now + 0.02);
  } catch {
    // Ignore audio errors
  }
}

/**
 * 3. Remove from Cart Sound
 * Soft whoosh/pop-out sound (< 0.4s)
 */
export function playRemoveFromCartSound() {
  try {
    if (!shouldPlay()) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Downward frequency sweep
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.14);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);

    // Soft air whoosh
    const bufferSize = Math.floor(ctx.sampleRate * 0.1);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(300, now + 0.1);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.1, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
  } catch {
    // Ignore audio errors
  }
}

/**
 * 4. Order Status Update Sounds
 * - Order Accepted: short kitchen-style ding
 * - Preparing: subtle fryer/sizzle sound
 * - Ready: distinctive double kitchen bell ding
 */
export function playOrderAcceptedSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now); // A5

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  } catch { /* ignore */ }
}

export function playOrderPreparingSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const duration = 0.42;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3800, now);
    filter.Q.setValueAtTime(2.2, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
  } catch { /* ignore */ }
}

export function playOrderReadySound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Ding 1 (C6 - 1046.5Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1046.5, now);
    gain1.gain.setValueAtTime(0.28, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    // Ding 2 (E6 - 1318.5Hz) at +160ms
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1318.5, now + 0.16);
    gain2.gain.setValueAtTime(0.32, now + 0.16);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.16 + 0.42);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.16);
    osc2.stop(now + 0.16 + 0.45);
  } catch { /* ignore */ }
}

/** Legacy & utility sound exports for full backward compatibility */
export function playCrunchSound() {
  playAddToCartSound();
}

export function playBoingSound() {
  try {
    if (!shouldPlay()) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(550, ctx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.22);
  } catch { /* ignore */ }
}

export function playSizzleSound() {
  playOrderPreparingSound();
}

export function playVictorySound() {
  playOrderPlacedSignatureSound();
}

export function playNewOrderChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = [523.25, 659.25];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.14);
      gain.gain.setValueAtTime(0.25, ctx.currentTime + idx * 0.14);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.14 + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.14);
      osc.stop(ctx.currentTime + idx * 0.14 + 0.3);
    });
  } catch { /* ignore */ }
}

export function playLateOrderBeep() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  } catch { /* ignore */ }
}
