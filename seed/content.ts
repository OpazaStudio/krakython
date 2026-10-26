// Contenu de départ : textes réels de l'ancien site krakython.wordpress.com
// et des maquettes validées (DA 1). Les éléments entre crochets sont à compléter par l'asso.
import { rich } from './lexical'

export const MEDIA: Record<string, { file: string; alt: string }> = {
  max: { file: 'team-max.webp', alt: 'Maxime, alias Krakeunz, ballon de rugby en main' },
  sauron: { file: 'team-sauron.webp', alt: 'Photo de Sauron' },
  meilan: { file: 'team-meilan.webp', alt: 'Photo de Meilan' },
  henri: { file: 'team-henri.webp', alt: 'Photo d’Henri' },
  jeangui: { file: 'team-jeangui.webp', alt: 'Photo de Jean-Gui' },
  corentin: { file: 'team-corentin.webp', alt: 'Photo de Corentin' },
  julien: { file: 'team-julien.webp', alt: 'Photo de Julien' },
  steven: { file: 'team-wologan.webp', alt: 'Photo de Steven' },
  mickael: { file: 'team-mickael.webp', alt: 'Photo de Mickael' },
  ldlc: { file: 'partner-ldlc.webp', alt: 'Logo LDLC' },
  ca: { file: 'partner-credit-agricole.webp', alt: 'Logo du Crédit Agricole Charente-Maritime Deux-Sèvres' },
  enfourneaux: { file: 'partner-enfourneaux.webp', alt: 'Logo Les Enfourneaux, producteurs' },
  fle: { file: 'partner-fle.webp', alt: 'Logo de la Fédération Leucémie Espoir' },
  logoPng: { file: 'krakython-logo.png', alt: 'Logo du Krakython : un cœur-kraken bleu tenant une manette rose' },
  logoHorizontal: { file: 'logo-horizontal-kit.webp', alt: 'Logo horizontal du Krakython, Mémoire à Max’' },
}

export const EVENEMENT = {
  edition: 'Krakython 2026',
  duree: '51 h',
  dates: { debut: null, fin: null, libelle: 'Dates bientôt annoncées' },
  // Lien de l'édition d'octobre 2025 : à remplacer par celui de 2026 dès qu'il existe.
  lienDon: 'https://streamlabscharity.com/teams/@krakython-octobre-2025/krakython-octobre-2025',
  donDirect: false,
  cagnotte: { montant: 0, objectif: 5000, statut: 'Mise à jour pendant le live', paliers: [] },
  annonce: { actif: true, texte: 'Dates bientôt annoncées · 51 h de live sur Twitch contre la leucémie', lienTexte: 'Activer le rappel', lien: 'https://www.twitch.tv/krakython' },
}

export const SITE = {
  nomAsso: 'Association Krakython',
  email: null,
  reseaux: {
    twitch: 'https://www.twitch.tv/krakython',
    instagram: 'https://www.instagram.com/krakython/',
    facebook: 'https://www.facebook.com/Krakython/',
    x: 'https://x.com/krakython',
    youtube: null,
  },
  beneficiaire: {
    nom: 'Fédération Leucémie Espoir',
    logo: 'fle',
    texte: 'La leucémie est un cancer du sang qui naît dans la moelle osseuse. La Fédération finance la recherche et accompagne les malades et leurs familles.',
    lien: 'https://www.leucemie-espoir.org',
  },
  lienMoelle: 'https://www.dondemoelleosseuse.fr',
  pied: {
    texte: 'Association caritative née d’une bande d’amis, en mémoire de Max. On joue, on rit, on récolte des fonds contre la leucémie.',
    alerteTitre: 'Reçois l’alerte du prochain live',
  },
}

