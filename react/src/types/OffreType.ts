export interface OffreType {
  id_offre: string;
  id_fournisseur: string;
  date_d_offre: string;
  montant: number;
  id_consultation: string;
  chemin_document: string;
  statut: "Acceptée" | "En attente" | "Rejetée";
}
