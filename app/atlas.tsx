import { memo, type ReactNode } from 'react';

export type Point = [number,number];
export type Zone = 'outside' | 'cytoplasm' | 'nucleus';
export const inside:Point=[198,341];
export const pore:Point=[480,385];
export const nuclearArrival:Point=[521,385];
export const nuclearCenter:Point=[618,352];
export const freeRibosome:Point=[298,371];
export const cellOutline='M103 348C108 223 239 129 360 102C477 77 576 39 702 71C843 100 914 179 927 293C946 411 856 500 781 576C687 674 553 699 413 671C282 649 174 603 127 511C99 455 91 401 103 348Z';
export const structures=[
  {id:'nucleus',label:'Noyau',point:[669,251] as Point,tag:[754,222] as Point,color:'#71b7bd',description:'Le noyau contient la majeure partie de l’ADN cellulaire. Son enveloppe comporte deux membranes et des complexes de pores nucléaires.'},
  {id:'er',label:'Réticulum rugueux',point:[617,555] as Point,tag:[643,616] as Point,color:'#44a5a6',description:'La membrane nucléaire externe est continue avec celle du réticulum endoplasmique. Les points sombres figurent les ribosomes fixés à la face cytosolique du réticulum rugueux.'},
  {id:'golgi',label:'Appareil de Golgi',point:[746,175] as Point,tag:[815,111] as Point,color:'#298e93',description:'Le Golgi est formé de saccules. La face cis reçoit le matériel provenant du réticulum. La face trans trie et dirige le matériel vers ses destinations.'},
  {id:'mito',label:'Mitochondrie',point:[285,248] as Point,tag:[238,165] as Point,color:'#cb705e',description:'Deux membranes délimitent la mitochondrie. Les crêtes sont des replis de la membrane interne qui s’avancent dans la matrice.'},
  {id:'membrane',label:'Membrane plasmique',point:[134,509] as Point,tag:[165,583] as Point,color:'#a09480',description:'La membrane plasmique sépare le cytoplasme du milieu extracellulaire. Le déplacement du joueur à travers le contour représente un changement de point de vue.'},
  {id:'chromatin',label:'Chromatine',point:[596,298] as Point,tag:[571,271] as Point,color:'#517f87',description:'La chromatine associe l’ADN à des protéines, notamment les histones. Les plages plus soutenues près de l’enveloppe illustrent une chromatine plus condensée.'},
  {id:'nucleolus',label:'Nucléole',point:[661,398] as Point,tag:[682,449] as Point,color:'#b19858',description:'Le nucléole participe à la production des ARN ribosomiques et à l’assemblage des sous-unités des ribosomes. C’est un domaine du noyau dépourvu de membrane.'},
  {id:'ribosome',label:'Ribosomes libres',point:freeRibosome,tag:[297,355] as Point,color:'#4c8589',description:'Les ribosomes lisent les codons de l’ARNm et assemblent le polypeptide.'},
  {id:'pore',label:'Pore nucléaire',point:pore,tag:[411,366] as Point,color:'#277a82',description:'Les deux membranes nucléaires se rejoignent au bord de chaque pore. Le complexe du pore contrôle les échanges de macromolécules entre cytosol et nucléoplasme.'},
] as const;
export type Structure=(typeof structures)[number];
const holeAngles=[.10,.47,.83,1.17,1.53,2.32,2.74,2.91,3.53,3.89,4.34,4.77,5.07,5.53,5.92];
const poreRotation=Math.atan2(pore[1]-352,pore[0]-618)*180/Math.PI;
const holes=holeAngles.map(a=>[+(618+140*Math.cos(a)).toFixed(3),+(352+140*Math.sin(a)).toFixed(3)] as Point);
holes[7]=pore;
const outlineMito='M-87-3C-90-29-66-45-36-42C-8-39 11-35 39-40C65-45 86-31 87-8C89 18 67 38 39 39C12 41-10 33-36 39C-62 43-84 23-87-3Z';
const foldsMito='M-75-3C-78-21-62-32-45-32C-38-32-39-23-39-15L-42 7C-43 15-33 17-31 8L-27-22C-26-31-12-28-6-27C0-26 1-23-1-13L-7 14C-8 22 1 23 4 15L11-19C13-29 27-27 36-29C43-30 46-26 44-18L40 5C39 13 48 15 50 6L56-22C58-27 64-23 69-18C84-1 73 16 57 25C42 34 27 28 20 28C13 28 16 17 18 7C19-1 11-3 8 6L2 25C0 31-11 26-17 26C-24 25-23 20-22 14L-19-5C-17-12-27-14-29-6L-35 25C-37 31-48 29-54 26C-65 21-74 12-75-3Z';
const reticulum=[
'M488 411C463 420 455 454 474 481C496 515 536 530 588 536C653 544 713 523 751 488',
'M442 388C420 421 430 470 456 501C493 545 554 563 626 563C697 563 764 525 791 473',
'M431 469C443 517 483 555 539 578C599 602 657 595 706 577',
'M505 261C473 269 440 300 430 343',
'M452 278C416 300 395 337 397 378',
'M770 316C794 347 791 404 777 435',
'M803 335C826 381 811 436 805 448',
];
const rerDots=[[464,439],[466,461],[480,489],[500,506],[527,522],[560,533],[603,538],[648,533],[687,525],[725,507],[433,408],[428,430],[435,465],[451,492],[475,515],[511,538],[540,552],[575,560],[618,565],[654,560],[691,553],[730,535],[763,509],[780,491],[450,514],[470,538],[495,560],[526,577],[556,587],[598,596],[641,596],[680,586],[480,271],[452,291],[435,318],[422,339],[434,290],[413,315],[401,342],[394,371],[779,329],[786,358],[794,383],[788,412],[778,438],[812,352],[818,389],[812,422],[804,447]];
const fibers=[
'M131 359Q151 274 210 225M127 413Q153 542 265 591Q297 608 342 612',
'M192 535Q223 547 271 571M819 504Q865 461 886 405',
'M309 125Q381 155 462 122T620 93',
'M803 181Q858 225 886 292',
'M696 622Q738 598 782 561',
];
const freeRibosomes=[freeRibosome,[356,203],[364,215],[375,208],[389,270],[396,282],[381,283],[355,388],[366,399],[341,400],[332,492],[344,502],[322,503],[814,235],[827,230],[826,243],[868,378],[882,385],[855,384],[695,603],[708,611],[709,598],[291,570],[302,577],[292,583]];
const vesicles:[[number,number,number,string],...Array<[number,number,number,string]>]=[[235,320,15,'#d3be75'],[264,342,12,'#e6d098'],[197,303,10,'#e5d098'],[354,144,16,'#95ba93'],[397,157,11,'#a1bc97'],[188,457,17,'#9fbd98'],[422,609,13,'#e3b795'],[459,624,9,'#dfba92'],[842,292,14,'#a4c6a0'],[759,584,12,'#a4c6a0']];
export const CellArt=memo(function CellArt({nucleusRef,cellRef,detailId,detailArt}:{
  nucleusRef:React.RefObject<SVGCircleElement|null>;
  cellRef:React.RefObject<SVGPathElement|null>;
  detailId?:string;
  detailArt?:ReactNode;
}) {
  const ribosomeDetail=detailId&&['codons','arntr','init','elong','stop','regulation'].includes(detailId);
  const nuclearDetail=detailId&&['chromatine','adn-liaison','enhancer','brins','pic','ctd','coiffe','epissage','polya'].includes(detailId);
  return <>
    <defs>
      <filter id="paper" x="-25%" y="-30%" width="165%" height="175%" colorInterpolationFilters="sRGB"><feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#233837" floodOpacity=".29"/></filter>
      <filter id="cell-paper" x="-15%" y="-20%" width="145%" height="155%" colorInterpolationFilters="sRGB"><feDropShadow dx="9" dy="15" stdDeviation="11" floodColor="#071f24" floodOpacity=".42"/></filter>
      <mask id="envelope-cuts" x="450" y="190" width="335" height="322" maskUnits="userSpaceOnUse">
        <rect x="450" y="190" width="335" height="322" fill="white"/>
        {holes.map(([x,y],i)=>i===7?<rect key={i} x="-11" y="-11" width="22" height="22" fill="black" transform={`translate(${x} ${y}) rotate(${poreRotation})`}/>:<circle key={i} cx={x} cy={y} r="6.6" fill="black"/>)}
      </mask>
      <clipPath id="nuclear-field"><circle cx="618" cy="352" r="131"/></clipPath>
    </defs>
    <path d={cellOutline} fill="#f4e6d9" stroke="#fff5e7" strokeWidth="9" filter="url(#cell-paper)"/>
    <path ref={cellRef} d={cellOutline} fill="transparent" stroke="#c6b8a6" strokeWidth="1.3"/>
    <g fill="none" strokeLinecap="round" opacity=".78" filter="url(#paper)">
      {fibers.map((d,i)=><path key={d} d={d} stroke={i%2===0?'#9da67b':'#b78f9e'} strokeWidth={i<2?3.3:3.9}/>)}
    </g>
    {vesicles.map(([x,y,r,c])=><circle key={x} cx={x} cy={y} r={r} fill={c} stroke="#fff3dd" strokeWidth="1.2" filter="url(#paper)"/>)}
    <g fill="#315e62" opacity=".83">{freeRibosomes.filter(point=>!ribosomeDetail||point!==freeRibosome).map(([x,y])=><circle key={x+','+y} cx={x} cy={y} r="3.1"/>)}</g>
    <g fill="none" strokeLinecap="round" strokeLinejoin="round" filter="url(#paper)">
      {reticulum.map(d=><path d={d} key={d} stroke="#429b9e" strokeWidth="13"/>)}
      {reticulum.map(d=><path d={d} key={d} stroke="#83c8c5" strokeWidth="7"/>)}
    </g>
    <path d="M485 396C485 423 459 430 464 451C474 487 518 521 568 530" fill="none" stroke="#429b9e" strokeWidth="12" strokeLinecap="round"/>
    <path d="M485 396C485 423 459 430 464 451C474 487 518 521 568 530" fill="none" stroke="#83c8c5" strokeWidth="6" strokeLinecap="round"/>
    <g fill="#2c6469">{rerDots.map(([x,y])=><circle key={x+','+y} cx={x} cy={y} r="3"/>)}</g>
    <g transform="translate(414 296)" strokeLinecap="round" fill="none" filter="url(#paper)">
      <path d="M0 17c-29 13-42 38-33 65s-5 39-20 50M-12 41c-21 5-40-3-48 15s10 22 5 39m24-15c10 5 15 19 8 28" stroke="#549598" strokeWidth="11"/>
      <path d="M0 17c-29 13-42 38-33 65s-5 39-20 50M-12 41c-21 5-40-3-48 15s10 22 5 39m24-15c10 5 15 19 8 28" stroke="#8fc0b8" strokeWidth="6"/>
    </g>
    <g filter="url(#paper)">
      <path d="M693 118C718 125 736 154 764 148C790 141 800 128 809 139C821 157 786 174 760 171C729 172 699 151 686 137C676 126 682 116 693 118Z" fill="#377e85"/>
      <path d="M677 145C700 156 726 181 755 183C781 184 803 162 815 175C827 193 790 210 753 207C718 204 683 177 667 161C659 149 666 139 677 145Z" fill="#368e93"/>
      <path d="M671 177C697 192 711 214 748 220C773 224 797 210 809 222C820 240 778 250 747 244C715 238 689 221 676 207C649 184 655 168 671 177Z" fill="#4ba5a4"/>
      <path d="M680 213C700 227 713 249 749 257C765 261 784 253 788 263C796 282 764 284 741 279C709 270 680 244 670 232C662 221 670 205 680 213Z" fill="#6db8b3"/>
      <circle cx="768" cy="116" r="9" fill="#5ca3a2"/><circle cx="789" cy="107" r="6" fill="#438d95"/><circle cx="824" cy="158" r="5" fill="#438d95"/>
      <circle cx="735" cy="286" r="6" fill="#80bdba"/><circle cx="710" cy="268" r="4" fill="#6db8b3"/>
    </g>
    {[[274,242,-31,1],[282,534,24,.97],[473,592,-8,.86],[838,372,-62,.73]].map(([x,y,r,s])=>
      <g key={x} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} filter="url(#paper)">
        <path d={outlineMito} fill="#efaa97" stroke="#b95f50" strokeWidth="3.1"/>
        <path d={foldsMito} fill="#f8d5c7" stroke="#c96956" strokeWidth="4.2" strokeLinejoin="round"/>
      </g>)}
    <g transform="translate(297 419) rotate(-30)" filter="url(#paper)">
      {[0,1].map(i=><g key={i} transform={i===0?'translate(-24 -6)':'translate(16 13) rotate(82)'}>
        <rect x="-13" y="-36" width="27" height="63" rx="6" fill="#d4bc9f" stroke="#a89781"/>
        {[-8,-3,2,7].map(x=><path key={x} d={`M${x} -29v51`} stroke="#aa987d" strokeWidth="1.4"/>)}
        <ellipse cy="-33" rx="13.5" ry="6" fill="#ead2ac" stroke="#9f8870" strokeWidth="1.3" />
      </g>)}
    </g>
    <circle cx="618" cy="352" r="145" fill="#93c6c6" filter="url(#paper)"/>
    <circle ref={nucleusRef} cx="618" cy="352" r="131" fill="#b9dbd8"/>
    <g clipPath="url(#nuclear-field)">
      <g fill="#719da4" opacity=".50">
        <path d="M500 313C521 228 575 221 601 230C575 256 579 257 551 269C527 278 530 302 500 313Z"/>
        <path d="M705 253C748 278 761 314 744 347C727 330 715 329 714 301C711 280 693 273 705 253Z"/>
        <path d="M520 422C548 425 554 449 594 447C608 446 614 470 605 483C569 483 515 451 520 422Z"/>
        <path d="M677 463C675 439 701 439 713 418C731 392 745 403 743 422C732 450 707 480 677 463Z"/>
      </g>
      <g fill="none" stroke="#689ba1" strokeWidth="2.7" strokeLinecap="round" opacity=".8">
        <path d="M518 361C503 355 513 329 531 332C553 337 556 367 543 381C526 399 548 417 570 410C595 402 572 386 593 375C612 366 621 388 609 404C596 422 617 440 639 429"/>
        <path d="M550 306C560 284 582 311 595 296C613 272 581 258 596 243C608 231 630 253 625 267C617 289 647 296 658 275C670 251 690 256 698 271"/>
        <path d="M705 305C725 301 734 333 714 339C701 344 683 325 668 336C649 352 681 358 694 355C719 354 734 376 719 391C708 400 685 387 684 412"/>
        {!nuclearDetail&&<path d="M567 323C552 349 598 357 609 335C621 309 644 312 650 330C657 353 630 354 626 372"/>}
        <path d="M637 454C652 472 675 467 687 457"/>
      </g>
      <path d="M631 386C640 369 660 367 675 374C694 384 694 404 681 418C668 430 640 426 632 414C626 405 625 396 631 386Z" fill="#f3e7bd" stroke="#e3d5a6" strokeWidth="2" filter="url(#paper)"/>
    </g>
    <g mask="url(#envelope-cuts)" fill="none" stroke="#3f8c94">
      <circle cx="618" cy="352" r="145" strokeWidth="3.7"/>
      <circle cx="618" cy="352" r="135" strokeWidth="3.2"/>
    </g>
    <g>
      {holes.map(([x,y],i)=><g key={i} transform={`translate(${x} ${y}) rotate(${(Math.atan2(y-352,x-618)*180/Math.PI).toFixed(3)})`}>
        {i===7?<g>
          <path d="M-7.3-12C-7-7.4-5.7-5.4-2.4-5.4S2.6-7.4 2.6-12M-7.3 12C-7 7.4-5.7 5.4-2.4 5.4S2.6 7.4 2.6 12"
            fill="none" stroke="#3f8c94" strokeWidth="3.35"/>
          <path d="M-10.6-3C-10.8-5.2-9-6.4-6.8-6.1H5.6Q9.5-6.4 10.6-3ZM-10.6 3C-10.8 5.2-9 6.4-6.8 6.1H5.6Q9.5 6.4 10.6 3Z"
            fill="#6582a1" stroke="#394f6b" strokeWidth=".75" strokeLinejoin="round"/>
          <path d="M-7-3V-1.5m3-1.5v1.8m3-1.8v1.2m4-1.2v1.8m3-1.8v1.5M-7 3v-1.5m3 1.5V1.2m3 1.8V1.8m4 1.2V1.2m3 1.8V1.5"
            fill="none" stroke="#516985" strokeWidth=".45" strokeLinecap="round"/>
        </g>:<>
          <rect x="-6" y="-4.6" width="12" height="9.2" rx="2.5" fill="#327c84"/>
          <path d="M-6 0H6" stroke="#c4e3db" strokeWidth="2.7" strokeLinecap="round"/>
        </>}
      </g>)}
    </g>
    {detailArt}
  </>;
});