export const ACCUEIL = {
  hero: {
    pastille1: 'En mémoire de Max · Krakeunz',
    pastille2: 'Marathon caritatif',
    titre: '51 heures de jeu',
    titreSurligne: 'contre la leucémie.',
    texte:
      'Un regroupement d’amis passionnés de gaming, œuvrant pour la bonne cause le temps d’un week-end : jeux vidéo, quiz et happenings en direct sur Twitch, au profit de la Fédération Leucémie Espoir.',
    boutonDon: 'Faire un don',
    boutonLive: 'Regarder le live',
    // À confirmer avec la Fédération avant la mise en ligne (reçu fiscal émis par la FLE via Streamlabs ?).
    garanties: [{ texte: '66 % de ton don déductible des impôts' }, { texte: 'Dons versés à la Fédération Leucémie Espoir' }],
    compteRebours: 'Prochain live dans',
  },
  defile: ['51 h de live', 'Jeux vidéo', 'Quiz', 'Happenings', 'GeoGuessr', 'Pour Max', 'Contre la leucémie'].map((texte) => ({ texte })),
  cagnotte: {
    texte: 'Chaque palier atteint débloque un défi en live. Les dons sont versés directement à la Fédération Leucémie Espoir, et tu reçois un reçu fiscal.',
    bouton: 'Je fais monter la barre',
    chiffres: [
      { valeur: '51 h', legende: 'de stream non-stop, jour et nuit', couleur: 'bleu' },
      { valeur: '66 %', legende: 'de ton don déduit de tes impôts', couleur: 'rose' },
    ],
  },
  max: {
    surtitre: 'Pourquoi le Krakython',
    titre: 'Pour Max.',
    intro: 'Maxime, c’était Krakeunz derrière la manette, « Kraky » pour les intimes. Un Rochelais menuisier de formation, passé par l’école de rugby du Stade Rochelais, et joueur PC depuis l’adolescence.',
    citation: { texte: 'Jouer aux jeux vidéo, c’est pas louper sa vie, c’est choisir d’en avoir une autre, une différente ou plusieurs.', auteur: 'Krakeunz' },
    texte: rich(
      'En 2021, on lui diagnostique une leucémie aiguë myéloïde. Chimiothérapies, greffe de moelle osseuse, rechute : il a mené ce combat avec une force immense, sans jamais lâcher l’espoir. Pour lui changer les idées pendant les traitements, ses amis ont lancé un marathon de jeux vidéo en stream. Son nom ? Krakeunz + marathon.',
      'Max nous a quittés le 16 août 2024, à 27 ans. On continue de jouer pour lui, et pour que la recherche avance.',
    ),
    bouton: 'Faire un don en mémoire de Max',
    fiche: {
      prenom: 'Maxime',
      pseudo: 'Krakeunz · Kraky',
      photo: 'max',
      infos: [
        { label: 'Ville', valeur: 'La Rochelle' },
        { label: 'Club de cœur', valeur: 'Stade Rochelais' },
        { label: 'Plateforme', valeur: 'PC, depuis l’adolescence' },
        { label: 'Jeux', valeur: 'Dofus, Counter-Strike, Assassin’s Creed' },
      ],
    },
  },
  programme: {
    surtitre: 'Select stage',
    titre: 'Au programme du week-end',
    items: [
      { titre: 'Marathon jeux vidéo', texte: '51 heures de stream non-stop sur Twitch. L’équipe se relaie manette en main, jour et nuit.', icone: 'manette' },
      { titre: 'Quiz Krakython', texte: 'Notre animation historique : le chat affronte l’équipe en direct, et l’équipe n’a pas toujours le dernier mot.', icone: 'quiz' },
      { titre: 'Tournoi GeoGuessr', texte: 'L’autre classique du Krakython : deviner où l’on a atterri sur la planète, contre l’équipe et le chat.', icone: 'globe' },
      { titre: 'Happenings', texte: 'Défis, paliers de dons, concerts et lots à gagner : plus la cagnotte monte, plus le stream déraille (gentiment).', icone: 'cadeau' },
    ],
  },
  classes: {
    surtitre: 'Rejoindre la partie',
    titre: 'Choisis ta classe.',
    texte: 'Pas besoin d’être pro de la manette pour aider. Chaque rôle compte dans le combat contre la leucémie.',
    items: [
      { nom: 'Mécène', icone: 'coeur', couleur: 'rose', texte: 'Fais monter la barre d’XP. Petit ou grand, chaque don rapproche le prochain palier.', pouvoir: '66 % déduits de tes impôts', bouton: 'Faire un don', lien: 'don' },
      { nom: 'Supporter', icone: 'sac', couleur: 'bleu', texte: 'T-shirts, sweats, stickers : porte les couleurs du Kraken, au stade comme devant ton écran.', pouvoir: 'Chaque achat soutient l’asso', bouton: 'Voir la boutique', lien: '/boutique' },
      {
        nom: 'Soigneur',
        icone: 'goutte',
        couleur: 'rose',
        texte: 'Max a reçu une greffe de moelle osseuse. Tu as entre 18 et 35 ans et tu es en bonne santé ? Inscris-toi comme donneur.',
        pouvoir: 'Peut sauver une vie',
        bouton: 'Devenir donneur',
        lien: 'https://www.dondemoelleosseuse.fr',
      },
      { nom: 'Allié', icone: 'groupe', couleur: 'bleu', texte: 'Streamer, bénévole, entreprise ou club : rejoins l’aventure et fais grandir le Krakython.', pouvoir: 'Multiplie la portée du live', bouton: 'Nous contacter', lien: '/nos-partenaires#nous-contacter' },
    ],
  },
  boutique: {
    surtitre: 'Loot officiel',
    titre: 'La boutique du Kraken',
    texte: 'Habille-toi aux couleurs du Krakython. Commande et paiement directement ici, chaque achat soutient l’association.',
    bouton: 'Toute la boutique',
  },
  live: {
    surtitre: 'On air',
    titre: 'Rejoins le live.',
    texte: 'Tout se passe sur twitch.tv/krakython : le stream, le chat, les alertes de dons et les défis qui tombent quand la barre d’XP grimpe.',
    bouton: 'Suivre sur Twitch',
    alerteExemple: 'Ton pseudo · 20 €',
    alerteTexte: 'Ton pseudo s’affiche en direct sur le stream',
    videos: [
      { titre: 'L’annonce officielle', url: 'https://www.youtube.com/watch?v=2Gcz2KUBvrM' },
      { titre: 'Notre venue à l’AG de la Fédération Leucémie Espoir', url: 'https://www.youtube.com/watch?v=qAapCzDxk44' },
    ],
  },
  partenaires: { surtitre: 'Co-op mode', titre: 'Ils jouent avec nous', bouton: 'Devenir partenaire' },
}

