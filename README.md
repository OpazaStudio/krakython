# Krakython · site et boutique

Site de l’association **Krakython** : marathon caritatif de jeux vidéo (51 h de live sur Twitch) au profit de la Fédération Leucémie Espoir, en mémoire de Maxime « Krakeunz ». Direction artistique validée : **DA 1 « cartoon »** (bleu `#197DC7` et rose `#F23852` du logo, contours noirs, ombres franches, Lilita One / Nunito / Silkscreen).

- **Payload CMS 3 dans Next.js 16** (App Router) : une seule application, l’admin est sur `/admin`, en français.
- **Édition en direct** : chaque page a son entrée dans l’admin avec l’aperçu en direct ; on modifie un texte à gauche, le site change à droite avant même d’enregistrer.
- **Boutique maison**, écrite dans Payload : panier dans le navigateur, paiement **Stripe Checkout**, stock par taille réservé au moment du paiement, commandes dans l’admin, e-mails via **Resend**. Livraison Colissimo (forfait) ou retrait en main propre.
- **E-mails** via **Resend** : confirmations de commande, messages du formulaire de contact, et le « mot de passe oublié » de l’admin (adaptateur `@payloadcms/email-resend`, activé dès que `RESEND_API_KEY` est renseignée).
- **Dons** : rien ne transite par le site. Les boutons « Faire un don » mènent à la page dédiée, qui renvoie vers **Streamlabs Charity** (ou directement vers Streamlabs : case à cocher dans Réglages → Événement et cagnotte).
- Postgres (Neon sur Vercel, local en dev), images sur Vercel Blob en prod, polices auto-hébergées (`src/fonts`, licence OFL).

## Démarrer en local

Prérequis : Node 22, pnpm 10+, un serveur Postgres qui tourne. Inutile de créer la base à la main : `pnpm payload migrate` crée `krakython` s’il ne la trouve pas.

```bash
brew install postgresql@17 && brew services start postgresql@17   # une seule fois, si Postgres n’est pas déjà installé
cp .env.example .env        # renseigner DATABASE_URL, PAYLOAD_SECRET et SEED_ADMIN_PASSWORD
pnpm install
pnpm payload migrate        # crée la base si besoin, puis les tables
pnpm seed                   # contenu réel de l’ancien site, photos, équipe, presse, boutique d’exemple, compte admin
pnpm dev                    # http://localhost:3200 (site) et http://localhost:3200/admin
```

`DATABASE_URL` selon l’installation de Postgres :

- **Homebrew** ou **Postgres.app** : `postgres://<utilisateur Mac>@localhost:5432/krakython`, sans mot de passe (`whoami` donne le nom d’utilisateur).
- **Docker** (`docker run -d --name krakython-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:17`) : `postgres://postgres:postgres@localhost:5432/krakython`.

Le seed crée le compte admin avec l’adresse `SEED_ADMIN_EMAIL` (par défaut `admin@krakython.fr`) et le mot de passe `SEED_ADMIN_PASSWORD`. **Ce mot de passe n’a pas de valeur par défaut : sans lui le seed s’arrête.** Choisis-en un fort, propre à chaque environnement, et ne le mets jamais dans un fichier suivi par git. Le seed est idempotent : il réécrit les textes des pages et des réglages, mais ne recrée pas les membres, éditions, articles, produits… déjà présents. Avant un premier seed, `public/media` doit être vide (Payload suffixe sinon les noms de fichiers).

Le site tourne sur le port 3200 plutôt que le 3000, pour ne pas entrer en conflit avec d’autres projets lancés en parallèle.

## Ce que l’asso modifie dans `/admin`

| Rubrique | Contenu |
|---|---|
| **Pages** → Accueil, Qui sommes-nous, Actualités, Ils parlent de nous, Nos partenaires, Faire un don, Mentions légales, CGV, Confidentialité | Tous les textes de chaque page, avec aperçu en direct, et les champs SEO. |
| **Contenu** → Actualités, Équipe, Éditions, Partenaires, Presse, Images | Les articles ; les fiches joueurs ; le journal de quête (le total récolté se calcule tout seul) ; les partenaires ; les retombées presse ; la médiathèque. |
| **Boutique** → Produits, Commandes, Boutique (page et livraison) | Le catalogue (prix, photos, tailles et stock) ; les commandes et leur statut ; les frais de port, le retrait, l’arrondi solidaire. |
| **Réglages** → Événement et cagnotte | Nom de l’édition, dates (compte à rebours), **lien Streamlabs**, montant et objectif de la cagnotte (barre d’XP), paliers, bandeau d’annonce. |
| **Réglages** → Infos de l’asso | E-mail de contact, réseaux sociaux, bénéficiaire, pied de page. |
| **Administration** → Messages reçus, Alerte du prochain live, Utilisateurs | Le formulaire « Nous contacter », les e-mails laissés pour l’alerte, les comptes de l’équipe. |

## Boutique : comment ça marche

