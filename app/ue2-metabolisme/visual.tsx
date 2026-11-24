type Reaction = {
  from: string;
  carbons?: readonly [number, number];
  to: string;
  enzyme: string;
  action: readonly string[];
  input: string;
  output: string;
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
    from: 'Pyruvate', to: 'Acétyl-CoA · groupement acétyle', carbons: [3, 2], enzyme: 'Complexe PDH',
    input: 'CoA-SH + NAD⁺', output: 'CO₂ + NADH + H⁺',
    action: ['Décarboxyle et oxyde le pyruvate', 'puis transfère l’acétyle au CoA'],
  },
  'krebs-regulation': {
    from: 'Isocitrate', to: 'α-cétoglutarate', carbons: [6, 5], enzyme: 'Isocitrate déshydrogénase',
    input: 'NAD⁺', output: 'CO₂ + NADH + H⁺',
    action: ['Oxyde et décarboxyle', 'l’isocitrate'],
  },
};

const membraneIds = ['pdh-transport', 'krebs-compartiment', 'chaine-atp', 'chaine-navette', 'chaine-lieu', 'chaine-oxygene'];

function Protein({ color = '#706188' }: { color?: string }) {
  return <ellipse rx="28" ry="17" fill={color} stroke="#392d49" strokeWidth="2"/>;
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
      <g fill="#a6b89c" stroke="#52644d" strokeWidth=".56">
        <ellipse cx="0" cy="-3.15" rx="4.85" ry="2.55"/>
        <ellipse cx="0" cy="3.15" rx="4.85" ry="2.55"/>
      </g>
      <path d="M8.5 0H-8.5m2.5-1.7L-8.5 0l2.5 1.7" stroke="#392d49" strokeWidth=".75"
        strokeLinecap="round" strokeLinejoin="round" fill="none"/>
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
  'krebs-compartiment': ['Succinate déshydrogénase', 'Réaction du côté matriciel'],
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

function Molecule({ x, y, text, accent = 'substrate', small = false, carbons }: {
  x: number; y: number; text: string; accent?: 'substrate' | 'product' | 'cofactor'; small?: boolean; carbons?: number;
}) {
  const [fill, line] = accent === 'product' ? ['#f1f4ea', '#849476'] :
    accent === 'cofactor' ? ['#fff2d9', '#ae8b50'] : ['#fffbf7', '#9b80a1'];
  const fontSize = small ? 20 : 24;
  const width = Math.max(moleculeWidth(text, fontSize), carbons ? carbons * 26 + 24 : 0);
  const height = carbons ? 86 : small ? 42 : 56;
  return <g stroke="none">
    <rect x={x - width / 2} y={y - height / 2} width={width} height={height} rx={height / 2} fill={fill} stroke={line} strokeWidth="2"/>
    <text x={x} y={carbons ? y - 17 : y} fontSize={fontSize} dominantBaseline="central" fontWeight="500">{text}</text>
    {carbons && <CarbonChain x={x} y={y + 17} count={carbons} color={accent === 'product' ? '#596c55' : '#755582'}/>}
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
  return <>
    <Molecule x={465} y={reaction.carbons ? 201 : 217} text={reaction.from} carbons={reaction.carbons?.[0]}/>
    <path d="M465 259v207m-12-15 12 15 12-15" stroke="#634675" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <Molecule x={465} y={reaction.carbons ? 527 : 512} text={reaction.to} carbons={reaction.carbons?.[1]} accent="product"/>
    {phosphorylation && <>
      <Nucleotide x={309} y={291} atp/>
      <path d="M375 291C425 291 465 323 465 365S425 439 375 439m12-8-12 8 12 8"
        fill="none" stroke="#634675" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Nucleotide x={309} y={439} atp={false}/>
    </>}
    {!phosphorylation && <>
      <Molecule x={275} y={288} text={reaction.input} accent="cofactor" small/>
      <path d={`M${286 + moleculeWidth(reaction.input, 20) / 2} 288C427 288 465 323 465 365S427 435 ${286 + moleculeWidth(reaction.output, 20) / 2} 435m12-8-12 8 12 8`}
        fill="none" stroke="#916b32" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Molecule x={275} y={435} text={reaction.output} accent="cofactor" small/>
    </>}
    <g transform="translate(502 312)" textAnchor="start">
      <rect width="136" y="-4" height="38" rx="9" fill="#e4d4ea" stroke="none"/>
      <text x="68" y="23" textAnchor="middle" fontSize="23" letterSpacing="1.6" fill="#563763" stroke="none">ENZYME</text>
      <text y="60" fontSize="23">{reaction.enzyme}</text>
      <text y="92" fontSize="19" fontWeight="500">
        {reaction.action.map((line, i) => <tspan key={line} x="0" dy={i ? 25 : 0}>{line}</tspan>)}
      </text>
    </g>
  </>;
}

function UnknownMolecule({ x, y }: { x: number; y: number }) {
  return <g stroke="none">
    <rect x={x - 46} y={y - 23} width="92" height="46" rx="23" fill="#f9dcd7" stroke="#bc7069" strokeWidth="2"/>
    <text x={x - 14} y={y + 9} fontSize="30" fill="#9b292d">?</text>
    <text x={x + 17} y={y + 6} fontSize="17" fill="#752c34">4 C</text>
  </g>;
}

function KrebsOverview({ identifyEntry }: { identifyEntry: boolean }) {
  const intermediates = [
    { x: 477, y: 157, text: 'Oxaloacétate · 4 C' },
    { x: 670, y: 230, text: 'Citrate · 6 C' },
    { x: 740, y: 352, text: 'Isocitrate · 6 C' },
    { x: 669, y: 482, text: 'α-cétoglutarate · 5 C' },
    { x: 480, y: 566, text: 'Succinyl-CoA · 4 C' },
    { x: 293, y: 482, text: 'Succinate · 4 C' },
    { x: 219, y: 352, text: 'Fumarate · 4 C' },
    { x: 293, y: 230, text: 'Malate · 4 C' },
  ];
  const pathways = [
    'M593 176Q635 192 652 214',
    'M711 254Q740 281 740 322',
    'M740 382Q737 426 711 447',
    'M617 515Q600 541 586 549',
    'M370 549Q333 535 314 511',
    'M250 447Q219 416 219 382',
    'M219 322Q222 280 249 254',
    'M338 211Q363 190 381 183',
  ];
  return <>
    <defs>
      <marker id="krebs-arrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="3.8" markerHeight="3.8" orient="auto">
        <path d="M1 1l7 4-7 4" fill="none" stroke="#634675" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
      </marker>
    </defs>
    <g fill="none" stroke="#634675" strokeWidth="3.8" strokeLinecap="round" markerEnd="url(#krebs-arrowhead)">
      {pathways.map(path => <path key={path} d={path}/>)}
      <path d="M739 142Q680 140 635 190" strokeDasharray="5 5"/>
    </g>
    {identifyEntry && <UnknownMolecule x={477} y={157}/>}
    {intermediates.slice(identifyEntry ? 1 : 0).map(item => <Molecule key={item.text} {...item} small accent={item.text.startsWith('Oxaloacétate') ? 'product' : 'substrate'}/>)}
    <Molecule x={829} y={142} text="Acétyl-CoA · 2 C" accent="cofactor" small/>
    <text x="493" y="347" fontSize="34">Cycle de Krebs</text>
    <text x="493" y="383" fontSize="19" fontWeight="500">{identifyEntry ? 'Première réaction · citrate synthase' : 'L’oxaloacétate est régénéré à chaque tour.'}</text>
  </>;
}

const membraneReactions: Record<string, [string, string]> = {
  'krebs-compartiment': ['Succinate', 'Fumarate'],
  'chaine-atp': ['ADP + Pᵢ', 'ATP'],
  'chaine-oxygene': ['O₂ + 4 H⁺ + 4 e⁻', '2 H₂O'],
};

const chainOverviewIds = ['chaine-lieu', 'chaine-atp', 'chaine-oxygene', 'chaine-navette'];

export function hasOverview(id: string) {
  return chainOverviewIds.includes(id) || id === 'chaine-bilan' || id.startsWith('bilan-');
}

function DiagramArrows() {
  return <defs>
    <marker id="met-electron" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L10 5 0 10Z" fill="#795822"/></marker>
    <marker id="met-proton" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L10 5 0 10Z" fill="#366e79"/></marker>
  </defs>;
}

function RespiratoryOverview() {
  return <g textAnchor="middle" fontWeight="500" fill="#2b3742" fontSize="20">
    <DiagramArrows/>
    <path d="M0 182H840Q968 182 968 310Q968 454 840 454H0" fill="none" stroke="#c86f5d" strokeWidth="14"/>
    <path d="M0 197H840Q952 197 952 310Q952 439 840 439H0" fill="#f3e2d6" stroke="#e7a28f" strokeWidth="8"/>
    <text x="475" y="239">Espace intracristal · en continuité avec l’espace intermembranaire</text>
    <path d="M0 429H914" stroke="#f5bfad" strokeWidth="32"/>
    {Array.from({ length: 51 }, (_, i) => <g key={i} fill="#a85d50">
      <circle cx={i * 18} cy="417" r="4"/><circle cx={i * 18} cy="441" r="4"/>
    </g>)}
    {([[132, 'I', '#b9c6ac'], [272, 'II', '#dfc17e'], [515, 'III', '#d0bbdc'], [706, 'IV', '#e6a79a']] as const).map(([x, label, color]) => <g key={label} transform={`translate(${x} 429)`}>
      <rect x="-36" y="-45" width="72" height="90" rx="26" fill={color} stroke="#594768" strokeWidth="2"/>
      <text y="7" fontWeight="700">{label}</text>
    </g>)}
    <g fill="none" stroke="#795822" strokeWidth="3.5" markerEnd="url(#met-electron)">
      <path d="M163 455Q260 499 348 449"/><path d="M308 433H344"/><path d="M399 429H471"/>
      <path d="M549 400Q572 367 608 365"/><path d="M647 365Q671 369 683 388"/>
    </g>
    <text x="372" y="435" fontWeight="700" fill="#795822">Q</text>
    <text x="628" y="356" fontSize="17">Cyt. c</text>
    <g fill="none" stroke="#366e79" strokeWidth="4" markerEnd="url(#met-proton)">
      {[132, 515, 706].map(x => <path key={x} d={`M${x - 18} 463V309`}/>)}
      <path d="M875 306V510"/>
    </g>
    {[114, 497, 688, 875].map(x => <text key={x} x={x} y="291" fill="#366e79" fontWeight="700">H⁺</text>)}
    <path d="M875 443V477" stroke="#52644d" strokeWidth="8"/>
    <rect x="855" y="402" width="40" height="54" rx="14" fill="#a6ab99" stroke="#52644d" strokeWidth="2"/>
    <ellipse cx="875" cy="493" rx="36" ry="23" fill="#a6ab99" stroke="#52644d" strokeWidth="2"/>
    <path d="M875 406V509" stroke="#366e79" strokeWidth="3.5" markerEnd="url(#met-proton)"/>
    <text x="132" y="549" fontSize="18">NADH + H⁺</text>
    <text x="272" y="549" fontSize="18">Succinate</text>
    <text x="695" y="549" fontSize="18">O₂ → H₂O</text>
    <text x="875" y="546" fontSize="17">ATP synthase</text>
    <text x="875" y="578" fontSize="18" fontWeight="600">ADP + Pᵢ → ATP</text>
    <text x="475" y="602" fontWeight="600">Matrice mitochondriale</text>
    <text x="273" y="654" fill="#795822">→ Transfert d’électrons</text>
    <text x="701" y="654" fill="#366e79">→ Déplacement des H⁺</text>
  </g>;
}

function EnergyOverview({ id }: { id: string }) {
  return <g textAnchor="middle" fontSize="22" fill="#2b3742" fontWeight="600">
    <DiagramArrows/>
    <path d="M255 310C255 193 426 165 588 180S924 200 934 342 866 522 664 505 255 513 255 310Z"
      fill="#f5dbcd" stroke="#c77968" strokeWidth="5"/>
    <path d="M289 310C300 228 464 216 555 224Q632 228 647 264T696 262Q721 218 746 260T792 271Q857 208 898 318C915 426 850 474 669 455S287 481 289 310Z"
      fill="#fff0e5" stroke="#c77968" strokeWidth="5"/>
    <text x="583" y="216" fontSize="17">Mitochondrie</text>
    <text x="122" y="273" fontSize="17">Cytosol</text>
    <g fill="none" stroke="#795822" strokeWidth="3" markerEnd="url(#met-electron)">
      <path d="M130 302Q149 157 499 150Q744 147 804 319" strokeDasharray="7 6"/>
      <path d="M206 351H270"/><path d="M433 351H478"/><path d="M659 351H733"/>
      <path d="M126 379V465"/><path d="M565 382V465"/><path d="M820 380V465"/>
    </g>
    <text x="693" y="328" fontSize="14">NADH, FADH₂</text>
    <text x="510" y="135" fontSize="17">Électrons du NADH cytosolique · navettes</text>
    <Molecule x={125} y={351} text="Glycolyse" small/>
    <Molecule x={352} y={351} text="Complexe PDH" small/>
    <Molecule x={565} y={351} text="Cycle de Krebs" small accent="product"/>
    <Molecule x={820} y={351} text="Chaîne respiratoire" small/>
    <Molecule x={126} y={491} text="ATP net" small accent="cofactor"/>
    <Molecule x={565} y={491} text="GTP" small accent="cofactor"/>
    <Molecule x={820} y={491} text="ATP" small accent="cofactor"/>
    <text x="500" y="606" fontSize="20">{id === 'bilan-substrat' ? 'ATP et GTP formés directement lors des réactions' :
      id === 'bilan-coenzymes' ? 'Suivre les coenzymes réduits de la glycolyse, du complexe PDH et de Krebs' :
      'Le rendement par glucose dépend de la navette utilisée'}</text>
  </g>;
}

export function MetabolismVisual({ id }: { id: string }) {
  if (hasOverview(id)) return chainOverviewIds.includes(id) ? <RespiratoryOverview/> : <EnergyOverview id={id}/>;
  if (id === 'gly-lieu' || id === 'gly-bilan') return <GlycolysisOverview showEnergy={id === 'gly-bilan'}/>;
  const reaction = reactions[id];
  const caption = captions[id];
  const membraneReaction = membraneReactions[id];
  const cycle = id === 'krebs-bilan' || id === 'krebs-entree';
  return <g textAnchor="middle" fill="#2b3742" fontWeight="600" stroke="#fff6ec" strokeWidth="6"
    strokeLinejoin="round" paintOrder="stroke" pointerEvents="none" aria-hidden="true">
    {reaction && <ReactionDiagram reaction={reaction}/>}
    {cycle && <KrebsOverview identifyEntry={id === 'krebs-entree'}/>}
    {membraneReaction && <>
      <Molecule x={340} y={535} text={membraneReaction[0]} small/>
      <path d="M452 535h98m-13-8 13 8-13 8" stroke="#634675" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <Molecule x={655} y={535} text={membraneReaction[1]} accent="product" small/>
    </>}
    {caption && <>
      <text x="500" y={membraneReaction ? 599 : 547} fontSize="26">{caption[0]}</text>
      <text x="500" y={membraneReaction ? 631 : 583} fontSize="19">{caption[1]}</text>
    </>}
  </g>;
}
