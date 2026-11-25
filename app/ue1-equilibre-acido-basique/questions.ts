import type { Question } from '../quiz';

export const acidTitle = 'Équilibre acido-basique';
export const acidRoute = '/ue1-equilibre-acido-basique';

export const acidMissions = [
  'Remonter à la source de l’acidité',
  'Suivre les échanges digestifs',
  'Du sang aux poumons',
  'Explorer la réponse du rein',
  'Résoudre l’énigme du pH',
];

export const missionSummaries = [
  'Le métabolisme oxydatif fournit du CO₂. La réduction du pyruvate consomme un H⁺, tandis que l’hydrolyse de l’ATP peut contribuer à la charge protonique. Les transporteurs déplacent ces espèces entre compartiments.',
  'L’estomac sécrète des H⁺ dans sa lumière. Les canaux pancréatiques sécrètent des bicarbonates qui rejoignent le duodénum et tamponnent le contenu acide venu de l’estomac.',
  'Dans les tissus, une grande partie du CO₂ est convertie en bicarbonate. L’hémoglobine tamponne des H⁺. Dans les poumons, les réactions s’inversent et le CO₂ est expiré.',
  'Le rein récupère le bicarbonate filtré et restitue du bicarbonate neuf au sang lors de l’excrétion nette d’acide, notamment sous forme de NH₄⁺ et d’acidité titrable.',
  'Une acidose métabolique peut être compensée par une baisse de la PaCO₂. Dans une acidose respiratoire persistante, la hausse des bicarbonates rapproche le pH de la normale.',
];

const vf = ['Vrai', 'Faux'];

function check(
  id: string, mission: number, prompt: string, options: string[], answer: number[],
  explanation: string, hints: [string, string], retry: [string, boolean, string],
): Question {
  return {
    id, mission, context: acidMissions[mission - 1], kind: options.length === 5 ? 'qcm' : 'qcd',
    prompt, options, answer, explanation, hints, rationales: [],
    alternative: { prompt: retry[0], answer: [retry[1] ? 0 : 1], explanation: retry[2] },
  };
}

