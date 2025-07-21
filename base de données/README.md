# 📦 README — Base de Données Achat & Consultation

Ce document présente la structure fonctionnelle de la base de données utilisée pour la gestion des **demandes d’achats**, **consultations**, **offres fournisseurs**, **évaluations**, et le **suivi logistique** (commandes, bons de sortie, réceptions).

Le diagramme relationnel fourni illustre visuellement les connexions entre les entités décrites ci-dessous.

---

## 📁 Tables principales et leur rôle

### ✅ utilisateur
Représente les utilisateurs du système (demandeurs, responsables, etc.).

### ✅ demande_d_achat
Contient les demandes d’achat créées par les utilisateurs. Une demande peut être composée de plusieurs lots et articles.

### ✅ lot
Regroupe un ensemble d’articles devant être consultés ensemble. Chaque lot appartient à une demande d’achat.

### ✅ article
Articles à acheter, associés à une demande d’achat et éventuellement à un lot. 

### ✅ consultation
Représente le lancement d'une consultation (appel d’offre) pour un ou plusieurs lots.

### ✅ fournisseur
Enregistre les fournisseurs susceptibles de répondre aux consultations.

### ✅ offre
Offres déposées par les fournisseurs pour répondre à une ou plusieurs consultations.

### ✅ offre_lot
Table d'association permettant à un fournisseur de proposer une offre sur plusieurs lots.

### ✅ evaluation
Résultat de l’analyse des offres : conformité, justification, etc.

### ✅ decision
Table de traçabilité enregistrant pour chaque lot l’offre **retenue automatiquement** (la moins chère parmi les conformes).

### ✅ commande
Représente la commande envoyée suite à une décision retenue.

### ✅ bon_sortie
Autorisation de sortie logistique suite à la commande.

### ✅ reception
Enregistrement de la réception des articles ou services livrés.

---

## 🔄 Relations entre entités (résumé)

- Un **utilisateur** crée une **demande d’achat**
- Une **demande d’achat** contient plusieurs **lots** et **articles**
- Chaque **lot** peut faire l’objet d’une **consultation**
- Plusieurs **fournisseurs** soumettent des **offres** pour un ou plusieurs **lots**
- Chaque **offre** est évaluée et notée dans une **évaluation**
- La **décision** est automatiquement prise : l’offre conforme avec le **prix le plus bas** est retenue
- Une **commande** est émise pour l’offre retenue
- Un **bon de sortie** est généré pour autoriser la livraison
- Une **réception** est enregistrée une fois les articles livrés

---

## 🧠 Décision automatique

La sélection de l’offre retenue se fait automatiquement selon la logique :

1. Filtrer les offres avec une **évaluation conforme**
2. Choisir celle ayant le **prix total le plus bas**
3. Enregistrer la décision dans la table `decision` pour la **traçabilité**

---

## 📎 Pièces jointes

- Les fichiers de la DA, offres, et évaluations sont enregistrés dans le système sous forme de **chemins de fichiers**.

---

## 📌 Remarques

- Le diagramme joint complète ce README avec une vue relationnelle claire.
- La base respecte les contraintes d’intégrité référentielle via des **clés étrangères**.
- Ce système est conçu pour être automatisable, traçable, et conforme aux exigences d’un processus d’achat public ou privé.

---

## 📊 Flux global

1. Demande d’achat créée
2. Création des lots et articles
3. Consultation lancée
4. Réception des offres
5. Évaluation des offres
6. Décision automatique (offre conforme la moins chère)
7. Commande émise
8. Bon de sortie généré
9. Réception confirmée
