import type { CSSProperties, ReactNode } from 'react';
import type { Progress } from '../quiz';
import styles from './visual.module.css';

const locations = [
  { x: 115, y: 616, label: 'Muscle du bras' },
  { x: 718, y: 759, label: 'Appareil digestif' },
  { x: 357, y: 449, label: 'Poumons et sang' },
  { x: 755, y: 950, label: 'Reins' },
  { x: 969, y: 524, label: 'Vaisseaux du bras' },
];

export function siteLabel(mission: number) {
  return locations[mission - 1].label;
}

export function Anatomy({ mission, zooming, onEnter }: { mission: number; zooming: boolean; onEnter: () => void }) {
  const point = locations[mission - 1];
  const scale = mission === 2 ? 2.2 : 3.3;
  return <svg className={styles.canvas} viewBox="0 0 1103 1426" role="group" aria-label="Planche anatomique, vue de face">
    <g className={zooming ? styles.cameraZoom : undefined} style={{
      '--zoom-x': `${551.5 - point.x * scale}px`,
      '--zoom-y': `${713 - point.y * scale}px`,
      '--zoom-scale': scale,
      '--zoom-duration': mission === 2 ? '1.35s' : '.65s',
    } as CSSProperties}>
    <image href="/acido/torse-trait.webp" width="1103" height="1426"/>
    <g className={styles.hotspot} transform={`translate(${point.x} ${point.y})`}
      role="button" tabIndex={0} aria-disabled={zooming} aria-label={`Explorer : ${point.label}`} onClick={onEnter}
      onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onEnter(); } }}>
      <circle r="23" fill="#fff5d9" stroke="#956f39" strokeWidth="2"/>
      <circle r="11" fill="#3d2248"/>
      <path d="M-6 0H6M0 -6V6" stroke="#fff8eb" strokeWidth="2"/>
    </g>
    </g>
  </svg>;
}