export const acidQuestions = [
  check('glycolyse', 1, 'Si la concentration de H⁺ libres augmente dans le cytosol, que devient le pH ?', [
    'Il diminue', 'Il augmente', 'Il reste constant tant que du pyruvate est présent', 'Il devient égal à la concentration de H⁺', 'Il double si la concentration de H⁺ double',
  ], [0], 'Le pH est le logarithme décimal négatif de l’activité des H⁺. Plus celle-ci est élevée, plus le pH est bas. Sur le schéma, le passage du glucose au pyruvate correspond à la glycolyse.', ['Cherche le signe devant le logarithme.', 'Une activité en H⁺ dix fois plus élevée fait varier le pH d’une unité.'],
  ['Une activité en H⁺ multipliée par dix fait diminuer le pH d’une unité.', true, 'Le signe négatif dans la définition du pH inverse le sens de variation.']),
  check('co2', 1, 'Le CO₂ issu du métabolisme peut conduire à la formation de H⁺ et de HCO₃⁻.', vf, [0],
    'Le CO₂ hydraté donne de l’acide carbonique, qui peut se dissocier en H⁺ et HCO₃⁻.', ['Suis la voie mitochondriale.', 'Lis l’équilibre sous la mitochondrie.'],
    ['L’hydratation du CO₂ participe à l’équilibre bicarbonate.', true, 'La réaction globale s’écrit CO₂ + H₂O ⇌ H⁺ + HCO₃⁻.']),
  check('lactate', 1, 'La réduction du pyruvate en lactate par la lactate déshydrogénase libère directement un H⁺.', vf, [1],
    'Dans le bilan indiqué, la réduction du pyruvate consomme un H⁺. L’hydrolyse de l’ATP constitue une réaction distincte.', ['Regarde de quel côté de la flèche figure H⁺.', 'Compare la réaction de la LDH et l’hydrolyse de l’ATP.'],
    ['Dans la réaction montrée, la LDH régénère du NAD⁺.', true, 'Le NADH est oxydé en NAD⁺ pendant la réduction du pyruvate.']),
  check('mct', 1, 'Quel est l’effet direct d’une sortie conjointe de lactate et de H⁺ sur la charge acide du cytosol, toutes choses égales par ailleurs ?', [
    'Elle diminue la charge acide du cytosol', 'Elle augmente la charge acide du cytosol', 'Elle fait entrer du bicarbonate', 'Elle fait sortir seulement du lactate', 'Elle neutralise directement les H⁺ dans le milieu extracellulaire',
  ], [0], 'Le cotransport par MCT transfère un H⁺ avec le lactate vers le milieu extracellulaire. La charge acide est déplacée entre compartiments.', ['Suis le H⁺ à travers la membrane.', 'Distingue un transfert de proton d’une neutralisation.'],
  ['La sortie de lactate avec H⁺ peut soulager la charge acide du cytosol.', true, 'Le proton est transféré vers le milieu extracellulaire.']),

  check('estomac', 2, 'À pouvoir tampon inchangé, quel effet la sécrétion gastrique de H⁺ tend-elle à produire dans la lumière de l’estomac ?', [
    'Une baisse du pH', 'Une hausse du pH', 'Une baisse de l’activité des H⁺', 'Une disparition de tout effet tampon', 'Une production directe de bicarbonate dans la lumière par la pompe à H⁺',
  ], [0], 'L’apport de H⁺ acidifie la lumière gastrique. Les tampons présents peuvent limiter l’amplitude de la baisse de pH.', ['Repère le compartiment qui reçoit les H⁺.', 'Plus l’activité des H⁺ augmente, plus le pH baisse.'],
  ['La sécrétion de H⁺ par l’estomac tend à acidifier le contenu gastrique.', true, 'Les H⁺ sécrétés arrivent dans la lumière.']),
  check('bicarbonate-sang', 2, 'Lorsque la cellule pariétale sécrète des H⁺, des bicarbonates peuvent sortir du côté basolatéral.', vf, [0],
    'L’échangeur basolatéral Cl⁻/HCO₃⁻ permet la sortie de bicarbonate vers le milieu interstitiel et l’entrée de Cl⁻.', ['Regarde le côté opposé à la lumière.', 'Suis la flèche HCO₃⁻.'],
    ['Le Cl⁻ peut entrer dans la cellule pariétale en échange de HCO₃⁻ au pôle basolatéral.', true, 'Les deux ions circulent en sens opposés.']),
  check('pancreas', 2, 'Quel est le rôle du bicarbonate sécrété par les canaux pancréatiques ?', [
    'Tamponner le contenu acide qui arrive dans le duodénum', 'Acidifier directement la lumière gastrique', 'Empêcher la sortie de H⁺ par le rein', 'Transporter l’oxygène', 'Transformer directement le lactate en pyruvate',
  ], [0], 'Le bicarbonate pancréatique rejoint le duodénum, où il tamponne l’acidité du chyme.', ['Suis le canal vers l’intestin.', 'Le bicarbonate est la base du couple CO₂/HCO₃⁻.'],
  ['Le suc pancréatique riche en bicarbonate rejoint le duodénum.', true, 'Il est déversé dans le duodénum par le système canalaire pancréatique.']),
  check('polarite', 2, 'Une perte prolongée de liquide gastrique riche en HCl peut favoriser une alcalose métabolique.', vf, [0],
    'La perte de HCl représente une perte nette d’acide pour l’organisme. La concentration plasmatique de bicarbonate peut augmenter.', ['Raisonne à l’échelle de l’organisme.', 'Une perte d’acide peut faire monter le pH sanguin.'],
    ['Une perte d’acide gastrique peut entraîner une hausse du bicarbonate plasmatique.', true, 'Une augmentation primaire du bicarbonate est compatible avec une alcalose métabolique.']),

  check('hematie', 3, 'Quels événements participent au transport du CO₂ au niveau des tissus ?', [
    'Le CO₂ diffuse dans l’hématie', 'L’anhydrase carbonique accélère l’hydratation du CO₂', 'L’hémoglobine peut fixer des H⁺', 'Le CO₂ est expiré au niveau des tissus', 'L’anhydrase carbonique transforme le CO₂ en oxygène',
  ], [0, 1, 2], 'Le CO₂ tissulaire gagne l’hématie. Son hydratation est catalysée par l’anhydrase carbonique et l’hémoglobine peut tamponner les H⁺.', ['Suis le CO₂ depuis le tissu.', 'Repère le devenir des deux produits de l’équilibre.'],
  ['L’hémoglobine peut agir comme tampon dans l’hématie.', true, 'Elle fixe ou libère des H⁺ selon les conditions locales.']),
  check('hamburger', 3, 'Quelles propositions sont exactes à propos de la courbe de dissociation de HbO₂ et de l’effet Bohr ?', [
    'À 40 mmHg, la saturation est d’environ 75 % sur la courbe de référence',
    'Entre 90 et 40 mmHg, la saturation baisse d’environ 20 à 25 points',
    'À PO₂ identique, une baisse du pH réduit l’affinité de l’hémoglobine pour l’O₂',
    'Une baisse du pH déplace la courbe vers la gauche',
    'Sur le plateau, une baisse de PO₂ fait chuter fortement la saturation',
  ], [0, 1, 2], 'Le plateau préserve le chargement en O₂ aux poumons. La pente plus forte aux PO₂ tissulaires facilite sa libération. À PO₂ identique, une baisse du pH déplace la courbe vers la droite et favorise la dissociation de HbO₂.', ['Compare les points à 40 et 90 mmHg.', 'Pour l’effet Bohr, compare les deux courbes à la même PO₂.'],
  ['À PO₂ identique, l’effet Bohr favorise la libération d’O₂ quand le pH diminue.', true, 'La baisse de pH diminue l’affinité de l’hémoglobine pour l’O₂.']),
  check('alveole', 3, 'Dans le système bicarbonate, quel effet a une baisse de PaCO₂ à concentration de HCO₃⁻ constante ?', [
    'Le pH augmente', 'Le pH diminue', 'Le rapport HCO₃⁻/CO₂ dissous diminue', 'La concentration de H⁺ libres augmente', 'Le pH ne varie pas',
  ], [0], 'Le CO₂ dissous est proportionnel à la PaCO₂. Quand celui-ci diminue à bicarbonate constant, le rapport base/acide augmente et le pH augmente.', ['Place le CO₂ dissous au dénominateur.', 'Un rapport base/acide plus grand correspond à un pH plus élevé.'],
  ['À bicarbonate constant, une hausse de PaCO₂ tend à abaisser le pH.', true, 'La hausse du CO₂ dissous réduit le rapport base/acide.']),
  check('ventilation', 3, 'À production de CO₂ constante, augmenter la ventilation alvéolaire tend à diminuer la PaCO₂.', vf, [0],
    'Une hausse de la ventilation alvéolaire augmente l’élimination du CO₂ et abaisse sa pression partielle artérielle.', ['Imagine une augmentation du renouvellement de l’air alvéolaire.', 'Le CO₂ est éliminé plus efficacement.'],
    ['Une hypoventilation alvéolaire peut faire monter la PaCO₂.', true, 'À production constante, l’élimination est réduite.']),

  check('filtration', 4, 'Si du bicarbonate filtré est perdu dans les urines, il s’agit d’une perte de base pour l’organisme.', vf, [0],
    'Le bicarbonate est la base du couple CO₂/HCO₃⁻. Sa perte nette tend à diminuer la réserve alcaline.', ['Identifie la forme basique du couple.', 'Une espèce filtrée peut être récupérée ou perdue dans les urines.'],
    ['La récupération du bicarbonate filtré évite une perte de base.', true, 'Le bicarbonate récupéré retourne au sang.']),
  check('proximal', 4, 'Quel est le bilan acido-basique de la récupération d’un bicarbonate filtré dans le tubule proximal ?', [
    'Elle évite une perte de base', 'Elle ajoute à elle seule un bicarbonate neuf à l’organisme', 'Elle implique nécessairement l’excrétion nette du proton utilisé', 'Elle entraîne la perte du bicarbonate dans les urines', 'Elle élimine du CO₂ par ventilation',
  ], [0], 'Le bicarbonate retourné au sang remplace celui qui avait été filtré. Le H⁺ sécrété au cours du mécanisme est recyclé.', ['Compare le bicarbonate filtré à celui qui retourne au sang.', 'Cherche si le proton utilisé pour cette récupération est effectivement perdu dans les urines.'],
  ['Récupérer un bicarbonate filtré et produire un bicarbonate neuf ont des bilans différents.', true, 'La récupération conserve la base déjà présente.']),
  check('phosphate', 4, 'Dans l’urine, HPO₄²⁻ peut capter un proton et former H₂PO₄⁻.', vf, [0],
    'La protonation de HPO₄²⁻ contribue à l’acidité titrable de l’urine.', ['Compare le nombre d’hydrogènes.', 'Une base peut capter un proton.'],
    ['H₂PO₄⁻ contribue à l’excrétion d’acide sous forme tamponnée.', true, 'Il est excrété dans l’urine.']),
  check('ammonium', 4, 'Quelles formes contribuent à l’excrétion urinaire nette d’acide ?', [
    'NH₄⁺', 'H₂PO₄⁻ au titre de l’acidité titrable', 'CO₂ expiré', 'HCO₃⁻ excrété comme base', 'Hémoglobine oxygénée',
  ], [0, 1], 'NH₄⁺ et l’acidité titrable contribuent à l’excrétion nette d’acide. Le bicarbonate urinaire est une perte de base.', ['Repère deux formes protonées dans la lumière.', 'Distingue le rôle du poumon et celui du rein.'],
    ['Excréter du bicarbonate constitue une perte de base.', true, 'Le bicarbonate urinaire est soustrait lorsqu’on calcule l’excrétion nette d’acide.']),

  check('point', 5, 'Avec un pH de 7,32 et des bicarbonates à 16 mmol/L, le point se situe en bas et à gauche du point de référence (7,40 ; 24 mmol/L).', vf, [0],
    'Le pH et les bicarbonates sont tous deux inférieurs aux valeurs de référence.', ['Lis les axes horizontal et vertical.', 'Compare 7,32 à 7,40 et 16 à 24.'],
    ['Il faut lire la concentration en bicarbonate sur l’axe vertical.', true, 'Le pH se lit sur l’axe horizontal.']),
  check('trouble', 5, 'Le bilan donne pH 7,32, HCO₃⁻ 16 mmol/L et PaCO₂ 32 mmHg. Quel couple associe le trouble primaire et l’évolution de la PaCO₂ ?', [
    'Acidose métabolique avec baisse compensatrice de PaCO₂', 'Acidose métabolique avec hausse compensatrice de PaCO₂', 'Acidose respiratoire avec baisse compensatrice de HCO₃⁻', 'Alcalose respiratoire avec hausse compensatrice de HCO₃⁻', 'Alcalose métabolique avec baisse compensatrice de PaCO₂',
  ], [0], 'Le pH est bas et le bicarbonate est diminué. La diminution de PaCO₂ tend au contraire à relever le pH.', ['Identifie la variable dont le changement abaisse le pH.', 'Une baisse de PaCO₂ contribue à augmenter le pH.'],
    ['Une baisse primaire de HCO₃⁻ peut produire une acidose métabolique.', true, 'La perte de base ou l’apport net d’acide abaisse le bicarbonate.']),
  check('compensation', 5, 'Le point T représente une acidose respiratoire aiguë sur l’isobare de PaCO₂ à 60 mmHg. Si la PaCO₂ reste élevée, quel point correspond à la compensation rénale ?', [
    'Le point A', 'Le point B', 'Le point C', 'Le point de référence', 'Le point T lui-même',
  ], [1], 'Le point B se trouve sur la même isobare que T. Les bicarbonates ont augmenté et le pH s’est rapproché de 7,40.', ['Suis l’isobare de 60 mmHg à partir de T.', 'La compensation rénale augmente le bicarbonate plasmatique et atténue l’acidémie.'],
  ['Si la PaCO₂ reste constante, une compensation rénale se lit sur la même isobare que le trouble respiratoire initial.', true, 'La concentration de bicarbonate et le pH varient le long de cette courbe.']),
  check('isobares', 5, 'Compare deux bilans. A : pH 7,47, PaCO₂ 32 mmHg, HCO₃⁻ 22,5 mmol/L. B : pH 7,48, PaCO₂ 48 mmHg, HCO₃⁻ 34,5 mmol/L. Quelles propositions sont exactes ?', [
    'A correspond à une alcalose respiratoire',
    'B correspond à une alcalose métabolique',
    'Si A persiste, la compensation rénale tend à diminuer le bicarbonate plasmatique',
    'Dans B, la hausse de PaCO₂ va dans le sens de la compensation respiratoire',
    'Dans les deux bilans, l’élévation du pH traduit une hausse primaire du bicarbonate',
  ], [0, 1, 2, 3], 'Dans A, la baisse primaire de PaCO₂ explique l’alcalémie. Si elle persiste, le rein abaisse le bicarbonate. Dans B, la hausse primaire du bicarbonate explique l’alcalémie. L’augmentation de PaCO₂ par hypoventilation tend à ramener le pH vers la normale.', ['Les deux pH sont élevés. Identifie, dans chaque bilan, le changement qui explique cette hausse.', 'La compensation agit sur l’autre composante du rapport HCO₃⁻/CO₂ dissous.'],
  ['Une alcalose métabolique peut être compensée par une hausse de PaCO₂.', true, 'L’hypoventilation augmente la PaCO₂, ce qui atténue l’alcalémie.']),
];
