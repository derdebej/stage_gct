export interface OffreType {
  id_offre: string;
  id_fournisseur: string;
  date_offre: string;
  montant: number;
  chemin_document: string;
  fournisseur?: {
    nom: string;
    id_fournisseur:string;
  };
  id_consultation: string;
}
