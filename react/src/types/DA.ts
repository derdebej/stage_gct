import { Art } from "./Art";

export interface DA {
  id_da: number;
  objet: string;
  titre: string;
  demandeur: string;
  nature: 'Investissement' | 'Exploitation';
  numaed: string;
  etat: 'Traité' | 'En Attente' | 'Non Traité';
  date: string; 
  montant: string;
  id_utilisateur: number;
  id_consultation: number;
  chemin_document: string;
  Articles: Art[];
}
