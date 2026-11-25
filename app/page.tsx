'use client';

import { useEffect, useState } from 'react';
import { GameHeader } from './game-header';
import { getAttempts } from './game-progress';
import { loadProgress, questions, Stethoscope } from './quiz';
import { readMetabolism } from './ue2-metabolisme/progress';
import { metabolismQuestions } from './ue2-metabolisme/questions';
import { acidQuestions, acidRoute, acidTitle } from './ue1-equilibre-acido-basique/questions';
import { readAcid } from './ue1-equilibre-acido-basique/progress';
import styles from './games.module.css';

const units = [
  { id: 'UE1', title: 'Chimie' },
  { id: 'UE2', title: 'Biochimie' },
  { id: 'UE5', title: 'Biologie cellulaire' },
] as const;

const games = [
  { unit: 'UE1', title: acidTitle, href: acidRoute },
  { unit: 'UE2', title: 'Synthèse des protéines', href: '/ue2-synthese-des-proteines' },
  { unit: 'UE2', title: 'Métabolisme', href: '/ue2-metabolisme' },
  { unit: 'UE5', title: 'La mitochondrie' },
  { unit: 'UE5', title: 'Le système endomembranaire' },
] as const;

function UnitEmblem({ unit }: { unit: 'UE1' | 'UE2' | 'UE5' }) {
  return <svg className={styles.emblem} viewBox="0 0 112 78" aria-hidden="true">
    {unit === 'UE1' ? <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M47 10H65 M50 11V36L32 61Q28 69 38 69H74Q84 69 80 61L62 36V11" stroke="#563562" strokeWidth="2.6"/>
      <path d="M39 53Q49 47 58 52T73 53L79 63Q81 68 74 68H38Q31 68 34 62Z" fill="#e2bd79" stroke="#a88650" strokeWidth="1.6"/>
      <circle cx="54" cy="43" r="2.5" fill="#a88650"/><circle cx="61" cy="59" r="2" fill="#563562"/>
    </g> : unit === 'UE2' ? <g transform="rotate(32 56 39)">
      <path d="M44 10H68 M41 16H71 M42 22H70 M46 28H66 M46 50H66 M42 56H70 M41 62H71 M44 68H68"
        fill="none" stroke="#a88650" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M66 6C76 18 71 29 56 39S36 60 46 72"
        fill="none" stroke="#aa8ab6" strokeWidth="2.8" strokeLinecap="round"/>
      <path d="M46 6C36 18 41 29 56 39S76 60 66 72"
        fill="none" stroke="#563562" strokeWidth="2.8" strokeLinecap="round"/>
    </g> : <g>
      <path d="M21 48C20 33 32 21 46 20C58 19 65 11 80 15C97 20 102 39 92 53C85 65 73 69 58 69C42 69 24 65 21 48Z" fill="#f5f8ee" stroke="#687e61" strokeWidth="2.4"/>
      <path d="M22 48C26 61 44 67 58 66C75 66 85 60 92 50" fill="none" stroke="#b1bfa6" strokeWidth="2"/>
      <ellipse cx="62" cy="41" rx="14" ry="12" fill="#b8c7ae" stroke="#788b70" strokeWidth="1.5"/>
      <circle cx="66" cy="39" r="4" fill="#fff8e9"/>
      <path d="M35 47q6-5 12 1m25 9q6-6 12-5" stroke="#b18a54" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <circle cx="42" cy="35" r="2.5" fill="#c2a05a"/><circle cx="82" cy="31" r="2" fill="#8da183"/>
    </g>}
  </svg>;
}

export default function GamingHome() {
  const [stats, setStats] = useState<Record<string, { score: number; attempts: number }>>({});
  useEffect(() => {
    function refreshStats() {
      const score = Object.keys(loadProgress().solved).length;
      const metabolism = readMetabolism();
      const acid = readAcid();
      setStats({
        [acidRoute]: { score: Object.keys(acid.progress.solved).length, attempts: acid.attempts },
        '/ue2-synthese-des-proteines': { score, attempts: getAttempts(score > 0) },
        '/ue2-metabolisme': { score: Object.keys(metabolism.progress.solved).length, attempts: metabolism.attempts },
      });
    }
    refreshStats();
    window.addEventListener('pageshow', refreshStats);
    window.addEventListener('storage', refreshStats);
    return () => {
      window.removeEventListener('pageshow', refreshStats);
      window.removeEventListener('storage', refreshStats);
    };
  }, []);

  return <div className="shell">
    <GameHeader/>
    <main className={styles.library}>
      <section className={styles.intro} aria-labelledby="library-title">
        <h1 id="library-title">Choisis ton jeu</h1>
        <p>Choisis un défi et suis ta progression.</p>
      </section>
      <div className={styles.units}>
        {units.map(unit => {
          const unitGames = games.filter(game => game.unit === unit.id);
          const total = unitGames.reduce((sum, game) => sum + ('href' in game ? stats[game.href]?.score ?? 0 : 0), 0);
          return <section key={unit.id} className={styles.unitBox} aria-labelledby={`unit-${unit.id}`}>
            <header className={styles.unitHeader}>
              <div className={styles.unitHeading}>
              <h3 id={`unit-${unit.id}`}><span className={styles.unit}>{unit.id}</span><span>{unit.title}</span></h3>
              <span className={styles.unitTotal}><Stethoscope size={24}/> <strong>{total}</strong> <span>stéthoscopes gagnés</span></span>
              </div>
              <UnitEmblem unit={unit.id}/>
            </header>
            <ul className={styles.cards}>
                {unitGames.map(game => {
                  const available = 'href' in game;
                  const maximum = game.unit === 'UE1' ? acidQuestions.length : available && game.href === '/ue2-synthese-des-proteines' ? questions.length : metabolismQuestions.length;
                  const attempts = available ? stats[game.href]?.attempts ?? 0 : 0;
                  const score = available ? stats[game.href]?.score ?? 0 : 0;
                  return <li key={game.title} className={styles.card}>
                    <div className={styles.content}>
                      <div className={styles.details}>
                        {!available && <span className={styles.labels}>À venir</span>}
                        <h4>{game.title}</h4>
                        <p className={styles.attempts}>{attempts} {attempts === 1 ? 'tentative' : 'tentatives'}</p>
                      </div>
                      <div className={styles.score} aria-label={`${score} stéthoscopes gagnés sur ${maximum}`}>
                        <span><Stethoscope size={19}/><span>{score}<small>/{maximum}</small></span></span>
                      </div>
                      <progress className={styles.progress} value={score} max={maximum} aria-label={`Progression – ${game.title}`}/>
                    </div>
                    {available && <a className={styles.play} href={game.href}>
                      {attempts ? 'Reprendre' : 'Jouer'} <span className={styles.srOnly}>à {game.title}</span><span aria-hidden="true">→</span>
                    </a>}
                  </li>;
                })}
              </ul>
          </section>;
        })}
      </div>
      <p className={styles.storage}>Les statistiques sont enregistrées dans ce navigateur.</p>
    </main>
  </div>;
}
