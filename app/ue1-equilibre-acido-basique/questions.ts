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
  'Un bicarbonate bas est le signe du trouble primaire dans ce cas. La baisse de la PaCO₂ atténue l’acidémie par compensation respiratoire.',
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
  check('glycolyse', 1, 'Quelles propositions décrivent le devenir du glucose dans la cellule ?', [
    'La glycolyse se déroule dans le cytosol', 'La glycolyse produit du pyruvate', 'La glycolyse se déroule dans la matrice', 'La glycolyse libère directement du CO₂', 'Tout le pyruvate est obligatoirement converti en lactate',
  ], [0, 1], 'La glycolyse cytosolique forme du pyruvate sans libérer de CO₂.', ['Repère la première flèche.', 'Lis le nom de la molécule à son extrémité.'],
  ['Le pyruvate est un produit de la glycolyse.', true, 'Un glucose donne deux pyruvates.']),
  check('co2', 1, 'Le CO₂ issu du métabolisme peut conduire à la formation de H⁺ et de HCO₃⁻.', vf, [0],
    'Le CO₂ hydraté donne de l’acide carbonique, qui peut se dissocier en H⁺ et HCO₃⁻.', ['Suis la voie mitochondriale.', 'Lis l’équilibre sous la mitochondrie.'],
    ['L’hydratation du CO₂ participe à l’équilibre bicarbonate.', true, 'La réaction globale s’écrit CO₂ + H₂O ⇌ H⁺ + HCO₃⁻.']),
  check('lactate', 1, 'La réduction du pyruvate en lactate par la lactate déshydrogénase libère directement un H⁺.', vf, [1],
    'Dans le bilan indiqué, la réduction du pyruvate consomme un H⁺. L’hydrolyse de l’ATP constitue une réaction distincte.', ['Regarde de quel côté de la flèche figure H⁺.', 'Compare la réaction de la LDH et l’hydrolyse de l’ATP.'],
    ['Dans la réaction montrée, la LDH régénère du NAD⁺.', true, 'Le NADH est oxydé en NAD⁺ pendant la réduction du pyruvate.']),
  check('mct', 1, 'Quel transporteur peut faire sortir ensemble le lactate et un H⁺ ?', [
    'MCT', 'NHE', 'AE', 'Na⁺/K⁺-ATPase', 'CFTR',
  ], [0], 'MCT cotransporte le lactate et H⁺. Le sens dépend des gradients.', ['Cherche la sortie qui porte les deux espèces.', 'NHE échange Na⁺ et H⁺.'],
  ['MCT est un cotransporteur de lactate et de proton.', true, 'Les deux espèces se déplacent dans le même sens.']),

  check('estomac', 2, 'Quelles propositions décrivent la sécrétion de la cellule pariétale ?', [
    'La H⁺/K⁺-ATPase est apicale', 'Les H⁺ sont sécrétés vers la lumière gastrique', 'La H⁺/K⁺-ATPase est basolatérale', 'K⁺ sort vers la lumière par la H⁺/K⁺-ATPase', 'La pompe apicale sécrète les bicarbonates',
  ], [0, 1], 'La pompe apicale expulse H⁺ vers la lumière en échange de K⁺.', ['Repère le côté apical.', 'Suis les deux flèches de la pompe.'],
  ['La H⁺/K⁺-ATPase apicale fait entrer K⁺ dans la cellule pariétale.', true, 'K⁺ entre en échange du proton sécrété.']),
  check('bicarbonate-sang', 2, 'Lorsque la cellule pariétale sécrète des H⁺, des bicarbonates peuvent sortir du côté basolatéral.', vf, [0],
    'L’échangeur basolatéral Cl⁻/HCO₃⁻ permet la sortie de bicarbonate vers le milieu interstitiel et l’entrée de Cl⁻.', ['Regarde le côté opposé à la lumière.', 'Suis la flèche HCO₃⁻.'],
    ['Le Cl⁻ peut entrer dans la cellule pariétale en échange de HCO₃⁻ au pôle basolatéral.', true, 'Les deux ions circulent en sens opposés.']),
  check('pancreas', 2, 'Quel est le rôle du bicarbonate sécrété par les canaux pancréatiques ?', [
    'Tamponner le contenu acide qui arrive dans le duodénum', 'Acidifier directement la lumière gastrique', 'Empêcher la sortie de H⁺ par le rein', 'Transporter l’oxygène', 'Transformer directement le lactate en pyruvate',
  ], [0], 'Le bicarbonate pancréatique rejoint le duodénum, où il tamponne l’acidité du chyme.', ['Suis le canal vers l’intestin.', 'Le bicarbonate est la base du couple CO₂/HCO₃⁻.'],
  ['Le suc pancréatique riche en bicarbonate rejoint le duodénum.', true, 'Il est déversé dans le duodénum par le système canalaire pancréatique.']),
  check('polarite', 2, 'Dans les cellules canalaires pancréatiques, le pôle apical fait face à la lumière du canal.', vf, [0],
    'Le pôle apical borde le canal. Le pôle basolatéral est tourné vers le milieu interstitiel.', ['Repère le trajet du bicarbonate sécrété.', 'Cherche CFTR du côté de la lumière.'],
    ['Le pôle basolatéral borde la lumière du canal pancréatique.', false, 'C’est le pôle apical qui lui fait face.']),

  check('hematie', 3, 'Quels événements participent au transport du CO₂ au niveau des tissus ?', [
    'Le CO₂ diffuse dans l’hématie', 'L’anhydrase carbonique accélère l’hydratation du CO₂', 'L’hémoglobine peut fixer des H⁺', 'Le CO₂ est expiré au niveau des tissus', 'L’anhydrase carbonique transforme le CO₂ en oxygène',
  ], [0, 1, 2], 'Le CO₂ tissulaire gagne l’hématie. Son hydratation est catalysée par l’anhydrase carbonique et l’hémoglobine peut tamponner les H⁺.', ['Suis le CO₂ depuis le tissu.', 'Repère le devenir des deux produits de l’équilibre.'],
  ['L’hémoglobine peut agir comme tampon dans l’hématie.', true, 'Elle fixe ou libère des H⁺ selon les conditions locales.']),
  check('hamburger', 3, 'Dans le capillaire tissulaire, le bicarbonate sort de l’hématie en échange de chlorure.', vf, [0],
    'Le bicarbonate produit dans l’hématie passe vers le plasma tandis que le chlorure entre.', ['Regarde les flèches de part et d’autre de la membrane.', 'L’échange est inversé au niveau pulmonaire.'],
    ['Au niveau des tissus, la sortie de bicarbonate peut être couplée à une entrée de Cl⁻.', true, 'Cet échange électroneutre est le déplacement chlorure-bicarbonate.']),
  check('alveole', 3, 'Au poumon, quel trajet suit le CO₂ destiné à être expiré ?', [
    'Du sang capillaire vers l’air alvéolaire', 'De l’air alvéolaire vers le sang capillaire', 'Du tubule rénal vers l’alvéole', 'De la lumière gastrique vers le capillaire pulmonaire', 'Du plasma vers les voies aériennes uniquement sous forme de bicarbonate',
  ], [0], 'Le CO₂ moléculaire diffuse du sang vers l’air alvéolaire en suivant son gradient de pression partielle.', ['Repère la barrière air-sang.', 'Le CO₂ est finalement expiré.'],
  ['Le bicarbonate peut être reconverti en CO₂ au niveau pulmonaire.', true, 'La réaction inverse fournit du CO₂ diffusible vers l’alvéole.']),
  check('ventilation', 3, 'À production de CO₂ constante, augmenter la ventilation alvéolaire tend à diminuer la PaCO₂.', vf, [0],
    'Une hausse de la ventilation alvéolaire augmente l’élimination du CO₂ et abaisse sa pression partielle artérielle.', ['Imagine une augmentation du renouvellement de l’air alvéolaire.', 'Le CO₂ est éliminé plus efficacement.'],
    ['Une hypoventilation alvéolaire peut faire monter la PaCO₂.', true, 'À production constante, l’élimination est réduite.']),

  check('filtration', 4, 'Le bicarbonate plasmatique peut atteindre la lumière du néphron par filtration glomérulaire.', vf, [0],
    'Le bicarbonate est filtré au glomérule avant d’être très largement récupéré le long du tubule.', ['Suis le filtrat depuis le corpuscule.', 'La récupération intervient après la filtration.'],
    ['Le bicarbonate filtré entre d’abord dans l’espace de Bowman.', true, 'Il suit le filtrat vers le tubule proximal.']),
  check('proximal', 4, 'Dans le tubule proximal, quelle espèce diffuse dans la cellule après la réaction luminale entre H⁺ et HCO₃⁻ ?', [
    'CO₂', 'Ca²⁺', 'Hémoglobine', 'O₂ produit par cette réaction', 'NH₄⁺ produit par cette réaction',
  ], [0], 'La réaction des H⁺ sécrétés avec le bicarbonate filtré forme du CO₂, qui entre dans la cellule. Le bicarbonate y est reformé puis exporté vers le sang.', ['Suis la conversion dans la lumière.', 'Cherche une espèce neutre qui traverse la membrane.'],
    ['La récupération d’un bicarbonate filtré ne constitue pas à elle seule une excrétion nette d’acide.', true, 'Le H⁺ sécrété pour cette récupération est recyclé.']),
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
  check('trouble', 5, 'Le bilan donne pH 7,32, HCO₃⁻ 16 mmol/L et PaCO₂ 32 mmHg. Quel trouble primaire explique l’acidémie ?', [
    'Une acidose métabolique', 'Une acidose respiratoire', 'Une alcalose métabolique', 'Une alcalose respiratoire', 'Un équilibre acido-basique normal',
  ], [0], 'Le pH est bas et le bicarbonate est diminué. La diminution de PaCO₂ tend au contraire à relever le pH.', ['Identifie la variable dont le changement abaisse le pH.', 'Une baisse de PaCO₂ contribue à augmenter le pH.'],
    ['Une baisse primaire de HCO₃⁻ peut produire une acidose métabolique.', true, 'La perte de base ou l’apport net d’acide abaisse le bicarbonate.']),
  check('compensation', 5, 'Ce bilan est compatible avec une compensation respiratoire par augmentation de la ventilation alvéolaire.', vf, [0],
    'L’augmentation de la ventilation alvéolaire diminue la PaCO₂ et atténue l’acidémie.', ['Compare la PaCO₂ à 40 mmHg.', 'Reviens à la mission sur la ventilation.'],
    ['Dans une acidose métabolique, la compensation respiratoire attendue fait baisser la PaCO₂.', true, 'La ventilation accrue aide à éliminer le CO₂.']),
  check('isobares', 5, 'Sur le diagramme de Davenport, que relient les courbes isobares ?', [
    'Des points de même PaCO₂', 'Des points de même pH', 'Des points de même bicarbonate', 'Des points de même pression partielle en O₂', 'Des points de même débit de filtration glomérulaire',
  ], [0], 'Chaque courbe réunit les couples pH et bicarbonate compatibles avec une même PaCO₂.', ['Lis les valeurs portées près des courbes.', 'Une isobare indique une pression constante.'],
    ['Deux points sur une même isobare peuvent avoir des pH différents.', true, 'Le bicarbonate varie aussi le long de l’isobare.']),
];