export const QUI_SOMMES_NOUS = {
  entete: {
    surtitre: 'Notre motivation',
    titre: 'Une bande de potes, des manettes et une cause.',
    intro:
      'Nous sommes un groupe d’amis passionnés de jeux vidéo, profondément touchés par la leucémie lorsqu’un des nôtres en a été atteint. Depuis 2021, nous organisons chaque année un week-end caritatif pour récolter des fonds. En août 2024, nous avons perdu notre ami, mais son souvenir nous pousse à poursuivre, plus que jamais, le combat.',
    citation: { texte: 'Jouer aux jeux vidéo, c’est pas louper sa vie, c’est choisir d’en avoir une autre, une différente ou plusieurs.', auteur: 'Maxime · Krakeunz' },
  },
  nom: {
    surtitre: 'Lore',
    titre: 'Pourquoi « Krakython » ?',
    mot1: 'Kraky',
    mot1Texte: 'le surnom de Max, alias Krakeunz en jeu',
    mot2: 'Marathon',
    mot2Texte: '51 h de stream non-stop',
    texte: rich(
      'En jeu, notre ami s’appelait Krakeunz, et nous l’appelions « Kraky ». En 2021, l’année où nous avons appris son diagnostic, nous avons lancé un marathon de stream pour l’accompagner à notre manière dans son combat. Krakython était né. Max nous a quittés le 16 août 2024 : chaque édition se joue désormais en son honneur. [Lire son histoire](/#max)',
    ),
    chiffres: [
      { valeur: '6', legende: 'éditions depuis 2021' },
      { valeur: '51 h', legende: 'de live par édition' },
    ],
    totalLegende: 'récoltés depuis le début de l’aventure',
  },
  quete: {
    surtitre: 'Points de sauvegarde',
    titre: 'Le journal de quête',
    texte: 'Chaque édition est un niveau de plus. Voici ce qu’on a accompli ensemble depuis le premier live.',
    prochainTitre: 'La quête continue',
    prochainBouton: 'Activer le rappel Twitch',
    video: {
      surtitre: 'En vidéo',
      titre: 'Notre venue à l’assemblée générale de la Fédération Leucémie Espoir',
      texte: 'Notre présentation des éditions 2021 et 2022, et nos objectifs pour 2023.',
      url: 'https://www.youtube.com/watch?v=qAapCzDxk44',
    },
  },
  equipe: {
    surtitre: 'L’équipe',
    titre: 'Sélection des joueurs',
    texte: 'Ceux qui tiennent la manette (et le chat) pendant 51 heures.',
    recrueTitre: 'Et toi ?',
    recrueTexte: 'Rejoins l’équipe pour la prochaine édition',
  },
  rejoindre: {
    titre: 'Envie de rejoindre la team ?',
    texte: 'Streamers, bénévoles, graphistes, monteurs, musiciens : il y a une place pour toi dans la prochaine quête.',
    bouton: 'Nous écrire',
  },
}

export const MEMBRES = [
  { prenom: 'Maxime', pseudo: 'Krakeunz · Kraky', photo: 'max', statut: 'memoire', bio: 'Menuisier de formation, joueur PC depuis l’adolescence. À l’origine de tout. Puisses-tu reposer en paix.', tags: ['Dofus', 'Counter-Strike', 'Assassin’s Creed'] },
  { prenom: 'Sauron', pseudo: 'Sauronofchaos', photo: 'sauron', bio: 'Initié par son frère et son père avec MDK et Age of Empires. Musicien à ses heures.', tags: ['Stratégie', 'RPG', 'MMO'], twitch: 'https://www.twitch.tv/sauronofchaos' },
  { prenom: 'Meilan', pseudo: 'Meilan_', photo: 'meilan', bio: 'Fan de Nintendo depuis toujours. Point commun de ses jeux préférés : ils sont tous super cute.', tags: ['MOBA', 'FPS', 'Simulation'], twitch: 'https://www.twitch.tv/meilan_' },
  { prenom: 'Henri', pseudo: 'Histon', photo: 'henri', bio: 'Bercé par Pokémon et Final Fantasy. Promet un live calme, sans cris, avec de l’humour (parfois pas drôle).', tags: ['Gestion', 'Rogue-like', 'MMORPG'], twitch: 'https://www.twitch.tv/histonsrc' },
  { prenom: 'Jean-Gui', pseudo: 'Bubbles', photo: 'jeangui', bio: 'Fan de rugby et de sports mécaniques. Passion incommensurable pour Counter-Strike, skill éclaté au sol.', tags: ['Counter-Strike', 'Rugby'], twitch: 'https://www.twitch.tv/jeangui16' },
  { prenom: 'Corentin', pseudo: 'Spayt', photo: 'corentin', bio: 'Streamer « de type Pélican », la folie pour vocation. Son cri de guerre : vous avez le pouvoir !', tags: ['Battle royale', 'MMORPG', 'FPS'], twitch: 'https://www.twitch.tv/spayt' },
  { prenom: 'Julien', pseudo: 'Alapaches', photo: 'julien', bio: 'Dev web, sur Dofus depuis sa sortie en 2004. Objectif : viser le headshot et one shot cette maladie.', tags: ['Aventure', 'FPS', 'RTS'] },
  { prenom: 'Steven', pseudo: 'Wologan', photo: 'steven', bio: 'Alias « wolo » ou « le raton ». Animateur puis dev web, vrai électron libre qui ne se prend jamais au sérieux.', tags: ['Manga', 'Jeux de société'] },
  { prenom: 'Mickael', pseudo: null, photo: 'mickael', statut: 'recrue', bio: 'A rencontré Max à Bordeaux et ne l’a jamais quitté. Extraverti, il garantit une ambiance au top.', tags: ['Jeux de combat', 'Compétitif'] },
]

