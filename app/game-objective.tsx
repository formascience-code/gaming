import { useEffect, useRef } from 'react';

export function GameObjective() {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const objective = dialog.current;
    if (objective && !objective.open) objective.showModal();
  }, []);

  return <dialog ref={dialog} aria-labelledby="game-objective-title">
    <form method="dialog">
      <div className="dialog-head">
        <h2 id="game-objective-title">Ton objectif</h2>
        <button className="icon-button" aria-label="Fermer les règles du jeu">×</button>
      </div>
      <p>Le jeu comporte <strong>5 missions</strong>, chacune composée de plusieurs défis. Chaque défi réussi te rapporte <strong>1 stéthoscope</strong> et débloque le suivant.</p>
      <p>Pour gagner la partie, termine les <strong>5 missions</strong> et remporte les <strong>20 stéthoscopes</strong>.</p>
      <button className="control primary" autoFocus>C’est parti !</button>
    </form>
  </dialog>;
}