1. Le panier vit dans le navigateur. Au clic sur « Payer », le serveur **relit prix, tailles et stock en base** (le navigateur n’envoie que des identifiants et des quantités).
2. Le stock est **réservé en SQL atomique** (« retirer seulement s’il en reste assez ») : deux personnes ne peuvent pas acheter le dernier t-shirt M. La commande est créée « en attente », puis l’acheteur part sur la page de paiement Stripe (valable 30 min).
3. Le **webhook** `/api/stripe/webhook` passe la commande « payée » (une seule fois, sous verrou de ligne, même si Stripe et le retour du client arrivent en même temps) et envoie les e-mails : confirmation à l’acheteur, notification à l’asso. Si l’envoi échoue, le webhook répond en erreur et Stripe réessaie plus tard.
4. Paiement abandonné (bouton retour de Stripe, nouvel essai depuis le panier), session expirée ou paiement refusé : la commande est annulée et **le stock revient**. Les commandes jamais payées sont aussi nettoyées automatiquement au bout d’une heure. Une commande annulée par l’admin n’est jamais réactivée par Stripe.
5. **Stock** : dans la fiche produit, « Stock actuel » est en lecture seule (il baisse tout seul avec les ventes) ; pour réassortir ou corriger, on saisit « Ajouter au stock » (+10, −2…), appliqué sur la valeur à jour au moment d’enregistrer. Une fiche restée ouverte pendant une vente ne peut donc pas écraser le stock. Limites anti-abus : 10 exemplaires par article, 30 articles et 3 paiements en cours par adresse e-mail.
6. Dans l’admin, la commande avance : Payée → Préparée → Expédiée (Colissimo, avec n° de suivi) ou Remise en main propre. Pas de retour en arrière possible. Annuler une commande remet les articles en stock mais **ne rembourse pas** : le remboursement se fait depuis le Dashboard Stripe.

Le tableau de bord de l’admin affiche les commandes à préparer, les messages non traités et l’état de la cagnotte.

## Déployer sur Vercel

1. Pousser le dépôt sur GitHub et l’importer sur Vercel (build : `pnpm build`, qui joue les migrations puis construit le site).
2. **Storage → Neon** (Postgres) : Vercel injecte `DATABASE_URL`.
3. **Storage → Blob**, accès **Public** : Vercel injecte `BLOB_READ_WRITE_TOKEN`.
4. Variables à ajouter : `PAYLOAD_SECRET` (`openssl rand -hex 24`), `NEXT_PUBLIC_SERVER_URL` (URL publique sans slash final), `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY` (sans elle, le « mot de passe oublié » de l’admin ne part pas), `EMAIL_FROM` (adresse d’un domaine vérifié dans Resend), `EMAIL_ASSO`.
5. **Stripe** : Dashboard → Développeurs → Webhooks → ajouter `https://<domaine>/api/stripe/webhook` avec les événements `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired`, puis copier le secret `whsec_…`. Clé conseillée : une clé restreinte (`rk_…`) avec les droits Checkout Sessions en écriture. En local : `stripe listen --forward-to localhost:3200/api/stripe/webhook`.
6. Lancer une fois `pnpm seed` en local en pointant `DATABASE_URL` et `BLOB_READ_WRITE_TOKEN` sur la prod (le seed envoie les photos sur Blob).
7. Rattacher le domaine. Les anciennes adresses d’articles WordPress sont redirigées en 301 (`redirects.ts`).

## Scripts

| Commande | Rôle |
|---|---|
| `pnpm dev` | Serveur de développement (port 3200) |
| `pnpm build` | `payload migrate` puis `next build` |
| `pnpm seed` | Remplit la base avec le contenu de départ |
| `pnpm test` | Tests unitaires (panier, montants, arrondi, statuts, résolution des prix) |
| `pnpm test:integration` | Tests contre la base : stock en concurrence, paiement idempotent, annulation, webhook signé |
| `pnpm migrate:create` | Nouvelle migration après un changement de champs (le schéma n’est jamais poussé à chaud) |
| `pnpm generate:types` | Régénère `src/payload-types.ts` |
| `pnpm generate:importmap` | Régénère la carte d’import de l’admin |

## Structure

```
src/
  payload.config.ts        # admin en français, aperçu en direct, plugins SEO et Blob
  collections/             # actualités, équipe, éditions, partenaires, presse, médias, produits, commandes, messages, alerte, utilisateurs
  globals/                 # une entrée par page + Événement et cagnotte + Infos de l’asso
  hooks/revalidate.ts      # régénération des pages statiques à l’enregistrement
  migrations/              # migrations Postgres
  app/(frontend)/          # le site (page.tsx = données + SEO, *View.tsx = rendu + aperçu en direct)
  app/(payload)/           # admin et API Payload (générés)
  app/api/stripe/webhook/  # webhook Stripe
  components/              # en-tête, pied, décor (tentacules, ventouses), icônes, vues par page
  lib/boutique/            # commandes, stock, montants, Stripe, e-mails
  lib/panier/              # panier (logique pure + contexte React)
seed/                      # contenu de départ et photos
tests/                     # tests unitaires et d’intégration
```

## À compléter avant la mise en ligne

- **Lien Streamlabs 2026** : le seed met celui d’octobre 2025 (Réglages → Événement et cagnotte).
- **Dates de l’édition**, montant et objectif de la cagnotte.
- **66 % déductible** : mention reprise de la maquette (bandeau, cagnotte, « Choisis ta classe », boutique). À confirmer avec la Fédération Leucémie Espoir (reçu fiscal émis via Streamlabs ?) ou à retirer.
- **Catalogue** : les 8 produits sont ceux de la maquette, avec des prix et stocks d’exemple. Mettre les vrais, et des photos.
- **E-mail de contact** (Infos de l’asso) et e-mail presse.
- **Mentions légales, CGV, confidentialité** : les champs entre crochets (siège, RNA, président·e, hébergeur, médiateur, régime de TVA) et une relecture.
- L’article « Nouveau site, nouvelle boutique » est en brouillon : à publier le jour J.
