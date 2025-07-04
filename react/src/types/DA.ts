export interface DA {
  id: string;
  titre: string;
  date: string;
  lots: number;
  prix: string;
  statut: 'Traité' | 'En Attente' | 'Non Traité';
}