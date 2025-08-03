export interface OffreType {
  id_offre: string;
  id_fournisseur: string;
  date_offre: string;
  montant: number;
  chemin_document: string;
  statut: "Acceptée" | "En attente" | "Rejetée";
  fournisseur?: {
    nom: string;
    id_fournisseur:string;
  };
}
