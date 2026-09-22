let context;
export async function unlockAudio() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return false;
  try {
    context ??= new AudioContext();
    if (context.state === "suspended") await context.resume();
    return context.state === "running";
  } catch {
    return false;
  }
}
export function playTone() {
  if (context?.state !== "running") return false;
  const oscillator = context.createOscillator(),
    gain = context.createGain();
  oscillator.frequency.setValueAtTime(523.25, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(
    783.99,
    context.currentTime + 0.18,
  );
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.3);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.32);
  oscillator.onended = () => {
    oscillator.disconnect();
    gain.disconnect();
  };
  return true;
}
