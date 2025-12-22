// Aceasta este o mică librărie audio "fără fișiere"
// Folosește placa de sunet a browserului pentru a genera tonuri

const createOscillator = (ctx: AudioContext, freq: number, type: OscillatorType, duration: number, startTime: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
  
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    // Setăm volumul să scadă în timp (fade out)
    gain.gain.setValueAtTime(0.1, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  
    osc.connect(gain);
    gain.connect(ctx.destination);
  
    osc.start(startTime);
    osc.stop(startTime + duration);
  };
  
  export const playClickSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      // Un sunet scurt, înalt, tip "Sonar"
      createOscillator(ctx, 800, 'sine', 0.1, ctx.currentTime);
    } catch (e) {
      console.error("Audio not supported");
    }
  };
  
  export const playSuccessSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
  
      const ctx = new AudioContext();
      const now = ctx.currentTime;
  
      // Un acord triumfător (C Major: Do - Mi - Sol)
      // C5
      createOscillator(ctx, 523.25, 'sine', 1.5, now);
      // E5
      createOscillator(ctx, 659.25, 'sine', 1.5, now + 0.1);
      // G5
      createOscillator(ctx, 783.99, 'sine', 1.5, now + 0.2);
      // C6 (octavă sus)
      createOscillator(ctx, 1046.50, 'triangle', 2.0, now + 0.3);
  
    } catch (e) {
      console.error("Audio not supported");
    }
  };