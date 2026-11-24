import { useEffect, useRef } from 'react';
import { Stethoscope } from './quiz';
import styles from './game-objective.module.css';

const missionNumbers = [1, 2, 3, 4, 5];

export function GameObjective() {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const objective = dialog.current;
    if (objective && !objective.open) objective.showModal();
  }, []);

  return <dialog ref={dialog} className={styles.dialog} aria-labelledby="game-objective-title">
    <form method="dialog">
      <button className={styles.close} aria-label="Fermer les règles du jeu">×</button>
      <h2 id="game-objective-title">Ton objectif</h2>
      <p className={styles.intro}>Le jeu comporte <strong>5 missions</strong>, chacune composée de plusieurs défis. Chaque défi réussi te rapporte <strong>1 stéthoscope</strong> et débloque le suivant.</p>
      <div className={styles.board}>
        <div className={styles.route} aria-hidden="true">
          {missionNumbers.map(number => <span key={number}>{number}</span>)}
        </div>
        <div className={styles.reward}>
          <span className={styles.token}><Stethoscope size={25}/></span>
          <span><strong>+1 stéthoscope</strong><small>par défi réussi</small></span>
        </div>
      </div>
      <p className={styles.rule}>Pour gagner la partie, termine les <strong>5 missions</strong> et remporte les <strong>20 stéthoscopes</strong>.</p>
      <button className={styles.play} autoFocus>C’est parti ! <span aria-hidden="true">→</span></button>
    </form>
  </dialog>;
}
