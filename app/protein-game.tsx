'use client';

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { challengeLocation, missionLocations } from './mission-location';
import { GameHeader } from './game-header';
import { recordAttempt } from './game-progress';
import { gameTitle } from './game-info';
import { ChallengeVisual, challengeTitle } from './challenge-visual';
import { loadProgress, missions, progressKey, questions, Stethoscope, Quiz, Results, type Progress, type Question } from './quiz';
import { CellArt, Marker, freeRibosome, inside, nuclearArrival, nuclearCenter, pore, structures, type Point, type Structure, type Zone } from './atlas';

const startingPoint:Point=[64,342];
const outerPore:Point=[458,389];
const zones:Zone[]=['outside','cytoplasm','nucleus'];
const names=['Extérieur','Cytoplasme','Noyau'];
const guidance=[
  'Observez la cellule en coupe, puis traversez la membrane plasmique.',
  'Explorez le cytoplasme et rejoignez le pore nucléaire.',
  'Explorez le nucléoplasme. Repérez la chromatine et le nucléole.',
];
const topics:Record<string,string>={pore:'le pore nucléaire',chromatine:'la chromatine',gène:'le gène','pré-ARNm':'le pré-ARNm',ARNm:'l’ARNm',ribosome:'le ribosome'};
const storageKey='formaScience.cellQuest.phase1.v1';
const distance=(a:Point,b:Point)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
const radial=(a:number,r:number):Point=>[nuclearCenter[0]+r*Math.cos(a),nuclearCenter[1]+r*Math.sin(a)];

function Icon({name,size=18}:{name:string,size?:number}) {
  const shapes:Record<string,ReactNode>={
    help:<><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.6 2.6 0 0 1 5 .8c0 1.8-2.5 2.2-2.5 3.9m0 2.7h.01"/></>,
    reset:<path d="M4 10a8 8 0 1 1 1.7 7.5M4 4v6h6"/>,
    layers:<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5m-18 4 9 5 9-5"/>,
    close:<path d="m6 6 12 12M18 6 6 18"/>,
    check:<path d="m5 12 4 4L19 6"/>,
    focus:<><circle cx="12" cy="12" r="3"/><path d="M7 4H4v3m13-3h3v3M4 17v3h3m10 0h3v-3"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[name]}</svg>;
}

