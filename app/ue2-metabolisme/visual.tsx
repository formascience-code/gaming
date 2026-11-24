type Reaction = {
  from: string;
  to: string;
  enzyme: string;
  action: readonly string[];
  input?: string;
  output?: string;
};

const pfkReaction = {
  from: 'Fructose-6-phosphate',
  to: 'Fructose-1,6-bisphosphate',
  input: 'ATP',
  output: 'ADP',
  action: ['Transfère le phosphate', 'terminal de l’ATP sur le sucre'],
};

const reactions: Record<string, Reaction> = {
  'gly-pfk': { ...pfkReaction, enzyme: 'À identifier' },
  'gly-regulation': { ...pfkReaction, enzyme: 'PFK1' },
  'lac-nad': {
    from: 'Pyruvate', to: 'Lactate', enzyme: 'Lactate déshydrogénase',
    input: 'NADH + H⁺', output: 'NAD⁺',
    action: ['Réduit le pyruvate', 'et régénère le NAD⁺'],
  },
  'lac-bilan': {
    from: '2 pyruvates', to: '2 lactates', enzyme: 'Lactate déshydrogénase',
    input: '2 NADH + 2 H⁺', output: '2 NAD⁺',
    action: ['Réduit les deux pyruvates', 'sans produire d’ATP'],
  },
  'pdh-bilan': {
    from: 'Pyruvate (3 C)', to: 'Acétyl-CoA (groupement acétyle à 2 C)', enzyme: 'Complexe PDH',
    input: 'CoA-SH + NAD⁺', output: 'CO₂ + NADH + H⁺',
    action: ['Décarboxyle et oxyde le pyruvate', 'puis transfère l’acétyle au CoA'],
  },
  'krebs-entree': {
    from: 'Acétyl-CoA + ? (4 C)', to: 'Citrate (6 C)', enzyme: 'Citrate synthase',
    input: 'H₂O', output: 'CoA-SH',
    action: ['Condense le groupement acétyle', 'avec le composé à identifier'],
  },
  'krebs-regulation': {
    from: 'Isocitrate (6 C)', to: 'α-cétoglutarate (5 C)', enzyme: 'Isocitrate déshydrogénase',
    input: 'NAD⁺', output: 'CO₂ + NADH + H⁺',
    action: ['Oxyde et décarboxyle', 'l’isocitrate'],
  },
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

function CarbonChain({ x, y, count, color }: { x: number; y: number; count: number; color: string }) {
  const first = x - (count - 1) * 13;
  return <g>
    <path d={`M${first} ${y}H${x + (count - 1) * 13}`} stroke={color} strokeWidth="3"/>
    {Array.from({ length: count }, (_, i) =>
      <circle key={i} cx={first + i * 26} cy={y} r="8.5" fill={color} stroke="#fffaf5" strokeWidth="2"/>)}
  </g>;
}

function GlycolysisOverview({ showEnergy }: { showEnergy: boolean }) {
  return <g textAnchor="middle" fill="#2b3742" fontWeight="500">
    <text x="500" y="190" fontSize="28" fontWeight="600">Glycolyse · 10 réactions</text>
    <rect x="384" y="222" width="232" height="103" rx="24" fill="#fffbf6" stroke="#9d819f" strokeWidth="2"/>
    <text x="500" y="259" fontSize="24">Glucose · 6 C</text>
    <CarbonChain x={500} y={296} count={6} color="#755582"/>
    <path d="M500 342v79m-12-14 12 14 12-14" stroke="#755582" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    {[374, 626].map(x => <g key={x}>
      <rect x={x - 111} y="442" width="222" height="104" rx="24" fill="#f2f4ec" stroke="#8d9a80" strokeWidth="2"/>
      <text x={x} y="478" fontSize="23">Pyruvate · 3 C</text>
      <CarbonChain x={x} y={516} count={3} color="#596c55"/>
    </g>)}
    <text x="500" y="588" fontSize="18" fill="#4d5056">
      {showEnergy ? '2 ATP investis · 4 ATP formés' : 'Les six carbones du glucose se répartissent entre deux pyruvates'}
    </text>
  </g>;
}

function moleculeWidth(text: string, fontSize: number) {
  return Math.max(76, text.length * fontSize * .59 + 30);
}

function Molecule({ x, y, text, accent = 'substrate', small = false }: {
  x: number; y: number; text: string; accent?: 'substrate' | 'product' | 'cofactor'; small?: boolean;
}) {
  const [fill, line] = accent === 'product' ? ['#f1f4ea', '#849476'] :
    accent === 'cofactor' ? ['#fff2d9', '#ae8b50'] : ['#fffbf7', '#9b80a1'];
  const fontSize = small ? 20 : 24;
  const width = moleculeWidth(text, fontSize);
  const height = small ? 42 : 56;
  return <g stroke="none">
    <rect x={x - width / 2} y={y - height / 2} width={width} height={height} rx={height / 2} fill={fill} stroke={line} strokeWidth="2"/>
    <text x={x} y={y} fontSize={fontSize} dominantBaseline="central" fontWeight="500">{text}</text>
  </g>;
}

function Nucleotide({ x, y, atp }: { x: number; y: number; atp: boolean }) {
  return <g transform={`translate(${x} ${y})`} stroke="none">
    {atp ? <path d="M-52 0l12-8-5-11 16 3 8-10 11 8 10-11 10 11 11-8 8 10 16-3-5 11 12 8-12 8 5 11-16-3-8 10-11-8-10 11-10-11-11 8-8-10-16 3 5-11Z" fill="#f1c775"/> :
      <rect x="-47" y="-19" width="94" height="38" rx="10" fill="#b5dce2"/>}
    <text y="1" fontSize="21" dominantBaseline="central" fontWeight="600">{atp ? 'ATP' : 'ADP'}</text>
  </g>;
}

function ReactionDiagram({ reaction }: { reaction: Reaction }) {
  const phosphorylation = reaction.input === "ATP" && reaction.output === "ADP";
  const inlet = 224 + moleculeWidth(reaction.input ?? "", 20) / 2 + 9;
  const outlet = 224 + moleculeWidth(reaction.output ?? "", 20) / 2 + 9;
  return <>
    <Molecule x={465} y={217} text={reaction.from}/>
    <path d="M465 259v207m-12-15 12 15 12-15" stroke="#634675" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <Molecule x={465} y={512} text={reaction.to} accent="product"/>
    {phosphorylation && <>
      <Nucleotide x={309} y={291} atp/>
      <path d="M375 291C425 291 465 323 465 365S425 439 375 439m12-8-12 8 12 8"
        fill="none" stroke="#634675" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Nucleotide x={309} y={439} atp={false}/>
    </>}
    {reaction.input && !phosphorylation && <>
      <Molecule x={224} y={288} text={reaction.input} accent="cofactor" small/>
      <path d={`M${inlet} 288C392 288 409 311 458 326m-14 3 14-3-10-10`} stroke="#916b32" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </>}
    {reaction.output && !phosphorylation && <>
      <Molecule x={224} y={435} text={reaction.output} accent="cofactor" small/>
      <path d={`M458 382C404 396 391 435 ${outlet} 435m13-8-13 8 13 8`} stroke="#916b32" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </>}
    <g transform="translate(502 312)" textAnchor="start">
      <rect width="100" height="32" rx="8" fill="#e4d4ea" stroke="none"/>
      <text x="50" y="21" textAnchor="middle" fontSize="16" letterSpacing="1.6" fill="#563763" stroke="none">ENZYME</text>
      <text y="60" fontSize="23">{reaction.enzyme}</text>
      <text y="92" fontSize="19" fontWeight="500">
        {reaction.action.map((line, i) => <tspan key={line} x="0" dy={i ? 25 : 0}>{line}</tspan>)}
      </text>
    </g>
  </>;
}

function KrebsOverview() {
  return <>
    <Molecule x={490} y={218} text="Acétyl-CoA + oxaloacétate"/>
    <Molecule x={677} y={368} text="Citrate"/>
    <Molecule x={491} y={516} text="Malate" accent="product"/>
    <Molecule x={300} y={368} text="Oxaloacétate" accent="product"/>
    <g fill="none" stroke="#634675" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M589 247Q675 263 677 328m-10-13 10 13 9-13"/>
      <path d="M677 408Q666 479 551 508m10-12-10 12 15 4"/>
      <path d="M429 508Q307 480 300 408m-8 15 8-15 11 11"/>
      <path d="M300 328Q305 263 385 247m-11-5 11 5-9 10"/>
    </g>
    <text x="490" y="380" fontSize="23">Un tour du cycle</text>
    <text x="490" y="585" fontSize="18" fontWeight="500">Le malate est oxydé en oxaloacétate.</text>
  </>;
}

const membraneReactions: Record<string, [string, string]> = {
  'krebs-compartiment': ['Succinate', 'Fumarate'],
  'chaine-atp': ['ADP + Pᵢ', 'ATP'],
  'chaine-oxygene': ['O₂ + 4 H⁺ + 4 e⁻', '2 H₂O'],
};

export function MetabolismVisual({ id }: { id: string }) {
  if (id === 'gly-lieu' || id === 'gly-bilan') return <GlycolysisOverview showEnergy={id === 'gly-bilan'}/>;
  const reaction = reactions[id];
  const caption = captions[id];
  const membraneReaction = membraneReactions[id];
  const cycle = id === 'krebs-bilan';
  const balance = !reaction && !caption && !cycle;
  return <g textAnchor="middle" fill="#2b3742" fontWeight="600" stroke="#fff6ec" strokeWidth="6"
    strokeLinejoin="round" paintOrder="stroke" pointerEvents="none" aria-hidden="true">
    {reaction && <ReactionDiagram reaction={reaction}/>}
    {cycle && <KrebsOverview/>}
    {membraneReaction && <>
      <Molecule x={340} y={481} text={membraneReaction[0]} small/>
      <path d="M452 481h98m-13-8 13 8-13 8" stroke="#634675" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <Molecule x={655} y={481} text={membraneReaction[1]} accent="product" small/>
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
