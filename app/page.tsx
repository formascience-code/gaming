'use client';

import { useEffect, useState } from 'react';
import { GameHeader } from './game-header';
import { getAttempts } from './game-progress';
import { loadProgress, questions, Stethoscope } from './quiz';
import styles from './games.module.css';

const units = [
  { id: 'UE2', title: 'Biochimie' },
  { id: 'UE5', title: 'Biologie cellulaire' },
] as const;

const games = [
  { unit: 'UE2', title: 'Synthèse des protéines', href: '/ue2-synthese-des-proteines' },
  { unit: 'UE2', title: 'Métabolisme' },
  { unit: 'UE5', title: 'La mitochondrie' },
  { unit: 'UE5', title: 'Le système endomembranaire' },
] as const;

function UnitEmblem({ unit }: { unit: 'UE2' | 'UE5' }) {
  return <svg className={styles.emblem} viewBox="0 0 112 78" aria-hidden="true">
    {unit === 'UE2' ? <g>
      <path d="M28 52 46 28 71 31 85 52 68 67 45 64Z M46 28 39 12 M71 31 89 15" fill="none" stroke="#896797" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
      <g fill="#684374"><circle cx="28" cy="52" r="5"/><circle cx="71" cy="31" r="6"/><circle cx="68" cy="67" r="4"/></g>
      <g fill="#fffaf2" stroke="#896797" strokeWidth="2"><circle cx="46" cy="28" r="6"/><circle cx="45" cy="64" r="4"/><circle cx="89" cy="15" r="5"/></g>
      <g fill="#c2a05a"><circle cx="39" cy="12" r="4"/><circle cx="85" cy="52" r="5"/></g>
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
  const [stats, setStats] = useState<{ score: number; attempts: number }>();
  useEffect(() => {
    function refreshStats() {
      const score = Object.keys(loadProgress().solved).length;
      setStats({ score, attempts: getAttempts(score > 0) });
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
    <GameHeader title="Jeux de révision">{null}</GameHeader>
    <main className={styles.library}>
      <section className={styles.intro} aria-labelledby="library-title">
        <h2 id="library-title">Choisis ton jeu</h2>
        <p>Choisis un défi et suis ta progression.</p>
      </section>
      <div className={styles.units}>
        {units.map(unit => {
          const unitGames = games.filter(game => game.unit === unit.id);
          const total = unitGames.reduce((sum, game) => sum + ('href' in game ? stats?.score ?? 0 : 0), 0);
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
                  const maximum = available ? questions.length : 20;
                  const score = available ? stats?.score ?? 0 : 0;
                  return <li key={game.title} className={available ? `${styles.card} ${styles.activeCard}` : styles.card}>
                    <div className={styles.content}>
                      <div className={styles.details}>
                        <span className={available ? `${styles.labels} ${styles.available}` : styles.labels}>{available ? 'Disponible' : 'À venir'}</span>
                        <h4>{game.title}</h4>
                        <p className={styles.attempts}>{available ? stats?.attempts ?? 0 : 0} {(available ? stats?.attempts : 0) === 1 ? 'tentative' : 'tentatives'}</p>
                      </div>
                      <div className={styles.score} aria-label={`${score} stéthoscopes gagnés sur ${maximum}`}>
                        <span><Stethoscope size={19}/><span>{score}<small>/{maximum}</small></span></span>
                      </div>
                      <progress className={styles.progress} value={score} max={maximum} aria-label={`Progression – ${game.title}`}/>
                    </div>
                    {available && <a className={styles.play} href={game.href}>
                      {stats?.attempts ? 'Reprendre' : 'Jouer'} <span className={styles.srOnly}>à {game.title}</span><span aria-hidden="true">→</span>
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
