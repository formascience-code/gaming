type Reaction = { title: string; from: string; to: string; enzyme: string; note: string };

const reactions: Record<string, Reaction> = {
  'gly-lieu': { title: 'Glycolyse', from: 'Glucose · 6 C', to: '2 pyruvates · 3 C chacun', enzyme: '10 réactions', note: 'Phase d’investissement puis phase de rendement' },
  'gly-bilan': { title: 'ATP et coenzymes de la glycolyse', from: 'Glucose + NAD⁺', to: 'Pyruvate + NADH,H⁺', enzyme: 'Glycolyse', note: '2 ATP investis · 4 ATP formés' },
  'gly-pfk': { title: 'Phosphorylation du fructose-6-phosphate', from: 'Fructose-6-P + ATP', to: 'Fructose-1,6-bisP + ADP', enzyme: 'Enzyme à identifier', note: 'Transfert du phosphate terminal de l’ATP' },
  'gly-regulation': { title: 'Régulation allostérique de la PFK1', from: 'Fructose-6-P + ATP', to: 'Fructose-1,6-bisP + ADP', enzyme: 'PFK1', note: 'L’ATP peut se fixer sur le site catalytique ou sur un site régulateur' },
  'lac-nad': { title: 'Couple pyruvate / lactate', from: 'Pyruvate', to: 'Lactate', enzyme: 'Lactate déshydrogénase', note: 'Au cours de la réaction, le coenzyme cède ses électrons' },
  'lac-bilan': { title: 'Voie lactique', from: 'Glucose', to: '2 pyruvates → 2 lactates', enzyme: 'Glycolyse', note: 'La réduction du pyruvate régénère le NAD⁺' },
  'pdh-bilan': { title: 'Décarboxylation oxydative du pyruvate', from: 'Pyruvate + CoA-SH + NAD⁺', to: 'Acétyl-CoA', enzyme: 'Complexe PDH', note: 'Le groupement acétyle conserve deux des trois carbones du pyruvate' },
  'krebs-entree': { title: 'Première réaction du cycle de Krebs', from: 'Acétyl-CoA (2 C) + ? (4 C)', to: 'Citrate (6 C) + CoA-SH', enzyme: 'Citrate synthase', note: 'Le composé à identifier est régénéré en fin de cycle' },
  'krebs-bilan': { title: 'Un tour du cycle de Krebs', from: 'Acétyl-CoA + oxaloacétate', to: 'Citrate → … → malate', enzyme: 'Cycle de Krebs', note: 'Le malate est oxydé en oxaloacétate, qui peut entrer dans un nouveau tour' },
  'krebs-regulation': { title: 'Décarboxylation oxydative de l’isocitrate', from: 'Isocitrate + NAD⁺', to: 'α-cétoglutarate + CO₂ + NADH,H⁺', enzyme: 'Isocitrate déshydrogénase', note: 'L’ATP et l’ADP renseignent sur l’état énergétique mitochondrial' },
};

const membrane: Record<string, { title: string; protein: string; upper: string; lower: string; note: string; down: boolean }> = {
  'pdh-transport': { title: 'Entrée du pyruvate dans la mitochondrie', protein: 'Transporteur du pyruvate', upper: 'Pyruvate + H⁺', lower: 'Pyruvate + H⁺', note: 'Symport à travers la membrane interne', down: true },
  'krebs-compartiment': { title: 'Oxydation du succinate', protein: 'Succinate déshydrogénase', upper: 'Espace intermembranaire', lower: 'Succinate → Fumarate', note: 'Le site catalytique est du côté matriciel', down: false },
  'chaine-atp': { title: 'Phosphorylation oxydative', protein: 'ATP synthase', upper: 'H⁺ H⁺ H⁺ H⁺ H⁺', lower: 'ADP + Pᵢ → ATP', note: 'Le gradient électrochimique fournit l’énergie de la réaction', down: true },
  'chaine-navette': { title: 'Transfert des équivalents réducteurs', protein: 'Membrane interne', upper: 'Équivalents réducteurs du cytosol', lower: 'Électrons vers la chaîne', note: 'Les navettes relaient les électrons par des intermédiaires', down: false },
};

