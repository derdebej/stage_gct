export interface OffreType {
  id: string;
  fournisseur: string;
  dateSoumission: string;
  montant: number;
  delaiLivraison: string;
  conditionsPaiement: string;
  statut: "Acceptée" | "En attente" | "Rejetée";
}
