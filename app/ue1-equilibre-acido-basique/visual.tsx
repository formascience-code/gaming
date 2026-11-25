import type { ReactNode } from 'react';
import styles from './visual.module.css';

const locations = [
  { x: 155, y: 568, label: 'Muscle du bras', crop: '61 400 331 360', plate: 'muscle' },
  { x: 486, y: 689, label: 'Appareil digestif', crop: '202 581 438 396', plate: 'atlas' },
  { x: 461, y: 514, label: 'Poumons et sang', crop: '212 355 373 326', plate: 'atlas' },
  { x: 473, y: 765, label: 'Reins', crop: '218 680 375 367', plate: 'reins' },
  { x: 570, y: 518, label: 'Gaz du sang', crop: '438 409 263 259', plate: 'atlas' },
];

export function siteLabel(mission: number) {
  return locations[mission - 1].label;
}

export function Anatomy({ mission, zoom, onEnter }: { mission: number; zoom: boolean; onEnter: () => void }) {
  const point = locations[mission - 1];
  const plate = zoom || mission === 4 ? point.plate : 'atlas';
  return <svg className={styles.canvas} viewBox={zoom ? point.crop : '0 0 810 1086'} role="group" aria-label={zoom ? `Planche anatomique : ${point.label}` : 'Planche anatomique, vue de face'}>
    <image href={`/acido/${plate}.webp`} width="810" height="1086"/>
    <g className={styles.hotspot} transform={`translate(${point.x} ${point.y})`}
      role="button" tabIndex={0} aria-label={`Explorer : ${point.label}`} onClick={onEnter}
      onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onEnter(); } }}>
      <circle r={zoom ? 15 : 23} fill="#fff5d9" stroke="#956f39" strokeWidth="2"/>
      <circle r={zoom ? 7 : 11} fill="#3d2248"/>
      <path d={zoom ? 'M-4 0H4M0 -4V4' : 'M-6 0H6M0 -6V6'} stroke="#fff8eb" strokeWidth="2"/>
    </g>
  </svg>;
}

