const fs = require('fs');

function fixFile(file, replacements) {
    let content = fs.readFileSync(file, 'utf8');
    for (const [bad, good] of Object.entries(replacements)) {
        // use split join to replace all
        content = content.split(bad).join(good);
    }
    fs.writeFileSync(file, content, 'utf8');
}

const badChar = '\uFFFD';

const publicLayoutFixes = {
    ['Acc' + badChar + 'der ' + badChar]: 'Accéder à' // Accder 
};

const pricingFixes = {
    ['Vous ' + badChar + 'tes sur le point de souscrire ' + badChar]: 'Vous êtes sur le point de souscrire à',
    ['num' + badChar + 'ro de t' + badChar + 'l' + badChar + 'phone']: 'numéro de téléphone',
    ['Num' + badChar + 'ro de t' + badChar + 'l' + badChar + 'phone']: 'Numéro de téléphone',
    ['B' + badChar + 'nin']: 'Bénin',
    ['C' + badChar + 'te d\'Ivoire']: 'Côte d\'Ivoire',
    ['S' + badChar + 'n' + badChar + 'gal']: 'Sénégal',
    ['Pr' + badChar + 'paration du paiement s' + badChar + 'curis' + badChar]: 'Préparation du paiement sécurisé',
    ['Pr' + badChar + 't !']: 'Prêt !',
    ['Vous allez ' + badChar + 'tre redirig' + badChar]: 'Vous allez être redirigé',
    ['non re' + badChar + 'ue']: 'non reçue',
    ['pu ' + badChar + 'tre initialis' + badChar + 'e']: 'pu être initialisée',
    ['con' + badChar + 'ues']: 'conçues',
    ['d' + badChar + 'couvrir']: 'découvrir',
    ['capacit' + badChar]: 'capacité',
    ['' + badChar + 'tendu']: 'étendu',
    ['illimit' + badChar]: 'illimité',
    ['fonctionnalit' + badChar + 's']: 'fonctionnalités',
    ['' + badChar + 'vidence']: 'évidence',
    ['moment o' + badChar]: 'moment où',
    ['diff' + badChar + 'rence']: 'différence',
    ['aider ' + badChar + ' d' + badChar + 'cider']: 'aider à décider',
    ['Diff' + badChar + 'rences imm' + badChar + 'diates']: 'Différences immédiates',
    ['Crit' + badChar + 're']: 'Critère',
    ['Illimit' + badChar]: 'Illimité',
    ['renforc' + badChar]: 'renforcé',
    ['fr' + badChar + 'quentes']: 'fréquentes',
    ['plan ' + badChar]: 'plan à',
    ['d' + badChar + 's que']: 'dès que',
    ['s' + badChar + 'curis' + badChar]: 'sécurisé',
    ['convient ' + badChar]: 'convient à',
    ['r' + badChar + 'gulier']: 'régulier',
    ['pr' + badChar + 'f' + badChar + 'rable']: 'préférable',
    ['acc' + badChar + 's']: 'accès',
    ['d' + badChar + 'couverte ' + badChar]: 'découverte à',
    ['d' + badChar + 'bloquer']: 'débloquer',
    ['Souscrire ' + badChar]: 'Souscrire à'
};

fixFile('src/layouts/PublicPageLayout.tsx', publicLayoutFixes);
fixFile('src/pages/Pricing.tsx', pricingFixes);

console.log('Fixed');
