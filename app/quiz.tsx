'use client';

import { useEffect, useRef, useState } from 'react';
import bank from './data/questions.json';

export const questions=bank;
export type Question=(typeof bank)[number];
export type Progress={solved:Record<string,'spontanée'|'avec aide'>; assistance:Record<string,number>; debrief?:number};
export const progressKey='formaScience.cellQuest.quiz.v1';
export const missions=[
  'Entrer dans le noyau',
  'Transcrire un gène',
  'Fabriquer un ARNm mature',
  'Déchiffrer le message',
  'Synthétiser une protéine',
];
export function loadProgress():Progress {
  try {
    const data=JSON.parse(localStorage.getItem(progressKey)??'null');
    const solved:Progress['solved']={}, assistance:Progress['assistance']={};
    for(const q of questions) {
      const result=data?.solved?.[q.id];
      if(result==='spontanée'||result==='avec aide') solved[q.id]=result;
      const help=data?.assistance?.[q.id];
      if(Number.isInteger(help)&&help>=1&&help<=3) assistance[q.id]=help;
    }
    const group=questions.filter(q=>q.mission===data?.debrief);
    return {solved,assistance,debrief:group.length&&group.every(q=>solved[q.id])?data.debrief:undefined};
  } catch {return {solved:{},assistance:{}};}
}

export function Stethoscope({size=20}:{size?:number}) {
  return <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor"
    strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4.5 3H3v4.8a5 5 0 0 0 10 0V3h-1.5M8 13v2.8a5.2 5.2 0 0 0 10.4 0V14"/>
    <path d="M5.2 2.4v1.4m5.6-1.4v1.4"/><circle cx="18.4" cy="11.5" r="2.5"/>
  </svg>;
}