export function Marker({item,onClick}:{
  item:Structure;onClick?:()=>void;
}) {
  const [x,y]=item.tag;
  const width=item.label.length*7.0+28;
  const label=item.id==='pore'?'Pore nucléaire — Franchir':item.label;
  return <>
    <path d={`M${item.point.join(' ')} L${x} ${y}`} fill="none" stroke={item.color} strokeWidth="1.6" pointerEvents="none"/>
    {onClick&&<circle cx={item.point[0]} cy={item.point[1]} r="8" fill="transparent" className="map-marker" onClick={e=>{e.stopPropagation();onClick();}}/>}
    <circle cx={item.point[0]} cy={item.point[1]} r="5.1" fill={item.color} stroke="#fff9eb" strokeWidth="1.8" pointerEvents="none"/>
    <g role={onClick?'button':undefined} tabIndex={onClick?0:undefined} aria-label={onClick?label:undefined}
      className={onClick?`map-marker${item.id==='pore'?' pore-label':''}`:undefined} onClick={e=>{e.stopPropagation();onClick?.();}}
      onKeyDown={e=>{if(onClick&&(e.key==='Enter'||e.key===' ')){e.preventDefault();e.stopPropagation();onClick();}}}>
    <rect x={x-width/2} y={y-15} width={width} height="30" rx="7" fill={item.id==='pore'?'#225561':'#fff9ee'} stroke={item.id==='pore'?'#a9d1cb':'#dfd3bf'} strokeWidth="1.25"/>
    <text x={x} y={y+4.5} fill={item.id==='pore'?'#fffaf2':'#29434a'} textAnchor="middle" fontSize="12.6" fontWeight="600">{item.label}</text>
    </g>
  </>;
}
