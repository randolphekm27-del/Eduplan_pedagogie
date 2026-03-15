
export interface Sequence {
  id: string;
  numero: string;
  objectif: string;
  taches: string;
  organisations: string; 
  savoirs: string;
  materiel: string;
  duree: string;
  observations?: string;
}

export interface ExtraPage {
  id: string;
  title: string;
  content: string;
}

export interface FicheData {
  id: string;
  titre: string;
  numeroFiche: string;
  enTete: {
    matiere: string;
    theme: string;
    objectifGeneral: string;
    classe: string;
    temps: string;
    date: string;
  };
  miseEnSituation: {
    rappel: string;
    prerequis: string;
    motivation: string;
  };
  sequences: Sequence[];
  syntheseLecon: string;
  evaluationFormative: string;
  documentEleve: {
    activite: string;
    objectifGeneral: string;
    consigne: string;
    texte: string;
    support: string;
    taches: string;
    strategie: {
      travailGroupe: string;
      pleniere: string;
    };
  };
  ficheSynthese: {
    point1: string;
    point2: string;
    point3: string;
  };
  extraPages?: ExtraPage[];
}

export const DOCUMENT_STYLES = `
  @page {
    margin: 10mm;
  }
  @page landscape {
    size: A4 landscape;
  }
  @page portrait {
    size: A4 portrait;
  }
  
  body {
    font-family: 'Inter', Arial, Helvetica, sans-serif;
    margin: 0;
    line-height: 1.5;
    color: #1a1a1a;
  }
  
  .page {
    background: white;
    width: 210mm;
    min-height: 297mm;
    padding: 15mm;
    margin: 0 auto;
    page-break-after: always;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
  }
  
  .page:last-child {
    page-break-after: avoid !important;
  }
  
  .page-landscape {
    width: 297mm;
    min-height: 210mm;
  }

  @media print {
    body { background: white; margin: 0; }
    .page { margin: 0; box-shadow: none; width: auto; min-height: auto; }
    .page-landscape { page: landscape; }
    .page-portrait { page: portrait; }
  }

  h2 {
    text-align: center;
    margin-bottom: 20px;
    font-size: 18pt;
    font-weight: 800;
    text-transform: uppercase;
    color: #000;
    border-bottom: 2px solid #000;
    padding-bottom: 10px;
  }
  
  .section {
    margin-top: 20px;
  }
  
  .section-title {
    font-weight: 800;
    font-size: 11pt;
    text-transform: uppercase;
    margin-bottom: 10px;
    display: block;
    border-left: 4px solid #000;
    padding-left: 10px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    table-layout: fixed;
  }
  
  th, td {
    border: 1px solid #000;
    padding: 6px 8px;
    vertical-align: top;
    font-size: 10pt;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
  
  th {
    text-align: center;
    background-color: #f2f2f2;
    font-weight: 800;
    text-transform: uppercase;
    font-size: 9pt;
  }
  
  .header-table td {
    border: none;
    padding: 3px 0;
    font-size: 10pt;
  }
  
  .center {
    text-align: center;
  }
  
  .content-area {
    min-height: 50px;
    margin-top: 5px;
    font-size: 10pt;
  }
  
  /* Rich Text Styles */
  .prose {
    font-size: 10pt;
    line-height: 1.4;
  }
  .prose p { margin: 0 0 8px 0; }
  .prose h1 { font-size: 16pt; margin: 15px 0 10px 0; font-weight: bold; }
  .prose h2 { font-size: 14pt; margin: 12px 0 8px 0; font-weight: bold; text-align: left; border-bottom: none; text-transform: none; }
  .prose h3 { font-size: 12pt; margin: 10px 0 5px 0; font-weight: bold; }
  
  .prose ul, .prose ol {
    margin: 0 0 10px 20px;
    padding: 0;
  }
  
  .prose li {
    margin-bottom: 4px;
  }

  .prose table {
    width: 100% !important;
    border-collapse: collapse;
    margin: 10px 0;
    table-layout: auto !important; /* Allow auto width for inner tables */
  }
  
  .prose table td, .prose table th {
    border: 1px solid #000;
    padding: 4px 6px;
    min-width: 20px;
  }

  .prose img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 10px auto;
  }

  strong {
    font-weight: bold;
  }
`;

