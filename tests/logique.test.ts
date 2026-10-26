// Tests unitaires de la logique pure : panier, montants, statuts.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ajouter, changerQuantite, nettoyer, nombreArticles, QUANTITE_MAX, sousTotalCentimes } from '../src/lib/panier/panier'
import { arrondiSolidaire, enCentimes, prixDepuisCentimes } from '../src/lib/boutique/argent'
import { calculerMontants } from '../src/lib/boutique/montants'
import { peutPasser, transitionsPossibles } from '../src/lib/boutique/statuts'
import { fusionner, numeroCommande, resoudre, ErreurCommande } from '../src/lib/boutique/commandes'
import type { Produit } from '../src/payload-types'

const tee = { produitId: 1, slug: 't-shirt', nom: 'T-shirt', tailleId: 'm', taille: 'M', prixCentimes: 2000, illustration: 'tshirt', image: null }

test('panier : ajout, fusion des lignes identiques, plafond de quantité', () => {
  let p = ajouter([], tee)
  p = ajouter(p, tee, 2)
  assert.equal(p.length, 1)
  assert.equal(p[0].quantite, 3)
  p = ajouter(p, { ...tee, tailleId: 'l', taille: 'L' })
  assert.equal(p.length, 2)
  assert.equal(nombreArticles(p), 4)
  assert.equal(sousTotalCentimes(p), 8000)
  p = changerQuantite(p, p[0].cle, 999)
  assert.equal(p[0].quantite, QUANTITE_MAX)
  p = changerQuantite(p, p[0].cle, 0)
  assert.equal(p.length, 1)
})

test('panier : relecture prudente du stockage local', () => {
  assert.deepEqual(nettoyer('pas un tableau'), [])
  const lu = nettoyer([{ ...tee, quantite: 500, cle: 'falsifiee' }, { nom: 'cassé' }, null])
  assert.equal(lu.length, 1)
  assert.equal(lu[0].quantite, QUANTITE_MAX)
  assert.equal(lu[0].cle, '1__m')
})

test('argent : euros ↔ centimes et affichage', () => {
  assert.equal(enCentimes(6.5), 650)
  assert.equal(enCentimes('12,30'), 1230)
  assert.equal(enCentimes(0.1 + 0.2), 30)
  assert.equal(prixDepuisCentimes(2000).replace(/\s/g, ' '), '20 €')
  assert.equal(prixDepuisCentimes(650).replace(/\s/g, ' '), '6,50 €')
})

test('arrondi solidaire : complète aux 5 € supérieurs, 1 € si le compte est rond', () => {
  assert.equal(arrondiSolidaire(2350), 150)
  assert.equal(arrondiSolidaire(2000), 100)
  assert.equal(arrondiSolidaire(2001), 499)
})

test('montants : frais selon le mode, arrondi seulement si actif et coché', () => {
  const reglages = { colissimo: { actif: true, prix: 6.5 }, arrondi: { actif: true } }
  assert.deepEqual(calculerMontants(4000, 'colissimo', reglages, false), { sousTotal: 4000, frais: 650, don: 0, total: 4650 })
  assert.deepEqual(calculerMontants(4000, 'retrait', reglages, true), { sousTotal: 4000, frais: 0, don: 100, total: 4100 })
  assert.equal(calculerMontants(4000, 'colissimo', { ...reglages, arrondi: { actif: false } }, true).don, 0)
  assert.equal(calculerMontants(4000, 'colissimo', reglages, true).total, 5000)
})

test('statuts : pas de retour en arrière, fin selon le mode de livraison', () => {
  assert.deepEqual(transitionsPossibles('en_attente', 'colissimo'), ['payee', 'annulee'])
  assert.ok(peutPasser('payee', 'expediee', 'colissimo'))
  assert.ok(!peutPasser('payee', 'retiree', 'colissimo'))
  assert.ok(peutPasser('preparee', 'retiree', 'retrait'))
  assert.ok(!peutPasser('expediee', 'payee', 'colissimo'))
  assert.ok(!peutPasser('annulee', 'payee', 'retrait'))
})

test('commande : fusion des lignes et prix relus en base', () => {
  assert.deepEqual(fusionner([{ produitId: 1, tailleId: 'm', quantite: 1 }, { produitId: 1, tailleId: 'm', quantite: 2 }]), [{ produitId: 1, tailleId: 'm', quantite: 3 }])
  const produit = { id: 1, nom: 'T-shirt', actif: true, prix: 20, tailles: [{ id: 'm', taille: 'M', stock: 3 }] } as unknown as Produit
  const [l] = resoudre([{ produitId: 1, tailleId: 'm', quantite: 2 }], [produit])
  assert.equal(l.prixCentimes, 2000)
  assert.equal(l.taille, 'M')
  assert.throws(() => resoudre([{ produitId: 1, tailleId: null, quantite: 1 }], [produit]), ErreurCommande)
  assert.throws(() => resoudre([{ produitId: 2, tailleId: null, quantite: 1 }], [produit]), ErreurCommande)
  assert.throws(() => resoudre([{ produitId: 1, tailleId: 'm', quantite: 1 }], [{ ...produit, actif: false }]), ErreurCommande)
  assert.match(numeroCommande(new Date('2026-10-09T12:00:00Z')), /^KK-261009-[A-Z2-9]{4}$/)
})
