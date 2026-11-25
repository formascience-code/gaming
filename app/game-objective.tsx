import { useEffect, useRef } from 'react';
import { Stethoscope } from './quiz';
import styles from './game-objective.module.css';

export function GameObjective({ onClose }: { onClose?: () => void } = {}) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const objective = dialog.current;
    if (objective && !objective.open) objective.showModal();
  }, []);

  return <dialog ref={dialog} onClose={onClose} className={styles.dialog} aria-labelledby="game-objective-title">
    <form method="dialog">
      <button className={styles.close} aria-label="Fermer les règles du jeu">×</button>
      <header className={styles.header}>
        <h2 id="game-objective-title">Ton objectif</h2>
        <p>Accomplis les 5 missions et récolte les 20 stéthoscopes pour gagner la partie.</p>
      </header>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <strong>05</strong>
          <span>Missions</span>
        </div>
        <div className={styles.stat}>
          <strong><Stethoscope size={23}/> 20</strong>
          <span>Stéthoscopes</span>
        </div>
      </div>
      <p className={styles.rule}>Chaque mission comporte plusieurs défis. Chaque défi réussi te rapporte <strong>1 stéthoscope</strong> et débloque le suivant.</p>
      <button className={styles.play} autoFocus>C’est parti ! <span aria-hidden="true">→</span></button>
    </form>
  </dialog>;
}
