// Canonical Work Pets v2 timing, shared by the Web and DSH adapters.
export const PET_STATES = Object.freeze({
  idle: { row: 0, durations: [280, 110, 110, 140, 140, 320] },
  'running-right': { row: 1, durations: Array(8).fill(100) },
  'running-left': { row: 2, durations: Array(8).fill(100) },
  waving: { row: 3, durations: Array(4).fill(160) },
  jumping: { row: 4, durations: Array(5).fill(140) },
  failed: { row: 5, durations: Array(8).fill(160) },
  waiting: { row: 6, durations: Array(6).fill(180) },
  running: { row: 7, durations: Array(6).fill(160) },
  review: { row: 8, durations: Array(6).fill(160) },
});

export function petFrame(state, elapsed, reducedMotion = false) {
  const animation = PET_STATES[state] ?? PET_STATES.idle;
  const cycle = animation.durations.reduce((a, b) => a + b, 0);
  let remaining = reducedMotion ? 0 : Math.max(0, elapsed) % cycle;
  let column = 0;
  while (column < animation.durations.length - 1 && remaining >= animation.durations[column]) {
    remaining -= animation.durations[column++];
  }
  return { row: animation.row, column };
}

export function petDirection(dx, dy) {
  if (!Number.isFinite(dx) || !Number.isFinite(dy) || Math.hypot(dx, dy) < 24) return null;
  const direction = Math.round((Math.atan2(dx, -dy) * 180 / Math.PI + 360) / 22.5) % 16;
  return { row: 9 + Math.floor(direction / 8), column: direction % 8 };
}

export function petPosition(x, y, width, height, petWidth, petHeight, top = 0) {
  return {
    x: Math.max(0, Math.min(Math.max(0, width - petWidth), x)),
    y: Math.max(Math.min(top, Math.max(0, height - petHeight)), Math.min(Math.max(0, height - petHeight), y)),
  };
}

// Attach the bubble to the upper-left of the character, clamping only at edges.
export function petBubble(pet, bubbleWidth, bubbleHeight, width, height) {
  const clamp = (value, min, max) => Math.max(min, Math.min(Math.max(min, max), value));
  const x = clamp(pet.x + pet.width * .38 - bubbleWidth * .9, 8, width - bubbleWidth - 8);
  const y = clamp(pet.y + pet.height * .14 - bubbleHeight - 18, 8, height - bubbleHeight - 18);
  return { x, y, tailX: clamp(pet.x + pet.width * .42 - x, 14, bubbleWidth - 20) };
}