export function Quiz({question,helpUsed,onHelp,onCorrect,onClose,onContinue,creditCount,continueLabel,unlockText,position,missionTotal,celebrating}:{
  question:Question;
  helpUsed:number;
  onHelp:(level:number)=>void;
  onCorrect:()=>void;
  onClose:()=>void;
  onContinue:()=>void;
  celebrating:boolean;
  creditCount:number;
  continueLabel:string;
  unlockText:string;
  position:number;
  missionTotal:number;
}) {
  const heading=useRef<HTMLHeadingElement>(null);
  const [correctionOpen,setCorrectionOpen]=useState(false);
  const [alternative,setAlternative]=useState(helpUsed===3);
  const [picked,setPicked]=useState<number[]>([]);
  const [hints,setHints]=useState(Math.min(2,helpUsed));
  const [failures,setFailures]=useState(0);
  const [feedback,setFeedback]=useState<'wrong'|'explain'|'success'|null>(null);
  const current=alternative?question.alternative:question;
  const options=alternative?['Vrai','Faux']:question.options;
  const seed=questions.indexOf(question);
  const order=options.map((_,i)=>options.length===5?(i*(seed%4+1)+seed+2)%5:i);
  const count=current.answer.length;
  const isQcm=!alternative&&question.kind==='qcm';

  useEffect(()=>{heading.current?.focus({preventScroll:true});},[]);

  function toggle(index:number) {
    if(feedback==='success'||feedback==='explain') return;
    setFeedback(null);
    setPicked(previous=>count===1?[index]:previous.includes(index)?previous.filter(i=>i!==index):
      previous.length<count?[...previous,index]:previous);
  }
  function reveal() {
    const level=hints+1;
    setHints(level);
    onHelp(Math.max(helpUsed,level));
  }
  function validate() {
    if(picked.length!==count||feedback==='success'||feedback==='explain') return;
    if(current.answer.every(answer=>picked.includes(answer))) {
      setFeedback('success');
      onCorrect();
    } else {
      setFailures(failures+1);
      setPicked([]);
      if(failures>=2) {
        onHelp(3);
        setFeedback('explain');
        setCorrectionOpen(true);
      } else setFeedback('wrong');
    }
  }
  function retry() {
    setAlternative(value=>!value);
    setCorrectionOpen(false);
    setFeedback(null);
    setPicked([]);
    setFailures(0);
  }

  function requestCorrection() {
    if(feedback==='success') {
      setCorrectionOpen(value=>!value);
      return;
    }
    onHelp(3);
    setFeedback('explain');
    setCorrectionOpen(true);
  }

  return <section className="quiz-dialog quiz-panel" aria-labelledby="quiz-title">
    <div className="dialog-head">
      <div className="eyebrow">Mission {question.mission} sur {missions.length} · Défi {position} sur {missionTotal}</div>
      <button className="icon-button" aria-label="Fermer le quiz" onClick={onClose}><span aria-hidden="true">×</span></button>
    </div>
    <h2 id="quiz-title" ref={heading} tabIndex={-1}>{current.prompt}</h2>
    <p className="quiz-count">{isQcm?'QCM':'Vrai ou faux'} · {count===1?'1 réponse attendue':`${count} réponses attendues`}</p>
    <form onSubmit={event=>{event.preventDefault();validate();}}>
      <fieldset disabled={feedback==='success'||feedback==='explain'} aria-label="Propositions">
        {order.map((index,i)=><label key={index} className={correctionOpen?(current.answer.includes(index)?'answer-true':'answer-false'):picked.includes(index)?'chosen':''}>
          <input name="answer" type={count===1?'radio':'checkbox'} checked={picked.includes(index)}
            disabled={count>1&&picked.length===count&&!picked.includes(index)} onChange={()=>toggle(index)}/>
          {isQcm&&<strong>{String.fromCharCode(65+i)}</strong>}<span>{options[index]}</span>{correctionOpen&&<b className="verdict">{current.answer.includes(index)?'Exact':'Faux'}</b>}
        </label>)}
      </fieldset>
      {feedback==='success'&&<div className="quiz-reward" role="status">
        <Stethoscope size={28}/>
        <div><strong>+1 stéthoscope gagné !</strong><p>{unlockText}</p><small>{creditCount} / {questions.length} au total</small></div>
      </div>}
      {feedback!=='explain'&&<div className="correction-tools">
        {feedback!=='success'&&hints<2&&<button className="control" type="button" onClick={reveal}>Indice {hints+1}</button>}
        <button className="control" type="button" aria-expanded={correctionOpen} onClick={requestCorrection}>
          {correctionOpen?'Masquer le corrigé':'Afficher le corrigé'}
        </button>
      </div>}
      {feedback!=='success'&&feedback!=='explain'&&<div className="quiz-support">
        {hints>0&&<ol>{question.hints.slice(0,hints).map(hint=><li key={hint}>{hint}</li>)}</ol>}
        {feedback==='wrong'&&<p role="status">Réessayez. Vous pouvez utiliser les indices sans perdre de stéthoscope.</p>}
        <small>Le stéthoscope se gagne ensuite avec un défi équivalent.</small>
      </div>}
      {correctionOpen&&<section className="quiz-feedback" aria-label="Corrigé détaillé">
        <strong>Corrigé détaillé</strong>
        {isQcm?<ol className="rationales">{order.map((answer,i)=><li key={answer}>
          <strong>{String.fromCharCode(65+i)}. {current.answer.includes(answer)?'Exact':'Faux'}</strong>
          <span>{question.rationales[answer]}</span>
        </li>)}</ol>:<p><strong>{options[current.answer[0]]}.</strong> {question.explanation}</p>}
      </section>}
      {feedback==='success'?<button className="primary" type="button" onClick={onContinue} disabled={celebrating}>{continueLabel}</button>:
        feedback==='explain'?<button className="primary" type="button" onClick={retry}>Relever un défi équivalent</button>:
        <button className="primary" type="submit" disabled={picked.length!==count}>Valider ma réponse</button>}
    </form>
  </section>;
}

export function Results({progress,onClose}:{progress:Progress;onClose:()=>void}) {
  const modal=useRef<HTMLDialogElement>(null);
  useEffect(()=>{modal.current?.showModal();},[]);
  const results=Object.values(progress.solved);
  return <dialog ref={modal} className="quiz-dialog" aria-labelledby="results-title" onCancel={event=>{event.preventDefault();onClose();}}>
    <div className="dialog-head"><h2 id="results-title">Bilan</h2><button className="icon-button" onClick={onClose} aria-label="Fermer le bilan">×</button></div>
    <div className="score-grid">
      <div><strong>{results.length}/{questions.length}</strong><span>Stéthoscopes</span></div>
      <div><strong>{results.filter(v=>v==='spontanée').length}</strong><span>Spontanées</span></div>
      <div><strong>{results.filter(v=>v==='avec aide').length}</strong><span>Avec aide</span></div>
    </div>
    <ol className="result-list">
      {missions.map((title,i)=>{
        const group=questions.filter(q=>q.mission===i+1);
        const done=group.filter(q=>progress.solved[q.id]).length;
        return <li key={title}><span>{title}</span><strong>{done}/{group.length}</strong></li>;
      })}
    </ol>
    <button type="button" className="primary" onClick={onClose}>Continuer</button>
  </dialog>;
}
