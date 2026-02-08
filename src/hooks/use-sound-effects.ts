"use client";

import { useEffect, useState } from 'react';

// Short "Pop" sound base64 for immediate feedback without external files
const POP_SOUND = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA="; // This is an empty placeholder, I will use a real short click sound if possible, or just expect the user to add files. 
// Actually, for a real "premium" feel, I should ideally suggest real files. But for "working immediately", I'll put a placeholder logic.

export default function useSoundEffects() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    // Initialize AudioContext on user interaction if needed, or just lazily
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      setAudioContext(new AudioContextClass());
    }
  }, []);

  const playHover = () => {
    // Very subtle high frequency blip
    if (!audioContext) return;
    try {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain);
      gain.connect(audioContext.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.05);
      
      gain.gain.setValueAtTime(0.02, audioContext.currentTime); // Very quiet
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);
      
      osc.start();
      osc.stop(audioContext.currentTime + 0.05);
    } catch (e) {
      // Ignore audio errors
    }
  };

  const playClick = () => {
    // Crisp click
    if (!audioContext) return;
    try {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain);
      gain.connect(audioContext.destination);
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.05, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
      
      osc.start();
      osc.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Ignore
    }
  };

  return { playHover, playClick };
}