function Frame({ children, label }: { children: ReactNode; label: string }) {
  return <svg className={styles.canvas} viewBox="0 0 720 540" role="img" aria-label={label}>
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
    <path d="M204 101 Q358 82 515 101 L515 458 Q359 476 204 458Z" fill="#efd9d7" stroke="#af7877" strokeWidth="4"/>
    <ellipse cx="337" cy="386" rx="42" ry="29" fill="#c6a1b8" stroke="#9d7496" strokeWidth="2"/>
    <path d="M515 112q-20 8 0 16 t0 16 t0 16 M515 355q-20 8 0 16 t0 16 t0 16" fill="none" stroke="#af7877" strokeWidth="3"/>
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

function Blood({ lung }: { lung: boolean }) {
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
      <path d="M32 115H688V446H32Z" fill="#e5eeeb"/>
      <path d="M34 109H687M34 448H687" stroke="#80a29b" strokeWidth="6"/>
      <ellipse cx="349" cy="285" rx="188" ry="136" fill="#edbab5" stroke="#a65d59" strokeWidth="4"/>
      <ellipse cx="349" cy="284" rx="123" ry="70" fill="#f7d6cf" stroke="#d3938c" strokeWidth="2"/>
      <Label x={365} y={61}>Tissu</Label><Label x={103} y={410}>Plasma</Label><Label x={355} y={233}>Hématie</Label>
      <Arrow path="M350 78V163"/><Label x={389} y={100}>CO₂</Label>
      <Label x={349} y={283}>CO₂ + H₂O ⇌ H⁺ + HCO₃⁻</Label>
      <Label x={349} y={330}>Hb + H⁺ ⇌ HHb</Label>
      <Arrow path="M483 250H634"/><Label x={613} y={230}>HCO₃⁻</Label>
      <Arrow path="M634 307H492"/><Label x={615} y={338}>Cl⁻</Label>
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

export function Davenport({ selected, onSelect }: { selected: number | null; onSelect: (index: number) => void }) {
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
      {choices.map(({ ph, bicarbonate }, index) => <g key={index} className={styles.hotspot} onClick={() => onSelect(index)}>
        <circle cx={px(ph)} cy={py(bicarbonate)} r="13" fill={selected === index ? index === 0 ? '#c8ddc2' : '#ecd0c9' : '#fff0d2'} stroke="#906b48" strokeWidth="2"/>
        <Label x={px(ph)} y={py(bicarbonate) + 6}>{'ABC'[index]}</Label>
      </g>)}
    </svg>
    <div className={styles.graphActions} aria-label="Placer le point">
      <strong>Bilan · pH 7,32 · HCO₃⁻ 16 mmol/L · PaCO₂ 32 mmHg</strong>
      {choices.map(({ ph, bicarbonate }, index) => <button key={index} type="button" className="control"
        aria-pressed={selected === index} aria-label={`Point ${'ABC'[index]} : pH ${ph.toFixed(2).replace('.', ',')}, ${bicarbonate} millimoles par litre`}
        onClick={() => onSelect(index)}>{'ABC'[index]}</button>)}
      <span role="status">{selected === null ? 'Repère le point correspondant au bilan.' : selected === 0 ? 'Point placé.' : 'Relis les deux axes.'}</span>
    </div>
  </div>;
}

function MuscleCell({ membrane }: { membrane: boolean }) {
  return <Frame label={membrane ? 'Cotransport du lactate et d’un proton à travers la membrane' : 'Glycolyse, respiration et formation de lactate dans une cellule musculaire'}>
    <rect x="36" y="62" width="648" height={membrane ? 278 : 365} rx="88" fill="#e9eee5" stroke="#899983" strokeWidth="5"/>
    {membrane ? <>
      <Label x={360} y={150}>Cytosol</Label>
      <Label x={360} y={235}>Lactate⁻ + H⁺</Label>
      <rect x="317" y="312" width="86" height="54" rx="18" fill="#b4cba8" stroke="#647c58" strokeWidth="3"/>
      <Arrow path="M360 253V413"/>
      <Label x={434} y={343}>MCT</Label>
      <Label x={360} y={443}>Lactate⁻ + H⁺</Label>
      <Label x={360} y={494}>Milieu extracellulaire</Label>
    </> : <>
      <Label x={360} y={115}>Glucose</Label>
      <Arrow path="M360 128V171"/><Label x={437} y={151}>Glycolyse</Label>
      <Label x={360} y={196}>Pyruvate</Label>
      <Arrow path="M334 205L196 251"/><Arrow path="M386 205L515 251"/>
      <path d="M115 279 C110 260 136 253 172 259 C208 265 229 251 254 267 C284 285 276 323 252 333 C222 347 201 328 170 333 C140 338 113 324 115 279Z" fill="#f5d4a7" stroke="#ab7546" strokeWidth="3"/>
      <path d="M130 281Q147 253 159 287T185 294T211 278T239 298L258 280" fill="none" stroke="#ab7546" strokeWidth="3"/>
      <Label x={193} y={313}>Mitochondrie</Label>
      <Arrow path="M192 339V367"/><Label x={193} y={395}>CO₂ + H₂O ⇌ H⁺ + HCO₃⁻</Label>
      <Label x={522} y={277}>Lactate déshydrogénase</Label>
      <Label x={507} y={311}>Pyruvate + NADH + H⁺</Label>
      <Arrow path="M514 320V341"/><Label x={511} y={363}>Lactate⁻ + NAD⁺</Label>
      <Label x={514} y={394}>Hydrolyse de l’ATP → H⁺</Label>
      <rect x="471" y="409" width="76" height="35" rx="12" fill="#b4cba8" stroke="#647c58" strokeWidth="2"/>
      <Label x={509} y={432}>MCT</Label>
      <Arrow path="M509 447V475"/><Label x={509} y={502}>Lactate⁻ + H⁺</Label>
    </>}
  </Frame>;
}

export function Detail({ mission, id, stepped }: { mission: number; id: string; stepped: boolean }) {
  switch (mission) {
    case 1: return <MuscleCell membrane={id === 'mct' && !stepped}/>;
    case 2: return <Digestive pancreas={id === 'pancreas' || id === 'polarite'}/>;
    case 3: return <Blood lung={id === 'alveole' || id === 'ventilation'}/>;
    case 4: return <Kidney mode={id === 'filtration' ? 'nephron' : id === 'proximal' ? 'proximal' : 'urine'}/>;
    default: return null;
  }
}