export const EDITIONS = [
  { titre: 'Le tout premier Krakython', periode: '17 → 19 déc. 2021', debut: '2021-12-17', montant: 1506, texte: 'L’année du diagnostic de Max. Pour l’accompagner, on lance 51 heures de stream sur Twitch, du vendredi 21 h au dimanche minuit.' },
  { titre: 'L’édition estivale', periode: '19 → 21 août 2022', debut: '2022-08-19', montant: 1591, texte: 'Un Krakython d’été avec un concert : près de 900 € de dons en ligne et plus de 600 € sur place. Les Enfourneaux nous prêtent leurs locaux, LDLC le matériel.' },
  { titre: 'Retour en hiver', periode: 'Déc. 2022', debut: '2022-12-16', montant: null, texte: 'Le Krakython 2022 reprend le format de décembre, à partir du vendredi 16.' },
  { titre: 'GeoGuessr, quiz et rugby', periode: '15 → 17 déc. 2023', debut: '2023-12-15', montant: null, texte: 'Accueillis chez Les Enfourneaux, avec nos animations historiques : le Tournoi GeoGuessr et le Quiz Krakython. Et un maillot dédicacé du Stade Rochelais à gagner.' },
  { titre: 'En l’honneur de Max', periode: '24 → 26 janv. 2025', debut: '2025-01-24', montant: 6150, texte: 'La 5e édition, dédiée à notre ami : plus du double des années précédentes, et un concert caritatif des Tontons Binouz le samedi soir.' },
  { titre: 'Les premiers t-shirts', periode: '24 → 26 oct. 2025', debut: '2025-10-24', montant: null, texte: 'Un marathon d’automne lancé le vendredi à 21 h, et les premiers t-shirts aux couleurs du Krakython.' },
]

export const PARTENAIRES = [
  {
    nom: 'LDLC La Rochelle Angoulins',
    logo: 'ldlc',
    role: 'Prêt de matériel',
    etiquette: 'Matériel',
    badge: 'Depuis la 1re édition',
    texte: 'Le prêt de matériel informatique depuis la toute première édition : PC, micros, caméras, matériel haut débit et logistique. Nous sommes fiers et honorés de les compter parmi nos partenaires.',
    liens: [],
  },
  {
    nom: 'Crédit Agricole Charente-Maritime Deux-Sèvres',
    logo: 'ca',
    role: 'Recherche de locaux',
    etiquette: 'Soutien',
    texte: 'Un coup de main précieux dans la recherche de locaux pour accueillir nos prochaines éditions.',
    liens: [],
  },
  {
    nom: 'Les Enfourneaux',
    logo: 'enfourneaux',
    role: 'Prêt de locaux, Saint-Xandre',
    etiquette: 'Lieu',
    badge: 'Notre QG',
    texte: 'Basés à Saint-Xandre, issus du regroupement de 4 fermes du nord de La Rochelle, ils nous prêtent leurs locaux pour accueillir le live. Une agriculture plus collaborative et biologique.',
    liens: [
      { texte: 'Leur site', url: 'https://www.lesenfourneaux.com/' },
      { texte: 'Facebook', url: 'https://www.facebook.com/lesenfourneaux' },
      { texte: 'Leur vision en vidéo', url: 'https://www.youtube.com/watch?v=JIFEY4vDJAw' },
    ],
  },
]

