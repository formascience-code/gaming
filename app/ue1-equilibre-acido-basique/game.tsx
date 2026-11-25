'use client';

import { useEffect, useRef, useState } from 'react';
import { GameHeader } from '../game-header';
import { GameObjective } from '../game-objective';
import { Quiz, Results, Stethoscope, type Progress, type Question } from '../quiz';
import { acidMissions, acidQuestions, acidTitle, missionSummaries } from './questions';
import { Anatomy, Davenport, Detail, siteLabel } from './visual';
import styles from './visual.module.css';
import { readAcid, saveAcid } from './progress';

const hints = [
  'Explore le muscle du bras, puis suis le devenir du pyruvate et les échanges à la membrane.',
  'Repère les sécrétions de l’estomac et du pancréas.',
  'Suis le CO₂ des tissus jusqu’à l’air expiré.',
  'Suis le filtrat du glomérule vers les tubules du néphron.',
  'Place le point du bilan sur le diagramme de Davenport et interprète-le.',
];

export default function AcidGame() {
  const [progress, setProgress] = useState<Progress>({ solved: {}, assistance: {} });
  const [flight, setFlight] = useState<{ x: number; y: number; dx: number; dy: number } | null>(null);
  const counter = useRef<HTMLButtonElement>(null);
  const [ready, setReady] = useState(false);
  const [quiz, setQuiz] = useState<Question | null>(null);
  const [focused, setFocused] = useState(false);
  const [zooming, setZooming] = useState(false);
  const [locating, setLocating] = useState(false);
  const zoomTimer = useRef<number | null>(null);
  const [point, setPoint] = useState<number | null>(null);
  const [results, setResults] = useState(false);
  const attempts = useRef(0);
  const stage = useRef<HTMLElement>(null);
  const restart = useRef<HTMLDialogElement>(null);
  const start = useRef<HTMLButtonElement>(null);
  const debriefHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const saved = readAcid();
    attempts.current = saved.attempts;
    setProgress(saved.progress);
    setReady(true);
  }, []);

  useEffect(() => () => {
    if (zoomTimer.current !== null) window.clearTimeout(zoomTimer.current);
  }, []);

  const next = acidQuestions.find(question => !progress.solved[question.id]);
  const debrief = progress.debrief;
  const showDebrief = Boolean(debrief && !quiz);
  const current = quiz ?? next;
  const mission = quiz?.mission ?? debrief ?? next?.mission ?? acidMissions.length;
  const credits = Object.keys(progress.solved).length;
  const displayedCredits = credits - (flight ? 1 : 0);
  const location = siteLabel(mission);
  const graph = mission === 5 && focused;
  const membrane = current?.id === 'mct';
  const sceneTitle = !focused ? locating || zooming ? location : 'Vue d’ensemble' : graph ? 'Diagramme de Davenport'
    : mission === 1 ? membrane ? 'Membrane plasmique' : 'Cellule · métabolisme du glucose' : location;
  const following = quiz ? acidQuestions[acidQuestions.indexOf(quiz) + 1] : undefined;
  const group = acidQuestions.filter(question => question.mission === mission);
  const earned = group.filter(question => progress.solved[question.id]).length;

  useEffect(() => {
    if (showDebrief) debriefHeading.current?.focus();
  }, [showDebrief]);

  function persist(value: Progress) {
    setProgress(value);
    saveAcid(value, attempts.current);
  }

  function award(question: Question) {
    if (progress.solved[question.id]) return;
    const solved: Progress['solved'] = {
      ...progress.solved,
      [question.id]: progress.assistance[question.id] ? 'avec aide' : 'spontanée',
    };
    const complete = group.every(item => solved[item.id]);
    persist({ ...progress, solved, debrief: complete ? question.mission : undefined });

    const goal = counter.current?.getBoundingClientRect();
    const visible = stage.current?.getBoundingClientRect();
    if (!goal?.width || !visible?.width || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const x = visible.left + visible.width * .52;
    const y = Math.max(72, Math.min(window.innerHeight - 40, visible.top + visible.height * .52));
    setFlight({ x, y, dx: goal.left + goal.width / 2 - x, dy: goal.top + goal.height / 2 - y });
  }

  function open(question: Question, pointPlaced = point === 0) {
    setFocused(true);
    if (question.id === 'point' && !pointPlaced) return;
    if (attempts.current === 0) {
      attempts.current = 1;
      saveAcid(progress, attempts.current);
    }
    setQuiz(question);
    if (window.matchMedia('(max-width: 900px)').matches) {
      requestAnimationFrame(() => stage.current?.scrollIntoView({ block: 'start' }));
    }
  }

  function explore() {
    if (!ready || zoomTimer.current !== null) return;
    const arrive = () => {
      if (quiz || showDebrief || !next) setFocused(true);
      else open(next);
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      arrive();
      return;
    }

    setZooming(true);
    zoomTimer.current = window.setTimeout(() => {
      zoomTimer.current = null;
      setZooming(false);
      arrive();
    }, mission === 2 ? 1350 : 650);
  }

  function leaveDebrief() {
    persist({ ...progress, debrief: undefined });
    if (!next) {
      setResults(true);
      return;
    }
    if (next.mission !== 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      open(next);
      return;
    }

    setFocused(false);
    setLocating(true);
    if (window.matchMedia('(max-width: 900px)').matches) {
      requestAnimationFrame(() => stage.current?.scrollIntoView({ block: 'start' }));
    }
    zoomTimer.current = window.setTimeout(() => {
      setLocating(false);
      setZooming(true);
      zoomTimer.current = window.setTimeout(() => {
        zoomTimer.current = null;
        setZooming(false);
        open(next);
      }, 1350);
    }, 650);
  }

  return <main className="shell">
    <GameObjective/>
    <GameHeader title={acidTitle}>
      <a className="control games-back" href="/">← Accueil</a>
      <button type="button" className="control restart-button" disabled={!ready || credits === 0 && attempts.current === 0}
        onClick={() => restart.current?.showModal()}>Recommencer</button>
      <button ref={counter} type="button" className="credit-counter stethoscope-counter"
        onClick={() => setResults(true)} aria-label={`Bilan · ${displayedCredits} stéthoscopes`}>
        <Stethoscope size={17}/><strong>{displayedCredits}</strong>
      </button>
    </GameHeader>

    <div className={quiz || showDebrief ? 'workspace challenge-open' : 'workspace'}>
      <aside className="sidebar">
        <section className="mission">
          <div className="eyebrow">{current || showDebrief ? `MISSION 0${mission} / 05` : 'PARCOURS TERMINÉ'}</div>
          <h2>{current || showDebrief ? acidMissions[mission - 1] : acidTitle}</h2>
          {location && <div className="zone-pill"><i/> {location}</div>}
          <p className="mission-count">{earned} / {group.length} stéthoscopes pour cette mission</p>
          <p className="guidance">{showDebrief ? 'Mission réussie. Ton bilan est disponible.' : current ? hints[mission - 1] : 'Retrouve tes résultats et tes stéthoscopes dans le bilan.'}</p>
          <button ref={start} className="primary" disabled={!ready || locating || zooming} onClick={() => {
            if (quiz) document.getElementById('quiz-title')?.focus();
            else if (showDebrief) debriefHeading.current?.focus();
            else if (next) explore();
            else setResults(true);
          }}>{quiz ? 'Retour au défi' : showDebrief ? 'Voir le bilan de la mission' : next ? 'Relever le défi' : 'Voir le bilan'}</button>
        </section>

        <section className="route-card" aria-labelledby="acid-route">
          <div className="route-head"><h3 id="acid-route">Les 5 missions</h3><span>{credits} / {acidQuestions.length} stéthoscopes</span></div>
          <progress value={credits} max={acidQuestions.length} aria-label="Stéthoscopes du parcours"/>
          <ol className="mission-track">{acidMissions.map((title, index) => {
            const questions = acidQuestions.filter(question => question.mission === index + 1);
            const done = questions.filter(question => progress.solved[question.id]).length;
            const complete = done === questions.length;
            const active = !complete && mission === index + 1;
            const unlocked = showDebrief && next?.mission === index + 1;
            return <li key={title} className={complete ? 'complete' : active ? 'active' : 'locked'} aria-current={active ? 'step' : undefined}>
              <span className="mission-badge">{complete ? '✓' : index + 1}</span>
              <div><strong>{title}</strong><small>{complete ? 'Accomplie' : active ? 'En cours' : unlocked ? 'Débloquée' : 'Verrouillée'} · {done}/{questions.length}</small></div>
            </li>;
          })}</ol>
          <p>Chaque bonne réponse rapporte un stéthoscope et ouvre la suite.</p>
        </section>
      </aside>

      <div className="visual-column">
        <section ref={stage} className={`stage ${styles.stage}`} aria-label="Exploration de l’équilibre acido-basique">
          <div className={styles.toolbar}>
            <h2>{sceneTitle}</h2>
            <div className={styles.controls}>
              {focused
                ? <button type="button" className="control" onClick={() => setFocused(false)}>Vue d’ensemble</button>
                : <button type="button" className="control" disabled={!ready || locating || zooming} onClick={explore}>{quiz ? 'Revenir à la zone' : 'Explorer la zone'}</button>}
            </div>
          </div>
          <div className={styles.drawing} key={`${mission}-${focused}`}>
            {graph ? <Davenport selected={point} respiratory={current?.id === 'compensation' || current?.id === 'isobares'} onSelect={index => {
              setPoint(index);
              if (index === 0 && next?.id === 'point' && !quiz && !debrief) open(next, true);
            }}/> : focused && mission < 5
              ? <Detail mission={mission} id={current?.mission === mission ? current.id : acidQuestions.find(question => question.mission === mission)!.id} membrane={membrane} solved={progress.solved}/>
              : <Anatomy mission={mission} zooming={zooming} onEnter={explore}/>}
          </div>
        </section>
      </div>

      {quiz && <Quiz key={quiz.id} question={quiz} questionBank={acidQuestions} missionTitles={acidMissions}
        helpUsed={progress.assistance[quiz.id] ?? 0} creditCount={credits} celebrating={Boolean(flight)}
        position={group.indexOf(quiz) + 1} missionTotal={group.length}
        unlockText={!following ? 'Parcours terminé !' : following.mission !== quiz.mission ? 'Mission accomplie !' : 'Défi suivant débloqué.'}
        continueLabel={debrief ? 'Voir le bilan de la mission' : 'Défi suivant'}
        onHelp={level => persist({ ...progress, assistance: { ...progress.assistance, [quiz.id]: level } })}
        onCorrect={() => award(quiz)}
        onClose={() => {
          if (zoomTimer.current !== null) window.clearTimeout(zoomTimer.current);
          zoomTimer.current = null;
          setZooming(false);
          setQuiz(null); setFocused(false); start.current?.focus(); }}
        onContinue={() => {
          if (debrief || !following) {
            setQuiz(null);
            if (debrief) setFocused(false);
          }
          else open(following);
        }}/>}
      {showDebrief && <section className="mission-debrief quiz-panel" aria-labelledby="acid-debrief-title">
        <div className="debrief-award"><Stethoscope size={34}/></div>
        <p className="eyebrow">Mission {mission} sur {acidMissions.length}</p>
        <h2 id="acid-debrief-title" ref={debriefHeading} tabIndex={-1}>Mission réussie !</h2>
        <p className="debrief-mission">{acidMissions[mission - 1]}</p>
        <div className="debrief-score"><strong>{earned}</strong><span>stéthoscopes gagnés<br/>dans cette mission</span></div>
        <p className="debrief-total">{credits} / {acidQuestions.length} stéthoscopes au total</p>
        <div className="debrief-location"><strong>{location}</strong><p>{missionSummaries[mission - 1]}</p></div>
        {next ? <div className="debrief-unlock">
          <span className="eyebrow">Mission {next.mission} débloquée</span>
          <strong>{acidMissions[next.mission - 1]}</strong>
          <span>Destination · {siteLabel(next.mission)}</span>
        </div> : <div className="debrief-unlock"><strong>Parcours terminé !</strong></div>}
        <button className="primary" onClick={leaveDebrief}>{next ? `Accéder à la mission ${next.mission}` : 'Voir le bilan final'}</button>
      </section>}
    </div>

    {flight&&<div className="stethoscope-flight" style={{left:flight.x,top:flight.y,
      '--flight-x':`${flight.dx}px`,'--flight-y':`${flight.dy}px`} as React.CSSProperties}
      aria-hidden="true" onAnimationEnd={()=>setFlight(null)}><Stethoscope size={38}/></div>}
    {results && <Results progress={progress} questionBank={acidQuestions} missionTitles={acidMissions} onClose={() => setResults(false)}/>}
    <dialog ref={restart} className="quiz-dialog restart-dialog" aria-labelledby="acid-restart">
      <h2 id="acid-restart">Recommencer Équilibre acido-basique ?</h2>
      <p>La progression de cette partie sera remise à zéro et une tentative sera ajoutée.</p>
      <div className="restart-actions"><button type="button" className="control" onClick={() => restart.current?.close()}>Annuler</button>
        <button type="button" className="primary" onClick={() => {
          restart.current?.close();
          if (zoomTimer.current !== null) window.clearTimeout(zoomTimer.current);
          zoomTimer.current = null;
          setZooming(false);
          setLocating(false);
          setFlight(null);
          attempts.current += 1;
          persist({ solved: {}, assistance: {} });
          setPoint(null);
          setQuiz(null);
          setFocused(false);
        }}>Recommencer</button>
      </div>
    </dialog>
  </main>;
}
