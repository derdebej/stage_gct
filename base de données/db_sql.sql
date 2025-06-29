
CREATE TABLE utilisateur (
    id_utilisateur INT PRIMARY KEY AUTO_INCREMENT ,
    nom VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    role VARCHAR(100),
    mdp VARCHAR(255)
);
CREATE TABLE Article (
    id_article INT PRIMARY KEY AUTO_INCREMENT ,
    designation TEXT,
    description TEXT,
    pu INT,
    quantite INT,
);
CREATE TABLE Consultation (
    id_consultation INT PRIMARY KEY AUTO_INCREMENT ,
    date DATE,
    id_responsable INT,
    nbre INT,
    id_lot INT,
    FOREIGN KEY (id_lot) REFERENCES lot(id_lot)
    FOREIGN KEY (id_responsable) REFERENCES utilisateur(id_utilisateur)
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
    nbre INT,
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur),
    FOREIGN KEY (id_consultation) REFERENCES Consultation(id_consultation)
);
CREATE TABLE lot (
    id_lot INT PRIMARY KEY AUTO_INCREMENT ,
    id_da INT,
    id_article INT,
    FOREIGN KEY (id_da) REFERENCES demande_d_achat(id_da),
    FOREIGN KEY (id_article) REFERENCES Article(id_article)
);
CREATE TABLE fournisseur (
    id_fournisseur INT PRIMARY KEY AUTO_INCREMENT ,
    nom VARCHAR(255),
    contact VARCHAR(255)
);
CREATE TABLE offre (
    id_offre INT PRIMARY KEY AUTO_INCREMENT ,
    id_consultation INT,
    id_fournisseur INT,
    date_d_offre DATE,
    chemin_document TEXT,
    FOREIGN KEY (id_consultation) REFERENCES Consultation(id_consultation),
    FOREIGN KEY (id_fournisseur) REFERENCES fournisseur(id_fournisseur)
);
CREATE TABLE offre_lot (
    id_offre INT,
    id_lot INT,
    FOREIGN KEY (id_offre) REFERENCES offre,
    FOREIGN KEY (id_lot) REFERENCES lot
);
CREATE TABLE evaluation (
    id_eval INT PRIMARY KEY AUTO_INCREMENT ,
    id_offre INT,
    id_lot INT,
    chemin_evaluation TEXT,
    etat BOOLEAN DEFAULT FALSE,
    date date,
    conformite BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_offre) REFERENCES offre_lot(id_offre)
    FOREIGN KEY (id_lot) REFERENCES offre_lot_lot(id_lot)
);
CREATE TABLE decision (
    id_decision INT PRIMARY KEY AUTO_INCREMENT ,
    id_lot INT UNIQUE,
    id_fournisseur INT,
    id_eval INT,
    FOREIGN KEY (id_lot) REFERENCES lot(id_lot),
    FOREIGN KEY (id_fournisseur) REFERENCES fournisseur(id_fournisseur),
    FOREIGN KEY (id_eval) REFERENCES evaluation(id_eval)
);
CREATE TABLE bon_commande (
    id_bc INT PRIMARY KEY AUTO_INCREMENT ,
    date DATE,
    id_fournisseur INT,
    id_decision INT,
    FOREIGN KEY (id_fournisseur) REFERENCES fournisseur(id_fournisseur),
    FOREIGN KEY (id_decision) REFERENCES decision(id_decision)
);
CREATE TABLE avis_reception (
    id_ar INT PRIMARY KEY AUTO_INCREMENT ,
    id_bc INT,
    date_reception DATE,
    status TEXT,
    FOREIGN KEY (id_bc) REFERENCES bon_commande(id_bc)
);
CREATE TABLE bon_sortie (
    id_bs INT PRIMARY KEY AUTO_INCREMENT ,
    id_ar INT,
    date DATE,
    FOREIGN KEY (id_ar) REFERENCES avis_reception(id_ar)
);
