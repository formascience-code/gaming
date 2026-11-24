type Reaction = { from: string; to: string; enzyme: string; note: string };

const reactions: Record<string, Reaction> = {
  'gly-lieu': { from: 'Glucose · 6 C', to: '2 pyruvates · 3 C chacun', enzyme: '10 réactions', note: 'Phase d’investissement puis phase de rendement' },
  'gly-bilan': { from: 'Glucose + NAD⁺', to: 'Pyruvate + NADH,H⁺', enzyme: 'Glycolyse', note: '2 ATP investis · 4 ATP formés' },
  'gly-pfk': { from: 'Fructose-6-P + ATP', to: 'Fructose-1,6-bisP + ADP', enzyme: 'Enzyme à identifier', note: 'Transfert du phosphate terminal de l’ATP' },
  'gly-regulation': { from: 'Fructose-6-P + ATP', to: 'Fructose-1,6-bisP + ADP', enzyme: 'PFK1', note: 'L’ATP peut se fixer sur le site catalytique ou sur un site régulateur' },
  'lac-nad': { from: 'Pyruvate', to: 'Lactate', enzyme: 'Lactate déshydrogénase', note: 'Au cours de la réaction, le coenzyme cède ses électrons' },
  'lac-bilan': { from: 'Glucose', to: '2 pyruvates → 2 lactates', enzyme: 'Glycolyse', note: 'La réduction du pyruvate régénère le NAD⁺' },
  'pdh-bilan': { from: 'Pyruvate + CoA-SH + NAD⁺', to: 'Acétyl-CoA', enzyme: 'Complexe PDH', note: 'Le groupement acétyle conserve deux des trois carbones du pyruvate' },
  'krebs-entree': { from: 'Acétyl-CoA (2 C) + ? (4 C)', to: 'Citrate (6 C) + CoA-SH', enzyme: 'Citrate synthase', note: 'Le composé à identifier est régénéré en fin de cycle' },
  'krebs-bilan': { from: 'Acétyl-CoA + oxaloacétate', to: 'Citrate → … → malate', enzyme: 'Cycle de Krebs', note: 'Le malate est oxydé en oxaloacétate, qui peut entrer dans un nouveau tour' },
  'krebs-regulation': { from: 'Isocitrate + NAD⁺', to: 'α-cétoglutarate + CO₂ + NADH,H⁺', enzyme: 'Isocitrate déshydrogénase', note: 'L’ATP et l’ADP renseignent sur l’état énergétique mitochondrial' },
};

const membraneIds = ['pdh-transport', 'krebs-compartiment', 'chaine-atp', 'chaine-navette', 'chaine-lieu', 'chaine-oxygene'];

const shape = 'M-28 1C-31-9-22-18-11-17C-3-16 1-22 10-17C17-13 27-16 30-6C34 4 26 14 15 15C6 14 0 22-10 18C-18 15-26 14-28 1Z';

function Protein({ color = '#706188' }: { color?: string }) {
  return <path d={shape} fill={color} stroke="#392d49" strokeWidth="2"/>;
}

const complexes = [
  { label: 'I', x: -42, y: 7, angle: 8, color: '#8fa589' },
  { label: 'II', x: -23, y: 19, angle: 5, color: '#c2a05a' },
  { label: 'III', x: -7, y: 14, angle: 22, color: '#a58cb1' },
  { label: 'IV', x: 18, y: 7, angle: 16, color: '#bd7b75' },
];

