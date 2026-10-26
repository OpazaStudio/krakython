// Pages légales de départ. Les éléments entre crochets sont à compléter,
// et l'ensemble est à faire relire avant la mise en ligne.
import { rich } from './lexical'

export const MENTIONS = {
  titre: 'Mentions légales',
  contenu: rich(
    '## Éditeur du site',
    'Le site est édité par l’**Association Krakython**, association loi 1901.',
    'Siège : [ADRESSE DU SIÈGE]',
    'N° RNA : [N° RNA] · SIRET : [SIRET si l’asso en a un]',
    'Directeur de la publication : [NOM DU OU DE LA PRÉSIDENT·E]',
    'Contact : [E-MAIL DE CONTACT]',
    '## Hébergement',
    'Le site est hébergé par [HÉBERGEUR, ex. Vercel Inc.], [ADRESSE DE L’HÉBERGEUR].',
    '## Propriété intellectuelle',
    'Les textes, logos, photos et visuels du site appartiennent à l’Association Krakython ou à leurs auteurs. Toute reproduction sans autorisation est interdite. Les logos des partenaires et de la Fédération Leucémie Espoir restent la propriété de leurs titulaires.',
    '## Dons',
    'Les dons ne sont pas collectés sur ce site : ils sont effectués sur la plateforme Streamlabs Charity, au profit de la Fédération Leucémie Espoir.',
    '## Données personnelles',
    'Voir notre [politique de confidentialité](/confidentialite).',
  ),
}

export const CGV = {
  titre: 'Conditions générales de vente de la boutique',
  contenu: rich(
    '## 1. Vendeur',
    'La boutique est exploitée par l’Association Krakython, association loi 1901, [ADRESSE DU SIÈGE], [N° RNA]. Contact : [E-MAIL DE CONTACT].',
    '## 2. Produits et prix',
    'Les produits (textile, goodies, accessoires) sont décrits sur leur fiche. Les prix sont indiqués en euros, toutes taxes comprises [ou : TVA non applicable, à vérifier selon le régime de l’asso]. Les frais de livraison sont indiqués avant le paiement.',
    'Les bénéfices de la boutique financent les actions de l’association. L’arrondi solidaire proposé au panier est reversé à la Fédération Leucémie Espoir ; il ne donne pas lieu à un reçu fiscal.',
    '## 3. Commande et paiement',
    'La commande est validée après paiement par carte bancaire sur la page sécurisée de notre prestataire Stripe. Un e-mail de confirmation récapitule la commande. Les articles sont réservés pendant le paiement ; une commande non payée est annulée automatiquement.',
    '## 4. Livraison',
    '- Colissimo à domicile, en France métropolitaine, aux frais indiqués au moment de la commande.',
    '- Retrait en main propre gratuit, pendant le Krakython ou à La Rochelle : l’association contacte l’acheteur pour convenir du moment.',
    'Les délais annoncés sont indicatifs : l’association est animée par des bénévoles.',
    '## 5. Droit de rétractation',
    'Vous disposez de 14 jours à compter de la réception pour vous rétracter, sans avoir à vous justifier, en nous écrivant à [E-MAIL DE CONTACT]. Les articles doivent être retournés neufs, dans leur état d’origine ; les frais de retour sont à votre charge. Le remboursement intervient sous 14 jours après réception du retour, par le même moyen de paiement.',
    '## 6. Garanties',
    'Les produits bénéficient de la garantie légale de conformité et de la garantie des vices cachés. En cas de problème, écrivez-nous : on trouve une solution.',
    '## 7. Médiation',
    'En cas de litige, vous pouvez recourir gratuitement au médiateur de la consommation : [NOM ET COORDONNÉES DU MÉDIATEUR].',
    '## 8. Données personnelles',
    'Voir notre [politique de confidentialité](/confidentialite).',
  ),
}

export const CONFIDENTIALITE = {
  titre: 'Confidentialité',
  contenu: rich(
    '## Ce que nous collectons',
    '- **Commandes** : nom, e-mail, téléphone et adresse de livraison, pour préparer et envoyer votre commande.',
    '- **Formulaire de contact** : nom, e-mail, structure et message, pour vous répondre.',
    '- **Alerte du prochain live** : votre e-mail, uniquement pour vous prévenir des prochains événements.',
    'Le paiement est traité par Stripe : nous ne voyons jamais vos données bancaires. Les e-mails sont envoyés via Resend.',
    '## Durée de conservation',
    'Les données de commande sont conservées le temps nécessaire aux obligations comptables. Les messages et inscriptions à l’alerte sont supprimés sur simple demande, et au plus tard trois ans après le dernier contact.',
    '## Cookies',
    'Le site n’utilise pas de cookies publicitaires ni de mesure d’audience. Votre panier est enregistré dans votre navigateur (stockage local) et n’est pas transmis tant que vous ne passez pas commande.',
    '## Vos droits',
    'Vous pouvez demander l’accès, la rectification ou la suppression de vos données en écrivant à [E-MAIL DE CONTACT]. Vous pouvez aussi saisir la CNIL (cnil.fr).',
  ),
}
