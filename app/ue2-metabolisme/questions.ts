import type { Question } from '../quiz';

export const metabolismTitle = 'UE2-Métabolisme';

export const metabolismMissions = [
  'Dégrader le glucose',
  'Régénérer le NAD⁺',
  'Former l’acétyl-CoA',
  'Boucler le cycle de Krebs',
  'Produire de l’ATP',
];

type Check = [prompt: string, truth: boolean, explanation: string];

function challenge(
  id: string, mission: number, prompt: string, options: string[], answer: number[],
  explanation: string, hints: [string, string], [retry, truth, retryExplanation]: Check,
): Question {
  return {
    id, mission, context: metabolismMissions[mission - 1],
    kind: options.length === 5 ? 'qcm' : 'qcd',
    prompt, options, answer, explanation, hints, rationales: [],
    alternative: { prompt: retry, answer: [truth ? 0 : 1], explanation: retryExplanation },
  };
}

export const metabolismQuestions = [
  challenge('gly-lieu', 1, 'Où se déroule la glycolyse ?', [
    'Dans le cytosol', 'Dans la matrice mitochondriale', 'Sur les crêtes mitochondriales', 'Dans le noyau', 'Dans l’espace intermembranaire',
  ], [0], 'Les dix réactions de la glycolyse se déroulent dans le cytosol.',
  ['Repère l’espace entre les organites.', 'Le glucose est converti en pyruvate avant son éventuel transport dans la mitochondrie.'],
  ['La glycolyse commence dans la matrice mitochondriale.', false, 'Elle se déroule entièrement dans le cytosol.']),
  challenge('gly-bilan', 1, 'Quels sont les produits nets de la glycolyse pour un glucose ?', [
    '2 pyruvates', '2 ATP', '2 NADH,H⁺', '2 CO₂', '2 FADH₂',
  ], [0, 1, 2], 'Un glucose donne 2 pyruvates, 2 NADH,H⁺, 2 ATP nets et 2 H₂O. Aucun CO₂ ni FADH₂ n’est formé.',
  ['Compte les molécules issues des deux trioses.', 'Quatre ATP sont produits et deux ATP sont investis.'],
  ['La glycolyse libère du CO₂ avant de former le pyruvate.', false, 'Les six carbones du glucose se retrouvent dans les deux pyruvates.']),
  challenge('gly-pfk', 1, 'Quelle enzyme catalyse l’étape cinétiquement limitante de la glycolyse ?', [
    'Hexokinase', 'Phosphofructokinase 1', 'Aldolase', 'Pyruvate kinase', 'Lactate déshydrogénase',
  ], [1], 'La PFK1 phosphoryle le fructose-6-phosphate en fructose-1,6-bisphosphate. Un ATP élevé freine cette étape.',
  ['Cherche une étape de régulation de la phase d’investissement.', 'Le substrat est le fructose-6-phosphate.'],
  ['Une concentration élevée d’ATP inhibe la PFK1.', true, 'L’ATP en excès freine la PFK1 par régulation allostérique.']),
  challenge('gly-oxygene', 1, 'La glycolyse consomme directement du dioxygène.', ['Vrai', 'Faux'], [1],
  'La glycolyse réduit le NAD⁺ en NADH,H⁺. Le dioxygène intervient comme accepteur final de la chaîne respiratoire.',
  ['Distingue les accepteurs d’électrons des deux voies.', 'La glycolyse peut se poursuivre si le NAD⁺ est régénéré.'],
  ['Du NAD⁺ est nécessaire lors de l’oxydation du glycéraldéhyde-3-phosphate.', true, 'Le NAD⁺ y accepte les électrons et est réduit.']),

  challenge('lac-enzyme', 2, 'Quelle enzyme réduit le pyruvate en lactate ?', [
    'Lactate déshydrogénase', 'Pyruvate déshydrogénase', 'Pyruvate kinase', 'Citrate synthase', 'Succinate déshydrogénase',
  ], [0], 'Dans le cytosol, la lactate déshydrogénase réduit le pyruvate et réoxyde le NADH,H⁺.',
  ['Cette enzyme utilise le NADH,H⁺.', 'Son nom fait référence au lactate.'],
  ['La réaction pyruvate → lactate est catalysée par la pyruvate déshydrogénase.', false, 'La pyruvate déshydrogénase forme de l’acétyl-CoA.']),
  challenge('lac-nad', 2, 'Quel effet la formation de lactate a-t-elle sur les coenzymes cytosoliques ?', [
    'Elle régénère le NAD⁺', 'Elle régénère le FAD', 'Elle produit du NADH,H⁺', 'Elle produit du NADPH', 'Elle consomme directement du dioxygène',
  ], [0], 'Le NADH,H⁺ cède ses électrons au pyruvate. Le NAD⁺ régénéré peut être réutilisé par la glycolyse.',
  ['Le pyruvate gagne des électrons.', 'Le donneur d’électrons est oxydé.'],
  ['La formation de lactate permet à la glycolyse de continuer en régénérant le NAD⁺.', true, 'Le NAD⁺ est de nouveau disponible pour l’oxydation du glycéraldéhyde-3-phosphate.']),
  challenge('lac-bilan', 2, 'Quel est le bilan net pour un glucose converti en lactate ?', [
    '2 lactates et 2 ATP', '2 lactates et 4 ATP', '2 lactates et 2 GTP', '1 lactate et 2 ATP', '2 lactates et 2 FADH₂',
  ], [0], 'Le bilan est de 2 lactates et 2 ATP nets. Les ATP proviennent de la glycolyse.',
  ['Les deux pyruvates sont convertis.', 'Le passage du pyruvate au lactate ne forme pas d’ATP.'],
  ['La conversion du pyruvate en lactate ajoute un ATP par pyruvate.', false, 'Seule la glycolyse fournit l’ATP dans ce bilan.']),
  challenge('lac-carbone', 2, 'La réduction du pyruvate en lactate conserve ses trois carbones.', ['Vrai', 'Faux'], [0],
  'La fonction carbonyle du pyruvate est réduite en alcool. Il n’y a pas de décarboxylation.',
  ['Compare le nombre de carbones des deux molécules.', 'Repère ce qui est modifié par la réduction.'],
  ['La formation de lactate libère une molécule de CO₂ par pyruvate.', false, 'Les trois carbones du pyruvate se retrouvent dans le lactate.']),

  challenge('pdh-lieu', 3, 'Où le complexe pyruvate déshydrogénase forme-t-il l’acétyl-CoA ?', [
    'Dans le cytosol', 'Dans la matrice mitochondriale', 'Dans l’espace intermembranaire', 'Dans le noyau', 'Dans la lumière du réticulum',
  ], [1], 'Après son entrée dans la mitochondrie, le pyruvate est transformé en acétyl-CoA dans la matrice.',
  ['Suis le pyruvate au-delà de la membrane interne.', 'Le produit alimente le cycle de Krebs.'],
  ['La décarboxylation oxydative du pyruvate par le complexe PDH est cytosolique.', false, 'Le complexe agit dans la matrice mitochondriale.']),
  challenge('pdh-transport', 3, 'Le transporteur de la membrane interne fait entrer le pyruvate avec un proton.', ['Vrai', 'Faux'], [0],
  'Le cours décrit un symport pyruvate/H⁺ à travers la membrane interne.',
  ['Repère la membrane qui sépare l’espace intermembranaire de la matrice.', 'Un symport déplace ses deux substrats dans le même sens.'],
  ['Dans le symport pyruvate/H⁺, le pyruvate entre pendant que le proton sort.', false, 'Le pyruvate et le proton entrent ensemble dans la matrice.']),
  challenge('pdh-bilan', 3, 'Quels produits obtient-on par décarboxylation oxydative d’un pyruvate ?', [
    '1 acétyl-CoA', '1 CO₂', '1 NADH,H⁺', '1 ATP', '1 FADH₂ libéré',
  ], [0, 1, 2], 'Un pyruvate, du CoA-SH et du NAD⁺ donnent un acétyl-CoA, un CO₂ et un NADH,H⁺.',
  ['Le pyruvate perd un carbone.', 'Le NAD⁺ récupère les électrons.'],
  ['Deux pyruvates donnent deux acétyl-CoA et deux CO₂ avant le cycle de Krebs.', true, 'Le bilan par glucose est le double du bilan par pyruvate.']),
  challenge('pdh-reg', 3, 'Un excès d’acétyl-CoA freine le complexe pyruvate déshydrogénase.', ['Vrai', 'Faux'], [0],
  'L’acétyl-CoA inhibe le complexe par effet produit.',
  ['L’acétyl-CoA est en sortie de réaction.', 'Quand le produit s’accumule, le flux de la réaction peut diminuer.'],
  ['L’accumulation d’acétyl-CoA active sa production à partir du pyruvate.', false, 'L’excès de produit inhibe le complexe.']),

  challenge('krebs-entree', 4, 'Avec quel composé le groupement acétyle se condense-t-il pour former le citrate ?', [
    'Oxaloacétate', 'Succinate', 'Fumarate', 'Pyruvate', 'Lactate',
  ], [0], 'L’oxaloacétate (4 C) reçoit le groupement acétyle (2 C). La citrate synthase forme le citrate (6 C).',
  ['Le composé est régénéré en fin de cycle.', 'Il contient quatre carbones.'],
  ['L’entrée de l’acétyl-CoA dans le cycle forme un composé à six carbones.', true, 'Le citrate résulte de l’association de deux et quatre carbones.']),
  challenge('krebs-bilan', 4, 'Que produit un tour de Krebs par acétyl-CoA ?', [
    '2 CO₂', '3 NADH,H⁺', '1 FADH₂', '1 GTP', '2 ATP nets de glycolyse',
  ], [0, 1, 2, 3], 'Un tour forme 2 CO₂, 3 NADH,H⁺, 1 FADH₂ et 1 GTP. L’oxaloacétate est régénéré.',
  ['Compte les deux décarboxylations du cycle.', 'Distingue la phosphorylation au niveau du substrat de la chaîne respiratoire.'],
  ['Un tour de Krebs forme trois NADH,H⁺ pour un acétyl-CoA.', true, 'Ils sont formés lors des réactions de l’isocitrate, de l’α-cétoglutarate et du malate.']),
  challenge('krebs-compartiment', 4, 'La succinate déshydrogénase du cycle de Krebs appartient aussi au complexe II de la chaîne respiratoire.', ['Vrai', 'Faux'], [0],
  'Le cycle est matriciel. La succinate déshydrogénase est ancrée dans la membrane interne et oxyde le succinate du côté matriciel.',
  ['Cette enzyme relie les deux voies.', 'Elle transmet les électrons à l’ubiquinone via son FAD.'],
  ['La succinate déshydrogénase est une enzyme de la glycolyse.', false, 'Elle intervient à la fois dans le cycle de Krebs et dans la chaîne respiratoire.']),
  challenge('krebs-reg', 4, 'L’oxaloacétate est consommé définitivement après chaque tour de Krebs.', ['Vrai', 'Faux'], [1],
  'La malate déshydrogénase reforme l’oxaloacétate en fin de cycle.',
  ['Reviens au point de départ du cycle.', 'La dernière réaction oxyde le malate.'],
  ['Le malate peut être oxydé en oxaloacétate en fin de cycle.', true, 'Cette réaction régénère l’accepteur du groupement acétyle.']),

  challenge('chaine-lieu', 5, 'Quels énoncés décrivent correctement la chaîne respiratoire ?', [
    'Ses complexes sont dans la membrane interne', 'Le dioxygène est l’accepteur final des électrons', 'Les complexes I, III et IV contribuent au gradient de protons', 'Le complexe II pompe des protons', 'La chaîne se déroule dans le cytosol',
  ], [0, 1, 2], 'Dans la membrane interne, I, III et IV contribuent à l’accumulation de H⁺ du côté intermembranaire. Le complexe IV réduit O₂ en eau.',
  ['Les crêtes sont des replis de la membrane interne.', 'Le complexe II fournit des électrons sans pomper de protons.'],
  ['Le dioxygène est réduit en eau au complexe IV.', true, 'Le complexe IV transmet les électrons au dioxygène, accepteur final.']),
  challenge('chaine-atp', 5, 'Dans quel sens les protons passent-ils par l’ATP synthase lors de la production d’ATP ?', [
    'De l’espace intermembranaire vers la matrice', 'De la matrice vers l’espace intermembranaire', 'Du cytosol vers le noyau', 'Du noyau vers le cytosol', 'De la matrice vers le cytosol à travers la membrane externe',
  ], [0], 'Le retour des H⁺ vers la matrice selon leur gradient électrochimique fournit l’énergie pour former l’ATP.',
  ['Le pompage enrichit le côté intermembranaire en H⁺.', 'Le flux par l’ATP synthase suit le gradient.'],
  ['Lors de la synthèse d’ATP, les protons retournent vers la matrice.', true, 'Leur retour à travers l’ATP synthase entraîne la phosphorylation de l’ADP.']),
  challenge('chaine-navette', 5, 'Les navettes transfèrent les électrons du NADH cytosolique sans faire entrer le NADH lui-même dans la matrice.', ['Vrai', 'Faux'], [0],
  'Le NADH cytosolique ne traverse pas la membrane interne. Les navettes prennent en charge ses équivalents réducteurs.',
  ['Distingue le coenzyme de ses électrons.', 'La membrane interne ne laisse pas passer directement le NADH cytosolique.'],
  ['Les navettes permettent au NADH cytosolique de traverser la membrane interne sous forme inchangée.', false, 'Ce sont ses équivalents réducteurs qui sont transférés.']),
  challenge('chaine-bilan', 5, 'Selon la convention du cours, combien d’équivalents ATP obtient-on par glucose avec la navette malate-aspartate ?', [
    '2', '32', '36', '38', '40',
  ], [3], 'Dans la convention du cours, 4 ATP ou GTP + 10 × 3 + 2 × 2 donnent 38 équivalents ATP. La navette glycérol-3-phosphate donne 36 dans cette même convention.',
  ['Compte 2 ATP de glycolyse et 2 GTP de Krebs.', 'Dans le cours, cette navette permet de compter 3 ATP par NADH,H⁺.'],
  ['Avec la convention du cours, la navette glycérol-3-phosphate mène à 36 équivalents ATP par glucose.', true, 'Les deux NADH cytosoliques valent chacun 2 ATP avec cette navette au lieu de 3.']),
];
