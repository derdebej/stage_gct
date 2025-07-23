-- ========================
-- Table: utilisateur
-- ========================
CREATE TABLE utilisateur (
    id_utilisateur BIGSERIAL PRIMARY KEY,
    nom VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    mot_de_passe VARCHAR NOT NULL,
    date_de_naissance DATE NOT NULL
);

-- ========================
-- Table: demande_d_achat
-- ========================
CREATE TABLE demande_d_achat (
    id_da VARCHAR PRIMARY KEY,
    id_utilisateur BIGINT NOT NULL REFERENCES utilisateur(id_utilisateur),
    titre VARCHAR NOT NULL,
    date DATE NOT NULL,
    demandeur VARCHAR NOT NULL,
    etat VARCHAR CHECK (etat IN ('En Attente', 'En Cours', 'Traité')),
    montant DOUBLE PRECISION,
    nature VARCHAR CHECK (nature IN ('Investissement', 'Exploitation')),
    objet VARCHAR,
    numAED VARCHAR,
    chemin_document VARCHAR
);

-- ========================
-- Table: lot
-- ========================
CREATE TABLE lot (
    id_lot BIGSERIAL PRIMARY KEY,
    id_da BIGINT NOT NULL REFERENCES demande_d_achat(id_da),
    id_consultation BIGINT NOT NULL REFERENCES consultation(id_consultation)

);

-- ========================
-- Table: article
-- ========================
CREATE TABLE article (
    id_article BIGSERIAL PRIMARY KEY,
    id_da BIGINT NOT NULL REFERENCES demande_d_achat(id_da),
    id_lot BIGINT REFERENCES lot(id_lot),
    designation VARCHAR NOT NULL,
    description TEXT,
    prix_unitaire DOUBLE PRECISION,
    quantite BIGINT NOT NULL
);

-- ========================
-- Table: consultation
-- ========================
CREATE TABLE consultation (
    id_consultation BIGSERIAL PRIMARY KEY,
    id_utilisateur BIGINT NOT NULL REFERENCES utilisateur(id_utilisateur),
    date_creation DATE NOT NULL,
    nombre_des_lots BIGINT
);

-- ========================
-- Table: fournisseur
-- ========================
CREATE TABLE fournisseur (
    id_fournisseur BIGSERIAL PRIMARY KEY,
    nom VARCHAR NOT NULL,
    email VARCHAR,
    num_tel VARCHAR
);

-- ========================
-- Table: offre
-- ========================
CREATE TABLE offre (
    id_offre BIGSERIAL PRIMARY KEY,
    id_fournisseur BIGINT NOT NULL REFERENCES fournisseur(id_fournisseur),
    date_offre DATE NOT NULL,
    chemin_document VARCHAR
);

-- ========================
-- Table: offre_lot (table d'association)
-- ========================
CREATE TABLE offre_lot (
    id_offre BIGINT REFERENCES offre(id_offre) ON DELETE CASCADE,
    id_lot BIGINT REFERENCES lot(id_lot) ON DELETE CASCADE,
    PRIMARY KEY (id_offre, id_lot)
);

-- ========================
-- Table: evaluation
-- ========================
CREATE TABLE evaluation (
    id_eval BIGSERIAL PRIMARY KEY,
    id_offre BIGINT NOT NULL REFERENCES offre(id_offre),
    id_lot BIGINT NOT NULL REFERENCES lot(id_lot),
    conformite BOOLEAN,
    date DATE,
    chemin_document VARCHAR
);

-- ========================
-- Table: commande
-- ========================
CREATE TABLE commande (
    id_commande BIGSERIAL PRIMARY KEY,
    id_offre BIGINT NOT NULL REFERENCES offre(id_offre),
    date DATE NOT NULL,
    statut VARCHAR CHECK (statut IN ('en_cours', 'livree', 'annulee'))
);

-- ========================
-- Table: bon_sortie
-- ========================
CREATE TABLE bon_sortie (
    id_bon_sortie BIGSERIAL PRIMARY KEY,
    id_commande BIGINT NOT NULL REFERENCES commande(id_commande),
    date DATE NOT NULL
);

-- ========================
-- Table: reception
-- ========================
CREATE TABLE reception (
    id_reception BIGSERIAL PRIMARY KEY,
    id_bon_sortie BIGINT NOT NULL REFERENCES bon_sortie(id_bon_sortie),
    date DATE NOT NULL
);

-- ========================
-- Table: decision
-- ========================
CREATE TABLE decision (
    id_decision BIGSERIAL PRIMARY KEY,
    id_lot BIGINT UNIQUE NOT NULL REFERENCES lot(id_lot) ON DELETE CASCADE,
    id_offre BIGINT NOT NULL REFERENCES offre(id_offre),
    id_fournisseur BIGINT NOT NULL REFERENCES fournisseur(id_fournisseur),
    id_eval BIGINT NOT NULL REFERENCES evaluation(id_eval),
    date_decision DATE DEFAULT CURRENT_DATE
);