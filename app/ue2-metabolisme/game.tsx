'use client';

import { useEffect, useRef, useState } from 'react';
import { CellArt, Marker, structures, type Point } from '../atlas';
import { GameHeader } from '../game-header';
import { Quiz, Results, Stethoscope, type Progress, type Question } from '../quiz';
import { metabolismMissions, metabolismQuestions, metabolismTitle } from './questions';
import { MembraneProteins, MetabolismVisual } from './visual';
import { readMetabolism, saveMetabolism } from './progress';

type Location = { point: Point; scale: number; label: string };

const cytosol: Location = { point: [213, 389], scale: 13, label: 'Cytosol' };
const matrix: Location = { point: [295, 229], scale: 4.8, label: 'Matrice mitochondriale' };
const crista: Location = { point: [284, 258], scale: 7.4, label: 'Membrane interne · crête mitochondriale' };
const cell: Location = { point: [335, 314], scale: 1.6, label: 'Du cytosol aux mitochondries' };
const locations = [cytosol, cytosol, matrix, crista, cell];
const hints = [
  'Suis le glucose dans le cytosol et repère les réactions qui régulent la glycolyse.',
  'Compare la voie lactique dans le cytosol et la formation d’acétyl-CoA dans la mitochondrie.',
  'Repère le compartiment où se déroule le cycle et retrouve le bilan d’un tour.',
  'Approche-toi d’une crête pour étudier le transfert des électrons et le gradient de protons.',
  'Rassemble les productions du cytosol et de la mitochondrie pour établir le bilan par glucose.',
];

function locate(question: Question) {
  if (question.id === 'pdh-transport' || question.id === 'krebs-compartiment') return crista;
  if (question.id === 'pdh-bilan') return matrix;
  return locations[question.mission - 1];
}