function Frame({ children, label, height = 540 }: { children: ReactNode; label: string; height?: number }) {
  return <svg className={styles.canvas} viewBox={`0 0 720 ${height}`} role="img" aria-label={label}>
    <defs><marker id="acid-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#536b68"/></marker></defs>
    {children}
  </svg>;
}
function Arrow({ path }: { path: string }) {
  return <path d={path} fill="none" stroke="#536b68" strokeWidth="3" markerEnd="url(#acid-arrow)"/>;
}
function Label({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return <text x={x} y={y} textAnchor="middle" className={styles.label}>{children}</text>;
}

function Digestive({ pancreas }: { pancreas: boolean }) {
  return <Frame label={pancreas ? 'Cellule canalaire du pancréas et sécrétion de bicarbonates' : 'Cellule pariétale de l’estomac et sécrétion acide'}>
    <rect x="35" y="100" width="170" height="360" rx="24" fill="#e9eeef"/>
    <rect x="515" y="100" width="170" height="360" rx="24" fill="#f5e7d9"/>
    <path d="M218 99 Q359 83 501 99 Q515 101 515 115 V444 Q515 458 501 460 Q359 475 218 460 Q204 458 204 444 V115 Q204 101 218 99Z" fill="#efd9d7" stroke="#af7877" strokeWidth="4"/>
    <ellipse cx="337" cy="386" rx="42" ry="29" fill="#c6a1b8" stroke="#9d7496" strokeWidth="2"/>
    <Label x={120} y={81}>Interstitium</Label><Label x={600} y={81}>{pancreas ? 'Lumière du canal' : 'Lumière gastrique'}</Label>
    <Label x={363} y={153}>{pancreas ? 'Cellule canalaire' : 'Cellule pariétale'}</Label>
    <Label x={205} y={496}>Pôle basolatéral</Label><Label x={515} y={496}>Pôle apical</Label>
    <rect x="187" y="212" width="34" height="67" rx="12" fill="#8bbeb9" stroke="#567d79" strokeWidth="2"/>
    <rect x="497" y="212" width="36" height="67" rx="12" fill="#d7938c" stroke="#965951" strokeWidth="2"/>
    {pancreas ? <>
      <Arrow path="M106 238H286"/><Label x={119} y={224}>Na⁺ + HCO₃⁻</Label>
      <Arrow path="M449 234H622"/><Label x={611} y={221}>HCO₃⁻</Label>
      <Arrow path="M622 260H449"/><Label x={618} y={288}>Cl⁻</Label>
      <Label x={515} y={316}>Échangeur Cl⁻/HCO₃⁻</Label>
      <rect x="497" y="346" width="36" height="33" rx="7" fill="#a5bece" stroke="#617888" strokeWidth="2"/>
      <Arrow path="M444 363H620"/><Label x={611} y={351}>Cl⁻</Label><Label x={518} y={414}>CFTR</Label>
    </> : <>
      <Arrow path="M270 235H109"/><Label x={121} y={222}>HCO₃⁻</Label>
      <Arrow path="M109 258H270"/><Label x={121} y={285}>Cl⁻</Label>
      <Arrow path="M447 234H619"/><Label x={605} y={221}>H⁺</Label>
      <Arrow path="M619 260H447"/><Label x={608} y={286}>K⁺</Label>
      <Label x={519} y={316}>H⁺/K⁺-ATPase</Label>
      <rect x="498" y="359" width="35" height="29" rx="7" fill="#ad9abf" stroke="#7d658e" strokeWidth="2"/>
      <Arrow path="M447 373H619"/><Label x={609} y={359}>Cl⁻</Label>
    </>}
  </Frame>;
}

function Blood({ lung, buffer }: { lung: boolean; buffer: boolean }) {
  return <Frame label={lung ? 'Diffusion du CO₂ du capillaire vers l’alvéole' : 'Échanges de l’hématie dans un capillaire tissulaire'}>
    {lung ? <>
      <path d="M282 60V128 C218 120 165 153 173 222 C181 296 258 321 361 301 C475 320 548 276 546 210 C544 146 488 121 438 128 V60" fill="#dbede7" stroke="#649491" strokeWidth="5"/>
      <path d="M93 283 Q168 289 183 317 Q239 355 360 333 Q485 356 538 317 Q566 285 630 288 L634 410 Q567 409 542 426 Q469 452 360 437 Q238 458 169 417 Q139 405 93 406Z" fill="#efd6d3" stroke="#b57977" strokeWidth="4"/>
      <Label x={361} y={207}>Air alvéolaire</Label>
      <Label x={360} y={481}>Capillaire pulmonaire</Label>
      <Arrow path="M290 398V244"/><Arrow path="M440 398V244"/>
      <Label x={259} y={283}>CO₂</Label><Label x={469} y={283}>CO₂</Label>
      <Arrow path="M360 161V76"/><Label x={360} y={57}>Expiration</Label>
    </> : <>
      <defs>
        <marker id="blood-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto">
          <path d="M1 1L9 5L1 9" fill="none" stroke="#79544f" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
      </defs>
      <rect x="124" y="24" width="104" height="46" rx="14" fill="#efd5c0" stroke="#c69b81"/>
      <text x="176" y="55" textAnchor="middle" fill="#683c36" fontSize="27" fontWeight="700">CO₂</text>
      <text x="176" y="91" textAnchor="middle" fill="#654c47" fontSize="13">Produit par les tissus</text>
      <path d="M36 126H678V325H36Z" fill="#fae4e0"/>
      <path d="M36 126H678 M36 325H678" fill="none" stroke="#c38c87" strokeWidth="2.5"/>
      <path d="M36 132H678 M36 319H678" fill="none" stroke="#e0ada7" strokeWidth="1.1"/>
      <ellipse cx="678" cy="225.5" rx="13" ry="99.5" fill="#f7d8d4" stroke="#c38c87" strokeWidth="2.5"/>
      <ellipse cx="678" cy="225.5" rx="8" ry="93.5" fill="#fae4e0" stroke="#e0ada7" strokeWidth="1"/>
      <text x="480" y="151" fill="#654c47" fontSize="14">Capillaire tissulaire · plasma</text>

      <ellipse cx="248" cy="246" rx="132" ry="59" fill="#bd6966" stroke="#995350" strokeWidth="2.6"/>
      <ellipse cx="248" cy="235" rx="131" ry="53" fill="#db8f89" stroke="#995350" strokeWidth="1.4"/>
      <ellipse cx="248" cy="232" rx="47" ry="16" fill="#ebb0a8"/>
      <text x="35" y="276" fill="#654c47" fontSize="14">Hématie</text>
      <path d="M97 271L126 257" fill="none" stroke="#996761" strokeWidth="1.4"/>
      <path d="M176 101V197" fill="none" stroke="#79544f" strokeWidth="1.6" markerEnd="url(#blood-arrow)"/>
      <text x="188" y="117" fill="#654c47" fontSize="13">Diffusion vers l’hématie</text>

      <path d="M343 216H531" fill="none" stroke="#79544f" strokeWidth="1.6" markerEnd="url(#blood-arrow)"/>
      <Label x={558} y={221}>HCO₃⁻</Label>
      <path d="M531 260H351" fill="none" stroke="#79544f" strokeWidth="1.6" markerEnd="url(#blood-arrow)"/>
      <Label x={556} y={266}>Cl⁻</Label>
      <text x="473" y="294" textAnchor="middle" fill="#654c47" fontSize="13">Échangeur AE1</text>

      <text x="360" y="377" textAnchor="middle" fill="#654c47" fontWeight="600" fontSize="14">Réactions dans l’hématie</text>
      <rect x="30" y="393" width="378" height="100" rx="15" fill="#fff9ef" stroke="#d8b8a8"/>
      <rect x="425" y="393" width="265" height="100" rx="15" fill={buffer ? "#f5e1e8" : "#fff9ef"} stroke={buffer ? "#b48698" : "#d8b8a8"}/>
      <text x="219" y="423" textAnchor="middle" fill="#654c47" fontSize="14">Formation de bicarbonate</text>
      <Label x={219} y={453}>CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻</Label>
      <text x="219" y="476" textAnchor="middle" fill="#654c47" fontSize="12">Hydratation du CO₂ catalysée par l’anhydrase carbonique</text>
      <text x="557" y="423" textAnchor="middle" fill="#654c47" fontSize="14">Tampon hémoglobine</text>
      <Label x={557} y={453}>Hb + H⁺ ⇌ HHb</Label>
      <text x="557" y="476" textAnchor="middle" fill="#654c47" fontSize="12">Fixation réversible des H⁺</text>
      <text x="360" y="519" textAnchor="middle" fill="#654c47" fontSize="13">Le plasma transporte le bicarbonate vers les poumons.</text>
    </>}
  </Frame>;
}

function Kidney({ mode }: { mode: 'nephron' | 'proximal' | 'urine' }) {
  return <Frame label={mode === 'nephron' ? 'Corpuscule rénal et trajet du filtrat' : 'Échanges entre sang, cellule tubulaire et lumière'}>
    {mode === 'nephron' ? <>
      <rect x="39" y="76" width="642" height="233" rx="25" fill="#efe0da"/>
      <rect x="39" y="310" width="642" height="165" rx="25" fill="#e4eae5"/>
      <Label x={110} y={110}>Cortex</Label><Label x={124} y={458}>Médullaire</Label>
      <circle cx="205" cy="213" r="63" fill="#f9efdd" stroke="#a87f55" strokeWidth="5"/>
      <path d="M78 191H166 C185 126 248 177 219 223 C197 258 149 220 176 192 C207 169 233 198 198 231 M170 229L91 244" fill="none" stroke="#ae625e" strokeWidth="8" strokeLinecap="round"/>
      <path d="M265 214 C287 166 345 168 333 210 C322 243 278 246 321 269 L345 299 V420 Q346 453 376 453 Q407 452 408 420 V264 Q418 235 450 247 Q502 269 495 233 Q493 215 525 215 H579 V467" fill="none" stroke="#f9efd6" strokeWidth="19" strokeLinecap="round"/>
      <path d="M265 214 C287 166 345 168 333 210 C322 243 278 246 321 269 L345 299 V420 Q346 453 376 453 Q407 452 408 420 V264 Q418 235 450 247 Q502 269 495 233 Q493 215 525 215 H579 V467" fill="none" stroke="#b39161" strokeWidth="3" strokeLinecap="round"/>
      <Arrow path="M228 209H261"/><Label x={202} y={304}>Corpuscule rénal</Label>
      <Label x={357} y={147}>Tubule proximal</Label><Label x={502} y={173}>Tubule distal</Label>
      <Label x={375} y={492}>Anse de Henlé</Label><Label x={612} y={361}>Collecteur</Label>
    </> : <>
      <rect x="40" y="105" width="155" height="345" rx="20" fill="#e4ede7"/>
      <rect x="192" y="105" width="300" height="345" rx="20" fill="#eedbd8" stroke="#ae827e" strokeWidth="3"/>
      <rect x="494" y="105" width="185" height="345" rx="20" fill="#f5e8cc"/>
      <Label x={116} y={78}>Vers le sang</Label>
      <Label x={345} y={78}>{mode === 'proximal' ? 'Cellule du tubule proximal' : 'Cellule tubulaire'}</Label>
      <Label x={589} y={78}>Lumière du tubule</Label>
      <Label x={342} y={275}>CO₂ + H₂O ⇌ H⁺ + HCO₃⁻</Label>
      <Arrow path="M251 326H98"/><Label x={116} y={310}>HCO₃⁻</Label>
      <Arrow path="M441 201H598"/><Label x={574} y={186}>H⁺</Label>
      {mode === 'proximal' ? <>
        <Label x={582} y={311}>H⁺ + HCO₃⁻</Label>
        <Arrow path="M583 324V355"/><Label x={584} y={385}>CO₂ + H₂O</Label>
        <Arrow path="M548 368H425"/><Label x={468} y={407}>CO₂</Label>
      </> : <>
        <Label x={587} y={285}>HPO₄²⁻ + H⁺</Label><Label x={587} y={320}>↓</Label><Label x={587} y={355}>H₂PO₄⁻</Label>
        <Label x={587} y={410}>NH₄⁺ excrété</Label>
      </>}
    </>}
  </Frame>;
}

const px = (ph: number) => 110 + (ph - 7.1) * 1000;
const py = (bicarbonate: number) => 455 - (bicarbonate - 8) * 10;
const choices = [
  { ph: 7.32, bicarbonate: 16 },
  { ph: 7.32, bicarbonate: 24 },
  { ph: 7.48, bicarbonate: 16 },
];

export function Davenport({ selected, onSelect, respiratory }: { selected: number | null; onSelect: (index: number) => void; respiratory: boolean }) {
  const points = respiratory ? [
    { ph: 7.29, bicarbonate: 18.6 },
    { ph: 7.35, bicarbonate: 32 },
    { ph: 7.20, bicarbonate: 22.7 },
  ] : choices;
  return <div className={styles.graph}>
    <svg viewBox="0 0 710 530" role="img" aria-label="Diagramme de Davenport, pH en abscisse et bicarbonate en ordonnée">
      <defs><clipPath id="acid-plot"><rect x="110" y="95" width="500" height="360"/></clipPath></defs>
      <rect x="110" y="95" width="500" height="360" fill="#fffaf0"/>
      {[8, 16, 24, 32, 40].map(value => <g key={value}><path d={`M110 ${py(value)}H610`} stroke="#dbddd1"/><Label x={86} y={py(value) + 6}>{value}</Label></g>)}
      {[7.1, 7.2, 7.3, 7.4, 7.5, 7.6].map(value => <g key={value}><path d={`M${px(value)} 95V455`} stroke="#dbddd1"/><Label x={px(value)} y={485}>{value.toFixed(1).replace('.', ',')}</Label></g>)}
      <g clipPath="url(#acid-plot)">
        {[20, 32, 40, 60].map((pressure, index) => {
          const y = (ph: number) => py(.03 * pressure * 10 ** (ph - 6.1));
          const points = Array.from({ length: 51 }, (_, i) => `${px(7.1 + i / 100)},${y(7.1 + i / 100)}`).join(' ');
          const labelPh = [7.58, 7.54, 7.51, 7.36][index];
          return <g key={pressure}><polyline points={points} fill="none" stroke={pressure === 40 ? '#775585' : '#72978c'} strokeWidth="3"/><Label x={px(labelPh)} y={y(labelPh) - 8}>{pressure}</Label></g>;
        })}
      </g>
      <path d="M110 95V455H610" stroke="#415755" strokeWidth="2" fill="none"/>
      <Label x={185} y={70}>[HCO₃⁻] (mmol/L)</Label><Label x={520} y={70}>PaCO₂ (mmHg)</Label><Label x={365} y={516}>pH</Label>
      <circle cx={px(7.4)} cy={py(24)} r="6" fill="#3d2248"/><Label x={px(7.4) + 32} y={py(24) - 11}>Réf.</Label>
      {respiratory && <g>
        <circle cx={px(7.26)} cy={py(26)} r="13" fill="#eaddee" stroke="#775585" strokeWidth="2"/>
        <Label x={px(7.26)} y={py(26) + 6}>T</Label>
      </g>}
      {points.map(({ ph, bicarbonate }, index) => <g key={index} className={respiratory ? undefined : styles.hotspot} onClick={respiratory ? undefined : () => onSelect(index)}>
        <circle cx={px(ph)} cy={py(bicarbonate)} r="13" fill={!respiratory && selected === index ? index === 0 ? '#c8ddc2' : '#ecd0c9' : '#fff0d2'} stroke="#906b48" strokeWidth="2"/>
        <Label x={px(ph)} y={py(bicarbonate) + 6}>{'ABC'[index]}</Label>
      </g>)}
    </svg>
    {respiratory ? <div className={styles.graphActions}><strong>T · pH 7,26 · HCO₃⁻ 26 mmol/L · PaCO₂ 60 mmHg</strong></div> : <div className={styles.graphActions} aria-label="Placer le point">
      <strong>Bilan · pH 7,32 · HCO₃⁻ 16 mmol/L · PaCO₂ 32 mmHg</strong>
      {choices.map(({ ph, bicarbonate }, index) => <button key={index} type="button" className="control"
        aria-pressed={selected === index} aria-label={`Point ${'ABC'[index]} : pH ${ph.toFixed(2).replace('.', ',')}, ${bicarbonate} millimoles par litre`}
        onClick={() => onSelect(index)}>{'ABC'[index]}</button>)}
      <span role="status">{selected === null ? 'Repère le point correspondant au bilan.' : selected === 0 ? 'Point placé.' : 'Relis les deux axes.'}</span>
    </div>}
  </div>;
}

const cellTransporters = [
  { name: 'NHE', cargo: 'H⁺', description: 'Échangeur Na⁺/H⁺', fill: '#e9def0', border: '#aa8eb7' },
  { name: 'AE', cargo: 'HCO₃⁻', description: 'Échangeur Cl⁻/HCO₃⁻', fill: '#e0edf4', border: '#8caabe' },
  { name: 'MCT', cargo: 'Lactate⁻ + H⁺', description: 'Cotransporteur lactate/H⁺', fill: '#d9e5d3', border: '#90a08a' },
];

function Transporter({ fill, border }: { fill: string; border: string }) {
  return <g fill={fill} stroke={border} strokeWidth="1.6" strokeLinejoin="round">
    <path d="M-9 -18C-21 -28 -36 -19 -34 -8C-31 0 -32 8 -35 13C-37 23 -20 28 -10 19C-3 12 -11 6 -9 0C-7 -6 -3 -12 -9 -18Z"/>
    <path d="M10 -20C22 -26 35 -19 33 -8C30 1 31 8 35 15C38 24 20 28 11 19C4 12 10 7 9 1C7 -6 4 -14 10 -20Z"/>
  </g>;
}

function MuscleCell({ membrane, solved }: { membrane: boolean; solved: Progress['solved'] }) {
  return <Frame height={membrane ? 540 : 563} label={membrane ? 'Sorties membranaires de H⁺ par NHE, de HCO₃⁻ par AE et de lactate avec H⁺ par MCT' : 'Cellule : glycolyse, respiration et formation de lactate'}>
    <defs>
      <marker id="cell-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto">
        <path d="M0 0L10 5L0 10Z" fill="#59736c"/>
      </marker>
    </defs>
    {membrane ? <>
      <path d="M0 0H720V294H0Z" fill="#eef1e9"/>
      <path d="M0 294H101 M169 294H326 M394 294H551 M619 294H720 M0 308H101 M169 308H326 M394 308H551 M619 308H720" fill="none" stroke="#90a08a" strokeWidth="2"/>
      <Label x={360} y={84}>Cytosol</Label>
      {cellTransporters.map(({ name, cargo, description, fill, border }, index) => {
        const x = 135 + index * 225;
        return <g key={name}>
          <Label x={x} y={171}>{cargo}</Label>
          <g transform={`translate(${x} 301)`}><Transporter fill={fill} border={border}/></g>
          <path d={`M${x} 186V382`} fill="none" stroke="#59736c" strokeWidth="2" markerEnd="url(#cell-arrow)"/>
          <text x={x + 43} y="306" fill="#273b3c" fontSize="14" fontWeight="600">{name}</text>
          <Label x={x} y={410}>{cargo}</Label>
          <text x={x} y="442" textAnchor="middle" fill="#536b68" fontSize="13">{description}</text>
        </g>;
      })}
      <Label x={360} y={497}>Milieu extracellulaire</Label>
    </> : <>
      <path d="M99 37C175 16 531 16 612 38C679 56 700 113 699 223L697 382C696 455 653 494 575 495H144C62 493 22 456 21 382L20 206C20 114 37 54 99 37Z" fill="#f6f8f1" stroke="#94a28c" strokeWidth="2.3"/>
      <g transform="translate(0 -22)">
      <Label x={360} y={76}>Glucose</Label>
      {solved.glycolyse && <g className={styles.reveal}><Label x={421} y={104}>Glycolyse</Label></g>}
      <Label x={360} y={137}>Pyruvate</Label>
      <g fill="none" stroke="#59736c" strokeWidth="2" markerEnd="url(#cell-arrow)">
        <path d="M360 83V116"/>
      </g>
      <path d="M324 149L199 180" fill="none" stroke="#59736c" strokeWidth="2" markerEnd="url(#cell-arrow)"/>
      <text x="242" y="156" textAnchor="middle" fill="#536b68" fontSize="13">En aérobie</text>
      <rect x="45" y="193" width="298" height="196" rx="18" fill="#fcf6eb" stroke="#dbc3a5"/>
      <Label x={194} y={222}>Respiration cellulaire</Label>
      <g transform="translate(22 22) scale(.89)">
      <path d="M103 298 C96 275 119 254 153 254 C183 254 193 263 215 261 C247 258 274 270 277 296 C281 321 258 340 224 340 C197 340 184 332 158 334 C128 338 110 325 103 298Z" fill="#edaf98" stroke="#9d5651" strokeWidth="3"/>
      <path d="M113 297 C106 279 129 262 152 263 C173 263 183 269 203 270 C231 269 259 271 267 292 C273 311 253 330 225 331 C203 332 187 322 160 326 C136 330 119 316 113 297Z" fill="#f8dcc6" stroke="#ac6358" strokeWidth="2.5"/>
      <path d="M139 266 C139 275 150 277 150 287 S139 299 136 317 M163 265 C160 277 171 280 173 287 S172 302 165 325 M191 270 C186 281 198 284 198 292 S188 311 193 327 M217 271 C213 284 226 286 226 295 S216 310 220 330 M244 275 C237 284 244 289 249 295 S252 312 243 326" fill="none" stroke="#ac6358" strokeWidth="3.6" strokeLinecap="round"/>
      </g>
      <path d="M194 328V348" stroke="#59736c" strokeWidth="1.7" markerEnd="url(#cell-arrow)"/>
      {solved.co2 && <g className={styles.reveal}><Label x={194} y={365}>CO₂ + H₂O ⇌ H⁺ + HCO₃⁻</Label></g>}
      <path d="M396 149L521 180" fill="none" stroke="#59736c" strokeWidth="2" markerEnd="url(#cell-arrow)"/>
      <text x="481" y="156" textAnchor="middle" fill="#536b68" fontSize="13">En anaérobie</text>
      <rect x="377" y="193" width="298" height="180" rx="18" fill="#fbefed" stroke="#dbb8b1"/>
      <Label x={526} y={222}>Fermentation lactique</Label>
      {solved.lactate && <g className={styles.reveal}>
      <Label x={526} y={261}>Pyruvate + NADH + H⁺</Label>
      <path d="M526 270V307" stroke="#59736c" strokeWidth="2" markerEnd="url(#cell-arrow)"/>
      <text x="541" y="291" fill="#536b68" fontSize="12">LDH</text>
      <Label x={526} y={332}>Lactate⁻ + NAD⁺</Label>
      <rect x="409" y="407" width="234" height="34" rx="10" fill="#fbefed" stroke="#dbb8b1"/>
      <Label x={526} y={429}>Hydrolyse de l’ATP → H⁺</Label>
      </g>}
      <Label x={526} y={460}>Lactate⁻ + H⁺</Label>
      </g>
      {cellTransporters.map(({ name, cargo, fill, border }, index) => {
        const x = [143, 246, 526][index];
        return <g key={name}>
          <g transform={`translate(${x} 495) scale(.69)`}><Transporter fill={fill} border={border}/></g>
          <path d={`M${x} ${name === 'MCT' ? 447 : 373}V530`} fill="none" stroke="#59736c" strokeWidth="1.8" markerEnd="url(#cell-arrow)"/>
          <text x={x + 28} y="493" fill="#273b3c" fontSize="13" fontWeight="600">{name}</text>
          <Label x={x} y={548}>{cargo}</Label>
        </g>;
      })}
    </>}
  </Frame>;
}

export function Detail({ mission, id, membrane, solved }: { mission: number; id: string; membrane: boolean; solved: Progress['solved'] }) {
  switch (mission) {
    case 1: return <MuscleCell membrane={membrane} solved={solved}/>;
    case 2: return <Digestive pancreas={id === 'pancreas' || id === 'polarite'}/>;
    case 3: return <Blood lung={id === 'alveole' || id === 'ventilation'} buffer={id === 'hamburger'}/>;
    case 4: return <Kidney mode={id === 'filtration' ? 'nephron' : id === 'proximal' ? 'proximal' : 'urine'}/>;
    default: return null;
  }
}