export function MetabolismVisual({ id }: { id: string }) {
  const reaction = reactions[id];
  const transport = membrane[id];
  const chain = id === 'chaine-lieu' || id === 'chaine-oxygene';
  const title = reaction?.title ?? transport?.title ?? (chain ? 'Chaîne respiratoire dans la membrane interne' : 'Suivre l’énergie d’un glucose');

  return <g transform="translate(120 425)" fontSize="20" fill="#2b3742" textAnchor="middle">
    <path d="M380 0V-23" stroke="#634675" strokeWidth="3"/>
    <rect width="760" height="228" rx="20" fill="#fffaf4" stroke="#aa92b2" strokeWidth="2"/>
    <text x="380" y="35" fontSize="24" fontWeight="600">{title}</text>
    {reaction ? <>
      <text x="380" y="82" fill="#634675">{reaction.enzyme}</text>
      <text x="178" y="123" fontSize="19">{reaction.from}</text>
      <path d="M321 115h90m-14-8 14 8-14 8" stroke="#634675" strokeWidth="3" fill="none"/>
      <text x="585" y="123" fontSize="19">{reaction.to}</text>
      {id === 'krebs-bilan' && <path d="M619 136c-36 41-422 41-480 4m16 3-16-3 5 14" stroke="#634675" strokeWidth="2" fill="none"/>}
      <text x="380" y="205" fontSize="16">{reaction.note}</text>
    </> : transport ? <>
      <rect x="56" y="101" width="648" height="39" rx="6" fill="#efaa97" opacity=".62"/>
      <path d="M56 101H704M56 140H704" fill="none" stroke="#b95f50" strokeWidth="3"/>
      <rect x="226" y="101" width="307" height="39" rx="14" fill="#634675"/>
      <text x="380" y="127" fill="white">{transport.protein}</text>
      <text x="380" y="80">{transport.upper}</text><text x="390" y="178">{transport.lower}</text>
      {transport.down && <path d="M555 79v86m-8-10 8 10 8-10" stroke="#634675" strokeWidth="3" fill="none"/>}
      <text x="116" y="80" fontSize="14">Hors matrice</text><text x="103" y="176" fontSize="15">Matrice</text>
      <text x="380" y="207" fontSize="16">{transport.note}</text>
    </> : chain ? <>
      <text x="380" y="76" fontSize="17">Espace intermembranaire</text>
      <path d="M55 100H705V140H55Z" fill="#efaa97" stroke="#b95f50" strokeWidth="2"/>
      {['I', 'II', 'III', 'IV'].map((item, i) => <g key={item}>
        <rect x={108 + i * 162} y="93" width="58" height="54" rx="11" fill={item === 'IV' ? '#935447' : '#634675'}/>
        <text x={137 + i * 162} y="128" fill="white">{item}</text>
      </g>)}
      <text x="380" y="178" fontSize="17">{id === 'chaine-oxygene' ? 'Cytochrome c réduit → complexe IV → O₂' : 'NADH,H⁺ et succinate alimentent la chaîne en électrons'}</text>
      <text x="380" y="206" fontSize="16">Matrice mitochondriale</text>
    </> : <>
      <text x="135" y="90" fontSize="16">CYTOSOL</text><text x="465" y="90" fontSize="16">MITOCHONDRIE</text>
      <text x="135" y="129">Glycolyse</text><text x="330" y="129">Complexe PDH</text>
      <text x="503" y="129">Krebs</text><text x="645" y="129">Chaîne</text>
      <path d="M200 123h36m-9-6 9 6-9 6m184-6h35m-9-6 9 6-9 6m101-6h43m-9-6 9 6-9 6" stroke="#634675" strokeWidth="2.5" fill="none"/>
      <text x="380" y="184" fontSize="17">{id === 'bilan-substrat' ? 'ATP de glycolyse + GTP formé sur deux tours de Krebs' :
        id === 'bilan-coenzymes' ? 'Additionner les coenzymes réduits des trois premières étapes' :
        'Le rendement des NADH cytosoliques dépend de la navette utilisée'}</text>
      <text x="380" y="209" fontSize="15">Bilan rapporté à un glucose</text>
    </>}
  </g>;
}