export const PRESSE = [
  {
    rubrique: 'media',
    media: 'France Info',
    titre: 'Reportage sur France Info',
    sousTitre: 'Télé · France 3 Nouvelle-Aquitaine',
    date: '2025-01-27',
    extrait:
      'Ils sont huit amis de Charente-Maritime, passionnés de jeux vidéo, à l’origine du Krakython. En souvenir de leur ami décédé d’une leucémie. La somme des dons est conséquente : 6 150 euros. Plus du double des années précédentes.',
    lien: 'https://france3-regions.franceinfo.fr/nouvelle-aquitaine/charente-maritime/la-rochelle/krakython-un-marathon-de-jeux-video-en-ligne-en-souvenir-de-maxime-leur-ami-decede-d-une-leucemie-3098035.html',
    bouton: 'Lire l’article et voir le reportage',
  },
  {
    rubrique: 'media',
    media: 'France Bleu / ICI',
    titre: 'À l’antenne de France Bleu / ICI',
    sousTitre: 'Radio',
    date: '2025-01-24',
    extrait:
      'Le Krakython est organisé pour la 5e fois en Charente-Maritime ce week-end. Un groupe d’amis joue à des jeux vidéo en direct pendant 51 heures d’affilée, pour récolter des dons, et rendre hommage à l’un des leurs.',
    lien: 'https://www.ici.fr/infos/sante-sciences/memoire-a-max-en-charente-maritime-des-amis-organisent-le-kraython-51-heures-de-jeux-en-ligne-contre-la-leucemie-5407215',
    bouton: 'Lire l’article',
  },
  {
    rubrique: 'media',
    media: 'C17 Infos',
    titre: 'En vidéo sur C17 Infos',
    sousTitre: 'Vidéo',
    date: '2025-01-25',
    extrait: 'La télé locale de Charente-Maritime est venue tourner pendant le Krakython. Deux vidéos à voir sur YouTube.',
    videos: [
      { titre: 'Reportage 1', url: 'https://www.youtube.com/watch?v=ONFtR92VfDg' },
      { titre: 'Reportage 2', url: 'https://www.youtube.com/watch?v=oUx_NEwvuu0' },
    ],
  },
  {
    rubrique: 'media',
    media: 'Le Rugbynistère',
    titre: 'Dans Le Rugbynistère',
    sousTitre: 'Presse rugby · déc. 2023',
    date: '2023-12-15',
    extrait:
      'Maxime est un rugbyman pas comme les autres. Son parcours commence en octobre 1996 dans une petite ville, mais qui est grande par son stade, La Rochelle. C’est dans cette même ville qu’il foula le pré pour la première fois, dans l’école de rugby du Stade Rochelais.',
    lien: 'https://www.lerugbynistere.fr/news/un-marathon-de-soutien-lunion-du-rugby-et-du-gaming-pour-maxime-contre-la-leucemie-1512231745.php',
    bouton: 'Lire l’article',
  },
  { rubrique: 'federation', media: 'Fédération Leucémie Espoir', titre: 'Nouveauté : des t-shirts aux couleurs du Krakython', date: '2025-10-25', lien: 'https://www.leucemie-espoir.org/nouveaute-des-t-shirts-aux-couleurs-du-krakython/' },
  { rubrique: 'federation', media: 'Fédération Leucémie Espoir', titre: 'Krakython : un week-end du 24 au 26 octobre', date: '2025-10-24', lien: 'https://www.leucemie-espoir.org/krakython-week-end-du-24-au-26-octobre-2026/' },
  { rubrique: 'federation', media: 'Fédération Leucémie Espoir', titre: 'Le Krakython, un week-end solidaire !', date: '2025-01-24', lien: 'https://www.leucemie-espoir.org/le-krakython-un-week-end-solidaire/' },
  {
    rubrique: 'federation',
    media: 'Fédération Leucémie Espoir',
    titre: 'Leucémie Mag n°22 : le bilan de l’édition estivale 2022',
    date: '2023-06-01',
    dateTexte: 'Juin 2023',
    lien: 'https://www.leucemie-espoir.org/wp-content/uploads/2023/06/Leucemie-mag-22@bd-_sans-les-annonceurs.pdf',
  },
  { rubrique: 'federation', media: 'Fédération Leucémie Espoir', titre: 'À tous les passionnés de vidéo, ne ratez pas l’événement Krakython', date: '2021-12-17', lien: 'https://www.leucemie-espoir.org/a-tous-les-passionnes-de-video-ne-ratez-levenement-krakyton/' },
  {
    rubrique: 'federation',
    media: 'Fédération Leucémie Espoir',
    titre: 'Et si vous participiez au Krakython ? Un nom bien bizarre, mais une belle aventure',
    date: '2021-12-10',
    lien: 'https://www.leucemie-espoir.org/et-si-vous-participiez-au-krakython-un-nom-bien-bizarre-mais-une-belle-aventure-a-decouvrir-dans-larticle/',
  },
]

