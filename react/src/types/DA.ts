import { Art } from "./Art";

export interface DA {
  id: string;
  titre: string;
  date: string;
  lots: number;
  prix: string;
  Nature: 'Investisement' | 'Exploitation';
  Demandeur: string;
  cheminFichier: string;
  statut: 'Traité' | 'En Attente' | 'Non Traité';
  Articles: Art [];
}