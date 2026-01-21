"use client";

// Standard medical-grade calming sounds
// Minimal Audible Base64 sounds (Short Sine Waves)
// Click: High pitch short blip
// I will use a slightly longer, audible one here for testing

// Success: Major Chord Arpeggio (Simulated with placeholder for now, ensuring use-sound works first)

export function useCalmSound() {
  // Sounds disabled per user request
  const playClick = () => {};
  const playHover = () => {};
  const playSuccess = () => {};

  return { playClick, playHover, playSuccess };
}
