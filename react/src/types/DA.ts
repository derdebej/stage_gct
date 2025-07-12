import { Art } from "./Art";

export interface DA {
  id_da: number;
  objet: string;
  titre: string;
  demandeur: string;
  nature: 'investissement' | 'exploitation';
  num_aed: string;
  statut: 'Traité' | 'En Attente' | 'Non Traité';
  date_creation: string; // or Date, depending on how you use it
  montant_estime: string;
  id_utilisateur: number;
  id_consultation: number;
  chemin_da: string;
  nbre: number;
  Articles: Art[];
}
