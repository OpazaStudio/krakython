import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_actualites_categorie" AS ENUM('evenement', 'partenaire', 'asso');
  CREATE TYPE "public"."enum_membres_statut" AS ENUM('ready', 'recrue', 'memoire');
  CREATE TYPE "public"."enum_presse_rubrique" AS ENUM('media', 'federation');
  CREATE TYPE "public"."enum_produits_categorie" AS ENUM('textile', 'accessoires', 'goodies');
  CREATE TYPE "public"."enum_produits_illustration" AS ENUM('tshirt', 'sweat', 'casquette', 'mug', 'tapis', 'tote', 'stickers', 'porte-cles');
  CREATE TYPE "public"."enum_produits_fond" AS ENUM('bleu', 'rose');
  CREATE TYPE "public"."enum_commandes_statut" AS ENUM('en_attente', 'payee', 'preparee', 'expediee', 'retiree', 'annulee');
  CREATE TYPE "public"."enum_commandes_livraison_mode" AS ENUM('colissimo', 'retrait');
  CREATE TYPE "public"."enum_commandes_annulee_par" AS ENUM('systeme', 'admin');
  CREATE TYPE "public"."enum_messages_sujet" AS ENUM('partenariat', 'equipe', 'presse', 'autre');
  CREATE TYPE "public"."enum_accueil_cagnotte_chiffres_couleur" AS ENUM('rose', 'bleu', 'blanc');
  CREATE TYPE "public"."enum_accueil_programme_items_icone" AS ENUM('manette', 'quiz', 'globe', 'cadeau', 'coeur', 'sac', 'goutte', 'groupe', 'ordi', 'repas', 'maison', 'recherche', 'cadenas', 'camion', 'trophee', 'micro', 'video', 'tv', 'ballon', 'photo', 'document');
  CREATE TYPE "public"."enum_accueil_classes_items_icone" AS ENUM('manette', 'quiz', 'globe', 'cadeau', 'coeur', 'sac', 'goutte', 'groupe', 'ordi', 'repas', 'maison', 'recherche', 'cadenas', 'camion', 'trophee', 'micro', 'video', 'tv', 'ballon', 'photo', 'document');
  CREATE TYPE "public"."enum_accueil_classes_items_couleur" AS ENUM('rose', 'bleu', 'blanc');
  CREATE TYPE "public"."enum_page_partenaires_devenir_modes_icone" AS ENUM('manette', 'quiz', 'globe', 'cadeau', 'coeur', 'sac', 'goutte', 'groupe', 'ordi', 'repas', 'maison', 'recherche', 'cadenas', 'camion', 'trophee', 'micro', 'video', 'tv', 'ballon', 'photo', 'document');
  CREATE TYPE "public"."enum_page_don_destination_items_icone" AS ENUM('manette', 'quiz', 'globe', 'cadeau', 'coeur', 'sac', 'goutte', 'groupe', 'ordi', 'repas', 'maison', 'recherche', 'cadenas', 'camion', 'trophee', 'micro', 'video', 'tv', 'ballon', 'photo', 'document');
  CREATE TYPE "public"."enum_page_boutique_entete_badges_icone" AS ENUM('manette', 'quiz', 'globe', 'cadeau', 'coeur', 'sac', 'goutte', 'groupe', 'ordi', 'repas', 'maison', 'recherche', 'cadenas', 'camion', 'trophee', 'micro', 'video', 'tv', 'ballon', 'photo', 'document');
  CREATE TABLE "actualites" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titre" varchar NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"publie" boolean DEFAULT true,
  	"a_la_une" boolean DEFAULT false,
  	"slug" varchar,
  	"categorie" "enum_actualites_categorie" DEFAULT 'evenement' NOT NULL,
  	"image_id" integer,
  	"etiquette" varchar,
  	"resume" varchar NOT NULL,
  	"contenu" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "membres_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar NOT NULL
  );
  
  CREATE TABLE "membres" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"prenom" varchar NOT NULL,
  	"pseudo" varchar,
  	"photo_id" integer,
  	"bio" varchar NOT NULL,
  	"twitch" varchar,
  	"statut" "enum_membres_statut" DEFAULT 'ready',
  	"ordre" numeric DEFAULT 10,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "editions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titre" varchar NOT NULL,
  	"periode" varchar NOT NULL,
  	"debut" timestamp(3) with time zone NOT NULL,
  	"montant" numeric,
  	"texte" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "partenaires_liens" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texte" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "partenaires" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nom" varchar NOT NULL,
  	"logo_id" integer,
  	"role" varchar NOT NULL,
  	"etiquette" varchar,
  	"badge" varchar,
  	"texte" varchar NOT NULL,
  	"ordre" numeric DEFAULT 10,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "presse_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titre" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "presse" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"rubrique" "enum_presse_rubrique" DEFAULT 'media' NOT NULL,
  	"media" varchar NOT NULL,
  	"titre" varchar NOT NULL,
  	"sous_titre" varchar,
  	"date" timestamp(3) with time zone NOT NULL,
  	"date_texte" varchar,
  	"extrait" varchar,
  	"lien" varchar,
  	"bouton" varchar DEFAULT 'Lire l’article',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_miniature_url" varchar,
  	"sizes_miniature_width" numeric,
  	"sizes_miniature_height" numeric,
  	"sizes_miniature_mime_type" varchar,
  	"sizes_miniature_filesize" numeric,
  	"sizes_miniature_filename" varchar,
  	"sizes_carte_url" varchar,
  	"sizes_carte_width" numeric,
  	"sizes_carte_height" numeric,
  	"sizes_carte_mime_type" varchar,
  	"sizes_carte_filesize" numeric,
  	"sizes_carte_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "produits_tailles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"taille" varchar NOT NULL,
  	"stock" numeric,
  	"ajout" numeric
  );
  
  CREATE TABLE "produits" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nom" varchar NOT NULL,
  	"actif" boolean DEFAULT true,
  	"en_avant" boolean DEFAULT false,
  	"slug" varchar,
  	"categorie" "enum_produits_categorie" DEFAULT 'textile' NOT NULL,
  	"ordre" numeric DEFAULT 10,
  	"prix" numeric NOT NULL,
  	"sous_titre" varchar,
  	"badge" varchar,
  	"illustration" "enum_produits_illustration" DEFAULT 'tshirt',
  	"fond" "enum_produits_fond" DEFAULT 'bleu',
  	"description" jsonb,
  	"stock" numeric,
  	"ajout_stock" numeric,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "produits_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "commandes_lignes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nom" varchar NOT NULL,
  	"taille" varchar,
  	"quantite" numeric NOT NULL,
  	"prix_unitaire" numeric NOT NULL,
  	"produit_id" integer,
  	"taille_id" varchar
  );
  
  CREATE TABLE "commandes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"numero" varchar NOT NULL,
  	"statut" "enum_commandes_statut" DEFAULT 'en_attente' NOT NULL,
  	"numero_suivi" varchar,
  	"note" varchar,
  	"client_nom" varchar NOT NULL,
  	"client_email" varchar NOT NULL,
  	"client_telephone" varchar,
  	"livraison_mode" "enum_commandes_livraison_mode" NOT NULL,
  	"livraison_adresse" varchar,
  	"livraison_code_postal" varchar,
  	"livraison_ville" varchar,
  	"sous_total" numeric NOT NULL,
  	"frais_livraison" numeric DEFAULT 0 NOT NULL,
  	"don_solidaire" numeric DEFAULT 0,
  	"total" numeric NOT NULL,
  	"paiement_session_id" varchar,
  	"paiement_payment_intent" varchar,
  	"paiement_differe" boolean DEFAULT false,
  	"paiement_paye_le" timestamp(3) with time zone,
  	"stock_reserve" boolean DEFAULT false,
  	"annulee_par" "enum_commandes_annulee_par",
  	"emails_envoyes" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nom" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"structure" varchar,
  	"sujet" "enum_messages_sujet" DEFAULT 'autre',
  	"soutien" varchar,
  	"message" varchar NOT NULL,
  	"traite" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "abonnes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nom" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"actualites_id" integer,
  	"membres_id" integer,
  	"editions_id" integer,
  	"partenaires_id" integer,
  	"presse_id" integer,
  	"media_id" integer,
  	"produits_id" integer,
  	"commandes_id" integer,
  	"messages_id" integer,
  	"abonnes_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "accueil_hero_garanties" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texte" varchar NOT NULL
  );
  
  CREATE TABLE "accueil_defile" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texte" varchar NOT NULL
  );
  
  CREATE TABLE "accueil_cagnotte_chiffres" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"valeur" varchar NOT NULL,
  	"legende" varchar NOT NULL,
  	"couleur" "enum_accueil_cagnotte_chiffres_couleur" DEFAULT 'rose'
  );
  
  CREATE TABLE "accueil_max_fiche_infos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"valeur" varchar NOT NULL
  );
  
  CREATE TABLE "accueil_programme_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titre" varchar NOT NULL,
  	"texte" varchar NOT NULL,
  	"icone" "enum_accueil_programme_items_icone" DEFAULT 'manette'
  );
  
  CREATE TABLE "accueil_classes_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nom" varchar NOT NULL,
  	"icone" "enum_accueil_classes_items_icone" DEFAULT 'manette',
  	"couleur" "enum_accueil_classes_items_couleur" DEFAULT 'rose',
  	"texte" varchar NOT NULL,
  	"pouvoir" varchar,
  	"bouton" varchar NOT NULL,
  	"lien" varchar
  );
  
  CREATE TABLE "accueil_live_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titre" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "accueil" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_pastille1" varchar,
  	"hero_pastille2" varchar,
  	"hero_titre" varchar NOT NULL,
  	"hero_titre_surligne" varchar,
  	"hero_texte" varchar,
  	"hero_bouton_don" varchar DEFAULT 'Faire un don',
  	"hero_bouton_live" varchar DEFAULT 'Regarder le live',
  	"hero_compte_rebours" varchar DEFAULT 'Prochain live dans',
  	"cagnotte_texte" varchar,
  	"cagnotte_bouton" varchar DEFAULT 'Je fais monter la barre',
  	"max_surtitre" varchar,
  	"max_titre" varchar NOT NULL,
  	"max_intro" varchar,
  	"max_citation_texte" varchar,
  	"max_citation_auteur" varchar,
  	"max_texte" jsonb,
  	"max_bouton" varchar DEFAULT 'Faire un don en mémoire de Max',
  	"max_fiche_prenom" varchar,
  	"max_fiche_pseudo" varchar,
  	"max_fiche_photo_id" integer,
  	"programme_surtitre" varchar,
  	"programme_titre" varchar,
  	"classes_surtitre" varchar,
  	"classes_titre" varchar,
  	"classes_texte" varchar,
  	"boutique_surtitre" varchar,
  	"boutique_titre" varchar,
  	"boutique_texte" varchar,
  	"boutique_bouton" varchar DEFAULT 'Toute la boutique',
  	"live_surtitre" varchar,
  	"live_titre" varchar,
  	"live_texte" varchar,
  	"live_bouton" varchar DEFAULT 'Suivre sur Twitch',
  	"live_alerte_exemple" varchar DEFAULT 'Ton pseudo · 20 €',
  	"live_alerte_texte" varchar DEFAULT 'Ton pseudo s’affiche en direct sur le stream',
  	"partenaires_surtitre" varchar,
  	"partenaires_titre" varchar,
  	"partenaires_bouton" varchar DEFAULT 'Devenir partenaire',
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "qui_sommes_nous_nom_chiffres" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"valeur" varchar NOT NULL,
  	"legende" varchar NOT NULL
  );
  
  CREATE TABLE "qui_sommes_nous" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"entete_surtitre" varchar,
  	"entete_titre" varchar NOT NULL,
  	"entete_intro" varchar,
  	"entete_citation_texte" varchar,
  	"entete_citation_auteur" varchar,
  	"nom_surtitre" varchar,
  	"nom_titre" varchar,
  	"nom_mot1" varchar DEFAULT 'Kraky',
  	"nom_mot1_texte" varchar,
  	"nom_mot2" varchar DEFAULT 'Marathon',
  	"nom_mot2_texte" varchar,
  	"nom_texte" jsonb,
  	"nom_total_legende" varchar DEFAULT 'récoltés depuis le début de l’aventure',
  	"quete_surtitre" varchar,
  	"quete_titre" varchar,
  	"quete_texte" varchar,
  	"quete_prochain_titre" varchar DEFAULT 'La quête continue',
  	"quete_prochain_bouton" varchar DEFAULT 'Activer le rappel Twitch',
  	"quete_video_surtitre" varchar DEFAULT 'En vidéo',
  	"quete_video_titre" varchar,
  	"quete_video_texte" varchar,
  	"quete_video_url" varchar,
  	"equipe_surtitre" varchar,
  	"equipe_titre" varchar,
  	"equipe_texte" varchar,
  	"equipe_recrue_titre" varchar DEFAULT 'Et toi ?',
  	"equipe_recrue_texte" varchar,
  	"rejoindre_titre" varchar,
  	"rejoindre_texte" varchar,
  	"rejoindre_bouton" varchar DEFAULT 'Nous écrire',
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "page_actualites" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"entete_surtitre" varchar,
  	"entete_titre" varchar NOT NULL,
  	"entete_intro" varchar,
  	"entete_titre_surligne" varchar,
  	"liste_titre" varchar DEFAULT 'Nos derniers articles',
  	"alerte_titre" varchar,
  	"alerte_texte" varchar,
  	"alerte_bouton" varchar DEFAULT 'Je m’abonne',
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "page_presse_kit_telechargements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"libelle" varchar NOT NULL,
  	"format" varchar,
  	"fichier_id" integer,
  	"lien" varchar
  );
  
  CREATE TABLE "page_presse_kit_en_bref_lignes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"terme" varchar NOT NULL,
  	"definition" varchar NOT NULL
  );
  
  CREATE TABLE "page_presse_kit_en_bref_pastilles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texte" varchar NOT NULL
  );
  
  CREATE TABLE "page_presse" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"entete_surtitre" varchar,
  	"entete_titre" varchar NOT NULL,
  	"entete_intro" varchar,
  	"medias_surtitre" varchar,
  	"medias_titre" varchar,
  	"federation_surtitre" varchar,
  	"federation_titre" varchar,
  	"kit_surtitre" varchar,
  	"kit_titre" varchar,
  	"kit_texte" varchar,
  	"kit_email" varchar,
  	"kit_en_bref_titre" varchar DEFAULT 'Le Krakython en bref',
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "page_partenaires_beneficiaire_missions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texte" varchar NOT NULL
  );
  
  CREATE TABLE "page_partenaires_beneficiaire_scores_lignes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"valeur" varchar NOT NULL,
  	"legende" varchar NOT NULL
  );
  
  CREATE TABLE "page_partenaires_devenir_modes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titre" varchar NOT NULL,
  	"texte" varchar NOT NULL,
  	"icone" "enum_page_partenaires_devenir_modes_icone" DEFAULT 'manette'
  );
  
  CREATE TABLE "page_partenaires_devenir_retours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texte" varchar NOT NULL
  );
  
  CREATE TABLE "page_partenaires" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"entete_surtitre" varchar,
  	"entete_titre" varchar NOT NULL,
  	"entete_intro" varchar,
  	"entete_bouton" varchar DEFAULT 'Devenir partenaire',
  	"entete_bulle" varchar DEFAULT 'Player 2 has joined',
  	"merci_surtitre" varchar,
  	"merci_titre" varchar,
  	"merci_slot_titre" varchar DEFAULT 'Ta structure ici ?',
  	"merci_slot_lien" varchar DEFAULT 'Rejoindre la partie →',
  	"beneficiaire_surtitre" varchar,
  	"beneficiaire_titre" varchar,
  	"beneficiaire_texte" varchar,
  	"beneficiaire_bouton" varchar DEFAULT 'Découvrir la Fédération',
  	"beneficiaire_scores_titre" varchar DEFAULT 'Tableau des scores',
  	"beneficiaire_scores_total_legende" varchar DEFAULT 'versés depuis 2021',
  	"devenir_surtitre" varchar,
  	"devenir_titre" varchar,
  	"devenir_texte" varchar,
  	"devenir_retour_titre" varchar DEFAULT 'En retour',
  	"formulaire_surtitre" varchar,
  	"formulaire_titre" varchar,
  	"formulaire_delai" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "page_don_etapes_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titre" varchar NOT NULL,
  	"texte" varchar NOT NULL
  );
  
  CREATE TABLE "page_don_etapes_garanties" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texte" varchar NOT NULL
  );
  
  CREATE TABLE "page_don_test_montants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"valeur" numeric NOT NULL
  );
  
  CREATE TABLE "page_don_destination_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titre" varchar NOT NULL,
  	"texte" varchar NOT NULL,
  	"icone" "enum_page_don_destination_items_icone" DEFAULT 'manette'
  );
  
  CREATE TABLE "page_don" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"entete_surtitre" varchar,
  	"entete_titre" varchar NOT NULL,
  	"entete_intro" varchar,
  	"etapes_surtitre" varchar,
  	"etapes_titre" varchar,
  	"etapes_bouton" varchar DEFAULT 'Donner sur Streamlabs Charity',
  	"test_surtitre" varchar,
  	"test_titre" varchar,
  	"test_texte" varchar,
  	"destination_surtitre" varchar,
  	"destination_titre" varchar,
  	"memoire_surtitre" varchar,
  	"memoire_texte" varchar,
  	"memoire_lien_texte" varchar,
  	"memoire_lien" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "mentions_legales" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titre" varchar NOT NULL,
  	"maj_le" timestamp(3) with time zone,
  	"contenu" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "cgv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titre" varchar NOT NULL,
  	"maj_le" timestamp(3) with time zone,
  	"contenu" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "confidentialite" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titre" varchar NOT NULL,
  	"maj_le" timestamp(3) with time zone,
  	"contenu" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "page_boutique_entete_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texte" varchar NOT NULL,
  	"icone" "enum_page_boutique_entete_badges_icone" DEFAULT 'manette'
  );
  
  CREATE TABLE "page_boutique" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"entete_surtitre" varchar,
  	"entete_titre" varchar NOT NULL,
  	"entete_intro" varchar,
  	"entete_bulle" varchar DEFAULT '+1 loot',
  	"panier_titre" varchar DEFAULT 'Ton inventaire',
  	"panier_vide_titre" varchar DEFAULT 'Le Kraken a faim',
  	"panier_vide_texte" varchar DEFAULT 'Ton panier est vide. Ajoute un article pour commencer.',
  	"soutien_titre" varchar,
  	"soutien_texte" varchar,
  	"soutien_bouton" varchar DEFAULT 'Faire un don',
  	"confirmation_titre" varchar DEFAULT 'GG, commande validée !',
  	"confirmation_texte" varchar,
  	"colissimo_actif" boolean DEFAULT true,
  	"colissimo_prix" numeric DEFAULT 6.5,
  	"colissimo_delai" varchar DEFAULT 'sous 5 à 7 jours',
  	"retrait_actif" boolean DEFAULT true,
  	"retrait_texte" varchar DEFAULT 'Gratuit. À récupérer pendant le Krakython ou à La Rochelle : on t’écrit pour convenir du moment.',
  	"arrondi_actif" boolean DEFAULT true,
  	"arrondi_titre" varchar DEFAULT 'Ajouter un don à ma commande',
  	"arrondi_texte" varchar DEFAULT 'Arrondi aux 5 € supérieurs, reversé à la Fédération Leucémie Espoir',
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "evenement_cagnotte_paliers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"montant" numeric NOT NULL,
  	"defi" varchar NOT NULL
  );
  
  CREATE TABLE "evenement" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"edition" varchar NOT NULL,
  	"duree" varchar DEFAULT '51 h' NOT NULL,
  	"dates_debut" timestamp(3) with time zone,
  	"dates_fin" timestamp(3) with time zone,
  	"dates_libelle" varchar DEFAULT 'Dates bientôt annoncées' NOT NULL,
  	"lien_don" varchar NOT NULL,
  	"don_direct" boolean DEFAULT false,
  	"cagnotte_montant" numeric DEFAULT 0,
  	"cagnotte_objectif" numeric DEFAULT 5000,
  	"cagnotte_statut" varchar DEFAULT 'Mise à jour pendant le live',
  	"annonce_actif" boolean DEFAULT true,
  	"annonce_texte" varchar,
  	"annonce_lien_texte" varchar,
  	"annonce_lien" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nom_asso" varchar DEFAULT 'Association Krakython' NOT NULL,
  	"email" varchar,
  	"reseaux_twitch" varchar DEFAULT 'https://www.twitch.tv/krakython' NOT NULL,
  	"reseaux_instagram" varchar,
  	"reseaux_facebook" varchar,
  	"reseaux_x" varchar,
  	"reseaux_youtube" varchar,
  	"beneficiaire_nom" varchar DEFAULT 'Fédération Leucémie Espoir' NOT NULL,
  	"beneficiaire_logo_id" integer,
  	"beneficiaire_texte" varchar,
  	"beneficiaire_lien" varchar DEFAULT 'https://www.leucemie-espoir.org',
  	"lien_moelle" varchar DEFAULT 'https://www.dondemoelleosseuse.fr',
  	"pied_texte" varchar,
  	"pied_alerte_titre" varchar DEFAULT 'Reçois l’alerte du prochain live',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "actualites" ADD CONSTRAINT "actualites_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "actualites" ADD CONSTRAINT "actualites_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "membres_tags" ADD CONSTRAINT "membres_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."membres"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "membres" ADD CONSTRAINT "membres_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partenaires_liens" ADD CONSTRAINT "partenaires_liens_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partenaires"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partenaires" ADD CONSTRAINT "partenaires_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "presse_videos" ADD CONSTRAINT "presse_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."presse"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "produits_tailles" ADD CONSTRAINT "produits_tailles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."produits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "produits" ADD CONSTRAINT "produits_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "produits_rels" ADD CONSTRAINT "produits_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."produits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "produits_rels" ADD CONSTRAINT "produits_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "commandes_lignes" ADD CONSTRAINT "commandes_lignes_produit_id_produits_id_fk" FOREIGN KEY ("produit_id") REFERENCES "public"."produits"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "commandes_lignes" ADD CONSTRAINT "commandes_lignes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."commandes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_actualites_fk" FOREIGN KEY ("actualites_id") REFERENCES "public"."actualites"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_membres_fk" FOREIGN KEY ("membres_id") REFERENCES "public"."membres"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_editions_fk" FOREIGN KEY ("editions_id") REFERENCES "public"."editions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partenaires_fk" FOREIGN KEY ("partenaires_id") REFERENCES "public"."partenaires"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_presse_fk" FOREIGN KEY ("presse_id") REFERENCES "public"."presse"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_produits_fk" FOREIGN KEY ("produits_id") REFERENCES "public"."produits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_commandes_fk" FOREIGN KEY ("commandes_id") REFERENCES "public"."commandes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_messages_fk" FOREIGN KEY ("messages_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_abonnes_fk" FOREIGN KEY ("abonnes_id") REFERENCES "public"."abonnes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil_hero_garanties" ADD CONSTRAINT "accueil_hero_garanties_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accueil"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil_defile" ADD CONSTRAINT "accueil_defile_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accueil"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil_cagnotte_chiffres" ADD CONSTRAINT "accueil_cagnotte_chiffres_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accueil"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil_max_fiche_infos" ADD CONSTRAINT "accueil_max_fiche_infos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accueil"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil_programme_items" ADD CONSTRAINT "accueil_programme_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accueil"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil_classes_items" ADD CONSTRAINT "accueil_classes_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accueil"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil_live_videos" ADD CONSTRAINT "accueil_live_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accueil"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil" ADD CONSTRAINT "accueil_max_fiche_photo_id_media_id_fk" FOREIGN KEY ("max_fiche_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "accueil" ADD CONSTRAINT "accueil_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "qui_sommes_nous_nom_chiffres" ADD CONSTRAINT "qui_sommes_nous_nom_chiffres_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."qui_sommes_nous"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "qui_sommes_nous" ADD CONSTRAINT "qui_sommes_nous_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_actualites" ADD CONSTRAINT "page_actualites_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_presse_kit_telechargements" ADD CONSTRAINT "page_presse_kit_telechargements_fichier_id_media_id_fk" FOREIGN KEY ("fichier_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_presse_kit_telechargements" ADD CONSTRAINT "page_presse_kit_telechargements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_presse"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_presse_kit_en_bref_lignes" ADD CONSTRAINT "page_presse_kit_en_bref_lignes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_presse"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_presse_kit_en_bref_pastilles" ADD CONSTRAINT "page_presse_kit_en_bref_pastilles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_presse"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_presse" ADD CONSTRAINT "page_presse_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_partenaires_beneficiaire_missions" ADD CONSTRAINT "page_partenaires_beneficiaire_missions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_partenaires"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_partenaires_beneficiaire_scores_lignes" ADD CONSTRAINT "page_partenaires_beneficiaire_scores_lignes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_partenaires"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_partenaires_devenir_modes" ADD CONSTRAINT "page_partenaires_devenir_modes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_partenaires"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_partenaires_devenir_retours" ADD CONSTRAINT "page_partenaires_devenir_retours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_partenaires"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_partenaires" ADD CONSTRAINT "page_partenaires_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_don_etapes_items" ADD CONSTRAINT "page_don_etapes_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_don"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_don_etapes_garanties" ADD CONSTRAINT "page_don_etapes_garanties_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_don"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_don_test_montants" ADD CONSTRAINT "page_don_test_montants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_don"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_don_destination_items" ADD CONSTRAINT "page_don_destination_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_don"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_don" ADD CONSTRAINT "page_don_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_boutique_entete_badges" ADD CONSTRAINT "page_boutique_entete_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_boutique"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_boutique" ADD CONSTRAINT "page_boutique_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "evenement_cagnotte_paliers" ADD CONSTRAINT "evenement_cagnotte_paliers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."evenement"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site" ADD CONSTRAINT "site_beneficiaire_logo_id_media_id_fk" FOREIGN KEY ("beneficiaire_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "actualites_slug_idx" ON "actualites" USING btree ("slug");
  CREATE INDEX "actualites_image_idx" ON "actualites" USING btree ("image_id");
  CREATE INDEX "actualites_meta_meta_image_idx" ON "actualites" USING btree ("meta_image_id");
  CREATE INDEX "actualites_updated_at_idx" ON "actualites" USING btree ("updated_at");
  CREATE INDEX "actualites_created_at_idx" ON "actualites" USING btree ("created_at");
  CREATE INDEX "membres_tags_order_idx" ON "membres_tags" USING btree ("_order");
  CREATE INDEX "membres_tags_parent_id_idx" ON "membres_tags" USING btree ("_parent_id");
  CREATE INDEX "membres_photo_idx" ON "membres" USING btree ("photo_id");
  CREATE INDEX "membres_updated_at_idx" ON "membres" USING btree ("updated_at");
  CREATE INDEX "membres_created_at_idx" ON "membres" USING btree ("created_at");
  CREATE INDEX "editions_updated_at_idx" ON "editions" USING btree ("updated_at");
  CREATE INDEX "editions_created_at_idx" ON "editions" USING btree ("created_at");
  CREATE INDEX "partenaires_liens_order_idx" ON "partenaires_liens" USING btree ("_order");
  CREATE INDEX "partenaires_liens_parent_id_idx" ON "partenaires_liens" USING btree ("_parent_id");
  CREATE INDEX "partenaires_logo_idx" ON "partenaires" USING btree ("logo_id");
  CREATE INDEX "partenaires_updated_at_idx" ON "partenaires" USING btree ("updated_at");
  CREATE INDEX "partenaires_created_at_idx" ON "partenaires" USING btree ("created_at");
  CREATE INDEX "presse_videos_order_idx" ON "presse_videos" USING btree ("_order");
  CREATE INDEX "presse_videos_parent_id_idx" ON "presse_videos" USING btree ("_parent_id");
  CREATE INDEX "presse_updated_at_idx" ON "presse" USING btree ("updated_at");
  CREATE INDEX "presse_created_at_idx" ON "presse" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_miniature_sizes_miniature_filename_idx" ON "media" USING btree ("sizes_miniature_filename");
  CREATE INDEX "media_sizes_carte_sizes_carte_filename_idx" ON "media" USING btree ("sizes_carte_filename");
  CREATE INDEX "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE INDEX "produits_tailles_order_idx" ON "produits_tailles" USING btree ("_order");
  CREATE INDEX "produits_tailles_parent_id_idx" ON "produits_tailles" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "produits_slug_idx" ON "produits" USING btree ("slug");
  CREATE INDEX "produits_meta_meta_image_idx" ON "produits" USING btree ("meta_image_id");
  CREATE INDEX "produits_updated_at_idx" ON "produits" USING btree ("updated_at");
  CREATE INDEX "produits_created_at_idx" ON "produits" USING btree ("created_at");
  CREATE INDEX "produits_rels_order_idx" ON "produits_rels" USING btree ("order");
  CREATE INDEX "produits_rels_parent_idx" ON "produits_rels" USING btree ("parent_id");
  CREATE INDEX "produits_rels_path_idx" ON "produits_rels" USING btree ("path");
  CREATE INDEX "produits_rels_media_id_idx" ON "produits_rels" USING btree ("media_id");
  CREATE INDEX "commandes_lignes_order_idx" ON "commandes_lignes" USING btree ("_order");
  CREATE INDEX "commandes_lignes_parent_id_idx" ON "commandes_lignes" USING btree ("_parent_id");
  CREATE INDEX "commandes_lignes_produit_idx" ON "commandes_lignes" USING btree ("produit_id");
  CREATE UNIQUE INDEX "commandes_numero_idx" ON "commandes" USING btree ("numero");
  CREATE INDEX "commandes_statut_idx" ON "commandes" USING btree ("statut");
  CREATE INDEX "commandes_client_email_idx" ON "commandes" USING btree ("client_email");
  CREATE UNIQUE INDEX "commandes_paiement_paiement_session_id_idx" ON "commandes" USING btree ("paiement_session_id");
  CREATE INDEX "commandes_updated_at_idx" ON "commandes" USING btree ("updated_at");
  CREATE INDEX "commandes_created_at_idx" ON "commandes" USING btree ("created_at");
  CREATE INDEX "messages_updated_at_idx" ON "messages" USING btree ("updated_at");
  CREATE INDEX "messages_created_at_idx" ON "messages" USING btree ("created_at");
  CREATE UNIQUE INDEX "abonnes_email_idx" ON "abonnes" USING btree ("email");
  CREATE INDEX "abonnes_updated_at_idx" ON "abonnes" USING btree ("updated_at");
  CREATE INDEX "abonnes_created_at_idx" ON "abonnes" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_actualites_id_idx" ON "payload_locked_documents_rels" USING btree ("actualites_id");
  CREATE INDEX "payload_locked_documents_rels_membres_id_idx" ON "payload_locked_documents_rels" USING btree ("membres_id");
  CREATE INDEX "payload_locked_documents_rels_editions_id_idx" ON "payload_locked_documents_rels" USING btree ("editions_id");
  CREATE INDEX "payload_locked_documents_rels_partenaires_id_idx" ON "payload_locked_documents_rels" USING btree ("partenaires_id");
  CREATE INDEX "payload_locked_documents_rels_presse_id_idx" ON "payload_locked_documents_rels" USING btree ("presse_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_produits_id_idx" ON "payload_locked_documents_rels" USING btree ("produits_id");
  CREATE INDEX "payload_locked_documents_rels_commandes_id_idx" ON "payload_locked_documents_rels" USING btree ("commandes_id");
  CREATE INDEX "payload_locked_documents_rels_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("messages_id");
  CREATE INDEX "payload_locked_documents_rels_abonnes_id_idx" ON "payload_locked_documents_rels" USING btree ("abonnes_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "accueil_hero_garanties_order_idx" ON "accueil_hero_garanties" USING btree ("_order");
  CREATE INDEX "accueil_hero_garanties_parent_id_idx" ON "accueil_hero_garanties" USING btree ("_parent_id");
  CREATE INDEX "accueil_defile_order_idx" ON "accueil_defile" USING btree ("_order");
  CREATE INDEX "accueil_defile_parent_id_idx" ON "accueil_defile" USING btree ("_parent_id");
  CREATE INDEX "accueil_cagnotte_chiffres_order_idx" ON "accueil_cagnotte_chiffres" USING btree ("_order");
  CREATE INDEX "accueil_cagnotte_chiffres_parent_id_idx" ON "accueil_cagnotte_chiffres" USING btree ("_parent_id");
  CREATE INDEX "accueil_max_fiche_infos_order_idx" ON "accueil_max_fiche_infos" USING btree ("_order");
  CREATE INDEX "accueil_max_fiche_infos_parent_id_idx" ON "accueil_max_fiche_infos" USING btree ("_parent_id");
  CREATE INDEX "accueil_programme_items_order_idx" ON "accueil_programme_items" USING btree ("_order");
  CREATE INDEX "accueil_programme_items_parent_id_idx" ON "accueil_programme_items" USING btree ("_parent_id");
  CREATE INDEX "accueil_classes_items_order_idx" ON "accueil_classes_items" USING btree ("_order");
  CREATE INDEX "accueil_classes_items_parent_id_idx" ON "accueil_classes_items" USING btree ("_parent_id");
  CREATE INDEX "accueil_live_videos_order_idx" ON "accueil_live_videos" USING btree ("_order");
  CREATE INDEX "accueil_live_videos_parent_id_idx" ON "accueil_live_videos" USING btree ("_parent_id");
  CREATE INDEX "accueil_max_fiche_max_fiche_photo_idx" ON "accueil" USING btree ("max_fiche_photo_id");
  CREATE INDEX "accueil_meta_meta_image_idx" ON "accueil" USING btree ("meta_image_id");
  CREATE INDEX "qui_sommes_nous_nom_chiffres_order_idx" ON "qui_sommes_nous_nom_chiffres" USING btree ("_order");
  CREATE INDEX "qui_sommes_nous_nom_chiffres_parent_id_idx" ON "qui_sommes_nous_nom_chiffres" USING btree ("_parent_id");
  CREATE INDEX "qui_sommes_nous_meta_meta_image_idx" ON "qui_sommes_nous" USING btree ("meta_image_id");
  CREATE INDEX "page_actualites_meta_meta_image_idx" ON "page_actualites" USING btree ("meta_image_id");
  CREATE INDEX "page_presse_kit_telechargements_order_idx" ON "page_presse_kit_telechargements" USING btree ("_order");
  CREATE INDEX "page_presse_kit_telechargements_parent_id_idx" ON "page_presse_kit_telechargements" USING btree ("_parent_id");
  CREATE INDEX "page_presse_kit_telechargements_fichier_idx" ON "page_presse_kit_telechargements" USING btree ("fichier_id");
  CREATE INDEX "page_presse_kit_en_bref_lignes_order_idx" ON "page_presse_kit_en_bref_lignes" USING btree ("_order");
  CREATE INDEX "page_presse_kit_en_bref_lignes_parent_id_idx" ON "page_presse_kit_en_bref_lignes" USING btree ("_parent_id");
  CREATE INDEX "page_presse_kit_en_bref_pastilles_order_idx" ON "page_presse_kit_en_bref_pastilles" USING btree ("_order");
  CREATE INDEX "page_presse_kit_en_bref_pastilles_parent_id_idx" ON "page_presse_kit_en_bref_pastilles" USING btree ("_parent_id");
  CREATE INDEX "page_presse_meta_meta_image_idx" ON "page_presse" USING btree ("meta_image_id");
  CREATE INDEX "page_partenaires_beneficiaire_missions_order_idx" ON "page_partenaires_beneficiaire_missions" USING btree ("_order");
  CREATE INDEX "page_partenaires_beneficiaire_missions_parent_id_idx" ON "page_partenaires_beneficiaire_missions" USING btree ("_parent_id");
  CREATE INDEX "page_partenaires_beneficiaire_scores_lignes_order_idx" ON "page_partenaires_beneficiaire_scores_lignes" USING btree ("_order");
  CREATE INDEX "page_partenaires_beneficiaire_scores_lignes_parent_id_idx" ON "page_partenaires_beneficiaire_scores_lignes" USING btree ("_parent_id");
  CREATE INDEX "page_partenaires_devenir_modes_order_idx" ON "page_partenaires_devenir_modes" USING btree ("_order");
  CREATE INDEX "page_partenaires_devenir_modes_parent_id_idx" ON "page_partenaires_devenir_modes" USING btree ("_parent_id");
  CREATE INDEX "page_partenaires_devenir_retours_order_idx" ON "page_partenaires_devenir_retours" USING btree ("_order");
  CREATE INDEX "page_partenaires_devenir_retours_parent_id_idx" ON "page_partenaires_devenir_retours" USING btree ("_parent_id");
  CREATE INDEX "page_partenaires_meta_meta_image_idx" ON "page_partenaires" USING btree ("meta_image_id");
  CREATE INDEX "page_don_etapes_items_order_idx" ON "page_don_etapes_items" USING btree ("_order");
  CREATE INDEX "page_don_etapes_items_parent_id_idx" ON "page_don_etapes_items" USING btree ("_parent_id");
  CREATE INDEX "page_don_etapes_garanties_order_idx" ON "page_don_etapes_garanties" USING btree ("_order");
  CREATE INDEX "page_don_etapes_garanties_parent_id_idx" ON "page_don_etapes_garanties" USING btree ("_parent_id");
  CREATE INDEX "page_don_test_montants_order_idx" ON "page_don_test_montants" USING btree ("_order");
  CREATE INDEX "page_don_test_montants_parent_id_idx" ON "page_don_test_montants" USING btree ("_parent_id");
  CREATE INDEX "page_don_destination_items_order_idx" ON "page_don_destination_items" USING btree ("_order");
  CREATE INDEX "page_don_destination_items_parent_id_idx" ON "page_don_destination_items" USING btree ("_parent_id");
  CREATE INDEX "page_don_meta_meta_image_idx" ON "page_don" USING btree ("meta_image_id");
  CREATE INDEX "page_boutique_entete_badges_order_idx" ON "page_boutique_entete_badges" USING btree ("_order");
  CREATE INDEX "page_boutique_entete_badges_parent_id_idx" ON "page_boutique_entete_badges" USING btree ("_parent_id");
  CREATE INDEX "page_boutique_meta_meta_image_idx" ON "page_boutique" USING btree ("meta_image_id");
  CREATE INDEX "evenement_cagnotte_paliers_order_idx" ON "evenement_cagnotte_paliers" USING btree ("_order");
  CREATE INDEX "evenement_cagnotte_paliers_parent_id_idx" ON "evenement_cagnotte_paliers" USING btree ("_parent_id");
  CREATE INDEX "site_beneficiaire_beneficiaire_logo_idx" ON "site" USING btree ("beneficiaire_logo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "actualites" CASCADE;
  DROP TABLE "membres_tags" CASCADE;
  DROP TABLE "membres" CASCADE;
  DROP TABLE "editions" CASCADE;
  DROP TABLE "partenaires_liens" CASCADE;
  DROP TABLE "partenaires" CASCADE;
  DROP TABLE "presse_videos" CASCADE;
  DROP TABLE "presse" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "produits_tailles" CASCADE;
  DROP TABLE "produits" CASCADE;
  DROP TABLE "produits_rels" CASCADE;
  DROP TABLE "commandes_lignes" CASCADE;
  DROP TABLE "commandes" CASCADE;
  DROP TABLE "messages" CASCADE;
  DROP TABLE "abonnes" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "accueil_hero_garanties" CASCADE;
  DROP TABLE "accueil_defile" CASCADE;
  DROP TABLE "accueil_cagnotte_chiffres" CASCADE;
  DROP TABLE "accueil_max_fiche_infos" CASCADE;
  DROP TABLE "accueil_programme_items" CASCADE;
  DROP TABLE "accueil_classes_items" CASCADE;
  DROP TABLE "accueil_live_videos" CASCADE;
  DROP TABLE "accueil" CASCADE;
  DROP TABLE "qui_sommes_nous_nom_chiffres" CASCADE;
  DROP TABLE "qui_sommes_nous" CASCADE;
  DROP TABLE "page_actualites" CASCADE;
  DROP TABLE "page_presse_kit_telechargements" CASCADE;
  DROP TABLE "page_presse_kit_en_bref_lignes" CASCADE;
  DROP TABLE "page_presse_kit_en_bref_pastilles" CASCADE;
  DROP TABLE "page_presse" CASCADE;
  DROP TABLE "page_partenaires_beneficiaire_missions" CASCADE;
  DROP TABLE "page_partenaires_beneficiaire_scores_lignes" CASCADE;
  DROP TABLE "page_partenaires_devenir_modes" CASCADE;
  DROP TABLE "page_partenaires_devenir_retours" CASCADE;
  DROP TABLE "page_partenaires" CASCADE;
  DROP TABLE "page_don_etapes_items" CASCADE;
  DROP TABLE "page_don_etapes_garanties" CASCADE;
  DROP TABLE "page_don_test_montants" CASCADE;
  DROP TABLE "page_don_destination_items" CASCADE;
  DROP TABLE "page_don" CASCADE;
  DROP TABLE "mentions_legales" CASCADE;
  DROP TABLE "cgv" CASCADE;
  DROP TABLE "confidentialite" CASCADE;
  DROP TABLE "page_boutique_entete_badges" CASCADE;
  DROP TABLE "page_boutique" CASCADE;
  DROP TABLE "evenement_cagnotte_paliers" CASCADE;
  DROP TABLE "evenement" CASCADE;
  DROP TABLE "site" CASCADE;
  DROP TYPE "public"."enum_actualites_categorie";
  DROP TYPE "public"."enum_membres_statut";
  DROP TYPE "public"."enum_presse_rubrique";
  DROP TYPE "public"."enum_produits_categorie";
  DROP TYPE "public"."enum_produits_illustration";
  DROP TYPE "public"."enum_produits_fond";
  DROP TYPE "public"."enum_commandes_statut";
  DROP TYPE "public"."enum_commandes_livraison_mode";
  DROP TYPE "public"."enum_commandes_annulee_par";
  DROP TYPE "public"."enum_messages_sujet";
  DROP TYPE "public"."enum_accueil_cagnotte_chiffres_couleur";
  DROP TYPE "public"."enum_accueil_programme_items_icone";
  DROP TYPE "public"."enum_accueil_classes_items_icone";
  DROP TYPE "public"."enum_accueil_classes_items_couleur";
  DROP TYPE "public"."enum_page_partenaires_devenir_modes_icone";
  DROP TYPE "public"."enum_page_don_destination_items_icone";
  DROP TYPE "public"."enum_page_boutique_entete_badges_icone";`)
}