export default function Page() {
  const [progress,setProgress]=useState<Progress>({solved:{},assistance:{}});
  const [quiz,setQuiz]=useState<Question|null>(null);
  const [flight,setFlight]=useState<{x:number;y:number;dx:number;dy:number}|null>(null);
  const counter=useRef<HTMLButtonElement>(null);
  const stage=useRef<HTMLElement>(null);
  const [wideView,setWideView]=useState(false);
  const [results,setResults]=useState(false);
  const savedProgress=useRef<Progress>(progress);
  const nextQuestion=questions.find(q=>!progress.solved[q.id]);
  const credits=Object.keys(progress.solved).length;
  const debrief=progress.debrief;
  const mission=debrief??nextQuestion?.mission??missions.length;
  const missionLocation=missionLocations[mission-1];
  const debriefHeading=useRef<HTMLHeadingElement>(null);
  const [ready,setReady]=useState(false);
  const [zone,setZone]=useState<Zone>('outside');
  const [visited,setVisited]=useState(0);
  const [player,setPlayer]=useState<Point>(startingPoint);
  const [moving,setMoving]=useState(false);
  const [zoomed,setZoomed]=useState(false);
  const [target,setTarget]=useState<Point|null>(null);

  const [labels,setLabels]=useState(true);
  const [help,setHelp]=useState(false);
  const [notice,setNotice]=useState('');
  const board=useRef<SVGGElement>(null);
  const map=useRef<SVGSVGElement>(null);
  const nucleusShape=useRef<SVGCircleElement>(null);
  const cellShape=useRef<SVGPathElement>(null);
  const dialog=useRef<HTMLDialogElement>(null);
  const restartDialog=useRef<HTMLDialogElement>(null);
  const position=useRef<Point>(startingPoint);
  const animation=useRef(0);
  const busy=useRef(false);
  const index=zones.indexOf(zone);

  useEffect(()=>{
    try {
      const saved=Number(localStorage.getItem(storageKey));
      if(Number.isInteger(saved)&&saved>=0&&saved<=2) setVisited(saved);
    } catch {}
    recordAttempt();
    savedProgress.current=loadProgress();
    setProgress(savedProgress.current);
    if(savedProgress.current.debrief) {
      const completedInNucleus=savedProgress.current.debrief<4;
      const destination=completedInNucleus?nuclearArrival:inside;
      position.current=destination;
      setPlayer(destination);
      setZone(completedInNucleus?'nucleus':'cytoplasm');
    }
    setReady(true);
    return ()=>cancelAnimationFrame(animation.current);
  },[]);
  useEffect(()=>{
    if(help&&!dialog.current?.open) dialog.current?.showModal();
    if(!help&&dialog.current?.open) dialog.current.close();
  },[help]);

  useEffect(()=>{
    if(debrief&&!quiz) debriefHeading.current?.focus();
  },[debrief,quiz]);

  function put(point:Point) {
    position.current=point;
    setPlayer(point);
  }
  function finishZone(next:Zone) {
    setZone(next);
    setVisited(previous=>{
      const value=Math.max(previous,zones.indexOf(next));
      try {localStorage.setItem(storageKey,String(value));} catch {}
      return value;
    });
  }
  function animate(points:Point[], next?:Zone, onArrival?:()=>void) {
    cancelAnimationFrame(animation.current);
    const route=[position.current,...points];
    const lengths=route.slice(1).map((p,i)=>distance(p,route[i]));
    const total=lengths.reduce((sum,length)=>sum+length,0);
    if(total<.1) {
      if(next){finishZone(next);setZoomed(next==='nucleus');}
      onArrival?.();
      return;
    }
    const duration=window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:Math.min(next?2000:1150,Math.max(220,total*4));
    let started:number|undefined;
    busy.current=Boolean(next);
    setMoving(Boolean(next));
    setTarget(next?null:points.at(-1)??null);
    if(next==='cytoplasm'&&zone==='nucleus') setZoomed(false);
    function tick(now:number) {
      started??=now;
      const t=duration===0?1:Math.min(1,(now-started)/duration);
      let traversed=total*t;
      let segment=0;
      while(segment<lengths.length-1 && traversed>lengths[segment]) traversed-=lengths[segment++];
      const [a,b]=[route[segment],route[segment+1]];
      const fraction=lengths[segment]>0?traversed/lengths[segment]:1;
      put([a[0]+(b[0]-a[0])*fraction,a[1]+(b[1]-a[1])*fraction]);
      if(t<1) animation.current=requestAnimationFrame(tick);
      else {
        setTarget(null);
        setMoving(false);
        busy.current=false;
        if(next){finishZone(next);setZoomed(next==='nucleus');}
        onArrival?.();
      }
    }
    animation.current=requestAnimationFrame(tick);
  }
  function writeProgress(next:Progress) {
    savedProgress.current=next;
    setProgress(next);
    try {localStorage.setItem(progressKey,JSON.stringify(next));} catch {}
  }
  function award(question:Question) {
    const previous=savedProgress.current;
    if(previous.solved[question.id]) return;
    const solved:Progress['solved']={...previous.solved,[question.id]:previous.assistance[question.id]?'avec aide':'spontanée'};
    const completed=questions.filter(q=>q.mission===question.mission).every(q=>solved[q.id]);
    writeProgress({...previous,solved,debrief:completed?question.mission:undefined});
    const goal=counter.current?.getBoundingClientRect();
    const visible=stage.current?.getBoundingClientRect();
    if(goal&&visible&&goal.width>0&&visible.width>0&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      const y=Math.max(72,Math.min(window.innerHeight-40,visible.top+visible.height*.52));
      const x=visible.left+visible.width*.52;
      setFlight({x,y,dx:goal.left+goal.width/2-x,dy:goal.top+goal.height/2-y});
    }
  }
  function showQuiz(question:Question) {
    setNotice('');
    setWideView(false);
    setQuiz(question);
  }
  function advance(passage=false, onArrival?:()=>void) {
    if(busy.current||debrief) return;
    setNotice('');
    if(zone==='outside') animate([inside],'cytoplasm');
    if(zone==='cytoplasm') {
      if(!passage&&!progress.solved.pore) {
        showQuiz(questions[0]);
        return;
      }
      animate([...cytoplasmRoute(outerPore),pore,nuclearArrival],'nucleus',onArrival);
    }
    if(zone==='nucleus') animate([nuclearArrival,pore,outerPore],'cytoplasm');
    map.current?.focus({preventScroll:true});
  }
  function startMission() {
    if(quiz) {document.getElementById('quiz-title')?.focus();return;}
    if(debrief){debriefHeading.current?.focus();return;}
    if(!nextQuestion) {setResults(true);return;}
    if(zone==='outside'||nextQuestion.id==='pore') {advance();return;}
    const desired=nextQuestion.mission<4?'nucleus':'cytoplasm';
    if(zone!==desired) {advance();return;}
    showQuiz(nextQuestion);
  }
  function leaveDebrief() {
    const previous=savedProgress.current;
    if(!previous.debrief) return;
    writeProgress({...previous,debrief:undefined});
    if(!nextQuestion) {setResults(true);return;}
    setNotice('');
    const destination=nextQuestion.mission<4?'nucleus':'cytoplasm';
    const openChallenge=()=>showQuiz(nextQuestion);
    const enterNucleus=()=>animate([...cytoplasmRoute(outerPore),pore,nuclearArrival],'nucleus',openChallenge);
    if(zone===destination) openChallenge();
    else if(zone==='outside') animate([inside],'cytoplasm',destination==='nucleus'?enterNucleus:openChallenge);
    else if(destination==='nucleus') enterNucleus();
    else animate([nuclearArrival,pore,outerPore],'cytoplasm',openChallenge);
  }
  function reset() {
    setFlight(null);
    setQuiz(null);
    cancelAnimationFrame(animation.current);
    busy.current=false;
    put(startingPoint);
    setMoving(false);
    setZoomed(false);
    setZone('outside');
    setNotice('');
    setTarget(null);
  }
  function restartGame() {
    recordAttempt(true);
    restartDialog.current?.close();
    reset();
    setResults(false);
    setVisited(0);
    writeProgress({solved:{},assistance:{}});
    try {localStorage.removeItem(storageKey);} catch {}
  }
  function inCell(p:Point) {
    return cellShape.current?.isPointInFill(new DOMPoint(...p))??false;
  }
  function valid(p:Point) {
    if(zone==='nucleus') return nucleusShape.current?.isPointInFill(new DOMPoint(...p))??false;
    if(zone==='cytoplasm') return inCell(p)&&distance(p,nuclearCenter)>151;
    return p[0]>=35&&p[0]<=970&&p[1]>=35&&p[1]<=698&&!inCell(p);
  }
  function cytoplasmRoute(to:Point) {
    const from=position.current;
    const clear=Array.from({length:29},(_,i)=>i/28).every(t=>distance([from[0]+t*(to[0]-from[0]),from[1]+t*(to[1]-from[1])],nuclearCenter)>150);
    if(clear) return [to];
    const angle=(p:Point)=>Math.atan2(p[1]-nuclearCenter[1],p[0]-nuclearCenter[0]);
    const a=angle(from), b=angle(to);
    const sweep=Math.atan2(Math.sin(b-a),Math.cos(b-a));
    const segments=Math.max(2,Math.ceil(Math.abs(sweep)/.17));
    return [...Array.from({length:segments+1},(_,i)=>radial(a+sweep*i/segments,159)),to];
  }
  function clickMap(event:MouseEvent<SVGSVGElement>) {
    if(busy.current) return;
    const matrix=board.current?.getScreenCTM();
    if(!matrix) return;
    const p=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse());
    const destination:Point=[p.x,p.y];
    if(!valid(destination)) {
      if(zone==='cytoplasm'&&distance(destination,nuclearCenter)<=151) setNotice('Utilisez le pore nucléaire pour entrer dans le noyau.');
      else if(zone==='outside'&&inCell(destination)) setNotice('Cliquez sur Entrer dans la cellule pour traverser la membrane.');
      return;
    }
    setNotice('');
    const p0=position.current;
    if(zone==='outside'&&!Array.from({length:20},(_,i)=>i/19).every(t=>valid([p0[0]+t*(p.x-p0[0]),p0[1]+t*(p.y-p0[1])]))) return;
    animate(zone==='cytoplasm'?cytoplasmRoute(destination):[destination]);
    map.current?.focus({preventScroll:true});
  }
  function activate(item:Structure) {
    if(busy.current) return;
    if(item.id==='pore'){if(!quiz) advance();return;}
    if(item.id==='ribosome'&&!debrief&&nextQuestion&&mission>=4){if(!quiz) showQuiz(nextQuestion);return;}
  }
  const visible=structures.filter(item=>{
    if(item.id==='ribosome') return zone==='cytoplasm'&&Boolean(nextQuestion&&mission>=4);
    if(item.id==='pore') return zone!=='outside';
    if(zone==='nucleus') return item.id==='chromatin'||item.id==='nucleolus';
    return item.id!=='chromatin'&&item.id!=='nucleolus';
  });
  const following=quiz?questions[questions.indexOf(quiz)+1]:undefined;
  const missionCompleted=Boolean(quiz&&following?.mission!==quiz.mission);
  const unlockText=missionCompleted?'Mission réussie ! Consultez le bilan de cette mission.':
    quiz?.id==='pore'?'Le pore nucléaire est ouvert.':
    'Défi suivant débloqué.';
  const continueLabel=missionCompleted?'Voir le bilan de la mission':
    quiz?.id==='pore'?'Traverser le pore':'Relever le défi suivant';
  const locationQuestion=quiz??(debrief?questions.filter(q=>q.mission===debrief).at(-1):nextQuestion);
  const locationLabel=locationQuestion?challengeLocation(locationQuestion.id,locationQuestion.mission):undefined;
  const targetPore=locationQuestion?.id==='pore'||locationQuestion?.id==='export';
  const focusPoint:Point=targetPore?pore:locationQuestion?.id==='charge'?[335,456]:
    locationQuestion&&locationQuestion.mission>=4?freeRibosome:
    locationQuestion?.id==='chromatine'?[595,333]:[605,346];
  const detail=Boolean(quiz&&!wideView);
  const magnification=7.4;
  const mapTransform=detail?`translate(${500-focusPoint[0]*magnification}px,${370-focusPoint[1]*magnification}px) scale(${magnification})`:undefined;
  const desired=mission<4?'nucleus':'cytoplasm';
  const buttonText=debrief?'Voir le bilan de la mission':!nextQuestion?'Voir le bilan':zone==='outside'?'Entrer dans la cellule':
    nextQuestion.id==='pore'?'Franchir le pore':zone===desired?'Relever le défi':
    zone==='nucleus'?'Revenir au cytoplasme':'Rejoindre le noyau';
  const task=nextQuestion&&zone===desired
    ? `Répondez au quiz sur ${topics[nextQuestion.context]??nextQuestion.context}.`
    : guidance[index];

  return <main className="shell">
    <GameHeader title={gameTitle}>
      <a className="control games-back" href="/">← Accueil</a>