export function generateDocumentHTML(data: FicheData): string {
  const sequencesRows = data.sequences.map(seq => `
    <tr>
      <td class="center" style="width:5%">${seq.numero}</td>
      <td style="width:18%">${seq.objectif}</td>
      <td style="width:15%">${seq.taches}</td>
      <td style="width:15%">${seq.organisations}</td>
      <td style="width:15%">${seq.savoirs}</td>
      <td style="width:15%">${seq.materiel}</td>
      <td class="center" style="width:7%">${seq.duree}</td>
      <td style="width:10%">${seq.observations || ''}</td>
    </tr>
  `).join('');

  // Generate extra pages HTML
  const extraPagesHTML = (data.extraPages || []).map(page => `
    <div class="page page-portrait">
        <h2>${page.title.toUpperCase()}</h2>
        <div class="section">
            <div class="content-area prose">${page.content}</div>
        </div>
    </div>
  `).join('');

  const hasStudentContent = data.documentEleve.texte || data.documentEleve.support || data.documentEleve.taches || data.documentEleve.activite;
  const hasSynthesisContent = data.ficheSynthese.point1 || data.ficheSynthese.point2 || data.ficheSynthese.point3 || data.syntheseLecon;

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>${data.titre}</title>
    <style>${DOCUMENT_STYLES}</style>
</head>
<body>
    <!-- PAGE 1: FICHE PEDAGOGIQUE (LANDSCAPE) -->
    <div class="page page-landscape">
        <h2>FICHE PÉDAGOGIQUE N° ${data.numeroFiche || ''}</h2>
        <table class="header-table">
            <tr>
              <td style="width:15%"><strong>MATIÈRE :</strong></td><td style="width:35%">${data.enTete.matiere}</td>
              <td style="width:15%"><strong>CLASSE :</strong></td><td style="width:35%">${data.enTete.classe}</td>
            </tr>
            <tr>
              <td><strong>THÈME :</strong></td><td>${data.enTete.theme}</td>
              <td><strong>TEMPS :</strong></td><td>${data.enTete.temps}</td>
            </tr>
            <tr>
              <td><strong>OBJECTIF GÉNÉRAL :</strong></td><td colspan="3">${data.enTete.objectifGeneral}</td>
            </tr>
            <tr>
              <td><strong>DATE :</strong></td><td colspan="3">${data.enTete.date}</td>
            </tr>
        </table>

        <div class="section">
            <span class="section-title">I - MISE EN SITUATION</span>
            <table class="header-table" style="margin-left: 20px;">
                <tr><td style="width:12%"><strong>Rappel :</strong></td><td>${data.miseEnSituation.rappel}</td></tr>
                <tr><td><strong>Pré-requis :</strong></td><td>${data.miseEnSituation.prerequis}</td></tr>
                <tr><td><strong>Motivation :</strong></td><td>${data.miseEnSituation.motivation}</td></tr>
            </table>
        </div>

        <div class="section">
            <span class="section-title">II - DÉROULEMENT DE LA LEÇON</span>
            <table>
                <thead>
                    <tr>
                        <th rowspan="2" style="width:5%">SQ</th>
                        <th rowspan="2" style="width:18%">OBJECTIFS OPERATIONNELS</th>
                        <th colspan="2" style="width:30%">STRATEGIE PEDAGOGIQUE</th>
                        <th rowspan="2" style="width:15%">SAVOIRS ASSOCIES</th>
                        <th rowspan="2" style="width:15%">MATERIEL DIDACTIQUE</th>
                        <th rowspan="2" style="width:7%">DURÉE</th>
                        <th rowspan="2" style="width:10%">OBSERV.</th>
                    </tr>
                    <tr>
                        <th style="width:15%">Tâches élèves</th>
                        <th style="width:15%">Organisation</th>
                    </tr>
                </thead>
                <tbody>
                    ${sequencesRows}
                </tbody>
            </table>
        </div>

        <div class="section">
            <span class="section-title">III - SYNTHÈSE COLLECTIVE</span>
            <div class="content-area prose">${data.syntheseLecon}</div>
        </div>
    </div>

    <!-- PAGE 2: DOCUMENT ELEVE -->
    ${hasStudentContent ? `
    <div class="page page-portrait">
        <h2>DOCUMENT ÉLÈVE</h2>
        <div class="section">
            <p><strong>ACTIVITÉ :</strong> ${data.documentEleve.activite}</p>
            <p><strong>OBJECTIF :</strong> ${data.documentEleve.objectifGeneral}</p>
        </div>
        ${data.documentEleve.texte ? `
        <div class="section">
            <strong>ORIENTATION / CONTEXTE :</strong>
            <div class="content-area prose">${data.documentEleve.texte}</div>
        </div>` : ''}
        ${data.documentEleve.support ? `
        <div class="section">
            <strong>SUPPORTS DE TRAVAIL :</strong>
            <div class="content-area prose">${data.documentEleve.support}</div>
        </div>` : ''}
        ${data.documentEleve.taches ? `
        <div class="section">
            <strong>TRAVAIL À FAIRE :</strong>
            <div class="content-area prose">${data.documentEleve.taches}</div>
        </div>` : ''}
        <div class="section">
            <strong>MODALITÉS DE RÉALISATION :</strong>
            <table style="width:60%">
                <tr><td style="width:40%"><strong>En groupe :</strong></td><td>${data.documentEleve.strategie.travailGroupe}</td></tr>
                <tr><td><strong>Restitution :</strong></td><td>${data.documentEleve.strategie.pleniere}</td></tr>
            </table>
        </div>
    </div>
    ` : ''}

    <!-- PAGE 3: FICHE DE SYNTHESE -->
    ${hasSynthesisContent ? `
    <div class="page page-portrait">
        <h2>FICHE DE SYNTHÈSE</h2>
        ${data.ficheSynthese.point1 ? `
        <div class="section">
            <div class="content-area prose">${data.ficheSynthese.point1}</div>
        </div>` : ''}
        ${data.ficheSynthese.point2 ? `
        <div class="section">
            <div class="content-area prose">${data.ficheSynthese.point2}</div>
        </div>` : ''}
        ${data.ficheSynthese.point3 ? `
        <div class="section">
            <div class="content-area prose">${data.ficheSynthese.point3}</div>
        </div>` : ''}
    </div>
    ` : ''}

    <!-- PAGE 4: EVALUATION FORMATIVE -->
    ${data.evaluationFormative ? `
    <div class="page page-portrait">
        <h2>ÉVALUATION FORMATIVE</h2>
        <div class="section">
            <div class="content-area prose">${data.evaluationFormative}</div>
        </div>
    </div>
    ` : ''}

    <!-- EXTRA PAGES -->
    ${extraPagesHTML}
</body>
</html>
  `;
}
