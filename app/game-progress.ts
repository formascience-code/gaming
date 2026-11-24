const attemptsKey = 'formaScience.proteinSynthesis.attempts';

export function getAttempts(hasSavedProgress = false) {
  try {
    const attempts = Number(localStorage.getItem(attemptsKey));
    if (Number.isSafeInteger(attempts) && attempts > 0) return attempts;
  } catch {}
  return hasSavedProgress ? 1 : 0;
}

export function recordAttempt(restart = false) {
  const current = getAttempts();
  if (current && !restart) return;
  try { localStorage.setItem(attemptsKey, String(current + 1)); } catch {}
}
