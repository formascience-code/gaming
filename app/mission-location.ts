export const missionLocations=[
  {label:'Enveloppe nucléaire et noyau', summary:'Le pore traverse l’enveloppe nucléaire. La chromatine se trouve à l’intérieur du noyau.'},
  {label:'Nucléoplasme', summary:'L’ARN polymérase II transcrit le gène sur l’ADN, à l’intérieur du noyau.'},
  {label:'Nucléoplasme, puis pore nucléaire', summary:'La coiffe, l’épissage et la polyadénylation ont lieu dans le noyau. L’ARNm mature rejoint ensuite le cytosol par un pore nucléaire.'},
  {label:'Cytosol et ribosome', summary:'Dans le cytosol, les aminoacyl-ARNt synthétases chargent les ARNt. Au ribosome, l’anticodon de l’ARNt reconnaît le codon de l’ARNm.'},
  {label:'Ribosomes du côté cytosolique', summary:'La traduction se déroule sur des ribosomes libres dans le cytosol ou associés à la face cytosolique du réticulum endoplasmique rugueux.'},
];

export function challengeLocation(id:string,mission:number) {
  if(id==='pore') return 'Enveloppe nucléaire · pore';
  if(id==='export') return 'Pore nucléaire · du noyau vers le cytosol';
  if(id==='chromatine') return 'Noyau · chromatine';
  if(id==='charge') return 'Cytosol · chargement de l’ARNt';
  if(mission>=4) return 'Ribosome · côté cytosolique';
  return 'Noyau · nucléoplasme';
}