export function MembraneProteins({ id }: { id: string }) {
  if (!membraneIds.includes(id)) return null;
  const shown = id === 'chaine-lieu' ? complexes : id === 'chaine-oxygene' ? complexes.slice(3) :
    id === 'krebs-compartiment' ? complexes.slice(1, 2) : [];
  const transporter = id === 'pdh-transport';
  const synthase = id === 'chaine-atp';
  const navette = id === 'chaine-navette';
  return <g transform="translate(274 242) rotate(-31)" aria-hidden="true">
    {shown.map(({label, x, y, angle, color}) => <g key={label} transform={`translate(${x} ${y}) rotate(${angle})`}>
      <g transform="rotate(90) scale(.22 .16)"><Protein color={color}/></g>
      <text transform={`rotate(${31 - angle})`} textAnchor="middle" y="1.1" fontSize="3.6" fontWeight="700" fill="#202b31">{label}</text>
    </g>)}
    {transporter && <g transform="translate(-7 14) rotate(18)">
      <g transform="rotate(90) scale(.27 .23)"><Protein color="#8fa589"/></g>
      <path d="M9 0H-9m3-2-3 2 3 2" stroke="#392d49" strokeWidth=".9" fill="none"/>
    </g>}
    {synthase && <g transform="translate(18 7) rotate(16)">
      <g transform="rotate(90) scale(.17)"><Protein color="#a58cb1"/></g>
      <path d="M2 0H8" stroke="#533962" strokeWidth="2"/>
      <g transform="translate(11 0) scale(.19)"><Protein color="#a58cb1"/></g>
      <path d="M-10 0H-4m-2-1.4 2 1.4-2 1.4" stroke="#392d49" strokeWidth=".85" fill="none"/>
    </g>}
    {navette && <g transform="translate(-7 14) rotate(18)">
      <g transform="rotate(90) scale(.22 .17)"><Protein color="#8fa589"/></g>
      <g transform="translate(-10 -5) scale(.14)"><Protein color="#a58cb1"/></g>
      <g transform="translate(10 5) scale(.14)"><Protein color="#c2a05a"/></g>
    </g>}
  </g>;
}

const captions: Record<string, [string, string]> = {
  'pdh-transport': ['Transporteur du pyruvate', 'Pyruvate + H⁺ · vers la matrice'],
  'krebs-compartiment': ['Succinate déshydrogénase', 'Succinate → fumarate · côté matriciel'],
  'chaine-atp': ['ATP synthase', 'Le flux de H⁺ entraîne la formation d’ATP'],
  'chaine-navette': ['Navettes du NADH cytosolique', 'Les équivalents réducteurs sont relayés jusqu’à la chaîne'],
  'chaine-lieu': ['Complexes I, II, III et IV', 'NADH,H⁺ et succinate alimentent la chaîne en électrons'],
  'chaine-oxygene': ['Complexe IV', 'Cytochrome c réduit → complexe IV → O₂'],
};

export function MetabolismVisual({ id }: { id: string }) {
  const reaction = reactions[id];
  const caption = captions[id];
  const balance = !reaction && !caption;
  return <g textAnchor="middle" fill="#2b3742" fontWeight="600" stroke="#fff6ec" strokeWidth="6"
    strokeLinejoin="round" paintOrder="stroke" pointerEvents="none" aria-hidden="true">
    {reaction && <>
      <text x="410" y="230" fontSize="25">{reaction.from}</text>
      <path d="M410 266v185m-13-18 13 18 13-18" stroke="#523a60" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
      <g transform="translate(625 345) scale(1.45)"><Protein/></g>
      <text x="625" y="403" fontSize="21">{reaction.enzyme}</text>
      <text x="410" y="508" fontSize="25">{reaction.to}</text>
      {id === 'krebs-bilan' && <path d="M260 488C125 460 125 281 260 246m-16-4 16 4-12 12" stroke="#523a60" strokeWidth="3" fill="none"/>}
      <text x="500" y="593" fontSize="19" fontWeight="500">{reaction.note}</text>
    </>}
    {caption && <>
      <text x="500" y="547" fontSize="26">{caption[0]}</text>
      <text x="500" y="583" fontSize="19">{caption[1]}</text>
    </>}
    {balance && <>
      <text x="500" y="478" fontSize="25">Du glucose à l’ATP</text>
      <text x="500" y="525" fontSize="21">Glycolyse → Complexe PDH → Cycle de Krebs → Chaîne respiratoire</text>
      <text x="500" y="566" fontSize="19">{id === 'bilan-substrat' ? 'Suivre les ATP et GTP formés directement' :
        id === 'bilan-coenzymes' ? 'Additionner les coenzymes réduits des trois premières étapes' :
        'Comparer les contributions des navettes du NADH cytosolique'}</text>
    </>}
  </g>;
}