<button className="control restart-button" type="button" disabled={!ready}
        onClick={()=>restartDialog.current?.showModal()}><Icon name="reset"/> Recommencer</button><button ref={counter} className="credit-counter stethoscope-counter" onClick={()=>setResults(true)}
        aria-label={`Bilan · ${credits-(flight?1:0)} stéthoscope${credits-(flight?1:0)===1?'':'s'}`}>
        <Stethoscope size={17}/><strong>{credits-(flight?1:0)}</strong></button><button className="control" onClick={()=>setHelp(true)}><Icon name="help"/> Commandes</button>
    </GameHeader>
    <div className={quiz||debrief?"workspace challenge-open":"workspace"}>
      <aside className="sidebar">
        <div className="mission">
          <div className="eyebrow">{nextQuestion||debrief?`MISSION ${String(mission).padStart(2,'0')} / 05`:'PARCOURS TERMINÉ'}</div>
          <h2>{nextQuestion||debrief?missions[mission-1]:'Synthèse protéique'}</h2>
          <div className="zone-pill"><i/> Vous êtes ici · {names[index]}</div>
          {(nextQuestion||debrief)&&<div className="mission-location">
            <Icon name="focus" size={17}/><div><small>Lieu du phénomène</small><strong>{missionLocation.label}</strong></div>
          </div>}
          {nextQuestion&&<p className="mission-count">{questions.filter(q=>q.mission===mission&&progress.solved[q.id]).length} / {questions.filter(q=>q.mission===mission).length} stéthoscopes pour cette mission</p>}
          <p className="guidance" aria-live="polite">{moving?'Passage en cours…':notice||(debrief?'Mission réussie. Votre bilan est disponible.':nextQuestion?task:'Vos résultats et vos stéthoscopes sont disponibles dans le bilan.')}</p>
          <button className="primary" disabled={!ready||moving} onClick={startMission}>{buttonText}</button>
        </div>
        <section className="route-card" aria-labelledby="route-title">
          <div className="route-head"><h3 id="route-title">Les 5 missions</h3><span>{credits} / {questions.length} stéthoscopes</span></div>
          <progress value={credits} max={questions.length} aria-label="Stéthoscopes du parcours"/>
          <ol className="mission-track">{missions.map((title,i)=>{
            const group=questions.filter(q=>q.mission===i+1);
            const done=group.filter(q=>progress.solved[q.id]).length;
            const finished=done===group.length;
            const active=Boolean(!debrief&&nextQuestion&&i+1===mission);
            const unlocked=Boolean(debrief&&nextQuestion?.mission===i+1);
            return <li key={title} className={finished?'complete':active?'active':'locked'} aria-current={active?'step':undefined}>
              <span className="mission-badge">{finished?<Icon name="check" size={14}/>:i+1}</span>
              <div><strong>{title}</strong><small>{finished?'Accomplie':active?'En cours':unlocked?'Débloquée':'Verrouillée'} · {done}/{group.length}</small></div>
            </li>;
          })}</ol>
          <p>Chaque bonne réponse rapporte un stéthoscope et ouvre la suite.</p>
        </section>

      </aside>
      <div className="visual-column">
      <section ref={stage} className={detail?"stage detail-active":"stage"} aria-label="Plan de la cellule">
        <div className="stage-heading"><span>{detail?locationLabel:'VUE EN COUPE'}</span><h2>{detail&&quiz?challengeTitle(quiz.id):'Cellule animale'}</h2></div>
        <div className="scene-tools">
          {quiz&&<button className="scene-control zoom-toggle" onClick={()=>setWideView(value=>!value)} aria-pressed={detail}>
            <Icon name={detail?'layers':'focus'}/>{detail?'Vue cellule':'Gros plan'}
          </button>}
          {!detail&&<button className="scene-control" aria-label="Afficher les repères" aria-pressed={labels} onClick={()=>setLabels(x=>!x)}><Icon name="layers"/></button>}
          <button className="scene-control" aria-label="Revenir à la vue extérieure" onClick={reset}><Icon name="reset"/></button>
        </div>
        <svg ref={map} className="map" viewBox="0 0 1000 740" role="group" aria-label="Carte interactive de la cellule animale"
            tabIndex={detail?-1:0} onClick={clickMap} onKeyDown={event=>{
              if(busy.current) return;
              if(event.key.toLowerCase()==='e'&&zone!=='outside'&&!quiz){event.preventDefault();advance();return;}
              const offsets:Record<string,Point>={ArrowLeft:[-13,0],ArrowRight:[13,0],ArrowUp:[0,-13],ArrowDown:[0,13]};
              const offset=offsets[event.key];
              if(!offset) return;
              event.preventDefault();
              cancelAnimationFrame(animation.current);
              setTarget(null);
              const p:Point=[position.current[0]+offset[0],position.current[1]+offset[1]];
              if(valid(p)) put(p);
            }}>
          <g ref={board} className={zoomed&&!quiz&&!debrief?'zoomed':''} style={{transform:mapTransform}} id="cell-board">
            <CellArt nucleusRef={nucleusShape} cellRef={cellShape}
              detailId={detail?quiz?.id:undefined}
              detailArt={detail&&quiz?<ChallengeVisual id={quiz.id} point={focusPoint}/>:undefined}/>
            {locationQuestion&&!detail&&<circle cx={focusPoint[0]} cy={focusPoint[1]} r="19"
              fill="none" stroke="#e1bc63" strokeWidth="3.5" strokeDasharray="5 4" pointerEvents="none"/>}
            {target&&!detail&&<circle cx={target[0]} cy={target[1]} r="9" fill="none" stroke="#355d65" opacity=".52" strokeWidth="1.5"/>}
            {!detail&&<g className="player" transform={`translate(${player.join(' ')})`} aria-hidden="true">
              <circle className="halo" r="14" fill="#fffbef" opacity=".32"/>
              <circle r="8" fill="#234b58" stroke="#fff5e4" strokeWidth="3"/>
              <circle r="2" fill="#fff9e9"/>
            </g>}
            {labels&&!moving&&!detail&&visible.map(item=><Marker key={item.id} item={item} onClick={!quiz&&(item.id==='pore'||item.id==='ribosome')?()=>activate(item):undefined}/>)}
          </g>
        </svg>
        <div className="stage-foot"><span><i/> {names[index]}</span><span>{detail?'Schéma de principe · hors échelle':locationLabel?`À observer · ${locationLabel}`:missionLocation.label}</span></div>
      </section>
      </div>
      {quiz&&<Quiz key={quiz.id} question={quiz} helpUsed={progress.assistance[quiz.id]??0}
      creditCount={credits} unlockText={unlockText} continueLabel={continueLabel}
      celebrating={Boolean(flight)}
      position={questions.filter(q=>q.mission===quiz.mission).indexOf(quiz)+1}
      missionTotal={questions.filter(q=>q.mission===quiz.mission).length}
      onHelp={level=>{const p=savedProgress.current;writeProgress({...p,assistance:{...p.assistance,[quiz.id]:level}});}}
      onCorrect={()=>award(quiz)} onClose={()=>setQuiz(null)} onContinue={()=>{
        setQuiz(null);
        if(quiz.id==='pore'&&zone==='cytoplasm') {
          advance(true, following ? ()=>showQuiz(following) : undefined);
          return;
        }
        if(missionCompleted||!following) return;
        const destination=following.mission<4?'nucleus':'cytoplasm';
        if(zone===destination) showQuiz(following);
        else advance(true);
      }}/> }
      {!quiz&&debrief&&<section className="mission-debrief quiz-panel" aria-labelledby="debrief-title">
        <div className="debrief-award"><Stethoscope size={34}/></div>
        <p className="eyebrow">Mission {debrief} sur {missions.length}</p>
        <h2 id="debrief-title" ref={debriefHeading} tabIndex={-1}>Mission réussie !</h2>
        <p className="debrief-mission">{missions[debrief-1]}</p>
        <div className="debrief-score"><strong>{questions.filter(q=>q.mission===debrief&&progress.solved[q.id]).length}</strong><span>stéthoscopes gagnés<br/>dans cette mission</span></div>
        <p className="debrief-total">{credits} / {questions.length} stéthoscopes au total</p>
        <div className="debrief-location"><strong>{missionLocation.label}</strong><p>{missionLocation.summary}</p></div>
        {nextQuestion?<div className="debrief-unlock">
          <span className="eyebrow">Mission {nextQuestion.mission} débloquée</span>
          <strong>{missions[nextQuestion.mission-1]}</strong>
          <span>Destination · {missionLocations[nextQuestion.mission-1].label}</span>
        </div>:<div className="debrief-unlock"><strong>Parcours terminé !</strong></div>}
        <button className="primary" onClick={leaveDebrief}>{nextQuestion?`Accéder à la mission ${nextQuestion.mission}`:'Voir le bilan final'}</button>
      </section>}
    </div>
    {flight&&<div className="stethoscope-flight" style={{left:flight.x,top:flight.y,
      '--flight-x':`${flight.dx}px`,'--flight-y':`${flight.dy}px`} as React.CSSProperties}
      aria-hidden="true" onAnimationEnd={()=>setFlight(null)}><Stethoscope size={38}/></div>}
    {results&&<Results progress={progress} onClose={()=>setResults(false)}/>}
    <dialog ref={restartDialog} className="restart-dialog" aria-labelledby="restart-title">
      <h2 id="restart-title">Recommencer la partie ?</h2>
      <p>Les stéthoscopes, les réponses et les indices de cette partie seront remis à zéro dans ce navigateur.</p>
      <div className="restart-actions">
        <button className="control" type="button" autoFocus onClick={()=>restartDialog.current?.close()}>Annuler</button>
        <button className="primary" type="button" onClick={restartGame}>Recommencer la partie</button>
      </div>
    </dialog>
    <dialog ref={dialog} onClose={()=>setHelp(false)} onCancel={()=>setHelp(false)}>
      <div className="dialog-head"><h2>Commandes</h2><button className="icon-button" aria-label="Fermer les commandes" onClick={()=>setHelp(false)}><Icon name="close"/></button></div>
      <dl><div><dt>Se déplacer</dt><dd>Cliquez dans le compartiment ou utilisez les flèches lorsque la carte est active.</dd></div>
      <div><dt>Franchir le pore</dt><dd>Cliquez sur « Pore nucléaire » ou utilisez la touche E depuis la carte.</dd></div>
      <div><dt>Identifier un organite</dt><dd>Cliquez sur son repère pour ouvrir sa fiche.</dd></div></dl>
      <button className="primary" onClick={()=>setHelp(false)}>Continuer</button>
    </dialog>
  </main>;
}
