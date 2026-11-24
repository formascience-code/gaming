import type { Progress } from '../quiz';
import { metabolismQuestions } from './questions';

const key = 'formaScience.metabolism.v1';

export function readMetabolism(): { progress: Progress; attempts: number } {
  const progress: Progress = { solved: {}, assistance: {} };
  try {
    const saved = JSON.parse(localStorage.getItem(key) ?? 'null');
    for (const { id } of metabolismQuestions) {
      const solved = saved?.progress?.solved?.[id];
      const help = saved?.progress?.assistance?.[id];
      if (solved === 'spontanée' || solved === 'avec aide') progress.solved[id] = solved;
      if (Number.isInteger(help) && help >= 1 && help <= 3) progress.assistance[id] = help;
    }
    const attempts = saved?.attempts;
    return { progress, attempts: Number.isSafeInteger(attempts) && attempts > 0 ? attempts : 0 };
  } catch {
    return { progress, attempts: 0 };
  }
}

export function saveMetabolism(progress: Progress, attempts: number) {
  try { localStorage.setItem(key, JSON.stringify({ progress, attempts })); } catch {}
}