export const PAGE_PRESSE = {
  entete: {
    surtitre: 'Ils parlent de nous',
    titre: 'Succès débloqués.',
    intro: 'Depuis sa création, le Krakython attire l’attention de la presse locale et des médias spécialisés, qui relaient notre initiative. Merci à eux !',
  },
  medias: { surtitre: 'Médias', titre: 'Ils nous ont mis en lumière' },
  federation: { surtitre: 'Notre bénéficiaire en parle', titre: 'Côté Fédération Leucémie Espoir' },
  kit: {
    surtitre: 'Espace presse',
    titre: 'Journaliste ? Tout est là.',
    texte: 'Logo, photos et dossier de presse à télécharger. Pour une interview ou un reportage pendant le live, écris-nous.',
    telechargements: [
      { libelle: 'Logo symbole', format: 'PNG', fichier: 'logoPng' },
      { libelle: 'Logo horizontal', format: 'WEBP', fichier: 'logoHorizontal' },
    ],
    email: null,
    enBref: {
      titre: 'Le Krakython en bref',
      lignes: [
        { terme: 'Création', definition: 'Décembre 2021' },
        { terme: 'L’équipe', definition: 'Une bande d’amis de Charente-Maritime, passionnés de jeux vidéo' },
        { terme: 'Format', definition: '51 h de live sur Twitch : jeux, Quiz Krakython, Tournoi GeoGuessr, happenings' },
        { terme: 'Le nom', definition: '« Kraky », surnom de Maxime (Krakeunz en jeu), + marathon' },
        { terme: 'Bénéficiaire', definition: 'Fédération Leucémie Espoir' },
      ],
      pastilles: [{ texte: '6 éditions' }, { texte: '1 506 € en 2021' }, { texte: '6 150 € en janv. 2025' }],
    },
  },
}

export const PAGE_PARTENAIRES = {
  entete: {
    surtitre: 'Nos partenaires',
    titre: 'Ils jouent en co-op avec nous.',
    intro:
      'Un immense merci à nos partenaires, qui nous accompagnent dans l’organisation, le matériel et l’accueil du Krakython. Sans leur soutien, l’événement ne pourrait pas avoir lieu dans d’aussi bonnes conditions.',
    bouton: 'Devenir partenaire',
    bulle: 'Player 2 has joined',
  },
  merci: { surtitre: 'Party members', titre: 'Merci à eux', slotTitre: 'Ta structure ici ?', slotLien: 'Rejoindre la partie →' },
  beneficiaire: {
    surtitre: 'Notre objectif',
    titre: 'Au profit de la Fédération Leucémie Espoir',
    texte: 'Lever des fonds pour une association engagée dans la recherche contre la leucémie et qui accompagne les patients. Ses missions :',
    missions: ['Informer et soutenir les patients', 'Améliorer les conditions d’hospitalisation', 'Financer la recherche en hématologie', 'Soutenir des projets innovants'].map((texte) => ({ texte })),
    bouton: 'Découvrir la Fédération',
    scores: {
      titre: 'Tableau des scores',
      lignes: [
        { valeur: '1 506 €', legende: 'première édition, déc. 2021' },
        { valeur: '6 150 €', legende: '5e édition, janv. 2025' },
      ],
      totalLegende: 'versés depuis 2021',
    },
  },
  devenir: {
    surtitre: 'Comment nous soutenir ?',
    titre: 'Choisis ton mode co-op',
    texte: 'Tu veux nous aider ? Ton aide est précieuse. Et tu peux aussi passer pendant nos streams pour faire un don !',
    modes: [
      { titre: 'Prêter du matériel', texte: 'PC, micros, caméras, connexion : tout ce qu’il faut pour streamer 51 heures sans bug.', icone: 'ordi' },
      { titre: 'Nourrir l’équipe', texte: 'De quoi tenir 51 heures de stream : le carburant des joueurs, c’est sérieux.', icone: 'repas' },
      { titre: 'Accueillir le live', texte: 'Un lieu pour installer l’équipe le temps d’un week-end, comme Les Enfourneaux.', icone: 'maison' },
      { titre: 'Offrir des lots', texte: 'Jeux, goodies, places de match : tes lots motivent les dons pendant le live.', icone: 'cadeau' },
    ],
    retourTitre: 'En retour',
    retours: ['Ton logo sur le site et à l’écran du stream', 'Des remerciements en direct', 'Un article de présentation dans nos actus'].map((texte) => ({ texte })),
  },
  formulaire: { surtitre: 'Press start', titre: 'Nous contacter', delai: null },
}

export const PAGE_DON = {
  entete: {
    surtitre: 'Faire un don',
    titre: 'Fais monter la barre.',
    intro: 'Les dons passent par Streamlabs Charity et vont à la Fédération Leucémie Espoir. Le bonus : ton don s’affiche en direct sur le stream.',
  },
  etapes: {
    surtitre: 'Mode d’emploi',
    titre: 'Ta quête en 3 étapes',
    items: [
      { titre: 'Clique sur « Donner »', texte: 'Tu arrives sur la page Streamlabs Charity du Krakython.' },
      { titre: 'Choisis ton montant', texte: 'Ajoute ton pseudo et un message pour l’équipe et le chat.' },
      { titre: 'Ton alerte s’affiche', texte: 'L’équipe te remercie en live et la barre d’XP grimpe.' },
    ],
    bouton: 'Donner sur Streamlabs Charity',
    garanties: [{ texte: 'Paiement sécurisé par Streamlabs' }, { texte: 'Au profit de la Fédération Leucémie Espoir' }],
  },
  test: {
    surtitre: 'Mode entraînement',
    titre: 'Teste ton alerte avant de donner',
    texte: 'Rien n’est envoyé ici : c’est juste pour voir le rendu à droite.',
    montants: [10, 20, 50, 100].map((valeur) => ({ valeur })),
  },
  destination: {
    surtitre: null,
    titre: 'Où va ton don',
    items: [
      { titre: 'Recherche', texte: 'Financer la recherche en hématologie et des projets innovants.', icone: 'recherche' },
      { titre: 'Accompagnement', texte: 'Informer et soutenir les patients, améliorer les conditions d’hospitalisation.', icone: 'coeur' },
    ],
  },
  memoire: {
    surtitre: 'En mémoire de Max',
    texte: 'Chaque don fait vivre le combat de Maxime, alias Krakeunz, parti en 2024 à 27 ans.',
    lienTexte: 'Lire notre hommage →',
    lien: '/actualites/hommage-a-notre-ami',
  },
}

