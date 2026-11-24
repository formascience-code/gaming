import type { ReactNode } from 'react';
import type { Point } from './atlas';

const titles:Record<string,string>={
  pore:'Enveloppe et pore nucléaire',chromatine:'Un nucléosome','adn-liaison':'Nucléosome et ADN de liaison',enhancer:'Un enhancer éloigné du promoteur',brins:'Les deux brins d’ADN et l’ARN naissant',
  pic:'Assemblage au promoteur',ctd:'Le CTD de l’ARN polymérase II',coiffe:'Coiffe du transcrit',
  epissage:'De l’intron en lasso aux exons réunis',polya:'Clivage et queue poly(A)',export:'Export d’un ARNm',
  codons:'Lecture de l’ARNm par triplets',arntr:'Appariement codon–anticodon',charge:'Chargement d’un ARNt',
  init:'Initiation de la traduction',elong:'Un cycle d’élongation',stop:'Libération du polypeptide',regulation:'Contrôle de l’initiation',
};
const teal='#367b82',pale='#a9d4cf',dark='#2b3742',gold='#e4c683',coral='#cf9987',blue='#6b939f';

function text(x:number,y:number,value:string) {
  return <text x={x} y={y} textAnchor="middle" fill={dark} fontSize="13" fontWeight="500">{value}</text>;
}
function strand(x1:number,x2:number,y:number,color=teal) {
  return <path d={`M${x1} ${y}H${x2}`} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"/>;
}
function arrow(x1:number,x2:number,y:number) {
  const sign=Math.sign(x2-x1);
  return <path d={`M${x1} ${y}H${x2}M${x2-sign*6} ${y-4}L${x2} ${y}L${x2-sign*6} ${y+4}`} fill="none" stroke={dark} strokeWidth="1.7"/>;
}
function tag(x:number,y:number,w:number,value:string,color=pale) {
  return <><rect x={x-w/2} y={y-13} width={w} height="26" rx="8" fill={color}/>{text(x,y+4.5,value)}</>;
}
function porePicture(exporting:boolean) {
  return <>
    {text(80,26,'Cytosol')}{text(334,26,'Nucléoplasme')}
    {exporting?<><path d="M333 74C301 59 278 87 245 74S187 65 156 75S103 82 77 72"
      fill="none" stroke={coral} strokeWidth="3" strokeLinecap="round"/>
      {[110,154,255,297,325].map((x,i)=><circle key={x} cx={x} cy={[81,75,76,72,71][i]} r="4" fill={gold} stroke="#946e42"/>)}
      {arrow(155,76,108)}{text(96,133,'Sens de l’export')}</>:<>
      <path d="M155 103h14l23 13M254 103h-15l-5 17M205 51V37" fill="none" stroke={dark} strokeWidth="1.15"/>
      {text(85,105,'Membrane externe')}{text(329,105,'Membrane interne')}
      {text(204,30,'Complexe du pore')}
    </>}
  </>;
}
// Orientation conventionnelle du trèfle, avec le bras accepteur en haut.
function TransferRna({x,y,scale=1,flipped=false}:{x:number;y:number;scale?:number;flipped?:boolean}) {
  return <g transform={`translate(${x} ${y}) scale(${scale} ${flipped?-scale:scale})`}>
    <path d="M4-36V-5H10C11-19 29-18 29-6S14 9 10 2H4V12C16 17 12 31 0 31S-16 17-4 12V2H-10C-14 9-29 6-29-6S-11-19-10-5H-4V-29"
      fill="none" stroke="#774837" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round"/>
    <path d="M-4-22H4m-8 6h8m-8 6h8" fill="none" stroke="#774837" strokeWidth="1.4"/>
  </g>;
}

function Polymerase({x,y}:{x:number;y:number}) {
  return <g transform={`translate(${x} ${y})`}>
    <defs><linearGradient id="pol-volume" x2="0%" y2="100%"><stop stopColor="#e5d9f2"/><stop offset="1" stopColor="#a592c3"/></linearGradient></defs>
    <path d="M-79 9C-93-13-71-32-42-33C-20-35 26-35 52-30C77-25 89-11 84 7C80 23 59 29 34 29H-35C-58 29-72 22-79 9Z"
      fill="url(#pol-volume)" stroke="#63527f" strokeWidth="2.4"/>
    <path d="M-64-15C-48-26-10-26 21-24" fill="none" stroke="#f2eaf8" strokeWidth="3" strokeLinecap="round"/>
    {text(0,3,'ARN polymérase II')}
  </g>;
}

