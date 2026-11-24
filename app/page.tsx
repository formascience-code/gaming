'use client';

import { useEffect, useRef, useState } from 'react';
import { CellArt } from './atlas';
import { GameHeader } from './game-header';
import { getAttempts } from './game-progress';
import { loadProgress, questions, Stethoscope } from './quiz';
import styles from './games.module.css';

const units = [
  { id: 'UE1', title: 'Chimie' },
  { id: 'UE2', title: 'Biochimie' },
  { id: 'UE4', title: 'Anatomie' },
  { id: 'UE5', title: 'Biologie cellulaire' },
] as const;

const games = [
  { unit: 'UE2', title: 'Synthèse des protéines', summary: 'Du noyau au ribosome, suivez le trajet de l’information génétique.', crop: '115 80 810 560', color: 'protein', href: '/ue2-synthese-des-proteines' },
  { unit: 'UE2', title: 'Métabolisme', summary: 'Glycolyse dans le cytosol, cycle de Krebs dans la matrice et chaîne respiratoire dans la membrane interne des mitochondries.', crop: '125 135 460 321', color: 'metabolism' },
  { unit: 'UE5', title: 'La mitochondrie', summary: 'Explorez la double membrane, les crêtes et la matrice mitochondriale.', crop: '145 158 257 178', color: 'mitochondria' },
  { unit: 'UE5', title: 'Le système endomembranaire', summary: 'Suivez le trafic entre le réticulum endoplasmique, le Golgi et les vésicules.', crop: '419 188 453 314', color: 'endomembrane' },
] as const;

export default function GamingHome() {
  const nucleusRef = useRef<SVGCircleElement>(null);
  const cellRef = useRef<SVGPathElement>(null);
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
        <h2 id="library-title">Choisissez votre jeu</h2>
        <p>Explorez la cellule et révisez les mécanismes à votre rythme.</p>
      </section>
      <svg width="0" height="0" className={styles.atlas} aria-hidden="true">
        <defs><g id="catalogue-cell"><CellArt nucleusRef={nucleusRef} cellRef={cellRef}/></g></defs>
      </svg>
      <div className={styles.units}>
        {units.map(unit => {
          const unitGames = games.filter(game => game.unit === unit.id);
          const total = unitGames.reduce((sum, game) => sum + ('href' in game ? stats?.score ?? 0 : 0), 0);
          return <section key={unit.id} className={styles.unitBox} aria-labelledby={`unit-${unit.id}`}>
            <header className={styles.unitHeader}>
              <h3 id={`unit-${unit.id}`}><span className={styles.unit}>{unit.id}</span> {unit.title}</h3>
              <span className={styles.unitTotal}><Stethoscope size={18}/> {total} stéthoscope{total > 1 ? 's' : ''} au total</span>
            </header>
            {unitGames.length === 0 ? <p className={styles.empty}>Aucun jeu pour le moment.</p> :
              <div className={styles.cards}>
                {unitGames.map(game => {
                  const available = 'href' in game;
                  return <article key={game.title} className={styles.card}>
                    <div className={`${styles.art} ${styles[game.color]}`}>
                      <svg viewBox={game.crop} preserveAspectRatio="xMidYMid slice" aria-hidden="true"><use href="#catalogue-cell"/></svg>
                    </div>
                    <div className={styles.content}>
                      <span className={styles.labels}>{available ? 'Disponible' : 'À venir'}</span>
                      <h4>{game.title}</h4>
                      <p>{game.summary}</p>
                      <dl className={styles.stats}>
                        <div><dt><Stethoscope size={16}/> Stéthoscopes</dt><dd>{available ? stats?.score ?? '–' : 0} / {available ? questions.length : 20}</dd></div>
                        <div><dt>Tentatives</dt><dd>{available ? stats?.attempts ?? '–' : 0}</dd></div>
                      </dl>
                      {available && <a className={styles.play} href={game.href} aria-label={`Jouer à ${game.unit} – ${game.title}`}>{stats?.attempts ? 'Reprendre' : 'Jouer'} <span aria-hidden="true">→</span></a>}
                    </div>
                  </article>;
                })}
              </div>}
          </section>;
        })}
      </div>
      <p className={styles.storage}>Les statistiques sont enregistrées dans ce navigateur.</p>
    </main>
  </div>;
}