export const PAGE_ACTUALITES = {
  entete: {
    surtitre: 'Actualités',
    titre: 'Le journal du Kraken',
    titreSurligne: 'Kraken',
    intro: 'Ne rate aucune de nos nouvelles : nos derniers articles, les actus de la Fédération Leucémie Espoir et les dates des prochains événements. Merci de nous suivre !',
  },
  listeTitre: 'Nos derniers articles',
  alerte: { titre: 'Suis nos actus par e-mail', texte: 'Dates du prochain live, bilans et nouveautés de la boutique : on t’écrit seulement quand ça bouge.', bouton: 'Je m’abonne' },
}

export const ACTUALITES = [
  {
    titre: 'Hommage à notre ami',
    slug: 'hommage-a-notre-ami',
    date: '2024-11-27',
    categorie: 'asso',
    image: 'max',
    resume: 'Notre ami Maxime, alias Krakeunz, nous a quittés le 16 août. Il est à l’origine même de notre événement caritatif, qui existe depuis 2021.',
    contenu: rich(
      '**Bonjour à tous,**',
      'Il y a forcément des nouvelles que l’on n’aime pas annoncer en temps normal. Mais nous sommes au regret de vous annoncer que notre ami Maxime, alias Krakeunz, nous a quittés le 16 août dernier.',
      'Il est à l’origine même de notre événement caritatif existant depuis 2021, année durant laquelle nous avons appris le diagnostic de notre ami. Afin de l’accompagner à notre manière dans son combat, nous avons organisé le Krakython : un événement caritatif sur la plateforme Twitch. Durant tout un week-end, nous diffusons nos parties de jeux vidéo en direct dans l’objectif de récolter des dons pour la Fédération Leucémie Espoir.',
      'Le Krakython représente notre manière de participer à cette œuvre collective tout en soutenant notre ami à travers sa passion pour les jeux vidéo. Ainsi, chaque année, nous organisons pendant l’hiver une nouvelle édition.',
      'Le départ de Maxime, figure de proue de notre événement, nous a tous considérablement impactés. Notre motivation et notre engagement restent toutefois intacts.',
      '> Notre prochaine édition, organisée début 2025, sera en l’honneur de notre ami, afin que sa combativité, son mental et son enthousiasme soient un exemple pour le plus grand nombre.',
      'Nous vous donnons donc rendez-vous très prochainement sur nos réseaux sociaux et notre site internet pour rester informés de notre prochaine édition. À très bientôt.',
      '**L’équipe du Krakython**',
    ),
  },
  {
    titre: 'Présentation Les Enfourneaux',
    slug: 'presentation-les-enfourneaux',
    date: '2023-11-21',
    categorie: 'partenaire',
    image: 'enfourneaux',
    resume: 'Cette année encore, Les Enfourneaux nous prêtent leurs locaux. Issus du regroupement de 4 fermes du nord de La Rochelle, ils défendent une agriculture plus collaborative et biologique.',
    contenu: rich(
      'Lors de cette nouvelle édition, nous nous associons une nouvelle fois avec l’entreprise Les Enfourneaux qui nous prêtent leurs locaux pour nous accueillir. Les Enfourneaux est issu du regroupement de 4 fermes du nord de La Rochelle. Les Enfourneaux propose une méthode alternative de l’agriculture : plus collaborative, biologique et nutritive.',
      '[Découvrez leur vision de l’agriculture en vidéo](https://www.youtube.com/watch?v=JIFEY4vDJAw)',
    ),
  },
  {
    titre: 'J-30 avant le Krakython 2023',
    slug: 'j-30-avant-le-krakython-2023',
    date: '2023-11-15',
    categorie: 'evenement',
    etiquette: 'J-30',
    resume: 'Toute l’équipe se mobilise avec nos partenaires. Les habitués retrouveront nos deux animations historiques : le Tournoi GeoGuessr et le Quiz Krakython.',
    contenu: rich(
      'J-30 avant le lancement du Krakython 2023 ! Toute l’équipe continue de se mobiliser avec nos partenaires pour vous proposer un super week-end caritatif. Si vous êtes déjà un habitué de nos précédentes éditions, vous pourrez retrouver deux de nos animations historiques à savoir : le Tournoi GeoGuessr et le Quiz Krakython.',
      'Rendez-vous très bientôt sur Twitch !',
    ),
  },
  {
    // Brouillon à publier le jour de la mise en ligne du nouveau site.
    titre: 'Nouveau site, nouvelle boutique',
    slug: 'nouveau-site-nouvelle-boutique',
    date: '2026-10-15',
    categorie: 'asso',
    publie: false,
    aLaUne: true,
    etiquette: 'New game +',
    resume: 'Le Krakython fait peau neuve : un site tout neuf, la cagnotte en direct, et une boutique maison pour commander t-shirts et goodies sans passer par Shopify.',
    contenu: rich(
      'Le Krakython fait peau neuve ! Nouveau site, nouvelles couleurs, et surtout une boutique maison pour commander t-shirts et goodies directement ici.',
      '## Ce qui change',
      '- La cagnotte de l’édition en cours et le compte à rebours du prochain live, dès l’accueil',
      '- Une boutique avec paiement sécurisé par carte, livraison Colissimo ou retrait en main propre',
      '- Toutes nos actus, la presse et nos partenaires au même endroit',
      'Merci à tous pour votre soutien, et rendez-vous sur Twitch pour la prochaine édition !',
    ),
  },
]