function ribosome(kind:string) {
  const initiating=kind==='init';
  const terminating=kind==='stop';
  const codons=initiating?['','AUG','GCU']:['GGC','UCU',terminating?'UAA':'UUU'];
  const rna='M24 93C63 109 80 91 111 91S159 103 195 100S241 89 275 98S346 87 386 97';
  return <>
    <path d="M67 87C47 64 61 22 91-5C122-33 164-46 206-45C264-44 315-20 338 20C351 43 358 72 344 86C331 99 307 99 281 96C252 93 227 94 201 96C171 98 149 95 119 96C95 97 78 98 67 87Z"
      fill="#c4d0b8" stroke="#617859" strokeWidth="2.6"/>
    <path d="M62 99C84 90 108 96 128 99C153 102 172 111 193 111C222 110 246 99 273 103C300 110 324 98 344 104C362 109 357 126 343 136C326 151 301 153 274 152C242 150 231 161 193 161C153 161 136 150 109 146C84 144 64 131 58 115C56 108 56 103 62 99Z"
      fill="#b5ced9" stroke="#50788a" strokeWidth="2.6"/>
    {text(75,68,'60S')}{text(81,124,'40S')}
    {[126,200,274].map((x,i)=><g key={x}>
      <path d={`M${x-29} 85V58a29 29 0 0 1 58 0v27`} fill="#dde5d4" stroke="#818f73" strokeWidth="1.5"/>
      <circle cx={x} cy="14" r="11" fill="#3a513e"/>
      <text x={x} y="19" textAnchor="middle" fill="white" fontSize="15" fontWeight="700">{['E','P','A'][i]}</text>
      {codons[i]&&<text x={x} y="127" textAnchor="middle" fill="#273e62" fontSize="13" fontWeight="700">{codons[i]}</text>}
    </g>)}
    <TransferRna x={200} y={68} scale={.7}/>
    {initiating?<circle cx="203" cy="40" r="4.3" fill={gold} stroke="#93652f"/>:
      <g fill={gold} stroke="#93652f"><path d="m203 40 8-7 8 2 7-7" fill="none"/>
        {[[203,40],[210,33],[218,35],[225,28]].map(([x,y])=><circle key={x} cx={x} cy={y} r="3.2"/>)}</g>}
    {!initiating&&(terminating?
      <ellipse cx="274" cy="67" rx="13" ry="21" fill="#bba9cf" stroke="#624776" strokeWidth="2" transform="rotate(17 274 67)"/>:
      <><TransferRna x={274} y={68} scale={.7}/><circle cx="277" cy="40" r="4.3" fill={gold} stroke="#93652f"/></>)}
    <path d={rna} fill="none" stroke="#fff9ec" strokeWidth="7"/>
    <path d={rna} fill="none" stroke="#432c52" strokeWidth="3.3" strokeLinecap="round"/>
    <path d="M196 91v7m4-7v7m4-7v7" stroke="#774837" strokeWidth="1" strokeDasharray="1 1"/>
    {!initiating&&!terminating&&<path d="M270 91v6m4-6v6m4-6v6" stroke="#774837" strokeWidth="1" strokeDasharray="1 1"/>}
    {text(38,87,'5′')}{text(380,85,'3′')}{text(36,117,'ARNm')}
    {text(200,149,initiating?'ARNt initiateur (Met) au site P':terminating?'Facteur eRF1 au site A':'Avant le transfert du peptide')}
  </>;
}
function drawing(id:string):ReactNode {
  switch(id){
    case 'pore':return porePicture(false);
    case 'export':return porePicture(true);
    case 'adn-liaison':
    case 'chromatine':return <>
      <defs><linearGradient id="histone-color" x1="0%" y1="0%" x2="0%" y2="100%"><stop stopColor="#f5e1ae"/><stop offset="1" stopColor="#d4aa6f"/></linearGradient></defs>
      <path d="M29 77H112C124 77 130 72 136 63C144 45 170 39 199 37
        C239 32 272 43 283 60C295 80 269 96 235 101"
        fill="none" stroke="#84aaa8" strokeWidth="4" strokeDasharray="3 4" strokeLinecap="round"/>
      <path d="M152 62C153 45 186 37 216 38C246 38 271 47 272 63V81C269 99 246 110 213 110
        C182 110 152 101 152 83Z" fill="url(#histone-color)" stroke="#a88b55" strokeWidth="1.6"/>
      <ellipse cx="212" cy="62" rx="60" ry="24" fill="#f2dfb0" stroke="#b59661" strokeWidth="1.4"/>
      <path d="M29 77H112C128 77 139 67 151 61C167 53 189 52 213 53
        C243 54 271 64 276 76C280 89 256 101 230 104C198 109 164 103 148 92
        C136 84 139 72 150 66M232 104C254 111 270 112 293 112H390"
        fill="none" stroke={teal} strokeWidth="4" strokeLinecap="round"/>
      <path d="M70 58V71M212 33V40" stroke={dark} strokeWidth="1.2"/>
      {text(70,52,'ADN')}{text(212,25,'Octamère d’histones')}{text(322,133,'ADN de liaison')}
    </>;
    case 'brins':return <>
      {text(204,18,'Brin codant 5′–ATG–3′')}{strand(94,325,32)}
      {text(203,57,'Brin matrice 3′–TAC–5′')}{strand(94,325,70,blue)}
      {arrow(100,320,84)}{strand(94,285,104,coral)}{text(202,128,'ARN 5′–AUG–3′')}
    </>;
    case 'enhancer':return <>
      <path d="M36 105H115C159 105 128 68 150 45C174 14 236 15 260 43C284 70 254 105 300 105H382"
        fill="none" stroke={teal} strokeWidth="4" strokeLinecap="round"/>
      {tag(204,26,80,'Enhancer',gold)}{tag(301,105,87,'Promoteur')}
      <ellipse cx="204" cy="54" rx="36" ry="15" fill="#bba9cf" stroke="#624776" strokeWidth="1.6"/>
      {text(204,59,'Activateur')}
      <path d="M239 59Q275 64 296 92" fill="none" stroke={dark} strokeWidth="1.5" strokeDasharray="3 4"/>
      {arrow(309,380,127)}{text(110,131,'ADN replié')}
    </>;
    case 'pic':return <>
      <Polymerase x={273} y={63}/>
      <path d="M89 80C82 71 88 53 102 49C114 43 119 49 127 47C141 40 159 49 158 63C159 75 147 81 137 78C123 68 119 70 108 79C103 84 94 85 89 80Z"
        fill="#e5bd86" stroke="#9b6e3f" strokeWidth="2.2"/>
      <path d="M97 61Q107 51 118 54" fill="none" stroke="#fff0cd" strokeWidth="2.5" strokeLinecap="round"/>
      {text(123,64,'TBP')}
      <path d="M24 92H88Q105 92 115 84Q126 75 137 85Q148 92 164 92H387M24 98H88Q105 98 119 89Q126 84 133 90Q148 98 164 98H387" fill="none" stroke={teal} strokeWidth="2"/>
      {text(125,116,'Boîte TATA')}{arrow(199,380,114)}{text(289,137,'Sens de transcription')}
    </>;
    case 'ctd':return <>
      <path d="M29 110H378M29 116H378" fill="none" stroke={teal} strokeWidth="2.4"/>
      <path d="M186 82C208 100 203 61 232 65S266 99 294 79S324 58 347 70" fill="none" stroke="#744f8a" strokeWidth="4" strokeLinecap="round"/>
      <Polymerase x={112} y={78}/>
      <g fill="#fbdfa1" stroke="#856033" strokeWidth="1.3">
        <circle cx="219" cy="66" r="8"/><circle cx="262" cy="83" r="8"/><circle cx="308" cy="69" r="8"/>
      </g>
      <g fill={dark} fontSize="9" fontWeight="700" textAnchor="middle"><text x="219" y="69">P</text><text x="262" y="86">P</text><text x="308" y="72">P</text></g>
      <path d="M255 55C242 52 241 39 251 34Q260 30 266 33C272 23 290 26 294 37C302 46 294 55 283 56Q267 48 260 58Z" fill="#dfad95" stroke="#a06454" strokeWidth="2"/>
      <path d="M262 56l-3 17" stroke="#a06454" strokeWidth="1.5"/>
      {text(275,19,'Facteur de maturation')}{text(282,138,'CTD phosphorylé')}{text(66,132,'ADN')}
    </>;
    case 'coiffe':return <>
      {tag(67,70,63,'m⁷G',gold)}{strand(102,183,70,blue)}
      {[112,139,166].map(x=><g key={x}><circle cx={x} cy="70" r="9" fill="#e7dbc0" stroke="#a18a57"/>{text(x,75,'P')}</g>)}
      {strand(183,370,70,coral)}{text(64,41,'7-méthylguanosine')}{text(141,107,'Pont 5′–5′')}
      {text(206,96,'5′')}{text(361,96,'3′')}{text(276,51,'Pré-ARNm')}
    </>;
    case 'epissage':return <>
      {tag(66,37,82,'Exon 1')}{tag(352,37,82,'Exon 2')}
      <path d="M108 37H311" stroke={coral} strokeWidth="4"/>
      <circle cx="243" cy="37" r="8" fill={gold}/>{text(243,42,'A')}{text(221,21,'Point de branchement')}
      {tag(63,108,80,'Exon 1')}{tag(143,108,80,'Exon 2')}
      <path d="M268 109C222 111 221 65 252 68C283 68 292 101 268 109Z M268 109L315 126"
        fill="none" stroke={coral} strokeWidth="3.6"/>
      <circle cx="268" cy="109" r="6" fill={gold}/><text x="268" y="112" textAnchor="middle" fontSize="8" fill={dark}>A</text>{text(324,60,'Intron excisé')}{text(342,106,'Liaison 2′–5′')}<path d="M276 110L295 104" stroke={dark} fill="none"/>{text(327,134,'3′')}
    </>;
    case 'polya':return <>
      {strand(52,371,44,coral)}{text(130,30,'Pré-ARNm')}{text(283,30,'Clivage')}
      <path d="m275 36 15 16m0-16-15 16" stroke={dark} strokeWidth="2"/>
      {strand(52,278,94,coral)}{tag(326,94,106,'AAAAAA',gold)}{text(190,121,'Extrémité 3′ maturée')}
    </>;
    case 'codons':case 'arntr':return <>
      {text(57,62,'5′')}{tag(119,58,79,'AUG',gold)}{tag(208,58,79,'GAA')}{tag(297,58,79,'GCU')}{text(365,62,'3′')}
      {id==='arntr'?<>
        <path d="M107 72v13m12-13v13m12-13v13" stroke={teal} strokeDasharray="3 3"/>
        <TransferRna x={119} y={111} scale={.76} flipped/>
        {text(240,101,'Anticodon 3′–UAC–5′')}
      </>:<>{arrow(83,337,100)}{text(210,126,'Sens de lecture')}</>}
    </>;
    case 'charge':return <>
      {tag(91,55,125,'Acide aminé',gold)}{tag(91,92,56,'ATP')}{arrow(159,247,71)}
      <TransferRna x={301} y={77} scale={1.25}/>
      <path d="M306 32L323 23" fill="none" stroke="#774837" strokeWidth="2.4" strokeLinecap="round"/><circle cx="328" cy="20" r="6" fill={gold} stroke="#98723d" strokeWidth="1.5"/>
      {text(365,32,'CCA 3′')}{text(254,38,'5′ libre')}{text(301,138,'ARNt chargé')}
    </>;
    case 'init':case 'elong':case 'stop':return ribosome(id);
    case 'regulation':return <>
      {strand(47,375,108,coral)}{tag(67,108,67,'Coiffe',gold)}
      {tag(154,70,82,'eIF4E')}{tag(154,31,82,'4E-BP',gold)}{tag(301,70,90,'eIF4G',pale)}
      <path d="M154 44v13m58 13h28m-16-7 12 14m0-14-12 14" stroke={dark} strokeWidth="2"/>
      {text(304,30,'Interaction freinée')}
    </>;
    default:return null;
  }
}

export function ChallengeVisual({id,point}:{id:string;point:Point}) {
  return <g className="cell-detail-art" role="img" aria-label={titles[id]} transform={`translate(${point.join(' ')}) scale(.24)`}>
    <g transform="translate(-205 -74)">{drawing(id)}</g>
  </g>;
}

export function challengeTitle(id:string) {
  return titles[id];
}
