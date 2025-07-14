CREATE TABLE utilisateur (
    id_utilisateur INT PRIMARY KEY AUTO_INCREMENT ,
    nom VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    role VARCHAR(100),
    mdp VARCHAR(255)
);
CREATE TABLE article (
    id_article INT PRIMARY KEY AUTO_INCREMENT ,
    designation TEXT,
    description TEXT,
    pu INT
);
CREATE TABLE fournisseur (
    id_fournisseur INT PRIMARY KEY AUTO_INCREMENT ,
    nom VARCHAR(255),
    contact VARCHAR(255)
);

CREATE TABLE consultation (
    id_consultation INT PRIMARY KEY AUTO_INCREMENT ,
    date DATE,
    id_responsable INT,
    nbre INT,
    id_lot INT
);

CREATE TABLE demande_d_achat (
    id_da INT PRIMARY KEY  ,
    objet VARCHAR(255),
    titre VARCHAR(255),
    demandeur VARCHAR(255),
    nature ENUM('investissement', 'exploitation'),
    num_aed VARCHAR(50),
    etat BOOLEAN DEFAULT FALSE,
    date_creation DATE,
    montant_estime DECIMAL(12,2),
    id_utilisateur INT,
    id_consultation INT,
    chemin_da VARCHAR(255),
    nbre INT
);
CREATE TABLE lot (
    id_lot INT PRIMARY KEY AUTO_INCREMENT ,
    id_da INT,
    id_article INT,
    quantite INT
);
CREATE TABLE offre (
    id_offre INT PRIMARY KEY AUTO_INCREMENT ,
    id_consultation INT,
    id_fournisseur INT,
    date_d_offre DATE,
    chemin_document TEXT
);
CREATE TABLE offre_lot (
    id_offre INT,
    id_lot INT,
    PRIMARY KEY (id_offre, id_lot)
);
CREATE TABLE evaluation (
    id_eval INT PRIMARY KEY AUTO_INCREMENT ,
    id_offre INT,
    id_lot INT,
    chemin_evaluation TEXT,
    etat BOOLEAN DEFAULT FALSE,
    date DATE,
    conformite BOOLEAN DEFAULT FALSE
);
CREATE TABLE decision (
    id_decision INT PRIMARY KEY AUTO_INCREMENT ,
    id_lot INT UNIQUE,
    id_fournisseur INT,
    id_eval INT
);
CREATE TABLE bon_commande (
    id_bc INT PRIMARY KEY AUTO_INCREMENT ,
    date DATE,
    id_fournisseur INT,
    id_decision INT
);
CREATE TABLE avis_reception (
    id_ar INT PRIMARY KEY AUTO_INCREMENT ,
    id_bc INT,
    date_reception DATE,
    status TEXT
);
CREATE TABLE bon_sortie (
    id_bs INT PRIMARY KEY AUTO_INCREMENT ,
    id_ar INT,
    date DATE
);

ALTER TABLE consultation ADD CONSTRAINT fk_consultation_lot FOREIGN KEY (id_lot) REFERENCES lot(id_lot);
ALTER TABLE consultation ADD CONSTRAINT fk_consultation_responsable FOREIGN KEY (id_responsable) REFERENCES utilisateur(id_utilisateur);
ALTER TABLE demande_d_achat ADD CONSTRAINT fk_da_utilisateur FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur);
ALTER TABLE demande_d_achat ADD CONSTRAINT fk_da_consultation FOREIGN KEY (id_consultation) REFERENCES consultation(id_consultation);
ALTER TABLE lot ADD CONSTRAINT fk_lot_da FOREIGN KEY (id_da) REFERENCES demande_d_achat(id_da);
ALTER TABLE lot ADD CONSTRAINT fk_lot_article FOREIGN KEY (id_article) REFERENCES article(id_article);
ALTER TABLE offre ADD CONSTRAINT fk_offre_consultation FOREIGN KEY (id_consultation) REFERENCES consultation(id_consultation);
ALTER TABLE offre ADD CONSTRAINT fk_offre_fournisseur FOREIGN KEY (id_fournisseur) REFERENCES fournisseur(id_fournisseur);
ALTER TABLE offre_lot ADD CONSTRAINT fk_offre_lot_offre FOREIGN KEY (id_offre) REFERENCES offre(id_offre);
ALTER TABLE offre_lot ADD CONSTRAINT fk_offre_lot_lot FOREIGN KEY (id_lot) REFERENCES lot(id_lot);
ALTER TABLE evaluation ADD CONSTRAINT fk_evaluation_offre FOREIGN KEY (id_offre) REFERENCES offre(id_offre);
ALTER TABLE evaluation ADD CONSTRAINT fk_evaluation_lot FOREIGN KEY (id_lot) REFERENCES lot(id_lot);
ALTER TABLE decision ADD CONSTRAINT fk_decision_lot FOREIGN KEY (id_lot) REFERENCES lot(id_lot);
ALTER TABLE decision ADD CONSTRAINT fk_decision_fournisseur FOREIGN KEY (id_fournisseur) REFERENCES fournisseur(id_fournisseur);
ALTER TABLE decision ADD CONSTRAINT fk_decision_eval FOREIGN KEY (id_eval) REFERENCES evaluation(id_eval);
ALTER TABLE bon_commande ADD CONSTRAINT fk_bc_fournisseur FOREIGN KEY (id_fournisseur) REFERENCES fournisseur(id_fournisseur);
ALTER TABLE bon_commande ADD CONSTRAINT fk_bc_decision FOREIGN KEY (id_decision) REFERENCES decision(id_decision);
ALTER TABLE avis_reception ADD CONSTRAINT fk_ar_bc FOREIGN KEY (id_bc) REFERENCES bon_commande(id_bc);
ALTER TABLE bon_sortie ADD CONSTRAINT fk_bs_ar FOREIGN KEY (id_ar) REFERENCES avis_reception(id_ar);

-- Adding new columns to the article table
ALTER TABLE article
ADD COLUMN id_fournisseur integer,
ADD COLUMN date_achat date;
-- Adding foreign key constraint to the article table
ALTER TABLE article
ADD CONSTRAINT fk_fournisseur
FOREIGN KEY (id_fournisseur)
REFERENCES fournisseur (id_fournisseur);