// Catalogue d'exemple repris des maquettes : prix et stocks À REMPLACER par les vrais.
export const PRODUITS = [
  { nom: 'T-shirt Kraken', categorie: 'textile', prix: 20, sousTitre: 'Unisexe · bleu Krakython · S à XXL', badge: 'Édition 2026', illustration: 'tshirt', fond: 'bleu', enAvant: true, tailles: [['S', 10], ['M', 15], ['L', 15], ['XL', 10], ['XXL', 5]] },
  { nom: 'Sweat à capuche', categorie: 'textile', prix: 40, sousTitre: 'Unisexe · rose manette · S à XXL', illustration: 'sweat', fond: 'rose', enAvant: true, tailles: [['S', 5], ['M', 8], ['L', 8], ['XL', 5], ['XXL', 3]] },
  { nom: 'Casquette brodée', categorie: 'textile', prix: 18, sousTitre: 'Taille unique · réglable', illustration: 'casquette', fond: 'bleu', stock: 20 },
  { nom: 'Mug Krakython', categorie: 'accessoires', prix: 12, sousTitre: 'Céramique · pour les nuits de stream', illustration: 'mug', fond: 'rose', enAvant: true, stock: 30 },
  { nom: 'Tapis de souris XL', categorie: 'accessoires', prix: 18, sousTitre: 'Pour viser juste pendant le marathon', illustration: 'tapis', fond: 'bleu', stock: 15 },
  { nom: 'Tote bag', categorie: 'accessoires', prix: 10, sousTitre: 'Pour le stade, le marché, les courses', illustration: 'tote', fond: 'rose', stock: 25 },
  { nom: 'Pack de stickers', categorie: 'goodies', prix: 5, sousTitre: 'Manette, PC, gourde : tout y passe', badge: 'Pack x3', illustration: 'stickers', fond: 'bleu', enAvant: true, stock: null },
  { nom: 'Porte-clés badge', categorie: 'goodies', prix: 5, sousTitre: 'Le Kraken partout avec toi', illustration: 'porte-cles', fond: 'rose', stock: 40 },
]

export const PAGE_BOUTIQUE = {
  entete: {
    surtitre: 'Loot officiel',
    titre: 'La boutique du Kraken',
    intro: 'Textile, goodies et accessoires aux couleurs du Krakython. Chaque commande soutient l’association.',
    bulle: '+1 loot',
    badges: [
      { texte: 'Paiement sécurisé', icone: 'cadenas' },
      { texte: 'Colissimo ou retrait en main propre', icone: 'camion' },
      { texte: 'Bénéfices pour la cause', icone: 'coeur' },
    ],
  },
  panier: { titre: 'Ton inventaire', videTitre: 'Le Kraken a faim', videTexte: 'Ton panier est vide. Ajoute un article pour commencer.' },
  soutien: { titre: 'Pas besoin de loot pour aider', texte: 'Un don direct, c’est 66 % déductible de tes impôts.', bouton: 'Faire un don' },
  confirmation: {
    titre: 'GG, commande validée !',
    texte: 'Merci pour ton soutien ! Un e-mail de confirmation vient de partir. On prépare ton colis (ou on te recontacte pour le retrait) très vite.',
  },
  colissimo: { actif: true, prix: 6.5, delai: 'sous 5 à 7 jours' },
  retrait: { actif: true, texte: 'Gratuit. À récupérer pendant le Krakython ou à La Rochelle : on t’écrit pour convenir du moment.' },
  arrondi: { actif: true, titre: 'Ajouter un don à ma commande', texte: 'Arrondi aux 5 € supérieurs, reversé à la Fédération Leucémie Espoir' },
}
