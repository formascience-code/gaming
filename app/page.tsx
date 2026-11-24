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
        <p>Réussis les défis et gagne des stéthoscopes.</p>
      </section>
      <div className={styles.units}>
        {units.map(unit => {
          const unitGames = games.filter(game => game.unit === unit.id);
          const total = unitGames.reduce((sum, game) => sum + ('href' in game ? stats?.score ?? 0 : 0), 0);
          return <section key={unit.id} className={styles.unitBox} aria-labelledby={`unit-${unit.id}`}>
            <header className={styles.unitHeader}>
              <h3 id={`unit-${unit.id}`}><span className={styles.unit}>{unit.id}</span> {unit.title}</h3>
              <span className={styles.unitTotal}><Stethoscope size={24}/> <strong>{total}</strong> <span>stéthoscopes<br/>au total</span></span>
            </header>
            <ul className={styles.cards}>
                {unitGames.map(game => {
                  const available = 'href' in game;
                  const maximum = available ? questions.length : 20;
                  const score = available ? stats?.score ?? 0 : 0;
                  return <li key={game.title} className={available ? `${styles.card} ${styles.activeCard}` : styles.card}>
                    <div className={styles.content}>
                      <span className={available ? `${styles.labels} ${styles.available}` : styles.labels}>{available ? 'Disponible' : 'À venir'}</span>
                      <h4>{game.title}</h4>
                      <dl className={styles.stats}>
                        <div><dt>Stéthoscopes</dt><dd><Stethoscope size={24}/><strong>{score}</strong><span> / {maximum}</span></dd></div>
                        <div><dt>Tentatives</dt><dd>{available ? stats?.attempts ?? '–' : 0}</dd></div>
                      </dl>
                      <progress className={styles.progress} value={score} max={maximum} aria-label={`Progression – ${game.title}`}/>
                      {available && <a className={styles.play} href={game.href} aria-label={`Jouer à ${game.unit} – ${game.title}`}>{stats?.attempts ? 'Reprendre' : 'Jouer'} <span aria-hidden="true">→</span></a>}
                    </div>
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