export default function MetabolismGame() {
  const [progress, setProgress] = useState<Progress>({ solved: {}, assistance: {} });
  const [ready, setReady] = useState(false);
  const [quiz, setQuiz] = useState<Question | null>(null);
  const [wide, setWide] = useState(false);
  const [results, setResults] = useState(false);
  const attempts = useRef(0);
  const stage = useRef<HTMLElement>(null);
  const nucleus = useRef<SVGCircleElement>(null);
  const outline = useRef<SVGPathElement>(null);
  const restart = useRef<HTMLDialogElement>(null);
  const start = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const saved = readMetabolism();
    attempts.current = saved.attempts;
    setProgress(saved.progress);
    setReady(true);
  }, []);

  const next = metabolismQuestions.find(question => !progress.solved[question.id]);
  const current = quiz ?? next;
  const mission = current?.mission ?? metabolismMissions.length;
  const credits = Object.keys(progress.solved).length;
  const location = current ? locate(current) : null;
  const detail = Boolean(quiz && !wide);
  const scale = detail ? location?.scale ?? 1 : 1;
  const point = location?.point;
  const transform = detail && point
    ? `translate(${500 - point[0] * scale}px, ${370 - point[1] * scale}px) scale(${scale})`
    : undefined;
  const following = quiz ? metabolismQuestions[metabolismQuestions.indexOf(quiz) + 1] : undefined;
  const group = metabolismQuestions.filter(question => question.mission === mission);

  function persist(value: Progress) {
    setProgress(value);
    saveMetabolism(value, attempts.current);
  }

  function open(question: Question) {
    if (attempts.current === 0) {
      attempts.current = 1;
      saveMetabolism(progress, attempts.current);
    }
    setWide(false);
    setQuiz(question);
    if (window.matchMedia('(max-width: 900px)').matches) {
      requestAnimationFrame(() => stage.current?.scrollIntoView({ block: 'start' }));
    }
  }

  return <main className="shell">
    <GameHeader title={metabolismTitle}>
      <a className="control games-back" href="/">← Accueil</a>
      <button type="button" className="control restart-button" disabled={!ready || credits === 0 && attempts.current === 0}
        onClick={() => restart.current?.showModal()}>Recommencer</button>
      <button type="button" className="credit-counter stethoscope-counter"
        onClick={() => setResults(true)} aria-label={`Bilan · ${credits} stéthoscopes`}>
        <Stethoscope size={17}/><strong>{credits}</strong>
      </button>
    </GameHeader>

    <div className={quiz ? 'workspace challenge-open' : 'workspace'}>
      <aside className="sidebar">
        <section className="mission">
          <div className="eyebrow">{current ? `MISSION 0${mission} / 05` : 'PARCOURS TERMINÉ'}</div>
          <h2>{current ? metabolismMissions[mission - 1] : 'Métabolisme énergétique'}</h2>
          {location && <div className="zone-pill"><i/> {location.label}</div>}
          <p className="mission-count">{group.filter(question => progress.solved[question.id]).length} / {group.length} stéthoscopes pour cette mission</p>
          <p className="guidance">{current ? hints[mission - 1] : 'Retrouve tes résultats et tes stéthoscopes dans le bilan.'}</p>
          <button ref={start} className="primary" disabled={!ready} onClick={() => {
            if (quiz) document.getElementById('quiz-title')?.focus();
            else if (next) open(next);
            else setResults(true);
          }}>{quiz ? 'Retour au défi' : next ? 'Relever le défi' : 'Voir le bilan'}</button>
        </section>

        <section className="route-card" aria-labelledby="metabolism-route">
          <div className="route-head"><h3 id="metabolism-route">Les 5 missions</h3><span>{credits} / {metabolismQuestions.length} stéthoscopes</span></div>
          <progress value={credits} max={metabolismQuestions.length} aria-label="Stéthoscopes du parcours"/>
          <ol className="mission-track">{metabolismMissions.map((title, index) => {
            const questions = metabolismQuestions.filter(question => question.mission === index + 1);
            const done = questions.filter(question => progress.solved[question.id]).length;
            const complete = done === questions.length;
            const active = !complete && mission === index + 1;
            return <li key={title} className={complete ? 'complete' : active ? 'active' : 'locked'} aria-current={active ? 'step' : undefined}>
              <span className="mission-badge">{complete ? '✓' : index + 1}</span>
              <div><strong>{title}</strong><small>{complete ? 'Accomplie' : active ? 'En cours' : 'Verrouillée'} · {done}/{questions.length}</small></div>
            </li>;
          })}</ol>
          <p>Chaque bonne réponse rapporte un stéthoscope et ouvre la suite.</p>
        </section>
      </aside>

      <div className="visual-column">
        <section ref={stage} className={detail ? 'stage detail-active' : 'stage'} aria-label="Carte du métabolisme dans la cellule">
          <div className="stage-heading"><span>{detail ? 'GROS PLAN' : 'VUE EN COUPE'}</span>
            <h2>{detail ? location?.label : 'Cellule animale'}</h2>
          </div>
          {quiz && <div className="scene-tools"><button type="button" className="scene-control zoom-toggle"
            onClick={() => setWide(value => !value)} aria-pressed={detail}>{detail ? 'Vue cellule' : 'Gros plan'}</button></div>}
          <svg className="map" viewBox="0 0 1000 740" role="img" aria-label={detail ? `Gros plan sur ${location?.label}` : 'Coupe de cellule animale et repère de la prochaine réaction'}
            style={{ cursor: 'default' }}>
            <g id="cell-board" style={{ transform }}>
              <CellArt nucleusRef={nucleus} cellRef={outline}/>
              {point && !detail && <circle cx={point[0]} cy={point[1]} r={detail ? 32 / scale : 20} fill="none"
                stroke="#634675" strokeWidth={detail ? 4 / scale : 3} strokeDasharray={detail ? undefined : '6 5'}/>}
              {detail && quiz && <MembraneProteins id={quiz.id}/>}
              {!detail && structures.filter(item => ['mito', 'nucleus', 'membrane'].includes(item.id)).map(item => <Marker key={item.id} item={item}/>)}
            </g>
            {detail && quiz && <MetabolismVisual id={quiz.id}/>}
          </svg>
          <div className="stage-foot"><span><i/> {location?.label ?? 'Cellule animale'}</span>
            <span>{detail ? 'Schéma de principe · hors échelle' : 'Le repère indique où aura lieu le prochain défi.'}</span>
          </div>
        </section>
      </div>

      {quiz && <Quiz key={quiz.id} question={quiz} questionBank={metabolismQuestions} missionTitles={metabolismMissions}
        helpUsed={progress.assistance[quiz.id] ?? 0} creditCount={credits} celebrating={false}
        position={group.indexOf(quiz) + 1} missionTotal={group.length}
        unlockText={!following ? 'Parcours terminé !' : following.mission !== quiz.mission ? 'Mission accomplie !' : 'Défi suivant débloqué.'}
        continueLabel={!following ? 'Voir le bilan' : following.mission !== quiz.mission ? 'Mission suivante' : 'Défi suivant'}
        onHelp={level => persist({ ...progress, assistance: { ...progress.assistance, [quiz.id]: level } })}
        onCorrect={() => persist({ ...progress, solved: { ...progress.solved, [quiz.id]: progress.assistance[quiz.id] ? 'avec aide' : 'spontanée' } })}
        onClose={() => { setQuiz(null); start.current?.focus(); }}
        onContinue={() => {
          if (following) open(following);
          else { setQuiz(null); setResults(true); }
        }}/>}
    </div>

    {results && <Results progress={progress} questionBank={metabolismQuestions} missionTitles={metabolismMissions} onClose={() => setResults(false)}/>}
    <dialog ref={restart} className="quiz-dialog restart-dialog" aria-labelledby="metabolism-restart">
      <h2 id="metabolism-restart">Recommencer le métabolisme ?</h2>
      <p>La progression de cette partie sera remise à zéro et une tentative sera ajoutée.</p>
      <div className="restart-actions"><button type="button" className="control" onClick={() => restart.current?.close()}>Annuler</button>
        <button type="button" className="primary" onClick={() => {
          restart.current?.close();
          attempts.current += 1;
          persist({ solved: {}, assistance: {} });
          setQuiz(null);
          setWide(false);
        }}>Recommencer</button>
      </div>
    </dialog>
  </main>;
}
